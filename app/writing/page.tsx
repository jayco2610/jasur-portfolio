"use client";

import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/translations";

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
    name: "Telegram @pmvision_ai",
    description: { en: "Main hub. AI tools, PM thinking, job search diary.", ru: "Главный канал. AI-инструменты, продуктовое мышление, дневник поиска работы." },
    href: "https://t.me/pmvision_ai",
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

export default function WritingPage() {
  const { lang } = useLanguage();
  const w = t[lang].writing;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="font-mono text-xs text-white/30 tracking-[0.2em] uppercase mb-3">{w.label}</p>
      <h1 className="font-mono text-3xl font-bold text-white mb-2">{w.title}</h1>
      <p className="text-white/40 text-sm mb-14">{w.subtitle}</p>

      {/* Stats */}
      <p className="text-white/40 text-sm mb-6 max-w-2xl">{w.statsDesc}</p>
      <div className="grid grid-cols-3 gap-4 mb-14">
        {w.stats.map((s) => (
          <div key={s.value} className="p-5 bg-[#111111] border border-[#1f1f1f] rounded-lg">
            <p className="font-mono text-2xl font-bold text-[#a78bfa]">{s.value}</p>
            <p className="font-mono text-[11px] text-white/50 mt-1">{s.label}</p>
            <p className="font-mono text-[10px] text-white/25 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Published */}
      <section className="mb-16">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-6">{w.publishedLabel}</p>
        <div className="space-y-4">
          {published.map((a) => (
            <a key={a.href} href={a.href} target="_blank" rel="noopener noreferrer"
              className="block p-5 bg-[#111111] rounded-lg border border-[#1f1f1f] hover:border-[#7C3AED]/40 transition-colors group">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/30 border border-white/10">{a.platform}</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1E3A8A]/30 text-blue-300">{a.lang}</span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
                  {lang === "en" ? "published" : "опубликовано"}
                </span>
                <span className="font-mono text-[10px] text-[#a78bfa] ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  {lang === "en" ? `Read on ${a.platform} →` : `Читать на ${a.platform} →`}
                </span>
              </div>
              <h3 className="text-white font-semibold text-sm mb-2 group-hover:text-[#a78bfa] transition-colors">
                {typeof a.title === "object" ? a.title[lang] : a.title}
              </h3>
              <p className="text-white/40 text-sm">
                {typeof a.description === "object" ? a.description[lang] : a.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Channels */}
      <section>
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-6">{w.channelsLabel}</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {channelsList.map((c) => (
            <div key={c.name} className="p-5 bg-[#111111] border border-[#1f1f1f] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-mono text-sm text-white font-bold">{c.name}</h3>
                {c.href && (
                  <a href={c.href} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-[10px] text-[#a78bfa] hover:text-white transition-colors">
                    {lang === "en" ? "Visit →" : "Открыть →"}
                  </a>
                )}
              </div>
              <p className="text-white/40 text-sm">
                {typeof c.description === "object" ? c.description[lang] : c.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
