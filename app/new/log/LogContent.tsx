import Link from "next/link";
import Photo from "../Photo";
import type { CardPost } from "../posts";
import { LOG, type Lang } from "../strings";
import Carousel from "./Carousel";
import Subscribe from "./Subscribe";
import { PUBLISHED, CHANNELS } from "./elsewhere";
import { SHOW } from "@/lib/show";

/* Тело страницы Log: издание, а не список ссылок. Показывает все материалы
   на одном языке.

   Своего состояния у тела нет, поэтому компонент серверный. Страница
   (page.tsx) собирает его дважды, с русскими и с английскими статьями, и
   показывает то, что выбрано в переключателе, как старый Log (/writing):
   в русском журнале русские тексты, в английском английские. Шапка издания
   и подвал стоят в page.tsx снаружи: язык они берут из контекста сами.

   Рубрики фильтром на месте не работают: у каждой темы свой адрес
   /new/log/tema/[ключ], как на живом сайте, и отбор живёт там.

   Подкаст стоит в той же строке шапки, но рубрикой не является: это другой вид
   материала, а не другая тема. Поэтому он отделён точкой и ведёт на
   /new/podcast, то есть на страницу подкаста внутри макета. */

export default function LogContent({ posts, lang }: { posts: CardPost[]; lang: Lang }) {
  const s = LOG[lang];

  /* Крупной первой встаёт статья с флагом featured, как на живой странице:
     флаг для того и заведён, чтобы поднять материал наверх, не меняя ему
     дату. Если помеченной нет, берём самую свежую. Порядок остального списка
     при этом всегда по дате. */
  const lead = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.slug !== lead?.slug);

  return (
    <>
      <section className="nm-log-hero">
        <div className="nm-log-hero-in">
          <div className="nm-log-hero-text">
            <h1 className="nm-h1-p">Log</h1>
            <div className="nm-lead">
              <p>{s.lead}</p>
            </div>
          </div>
          <Photo
            className="nm-log-hero-photo"
            src="/new/log-hero.png"
            alt="Log"
            ratio="1:1"
            priority
          />
        </div>
      </section>

      {lead ? (
        <>
          {/* Главная статья: единственное место на странице, где у материала
              есть описание. Дальше только заголовки. */}
          <section className="nm-wrap nm-sect nm-sect-log">
            <p className="nm-sec-t">{s.featured}</p>
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
              <section className="nm-wrap nm-sect nm-sect-log">
                <p className="nm-sec-t">
                  {s.latest} · {String(rest.length).padStart(2, "0")}
                </p>
                <Carousel posts={rest} label={s.carousel} />
              </section>
            </>
          )}
        </>
      ) : (
        <section className="nm-wrap nm-sect nm-sect-log">
          {/* Срабатывает только если статей нет вообще: рубрики теперь
              отбирают материалы на своих страницах, а не здесь. */}
          <p className="nm-empty">{s.empty}</p>
        </section>
      )}

      {/* Подкаст: промо-полоса, а не список выпусков. Название, описание и
          обложка берутся из lib/show.ts, то есть оттуда же, откуда их берёт
          живой сайт. */}
      <section className="nm-wrap nm-sect nm-sect-log">
        <Link className="nm-pod" href="/new/podcast">
          <Photo
            className="nm-pod-ph"
            src={SHOW.cover}
            alt={SHOW.name}
            ratio="1:1"
          />
          <span className="nm-pod-tx">
            <span className="nm-sec-t nm-pod-k">{s.podcast}</span>
            <span className="nm-pod-t">{SHOW.name}</span>
            <span className="nm-pod-d">
              {SHOW[lang].tagline} {SHOW[lang].about}
            </span>
            <span className="nm-pod-go">{s.listen}</span>
          </span>
        </Link>
      </section>

      <section className="nm-wrap nm-sect nm-sect-log">
        <p className="nm-sec-t">
          {s.elsewhere} · {String(PUBLISHED.length).padStart(2, "0")}
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
              <span className="nm-ext-t">{a.title[lang]}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="nm-wrap nm-sect nm-sect-log">
        <p className="nm-sec-t">
          {s.channels} · {String(CHANNELS.length).padStart(2, "0")}
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
              <span className="nm-ch-d">{c.description[lang]}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="nm-wrap nm-sect nm-sect-log">
        <Subscribe lang={lang} />
      </section>
    </>
  );
}
