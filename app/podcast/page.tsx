import type { Metadata } from "next";
import { getEpisodes, SHOW } from "@/lib/podcast";
import PodcastContent from "./PodcastContent";

const SITE = "https://jasur-portfolio-pied.vercel.app";

export const metadata: Metadata = {
  title: `${SHOW.name} — подкаст Жасура Ахмадалиева`,
  description: SHOW.ru.tagline,
  alternates: { canonical: `${SITE}/podcast` },
  openGraph: {
    type: "website",
    title: `${SHOW.name} — подкаст Жасура Ахмадалиева`,
    description: SHOW.ru.tagline,
    url: `${SITE}/podcast`,
    images: [{ url: SHOW.cover, width: 1200, height: 1200, alt: SHOW.name }],
  },
};

export default function PodcastPage() {
  const episodes = getEpisodes();

  // Без этой разметки поисковик видит просто страницу с текстом
  // и не понимает, что здесь можно слушать.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: SHOW.name,
    description: `${SHOW.ru.tagline} ${SHOW.ru.about}`,
    url: `${SITE}/podcast`,
    image: `${SITE}${SHOW.cover}`,
    inLanguage: "ru",
    webFeed: `${SITE}/podcast/feed.xml`,
    author: { "@type": "Person", name: "Jasur Akhmadaliev", url: SITE },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PodcastContent episodes={episodes} />
    </>
  );
}
