"use client";

import Link from "next/link";
import MagChrome from "@/components/magazine/MagChrome";
import { useLanguage } from "@/context/LanguageContext";
import { useReveal } from "@/hooks/useReveal";
import { rubricName, rubricDescription, rubricCover, MAGAZINE_NAME } from "@/lib/rubrics";
import type { PostMeta } from "@/lib/blog";

function shortDate(date: string, ru: boolean): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString(ru ? "ru-RU" : "en-US", {
    day: "2-digit",
    month: "long",
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
      <div className="mag-im">{post.cover && <img src={post.cover} alt="" />}</div>
      <div className="mag-rub">{rubricName(post.rubric, lang)}</div>
      <h4>{post.title}</h4>
      <div className="mag-card-meta">
        <span className="tiny">{shortDate(post.date, ru)}</span>
        {post.tags[0] && <span className="tiny">{post.tags[0]}</span>}
      </div>
    </Link>
  );
}

export default function RubricContent({
  rubric,
  posts,
}: {
  rubric: string;
  posts: PostMeta[];
}) {
  const { lang } = useLanguage();
  const ru = lang === "ru";

  // Показываем только тексты на выбранном языке.
  const mine = posts.filter((p) => p.lang === lang);

  // Метки материалов рубрики идут подзаголовками, как в журнальном развороте.
  const tags = Array.from(new Set(mine.flatMap((p) => p.tags))).slice(0, 3);
  const cover = rubricCover(rubric);

  return (
    <div className="mag-root">
      <MagChrome activeRubric={rubric} rightLabel={rubricName(rubric, lang)} />

      <div className="mag-w">
        <div className="mag-title">
          <div className="mag-title-row">
            <div>
              <h1>{rubricName(rubric, lang)}</h1>
              {tags.length > 0 && (
                <div className="mag-title-tags">
                  {tags.map((tag) => (
                    <span key={tag}>{tag.toLowerCase()}</span>
                  ))}
                </div>
              )}
            </div>
            <Link className="mag-all" href="/writing">
              {ru ? "Все материалы" : "All pieces"} <span>↘</span>
            </Link>
          </div>

          <p className="mag-about">{rubricDescription(rubric, lang)}</p>
        </div>

        {cover && (
          <div className="mag-rub-band">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt="" />
          </div>
        )}

        <div className="mag-sh">
          <h3>{ru ? "В рубрике" : "In this section"}</h3>
          <span className="mag-ln" />
          <span className="tiny">{String(mine.length).padStart(2, "0")}</span>
        </div>

        {mine.length > 0 ? (
          <div className="mag-grid">
            {mine.map((post, i) => (
              <Card key={post.slug} post={post} i={i} lang={lang} ru={ru} />
            ))}
          </div>
        ) : (
          <div className="mag-empty">
            <p>
              {ru
                ? "Здесь пока пусто."
                : "Empty here for now."}
            </p>
            <Link href="/writing" className="mag-all">
              {ru ? "Смотреть всё" : "See everything"} <span>↘</span>
            </Link>
          </div>
        )}

        <footer className="mag-foot">
          <span className="tiny">
            {MAGAZINE_NAME[lang]} ·{" "}
            {ru ? "издание Жасура Ахмадалиева" : "a Jasur Akhmadaliev publication"}
          </span>
          <Link href="/" className="tiny">
            {ru ? "← В портфолио" : "← Back to portfolio"}
          </Link>
        </footer>
      </div>
    </div>
  );
}
