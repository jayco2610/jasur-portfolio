// Minimal Upstash Redis REST client (no dependency).
// Active only when both env vars are present; otherwise callers fall back to
// in-memory behaviour, so nothing breaks before Upstash is connected.

const URL = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export function upstashConfigured(): boolean {
  return Boolean(URL && TOKEN);
}

async function command(args: (string | number)[]): Promise<unknown> {
  if (!URL || !TOKEN) return null;
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: unknown };
    return data.result ?? null;
  } catch {
    return null;
  }
}

// INCR key; set a TTL (seconds) only on the first increment.
export async function incr(key: string, expireSeconds?: number): Promise<number | null> {
  const result = (await command(["INCR", key])) as number | null;
  if (result === 1 && expireSeconds) await command(["EXPIRE", key, expireSeconds]);
  return result;
}

export async function getNumber(key: string): Promise<number | null> {
  const v = (await command(["GET", key])) as string | null;
  return v == null ? null : Number(v);
}
