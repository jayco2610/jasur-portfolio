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

function Row({
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
    <Link ref={ref} href={`/blog/${post.slug}`} className={`mag-row ${className}`}>
      <span className="mag-row-meta">
        <span className="mag-row-date">{shortDate(post.date, ru)}</span>
        <span className="mag-row-rub">{post.tags[0] ?? rubricName(post.rubric, lang)}</span>
      </span>
      <h4>{post.title}</h4>
      <span className="mag-row-go" aria-hidden="true">
        →
      </span>
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
  const { lang, toggle } = useLanguage();
  const ru = lang === "ru";

  // Показываем только тексты на выбранном языке.
  const mine = posts.filter((p) => p.lang === lang);
  const elsewhere = posts.length - mine.length;

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
          <div className="mag-rows">
            {mine.map((post, i) => (
              <Row key={post.slug} post={post} i={i} lang={lang} ru={ru} />
            ))}
          </div>
        ) : (
          <div className="mag-empty">
            {elsewhere > 0 ? (
              <>
                <p>
                  {ru
                    ? "В этой рубрике тексты пока только на английском."
                    : "This section is in Russian for now."}
                </p>
                <button type="button" onClick={toggle} className="mag-all">
                  {ru ? "Читать на английском" : "Read in Russian"} <span>↘</span>
                </button>
              </>
            ) : (
              <>
                <p>{ru ? "Здесь пока пусто." : "Empty here for now."}</p>
                <Link href="/writing" className="mag-all">
                  {ru ? "Смотреть всё" : "See everything"} <span>↘</span>
                </Link>
              </>
            )}
          </div>
        )}

        <footer className="mag-foot">
          <span className="tiny">
            {MAGAZINE_NAME[lang]}
          </span>
          <Link href="/" className="tiny">
            {ru ? "← В портфолио" : "← Back to portfolio"}
          </Link>
        </footer>
      </div>
    </div>
  );
}
