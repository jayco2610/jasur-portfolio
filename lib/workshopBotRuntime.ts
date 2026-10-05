// Бот заявок Мастерской: связь с Telegram и Upstash.
//
// Логика разговора лежит в lib/workshopBot.ts и только решает, что сделать.
// Здесь эти решения исполняются: запросы к Telegram Bot API и запись в
// Upstash. Токен бота приходит параметром из WORKSHOP_BOT_TOKEN и никуда не
// пишется: ни в ответы, ни в журнал.
//
// Что лежит в Upstash:
//   wsbot:admin          chat_id админа (Жасура), появляется после его /start
//   wsbot:state:<chat>   состояние разговора, живёт 7 дней
//   wsbot:leads          все заявки, JSON, новые в начале списка; телефон
//                        лежит внутри заявки, /delete стирает его вместе с ней
//   wsbot:count          счётчик для номера «Заявка №7»
//   wsbot:pending        номера заявок, которые ещё не дошли до админа
//
// Запросы резюме из анкеты на «Обо мне» (app/api/resume-request) приходят
// Жасуру через этого же бота. Проверка полей и тексты в lib/resumeRequest.ts.
//   resume:requests      все запросы, JSON, новые в начале списка
//   resume:count         счётчик для номера «Запрос резюме №3»
//   resume:pending       номера запросов, которые ещё не дошли до админа;
//                        уходят ему при /start вместе с заявками Мастерской

import { createHash, timingSafeEqual } from "node:crypto";
import {
  getString,
  setString,
  deleteKeys,
  incr,
  pushToList,
  appendToList,
  listRange,
  listLength,
  removeFromList,
} from "@/lib/upstash";
import {
  COMMANDS,
  STATE_TTL_SECONDS,
  formatDeletedNotice,
  formatLeadForAdmin,
  formatLeadsList,
  formatPendingIntro,
  parseLead,
  parseState,
  type Button,
  type Effect,
  type ReplyButton,
  type Lead,
  type State,
} from "@/lib/workshopBot";
import {
  formatResumeForAdmin,
  formatResumeList,
  formatResumePendingIntro,
  parseResumeRecord,
  type ResumeDraft,
  type ResumeRequest,
} from "@/lib/resumeRequest";

// Адрес сайта прописан константой, как SITE в других файлах. Брать его из
// запроса нельзя: вызов setup с превью-сборки увёл бы вебхук на превью.
export const WEBHOOK_URL = "https://jasur-portfolio-pied.vercel.app/api/workshop-bot";

const KEY = {
  admin: "wsbot:admin",
  state: (chatId: number) => `wsbot:state:${chatId}`,
  leads: "wsbot:leads",
  count: "wsbot:count",
  pending: "wsbot:pending",
  resumes: "resume:requests",
  resumeCount: "resume:count",
  resumePending: "resume:pending",
};

// ——— секрет вебхука ———

// Секрет выводится из токена: первые 32 знака SHA-256. Хранить отдельную
// переменную не нужно, а без токена секрет не подобрать. Telegram кладёт его
// в заголовок X-Telegram-Bot-Api-Secret-Token каждого обновления.
export function webhookSecret(token: string): string {
  return createHash("sha256").update(token).digest("hex").slice(0, 32);
}

export function secretMatches(header: string | null, token: string): boolean {
  if (!header) return false;
  const a = Buffer.from(header);
  const b = Buffer.from(webhookSecret(token));
  return a.length === b.length && timingSafeEqual(a, b);
}

// ——— Telegram ———

export type TgResult<T = unknown> = { ok: boolean; result?: T; description?: string };

export async function tg<T = unknown>(
  token: string,
  method: string,
  params?: Record<string, unknown>
): Promise<TgResult<T>> {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params ?? {}),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as TgResult<T>;
    if (!data.ok) console.error(`workshop-bot: ${method} failed: ${data.description ?? res.status}`);
    return data;
  } catch (e) {
    // Текст ошибки fetch может содержать адрес запроса, а в адресе токен.
    // Поэтому в журнал идёт только имя метода и тип ошибки.
    const kind = e instanceof Error ? e.name : "unknown";
    console.error(`workshop-bot: ${method} threw ${kind}`);
    return { ok: false, description: `request failed (${kind})` };
  }
}

