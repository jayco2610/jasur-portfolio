import type { Metadata } from "next";
import Photo from "./Photo";
import { NewHeader, NewFooter } from "./Chrome";
import { ByLang } from "./Lang";
import { cardPosts } from "./posts";
import { HOME, CHROME, type Lang, type NavKey } from "./strings";
import { pageMeta, SITE_NAME } from "./meta";

/* Слово «портфолио» в заголовке вкладки оставлено по той же причине, что
   на живой главной (app/layout.tsx): без него по запросу «джасур портфолио»
   первым выдавался репозиторий на Гитхабе. */
export const metadata: Metadata = pageMeta({
  title: `${SITE_NAME} · портфолио`,
  description: HOME.ru.sub,
});

/* Макет новой главной по ТЗ «13 — Новая архитектура».
   Блоки идут сверху вниз в том же порядке, что в документе:
   0 шапка, 1 первый экран, 2 цифры, 3 ветки, 4 свежее, 5 контакты и подвал.

   Тело страницы собирается на сервере дважды, по-русски и по-английски, а
   какое показать, решает ByLang по языку, выбранному на сайте (см. Lang.tsx).
   Шапка и подвал общие, язык они берут из того же контекста сами. */

// Ссылки цифр, по порядку. 1 октября 2026 пустые заглушки «#» убраны: цифра
// выглядела ссылкой и никуда не вела. Когда появятся адреса поста, статьи
// и рейтинга VC.ru, вписать их в первые три места, вид ссылки вернётся сам.
const NUM_HREFS: (string | null)[] = [null, null, null, null, null];

const BRANCHES: { key: NavKey; href: string }[] = [
  { key: "works", href: "/works" },
  { key: "log", href: "/log" },
  { key: "workshop", href: "/workshop" },
  { key: "about", href: "/about" },
];

function Body({ lang }: { lang: Lang }) {
  const s = HOME[lang];
  const nav = CHROME[lang].nav;
  // Три самых свежих материала на языке страницы. Список читается из
  // content/blog, а не переписывается руками.
  const fresh = cardPosts(lang).slice(0, 3);

  return (
    <>
      {/* ——— блок 1. Первый экран ———
          Без .nm-wrap: секция сама держит только левый отступ, чтобы
          фото справа могло дойти до настоящего края окна (см. .nm-hero
          в new.css). */}
      <section className="nm-hero">
        <div className="nm-hero-in">
          <div className="nm-hero-text">
            <h1 className={`nm-h1 nm-h1--${lang}`}>
              {s.h1.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h1>

            <div className="nm-hero-meta">
              <p className="nm-sub">{s.sub}</p>

              <p className="nm-status">
                <span className="nm-dot" aria-hidden="true" />
                {s.status}
              </p>
            </div>
          </div>

          <Photo
            className="nm-hero-photo"
            src="/new/hero.jpg"
            alt="Jasur Akhmadaliev"
            ratio="1:1"
            priority
          />
        </div>
      </section>

      {/* ——— блок 2. Цифры ——— */}
      <section className="nm-wrap">
        <div className="nm-nums">
          {s.nums.map((n, i) => {
            const href = NUM_HREFS[i];
            return href ? (
              <a key={n.k} className="nm-num-a" href={href}>
                <span className="nm-num-v">{n.v}</span>
                <span className="nm-num-k">{n.k}</span>
              </a>
            ) : (
              <div key={n.k}>
                <span className="nm-num-v">{n.v}</span>
                <span className="nm-num-k">{n.k}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ——— блок 3. Ветки ——— */}
      <section className="nm-wrap nm-branches">
        <p className="nm-sec-t">{s.next}</p>
        <div>
          {BRANCHES.map((b) => (
            <a key={b.key} className="nm-branch" href={b.href}>
              <span className="nm-branch-text">
                <span className="nm-branch-t">{nav[b.key]}</span>
                <span className="nm-branch-c">{s.branches[b.key]}</span>
              </span>
              <span className="nm-branch-a" aria-hidden="true">
                &#8594;
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ——— блок 4. Свежее ——— */}
      <section className="nm-wrap nm-fresh">
        <p className="nm-sec-t">{s.fresh}</p>
        <div className="nm-cards">
          {fresh.map((c) => (
            <a key={c.slug} className="nm-card" href={c.href}>
              <Photo src={c.cover} alt={c.title} ratio="16:10" />
              <span className="nm-card-meta">
                {c.date} · {c.rubric}
              </span>
              <span className="nm-card-t">{c.title}</span>
            </a>
          ))}
        </div>
        <p className="nm-more">
          <a href="/log">{s.more}</a>
        </p>
      </section>
    </>
  );
}

export default function NewHome() {
  return (
    <>
      <NewHeader />

      {/* корневой layout сайта уже даёт <main>, второй вкладывать нельзя */}
      <div>
        <ByLang ru={<Body lang="ru" />} en={<Body lang="en" />} />

        {/* ——— блок 5. Контакты и подвал ——— */}
        <NewFooter />
      </div>
    </>
  );
}
