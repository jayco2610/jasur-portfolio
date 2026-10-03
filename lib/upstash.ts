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

// Добавляет значение в набор. Набор, а не список, потому что один и тот же
// адрес, введённый дважды, не должен попасть в подписку два раза.
// Возвращает 1, если адрес новый, 0 если уже был, null если хранилище недоступно.
export async function addToSet(key: string, value: string): Promise<number | null> {
  return (await command(["SADD", key, value])) as number | null;
}

export async function setSize(key: string): Promise<number | null> {
  return (await command(["SCARD", key])) as number | null;
}

// Строки, списки и удаление. Нужны боту заявок Мастерской
// (lib/workshopBotRuntime.ts): там лежат состояние разговора, сами заявки и
// номер админа.

export async function getString(key: string): Promise<string | null> {
  const v = await command(["GET", key]);
  return v == null ? null : String(v);
}

// SET с необязательным сроком жизни в секундах. true, если записалось.
export async function setString(
  key: string,
  value: string,
  expireSeconds?: number
): Promise<boolean> {
  const args: (string | number)[] = ["SET", key, value];
  if (expireSeconds) args.push("EX", expireSeconds);
  return (await command(args)) === "OK";
}

export async function deleteKeys(...keys: string[]): Promise<number | null> {
  if (keys.length === 0) return 0;
  return (await command(["DEL", ...keys])) as number | null;
}

// LPUSH: новое значение встаёт в начало списка, поэтому LRANGE 0 9 отдаёт
// десять самых свежих. Возвращает новую длину списка.
export async function pushToList(key: string, value: string): Promise<number | null> {
  return (await command(["LPUSH", key, value])) as number | null;
}

// RPUSH: значение встаёт в конец, порядок прихода сохраняется.
export async function appendToList(key: string, value: string): Promise<number | null> {
  return (await command(["RPUSH", key, value])) as number | null;
}

// LRANGE. Пустой список и недоступное хранилище оба дают [].
export async function listRange(key: string, start: number, stop: number): Promise<string[]> {
  const v = await command(["LRANGE", key, start, stop]);
  return Array.isArray(v) ? v.map(String) : [];
}

export async function listLength(key: string): Promise<number | null> {
  return (await command(["LLEN", key])) as number | null;
}

// LREM key 0 value: убирает из списка все копии значения.
export async function removeFromList(key: string, value: string): Promise<number | null> {
  return (await command(["LREM", key, 0, value])) as number | null;
}
