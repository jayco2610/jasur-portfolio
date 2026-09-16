import { upstashConfigured, getNumber } from "@/lib/upstash";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

const ACTIONS: [string, string][] = [
  ["page", "Открытий страниц"],
  ["chat_ask", "Вопросов JasurGPT"],
  ["subscribe", "Подписок на журнал"],
  ["podcast_play", "Запусков подкаста"],
  ["demo_open", "Открытий демо"],
  ["telegram_click", "Переходов в Telegram"],
];

const PAGES: [string, string][] = [
  ["home", "Главная"],
  ["projects", "Проекты"],
  ["services", "Услуги"],
  ["demos", "Демо"],
  ["writing", "Журнал"],
  ["podcast", "Подкаст"],
  ["resume", "Резюме"],
];

function days(n: number): string[] {
  return Array.from({ length: n }, (_, i) => new Date(Date.now() - i * 86400000).toISOString().slice(0, 10));
}

async function row(prefix: string, key: string) {
  const last7 = days(7);
  const today = (await getNumber(`${prefix}:${key}:${last7[0]}`)) ?? 0;
  const week = (await Promise.all(last7.map((d) => getNumber(`${prefix}:${key}:${d}`)))).reduce(
    (s: number, x) => s + (x ?? 0),
    0
  );
  const total = (await getNumber(`${prefix}:${key}:total`)) ?? 0;
  return { today, week, total };
}

export default async function Stats({ searchParams }: { searchParams: Promise<{ key?: string }> }) {
  const { key } = await searchParams;
  const secret = process.env.STATS_KEY;

  if (!secret || key !== secret) {
    return (
      <main style={{ padding: "60px 24px", maxWidth: 720, margin: "0 auto" }}>
        <h1>Счётчик</h1>
        <p>Страница открывается по личной ссылке с ключом.</p>
      </main>
    );
  }
  if (!upstashConfigured()) {
    return (
      <main style={{ padding: "60px 24px", maxWidth: 720, margin: "0 auto" }}>
        <h1>Счётчик</h1>
        <p>Хранилище не подключено: нет переменных UPSTASH_REDIS_REST_URL и UPSTASH_REDIS_REST_TOKEN.</p>
      </main>
    );
  }

  const actions = await Promise.all(ACTIONS.map(async ([k, label]) => ({ label, ...(await row("jp", k)) })));
  const pages = await Promise.all(PAGES.map(async ([k, label]) => ({ label, ...(await row("jp:path", k)) })));

  const table = (title: string, rows: { label: string; today: number; week: number; total: number }[]) => (
    <section style={{ marginTop: 34 }}>
      <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: ".08em", opacity: 0.6 }}>{title}</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", fontVariantNumeric: "tabular-nums", marginTop: 10 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
            <th style={{ padding: "8px 0" }}>Что</th>
            <th style={{ padding: "8px 0", textAlign: "right" }}>Сегодня</th>
            <th style={{ padding: "8px 0", textAlign: "right" }}>7 дней</th>
            <th style={{ padding: "8px 0", textAlign: "right" }}>Всего</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "8px 0" }}>{r.label}</td>
              <td style={{ padding: "8px 0", textAlign: "right" }}>{r.today}</td>
              <td style={{ padding: "8px 0", textAlign: "right" }}>{r.week}</td>
              <td style={{ padding: "8px 0", textAlign: "right" }}>{r.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );

  return (
    <main style={{ padding: "48px 24px", maxWidth: 760, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32, margin: 0 }}>Счётчик портфолио</h1>
      {table("Действия", actions)}
      {table("Страницы", pages)}
      <p style={{ opacity: 0.6, fontSize: 14, marginTop: 28 }}>
        Считаются только эти события. Адреса посетителей не хранятся, дневные ключи удаляются через 40 дней.
      </p>
    </main>
  );
}
