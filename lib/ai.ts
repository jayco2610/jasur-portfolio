// Один вход в языковые модели для всего сайта: чат JasurGPT
// (app/api/chat), демо (lib/llm.ts, через app/api/demo) и живая Mia
// (app/api/mia). Платных моделей нет, только бесплатные планы.
//
// Порядок попыток.
// 1. Groq, если задан GROQ_API_KEY. Бесплатный план без карты даёт каждой
//    модели свои лимиты: 30 запросов в минуту, 1000 в сутки, 8 тыс. токенов
//    в минуту, 200 тыс. в сутки (console.groq.com/docs/rate-limits, 03.10.2026).
//    Модели по очереди: gpt-oss-120b, qwen3.8-27b, gpt-oss-20b. Отказ одной
//    не значит отказ другой: лимиты у каждой свои.
// 2. OpenRouter, бесплатные модели. Список берётся у самого OpenRouter (кэш
//    на час): зашитые названия через пару недель исчезают, а каждая попытка
//    на мёртвой модели тратит общий дневной лимит. У аккаунта без пополнений
//    это 50 запросов в сутки на чат и все демо вместе.
//
// Модели спрашиваются по одной: первый хороший ответ, и всё. К следующей
// модели переход при 429, 5xx, таймауте, пустом ответе или ответе, который не
// прошёл validate. На модель около 15 секунд, на весь вызов около 45.
//
// Причина отказа наружу. «daily» только если все доступные провайдеры
// исчерпали дневной лимит: у OpenRouter он общий на аккаунт, у Groq свой у
// каждой модели, поэтому Groq исчерпан, когда дневной 429 дали все три.
// Во всех остальных случаях «busy»: через минуту может получиться.
//
// В журнал функции пишутся провайдер, модель, код и время. Ни вопроса, ни
// ответа, ни адреса посетителя: логи Vercel читаются, а на сайте обещано,
// что личного мы не собираем.

export type AiMessage = { role: "system" | "user" | "assistant"; content: string };

export type AiOpts = {
  maxTokens?: number;
  temperature?: number;
  // Подпись приложения для OpenRouter (заголовок X-Title).
  title?: string;
  // Отбраковка ответа (не тот язык, утёкшие рассуждения, слишком длинно):
  // забракованный ответ ведёт к следующей модели.
  validate?: (s: string) => boolean;
  // Снять кавычки, в которые модель заворачивает весь ответ. Нужно демо, где
  // ответ это готовый текст пуша или отзыва; чату не нужно.
  unquote?: boolean;
  // Метка в журнале: JasurGPT, demo, mia.
  tag?: string;
};

export type AiReason = "busy" | "daily";

export type AiResult =
  | { ok: true; text: string; provider: "groq" | "openrouter"; model: string }
  | { ok: false; reason: AiReason };

const MODEL_TIMEOUT_MS = 15_000;
const TOTAL_BUDGET_MS = 45_000;
// Меньше этого на попытку не остаётся смысла: модель не успеет ответить.
const MIN_ATTEMPT_MS = 3_000;

/* ---------------- Groq ---------------- */

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// Все три модели рассуждающие. Рассуждения тратят лимит токенов в минуту и
// не нужны в ответе, поэтому у каждой самый низкий уровень и скрытый вывод.
// Параметры у семейств разные (console.groq.com/docs/reasoning):
// - gpt-oss: reasoning_effort только low, medium, high; рассуждения лежат в
//   отдельном поле, include_reasoning: false убирает их из ответа совсем;
//   reasoning_format эти модели не принимают.
// - qwen3.8-27b: reasoning_effort "none" выключает рассуждения целиком;
//   reasoning_format "hidden" прячет их, если они всё же будут.
//   include_reasoning вместе с reasoning_format Groq отклоняет с 400.
const GROQ_MODELS: { id: string; reasoning: Record<string, unknown> }[] = [
  { id: "openai/gpt-oss-120b", reasoning: { reasoning_effort: "low", include_reasoning: false } },
  { id: "qwen/qwen3.8-27b", reasoning: { reasoning_effort: "none", reasoning_format: "hidden" } },
  { id: "openai/gpt-oss-20b", reasoning: { reasoning_effort: "low", include_reasoning: false } },
];

