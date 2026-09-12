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
  return <PodcastContent episodes={getEpisodes()} />;
}
