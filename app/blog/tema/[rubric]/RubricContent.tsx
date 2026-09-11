"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useReveal } from "@/hooks/useReveal";
import { rubricName } from "@/lib/rubrics";
import type { PostMeta } from "@/lib/blog";

function postDate(date: string, ru: boolean): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString(ru ? "ru-RU" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Card({
  post,
  i,
  lang,
  ru,
}: {
  post: PostMeta;
  i: number;
  lang: "en" | "ru";
  ru: boolean;
}) {
  const { ref, className } = useReveal<HTMLAnchorElement>(i);
  return (
    <Link ref={ref} href={`/blog/${post.slug}`} className={`mag-card ${className}`}>
      <div className="mag-visual">
        {post.cover ? (
          <img src={post.cover} alt="" />
        ) : (
          <>
            <span className="mag-visual-no">{String(i + 1).padStart(2, "0")}</span>
            <span>{rubricName(post.rubric, lang)}</span>
          </>
        )}
      </div>
      <div className="post-meta mt-3.5">
        <span className="tiny">{postDate(post.date, ru)}</span>
      </div>
      <h3>{post.title}</h3>
      <p className="post-desc !mt-3 !text-[14.5px]">{post.description}</p>
    </Link>
  );
}

export default function RubricContent({
  rubric,
  posts,
  allRubrics,
}: {
  rubric: string;
  posts: PostMeta[];
  allRubrics: string[];
}) {
  const { lang } = useLanguage();
  const ru = lang === "ru";

  return (
    <div className="wrap pb-24">
      <header className="blog-mast">
        <Link href="/writing" className="tiny">
          {ru ? "Блог · Жасур Ахмадалиев" : "Blog · Jasur Akhmadaliev"}
        </Link>
        <h1 className="blog-name mt-6">{rubricName(rubric, lang)}</h1>
        <p className="blog-lede">
          {posts.length} {ru ? "материала в рубрике" : "pieces in this section"}
        </p>

        <nav className="mag-rubrics">
          {allRubrics.map((key) => (
            <Link key={key} href={`/blog/tema/${key}`} data-active={key === rubric}>
              {rubricName(key, lang)}
            </Link>
          ))}
        </nav>
      </header>

      <div className="mag-grid">
        {posts.map((post, i) => (
          <Card key={post.slug} post={post} i={i} lang={lang} ru={ru} />
        ))}
      </div>

      <p className="mt-14">
        <Link href="/writing" className="tiny hover:text-ink transition-colors">
          {ru ? "Все материалы" : "All pieces"}
        </Link>
      </p>
    </div>
  );
}
