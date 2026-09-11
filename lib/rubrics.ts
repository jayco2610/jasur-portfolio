// Отдельно от lib/blog.ts, потому что тот читает файлы и не может
// попасть в браузерную сборку, а рубрики нужны и на клиенте.

export const MAGAZINE_NAME = { ru: "Блокнот", en: "Notebook" };

export const RUBRICS = [
  {
    key: "product",
    cover: "/blog/r-product.jpg",
    ru: "Продукт",
    en: "Product",
    descRu:
      "Что делать, чего не делать и почему. На своих проектах.",
    descEn:
      "What to build, what to drop and why. On my own projects.",
  },
  {
    key: "marketing",
    cover: "/blog/r-marketing.jpg",
    ru: "Маркетинг",
    en: "Marketing",
    descRu:
      "Как продавать то, что сделал. Что сработало, что стоило денег зря.",
    descEn:
      "How to sell what you built. What worked, what burned money.",
  },
  {
    key: "ai",
    cover: "/blog/r-ai.jpg",
    ru: "AI",
    en: "AI",
    descRu:
      "Модели, промты, связки. Что из этого работает в деле.",
    descEn:
      "Models, prompts, pipelines. What actually holds up in use.",
  },
  {
    key: "process",
    cover: "/blog/r-process.jpg",
    ru: "Процесс",
    en: "Process",
    descRu:
      "Как устроена работа. Автоматизация, рутина, дневник стройки.",
    descEn:
      "How the work is wired. Automation, routine, a build diary.",
  },
  {
    key: "career",
    cover: "/blog/r-career.jpg",
    ru: "Карьера",
    en: "Career",
    descRu:
      "Резюме, собеседования, переговоры. Всё через себя.",
    descEn:
      "Resumes, interviews, negotiation. All of it first-hand.",
  },
  {
    key: "tools",
    cover: "/blog/r-tools.jpg",
    ru: "Инструменты",
    en: "Tools",
    descRu:
      "Сервисы и цены. Что окупается, что бесплатно только на словах.",
    descEn:
      "Tools and real prices. What earns its keep, what only looks free.",
  },
] as const;

export type RubricKey = (typeof RUBRICS)[number]["key"];

export function rubricName(key: string, lang: "ru" | "en"): string {
  return RUBRICS.find((r) => r.key === key)?.[lang] ?? key;
}

export function rubricCover(key: string): string | undefined {
  return RUBRICS.find((r) => r.key === key)?.cover;
}

export function rubricDescription(key: string, lang: "ru" | "en"): string {
  const r = RUBRICS.find((x) => x.key === key);
  if (!r) return "";
  return lang === "ru" ? r.descRu : r.descEn;
}
