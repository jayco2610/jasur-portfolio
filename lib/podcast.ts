import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import type { Episode } from "./show";

const DIR = path.join(process.cwd(), "content/podcast");

export { SHOW } from "./show";
export type { Episode, EpisodeKind } from "./show";

marked.setOptions({ gfm: true, breaks: false });

function toSeconds(stamp: string): number {
  const parts = stamp.split(":").map((n) => Number(n));
  if (parts.some(Number.isNaN)) return 0;
  return parts.reduce((acc, n) => acc * 60 + n, 0);
}

function parse(filename: string): Episode {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(DIR, filename), "utf8");
  const { data, content } = matter(raw);

  const chapters = (Array.isArray(data.chapters) ? data.chapters : []).map((c: unknown) => {
    const line = String(c);
    const [stamp, ...rest] = line.split(/\s+[—-]\s+/);
    return { at: toSeconds(stamp.trim()), stamp: stamp.trim(), label: rest.join(" ").trim() };
  });

  const links = (Array.isArray(data.links) ? data.links : []).map((l: unknown) => {
    const line = String(l);
    const [href, ...rest] = line.split(/\s+[—-]\s+/);
    let host = href;
    try {
      host = new URL(href).hostname.replace(/^www\./, "");
    } catch {
      // Ссылка кривая, оставляем как есть.
    }
    return { href: href.trim(), text: rest.join(" ").trim() || host, host };
  });

  return {
    slug,
    number: Number(data.number ?? 0),
    kind: data.kind === "voice" ? "voice" : "talk",
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    description: String(data.description ?? ""),
    lang: data.lang === "en" ? "en" : "ru",
    audio: String(data.audio ?? ""),
    duration: String(data.duration ?? ""),
    cover: data.cover ? String(data.cover) : undefined,
    guest: data.guest ? String(data.guest) : undefined,
    guestRole: data.guestRole ? String(data.guestRole) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    chapters,
    links,
    html: DOMPurify.sanitize(marked.parse(content) as string),
    draft: data.draft === true,
  };
}

export function getEpisodes(): Episode[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parse)
    .filter((e) => !e.draft && e.audio)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getEpisode(slug: string): Episode | null {
  // Адрес приходит из ссылки, поэтому в имя файла пускаем только
  // латиницу, цифры и дефис.
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const file = `${slug}.md`;
  if (!fs.existsSync(path.join(DIR, file))) return null;
  const ep = parse(file);
  return ep.draft ? null : ep;
}

export function getEpisodeSlugs(): string[] {
  return getEpisodes().map((e) => e.slug);
}
