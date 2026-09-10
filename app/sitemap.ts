import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://jasur-portfolio-pied.vercel.app";

const routes = [
  { path: "", priority: 1 },
  { path: "/projects", priority: 0.8 },
  { path: "/services", priority: 0.8 },
  { path: "/writing", priority: 0.8 },
  { path: "/resume", priority: 0.8 },
  { path: "/demos", priority: 0.7 },
  { path: "/demos/mia", priority: 0.6 },
  { path: "/demos/career", priority: 0.6 },
  { path: "/demos/preorder", priority: 0.6 },
  { path: "/demos/leftovers", priority: 0.6 },
  { path: "/demos/fraud", priority: 0.6 },
  { path: "/demos/reviews", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = routes.map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority,
  }));

  // Статьи блога: у них своя дата и они меняются реже, чем разделы сайта.
  const posts: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : lastModified,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  return [...staticPages, ...posts];
}
