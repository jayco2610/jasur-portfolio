import { ogCard } from "../../../_og/card";
import { RUBRICS, rubricName, MAGAZINE_NAME } from "@/lib/rubrics";

/* Картинка превью ссылки на рубрику, 1200 × 630: название рубрики крупно,
   издание мелко. Как устроена и откуда шрифт, см. app/_og/card.tsx.

   Рубрик шесть и других не бывает, поэтому картинки собираются при сборке,
   все шесть, как и сами страницы рубрик. */

export const alt = MAGAZINE_NAME.ru;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return RUBRICS.map((r) => ({ rubric: r.key }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ rubric: string }>;
}) {
  const { rubric } = await params;
  return ogCard({ title: rubricName(rubric, "ru"), kicker: MAGAZINE_NAME.ru, mark: true });
}
