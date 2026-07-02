// Dual-tier rate limiter shared by API routes: durable cross-instance limit
// via Upstash when configured, in-memory fallback otherwise.
// Same behaviour as the limiter inside app/api/chat/route.ts.
import { upstashConfigured, incr } from "@/lib/upstash";

const hits = new Map<string, number[]>();

function rateLimitedInMemory(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > limit;
}

export async function isRateLimited(
  scope: string,
  ip: string,
  limit = 15,
  windowMs = 60_000
): Promise<boolean> {
  if (upstashConfigured()) {
    const window = Math.floor(Date.now() / windowMs);
    const count = await incr(`${scope}:rl:${ip}:${window}`, Math.ceil(windowMs / 1000) + 5);
    if (count != null) return count > limit;
  }
  return rateLimitedInMemory(`${scope}:${ip}`, limit, windowMs);
}
