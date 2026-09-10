import type { MetadataRoute } from "next";

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
  return routes.map(({ path, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority,
  }));
}
