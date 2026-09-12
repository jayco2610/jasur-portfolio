"use client";

import Link from "next/link";
import MagChrome from "@/components/magazine/MagChrome";
import { useLanguage } from "@/context/LanguageContext";
import { useReveal } from "@/hooks/useReveal";
import { MAGAZINE_NAME } from "@/lib/rubrics";
import { SHOW, type Episode } from "@/lib/show";

function shortDate(date: string, ru: boolean): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString(ru ? "ru-RU" : "en-US", {
    day: "2-digit",
    month: "long",
  });
}

function Row({ ep, i, ru }: { ep: Episode; i: number; ru: boolean }) {
  const { ref, className } = useReveal<HTMLAnchorElement>(i);
  const voice = ep.kind === "voice";
  return (
    <Link ref={ref} href={`/podcast/${ep.slug}`} className={`pod-row ${className}`}>
      <div className="pod-row-im">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ep.cover ?? "/podcast/face.jpg"} alt="" loading="lazy" />
        <i aria-hidden="true">▶</i>
      </div>

      <div className="pod-row-tx">
        <div className="pod-row-top">
          <span className="tiny">
            {voice
              ? ru ? "Голосовая" : "Voice note"
              : ru ? `Выпуск ${ep.number}` : `Episode ${ep.number}`}
          </span>
          <span className="tiny">{shortDate(ep.date, ru)}</span>
          {ep.duration && <span className="tiny">{ep.duration}</span>}
        </div>
        <h4>{ep.title}</h4>
        {ep.description && <p>{ep.description}</p>}
        {ep.guest && (
          <div className="pod-guest">
            {ep.guest}
            {ep.guestRole && <span> · {ep.guestRole}</span>}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function PodcastContent({ episodes }: { episodes: Episode[] }) {
  const { lang } = useLanguage();
  const ru = lang === "ru";
  const s = SHOW[lang];

  const talks = episodes.filter((e) => e.kind === "talk");
  const voices = episodes.filter((e) => e.kind === "voice");

  return (
    <div className="mag-root">
      <MagChrome section="podcast" rightLabel={ru ? "Подкаст" : "Podcast"} />

      <div className="mag-w">
        <div className="pod-hero">
          <div className="pod-hero-im">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={SHOW.cover} alt={SHOW.name} />
          </div>
          <div className="pod-hero-tx">
            <div className="tiny">{ru ? "Подкаст" : "Podcast"}</div>
            <h1>
              Jasur <em>/ Talks</em>
            </h1>
            <p className="pod-tagline">{s.tagline}</p>
            <p className="pod-about">{s.about}</p>
            <p className="pod-sign">{s.sign}</p>
            <div className="pod-topics">
              {SHOW.topics.map((topic) => (
                <span key={topic}>{topic}</span>
              ))}
            </div>
            <div className="pod-where">
              <span className="tiny">
                {ru ? "Слушать прямо здесь, ничего скачивать не нужно" : "Listen right here, nothing to install"}
              </span>
              <a href="/podcast/feed.xml">RSS</a>
              <a href="https://t.me/head_of_ceo" target="_blank" rel="noopener noreferrer">
                Telegram
              </a>
            </div>
          </div>
        </div>

        {talks.length > 0 && (
          <div className="mag-sec">
            <div className="mag-sh">
              <h3>{ru ? "Разговоры" : "Conversations"}</h3>
              <span className="mag-ln" />
              <span className="tiny">{String(talks.length).padStart(2, "0")}</span>
            </div>
            <div className="pod-list">
              {talks.map((ep, i) => (
                <Row key={ep.slug} ep={ep} i={i} ru={ru} />
              ))}
            </div>
          </div>
        )}

        {voices.length > 0 && (
          <div className="mag-sec">
            <div className="mag-sh">
              <h3>{ru ? "Голосовые" : "Voice notes"}</h3>
              <span className="mag-ln" />
              <span className="tiny">{String(voices.length).padStart(2, "0")}</span>
            </div>
            <div className="pod-list">
              {voices.map((ep, i) => (
                <Row key={ep.slug} ep={ep} i={i} ru={ru} />
              ))}
            </div>
          </div>
        )}

        {episodes.length === 0 && (
          <div className="pod-soon">
            <div className="pod-soon-im">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/podcast/studio.jpg" alt="" />
            </div>
            <div>
              <p className="pod-soon-big">
                {ru ? "Первый выпуск пишется." : "First episode is being recorded."}
              </p>
              <p className="pod-soon-sm">
                {ru
                  ? "Как выйдет, появится здесь и в канале. Там же можно предложить тему или прийти гостем."
                  : "When it is out it lands here and in the channel. Same place to suggest a topic or come on as a guest."}
              </p>
              <div className="flex flex-wrap gap-6 mt-6">
                <a
                  href="https://t.me/head_of_ceo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tiny"
                >
                  {ru ? "Канал @head_of_ceo" : "Channel @head_of_ceo"}
                </a>
                <a
                  href="https://t.me/biznesmind"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tiny"
                >
                  {ru ? "Написать: @biznesmind" : "Write: @biznesmind"}
                </a>
              </div>
            </div>
          </div>
        )}

        <footer className="mag-foot">
          <span className="tiny">
            {MAGAZINE_NAME[lang]} ·{" "}
            {ru ? "издание Жасура Ахмадалиева" : "a Jasur Akhmadaliev publication"}
          </span>
          <Link href="/writing" className="tiny">
            {ru ? "← Все материалы" : "← All pieces"}
          </Link>
        </footer>
      </div>
    </div>
  );
}
