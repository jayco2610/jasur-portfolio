import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
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
  // Ставит материал на первое место в журнале независимо от даты.
  // Иначе, чтобы поднять статью наверх, пришлось бы врать датой.
  featured?: boolean;
  // Обложка-постер показывается целиком, а не срезается в широкую полосу.
  // Для нарисованных обложек, где важна вся композиция и заголовок.
  coverFit?: "poster";
  // Адрес того же текста на другом языке. Ставится в обоих файлах,
  // чтобы ссылка работала в обе стороны.
  translation?: string;
  draft?: boolean;
};

// Оглавление, иллюстрации и источники вытаскиваются из готового html один раз
// на сервере. Иначе за них пришлось бы платить работой браузера у читателя.
export type Heading = { id: string; text: string; level: 2 | 3 };
export type Figure = { id: string; src: string; alt: string; index: number };
export type SourceLink = { href: string; text: string; host: string; index: number };

export type Post = PostMeta & {
  html: string;
  readingMinutes: number;
  headings: Heading[];
  figures: Figure[];
  links: SourceLink[];
};

const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

function slugify(text: string): string {
  const s = text
    .toLowerCase()
    .replace(/[а-яё]/g, (c) => TRANSLIT[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return s || "razdel";
}

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function enrich(rawHtml: string, lang: "ru" | "en") {
  const figures: Figure[] = [];
  const headings: Heading[] = [];
  const links: SourceLink[] = [];
  let html = rawHtml;

  // Одинокая картинка в абзаце это иллюстрация. Ей нужен номер и подпись,
  // чтобы на неё можно было сослаться прямо в тексте.
  const capLabel = lang === "ru" ? "Илл." : "Fig.";
  html = html.replace(/<p>\s*(<img\b[^>]*>)\s*<\/p>/g, (_m, img: string) => {
    const src = /src="([^"]*)"/.exec(img)?.[1] ?? "";
    const alt = /alt="([^"]*)"/.exec(img)?.[1] ?? "";
    const index = figures.length + 1;
    const id = `ill-${index}`;
    figures.push({ id, src, alt, index });
    return (
      `<figure class="mag-fig" id="${id}">` +
      `<img src="${src}" alt="${alt}" loading="lazy" />` +
      `<figcaption><b>${capLabel} ${index}</b>${alt ? ` ${alt}` : ""}</figcaption>` +
      `</figure>`
    );
  });

  // Без якорей на заголовках оглавление никуда не ведёт.
  const used = new Set<string>();
  html = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_m, lvl: string, inner: string) => {
    const text = stripTags(inner);
    let id = slugify(text);
    while (used.has(id)) id += "-2";
    used.add(id);
    headings.push({ id, text, level: Number(lvl) as 2 | 3 });
    return `<h${lvl} id="${id}">${inner}</h${lvl}>`;
  });

  // Чужие ссылки собираем в источники и уводим в новую вкладку,
  // чтобы человек не терял место в статье.
  html = html.replace(
    /<a\s+href="(https?:\/\/[^"]+)"([^>]*)>([\s\S]*?)<\/a>/g,
    (_m, href: string, attrs: string, inner: string) => {
      let host = href;
      try {
        host = new URL(href).hostname.replace(/^www\./, "");
      } catch {
        // Ссылка кривая, оставляем как есть.
      }
      if (!links.some((l) => l.href === href)) {
        links.push({ href, text: stripTags(inner) || host, host, index: links.length + 1 });
      }
      const extra = attrs.includes("target=") ? attrs : `${attrs} target="_blank" rel="noopener noreferrer"`;
      return `<a href="${href}"${extra}>${inner}</a>`;
    }
  );

  return { html, headings, figures, links };
}

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
  const lang: "ru" | "en" = data.lang === "en" ? "en" : "ru";

  // Сейчас статьи это наши же файлы, но когда тексты поедут из админки,
  // без очистки любой скрипт в статье выполнится на нашем домене.
  const clean = DOMPurify.sanitize(marked.parse(content) as string);
  const { html, headings, figures, links } = enrich(clean, lang);

  // Если рубрика не указана или написана с ошибкой, кладём материал
  // в «Процесс», иначе он пропадёт из журнала целиком.
  const rubric: RubricKey = RUBRICS.some((r) => r.key === data.rubric)
    ? (data.rubric as RubricKey)
    : "process";

  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    description: String(data.description ?? ""),
    lang,
    rubric,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: data.cover ? String(data.cover) : undefined,
    canonical: data.canonical ? String(data.canonical) : undefined,
    featured: data.featured === true,
    coverFit: data.coverFit === "poster" ? "poster" : undefined,
    translation: data.translation ? String(data.translation) : undefined,
    draft: data.draft === true,
    html,
    headings,
    figures,
    links,
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
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.date.localeCompare(a.date);
    });
}

export function getPost(slug: string): Post | null {
  // Адрес приходит из ссылки, поэтому в имя файла пускаем только
  // латиницу, цифры и дефис. Иначе им можно было бы гулять по диску.
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
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