type MarkupOpts = { buttons?: Button[][]; replyKeyboard?: ReplyButton[][]; removeKeyboard?: boolean };

// У сообщения Telegram одна разметка: кнопки под сообщением, клавиатура
// ответа под полем ввода или команда убрать эту клавиатуру.
function markup(opts: MarkupOpts) {
  if (opts.buttons) {
    return {
      inline_keyboard: opts.buttons.map((row) =>
        row.map((b) => (b.url ? { text: b.text, url: b.url } : { text: b.text, callback_data: b.data }))
      ),
    };
  }
  if (opts.replyKeyboard) {
    // one_time_keyboard: после нажатия клавиатура сворачивается, а
    // следующее сообщение бота убирает её совсем (remove_keyboard).
    return {
      keyboard: opts.replyKeyboard.map((row) =>
        row.map((b) => (b.requestContact ? { text: b.text, request_contact: true } : { text: b.text }))
      ),
      resize_keyboard: true,
      one_time_keyboard: true,
    };
  }
  if (opts.removeKeyboard) return { remove_keyboard: true };
  return undefined;
}

async function sendMessage(
  token: string,
  chatId: number,
  text: string,
  opts: { html?: boolean } & MarkupOpts = {}
): Promise<boolean> {
  const reply_markup = markup(opts);
  const r = await tg(token, "sendMessage", {
    chat_id: chatId,
    text,
    ...(opts.html ? { parse_mode: "HTML" } : {}),
    ...(reply_markup ? { reply_markup } : {}),
    link_preview_options: { is_disabled: true },
  });
  return r.ok;
}

export async function setAdminCommands(token: string, chatId: number): Promise<boolean> {
  const r = await tg(token, "setMyCommands", {
    commands: COMMANDS.admin,
    scope: { type: "chat", chat_id: chatId },
  });
  return r.ok;
}

// ——— состояние и заявки ———

export async function loadState(chatId: number): Promise<State | null> {
  return parseState(await getString(KEY.state(chatId)));
}

export async function getAdminChatId(): Promise<number | null> {
  const v = await getString(KEY.admin);
  const n = v == null ? NaN : Number(v);
  return Number.isFinite(n) ? n : null;
}

async function allLeads(): Promise<{ raw: string; lead: Lead }[]> {
  const raws = await listRange(KEY.leads, 0, -1);
  const out: { raw: string; lead: Lead }[] = [];
  for (const raw of raws) {
    const lead = parseLead(raw);
    if (lead) out.push({ raw, lead });
  }
  return out;
}

// HTML-разметка снимается, сущности возвращаются в обычные знаки.
function toPlain(html: string): string {
  return html
    .replace(/<a href="([^"]+)">([\s\S]*?)<\/a>/g, "$2 ($1)")
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .slice(0, 4096);
}

type AdminMessage = { text: string; buttons?: Button[][] };

async function deliver(token: string, adminId: number, m: AdminMessage): Promise<boolean> {
  if (await sendMessage(token, adminId, m.text, { html: true, buttons: m.buttons })) return true;
  // Telegram мог не принять разметку (например, обрезка длинного ответа
  // пришлась на середину тега) или кнопку. Тогда то же сообщение уходит
  // простым текстом без кнопки.
  return sendMessage(token, adminId, toPlain(m.text));
}

function notifyAdmin(token: string, adminId: number, lead: Lead): Promise<boolean> {
  return deliver(token, adminId, formatLeadForAdmin(lead));
}

