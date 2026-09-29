import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEpisode, getEpisodeSlugs, getEpisodes, SHOW } from "@/lib/podcast";
import { MAGAZINE_NAME } from "@/lib/rubrics";
import { NewFooter } from "../../Chrome";
import LogChrome from "../../LogChrome";
import Share from "../../blog/Share";
import NoTranslation from "../../blog/NoTranslation";
import { cardDate } from "../../posts";
import { PODCAST } from "../../strings";
import Player from "../Player";

/* Страница выпуска подкаста в макете: /new/podcast/[slug].

   Перенос живой app/podcast/[slug]/page.tsx. Состав и порядок блоков тот же,
   поведение то же, меняется только оформление, в системе остальной ветки Log
   (шапка издания LogChrome, разворот и полка как у статьи):

    1. разметка PodcastEpisode для поисковиков (JSON-LD);
    2. шапка издания, пункт «Подкаст» подсвечен;
    3. хлебные крошки: издание, шоу, «выпуск N» или «голосовая»;
    4. строка сведений: дата, длительность, теги;
    5. заголовок;
    6. гость и его роль, если есть;
    7. описание;
    8. пометка «перевода нет», если язык сайта не совпадает с языком выпуска;
    9. плеер с главами;
   10. текст выпуска (заметки, расшифровка), если есть;
   11. «из разговора»: ссылки, упомянутые в выпуске;
   12. «поделиться»;
   13. «ещё послушать»: до трёх других выпусков на том же языке;
   14. полка справа: обложка, название шоу, описание, «все выпуски»;
   15. нижняя строка издания с возвратом ко всем выпускам.

   Подвал с контактами (NewFooter) стоит на всех страницах макета вместо
   общего подвала сайта, поэтому стоит и здесь.

   Язык страницы это язык выпуска, как у статьи: выпуски выходят на одном
   языке, перевода у них не бывает. */

const SITE = "https://jasur-portfolio-pied.vercel.app";

/* Кроме выпусков, собранных при сборке, никаких других адресов не существует.
   Без этой строки Next пытается собрать незнакомый адрес прямо на сервере,
   а там нет папки content, и вместо честной 404 читатель видит ошибку. */
export const dynamicParams = false;

/* Тот же список, что у живой страницы: опубликованные выпуски обоих языков
   с аудио, черновики отсекает lib/podcast.

   Пока выпусков ноль, список пуст. Next в таком случае не пишет в сборку ни
   одной страницы маршрута, и любой адрес /new/podcast/что-угодно отдаёт
   404 благодаря dynamicParams выше. */
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

  // Оригинал выпуска живёт на /podcast/[slug]. Макет в поиск не пускаем,
  // а каноническим адресом, превью и ссылкой «поделиться» оставляем живой:
  // репост макета увёл бы человека на страницу, которой завтра не будет.
  const live = `${SITE}/podcast/${ep.slug}`;

  return {
    title: `${ep.title} · ${SHOW.name} · макет`,
    description: ep.description,
    robots: { index: false, follow: false },
    alternates: { canonical: live },
    openGraph: {
      type: "article",
      title: ep.title,
      description: ep.description,
      publishedTime: ep.date,
      url: live,
      images: [{ url: ep.cover ?? SHOW.cover, width: 1200, height: 1200, alt: ep.title }],
    },
  };
}

