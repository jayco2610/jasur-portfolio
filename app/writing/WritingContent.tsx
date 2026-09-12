"use client";

import Link from "next/link";
import MagChrome from "@/components/magazine/MagChrome";
import { useReveal } from "@/hooks/useReveal";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/translations";
import type { PostMeta } from "@/lib/blog";
import { RUBRICS, rubricName, rubricDescription, MAGAZINE_NAME } from "@/lib/rubrics";

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


function shortDate(date: string, ru: boolean): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString(ru ? "ru-RU" : "en-US", {
    day: "2-digit",
    month: "long",
  });
}

function Visual({ cover }: { cover?: string }) {
  return <div className="mag-im">{cover && <img src={cover} alt="" />}</div>;
}

function Hero({ post, lang, ru }: { post: PostMeta; lang: "en" | "ru"; ru: boolean }) {
  const { ref, className } = useReveal<HTMLAnchorElement>(0);
  return (
    <Link ref={ref} href={`/blog/${post.slug}`} className={`mag-hero ${className}`}>
      <Visual cover={post.cover} />
      <div className="mag-hero-tx">
        <div className="mag-rub">{ru ? "Главное" : "Lead"}</div>
        <h2>{post.title}</h2>
        <p>{post.description}</p>
        <div className="mag-hero-meta">
          <span className="tiny">{shortDate(post.date, ru)}</span>
          <span className="tiny">{rubricName(post.rubric, lang)}</span>
        </div>
      </div>
    </Link>
  );
}

function Card({
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
      <Visual cover={post.cover} />
      <div className="mag-rub">{rubricName(post.rubric, lang)}</div>
      <h4>{post.title}</h4>
      <div className="mag-card-meta">
        <span className="tiny">{shortDate(post.date, ru)}</span>
        {post.tags[0] && <span className="tiny">{post.tags[0]}</span>}
      </div>
    </Link>
  );
}

export default function WritingContent({ posts }: { posts: PostMeta[] }) {
  const { lang } = useLanguage();
  const w = t[lang].writing;
  const ru = lang === "ru";
  const [lead, ...rest] = posts;

  return (
    <div className="mag-root">
      <MagChrome />

      <div className="mag-w">
        <div className="mag-title">
          <h1>{MAGAZINE_NAME[lang]}</h1>
          <p className="mag-about">
            {ru
              ? "Пишу про то, что делаю сам. Что сработало, что развалилось, сколько стоило."
              : "I write about what I build myself. What worked, what broke, what it cost."}
          </p>
        </div>

        {/* О чём каждый раздел */}
        <div className="mag-sec" style={{ paddingTop: 0 }}>
          <div className="mag-sh">
            <h3>{ru ? "Разделы" : "Sections"}</h3>
            <span className="mag-ln" />
            <span className="tiny">{String(RUBRICS.length).padStart(2, "0")}</span>
          </div>
          <div className="mag-rub-grid">
            {RUBRICS.map((r) => (
              <Link key={r.key} href={`/blog/tema/${r.key}`} className="mag-rub-card">
                <div className="mag-rub-im">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.cover} alt="" loading="lazy" />
                </div>
                <b>{rubricName(r.key, lang)}</b>
                <span>{rubricDescription(r.key, lang)}</span>
              </Link>
            ))}
          </div>
        </div>

        <Link href="/podcast" className="pod-strip">
          <div className="pod-strip-im">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/podcast/studio.jpg" alt="" loading="lazy" />
          </div>
          <div className="pod-strip-tx">
            <span className="tiny">{ru ? "Подкаст" : "Podcast"}</span>
            <b>Product Talks</b>
            <span>
              {ru
                ? "Разговоры и голосовые про продукт, бизнес и AI. Первый выпуск пишется."
                : "Conversations and voice notes on product, business and AI. First episode is being recorded."}
            </span>
            <i>{ru ? "Открыть →" : "Open →"}</i>
          </div>
        </Link>

        {lead ? (
          <>
            <Hero post={lead} lang={lang} ru={ru} />

            {rest.length > 0 && (
              <div className="mag-sec">
                <div className="mag-sh">
                  <h3>{ru ? "Свежее" : "Latest"}</h3>
                  <span className="mag-ln" />
                  <span className="tiny">{String(rest.length).padStart(2, "0")}</span>
                </div>
                <div className="mag-grid">
                  {rest.slice(0, 9).map((post, i) => (
                    <Card key={post.slug} post={post} i={i} lang={lang} ru={ru} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="py-16 text-[16px] leading-[1.6] max-w-2xl">
            {ru
              ? "Пока пусто. Скоро будет."
              : "Empty for now. Soon."}
          </p>
        )}
      </div>

      <div className="mag-divider">
        <span>{ru ? "ГДЕ ЕЩЁ Я ПИШУ" : "PUBLISHED ELSEWHERE"}</span>
      </div>

      <div className="mag-w">
        <div className="mag-sec" style={{ paddingTop: 34 }}>
          <div className="mag-sh">
            <h3>{w.publishedLabel}</h3>
            <span className="mag-ln" />
            <span className="tiny">{String(published.length).padStart(2, "0")}</span>
          </div>
          <div className="mag-grid">
            {published.slice(0, 6).map((a, i) => (
              <a
                key={a.href}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mag-card"
              >
                <div className="mag-rub">{a.platform}</div>
                <h4>{a.title[lang]}</h4>
                <div className="mag-card-meta">
                  <span className="tiny">{a.lang}</span>
                  <span className="tiny">{ru ? "читать" : "read"}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="mag-sec">
          <div className="mag-sh">
            <h3>{w.channelsLabel}</h3>
            <span className="mag-ln" />
            <span className="tiny">{String(channelsList.length).padStart(2, "0")}</span>
          </div>
          <div className="mag-else">
            {channelsList.map((c) => (
              <a key={c.name} href={c.href} target="_blank" rel="noopener noreferrer">
                <b>{c.name}</b>
                <span className="tiny">{c.description[lang]}</span>
              </a>
            ))}
          </div>
        </div>

        <footer className="mag-foot">
          <span className="tiny">
            {MAGAZINE_NAME[lang]} · {ru ? "блог Жасура Ахмадалиева" : "a blog by Jasur Akhmadaliev"}
          </span>
          <span className="flex gap-6">
            <a href="/feed.xml" className="tiny">RSS</a>
            <Link href="/" className="tiny">
              {ru ? "← В портфолио" : "← Back to portfolio"}
            </Link>
          </span>
        </footer>
      </div>
    </div>
  );
}
