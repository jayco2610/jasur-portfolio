import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEpisode, getEpisodeSlugs, getEpisodes, SHOW } from "@/lib/podcast";
import { formatDate } from "@/lib/blog";
import { MAGAZINE_NAME } from "@/lib/rubrics";
import MagChrome from "@/components/magazine/MagChrome";
import Player from "@/components/magazine/Player";
import ShareLinks from "@/components/ShareLinks";

const SITE = "https://jasur-portfolio-pied.vercel.app";

export function generateStaticParams() {
  return getEpisodeSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ep = getEpisode(slug);
  if (!ep) return {};

  return {
    title: `${ep.title} — ${SHOW.name}`,
    description: ep.description,
    alternates: { canonical: `${SITE}/podcast/${ep.slug}` },
    openGraph: {
      type: "article",
      title: ep.title,
      description: ep.description,
      publishedTime: ep.date,
      url: `${SITE}/podcast/${ep.slug}`,
      images: [{ url: ep.cover ?? SHOW.cover, width: 1200, height: 1200, alt: ep.title }],
    },
  };
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ep = getEpisode(slug);
  if (!ep) notFound();

  const ru = ep.lang === "ru";
  const others = getEpisodes().filter((e) => e.slug !== ep.slug).slice(0, 3);
  const voice = ep.kind === "voice";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: ep.title,
    description: ep.description,
    datePublished: ep.date,
    inLanguage: ep.lang,
    partOfSeries: { "@type": "PodcastSeries", name: SHOW.name, url: `${SITE}/podcast` },
    associatedMedia: { "@type": "MediaObject", contentUrl: `${SITE}${ep.audio}` },
    url: `${SITE}/podcast/${ep.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="mag-root">
        <MagChrome section="podcast" rightLabel={ru ? "Подкаст" : "Podcast"} />

        <div className="mag-w">
          <nav className="mag-crumbs">
            <Link href="/writing">{MAGAZINE_NAME[ep.lang]}</Link>
            <span>›</span>
            <Link href="/podcast">{SHOW.name}</Link>
            <span>›</span>
            <b>
              {voice
                ? ru ? "голосовая" : "voice note"
                : ru ? `выпуск ${ep.number}` : `episode ${ep.number}`}
            </b>
          </nav>

          <div className="mag-art">
            <div className="mag-art-main">
              <article>
                <div className="flex flex-wrap gap-x-5 gap-y-2 pb-6 pt-1">
                  <span className="tiny">{formatDate(ep.date, ep.lang)}</span>
                  {ep.duration && <span className="tiny">{ep.duration}</span>}
                  {ep.tags.length > 0 && <span className="tiny">{ep.tags.join(" · ")}</span>}
                </div>

                <h1 className="mag-art-h1">{ep.title}</h1>

                {ep.guest && (
                  <div className="pod-guest-big">
                    <span className="tiny">{ru ? "Гость" : "Guest"}</span>
                    <b>{ep.guest}</b>
                    {ep.guestRole && <span>{ep.guestRole}</span>}
                  </div>
                )}

                {ep.description && <p className="mag-art-lead">{ep.description}</p>}

                <Player src={ep.audio} ru={ru} chapters={ep.chapters} />

                {ep.html && (
                  <div className="article-body mt-10" dangerouslySetInnerHTML={{ __html: ep.html }} />
                )}
              </article>

              {ep.links.length > 0 && (
                <section className="mag-sources">
                  <div className="mag-sh">
                    <h3>{ru ? "Из разговора" : "Mentioned"}</h3>
                    <span className="mag-ln" />
                    <span className="tiny">{String(ep.links.length).padStart(2, "0")}</span>
                  </div>
                  <ol>
                    {ep.links.map((l) => (
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
                <ShareLinks url={`${SITE}/podcast/${ep.slug}`} title={ep.title} ru={ru} />
              </div>

              {others.length > 0 && (
                <div className="mt-14 pb-24">
                  <p className="tiny pb-2 border-b border-ink">
                    {ru ? "Ещё послушать" : "Listen next"}
                  </p>
                  {others.map((o) => (
                    <Link key={o.slug} href={`/podcast/${o.slug}`} className="post-item">
                      <div className="post-meta">
                        <span className="tiny">{formatDate(o.date, o.lang)}</span>
                        {o.duration && <span className="tiny">{o.duration}</span>}
                      </div>
                      <h3>{o.title}</h3>
                    </Link>
                  ))}
                </div>
              )}

              {others.length === 0 && <div className="pb-24" />}
            </div>

            <aside className="mag-rail">
              <div className="mag-rail-in">
                <div className="pod-side">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ep.cover ?? SHOW.cover} alt={SHOW.name} />
                  <b>{SHOW.name}</b>
                  <span>{SHOW[ep.lang].tagline}</span>
                  <Link href="/podcast" className="tiny">
                    {ru ? "Все выпуски →" : "All episodes →"}
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          <footer className="mag-foot">
            <span className="tiny">
              {MAGAZINE_NAME[ep.lang]} ·{" "}
              {ru ? "издание Жасура Ахмадалиева" : "a Jasur Akhmadaliev publication"}
            </span>
            <Link href="/podcast" className="tiny">
              {ru ? "← Все выпуски" : "← All episodes"}
            </Link>
          </footer>
        </div>
      </div>
    </>
  );
}
