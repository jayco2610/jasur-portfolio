import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rateLimit";
import { upstashConfigured, addToSet } from "@/lib/upstash";

// Единственное, что здесь хранится, это сам адрес почты. Ни имени, ни
// страницы, с которой пришли, ни чего-либо ещё: чем меньше данных лежит,
// тем меньше можно потерять.
const KEY = "jblog:subs";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  // Без потолка форму за ночь забьют мусором с одного адреса.
  if (await isRateLimited("subscribe", ip, 5, 60_000)) {
    return NextResponse.json({ ok: false, reason: "rate" }, { status: 429 });
  }

  let email = "";
  try {
    const body = (await req.json()) as { email?: unknown };
    email = String(body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ ok: false, reason: "bad" }, { status: 400 });
  }

  // Проверка нарочно простая. Полная проверка почты по стандарту отсекает
  // живые адреса, а мусорные всё равно отсеются при первой же отправке.
  if (email.length > 160 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ ok: false, reason: "bad" }, { status: 400 });
  }

  if (!upstashConfigured()) {
    return NextResponse.json({ ok: false, reason: "off" }, { status: 503 });
  }

  const added = await addToSet(KEY, email);
  if (added == null) {
    return NextResponse.json({ ok: false, reason: "off" }, { status: 503 });
  }

  // added === 0 значит адрес уже подписан. Читателю про это говорить нечего,
  // результат для него тот же самый.
  return NextResponse.json({ ok: true });
}
