"use client";

import { useState } from "react";
import Link from "next/link";
import Photo from "../Photo";
import { NewFooter } from "../Chrome";
import type { CardPost } from "../posts";
import Carousel from "./Carousel";
import Subscribe from "./Subscribe";
import { PUBLISHED, CHANNELS } from "./elsewhere";
import { RUBRICS } from "@/lib/rubrics";
import { SHOW } from "@/lib/show";

/* Страница Log целиком: издание, а не список ссылок.

   Клиентский компонент, потому что рубрики фильтруют список на месте. На
   живой странице каждая рубрика это отдельный адрес /blog/tema/[ключ], и
   переход перезагружает страницу; здесь Log это раздел одного сайта, и уводить
   читателя со страницы, чтобы показать те же карточки, незачем. Правило
   отбора при этом буквально то же, что в lib/blog.getPostsByRubric:
   p.rubric === ключ. Список статей приходит готовым из page.tsx, файлы читает
   сервер.

   Подкаст стоит в той же строке, но рубрикой не является: это другой вид
   материала, а не другая тема. Поэтому он отделён линейкой и ведёт на
   /podcast, как и на живой странице, а не фильтрует список. */

const ALL = "all";

export default function LogContent({ posts }: { posts: CardPost[] }) {
  const [rubric, setRubric] = useState<string>(ALL);

  const shown = rubric === ALL ? posts : posts.filter((p) => p.rubricKey === rubric);

  /* Крупной первой встаёт статья с флагом featured, как на живой странице:
     флаг для того и заведён, чтобы поднять материал наверх, не меняя ему
     дату. Если помеченной нет (а внутри отдельной рубрики её может не быть),
     берём самую свежую. Порядок остального списка при этом всегда по дате. */
  const lead = shown.find((p) => p.featured) ?? shown[0];
  const rest = shown.filter((p) => p.slug !== lead?.slug);

  // Рубрики без статей в строке не показываем: раздел, который открывается
  // пустым, честнее не предлагать вовсе.
  const used = RUBRICS.filter((r) => posts.some((p) => p.rubricKey === r.key));

  return (
    <>
      {/* Вторая строка под общей шапкой сайта. Своего логотипа у издания
          здесь нет: Log это раздел, и знак у него общий с сайтом. */}
      <nav className="nm-rubs" aria-label="Рубрики">
        <div className="nm-wrap nm-rubs-in">
          <button
            type="button"
            className={`nm-rub${rubric === ALL ? " is-on" : ""}`}
            aria-pressed={rubric === ALL}
            onClick={() => setRubric(ALL)}
          >
            Всё
          </button>
          {used.map((r) => (
            <button
              key={r.key}
              type="button"
              className={`nm-rub${rubric === r.key ? " is-on" : ""}`}
              aria-pressed={rubric === r.key}
              onClick={() => setRubric(r.key)}
            >
              {r.ru}
            </button>
          ))}
          <Link className="nm-rub nm-rub-pod" href="/podcast">
            Подкаст
          </Link>
        </div>
      </nav>

      <div>
        <section className="nm-wrap nm-ptop">
          <h1 className="nm-h1-p">Log</h1>
          <div className="nm-lead">
            <p>
              Бортжурнал: запись хода, а не готовые выводы. Что собираю, что
              считаю, где ошибся.
            </p>
          </div>
        </section>

        {lead ? (
          <>
            {/* Главная статья: единственное место на странице, где у материала
                есть описание. Дальше только заголовки. */}
            <section className="nm-wrap nm-sect">
              <p className="nm-sec-t">Главное</p>
              <a className="nm-big" href={lead.href}>
                <Photo
                  className="nm-big-ph"
                  src={lead.cover}
                  alt={lead.title}
                  ratio="16:10"
                />
                <span className="nm-big-tx">
                  <span className="nm-big-k">{lead.rubric}</span>
                  <span className="nm-big-t">{lead.title}</span>
                  {lead.description && (
                    <span className="nm-big-d">{lead.description}</span>
                  )}
                  <span className="nm-big-m">{lead.date}</span>
                </span>
              </a>
            </section>

            {rest.length > 0 && (
              <>
                {/* Лента обложек. Идёт сразу за главной статьёй.
                    Карусель показывает материалы в движущихся обложках. */}
                <section className="nm-wrap nm-sect">
                  <p className="nm-sec-t">
                    Свежее · {String(rest.length).padStart(2, "0")}
                  </p>
                  <Carousel posts={rest} />
                </section>
              </>
            )}
          </>
        ) : (
          <section className="nm-wrap nm-sect">
            <p className="nm-empty">
              В этой рубрике пока ничего нет. Скоро будет.
            </p>
          </section>
        )}

        {/* Подкаст: промо-полоса, а не список выпусков. Выпусков в проекте
            ноль, и придумывать их нельзя. Название, описание и обложка берутся
            из lib/show.ts, то есть оттуда же, откуда их берёт живой сайт. */}
        <section className="nm-wrap nm-sect">
          <Link className="nm-pod" href="/podcast">
            <Photo
              className="nm-pod-ph"
              src={SHOW.cover}
              alt={SHOW.name}
              ratio="1:1"
            />
            <span className="nm-pod-tx">
              <span className="nm-sec-t nm-pod-k">Подкаст</span>
              <span className="nm-pod-t">{SHOW.name}</span>
              <span className="nm-pod-d">
                {SHOW.ru.tagline} {SHOW.ru.about}
              </span>
              <span className="nm-pod-go">Слушать</span>
            </span>
          </Link>
        </section>

        <section className="nm-wrap nm-sect">
          <p className="nm-sec-t">
            Где ещё я пишу · {String(PUBLISHED.length).padStart(2, "0")}
          </p>
          <div className="nm-ext">
            {PUBLISHED.map((a) => (
              <a
                key={a.href}
                className="nm-ext-a"
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="nm-ext-p">
                  {a.platform} · {a.lang}
                </span>
                <span className="nm-ext-t">{a.title}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="nm-wrap nm-sect">
          <p className="nm-sec-t">
            Каналы · {String(CHANNELS.length).padStart(2, "0")}
          </p>
          <div className="nm-ch">
            {CHANNELS.map((c) => (
              <a
                key={c.href}
                className="nm-ch-a"
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="nm-ch-n">{c.name}</span>
                <span className="nm-ch-d">{c.description}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="nm-wrap nm-sect">
          <Subscribe />
        </section>

        <NewFooter />
      </div>
    </>
  );
}
