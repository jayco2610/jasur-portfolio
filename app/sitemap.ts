import type { MetadataRoute } from "next";
import { getAllPosts, getUsedRubrics } from "@/lib/blog";
import { getEpisodes } from "@/lib/podcast";
import { demos, productDemos } from "./demos/list";
import { SITE } from "./meta";

/* Карта сайта по адресам нового дизайна (с 2 октября 2026).

   Старых адресов (/writing, /projects, /resume, /services, /blog/tema/...)
   здесь нет: они уводят постоянным редиректом, и поисковик узнаёт о новых
   адресах отсюда и из редиректа. Исходника PDF «Услуги» (/uslugi/ru,
   /uslugi/en) тоже нет: он закрыт от поиска.

   Статьи идут обе, русская и английская: у каждой свой адрес. Демо берутся
   из того же списка, что каталог (demos/list.ts), а не переписываются
   руками. Рубрики только те, в которых есть статьи: пустая страница рубрики
   открывается, но поисковику показывать её незачем. */
const routes = [
  { path: "", priority: 1 },
  { path: "/works", priority: 0.8 },
  { path: "/log", priority: 0.8 },
  { path: "/workshop", priority: 0.7 },
  { path: "/about", priority: 0.8 },
  { path: "/podcast", priority: 0.7 },
  { path: "/demos", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = routes.map(({ path, priority }) => ({
    url: `${SITE}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority,
  }));

  const demoPages: MetadataRoute.Sitemap = [...productDemos, ...demos].map((d) => ({
    url: `${SITE}${d.href}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Статьи блога: у них своя дата и они меняются реже, чем разделы сайта.
  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${SITE}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : lastModified,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const rubrics: MetadataRoute.Sitemap = getUsedRubrics().map((rubric) => ({
    url: `${SITE}/log/tema/${rubric}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const episodes: MetadataRoute.Sitemap = getEpisodes().map((ep) => ({
    url: `${SITE}/podcast/${ep.slug}`,
    lastModified: ep.date ? new Date(ep.date) : lastModified,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [...staticPages, ...demoPages, ...posts, ...rubrics, ...episodes];
}
