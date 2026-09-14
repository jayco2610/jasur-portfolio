import { getAllPosts } from "@/lib/blog";
import { getEpisodes } from "@/lib/podcast";

// Открытый список того, что лежит на сайте. Нужен админке, чтобы показывать
// состояние журнала, не спрашивая ключей и не читая репозиторий.
// Здесь нет ничего, чего не видно на самом сайте: заголовки, даты, рубрики.
export const dynamic = "force-static";

export async function GET() {
  const posts = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    lang: p.lang,
    rubric: p.rubric,
    translation: p.translation ?? null,
    cover: p.cover ?? null,
    featured: p.featured ?? false,
    minutes: p.readingMinutes,
  }));

  const episodes = getEpisodes().map((e) => ({
    slug: e.slug,
    title: e.title,
    date: e.date,
    lang: e.lang,
    kind: e.kind,
    duration: e.duration,
  }));

  return Response.json(
    { generatedAt: new Date().toISOString(), posts, episodes },
    { headers: { "Cache-Control": "public, max-age=0, s-maxage=3600" } }
  );
}
