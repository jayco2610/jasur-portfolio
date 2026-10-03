// Бот заявок Мастерской (@jasur_workshop_bot): вся логика разговора.
//
// Модуль нарочно без сети, без хранилища и без импортов. На входе одно
// разобранное обновление Telegram и текущее состояние разговора, на выходе
// список действий («эффектов»): что отправить, что сохранить, что удалить.
// Исполняет их lib/workshopBotRuntime.ts. Так весь опрос проверяется
// локальным скриптом без Telegram и без Upstash.
//
// Все тексты бота лежат здесь же. Правила те же, что на сайте: обращение на
// «вы», без длинных тире и стрелок.

export const ADMIN_USERNAME = "biznesmind";
export const STATE_TTL_SECONDS = 7 * 24 * 60 * 60;

export type Lang = "ru" | "en";

const STEPS = ["name", "doing", "launching", "revenue", "want", "email"] as const;
type StepKey = (typeof STEPS)[number];
export type Answers = Record<StepKey, string>;

// v нужен на случай, если формат состояния когда-нибудь поменяется:
// старое состояние с другим v просто не примется, и человек начнёт с /start.
export type SurveyState = {
  v: 1;
  phase: "survey";
  lang: Lang;
  step: number;
  answers: Partial<Answers>;
  source: string;
  emailRetried: boolean;
  startedAt: number;
};
export type DoneState = { v: 1; phase: "done"; lang: Lang };
export type State = SurveyState | DoneState;

export type Lead = {
  n: number;
  chatId: number;
  userId: number;
  username: string | null;
  tgName: string;
  lang: Lang;
  tgLang: string | null;
  source: string;
  at: number;
  answers: Answers;
};
export type LeadDraft = Omit<Lead, "n">;

type From = {
  chatId: number;
  userId: number;
  username: string | null;
  firstName: string;
  lastName: string;
  langCode: string | null;
};
export type Incoming =
  | ({ kind: "text"; text: string } & From)
  | ({
      kind: "button";
      data: string;
      callbackId: string;
      messageId: number | null;
      messageText: string | null;
    } & From);

export type Button = { text: string; data?: string; url?: string };

export type Effect =
  | { type: "send"; chatId: number; text: string; html?: boolean; buttons?: Button[][] }
  | { type: "edit"; chatId: number; messageId: number; text: string }
  | { type: "ackButton"; callbackId: string }
  | { type: "setState"; chatId: number; state: State }
  | { type: "setAdmin"; chatId: number }
  | { type: "flushPending"; chatId: number }
  | { type: "saveLead"; lead: LeadDraft }
  | { type: "deleteUserData"; chatId: number }
  | { type: "sendLeads"; chatId: number };

// ——— тексты ———

const REVENUE_RU = ["Пока нет", "До 100 тыс. ₽ в месяц", "100-500 тыс. ₽", "Больше 500 тыс. ₽"];

const T = {
  ru: {
    greeting:
      "Это лист ожидания Мастерской Жасура. Шесть коротких вопросов. Ответы увидит только Жасур. Удалить свои данные: /delete",
    questions: [
      "Как вас зовут?",
      "Чем вы сейчас занимаетесь?",
      "Что запускаете или хотите запустить?",
      "Есть ли уже выручка?",
      "Что хотите получить от Мастерской?",
      "Почта, если удобно. Можно пропустить.",
    ],
    revenue: REVENUE_RU,
    skip: "Пропустить",
    skipped: "Пропущено",
    thanks: "Спасибо. Поток сейчас закрыт. Как открою, напишу вам первым.",
    deleted: "Данные удалены.",
    badEmail: "Не похоже на адрес почты. Пришлите ещё раз или нажмите «Пропустить».",
    textOnly: "Ответьте, пожалуйста, текстом.",
    hint: "Чтобы встать в лист ожидания, нажмите /start",
    done: "Ваши ответы уже у Жасура. Заполнить заново: /start",
    unknown: "Такой команды нет. Начать заново: /start",
  },
  en: {
    greeting:
      "This is the waitlist for Jasur's Workshop. Six short questions. Only Jasur will see your answers. To delete your data: /delete",
    questions: [
      "What is your name?",
      "What do you do right now?",
      "What are you launching or planning to launch?",
      "Do you have revenue yet?",
      "What do you want to get from the Workshop?",
      "Email, if you like. You can skip this.",
    ],
    revenue: ["Not yet", "Under ₽100k a month", "₽100-500k", "Over ₽500k"],
    skip: "Skip",
    skipped: "Skipped",
    thanks: "Thank you. Intake is closed for now. When it opens, I will write to you first.",
    deleted: "Your data has been deleted.",
    badEmail: 'That does not look like an email address. Send it again or tap "Skip".',
    textOnly: "Please reply with text.",
    hint: "To join the waitlist, tap /start",
    done: "Your answers are already with Jasur. To fill them in again: /start",
    unknown: "There is no such command. To start over: /start",
  },
};

