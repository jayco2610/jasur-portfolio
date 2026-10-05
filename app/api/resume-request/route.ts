import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rateLimit";
import { upstashConfigured } from "@/lib/upstash";
import { parseResumeBody } from "@/lib/resumeRequest";
import { saveResumeRequest } from "@/lib/workshopBotRuntime";

// Запрос резюме из анкеты на «Обо мне» (app/about/ResumeRequest.tsx).
// Заявка ложится в Upstash и сразу уходит Жасуру через бота Мастерской
// (@jasur_workshop_bot). Если он ещё не нажал /start в боте, заявка ждёт в
// очереди resume:pending и придёт при /start. Поля и тексты в
// lib/resumeRequest.ts, хранение и отправка в lib/workshopBotRuntime.ts.
//
// Ответы:
//   200  { ok: true, n }  заявка записана в Upstash (только в этом случае);
//   400  тело не разобрать, нет почты или она кривая, роль не из списка,
//        пустое поле, слишком длинно, заполнено поле-ловушка;
//   429  больше пяти запросов с одного адреса за десять минут;
//   503  хранилище не подключено или не ответило.

export const maxDuration = 30;

// Каждая заявка шлёт Жасуру сообщение в Telegram, поэтому потолок строже,
// чем у подписки: пять за десять минут. Человеку хватит на заявку и
// несколько повторов после ошибки сети.
const LIMIT = 5;
const WINDOW_MS = 10 * 60_000;
// Все поля вместе меньше килобайта. Тело в разы больше отсекается до разбора.
const MAX_BODY = 8_000;

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (await isRateLimited("resume", ip, LIMIT, WINDOW_MS)) {
    return NextResponse.json({ ok: false, reason: "rate" }, { status: 429 });
  }

  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY) {
    return NextResponse.json({ ok: false, reason: "long" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad" }, { status: 400 });
  }

  const parsed = parseResumeBody(body);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, reason: parsed.reason }, { status: 400 });
  }

  if (!upstashConfigured()) {
    return NextResponse.json({ ok: false, reason: "off" }, { status: 503 });
  }

  const saved = await saveResumeRequest(process.env.WORKSHOP_BOT_TOKEN, parsed.draft, Date.now());
  if (!saved || !saved.stored) {
    return NextResponse.json({ ok: false, reason: "off" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, n: saved.n });
}