/* ---------------- OpenRouter ---------------- */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const PREFERRED = [/gemma-4-26b/, /gemma-4-31b/, /glm-5/, /nemotron-3-super-120b/, /llama.*70b/, /qwen.*(72b|80b|235b)/];
const SKIP = /safety|code|coder|vision|audio|embed|guard|nano|lightning/i;
const FALLBACK = ["google/gemma-4-31b-it:free", "meta-llama/llama-3.3-70b-instruct:free"];
const MAX_OPENROUTER_MODELS = 5;

let modelCache: { at: number; ids: string[] } | null = null;

async function openRouterModels(): Promise<string[]> {
  if (modelCache && Date.now() - modelCache.at < 3_600_000) return modelCache.ids;
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", { cache: "no-store" });
    const data = await res.json();
    const all: { id: string; context_length?: number }[] = Array.isArray(data?.data) ? data.data : [];
    const free = all
      .filter((m) => m.id.endsWith(":free") && !SKIP.test(m.id) && (m.context_length ?? 0) >= 16000)
      .map((m) => m.id);
    const ranked = [...PREFERRED.flatMap((re) => free.filter((id) => re.test(id))), ...free]
      .filter((id, i, arr) => arr.indexOf(id) === i)
      .slice(0, MAX_OPENROUTER_MODELS);
    if (ranked.length) {
      modelCache = { at: Date.now(), ids: ranked };
      return ranked;
    }
  } catch {
    // ниже запасной список
  }
  return FALLBACK;
}

/* ---------------- одна попытка ---------------- */

// ok: ответ годный. daily: дневной лимит. busy: занято, сбой, таймаут, плохой
// ответ. auth: ключ не принят, у этого провайдера пробовать дальше незачем.
// too_large: запрос не влезает в лимит токенов в минуту (Groq, 413), у
// остальных моделей того же провайдера лимит такой же.
type Outcome = { kind: "ok"; text: string } | { kind: "daily" | "busy" | "auth" | "too_large" };

const DAILY_RE = /per[- ]?day|daily|\bRPD\b|\bTPD\b/i;

// Рассуждающие модели иногда кладут ход мысли прямо в ответ.
// Размеченные блоки вырезаются, остальное ловит validate.
function cleanContent(raw: string, unquote: boolean): string {
  const text = raw
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<reasoning>[\s\S]*?<\/reasoning>/gi, "")
    .trim();
  return unquote ? unwrapQuotes(text) : text;
}

// Снимает кавычки, только если они обнимают весь ответ. Раньше срезались любые
// кавычки на краях, и подпись «Отдел продаж «НордТерм»» в демо офиса теряла
// последнюю «»». Пара снимается, только если внутри кавычки остаются парными.
const QUOTE_PAIRS: Record<string, string> = { "«": "»", "“": "”", '"': '"', "'": "'" };

function balancedInside(s: string): boolean {
  for (const [open, close] of [["«", "»"], ["“", "”"]]) {
    let depth = 0;
    for (const ch of s) {
      if (ch === open) depth++;
      else if (ch === close && --depth < 0) return false;
    }
    if (depth !== 0) return false;
  }
  return (s.split('"').length - 1) % 2 === 0;
}

function unwrapQuotes(text: string): string {
  let s = text;
  while (s.length >= 2) {
    const close = QUOTE_PAIRS[s[0]];
    if (!close || s[s.length - 1] !== close) break;
    const inner = s.slice(1, -1).trim();
    if (!balancedInside(inner)) break;
    s = inner;
  }
  return s;
}

async function attempt(
  provider: "groq" | "openrouter",
  model: string,
  url: string,
  headers: Record<string, string>,
  payload: Record<string, unknown>,
  timeoutMs: number,
  opts: AiOpts
): Promise<Outcome> {
  const tag = `[ai${opts.tag ? `:${opts.tag}` : ""}] ${provider} ${model}`;
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), timeoutMs);
  const started = Date.now();
  try {
    const res = await fetch(url, {
      method: "POST",
      signal: ctl.signal,
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(payload),
    });
    const raw = await res.text();
    let data: { choices?: { message?: { content?: unknown } }[]; error?: { code?: unknown; message?: unknown } } | null =
      null;
    try {
      data = JSON.parse(raw);
    } catch {
      // не JSON: разберёмся по коду ответа
    }
    // OpenRouter иногда отвечает 200 с ошибкой внутри тела.
    const code = res.ok ? Number(data?.error?.code) || 0 : res.status;
    if (!res.ok || data?.error) {
      const msg = JSON.stringify(data?.error ?? raw).slice(0, 300);
      console.warn(`${tag} HTTP ${code} ${Date.now() - started}ms: ${msg}`);
      if (code === 429) return { kind: DAILY_RE.test(msg) ? "daily" : "busy" };
      if (code === 401) return { kind: "auth" };
      if (code === 413) return { kind: "too_large" };
      return { kind: "busy" };
    }
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      console.warn(`${tag} empty content ${Date.now() - started}ms`);
      return { kind: "busy" };
    }
    const text = cleanContent(content, !!opts.unquote);
    if (!text || (opts.validate && !opts.validate(text))) {
      console.warn(`${tag} rejected output (${text.length} chars) ${Date.now() - started}ms`);
      return { kind: "busy" };
    }
    console.info(`${tag} ok ${Date.now() - started}ms`);
    return { kind: "ok", text };
  } catch (e) {
    const why = e instanceof Error ? (e.name === "AbortError" ? "timeout" : e.message || e.name) : String(e);
    console.warn(`${tag} failed ${Date.now() - started}ms: ${why}`);
    return { kind: "busy" };
  } finally {
    clearTimeout(timer);
  }
}

