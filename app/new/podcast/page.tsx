import type { Metadata } from "next";
import Link from "next/link";
import Photo from "../Photo";
import { NewFooter } from "../Chrome";
import LogChrome from "../LogChrome";
import Subscribe from "../log/Subscribe";
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
   Рубрики в ней на этой странице ведут обратно в список, фильтровать тут
   нечего.

   Главное изображение — вертикальный снимок у микрофона. Он снят на светлом
   фоне, подогнанном под цвет страницы, поэтому стоит без рамки, подложки и
   тени: кадр должен сливаться с листом, а не лежать на нём прямоугольником.
   Квадратная обложка шоу осталась мелкой пометкой рядом с названием.

   Страница серверная: своего состояния у неё нет, реагируют на нажатия
   только шапка и форма подписки, каждая сама по себе.

   Выпусков в проекте ноль (content/podcast нет вовсе), поэтому в деле сейчас
   только блок «первый выпуск пишется». Разметка списков оставлена, чтобы
   структура совпадала со старой страницей. */

function shortDate(date: string): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
  });
}

function Row({ ep }: { ep: Episode }) {
  return (
    // Страницы отдельного выпуска в макете нет, поэтому ссылка ведёт на
    // живую. Пока выпусков ноль, строка не рисуется вообще.
    <Link className="nm-pcast-row" href={`/podcast/${ep.slug}`}>
      <Photo
        className="nm-pcast-row-ph"
        src={ep.cover ?? "/podcast/face.jpg"}
        alt=""
        ratio="1:1"
      />
      <span className="nm-pcast-row-tx">
        <span className="nm-pcast-row-m">
          {ep.kind === "voice" ? "Голосовая" : `Выпуск ${ep.number}`}
          {ep.date && ` · ${shortDate(ep.date)}`}
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

export default function NewPodcast() {
  // Слушают на одном языке, поэтому чужие выпуски в списке не показываем.
  // Макет русский, как и остальные его страницы.
  const mine = getEpisodes().filter((e) => e.lang === "ru");
  const talks = mine.filter((e) => e.kind === "talk");
  const voices = mine.filter((e) => e.kind === "voice");

  return (
    <>
      <LogChrome activeRubric="podcast" />

      <div>
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
                <p className="nm-sec-t nm-pcast-mark-k">Подкаст</p>
              </div>

              <h1 className="nm-h1-p nm-pcast-h1">
                Jasur <i aria-hidden="true">/</i> Talks
              </h1>

              <div className="nm-lead">
                <p>{SHOW.ru.tagline}</p>
                <p>{SHOW.ru.about}</p>
              </div>

              <p className="nm-pcast-sign">{SHOW.ru.sign}</p>

              <div className="nm-pcast-topics">
                {SHOW.topics.map((topic) => (
                  <span key={topic}>{topic}</span>
                ))}
              </div>

              <div className="nm-pcast-where">
                <span>Слушать прямо здесь, ничего скачивать не нужно</span>
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
              Разговоры · {String(talks.length).padStart(2, "0")}
            </p>
            <div className="nm-pcast-list">
              {talks.map((ep) => (
                <Row key={ep.slug} ep={ep} />
              ))}
            </div>
          </section>
        )}

        {voices.length > 0 && (
          <section className="nm-wrap nm-sect nm-sect-log">
            <p className="nm-sec-t">
              Голосовые · {String(voices.length).padStart(2, "0")}
            </p>
            <div className="nm-pcast-list">
              {voices.map((ep) => (
                <Row key={ep.slug} ep={ep} />
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
                <p className="nm-pcast-soon-t">Первый выпуск пишется.</p>
                <p className="nm-pcast-soon-d">
                  Как выйдет, появится здесь и в канале. Там же можно предложить
                  тему или прийти гостем.
                </p>
                <div className="nm-pcast-soon-l">
                  <a
                    href="https://t.me/head_of_ceo"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Канал @head_of_ceo
                  </a>
                  <a
                    href="https://t.me/biznesmind"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Написать: @biznesmind
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="nm-wrap nm-sect nm-sect-log">
          <Subscribe />
        </section>

        <NewFooter />
      </div>
    </>
  );
}
