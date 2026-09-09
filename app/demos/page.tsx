"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/translations";

const productDemos = [
  {
    href: "/demos/mia",
    emoji: "🦷",
    name: { en: "Mia, a clinic RAG assistant", ru: "Mia, RAG-ассистент клиники" },
    desc: {
      en: "An assistant that answers patients only from the clinic's documents. Step-by-step walkthrough plus the live assistant on Hugging Face.",
      ru: "Ассистент, который отвечает пациентам только по документам клиники. Пошаговый разбор плюс живой ассистент на Hugging Face.",
    },
    tags: ["RAG", "Hugging Face", "не выдумывает"],
    live: true,
  },
  {
    href: "/demos/career",
    emoji: "🎯",
    name: { en: "AI Career System", ru: "AI Career System" },
    desc: {
      en: "My own job search automation: vacancy link in, tailored cover letter out in ~80 seconds. Watch a real run step by step.",
      ru: "Автоматизация моего собственного поиска работы: на входе ссылка на вакансию, на выходе письмо за ~80 секунд. Прогон по шагам.",
    },
    tags: ["Claude", "n8n", "Telegram"],
    live: false,
  },
];

const demos = [
  {
    href: "/demos/preorder",
    emoji: "🏒",
    name: { en: "Pre-order from the stands", ru: "Предзаказ с трибуны" },
    desc: {
      en: "A fan scans a QR on the seat, pays via SBP without getting up, and picks the order up at a separate window. The stand serves ~30% more checks per break.",
      ru: "Болельщик сканирует QR на кресле, платит через СБП не вставая с места и забирает заказ в отдельном окне. Точка пропускает на ~30% больше чеков за перерыв.",
    },
    tags: ["Telegram WebApp", "СБП", "QR"],
    live: false,
  },
  {
    href: "/demos/leftovers",
    emoji: "🥐",
    name: { en: "Evening leftovers sold by AI", ru: "Слив вечерних остатков через ИИ" },
    desc: {
      en: "At 7:30 pm AI looks at the counter, writes a push, and sends it to loyal customers nearby. Write-offs go to zero.",
      ru: "В 19:30 ИИ смотрит на витрину, пишет пуш и отправляет его лояльным клиентам рядом. Списания уходят в ноль.",
    },
    tags: ["iiko", "AI", "Push"],
    live: true,
  },
  {
    href: "/demos/fraud",
    emoji: "🛡️",
    name: { en: "POS fraud control", ru: "Фрод-контроль касс" },
    desc: {
      en: "Check voids, deleted items, and suspicious discounts trigger an instant Telegram alert to the owner: who, where, how much.",
      ru: "Отмены чеков, удаления позиций и подозрительные скидки мгновенно летят алертом владельцу в Telegram: кто, где и на сколько.",
    },
    tags: ["Кассы", "Telegram", "Алерты"],
    live: false,
  },
  {
    href: "/demos/reviews",
    emoji: "💬",
    name: { en: "AI replies to reviews", ru: "ИИ-автоответы на отзывы" },
    desc: {
      en: "AI drafts replies to Yandex Maps and 2GIS reviews in the venue's tone. The manager only approves.",
      ru: "ИИ готовит ответы на отзывы в Яндекс Картах и 2ГИС в тоне заведения. Менеджер только утверждает.",
    },
    tags: ["Яндекс", "2ГИС", "AI"],
    live: true,
  },
];

export default function DemosPage() {
  const { lang } = useLanguage();
  const d = t[lang].demos;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="font-mono text-xs text-white/30 tracking-[0.2em] uppercase mb-3">{d.label}</p>
      <h1 className="font-mono text-3xl font-bold text-white mb-4">{d.title}</h1>
      <p className="text-white/50 text-sm leading-relaxed max-w-2xl mb-4">{d.intro}</p>
      <div className="mb-12 px-4 py-3 border border-[#7C3AED]/20 rounded-lg bg-[#7C3AED]/5 max-w-2xl">
        <p className="font-mono text-xs text-[#a78bfa]">{d.note}</p>
      </div>

      <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-5">{d.groupBusiness}</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-14">
        {demos.map((demo, i) => (
          <DemoCard key={demo.href} demo={demo} index={i} lang={lang} openLabel={d.open} />
        ))}
      </div>

      <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-5">{d.groupProducts}</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {productDemos.map((demo, i) => (
          <DemoCard key={demo.href} demo={demo} index={i} lang={lang} openLabel={d.open} />
        ))}
      </div>
    </div>
  );
}

function DemoCard({
  demo,
  index,
  lang,
  openLabel,
}: {
  demo: (typeof demos)[number];
  index: number;
  lang: "en" | "ru";
  openLabel: string;
}) {
  return (
    <Link
      href={demo.href}
      className="group p-6 bg-[#111111] border border-[#1f1f1f] rounded-lg hover:border-[#7C3AED]/40 transition-colors animate-[fadeUp_0.5s_ease_both]"
      style={{ animationDelay: `${index * 90}ms` }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{demo.emoji}</span>
        {demo.live && (
          <span className="ml-auto font-mono text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            live AI
          </span>
        )}
      </div>
      <p className="font-mono text-sm font-bold text-white mb-2 group-hover:text-[#a78bfa] transition-colors">
        {demo.name[lang]}
      </p>
      <p className="text-white/45 text-sm leading-relaxed mb-4">{demo.desc[lang]}</p>
      <div className="flex flex-wrap gap-1.5">
        {demo.tags.map((tag) => (
          <span key={tag} className="font-mono text-[9px] text-white/35 border border-white/10 rounded px-1.5 py-0.5">
            {tag}
          </span>
        ))}
      </div>
      <p className="font-mono text-xs text-[#a78bfa] mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {openLabel} →
      </p>
    </Link>
  );
}