async function saveLead(token: string, draft: Omit<Lead, "n">): Promise<void> {
  const n = await incr(KEY.count);
  const adminId = await getAdminChatId();

  if (n == null) {
    // Хранилище не ответило. Заявка не должна пропасть: она уходит админу
    // без номера и целиком пишется в журнал Vercel, оттуда её можно достать.
    console.error(`workshop-bot: storage unavailable, lead not saved: ${JSON.stringify(draft)}`);
    if (adminId != null) await notifyAdmin(token, adminId, { ...draft, n: 0 });
    return;
  }

  const lead: Lead = { ...draft, n };
  const stored = await pushToList(KEY.leads, JSON.stringify(lead));
  if (stored == null) {
    console.error(`workshop-bot: lead #${n} not stored: ${JSON.stringify(lead)}`);
  }

  const delivered = adminId != null && (await notifyAdmin(token, adminId, lead));
  // Не дошла до админа (он ещё не нажал /start или Telegram ответил
  // ошибкой): номер встаёт в очередь, и админ получит её при следующем /start.
  if (!delivered) await appendToList(KEY.pending, String(n));
}

// Очередь недоставленного: номера в списке pending, сами записи в list.
// Одна логика на заявки Мастерской и на запросы резюме.
type Queue<T extends { n: number }> = {
  pending: string;
  list: string;
  parse: (raw: string) => T | null;
  format: (item: T) => AdminMessage;
  intro: (count: number) => string;
};

const LEAD_QUEUE: Queue<Lead> = {
  pending: KEY.pending,
  list: KEY.leads,
  parse: parseLead,
  format: formatLeadForAdmin,
  intro: formatPendingIntro,
};

const RESUME_QUEUE: Queue<ResumeRequest> = {
  pending: KEY.resumePending,
  list: KEY.resumes,
  parse: parseResumeRecord,
  format: (r) => formatResumeForAdmin(r),
  intro: formatResumePendingIntro,
};

async function flushQueue<T extends { n: number }>(token: string, chatId: number, q: Queue<T>): Promise<void> {
  const nums = (await listRange(q.pending, 0, -1)).map(Number).filter(Number.isFinite);
  if (nums.length === 0) return;
  const unique = Array.from(new Set(nums)).sort((a, b) => a - b);
  const byNumber = new Map<number, T>();
  for (const raw of await listRange(q.list, 0, -1)) {
    const item = q.parse(raw);
    if (item) byNumber.set(item.n, item);
  }
  const found = unique.filter((n) => byNumber.has(n));

  if (found.length > 0) await sendMessage(token, chatId, q.intro(found.length));
  // Из очереди убирается только то, что дошло, и номера удалённых записей
  // (их уже нет в списке). Не дошедшее остаётся до следующего /start.
  for (const n of unique) {
    const item = byNumber.get(n);
    if (!item || (await deliver(token, chatId, q.format(item)))) {
      await removeFromList(q.pending, String(n));
    }
  }
}

async function flushPending(token: string, chatId: number): Promise<void> {
  await flushQueue(token, chatId, LEAD_QUEUE);
  await flushQueue(token, chatId, RESUME_QUEUE);
}

async function deleteUserData(token: string, chatId: number): Promise<void> {
  await deleteKeys(KEY.state(chatId));
  const removed: number[] = [];
  for (const { raw, lead } of await allLeads()) {
    if (lead.chatId !== chatId) continue;
    await removeFromList(KEY.leads, raw);
    await removeFromList(KEY.pending, String(lead.n));
    removed.push(lead.n);
  }
  // Сообщения с этими заявками остались в чате у Жасура. Бот предупреждает,
  // чтобы он не писал человеку, который попросил всё стереть.
  if (removed.length === 0) return;
  const adminId = await getAdminChatId();
  if (adminId != null && adminId !== chatId) {
    await sendMessage(token, adminId, formatDeletedNotice(removed.sort((a, b) => a - b)));
  }
}

