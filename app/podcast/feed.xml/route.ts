import fs from "fs";
import path from "path";
import { getEpisodes, SHOW } from "@/lib/podcast";

const SITE = "https://jasur-portfolio-pied.vercel.app";
const AUTHOR = "Jasur Akhmadaliev";
// Apple Podcasts требует почту владельца, но она попадает в открытую ленту,
// и её собирают спам-боты. Заводим отдельный ящик под подкаст и вписываем
// его сюда прямо перед подачей заявки в каталоги. Личную почту не ставим.
const OWNER_EMAIL = "";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Каталогам нужен точный размер файла в байтах, иначе выпуск не принимают.
// Для своих файлов берём его с диска, для чужих ссылок ставим ноль.
function byteSize(audio: string): number {
  if (!audio.startsWith("/")) return 0;
  try {
    return fs.statSync(path.join(process.cwd(), "public", audio)).size;
  } catch {
    return 0;
  }
}

function mime(audio: string): string {
  if (audio.endsWith(".m4a")) return "audio/mp4";
  if (audio.endsWith(".ogg") || audio.endsWith(".oga")) return "audio/ogg";
  if (audio.endsWith(".wav")) return "audio/wav";
  return "audio/mpeg";
}

// Длительность в RSS пишется секундами или как чч:мм:сс.
// В файле она человеческая: «48 мин».
function seconds(duration: string): string {
  const h = /(\d+)\s*(ч|h)/.exec(duration);
  const m = /(\d+)\s*(мин|м|min|m)\b/.exec(duration);
  const total = (h ? Number(h[1]) * 3600 : 0) + (m ? Number(m[1]) * 60 : 0);
  return total > 0 ? String(total) : "";
}

export async function GET() {
  const episodes = getEpisodes();

  const items = episodes
    .map((ep) => {
      const url = `${SITE}/podcast/${ep.slug}`;
      const audio = ep.audio.startsWith("/") ? `${SITE}${ep.audio}` : ep.audio;
      const pubDate = ep.date ? new Date(ep.date).toUTCString() : "";
      const dur = seconds(ep.duration);
      const cover = ep.cover ?? SHOW.cover;
      return `    <item>
      <title>${escapeXml(ep.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(ep.description)}</description>
      <itunes:summary>${escapeXml(ep.description)}</itunes:summary>
      <itunes:author>${AUTHOR}</itunes:author>
      <itunes:image href="${SITE}${cover}" />
      <itunes:episodeType>${ep.kind === "voice" ? "bonus" : "full"}</itunes:episodeType>
      ${ep.number > 0 && ep.kind === "talk" ? `<itunes:episode>${ep.number}</itunes:episode>` : ""}
      ${dur ? `<itunes:duration>${dur}</itunes:duration>` : ""}
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ""}
      <enclosure url="${escapeXml(audio)}" length="${byteSize(ep.audio)}" type="${mime(ep.audio)}" />
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SHOW.name)}</title>
    <link>${SITE}/podcast</link>
    <description>${escapeXml(`${SHOW.ru.tagline} ${SHOW.ru.about}`)}</description>
    <language>ru</language>
    <copyright>${AUTHOR}</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/podcast/feed.xml" rel="self" type="application/rss+xml" />
    <itunes:author>${AUTHOR}</itunes:author>
    <itunes:summary>${escapeXml(`${SHOW.ru.tagline} ${SHOW.ru.about}`)}</itunes:summary>
    <itunes:type>episodic</itunes:type>
    <itunes:explicit>false</itunes:explicit>
    <itunes:image href="${SITE}${SHOW.cover}" />
    <itunes:category text="Business">
      <itunes:category text="Entrepreneurship" />
    </itunes:category>
    <itunes:category text="Technology" />
    <itunes:owner>
      <itunes:name>${AUTHOR}</itunes:name>${
        OWNER_EMAIL ? `\n      <itunes:email>${OWNER_EMAIL}</itunes:email>` : ""
      }
    </itunes:owner>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