const ADMIN = {
  hello: "Вы админ. Новые заявки будут приходить сюда. Команда /leads покажет последние.",
  hint: "Пройти опрос как посетитель: откройте бота кнопкой «Оставить контакт» на сайте.",
};

// Меню команд в Telegram (кнопка «/» у поля ввода). Ставит setup-маршрут,
// а меню админа ещё и сам бот, когда админ нажимает /start.
export const COMMANDS = {
  en: [
    { command: "start", description: "Start over" },
    { command: "delete", description: "Delete my data" },
  ],
  ru: [
    { command: "start", description: "Начать заново" },
    { command: "delete", description: "Удалить мои данные" },
  ],
  admin: [
    { command: "start", description: "Начать заново" },
    { command: "leads", description: "Последние заявки" },
    { command: "delete", description: "Удалить мои данные" },
  ],
};

// Потолки длины ответов. Сообщение в Telegram не длиннее 4096 знаков, а
// заявка админу собирает все ответы в одно сообщение.
const LIMIT = { name: 100, text: 800, email: 200 };

// ——— разбор входа ———

type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj | null =>
  v && typeof v === "object" ? (v as Obj) : null;
const str = (v: unknown): string => (typeof v === "string" ? v : "");
const num = (v: unknown): number | null =>
  typeof v === "number" && Number.isFinite(v) ? v : null;

function parseFrom(f: Obj | null, chatId: number | null): From | null {
  if (!f || f.is_bot === true) return null;
  const userId = num(f.id);
  if (userId == null) return null;
  return {
    chatId: chatId ?? userId,
    userId,
    username: str(f.username) || null,
    firstName: str(f.first_name),
    lastName: str(f.last_name),
    langCode: str(f.language_code) || null,
  };
}

// Берёт из обновления только личные сообщения и нажатия кнопок. Группы,
// каналы, правки сообщений и прочее бот молча пропускает.
export function parseUpdate(update: unknown): Incoming | null {
  const u = obj(update);
  if (!u) return null;

  const m = obj(u.message);
  if (m) {
    const chat = obj(m.chat);
    if (!chat || chat.type !== "private") return null;
    const from = parseFrom(obj(m.from), num(chat.id));
    if (!from) return null;
    return { kind: "text", text: str(m.text) || str(m.caption), ...from };
  }

  const cq = obj(u.callback_query);
  if (cq) {
    const msg = obj(cq.message);
    const chat = msg ? obj(msg.chat) : null;
    if (chat && chat.type !== "private") return null;
    const from = parseFrom(obj(cq.from), chat ? num(chat.id) : null);
    const callbackId = str(cq.id);
    if (!from || !callbackId) return null;
    return {
      kind: "button",
      data: str(cq.data),
      callbackId,
      messageId: msg ? num(msg.message_id) : null,
      messageText: msg ? str(msg.text) || null : null,
      ...from,
    };
  }

  return null;
}

export function parseState(raw: string | null): State | null {
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as State;
    if (s && s.v === 1 && (s.lang === "ru" || s.lang === "en")) {
      if (s.phase === "done") return s;
      if (s.phase === "survey" && Number.isInteger(s.step) && s.step >= 0 && s.step < STEPS.length) {
        return s;
      }
    }
  } catch {}
  return null;
}

export function parseLead(raw: string): Lead | null {
  try {
    const l = JSON.parse(raw) as Lead;
    if (l && typeof l.n === "number" && typeof l.chatId === "number" && l.answers) return l;
  } catch {}
  return null;
}

// ——— мелочи ———

const RU_LANGS = ["ru", "uk", "be", "kk", "uz"];

// Английский, если человек пришёл с английской страницы (?start=workshop_en)
// или если язык его Telegram не из списка. Если Telegram язык не прислал,
// остаётся русский.
export function detectLang(source: string, langCode: string | null): Lang {
  if (source === "workshop_en") return "en";
  if (!langCode) return "ru";
  return RU_LANGS.includes(langCode.toLowerCase().split("-")[0]) ? "ru" : "en";
}

export function isAdmin(username: string | null): boolean {
  return (username ?? "").toLowerCase() === ADMIN_USERNAME;
}

// Проверка нарочно простая, как в подписке на сайте.
export function isValidEmail(s: string): boolean {
  return s.length <= LIMIT.email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}

function clip(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

// Метка источника из ссылки t.me/...?start=метка. Telegram пропускает в ней
// только латиницу, цифры, _ и -, до 64 знаков. Руками в /start можно
// написать что угодно, поэтому лишнее отрезается.
function cleanSource(arg: string): string {
  return arg.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 64);
}

