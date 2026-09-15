import { getAllSlugs, getPostSource } from "@/lib/blog";

// Исходный текст опубликованной статьи для админки. Всё это и так открыто на сайте,
// черновики сюда не попадают. Собирается при выкладке, как и сами статьи.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const src = getPostSource(slug);
  if (!src) return new Response("Not found", { status: 404 });
  const { meta, markdown } = src;
  return Response.json({
    slug: meta.slug,
    title: meta.title,
    description: meta.description,
    date: meta.date,
    lang: meta.lang,
    rubric: meta.rubric,
    translation: meta.translation ?? null,
    cover: meta.cover ?? null,
    tags: meta.tags,
    markdown,
  });
}
