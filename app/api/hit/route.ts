import { NextRequest, NextResponse } from "next/server";
import { upstashConfigured, incr } from "@/lib/upstash";

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

export async function POST(req: NextRequest) {
  if (!upstashConfigured()) return NextResponse.json({ ok: false });

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
    keys.push(`jp:path:${slug}:total`, `jp:path:${slug}:${day}`);
  }
  await Promise.all(keys.map((k) => incr(k, k.endsWith("total") ? undefined : DAY_TTL)));
  return NextResponse.json({ ok: true });
}