function parseCommand(text: string): { name: string; arg: string } | null {
  const m = /^\/([A-Za-z0-9_]+)(?:@[A-Za-z0-9_]+)?(?:\s+([\s\S]*))?$/.exec(text.trim());
  return m ? { name: m[1].toLowerCase(), arg: (m[2] ?? "").trim() } : null;
}

const send = (chatId: number, text: string, buttons?: Button[][]): Effect =>
  buttons ? { type: "send", chatId, text, buttons } : { type: "send", chatId, text };

function question(chatId: number, lang: Lang, step: number): Effect {
  const t = T[lang];
  const text = t.questions[step];
  if (STEPS[step] === "revenue") {
    return send(chatId, text, t.revenue.map((label, i) => [{ text: label, data: `rev:${i}` }]));
  }
  if (STEPS[step] === "email") {
    return send(chatId, text, [[{ text: t.skip, data: "skip" }]]);
  }
  return send(chatId, text);
}

// ——— решения ———

export function decide(input: Incoming, ctx: { state: State | null; now: number }): Effect[] {
  const { state, now } = ctx;
  const lang = state ? state.lang : detectLang("", input.langCode);
  const chatId = input.chatId;

  if (input.kind === "button") return onButton(input, state, now);

  const cmd = parseCommand(input.text);
  if (cmd) {
    if (cmd.name === "start") return onStart(input, cleanSource(cmd.arg), now);
    if (cmd.name === "delete") {
      return [{ type: "deleteUserData", chatId }, send(chatId, T[lang].deleted)];
    }
    if (cmd.name === "leads" && isAdmin(input.username)) {
      return [{ type: "sendLeads", chatId }];
    }
    return [send(chatId, T[lang].unknown)];
  }

  if (!state) return [send(chatId, T[lang].hint)];
  if (state.phase === "done") return [send(chatId, T[lang].done)];
  return onAnswer(input, state, now);
}

function onStart(input: Incoming, source: string, now: number): Effect[] {
  const chatId = input.chatId;
  const fx: Effect[] = [];

  // Админ без метки (просто /start) получает только админское приветствие.
  // С меткой (пришёл кнопкой с сайта) дальше идёт обычный опрос, чтобы
  // Жасур мог пройти его сам и увидеть, как выглядит заявка.
  if (isAdmin(input.username)) {
    fx.push({ type: "setAdmin", chatId });
    fx.push(send(chatId, source ? ADMIN.hello : `${ADMIN.hello}\n\n${ADMIN.hint}`));
    fx.push({ type: "flushPending", chatId });
    if (!source) return fx;
  }

  const lang = detectLang(source, input.langCode);
  const state: SurveyState = {
    v: 1,
    phase: "survey",
    lang,
    step: 0,
    answers: {},
    source,
    emailRetried: false,
    startedAt: now,
  };
  fx.push({ type: "setState", chatId, state });
  fx.push(send(chatId, T[lang].greeting));
  fx.push(question(chatId, lang, 0));
  return fx;
}

function onAnswer(input: Incoming & { kind: "text" }, state: SurveyState, now: number): Effect[] {
  const chatId = input.chatId;
  const t = T[state.lang];
  const text = input.text.trim();
  if (!text) return [send(chatId, t.textOnly)];

  const key = STEPS[state.step];
  if (key === "email") {
    // Первый неверный адрес переспрашивается, второй принимается как есть:
    // лучше заявка с кривой почтой, чем человек, который бросил опрос.
    if (!isValidEmail(text) && !state.emailRetried) {
      return [
        { type: "setState", chatId, state: { ...state, emailRetried: true } },
        send(chatId, t.badEmail, [[{ text: t.skip, data: "skip" }]]),
      ];
    }
    return advance(input, state, clip(text, LIMIT.email), now);
  }
  // На вопросе про выручку человек может написать ответ сам, а не нажать
  // кнопку. Такой ответ принимается как есть.
  return advance(input, state, clip(text, key === "name" ? LIMIT.name : LIMIT.text), now);
}

function onButton(input: Incoming & { kind: "button" }, state: State | null, now: number): Effect[] {
  const chatId = input.chatId;
  const fx: Effect[] = [{ type: "ackButton", callbackId: input.callbackId }];
  // Кнопка со старого сообщения (опрос уже прошёл дальше или закончен)
  // ничего не делает.
  if (!state || state.phase !== "survey") return fx;
  const t = T[state.lang];
  const key = STEPS[state.step];

  let value: string | null = null;
  let shown = "";
  const rev = /^rev:([0-3])$/.exec(input.data);
  if (rev && key === "revenue") {
    const i = Number(rev[1]);
    value = REVENUE_RU[i];
    shown = t.revenue[i];
  } else if (input.data === "skip" && key === "email") {
    value = "";
    shown = t.skipped;
  }
  if (value == null) return fx;

  // Выбранный ответ дописывается под вопросом, кнопки убираются: в
  // переписке видно, что человек выбрал, и второй раз нажать нельзя.
  if (input.messageId != null) {
    const base = input.messageText ?? t.questions[state.step];
    fx.push({ type: "edit", chatId, messageId: input.messageId, text: `${base}\n\n${shown}` });
  }
  return fx.concat(advance(input, state, value, now));
}

