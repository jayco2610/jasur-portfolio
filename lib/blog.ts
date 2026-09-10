import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
  lang: "ru" | "en";
  tags: string[];
  // Заполняется, только если текст сначала вышел на чужой площадке.
  // Тогда поисковик считает оригиналом её, а не наш сайт.
  canonical?: string;
  draft?: boolean;
};

export type Post = PostMeta & {
  html: string;
  readingMinutes: number;
};

marked.setOptions({ gfm: true, breaks: false });

function readFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
}

function parseFile(filename: string): Post {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  const words = content.trim().split(/\s+/).length;

  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    description: String(data.description ?? ""),
    lang: data.lang === "en" ? "en" : "ru",
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    canonical: data.canonical ? String(data.canonical) : undefined,
    draft: data.draft === true,
    html: marked.parse(content) as string,
    readingMinutes: Math.max(1, Math.round(words / 180)),
  };
}

export function getAllPosts(): Post[] {
  return readFiles()
    .map(parseFile)
    .filter((p) => !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | null {
  const file = `${slug}.md`;
  if (!fs.existsSync(path.join(BLOG_DIR, file))) return null;
  const post = parseFile(file);
  return post.draft ? null : post;
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

export function formatDate(date: string, lang: "ru" | "en"): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
