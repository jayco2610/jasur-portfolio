import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostsByRubric, getUsedRubrics, rubricName, RUBRICS } from "@/lib/blog";
import RubricContent from "./RubricContent";

export function generateStaticParams() {
  // Страницы делаем только для рубрик, где есть материалы.
  return getUsedRubrics().map((rubric) => ({ rubric }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ rubric: string }>;
}): Promise<Metadata> {
  const { rubric } = await params;
  const name = rubricName(rubric, "ru");
  return {
    title: `${name} — Jasur Akhmadaliev`,
    description: `Статьи в рубрике «${name}».`,
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

  if (posts.length === 0) notFound();

  return <RubricContent rubric={rubric} posts={posts} allRubrics={getUsedRubrics()} />;
}