function advance(input: Incoming, state: SurveyState, value: string, now: number): Effect[] {
  const chatId = input.chatId;
  const answers = { ...state.answers, [STEPS[state.step]]: value };
  const next = state.step + 1;

  if (next < STEPS.length) {
    return [
      { type: "setState", chatId, state: { ...state, step: next, answers } },
      question(chatId, state.lang, next),
    ];
  }

  const lead: LeadDraft = {
    chatId,
    userId: input.userId,
    username: input.username,
    tgName: [input.firstName, input.lastName].filter(Boolean).join(" "),
    lang: state.lang,
    tgLang: input.langCode,
    source: state.source,
    at: now,
    answers: {
      name: answers.name ?? "",
      doing: answers.doing ?? "",
      launching: answers.launching ?? "",
      revenue: answers.revenue ?? "",
      want: answers.want ?? "",
      email: answers.email ?? "",
    },
  };
  return [
    { type: "saveLead", lead },
    { type: "setState", chatId, state: { v: 1, phase: "done", lang: state.lang } },
    send(chatId, T[state.lang].thanks),
  ];
}

// ——— сообщения админу (HTML) ———

const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

// Время по Москве. Смещение постоянное (+3, перехода на летнее время с 2014
// года нет), поэтому считается без Intl: так не зависит от того, какие
// языковые данные есть на сервере.
function moscow(ms: number): Date {
  return new Date(ms + 3 * 60 * 60 * 1000);
}

export function formatDate(ms: number): string {
  const d = moscow(ms);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function formatDateTime(ms: number): string {
  const d = moscow(ms);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${formatDate(ms)}, ${hh}:${mm} по Москве`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const USERNAME_RE = /^[A-Za-z0-9_]{4,32}$/;

export function formatLeadForAdmin(lead: Lead): { text: string; buttons?: Button[][] } {
  const a = lead.answers;
  const name = lead.tgName || a.name || "без имени";
  const hasUsername = Boolean(lead.username && USERNAME_RE.test(lead.username));
  const who = hasUsername
    ? `@${lead.username}${lead.tgName ? ` (${esc(lead.tgName)})` : ""}`
    : `<a href="tg://user?id=${lead.userId}">${esc(name)}</a> (username нет)`;

  const lines = [
    `<b>Заявка №${lead.n}</b>`,
    "",
    `<b>Имя:</b> ${esc(a.name)}`,
    `<b>Чем занимается:</b> ${esc(a.doing)}`,
    `<b>Что запускает:</b> ${esc(a.launching)}`,
    `<b>Выручка:</b> ${esc(a.revenue)}`,
    `<b>Что хочет от Мастерской:</b> ${esc(a.want)}`,
    `<b>Почта:</b> ${a.email ? esc(a.email) : "не указана"}`,
    "",
    `Telegram: ${who}`,
    `Язык опроса: ${lead.lang === "ru" ? "русский" : "английский"}, язык Telegram: ${esc(lead.tgLang ?? "не известен")}`,
    `Источник: ${esc(lead.source || "без метки")}`,
    formatDateTime(lead.at),
  ];
  const text = clip(lines.join("\n"), 4000);
  return hasUsername
    ? { text, buttons: [[{ text: "Написать", url: `https://t.me/${lead.username}` }]] }
    : { text };
}

export function formatLeadsList(leads: Lead[], total: number | null): string {
  if (leads.length === 0) return "Заявок пока нет.";
  const head = `<b>Последние заявки: ${leads.length} из ${total ?? leads.length}</b>`;
  const items = leads.map((l) =>
    [
      `<b>№${l.n}. ${esc(clip(l.answers.name || l.tgName || "без имени", 60))}</b>, ${formatDate(l.at)}`,
      `Занимается: ${esc(clip(l.answers.doing, 120))}`,
      `Выручка: ${esc(clip(l.answers.revenue, 60))}`,
    ].join("\n")
  );
  return clip([head, ...items].join("\n\n"), 4000);
}

export function formatPendingIntro(count: number): string {
  return `Заявки, которые пришли раньше: ${count}.`;
}

export function formatDeletedNotice(numbers: number[]): string {
  const list = numbers.map((n) => `№${n}`).join(", ");
  return numbers.length === 1
    ? `Заявка ${list} удалена: человек стёр свои данные командой /delete.`
    : `Заявки ${list} удалены: человек стёр свои данные командой /delete.`;
}
