"use client";

import Link from "next/link";
import Band from "@/components/Band";
import CountUp from "@/components/CountUp";
import { useReveal } from "@/hooks/useReveal";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/translations";
import type { PostMeta } from "@/lib/blog";
import { RUBRICS, rubricName } from "@/lib/rubrics";

function postDate(date: string, ru: boolean): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString(ru ? "ru-RU" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Обложка материала. Если картинки нет, собираем её типографикой:
// название рубрики крупно плюс номер, как на газетной полосе.
function Visual({ post, lang, no }: { post: PostMeta; lang: "en" | "ru"; no: string }) {
  return (
    <div className="mag-visual">
      {post.cover ? (
        <img src={post.cover} alt="" />
      ) : (
        <>
          <span className="mag-visual-no">{no}</span>
          <span>{rubricName(post.rubric, lang)}</span>
        </>
      )}
    </div>
  );
}

// Материал номера: крупно, в две колонки.
function MagCover({ post, lang, ru }: { post: PostMeta; lang: "en" | "ru"; ru: boolean }) {
  const { ref, className } = useReveal<HTMLAnchorElement>(0);
  return (
    <Link ref={ref} href={`/blog/${post.slug}`} className={`mag-cover ${className}`}>
      <Visual post={post} lang={lang} no="01" />
      <div>
        <div className="post-meta">
          <span className="tiny">{rubricName(post.rubric, lang)}</span>
          <span className="tiny">{postDate(post.date, ru)}</span>
        </div>
        <h3>{post.title}</h3>
        <p className="post-desc">{post.description}</p>
        <p className="tiny mt-6">{ru ? "Читать" : "Read"}</p>
      </div>
    </Link>
  );
}

function MagCard({
  post,
  i,
  lang,
  ru,
}: {
  post: PostMeta;
  i: number;
  lang: "en" | "ru";
  ru: boolean;
}) {
  const { ref, className } = useReveal<HTMLAnchorElement>(i);
  return (
    <Link ref={ref} href={`/blog/${post.slug}`} className={`mag-card ${className}`}>
      <Visual post={post} lang={lang} no={String(i + 2).padStart(2, "0")} />
      <div className="post-meta mt-3.5">
        <span className="tiny">{rubricName(post.rubric, lang)}</span>
        <span className="tiny">{postDate(post.date, ru)}</span>
      </div>
      <h3>{post.title}</h3>
      <p className="post-desc !mt-3 !text-[14.5px]">{post.description}</p>
    </Link>
  );
}

const published = [
  {
    title: {
      en: "How I spent months failing to find a PM job, snapped, and built an AI clone to go to interviews for me",
      ru: "Как я месяцами безуспешно искал работу PM'ом, психанул и создал AI-клона, который проходит собеседования вместо меня",
    },
    platform: "VC.ru",
    lang: "RU",
    description: {
      en: "A candid manifesto on why hiring in tech is broken and how a product approach helped me digitize my own thinking. 19K engagements, Top-3 VC.ru.",
      ru: "Честный манифест о том, почему найм в IT сломан и как продуктовый подход помог оцифровать собственный мозг. 19K взаимодействий, Топ-3 VC.ru.",
    },
    href: "https://vc.ru/id5991727",
  },
  {
    title: {
      en: "Why 94% of Product Managers Use AI — and Most Are Missing the Point",
      ru: "Почему 94% продакт-менеджеров используют AI — и большинство упускает суть",
    },
    platform: "LinkedIn",
    lang: "EN",
    description: {
      en: "Adoption is near-universal, but the real edge is using AI to think, not just to produce output faster.",
      ru: "Все уже используют AI, но настоящее преимущество — это думать с его помощью, а не просто производить контент быстрее.",
    },
    href: "https://www.linkedin.com/pulse/why-94-product-managers-use-ai-most-missing-point-jasur-akhmadaliev-qfybe/",
  },
  {
    title: {
      en: "15% Repeat Sales Without a Single New Customer",
      ru: "15% повторных продаж без единого нового клиента",
    },
    platform: "LinkedIn",
    lang: "EN",
    description: {
      en: "A product case: lifting repeat sales 15% in a quarter by working the customers you already have, not chasing new ones.",
      ru: "Продуктовый кейс: рост повторных продаж на 15% за квартал — за счёт работы с существующими клиентами, а не погони за новыми.",
    },
    href: "https://www.linkedin.com/pulse/15-repeat-sales-without-single-new-customer-jasur-akhmadaliev-ir9me",
  },
  {
    title: {
      en: "Why Smart Teams Still Launch Doomed Projects (and How to Stop)",
      ru: "Почему умные команды продолжают запускать обречённые проекты (и как это остановить)",
    },
    platform: "LinkedIn",
    lang: "EN",
    description: {
      en: "Why capable teams keep shipping products nobody needs, and a practical way to catch it before you waste months.",
      ru: "Почему компетентные команды раз за разом делают продукты, которые никому не нужны — и как поймать это до того, как потратишь месяцы.",
    },
    href: "https://www.linkedin.com/pulse/why-smart-teams-still-launch-doomed-projects-how-stop-akhmadaliev-ss0ge/",
  },
  {
    title: {
      en: "The PM AI Stack That Actually Works (And Why 95% of Teams Miss It)",
      ru: "AI-стек для PM, который реально работает (и почему 95% команд его не используют)",
    },
    platform: "Medium",
    lang: "EN",
    description: {
      en: "The AI tools product managers actually use across discovery, prioritization, PRDs, and analytics — and the gap between adopting AI and getting results.",
      ru: "AI-инструменты для продактов на каждом этапе: дискавери, приоритизация, PRD, аналитика — и разрыв между «внедрили AI» и «получили результат».",
    },
    href: "https://medium.com/@jasurakhmadaliev283/the-pm-ai-stack-that-actually-works-and-why-95-of-teams-miss-it-9fb5e3b46c4f",
  },
  {
    title: {
      en: "The NASA Trick Product Managers Almost Never Use",
      ru: "Приём NASA, который продакты почти никогда не используют",
    },
    platform: "Medium",
    lang: "EN",
    description: {
      en: "A structured thinking technique borrowed from NASA that most PMs overlook when making decisions under uncertainty.",
      ru: "Техника структурированного мышления из NASA, которую большинство продактов игнорируют при принятии решений в условиях неопределённости.",
    },
    href: "https://medium.com/@jasurakhmadaliev283/the-nasa-trick-product-managers-almost-never-use-67156efea126",
  },
  {
    title: {
      en: "The Customers You Already Have Are the Ones You Are Losing",
      ru: "Клиенты, которые у вас уже есть — это те, кого вы теряете",
    },
    platform: "Medium",
    lang: "EN",
    description: {
      en: "Why retention beats acquisition, and the quiet ways companies lose the customers they already paid to win.",
      ru: "Почему удержание важнее привлечения — и незаметные способы, которыми компании теряют клиентов, за которых уже заплатили.",
    },
    href: "https://medium.com/@jasurakhmadaliev283/the-customers-you-already-have-are-the-ones-you-are-losing-c69461b648f8",
  },
  {
    title: {
      en: "Your Best Thinking Happens Before You Start Writing",
      ru: "Лучшие мысли появляются до того, как вы начинаете писать",
    },
    platform: "Medium",
    lang: "EN",
    description: {
      en: "How voice and AI capture better thinking than typing, and why input speed shapes the quality of your ideas.",
      ru: "Как голос и AI фиксируют мышление лучше, чем набор текста — и почему скорость ввода влияет на качество идей.",
    },
    href: "https://medium.com/@jasurakhmadaliev283/your-best-thinking-happens-before-you-start-writing-0eb0f35df9c7",
  },
  {
    title: {
      en: "Fable 5 in 36 Hours: Launch, Controversy, Ban. What It Means for AI Businesses",
      ru: "Fable 5 за 36 часов: запуск, скандал, запрет. Что это значит для бизнеса на AI",
    },
    platform: "VC.ru",
    lang: "RU",
    description: {
      en: "Launch, controversy, and restriction of a new AI model in 36 hours — and what it means for businesses building on AI.",
      ru: "Запуск, скандал и ограничение новой AI-модели за 36 часов — и что это значит для бизнеса, строящегося на AI.",
    },
    href: "https://vc.ru/id5991727/2977300-fable-5-zapusk-skandal-posledstviya-dlya-biznesa-na-ai",
  },
];

const channelsList = [
  {
    name: "Telegram @head_of_ceo",
    description: { en: "Main hub. AI tools, PM thinking, job search diary.", ru: "Главный канал. AI-инструменты, продуктовое мышление, дневник поиска работы." },
    href: "https://t.me/head_of_ceo",
  },
  {
    name: "Medium",
    description: { en: "Long-form product and AI articles in English.", ru: "Длинные статьи о продукте и AI на английском." },
    href: "https://medium.com/@jasurakhmadaliev283",
  },
  {
    name: "LinkedIn",
    description: { en: "Professional content in English. PM cases and AI updates.", ru: "Профессиональный контент на английском. PM-кейсы и AI-обновления." },
    href: "https://www.linkedin.com/in/jasur-akhmadaliev",
  },
  {
    name: "VC.ru",
    description: { en: "Business cases and product thinking in Russian.", ru: "Бизнес-кейсы и продуктовое мышление на русском." },
    href: "https://vc.ru/id5991727",
  },
  {
    name: "Habr",
    description: { en: "Deep technical and product articles in Russian.", ru: "Глубокие технические и продуктовые статьи на русском." },
    href: "https://habr.com/ru/users/Akhmadaliev/",
  },
  {
    name: "X",
    description: { en: "Short-form English distribution.", ru: "Короткий контент на английском." },
    href: "https://x.com/Jasur1651Jasur",
  },
];

function ArticleRow({ a, i, lang, ru }: { a: (typeof published)[number]; i: number; lang: "en" | "ru"; ru: boolean }) {
  const { ref, className } = useReveal<HTMLAnchorElement>(i);
  return (
    <a ref={ref} href={a.href} target="_blank" rel="noopener noreferrer" className={`row block ${className}`}>
      <span className="tiny">B.{String(i + 1).padStart(2, "0")}</span>
      <div>
        <span className="row-title !text-[22px] md:!text-[28px]">{a.title[lang]}</span>
        <div className="tiny mt-2.5">
          {a.platform} · {a.lang}
        </div>
      </div>
      <p className="row-desc">{a.description[lang]}</p>
      <span className="tiny">{ru ? "читать" : "read"} →</span>
    </a>
  );
}

export default function WritingContent({ posts }: { posts: PostMeta[] }) {
  const { lang } = useLanguage();
  const w = t[lang].writing;
  const ru = lang === "ru";

  const [lead, ...rest] = posts;
  // Показываем только те рубрики, в которых уже есть материалы,
  // чтобы в меню не висели пустые разделы.
  const usedRubrics = RUBRICS.map((r) => r.key).filter((key) =>
    posts.some((p) => p.rubric === key)
  );

  return (
    <>
      {/* ===== блог: собственная шапка издания =====
          Показываем только когда есть статьи, иначе на сайте висела бы
          пустая витрина, а публикации на площадках уезжали бы вниз. */}
      {posts.length > 0 && (
        <>
          <div className="wrap">
            <header className="blog-mast">
              <div className="tiny mb-6">{ru ? "Блог · Жасур Ахмадалиев" : "Blog · Jasur Akhmadaliev"}</div>
              <h1 className="blog-name">
                {ru ? "Строю и " : "Building, "}
                <em>{ru ? "рассказываю" : "out loud"}</em>
              </h1>
              <p className="blog-lede">
                {ru
                  ? "Продукт, AI и автоматизация. Пишу о том, что делаю сам: что заработало, что развалилось и сколько это стоило. Без пересказов чужих статей."
                  : "Product, AI and automation. I write about what I actually build: what worked, what broke and what it cost. No rehashing of other people's posts."}
              </p>

              {usedRubrics.length > 0 && (
                <nav className="mag-rubrics">
                  {usedRubrics.map((key) => (
                    <Link key={key} href={`/blog/tema/${key}`}>
                      {rubricName(key, lang)}
                    </Link>
                  ))}
                </nav>
              )}
            </header>
          </div>

          {/* материал номера */}
          <div className="wrap">
            {lead && <MagCover post={lead} lang={lang} ru={ru} />}
          </div>

          {/* актуальное */}
          {rest.length > 0 && (
            <div className="wrap">
              <div className="mag-section">
                <h2>{ru ? "Актуальное" : "Latest"}</h2>
                <span className="tiny">{rest.length}</span>
              </div>
              <div className="mag-grid">
                {rest.slice(0, 6).map((post, i) => (
                  <MagCard key={post.slug} post={post} i={i} lang={lang} ru={ru} />
                ))}
              </div>
            </div>
          )}

          {/* рубрики, в которых есть материалы */}
          {usedRubrics.map((key) => {
            const inRubric = posts.filter((p) => p.rubric === key);
            if (inRubric.length === 0) return null;
            return (
              <div className="wrap" key={key}>
                <div className="mag-section">
                  <h2>{rubricName(key, lang)}</h2>
                  <Link href={`/blog/tema/${key}`} className="tiny hover:text-ink transition-colors">
                    {ru ? "Смотреть все" : "See all"}
                  </Link>
                </div>
                <div className="mag-grid">
                  {inRubric.slice(0, 3).map((post, i) => (
                    <MagCard key={post.slug} post={post} i={i} lang={lang} ru={ru} />
                  ))}
                </div>
              </div>
            );
          })}

          <div className="wrap">
            <div className="blog-cta">
              <div>
                <p className="blog-cta-title">
                  {ru
                    ? "Новые тексты сначала выходят в Telegram"
                    : "New pieces land in Telegram first"}
                </p>
                <p className="post-desc">
                  {ru
                    ? "Там же разборы, черновики и то, что не дотянуло до статьи."
                    : "Along with notes, drafts and everything that never became an article."}
                </p>
              </div>
              <div className="flex flex-wrap gap-6 items-end">
                <a
                  href="https://t.me/head_of_ceo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tiny !text-[11px] px-5 py-3 bg-ink text-paper hover:opacity-80 transition-opacity"
                >
                  @head_of_ceo
                </a>
                <a href="/feed.xml" className="share-link">
                  RSS
                </a>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== опубликовано на площадках ===== */}
      <Band word={ru ? "ТЕКСТЫ" : "TEXTS"} note={`02 — ${w.publishedLabel}`} />

      <div className="wrap">
        <section className="sec">
          <div className="grid gap-9 items-end lg:grid-cols-[1.35fr_0.9fr] lg:gap-14">
            <div>
              <div className="sh">
                <span className="tiny">02</span>
                <h2>{w.publishedLabel}</h2>
                <span className="tiny">{published.length}</span>
              </div>
              <p className="text-[clamp(15.5px,1.35vw,18px)] leading-[1.62] max-w-2xl pt-6">{w.statsDesc}</p>

              <div className="nums mt-2">
                {w.stats.map((s) => (
                  <div className="num" key={s.value}>
                    <CountUp value={s.value} />
                    <span className="tiny">
                      {s.label} · {s.sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <figure className="self-end max-w-[420px] lg:max-w-none">
              <img src="/writing-photo.png" alt="" className="w-full block grayscale contrast-[1.04] mix-blend-multiply" />
              <figcaption className="flex justify-between items-baseline mt-2.5 pt-2 border-t border-ink">
                <span className="tiny">{ru ? "Рис. 00 — Чтение" : "Fig. 00 — Reading"}</span>
                <span className="tiny">2026</span>
              </figcaption>
            </figure>
          </div>

          <div className="mt-10">
            {published.map((a, i) => (
              <ArticleRow key={a.href} a={a} i={i} lang={lang} ru={ru} />
            ))}
          </div>
        </section>
      </div>

      {/* ===== каналы ===== */}
      <div className="wrap">
        <section className="sec pb-24">
          <div className="sh">
            <span className="tiny">03</span>
            <h2>{w.channelsLabel}</h2>
            <span className="tiny">{channelsList.length}</span>
          </div>

          <div className="grid sm:grid-cols-2">
            {channelsList.map((c) => (
              <a
                key={c.name}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group pt-6 pr-6 pb-6 border-b border-rule-soft no-underline text-ink"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <b className="inline-block font-bold px-1.5 -ml-1.5 pb-0.5 transition-colors group-hover:bg-ink group-hover:text-paper">
                    {c.name}
                  </b>
                  <span className="tiny shrink-0">→</span>
                </div>
                <p className="row-desc mt-2">{c.description[lang]}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
