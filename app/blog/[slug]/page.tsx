import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getAllSlugs, getAllPosts, formatDate, rubricName } from "@/lib/blog";
import ShareLinks from "@/components/ShareLinks";
import MagChrome from "@/components/magazine/MagChrome";
import ArticleRail from "@/components/magazine/ArticleRail";
import { MAGAZINE_NAME } from "@/lib/rubrics";

const SITE = "https://jasur-portfolio-pied.vercel.app";

// Кроме статей, собранных при сборке, никаких других адресов не существует.
// Без этого Next пытается собрать незнакомый адрес прямо на сервере, а там
// нет папки content, и вместо честной 404 читатель видит ошибку.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} — Jasur Akhmadaliev`,
    description: post.description,
    alternates: {
      // Если текст сначала вышел на чужой площадке, честно указываем её оригиналом.
      canonical: post.canonical ?? `${SITE}/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      url: `${SITE}/blog/${post.slug}`,
      // Свой блок openGraph перекрывает родительский целиком,
      // поэтому картинку надо повторить здесь, иначе репост будет пустым.
      // Обложки статей вертикальные, в ленту соцсетей они не лезут,
      // поэтому в репост всегда уходит общая горизонтальная карточка.
      images: [{ url: "/og-cover.jpg", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/og-cover.jpg"],
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const ru = post.lang === "ru";
  // В подборке «ещё почитать» показываем только тексты на языке этой статьи.
  const others = getAllPosts()
    .filter((p) => p.slug !== post.slug && p.lang === post.lang)
    .slice(0, 3);
  const twin = post.translation ? getPost(post.translation) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: post.lang,
    author: {
      "@type": "Person",
      name: "Jasur Akhmadaliev",
      url: SITE,
    },
    mainEntityOfPage: post.canonical ?? `${SITE}/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="mag-root">
        <MagChrome activeRubric={post.rubric} rightLabel={rubricName(post.rubric, post.lang)} />

        <div className="mag-w">

        <nav className="mag-crumbs">
          <Link href="/writing">{MAGAZINE_NAME[post.lang]}</Link>
          <span>›</span>
          <Link href={`/blog/tema/${post.rubric}`}>{rubricName(post.rubric, post.lang)}</Link>
          <span>›</span>
          <b>{ru ? "статья" : "article"}</b>
        </nav>

        <div className="mag-art">
        <div className="mag-art-main">

        <article>
          <div className="flex flex-wrap gap-x-5 gap-y-2 pb-6">
            <span className="tiny">{formatDate(post.date, post.lang)}</span>
            <span className="tiny">
              {post.readingMinutes} {ru ? "мин чтения" : "min read"}
            </span>
            {post.tags.length > 0 && <span className="tiny">{post.tags.join(" · ")}</span>}
            {twin && (
              <Link href={`/blog/${twin.slug}`} className="tiny mag-twin">
                {ru ? "Read in English" : "Читать по-русски"}
              </Link>
            )}
          </div>

          <h1 className="mag-art-h1">{post.title}</h1>

          {post.description && <p className="mag-art-lead">{post.description}</p>}

          {post.canonical && (
            <p className="tiny normal-case tracking-normal text-[12.5px] mt-6 border-l-2 border-rule pl-4">
              {ru ? "Впервые опубликовано здесь: " : "First published here: "}
              <a
                href={post.canonical}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-ink"
              >
                {new URL(post.canonical).hostname.replace("www.", "")}
              </a>
            </p>
          )}

          {post.cover && (
            <div className="mag-lead-im">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.cover} alt="" />
            </div>
          )}

          <div
            className="article-body mt-10"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>

        {/* источники */}
        {post.links.length > 0 && (
          <section className="mag-sources">
            <div className="mag-sh">
              <h3>{ru ? "Источники" : "Sources"}</h3>
              <span className="mag-ln" />
              <span className="tiny">{String(post.links.length).padStart(2, "0")}</span>
            </div>
            <ol>
              {post.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer">
                    {l.text}
                  </a>
                  <span>{l.host}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <div className="mt-14 pt-7 border-t border-ink">
          <ShareLinks url={`${SITE}/blog/${post.slug}`} title={post.title} ru={ru} />
        </div>

        {/* автор */}
        <div className="mt-12 pt-8 border-t border-rule">
          <div className="grid gap-6 sm:grid-cols-[92px_1fr] sm:gap-7 items-start">
            <img
              src="/portrait.jpg"
              alt="Jasur Akhmadaliev"
              className="w-[92px] h-[92px] object-cover grayscale contrast-[1.06]"
            />
            <div>
              <p className="text-[19px] font-bold tracking-[-0.024em]">Jasur Akhmadaliev</p>
              <p className="post-desc !mt-2">
                {ru
                  ? "Продакт-менеджер. Строю AI-инструменты для собственной работы и показываю процесс открыто. Москва."
                  : "Product manager. I build AI tools for my own work and show the process openly. Moscow."}
              </p>
              <div className="flex flex-wrap gap-5 mt-4">
                <a
                  href="https://t.me/head_of_ceo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tiny hover:text-ink transition-colors"
                >
                  {ru ? "Канал @head_of_ceo" : "Channel @head_of_ceo"}
                </a>
                <a
                  href="https://t.me/biznesmind"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tiny hover:text-ink transition-colors"
                >
                  {ru ? "Написать: @biznesmind" : "Write: @biznesmind"}
                </a>
                <Link href="/resume" className="tiny hover:text-ink transition-colors">
                  {ru ? "Резюме" : "Resume"}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* другие статьи */}
        {others.length > 0 && (
          <div className="mt-14 pb-24">
            <p className="tiny pb-2 border-b border-ink">{ru ? "Ещё почитать" : "Read next"}</p>
            {others.map((other) => (
              <Link key={other.slug} href={`/blog/${other.slug}`} className="post-item">
                <div className="post-meta">
                  <span className="tiny">{formatDate(other.date, other.lang)}</span>
                </div>
                <h3>{other.title}</h3>
              </Link>
            ))}
          </div>
        )}

        {others.length === 0 && <div className="pb-24" />}

        </div>

        <ArticleRail
          headings={post.headings}
          figures={post.figures}
          links={post.links}
          ru={ru}
        />
        </div>

          <footer className="mag-foot">
            <span className="tiny">
              {ru ? "Блокнот · издание Жасура Ахмадалиева" : "Notebook · a Jasur Akhmadaliev publication"}
            </span>
            <Link href="/writing" className="tiny">
              {ru ? "← Все материалы" : "← All pieces"}
            </Link>
          </footer>
        </div>
      </div>
    </>
  );
}
