/* Запрос к живому ИИ для демо «Для компаний»: тот же маршрут POST /api/demo,
   что у остатков и отзывов. Отличие одно: ошибка не сводится к одному
   «недоступно». Человек должен понять, что случилось: модель занята (503),
   он сам нажал слишком часто (429) или пропала сеть. */

export type DemoError = "rate" | "unavailable";

export type DemoResult<T> = { ok: true; data: T } | { ok: false; error: DemoError };

export async function askDemo<T extends { content: string }>(body: Record<string, unknown>): Promise<DemoResult<T>> {
  try {
    const res = await fetch("/api/demo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status === 429) return { ok: false, error: "rate" };
    const data = await res.json().catch(() => null);
    if (!res.ok || !data || typeof data.content !== "string" || !data.content) {
      return { ok: false, error: "unavailable" };
    }
    return { ok: true, data: data as T };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}

export const DEMO_ERRORS: Record<"en" | "ru", Record<DemoError, string>> = {
  en: {
    unavailable: "The model is unavailable right now. Try again in a minute, the rest of the demo still works.",
    rate: "Too many requests in a row. Wait a minute and try again.",
  },
  ru: {
    unavailable: "Модель сейчас недоступна. Попробуйте через минуту, остальная часть демо работает.",
    rate: "Слишком много запросов подряд. Подождите минуту и попробуйте снова.",
  },
};

/* Числа в демо пишутся по-русски в обоих языках (пробел между разрядами),
   как в остальных демо: 1 290 ₽. */
export function rub(n: number): string {
  return `${Math.round(n).toLocaleString("ru-RU")} ₽`;
}
