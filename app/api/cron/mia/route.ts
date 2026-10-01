// Побудка Mia. Живой ассистент стоит на бесплатном пространстве Hugging Face,
// а оно засыпает после 48 часов без посетителей. Спящее пространство не
// отвечает, пока не проснётся, и человек, нажавший кнопку на странице демо,
// видит экран загрузки вместо ассистента.
//
// Будит его обычный GET на домен пространства: так 1 октября 2026 его и
// подняли из сна руками. Маршрут делает ровно это раз в сутки по расписанию
// Vercel (vercel.json). Суток хватает с запасом: до сна 48 часов. Чаще
// бесплатный тариф Vercel cron и не разрешает.
//
// Отвечает кодом, который вернуло пространство. Если пространство ответило
// ошибкой или не ответило вовсе, маршрут отдаёт 502, и в журнале cron на
// Vercel это видно как сбой.
//
// Защита. Если в окружении задан CRON_SECRET, Vercel сам подставляет его в
// заголовок Authorization при вызове по расписанию, и без него маршрут
// отвечает 401. Если секрета нет, маршрут открыт: он ничего не раскрывает и
// ничего не тратит, кроме одного запроса к пространству.

export const maxDuration = 30;

const SPACE = "https://rag-jasur-mia-clinic-assistant.hf.space/";

// Просыпающееся пространство может отвечать медленно. Сам запрос уже
// запустил пробуждение, поэтому ждать дольше 25 секунд незачем.
const TIMEOUT_MS = 25_000;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const started = Date.now();
  try {
    const res = await fetch(SPACE, {
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "user-agent": "jasur-portfolio-cron/1.0 (+wake Mia)" },
    });
    // Тело не нужно, но его надо прочитать или отменить, иначе соединение
    // висит до конца функции.
    await res.body?.cancel();
    return Response.json(
      { space: SPACE, status: res.status, ms: Date.now() - started },
      { status: res.ok ? 200 : 502 },
    );
  } catch (e) {
    const timeout = e instanceof Error && e.name === "TimeoutError";
    return Response.json(
      { space: SPACE, status: null, error: timeout ? "timeout" : "fetch_failed", ms: Date.now() - started },
      { status: 502 },
    );
  }
}
