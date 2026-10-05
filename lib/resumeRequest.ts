// Запрос резюме с «Обо мне»: поля, проверка и сообщения Жасуру.
//
// Модуль без сети и без хранилища, как lib/workshopBot.ts. Его берут три
// места:
//   app/about/ResumeRequest.tsx   окно-анкета: роли, потолки длины, почта;
//   app/api/resume-request        маршрут: проверка того, что пришло;
//   lib/workshopBotRuntime.ts     сообщение Жасуру и список для /resume.
// Сообщения Жасуру по-русски, как у заявок Мастерской: правила те же, на
// «вы», без длинных тире и стрелок.

import { clip, esc, formatDate, formatDateTime, isValidEmail, type Button } from "@/lib/workshopBot";

export const RESUME_ROLES = ["director", "founder", "hr", "other"] as const;
export type ResumeRole = (typeof RESUME_ROLES)[number];
export type ResumeLang = "ru" | "en";

// Потолки длины. Окно ставит их полям (maxLength), маршрут отклоняет всё
// длиннее. Вместе с подписями сообщение Жасуру выходит меньше тысячи знаков.
export const RESUME_LIMIT = { roleOther: 80, company: 120, what: 300, email: 200, telegram: 64 };

export type ResumeDraft = {
  role: ResumeRole;
  // Что человек написал после «Другое». У остальных ролей пустая строка.
  roleOther: string;
  company: string;
  what: string;
  email: string;
  // Пустая строка, если человек нажал «Пропустить».
  telegram: string;
  // Язык сайта в момент запроса. На этом языке Жасур пришлёт резюме,
  // отдельно человека не спрашивают.
  lang: ResumeLang;
};
export type ResumeRequest = ResumeDraft & { n: number; at: number };

export { isValidEmail };

// ——— проверка ———

const USERNAME_RE = /^[A-Za-z0-9_]{4,32}$/;

