import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getAllSlugs, getAllPosts, formatDate, rubricName } from "@/lib/blog";
import ShareLinks from "@/components/ShareLinks";

const SITE = "https://jasur-portfolio-pied.vercel.app";

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
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
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
  const others = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="wrap">
        <div className="pt-11 pb-8">
          <Link href="/writing" className="tiny hover:text-ink transition-colors">
            ← {ru ? "Все статьи" : "All articles"}
          </Link>
        </div>

        <article className="max-w-[46rem]">
          <div className="flex flex-wrap gap-x-5 gap-y-2 pb-6">
            <Link href={`/blog/tema/${post.rubric}`} className="tiny hover:text-ink transition-colors">
              {rubricName(post.rubric, post.lang)}
            </Link>
            <span className="tiny">{formatDate(post.date, post.lang)}</span>
            <span className="tiny">
              {post.readingMinutes} {ru ? "мин чтения" : "min read"}
            </span>
            {post.tags.length > 0 && <span className="tiny">{post.tags.join(" · ")}</span>}
          </div>

          <h1 className="text-[clamp(30px,4.4vw,52px)] leading-[1.02] tracking-[-0.04em] font-bold">
            {post.title}
          </h1>

          {post.description && (
            <p className="text-[clamp(16px,1.5vw,20px)] leading-[1.6] text-dim mt-6 pb-8 border-b border-ink">
              {post.description}
            </p>
          )}

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

          <div
            className="article-body mt-10"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>

        <div className="max-w-[46rem] mt-14 pt-7 border-t border-ink">
          <ShareLinks url={`${SITE}/blog/${post.slug}`} title={post.title} ru={ru} />
        </div>

        {/* автор */}
        <div className="max-w-[46rem] mt-12 pt-8 border-t border-rule">
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
          <div className="max-w-[46rem] mt-14 pb-24">
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
    </>
  );
}