/* ---------------- перебор ---------------- */

// Итог провайдера: unusable (нет ключа, ключ не принят, запрос не влезает),
// daily (дневной лимит исчерпан), busy (занято, сбой или не успели).
type ProviderState = "unusable" | "daily" | "busy";

export function groqConfigured(): boolean {
  return !!process.env.GROQ_API_KEY;
}

export function anyProviderConfigured(): boolean {
  return !!process.env.GROQ_API_KEY || !!process.env.OPENROUTER_API_KEY;
}

export async function complete(messages: AiMessage[], opts: AiOpts = {}): Promise<AiResult> {
  const started = Date.now();
  const left = () => TOTAL_BUDGET_MS - (Date.now() - started);
  const maxTokens = opts.maxTokens ?? 512;
  const temperature = opts.temperature ?? 0.7;

  // Groq
  let groq: ProviderState = "unusable";
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    let daily = 0;
    let tried = 0;
    groq = "busy";
    for (const m of GROQ_MODELS) {
      if (left() < MIN_ATTEMPT_MS) break;
      tried++;
      const out = await attempt(
        "groq",
        m.id,
        GROQ_URL,
        { Authorization: `Bearer ${groqKey}` },
        { model: m.id, messages, max_completion_tokens: maxTokens, temperature, ...m.reasoning },
        Math.min(MODEL_TIMEOUT_MS, left()),
        opts
      );
      if (out.kind === "ok") return { ok: true, text: out.text, provider: "groq", model: m.id };
      if (out.kind === "daily") daily++;
      if (out.kind === "auth" || out.kind === "too_large") {
        groq = "unusable";
        break;
      }
    }
    if (groq === "busy" && tried === GROQ_MODELS.length && daily === GROQ_MODELS.length) groq = "daily";
  }

  // OpenRouter
  let openrouter: ProviderState = "unusable";
  const orKey = process.env.OPENROUTER_API_KEY;
  if (orKey) {
    openrouter = "busy";
    if (left() >= MIN_ATTEMPT_MS) {
      for (const model of await openRouterModels()) {
        if (left() < MIN_ATTEMPT_MS) break;
        const out = await attempt(
          "openrouter",
          model,
          OPENROUTER_URL,
          {
            Authorization: `Bearer ${orKey}`,
            "HTTP-Referer": "https://jasur-portfolio-pied.vercel.app",
            "X-Title": opts.title ?? "Jasur Portfolio",
          },
          {
            model,
            messages,
            max_tokens: maxTokens,
            temperature,
            // Бесплатные модели почти все рассуждающие: без этого они могут
            // потратить весь лимит токенов на размышления и вернуть пустоту.
            reasoning: { effort: "low", exclude: true },
          },
          Math.min(MODEL_TIMEOUT_MS, left()),
          opts
        );
        if (out.kind === "ok") return { ok: true, text: out.text, provider: "openrouter", model };
        // Дневной лимит общий на аккаунт: остальные модели скажут то же.
        if (out.kind === "daily") {
          openrouter = "daily";
          break;
        }
        if (out.kind === "auth" || out.kind === "too_large") {
          openrouter = "unusable";
          break;
        }
      }
    }
  }

  const states = [groq, openrouter];
  const reason: AiReason = states.includes("busy") ? "busy" : states.includes("daily") ? "daily" : "busy";
  console.warn(`[ai${opts.tag ? `:${opts.tag}` : ""}] no answer: groq ${groq}, openrouter ${openrouter} ${Date.now() - started}ms`);
  return { ok: false, reason };
}