// «@name», «name», «t.me/name» и «https://t.me/name» дают одно и то же:
// name. Всё остальное (например, номер телефона) остаётся как написано.
export function cleanTelegram(raw: string): string {
  const s = raw.trim();
  const link = /^(?:https?:\/\/)?(?:www\.)?(?:t\.me|telegram\.me)\/([^/?#\s]+)/i.exec(s);
  if (link) return link[1].replace(/^@/, "");
  return s.replace(/^@/, "");
}

// Имя в Telegram, если написанное на него похоже. Только тогда в сообщении
// Жасуру появляется ссылка t.me.
export function telegramUsername(s: string): string | null {
  return USERNAME_RE.test(s) ? s : null;
}

const oneLine = (s: string) => s.replace(/\s+/g, " ").trim();
// «Чем занимается» можно написать в две строки: переносы остаются, пустые
// строки между ними схлопываются.
const fewLines = (s: string) =>
  s
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map(oneLine)
    .filter(Boolean)
    .join("\n");

export type ResumeParse =
  | { ok: true; draft: ResumeDraft }
  | { ok: false; reason: "bad" | "role" | "email" | "field" | "long" };

// Разбор тела запроса. website: скрытое поле-ловушка, людям его не видно,
// заполняют его только боты. На ловушку ответ такой же, как на любой
// испорченный запрос, чтобы бот не понял, на чём попался.
export function parseResumeBody(body: unknown): ResumeParse {
  if (!body || typeof body !== "object") return { ok: false, reason: "bad" };
  const b = body as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : "");

  if (str(b.website).trim()) return { ok: false, reason: "bad" };

  const role = str(b.role) as ResumeRole;
  if (!RESUME_ROLES.includes(role)) return { ok: false, reason: "role" };

  const draft: ResumeDraft = {
    role,
    roleOther: role === "other" ? oneLine(str(b.roleOther)) : "",
    company: oneLine(str(b.company)),
    what: fewLines(str(b.what)),
    email: oneLine(str(b.email)).toLowerCase(),
    telegram: cleanTelegram(oneLine(str(b.telegram))),
    lang: b.lang === "en" ? "en" : "ru",
  };

  if (!draft.email) return { ok: false, reason: "email" };
  if (
    draft.roleOther.length > RESUME_LIMIT.roleOther ||
    draft.company.length > RESUME_LIMIT.company ||
    draft.what.length > RESUME_LIMIT.what ||
    draft.email.length > RESUME_LIMIT.email ||
    draft.telegram.length > RESUME_LIMIT.telegram
  ) {
    return { ok: false, reason: "long" };
  }
  if (!isValidEmail(draft.email)) return { ok: false, reason: "email" };
  if (!draft.company || !draft.what || (role === "other" && !draft.roleOther)) {
    return { ok: false, reason: "field" };
  }
  return { ok: true, draft };
}

export function parseResumeRecord(raw: string): ResumeRequest | null {
  try {
    const r = JSON.parse(raw) as ResumeRequest;
    if (r && typeof r.n === "number" && typeof r.email === "string" && RESUME_ROLES.includes(r.role)) return r;
  } catch {}
  return null;
}

// ——— сообщения Жасуру (HTML) ———

const ROLE_RU: Record<ResumeRole, string> = {
  director: "Директор",
  founder: "Основатель компании",
  hr: "HR / рекрутер",
  other: "Другое",
};

export function roleLabel(r: Pick<ResumeDraft, "role" | "roleOther">): string {
  return r.role === "other" && r.roleOther ? `Другое: ${r.roleOther}` : ROLE_RU[r.role];
}

function telegramLine(telegram: string): string {
  if (!telegram) return "не указан";
  const user = telegramUsername(telegram);
  return user
    ? `<a href="https://t.me/${user}">@${user}</a>`
    : `${esc(telegram)} (на имя в Telegram не похоже, ссылки нет)`;
}

// stored: false, если заявку не удалось записать в Upstash. Тогда она
// приходит Жасуру с пометкой, а человек видит ошибку и может отправить её
// ещё раз, то есть возможен повтор.
export function formatResumeForAdmin(
  r: ResumeRequest,
  stored = true
): { text: string; buttons?: Button[][] } {
  const user = telegramUsername(r.telegram);
  const lines = [
    `<b>Запрос резюме №${r.n}</b>`,
    "",
    `<b>Кто:</b> ${esc(roleLabel(r))}`,
    `<b>Компания:</b> ${esc(r.company)}`,
    `<b>Чем занимается:</b> ${esc(r.what)}`,
    `<b>Почта:</b> ${esc(r.email)}`,
    `<b>Телеграм:</b> ${telegramLine(r.telegram)}`,
    `<b>Язык резюме:</b> ${r.lang === "en" ? "английский" : "русский"}`,
    "",
    "Анкета на странице «Обо мне»",
    formatDateTime(r.at),
    ...(stored ? [] : ["", "В базу не записался. Человеку показана ошибка, он может отправить запрос ещё раз."]),
  ];
  const text = clip(lines.join("\n"), 4000);
  return user ? { text, buttons: [[{ text: "Написать в Telegram", url: `https://t.me/${user}` }]] } : { text };
}

export function formatResumeList(list: ResumeRequest[], total: number | null): string {
  if (list.length === 0) return "Запросов резюме пока нет.";
  const head = `<b>Последние запросы резюме: ${list.length} из ${total ?? list.length}</b>`;
  const items = list.map((r) => {
    const user = telegramUsername(r.telegram);
    return [
      `<b>№${r.n}. ${esc(clip(r.company, 60))}</b>, ${formatDate(r.at)}`,
      `${esc(clip(roleLabel(r), 60))}, резюме ${r.lang === "en" ? "на английском" : "на русском"}`,
      `Почта: ${esc(r.email)}${user ? `, телеграм @${user}` : ""}`,
    ].join("\n");
  });
  return clip([head, ...items].join("\n\n"), 4000);
}

export function formatResumePendingIntro(count: number): string {
  return `Запросы резюме, которые пришли раньше: ${count}.`;
}