export default async function NewEpisode({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ep = getEpisode(slug);
  if (!ep) notFound();

  const s = PODCAST[ep.lang];
  const voice = ep.kind === "voice";
  const others = getEpisodes()
    .filter((e) => e.slug !== ep.slug && e.lang === ep.lang)
    .slice(0, 3);
  const live = `${SITE}/podcast/${ep.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: ep.title,
    description: ep.description,
    datePublished: ep.date,
    inLanguage: ep.lang,
    partOfSeries: { "@type": "PodcastSeries", name: SHOW.name, url: `${SITE}/podcast` },
    associatedMedia: { "@type": "MediaObject", contentUrl: `${SITE}${ep.audio}` },
    url: live,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <LogChrome article={{ lang: ep.lang }} />

      <div lang={ep.lang}>
        <div className="nm-wrap">
          <nav className="nm-crumbs">
            <Link href="/new/log">{MAGAZINE_NAME[ep.lang]}</Link>
            <span aria-hidden="true">›</span>
            <Link href="/new/podcast">{SHOW.name}</Link>
            <span aria-hidden="true">›</span>
            <b>{voice ? s.crumbVoice : `${s.crumbEpisode} ${ep.number}`}</b>
          </nav>

          <div className="nm-art">
            <div className="nm-art-main">
              <article>
                <div className="nm-art-meta">
                  <span>{cardDate(ep.date, ep.lang)}</span>
                  {ep.duration && <span>{ep.duration}</span>}
                  {ep.tags.length > 0 && <span>{ep.tags.join(" · ")}</span>}
                </div>

                <h1 className="nm-art-h1">{ep.title}</h1>

                {ep.guest && (
                  <p className="nm-ep-guest">
                    <span>{s.guest}</span>
                    <b>{ep.guest}</b>
                    {ep.guestRole && <span>{ep.guestRole}</span>}
                  </p>
                )}

                {ep.description && <p className="nm-art-lead">{ep.description}</p>}

                <NoTranslation postLang={ep.lang} />

                <Player src={ep.audio} lang={ep.lang} chapters={ep.chapters} />

                {ep.html && (
                  <div className="nm-body" dangerouslySetInnerHTML={{ __html: ep.html }} />
                )}
              </article>

              {ep.links.length > 0 && (
                <section className="nm-art-sec nm-src">
                  <p className="nm-sec-t">
                    {s.mentioned} · {String(ep.links.length).padStart(2, "0")}
                  </p>
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

              <div className="nm-art-sec">
                <Share url={live} title={ep.title} ru={ep.lang === "ru"} />
              </div>

              {others.length > 0 && (
                <section className="nm-art-sec nm-ep-next">
                  <p className="nm-sec-t">
                    {s.next} · {String(others.length).padStart(2, "0")}
                  </p>
                  {others.map((o) => (
                    <Link key={o.slug} href={`/new/podcast/${o.slug}`} className="nm-ep-next-a">
                      <span className="nm-ep-next-m">
                        {cardDate(o.date, o.lang)}
                        {o.duration && ` · ${o.duration}`}
                      </span>
                      <span className="nm-ep-next-t">{o.title}</span>
                    </Link>
                  ))}
                </section>
              )}
            </div>

            {/* Полка справа: вместо глав и ссылок статьи здесь карточка шоу.
                На узком экране она, как и полка статьи, встаёт над текстом,
                но строкой: мелкая обложка и подпись рядом, а не квадрат во
                всю ширину экрана, как было на старой странице. */}
            <aside className="nm-rail nm-ep-rail">
              <div className="nm-rail-in nm-ep-side">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ep.cover ?? SHOW.cover} alt={SHOW.name} className="nm-ep-side-ph" />
                <div>
                  <p className="nm-ep-side-n">{SHOW.name}</p>
                  <p className="nm-ep-side-d">{SHOW[ep.lang].tagline}</p>
                  <Link href="/new/podcast" className="nm-ep-side-a">
                    {s.all}
                  </Link>
                </div>
              </div>
            </aside>
          </div>

          <footer className="nm-art-foot">
            <span>{MAGAZINE_NAME[ep.lang]}</span>
            {/* Стрелка это значок возврата, как в нижней строке статьи, а не
                часть подписи: читалке экрана её не читаем. */}
            <Link href="/new/podcast">
              <span aria-hidden="true">←</span> {s.all}
            </Link>
          </footer>
        </div>

        <NewFooter lang={ep.lang} />
      </div>
    </>
  );
}
