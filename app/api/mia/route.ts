import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rateLimit";
import { complete, type AiMessage } from "@/lib/ai";
import { miaSystemPrompt } from "@/lib/mia";

// Живая Mia на странице /demos/mia. Принимает вопрос пациента и короткую
// историю переписки, отвечает по документу клиники (lib/mia.ts) через общий
// модуль моделей (lib/ai.ts).
//
// Защита как у /api/demo: лимит частоты по адресу (lib/rateLimit.ts),
// проверка тела запроса, ограничение длины. Документ и правила весят около
// 1,5 тыс. токенов, а у бесплатного Groq 8 тыс. токенов в минуту на модель,
// поэтому история короткая и ответ ограничен 400 токенами.
//
// Ответ: { content } или { error: "busy" | "daily" | "rate_limited" |
// "invalid_request" }. Тексты ошибок для человека на странице демо.

export const maxDuration = 60;

const MAX_QUESTION = 500;
const MAX_HISTORY = 6;
const MAX_HISTORY_ITEM = 1000;

type Turn = { role: "user" | "assistant"; content: string };

function parseHistory(raw: unknown): Turn[] | null {
  if (raw === undefined) return [];
  if (!Array.isArray(raw)) return null;
  return raw
    .filter(
      (m): m is Turn =>
        !!m &&
        typeof (m as Turn).content === "string" &&
        ((m as Turn).role === "user" || (m as Turn).role === "assistant")
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_HISTORY_ITEM) }));
}

// Ответ должен быть на языке вопроса. Ловит рассуждения на английском,
// которые модель иногда вываливает вместо ответа на русский вопрос. Порог
// мягче, чем у демо: в ответах Mia законно стоят латиницей адрес сайта,
// почта и названия вроде E-Max и Amazing White.
function matchesLang(s: string, ru: boolean): boolean {
  const cyr = (s.match(/[а-яё]/gi) ?? []).length;
  const lat = (s.match(/[a-z]/gi) ?? []).length;
  const total = cyr + lat;
  if (total === 0) return false;
  return ru ? cyr / total > 0.6 : lat / total > 0.5;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (await isRateLimited("mia", ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";
  const history = parseHistory(body.history);
  if (!question || question.length > MAX_QUESTION || !history) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const ru = /[а-яё]/i.test(question);
  const messages: AiMessage[] = [
    { role: "system", content: miaSystemPrompt() },
    ...history,
    { role: "user", content: question },
  ];

  const res = await complete(messages, {
    maxTokens: 400,
    temperature: 0.3,
    title: "Mia Clinic Assistant",
    tag: "mia",
    validate: (s) => s.length <= 2000 && matchesLang(s, ru),
  });

  if (!res.ok) return NextResponse.json({ error: res.reason }, { status: 503 });
  return NextResponse.json({ content: plain(res.text) });
}

// Окно чата показывает ответ как текст. Промпт просит обходиться без
// Markdown, но модели иногда всё равно ставят жирное и заголовки: их
// разметка снимается, а пункты списка со звёздочкой или точкой становятся
// строками с дефиса. Длинное тире в ответах сайта не используется, как и в
// демо: в начале строки оно становится дефисом пункта, внутри фразы запятой.
function plain(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/^#{1,6}[ \t]+/gm, "")
    .replace(/^[ \t]*[*•][ \t]+/gm, "- ")
    .replace(/^[ \t]*—[ \t]*/gm, "- ")
    .replace(/[ \t]*—[ \t]*/g, ", ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
