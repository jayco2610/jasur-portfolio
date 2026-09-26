import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostsByRubric, rubricName, RUBRICS } from "@/lib/blog";
import { rubricDescription } from "@/lib/rubrics";
import RubricContent from "./RubricContent";

// Кроме рубрик, собранных при сборке, никаких других адресов не существует.
// Без этого Next пытается собрать незнакомый адрес прямо на сервере, а там
// нет папки content, и вместо честной 404 читатель видит ошибку.
export const dynamicParams = false;

// Страницы делаем для всех рубрик, даже пустых: раздел в меню есть,
// значит он обязан открываться, а не отдавать «страница не найдена».
export function generateStaticParams() {
  return RUBRICS.map((r) => ({ rubric: r.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ rubric: string }>;
}): Promise<Metadata> {
  const { rubric } = await params;
  const name = rubricName(rubric, "ru");
  const isEmpty = getPostsByRubric(rubric).length === 0;

  return {
    title: `${name} — Jasur / Log`,
    description: rubricDescription(rubric, "ru"),
    // Пустую рубрику в поиск не отдаём, чтобы не плодить тонкие страницы.
    robots: isEmpty ? { index: false, follow: true } : undefined,
  };
}

export default async function RubricPage({
  params,
}: {
  params: Promise<{ rubric: string }>;
}) {
  const { rubric } = await params;
  if (!RUBRICS.some((r) => r.key === rubric)) notFound();

  const posts = getPostsByRubric(rubric).map(({ html, readingMinutes, ...meta }) => {
    void html;
    void readingMinutes;
    return meta;
  });

  return <RubricContent rubric={rubric} posts={posts} />;
}
