import type { NextConfig } from "next";

const securityHeaders = [
  // Force HTTPS for 2 years, including subdomains
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Block the site from being framed (clickjacking protection)
  { key: "X-Frame-Options", value: "DENY" },
  // Stop MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't leak full URLs to other sites
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Lock down powerful browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  /* Старые адреса после переезда нового дизайна с /new на обычные адреса
     (2 октября 2026). Все постоянные (308): ссылки на них уже лежат в
     поисковиках, в постах и в чужих закладках, и поисковик должен перенести
     вес на новый адрес, а не держать оба.

     /new/... уводит только адреса без точки. Картинки и PDF нового сайта
     лежат в public/new и отдаются по адресам вида /new/hero.jpg и
     /new/uslugi-ru.pdf, а редиректы Next проверяет раньше файлов из
     public: правило на весь /new/:path* сломало бы все картинки. У страниц
     точки в адресе нет, у файлов есть всегда.

     /blog уводит только сам список: статьи остались на /blog/[slug]. */
  async redirects() {
    return [
      { source: "/new", destination: "/", permanent: true },
      { source: "/new/:path((?!.*\\.).*)", destination: "/:path", permanent: true },
      { source: "/writing", destination: "/log", permanent: true },
      { source: "/blog", destination: "/log", permanent: true },
      { source: "/blog/tema/:rubric", destination: "/log/tema/:rubric", permanent: true },
      { source: "/projects", destination: "/works", permanent: true },
      { source: "/resume", destination: "/about", permanent: true },
      { source: "/services", destination: "/works", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