async function sendLeads(token: string, chatId: number): Promise<void> {
  const leads = (await listRange(KEY.leads, 0, 9))
    .map(parseLead)
    .filter((l): l is Lead => Boolean(l));
  const total = await listLength(KEY.leads);
  await sendMessage(token, chatId, formatLeadsList(leads, total), { html: true });
}

async function sendResumeRequests(token: string, chatId: number): Promise<void> {
  const list = (await listRange(KEY.resumes, 0, 9))
    .map(parseResumeRecord)
    .filter((r): r is ResumeRequest => Boolean(r));
  const total = await listLength(KEY.resumes);
  await sendMessage(token, chatId, formatResumeList(list, total), { html: true });
}

// ——— запрос резюме с сайта ———

// Сохраняет запрос и сразу шлёт его Жасуру. Токена может не быть (бот не
// настроен в этой сборке) или админ ещё не нажал /start: тогда запрос
// встаёт в очередь resume:pending и дойдёт при его /start.
//
// stored: запрос лежит в Upstash. Маршрут отвечает человеку 200 только в
// этом случае. null: хранилище не ответило даже на счётчик, запрос целиком
// ушёл в журнал Vercel, человек увидит ошибку и сможет отправить ещё раз.
export async function saveResumeRequest(
  token: string | undefined,
  draft: ResumeDraft,
  now: number
): Promise<{ n: number; stored: boolean; delivered: boolean } | null> {
  const n = await incr(KEY.resumeCount);
  if (n == null) {
    console.error(`resume-request: storage unavailable, not saved: ${JSON.stringify(draft)}`);
    return null;
  }

  const request: ResumeRequest = { ...draft, n, at: now };
  const stored = (await pushToList(KEY.resumes, JSON.stringify(request))) != null;
  if (!stored) console.error(`resume-request: #${n} not stored: ${JSON.stringify(request)}`);

  const adminId = token ? await getAdminChatId() : null;
  const delivered =
    token != null && adminId != null && (await deliver(token, adminId, formatResumeForAdmin(request, stored)));
  // В очередь встаёт только то, что лежит в базе: из очереди запрос
  // достаётся по номеру из resume:requests.
  if (!delivered && stored) await appendToList(KEY.resumePending, String(n));
  return { n, stored, delivered };
}

// ——— исполнение ———

async function runEffect(token: string, fx: Effect): Promise<void> {
  switch (fx.type) {
    case "send":
      await sendMessage(token, fx.chatId, fx.text, {
        html: fx.html,
        buttons: fx.buttons,
        replyKeyboard: fx.replyKeyboard,
        removeKeyboard: fx.removeKeyboard,
      });
      return;
    case "edit":
      // Без reply_markup Telegram убирает кнопки под сообщением.
      await tg(token, "editMessageText", {
        chat_id: fx.chatId,
        message_id: fx.messageId,
        text: fx.text,
      });
      return;
    case "ackButton":
      await tg(token, "answerCallbackQuery", { callback_query_id: fx.callbackId });
      return;
    case "setState":
      await setString(KEY.state(fx.chatId), JSON.stringify(fx.state), STATE_TTL_SECONDS);
      return;
    case "setAdmin":
      await setString(KEY.admin, String(fx.chatId));
      await setAdminCommands(token, fx.chatId);
      return;
    case "flushPending":
      await flushPending(token, fx.chatId);
      return;
    case "saveLead":
      await saveLead(token, fx.lead);
      return;
    case "deleteUserData":
      await deleteUserData(token, fx.chatId);
      return;
    case "sendLeads":
      await sendLeads(token, fx.chatId);
      return;
    case "sendResumeRequests":
      await sendResumeRequests(token, fx.chatId);
      return;
  }
}

// Действия идут строго по порядку: заявка сохраняется раньше, чем человек
// видит «Спасибо». Сбой одного действия не останавливает остальные.
export async function runEffects(token: string, effects: Effect[]): Promise<void> {
  for (const fx of effects) {
    try {
      await runEffect(token, fx);
    } catch (e) {
      console.error(`workshop-bot: effect ${fx.type} failed: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }
}
