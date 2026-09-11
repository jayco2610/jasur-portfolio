import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { RUBRICS, type RubricKey } from "./rubrics";

export { RUBRICS, rubricName, type RubricKey } from "./rubrics";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
  lang: "ru" | "en";
  rubric: RubricKey;
  tags: string[];
  // Необязательная обложка. Если её нет, карточка собирается типографикой.
  cover?: string;
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

  const rubric = RUBRICS.some((r) => r.key === data.rubric)
    ? (data.rubric as RubricKey)
    : "personal";

  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    description: String(data.description ?? ""),
    lang: data.lang === "en" ? "en" : "ru",
    rubric,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: data.cover ? String(data.cover) : undefined,
    canonical: data.canonical ? String(data.canonical) : undefined,
    draft: data.draft === true,
    html: marked.parse(content) as string,
    readingMinutes: Math.max(1, Math.round(words / 180)),
  };
}

export function getPostsByRubric(rubric: string): Post[] {
  return getAllPosts().filter((p) => p.rubric === rubric);
}

// Рубрики, в которых реально есть статьи. Пустые в меню не показываем.
export function getUsedRubrics(): RubricKey[] {
  const used = new Set(getAllPosts().map((p) => p.rubric));
  return RUBRICS.filter((r) => used.has(r.key)).map((r) => r.key);
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
