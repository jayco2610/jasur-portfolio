import { NextRequest, NextResponse } from "next/server";
import { upstashConfigured, incr } from "@/lib/upstash";
import { isRateLimited } from "@/lib/rateLimit";

// Свой счётчик действий. Считает только названия событий и даты: ни адресов,
// ни куки, ни личных данных. Нужен потому, что аналитика Vercel на бесплатном
// тарифе показывает посещения, но не показывает, что человек сделал на сайте.

const ACTIONS = new Set([
  "page",
  "chat_ask",
  "subscribe",
  "telegram_click",
  "demo_open",
  "podcast_play",
]);

const DAY_TTL = 60 * 60 * 24 * 40;
const PATH_TTL = 60 * 60 * 24 * 400;
const SAFE = /^[a-z0-9/\-_]{1,60}$/;

// Считаем только страницы разумного вида: раздел из списка ниже либо статья,
// выпуск подкаста, рубрика или демо. Читать список статей с диска здесь нельзя:
// в серверной функции этих файлов нет, и счётчик падал с ошибкой.
const PAGES = new Set([
  "home",
  "blog",
  "podcast",
  "projects",
  "resume",
  "services",
  "writing",
  "demos",
  "stats",
  "privacy",
]);
const SECTIONS = /^(blog|podcast|demos|blog-tema)-[a-z0-9][a-z0-9-]{0,58}$/;
const knownPage = (slug: string) => PAGES.has(slug) || SECTIONS.test(slug);

export async function POST(req: NextRequest) {
  if (!upstashConfigured()) return NextResponse.json({ ok: false });

  // Счётчик открыт всему интернету, поэтому ограничиваем частоту: база у сайта общая
  // с админкой, и если её лимит выжечь, перестанут открываться черновики и ключи площадок.
  const ip = req.headers.get("x-vercel-forwarded-for") ?? req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (await isRateLimited("hit", ip, 60, 60_000)) return NextResponse.json({ ok: false }, { status: 429 });

  let event = "";
  let path = "";
  try {
    const body = (await req.json()) as { event?: unknown; path?: unknown };
    if (typeof body.event === "string") event = body.event;
    if (typeof body.path === "string") path = body.path;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!ACTIONS.has(event)) return NextResponse.json({ ok: false }, { status: 400 });

  const day = new Date().toISOString().slice(0, 10);
  const keys = [`jp:${event}:total`, `jp:${event}:${day}`];
  if (event === "page" && SAFE.test(path)) {
    const slug = path === "/" ? "home" : path.replace(/^\//, "").replace(/\//g, "-");
    if (knownPage(slug)) keys.push(`jp:path:${slug}:total`, `jp:path:${slug}:${day}`);
  }
  // Общие итоги живут вечно, а итоги по отдельным страницам чуть больше года:
  // тогда случайный мусор в базе сам исчезает и не занимает место навсегда.
  await Promise.all(
    keys.map((k) => incr(k, k.endsWith("total") ? (k.startsWith("jp:path:") ? PATH_TTL : undefined) : DAY_TTL))
  );
  return NextResponse.json({ ok: true });
}
