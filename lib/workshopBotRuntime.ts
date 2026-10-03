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
//   wsbot:leads          все заявки, JSON, новые в начале списка
//   wsbot:count          счётчик для номера «Заявка №7»
//   wsbot:pending        номера заявок, которые ещё не дошли до админа

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
  type Lead,
  type State,
} from "@/lib/workshopBot";

// Адрес сайта прописан константой, как SITE в других файлах. Брать его из
// запроса нельзя: вызов setup с превью-сборки увёл бы вебхук на превью.
export const WEBHOOK_URL = "https://jasur-portfolio-pied.vercel.app/api/workshop-bot";

const KEY = {
  admin: "wsbot:admin",
  state: (chatId: number) => `wsbot:state:${chatId}`,
  leads: "wsbot:leads",
  count: "wsbot:count",
  pending: "wsbot:pending",
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

function keyboard(buttons?: Button[][]) {
  if (!buttons) return undefined;
  return {
    inline_keyboard: buttons.map((row) =>
      row.map((b) => (b.url ? { text: b.text, url: b.url } : { text: b.text, callback_data: b.data }))
    ),
  };
}

async function sendMessage(
  token: string,
  chatId: number,
  text: string,
  opts: { html?: boolean; buttons?: Button[][] } = {}
): Promise<boolean> {
  const r = await tg(token, "sendMessage", {
    chat_id: chatId,
    text,
    ...(opts.html ? { parse_mode: "HTML" } : {}),
    ...(opts.buttons ? { reply_markup: keyboard(opts.buttons) } : {}),
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

async function notifyAdmin(token: string, adminId: number, lead: Lead): Promise<boolean> {
  const m = formatLeadForAdmin(lead);
  if (await sendMessage(token, adminId, m.text, { html: true, buttons: m.buttons })) return true;
  // Telegram мог не принять разметку (например, обрезка длинного ответа
  // пришлась на середину тега) или кнопку. Тогда та же заявка уходит
  // простым текстом без кнопки.
  return sendMessage(token, adminId, toPlain(m.text));
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

async function flushPending(token: string, chatId: number): Promise<void> {
  const nums = (await listRange(KEY.pending, 0, -1)).map(Number).filter(Number.isFinite);
  if (nums.length === 0) return;
  const unique = Array.from(new Set(nums)).sort((a, b) => a - b);
  const byNumber = new Map((await allLeads()).map(({ lead }) => [lead.n, lead]));
  const leads = unique.map((n) => byNumber.get(n)).filter((l): l is Lead => Boolean(l));

  if (leads.length > 0) await sendMessage(token, chatId, formatPendingIntro(leads.length));
  // Из очереди убирается только то, что дошло, и номера удалённых заявок
  // (их уже нет в списке). Не дошедшее остаётся до следующего /start.
  for (const n of unique) {
    const lead = byNumber.get(n);
    if (!lead || (await notifyAdmin(token, chatId, lead))) {
      await removeFromList(KEY.pending, String(n));
    }
  }
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

// ——— исполнение ———

async function runEffect(token: string, fx: Effect): Promise<void> {
  switch (fx.type) {
    case "send":
      await sendMessage(token, fx.chatId, fx.text, { html: fx.html, buttons: fx.buttons });
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
