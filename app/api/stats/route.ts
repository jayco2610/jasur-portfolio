import { NextResponse } from "next/server";
import { upstashConfigured, getNumber } from "@/lib/upstash";

// Public, read-only: how many prompt-injection / meta probes the bot has blocked.
// Returns { blocked: null } until Upstash is connected (badge stays hidden).
export async function GET() {
  if (!upstashConfigured()) {
    return NextResponse.json({ blocked: null });
  }
  const blocked = await getNumber("jgpt:blocked:total");
  return NextResponse.json({ blocked: blocked ?? 0 });
}
