import type { Metadata } from "next";
import Link from "next/link";
import Photo from "../Photo";
import { NewFooter } from "../Chrome";
import LogChrome from "../LogChrome";
import { ByLang } from "../Lang";
import Subscribe from "../log/Subscribe";
import { cardDate } from "../posts";
import { PODCAST, type Lang } from "../strings";
import { getEpisodes } from "@/lib/podcast";
import { SHOW, type Episode } from "@/lib/show";

export const metadata: Metadata = {
  title: "Подкаст · макет",
  robots: { index: false, follow: false },
};

/* Страница подкаста в макете. Перенос старой /podcast: блоки те же и в том же
   порядке — шапка издания, первый экран с названием и описанием шоу, темы,
   где слушать, списки разговоров и голосовых, блок про первый выпуск,
   подписка, подвал. Тексты шоу берутся из lib/show.ts, то есть оттуда же,
   откуда их берёт живой сайт.

   Шапка здесь не общая сайтовая, а шапка издания (LogChrome): подкаст это
   часть Log, и провал из макета в старое оформление закрывается именно этим.
   Какой пункт в ней подсвечен, шапка определяет по адресу сама, поэтому
   пропсов ей не передаём.

   Главное изображение — вертикальный снимок у микрофона. Он снят на светлом
   фоне, подогнанном под цвет страницы, поэтому стоит без рамки, подложки и
   тени: кадр должен сливаться с листом, а не лежать на нём прямоугольником.
   Квадратная обложка шоу осталась мелкой пометкой рядом с названием.

   Тело страницы собирается дважды, по-русски и по-английски, и ByLang
   показывает то, что выбрано в переключателе. Как на старой странице,
   в списке только выпуски на выбранном языке: слушают на одном языке.

   Выпусков в проекте пока ноль (content/podcast нет вовсе), поэтому в деле
   сейчас только блок «первый выпуск пишется». Строки выпусков ведут на
   страницу выпуска внутри макета, /new/podcast/[slug]. */

function Row({ ep, lang }: { ep: Episode; lang: Lang }) {
  const s = PODCAST[lang];
  return (
    <Link className="nm-pcast-row" href={`/new/podcast/${ep.slug}`}>
      <Photo
        className="nm-pcast-row-ph"
        src={ep.cover ?? "/podcast/face.jpg"}
        alt=""
        ratio="1:1"
      />
      <span className="nm-pcast-row-tx">
        {/* Дата в формате всего сайта, с годом: «17 сентября 2026». На
            старой странице здесь стояло «17 сентября» без года, а ТЗ
            требует один формат в карточках, списках и на странице. */}
        <span className="nm-pcast-row-m">
          {ep.kind === "voice" ? s.voice : `${s.episode} ${ep.number}`}
          {ep.date && ` · ${cardDate(ep.date, lang)}`}
          {ep.duration && ` · ${ep.duration}`}
        </span>
        <span className="nm-pcast-row-t">{ep.title}</span>
        {ep.description && (
          <span className="nm-pcast-row-d">{ep.description}</span>
        )}
        {ep.guest && (
          <span className="nm-pcast-row-g">
            {ep.guest}
            {ep.guestRole && ` · ${ep.guestRole}`}
          </span>
        )}
      </span>
    </Link>
  );
}

function Body({ lang, episodes }: { lang: Lang; episodes: Episode[] }) {
  const s = PODCAST[lang];
  const show = SHOW[lang];
  // Слушают на одном языке, поэтому чужие выпуски в списке не показываем.
  const mine = episodes.filter((e) => e.lang === lang);
  const talks = mine.filter((e) => e.kind === "talk");
  const voices = mine.filter((e) => e.kind === "voice");

  return (
    <>
      {/* Геометрия первого экрана та же, что на Log: тот же левый отступ,
          тот же выход фотографии к правому краю окна, та же сборка в один
          столбец на узком экране. Отличается только доля колонки под
          снимком: он вертикальный, а не квадратный. */}
      <section className="nm-log-hero">
        <div className="nm-log-hero-in nm-pcast-hero-in">
          <div className="nm-log-hero-text">
            <div className="nm-pcast-mark">
              <Photo
                className="nm-pcast-mark-ph"
                src={SHOW.cover}
                alt={SHOW.name}
                ratio="1:1"
              />
              <p className="nm-sec-t nm-pcast-mark-k">{s.kicker}</p>
            </div>

            <h1 className="nm-h1-p nm-pcast-h1">
              Jasur <i aria-hidden="true">/</i> Talks
            </h1>

            <div className="nm-lead">
              <p>{show.tagline}</p>
              <p>{show.about}</p>
            </div>

            <p className="nm-pcast-sign">{show.sign}</p>

            <div className="nm-pcast-topics">
              {SHOW.topics.map((topic) => (
                <span key={topic}>{topic}</span>
              ))}
            </div>

            <div className="nm-pcast-where">
              <span>{s.where}</span>
              <a
                href="https://t.me/head_of_ceo"
                target="_blank"
                rel="noopener noreferrer"
              >
                Telegram
              </a>
            </div>
          </div>

          <Photo
            className="nm-log-hero-photo"
            src="/new/log-bg.jpg"
            alt="Jasur / Talks"
            ratio="4:5"
          />
        </div>
      </section>

      {talks.length > 0 && (
        <section className="nm-wrap nm-sect nm-sect-log">
          <p className="nm-sec-t">
            {s.talks} · {String(talks.length).padStart(2, "0")}
          </p>
          <div className="nm-pcast-list">
            {talks.map((ep) => (
              <Row key={ep.slug} ep={ep} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {voices.length > 0 && (
        <section className="nm-wrap nm-sect nm-sect-log">
          <p className="nm-sec-t">
            {s.voices} · {String(voices.length).padStart(2, "0")}
          </p>
          <div className="nm-pcast-list">
            {voices.map((ep) => (
              <Row key={ep.slug} ep={ep} lang={lang} />
            ))}
          </div>
        </section>
      )}

      {mine.length === 0 && (
        <section className="nm-wrap nm-sect nm-sect-log">
          <div className="nm-pcast-soon">
            <Photo
              className="nm-pcast-soon-ph"
              src="/podcast/studio.jpg"
              alt=""
              ratio="3:2"
            />
            <div className="nm-pcast-soon-tx">
              <p className="nm-pcast-soon-t">{s.soonT}</p>
              <p className="nm-pcast-soon-d">{s.soonD}</p>
              <div className="nm-pcast-soon-l">
                <a
                  href="https://t.me/head_of_ceo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.channel}
                </a>
                <a
                  href="https://t.me/biznesmind"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.write}
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="nm-wrap nm-sect nm-sect-log">
        <Subscribe lang={lang} />
      </section>
    </>
  );
}

export default function NewPodcast() {
  const episodes = getEpisodes();

  return (
    <>
      <LogChrome />

      <div>
        <ByLang
          ru={<Body lang="ru" episodes={episodes} />}
          en={<Body lang="en" episodes={episodes} />}
        />

        <NewFooter />
      </div>
    </>
  );
}
