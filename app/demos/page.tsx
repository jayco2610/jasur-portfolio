"use client";

import Link from "next/link";
import { useReveal } from "@/hooks/useReveal";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/translations";

const productDemos = [
  {
    href: "/demos/mia",
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
    name: { en: "AI replies to reviews", ru: "ИИ-автоответы на отзывы" },
    desc: {
      en: "AI drafts replies to Yandex Maps and 2GIS reviews in the venue's tone. The manager only approves.",
      ru: "ИИ готовит ответы на отзывы в Яндекс Картах и 2ГИС в тоне заведения. Менеджер только утверждает.",
    },
    tags: ["Яндекс", "2ГИС", "AI"],
    live: true,
  },
];

function DemoRow({ demo, lang, index, letter, openLabel }: {
  demo: (typeof demos)[number];
  lang: "en" | "ru";
  index: number;
  letter: string;
  openLabel: string;
}) {
  const { ref, className } = useReveal<HTMLAnchorElement>(index);
  return (
    <Link ref={ref} href={demo.href} className={`row block ${className}`}>
      <span className="tiny">
        {letter}.0{index + 1}
      </span>
      <div>
        <span className="row-title !text-[22px] md:!text-[28px]">{demo.name[lang]}</span>
        <div className="tiny mt-2.5">{demo.tags.join(" · ")}</div>
      </div>
      <p className="row-desc">{demo.desc[lang]}</p>
      <span className="tiny">{demo.live ? "live AI" : openLabel}</span>
    </Link>
  );
}

export default function DemosPage() {
  const { lang } = useLanguage();
  const d = t[lang].demos;

  return (
    <>
      <div className="wrap">
        <div className="tiny pt-11 pb-8">{d.label}</div>
        <div className="sh">
          <span className="tiny">01</span>
          <h1>
            {d.title.split(" ")[0]} <em className="serif">{d.title.split(" ").slice(1).join(" ")}</em>
          </h1>
          <span className="tiny">{demos.length + productDemos.length}</span>
        </div>

        <div className="grid gap-6 pt-6 md:grid-cols-[1.25fr_1fr] md:gap-14">
          <p className="text-[clamp(15.5px,1.35vw,18px)] leading-[1.62] max-w-2xl">{d.intro}</p>
          <p className="text-[14.5px] text-dim border-t border-ink pt-3.5">{d.note}</p>
        </div>
      </div>

      <div className="wrap">
        <section className="sec">
          <div className="sh">
            <span className="tiny">02</span>
            <h2>{d.groupBusiness}</h2>
            <span className="tiny">{demos.length}</span>
          </div>
          {demos.map((demo, i) => (
            <DemoRow key={demo.href} demo={demo} lang={lang} index={i} letter="D" openLabel={d.open} />
          ))}
        </section>
      </div>

      <div className="wrap">
        <section className="sec pb-24">
          <div className="sh">
            <span className="tiny">03</span>
            <h2>{d.groupProducts}</h2>
            <span className="tiny">{productDemos.length}</span>
          </div>
          {productDemos.map((demo, i) => (
            <DemoRow key={demo.href} demo={demo} lang={lang} index={i} letter="P" openLabel={d.open} />
          ))}
        </section>
      </div>
    </>
  );
}
