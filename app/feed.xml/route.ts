import { getAllPosts } from "@/lib/blog";

const SITE = "https://jasur-portfolio-pied.vercel.app";

// Лента собирается при сборке и дальше отдаётся как файл. Иначе на Vercel
// функция не находит папку content: она не попадает в её сборку, потому что
// путь к ней вычисляется в момент запроса.
export const dynamic = "force-static";


function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getAllPosts();

  const items = posts
    .map((post) => {
      const url = `${SITE}/blog/${post.slug}`;
      const pubDate = post.date ? new Date(post.date).toUTCString() : "";
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/feed.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Блокнот · блог Жасура Ахмадалиева</title>
    <link>${SITE}/writing</link>
    <description>Продукт, маркетинг и AI. Только то, что я делаю сам.</description>
    <language>ru</language>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
