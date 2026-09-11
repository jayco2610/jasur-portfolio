// Отдельно от lib/blog.ts, потому что тот читает файлы и не может
// попасть в браузерную сборку, а рубрики нужны и на клиенте.

export const MAGAZINE_NAME = { ru: "Блокнот", en: "Notebook" };

export const RUBRICS = [
  { key: "product", ru: "Продукт", en: "Product" },
  { key: "marketing", ru: "Маркетинг", en: "Marketing" },
  { key: "ai", ru: "AI", en: "AI" },
  { key: "process", ru: "Процесс", en: "Process" },
  { key: "career", ru: "Карьера", en: "Career" },
  { key: "tools", ru: "Инструменты", en: "Tools" },
] as const;

export type RubricKey = (typeof RUBRICS)[number]["key"];

export function rubricName(key: string, lang: "ru" | "en"): string {
  return RUBRICS.find((r) => r.key === key)?.[lang] ?? key;
}
