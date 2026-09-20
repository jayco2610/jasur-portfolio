import { NextRequest, NextResponse } from "next/server";
import { upstashConfigured, incr } from "@/lib/upstash";
import { isRateLimited } from "@/lib/rateLimit";
import { getAllPosts } from "@/lib/blog";

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
const SAFE = /^[a-z0-9/\-_]{1,60}$/;

// Считаем только страницы, которые на сайте правда есть. Иначе кто угодно
// мог бы насоздавать в базе сколько угодно вечных записей чужими адресами.
const PAGES = new Set(["home", "blog", "podcast", "about", "now", "stats", "privacy"]);
let known: Set<string> | null = null;
function knownPage(slug: string): boolean {
  if (PAGES.has(slug)) return true;
  if (!known) {
    known = new Set(getAllPosts().flatMap((p) => [`blog-${p.slug}`, `podcast-${p.slug}`]));
  }
  return known.has(slug);
}

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
  await Promise.all(keys.map((k) => incr(k, k.endsWith("total") ? undefined : DAY_TTL)));
  return NextResponse.json({ ok: true });
}
