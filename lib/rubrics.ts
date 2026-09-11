// Отдельно от lib/blog.ts, потому что тот читает файлы и не может
// попасть в браузерную сборку, а рубрики нужны и на клиенте.

export const RUBRICS = [
  { key: "marketing", ru: "Маркетинг", en: "Marketing" },
  { key: "product", ru: "Продукт", en: "Product" },
  { key: "numbers", ru: "Цифры", en: "Numbers" },
  { key: "ai", ru: "AI", en: "AI" },
  { key: "personal", ru: "Личное", en: "Personal" },
] as const;

export type RubricKey = (typeof RUBRICS)[number]["key"];

export function rubricName(key: string, lang: "ru" | "en"): string {
  return RUBRICS.find((r) => r.key === key)?.[lang] ?? key;
}
