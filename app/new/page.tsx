import Photo from "./Photo";

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
  { t: "Log", c: "тексты и подкаст", img: "/new/branch-log.jpg" },
  {
    t: "Работы",
    c: "шесть собранных продуктов",
    img: "/new/branch-works.jpg",
  },
  {
    t: "Мастерская",
    c: "закрытый канал",
    img: "/new/branch-workshop.jpg",
  },
  {
    t: "Обо мне",
    c: "опыт и контакты",
    img: "/new/branch-about.jpg",
  },
];

const FRESH = [
  {
    cover: "/blog/skolko-zarabatyvaet-prodakt-menedzher-2026.jpg",
    date: "17 сентября 2026",
    rubric: "Карьера",
    title: "Сколько зарабатывает продакт-менеджер в России в 2026 году",
    href: "/blog/skolko-zarabatyvaet-prodakt-menedzher-2026",
  },
  {
    cover: "/blog/kak-popast-v-otvety-chatgpt-i-alisy.jpg",
    date: "17 сентября 2026",
    rubric: "AI",
    title: "Как попасть в ответы ChatGPT и Алисы: GEO в 2026 году",
    href: "/blog/kak-popast-v-otvety-chatgpt-i-alisy",
  },
  {
    cover: "/blog/ne-znayu.jpg",
    date: "14 сентября 2026",
    rubric: "AI",
    title: "Лучшее, что умеет мой ассистент, это сказать «не знаю»",
    href: "/blog/ne-znayu",
  },
];

export default function NewHome() {
  return (
    <>
      {/* служебная полоса: её на живом сайте не будет */}
      <div className="nm-lab">
        <div className="nm-wrap nm-lab-in">
          <span className="nm-lab-note">Макет · новая главная · /new</span>
        </div>
      </div>

      {/* ——— блок 0. Шапка ——— */}
      <header className="nm-head">
        <div className="nm-wrap nm-head-in">
          <a className="nm-logo" href="#">
            Jasur Akhmadaliev
          </a>
          <nav className="nm-nav">
            <a href="#">Log</a>
            <a href="#">Работы</a>
            <a href="#">Мастерская</a>
            <a href="#">Обо мне</a>
          </nav>
          {/* переключатель языка нерабочий, только вид */}
          <div className="nm-lang">
            <span className="is-on">RU</span>
            <span className="is-off">EN</span>
          </div>
        </div>
      </header>

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
                <span>понять,</span>
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
              ratio="3:2"
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
              <a key={b.t} className="nm-branch" href="#">
                <Photo
                  className="nm-branch-photo"
                  src={b.img}
                  alt={b.t}
                  ratio="16:10"
                />
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
            {FRESH.map((c) => (
              <a key={c.title} className="nm-card" href={c.href}>
                <Photo src={c.cover} alt={c.title} ratio="16:10" />
                <span className="nm-card-meta">
                  {c.date} · {c.rubric}
                </span>
                <span className="nm-card-t">{c.title}</span>
              </a>
            ))}
          </div>
          <p className="nm-more">
            <a href="/writing">Все материалы в Log</a>
          </p>
        </section>

        {/* ——— блок 5. Контакты и подвал ——— */}
        <section className="nm-wrap nm-contacts">
          <h2 className="nm-h2">Пишите</h2>

          <div className="nm-cline">
            <span className="nm-cline-k">Написать</span>
            <a
              className="nm-cline-v nm-ink-link"
              href="https://t.me/biznesmind"
            >
              @biznesmind
            </a>
          </div>

          <div className="nm-cline">
            <span className="nm-cline-k">Читать</span>
            <a className="nm-cline-v" href="https://t.me/head_of_ceo">
              @head_of_ceo
            </a>
          </div>

          <p className="nm-small">
            <a href="#">почта</a>
            <a href="#">LinkedIn</a>
            <a href="#">GitHub</a>
          </p>

          <footer className="nm-foot">
            <span>2026</span>
            <span>Jasur Akhmadaliev</span>
          </footer>
        </section>
      </div>
    </>
  );
}
