import Photo from "./Photo";
import { NewHeader, NewFooter } from "./Chrome";
import { ruCardPosts } from "./posts";

/* Макет новой главной по ТЗ «13 — Новая архитектура».
   Блоки идут сверху вниз в том же порядке, что в документе:
   0 шапка, 1 первый экран, 2 цифры, 3 ветки, 4 свежее, 5 контакты и подвал. */

const NUMS = [
  { v: "30 000", k: "реакций на один пост", href: "#" },
  { v: "21 000", k: "просмотров одной статьи", href: "#" },
  { v: "#3", k: "блог на VC.ru, июнь 2026", href: "#" },
  { v: "6", k: "собранных продуктов", href: null },
  { v: "0", k: "нанятых людей", href: null },
];

const BRANCHES = [
  { t: "Log", c: "тексты и подкаст", href: "/new/log" },
  { t: "Работы", c: "шесть собранных продуктов", href: "/new/works" },
  { t: "Мастерская", c: "закрытый канал", href: "/new/workshop" },
  { t: "Обо мне", c: "опыт и контакты", href: "/new/about" },
];

export default function NewHome() {
  // Три самых свежих русских материала. Список читается из content/blog,
  // а не переписывается руками.
  const fresh = ruCardPosts().slice(0, 3);

  return (
    <>
      <NewHeader />

      {/* корневой layout сайта уже даёт <main>, второй вкладывать нельзя */}
      <div>
        {/* ——— блок 1. Первый экран ———
            Без .nm-wrap: секция сама держит только левый отступ, чтобы
            фото справа могло дойти до настоящего края окна (см. .nm-hero
            в new.css). */}
        <section className="nm-hero">
          <div className="nm-hero-in">
            <div className="nm-hero-text">
              <h1 className="nm-h1">
                <span>Вы пришли</span>
                <span>понять</span>
                <span>кто это</span>
              </h1>

              <div className="nm-hero-meta">
                <p className="nm-sub">
                  Делаю сам, пишу сам, снимаю сам. Здесь всё, что собрал, и
                  разборы. Забирайте, что пригодится.
                </p>

                <p className="nm-status">
                  <span className="nm-dot" aria-hidden="true" />
                  Открыт к знакомствам и партнёрствам
                </p>
              </div>
            </div>

            <Photo
              className="nm-hero-photo"
              src="/new/hero.jpg"
              alt="Jasur Akhmadaliev"
              ratio="1:1"
            />
          </div>
        </section>

        {/* ——— блок 2. Цифры ——— */}
        <section className="nm-wrap">
          <div className="nm-nums">
            {NUMS.map((n) =>
              n.href ? (
                <a key={n.k} className="nm-num-a" href={n.href}>
                  <span className="nm-num-v">{n.v}</span>
                  <span className="nm-num-k">{n.k}</span>
                </a>
              ) : (
                <div key={n.k}>
                  <span className="nm-num-v">{n.v}</span>
                  <span className="nm-num-k">{n.k}</span>
                </div>
              )
            )}
          </div>
        </section>

        {/* ——— блок 3. Ветки ——— */}
        <section className="nm-wrap nm-branches">
          <p className="nm-sec-t">Куда дальше</p>
          <div>
            {BRANCHES.map((b) => (
              <a key={b.t} className="nm-branch" href={b.href}>
                <span className="nm-branch-text">
                  <span className="nm-branch-t">{b.t}</span>
                  <span className="nm-branch-c">{b.c}</span>
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
          <p className="nm-sec-t">Свежее</p>
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
            <a href="/new/log">Все материалы в Log</a>
          </p>
        </section>

        {/* ——— блок 5. Контакты и подвал ——— */}
        <NewFooter />
      </div>
    </>
  );
}
