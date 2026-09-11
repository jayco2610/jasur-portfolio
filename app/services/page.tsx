"use client";

import Link from "next/link";
import Band from "@/components/Band";
import Mark from "@/components/Mark";
import { useReveal } from "@/hooks/useReveal";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/translations";

type Localized = string | { en: string; ru: string };

function pick(val: Localized | null | undefined, lang: "en" | "ru"): string | null {
  if (val == null) return null;
  return typeof val === "object" ? val[lang] : val;
}

const automation = [
  {
    price: { en: "discussed individually", ru: "обсуждается индивидуально" },
    name: { en: "Corporate AI Stack", ru: "Корпоративный AI-стек" },
    sub: { en: "Claude · ChatGPT · Local Models", ru: "Claude · ChatGPT · Локальные модели" },
    description: {
      en: "Full AI infrastructure for a company: model selection based on task requirements and data security, API integrations, employee training, internal documentation. Works with cloud solutions (Claude Enterprise, ChatGPT Team) and local models (Ollama). Result: the team saves 1–2 hours per person per day.",
      ru: "Полная AI-инфраструктура для компании: выбор модели под задачи и требования безопасности данных, API-интеграции, обучение сотрудников, внутренняя документация. Работает с облачными (Claude Enterprise, ChatGPT Team) и локальными моделями (Ollama). Результат: команда экономит 1–2 часа на человека в день.",
    },
    tag: "Enterprise",
  },
  {
    price: { en: "from 30,000 ₽", ru: "от 30 000 ₽" },
    name: { en: "AI Setup for a Department", ru: "AI-настройка для отдела" },
    sub: { en: "PM · Marketing · Support", ru: "PM · Маркетинг · Поддержка" },
    description: {
      en: "Configure AI for a specific team: audit current tasks, select the right model, set up workflows and prompts, train the team. 2–3 weeks from kickoff to working result.",
      ru: "Настройка AI для конкретной команды: аудит задач, выбор модели, настройка воркфлоу и промтов, обучение. 2–3 недели от старта до рабочего результата.",
    },
    tag: { en: "New", ru: "Новое" },
  },
  {
    price: { en: "from 40,000 ₽", ru: "от 40 000 ₽" },
    name: { en: "RAG Assistant on Your Data", ru: "RAG-ассистент на ваших данных" },
    sub: { en: "Knowledge base → 24/7 assistant", ru: "База знаний → ассистент 24/7" },
    description: {
      en: "Turn your company's documents, knowledge base, or product catalog into an assistant that answers only from your data — no made-up facts. Handles client and staff questions about services, pricing, policies, and procedures.",
      ru: "Превратите документы, базу знаний или каталог продуктов в ассистента, который отвечает только по вашим данным — без выдумок. Обрабатывает вопросы клиентов и сотрудников об услугах, ценах, политиках и процедурах.",
    },
    tag: "RAG",
    demoLink: "https://huggingface.co/spaces/rag-jasur/mia-clinic-assistant",
    demoLabel: { en: "Try the live demo — Mia, a dental clinic assistant", ru: "Попробовать живой демо — Mia, ассистент стоматологии" },
  },
  {
    price: { en: "from 35,000 ₽", ru: "от 35 000 ₽" },
    name: { en: "CRM + AI Automation — Full Setup", ru: "CRM + AI-автоматизация — полная настройка" },
    sub: { en: "amoCRM / Bitrix", ru: "amoCRM / Bitrix" },
    description: {
      en: "CRM setup with an AI layer: sales funnel and deal stages, database import, basic automation (3 scenarios), AI agent for incoming requests, integration with Telegram or WhatsApp.",
      ru: "Настройка CRM с AI-слоем: воронка продаж и стадии сделок, импорт базы, базовая автоматизация (3 сценария), AI-агент для входящих, интеграция с Telegram или WhatsApp.",
    },
    demoLink: "/demos/leftovers",
    demoLabel: { en: "Live demo: AI sells the evening leftovers", ru: "Живое демо: ИИ сливает вечерние остатки" },
  },
  {
    price: { en: "from 25,000 ₽", ru: "от 25 000 ₽" },
    name: { en: "AI Agent Implementation", ru: "Внедрение AI-агента" },
    sub: null,
    description: {
      en: "Custom AI agent for a specific task: handling inquiries, lead qualification, internal assistant, auto-replies. Includes task discovery and technical specification.",
      ru: "Кастомный AI-агент под конкретную задачу: обработка запросов, квалификация лидов, внутренний ассистент, авто-ответы. Включает дискавери задачи и техническое задание.",
    },
    demoLink: "/demos/reviews",
    demoLabel: { en: "Live demo: AI replies to reviews", ru: "Живое демо: ИИ-ответы на отзывы" },
  },
  {
    price: { en: "from 15,000 ₽", ru: "от 15 000 ₽" },
    name: { en: "Process Automation", ru: "Автоматизация процессов" },
    sub: { en: "n8n", ru: "n8n" },
    description: {
      en: "Connect your CRM, messengers, AI, and spreadsheets. A form submission becomes a CRM card, triggers a Telegram notification, and sends an AI reply to the client. Schema, setup, testing, instructions.",
      ru: "Связать CRM, мессенджеры, AI и таблицы. Заявка с формы → карточка в CRM → уведомление в Telegram → AI-ответ клиенту. Схема, настройка, тест, инструкция.",
    },
    demoLink: "/demos/fraud",
    demoLabel: { en: "Live demo: POS fraud alerts in Telegram", ru: "Живое демо: алерты о фроде на кассе в Telegram" },
  },
  {
    price: { en: "from 8,000 ₽", ru: "от 8 000 ₽" },
    name: { en: "AI Tools Audit", ru: "Аудит AI-инструментов" },
    sub: null,
    description: {
      en: "Review your current stack (ChatGPT, Notion AI, Copilot): find where time and money are lost. Output: a 1-page optimization plan with priorities. 1.5-hour session + document.",
      ru: "Разбор текущего стека (ChatGPT, Notion AI, Copilot): найти где теряется время и деньги. Результат: 1-страничный план оптимизации с приоритетами. Сессия 1.5 часа + документ.",
    },
  },
  {
    price: { en: "from 3,500 ₽", ru: "от 3 500 ₽" },
    name: { en: "Consultation — Task Review", ru: "Консультация — разбор задачи" },
    sub: { en: "1 hour", ru: "1 час" },
    description: {
      en: "CRM, automation, AI tools, or processes. A clear action plan and tools matched to your situation. Zoom or call + written summary.",
      ru: "CRM, автоматизация, AI-инструменты или процессы. Чёткий план действий и инструменты под вашу ситуацию. Zoom или звонок + письменное резюме.",
    },
  },
];

const product = [
  {
    price: { en: "from 60,000 ₽/mo", ru: "от 60 000 ₽/мес" },
    name: { en: "Content Factory / AI Brand Ambassador", ru: "Контент-фабрика / AI Brand Ambassador" },
    description: {
      en: "AI-driven daily content system: scripts, AI avatar videos, posts, stories across 3–5 platforms. Claude + n8n + HeyGen + scheduler. 20–40 content pieces per month — brand stays active every day without filming.",
      ru: "AI-driven контент-система: скрипты, видео с AI-аватаром, посты, сторис на 3–5 платформах. Claude + n8n + HeyGen + планировщик. 20–40 материалов в месяц — бренд активен каждый день без съёмок.",
    },
    note: { en: "AI service subscriptions (HeyGen, Claude API) are paid by the client separately — approximately $80–250/mo.", ru: "Подписки на AI-сервисы (HeyGen, Claude API) оплачиваются клиентом отдельно — около $80–250/мес." },
  },
  {
    price: { en: "from 40,000 ₽/mo", ru: "от 40 000 ₽/мес" },
    name: { en: "Fractional PM", ru: "Fractional PM" },
    description: {
      en: "External product manager: Discovery, CustDev, CJM, backlog, roadmap, metrics. Works in your tool (Jira, Notion, Linear). Async via Telegram + calls on demand.",
      ru: "Внешний продакт-менеджер: Discovery, CustDev, CJM, бэклог, роадмап, метрики. Работает в вашем инструменте (Jira, Notion, Linear). Async в Telegram + созвоны по запросу.",
    },
  },
  {
    price: { en: "from 25,000 ₽", ru: "от 25 000 ₽" },
    name: { en: "Product Marketing", ru: "Продуктовый маркетинг" },
    description: {
      en: "Positioning, ICP, USP, funnel, content plan aligned with growth goals. AI competitor analysis included. Output: strategy + 30-day content plan + platform templates.",
      ru: "Позиционирование, ICP, USP, воронка, контент-план под цели роста. AI-анализ конкурентов включён. Результат: стратегия + 30-дневный контент-план + шаблоны по платформам.",
    },
  },
  {
    price: { en: "from 20,000 ₽", ru: "от 20 000 ₽" },
    name: { en: "Department / Process Audit", ru: "Аудит отдела / процессов" },
    description: {
      en: "Marketing, sales, onboarding, or customer service. Find bottlenecks and prioritize fixes. Output: process map + optimization plan with impact estimates.",
      ru: "Маркетинг, продажи, онбординг или клиентский сервис. Найти узкие места и приоритизировать улучшения. Результат: карта процессов + план оптимизации с оценкой влияния.",
    },
  },
];

function AutomationRow({ svc, i, lang }: { svc: (typeof automation)[number]; i: number; lang: "en" | "ru" }) {
  const { ref, className } = useReveal<HTMLDivElement>(i);
  const name = pick(svc.name, lang)!;
  const sub = pick(svc.sub, lang);
  const price = pick(svc.price, lang)!;
  const tag = pick(svc.tag, lang);
  const desc = pick(svc.description, lang)!;
  const demoLink = (svc as { demoLink?: string }).demoLink;
  const demoLabel = pick((svc as { demoLabel?: Localized }).demoLabel, lang);

  return (
    <div
      ref={ref}
      className={`grid gap-3 py-7 border-b border-rule-soft lg:grid-cols-[52px_1.4fr_2.4fr_140px] lg:gap-7 lg:items-baseline ${className}`}
    >
      <span className="tiny">C.0{i + 1}</span>
      <div>
        <h3 className="text-[20px] font-bold tracking-[-0.028em]">
          {name}
          {tag && <span className="tiny ml-2 align-middle">{tag}</span>}
        </h3>
        {sub && <div className="tiny mt-2">{sub}</div>}
      </div>
      <div>
        <p className="row-desc max-w-2xl">{desc}</p>
        {demoLink && (
          <a
            href={demoLink}
            target={demoLink.startsWith("http") ? "_blank" : undefined}
            rel={demoLink.startsWith("http") ? "noopener noreferrer" : undefined}
            className="tiny inline-block mt-3 hover:text-ink transition-colors"
          >
            {demoLabel} →
          </a>
        )}
      </div>
      <span className="tiny lg:text-right">{price}</span>
    </div>
  );
}

function ProductRow({ svc, i, lang }: { svc: (typeof product)[number]; i: number; lang: "en" | "ru" }) {
  const { ref, className } = useReveal<HTMLDivElement>(i);
  const name = pick(svc.name, lang)!;
  const price = pick(svc.price, lang)!;
  const desc = pick(svc.description, lang)!;
  const note = pick((svc as { note?: Localized }).note, lang);

  return (
    <div
      ref={ref}
      className={`grid gap-3 py-7 border-b border-rule-soft lg:grid-cols-[52px_1.4fr_2.4fr_140px] lg:gap-7 lg:items-baseline ${className}`}
    >
      <span className="tiny">D.0{i + 1}</span>
      <h3 className="text-[20px] font-bold tracking-[-0.028em]">{name}</h3>
      <div>
        <p className="row-desc max-w-2xl">{desc}</p>
        {note && <p className="tiny normal-case tracking-normal text-[12px] mt-2 italic">{note}</p>}
      </div>
      <span className="tiny lg:text-right">{price}</span>
    </div>
  );
}

export default function ServicesPage() {
  const { lang } = useLanguage();
  const s = t[lang].services;
  const ru = lang === "ru";

  return (
    <>
      <div className="wrap">
        <div className="tiny pt-11 pb-8">{s.label}</div>
        <div className="sh">
          <span className="tiny">01</span>
          <h1>
            {s.title.split(" ").slice(0, -1).join(" ")}{" "}
            <em className="serif">{s.title.split(" ").slice(-1)}</em>
          </h1>
          <span className="tiny">{automation.length + product.length}</span>
        </div>

        <div className="grid gap-6 pt-6 md:grid-cols-[1.25fr_1fr] md:gap-14">
          <p className="text-[clamp(15.5px,1.35vw,18px)] leading-[1.62] max-w-2xl">
            <Mark>{s.openNote}</Mark>
          </p>
          <p className="text-[14.5px] text-dim border-t border-ink pt-3.5">
            {s.contact}: <a href="mailto:jasurakhmadaliev283@gmail.com" className="underline hover:text-ink">jasurakhmadaliev283@gmail.com</a>
            <br />
            {s.contactTg}: <a href="https://t.me/biznesmind" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">@biznesmind</a>
          </p>
        </div>
      </div>

      {/* ===== AI и автоматизация ===== */}
      <Band word="AI" note={`02 — ${s.automationLabel}`} />

      <div className="wrap">
        <section className="sec">
          <div className="sh">
            <span className="tiny">02</span>
            <h2>{s.automationLabel}</h2>
            <span className="tiny">{automation.length}</span>
          </div>

          {automation.map((svc, i) => (
            <AutomationRow key={pick(svc.name, lang)} svc={svc} i={i} lang={lang} />
          ))}
        </section>
      </div>

      {/* ===== продукт и контент ===== */}
      <Band word={ru ? "ПРОДУКТ" : "PRODUCT"} note={`03 — ${s.productLabel}`} />

      <div className="wrap">
        <section className="sec">
          <div className="sh">
            <span className="tiny">03</span>
            <h2>{s.productLabel}</h2>
            <span className="tiny">{product.length}</span>
          </div>

          {product.map((svc, i) => (
            <ProductRow key={pick(svc.name, lang)} svc={svc} i={i} lang={lang} />
          ))}
        </section>
      </div>

      {/* ===== CTA ===== */}
      <div className="wrap">
        <section className="sec pb-24">
          <div className="sh">
            <span className="tiny">04</span>
            <h2>{s.cta}</h2>
            <span className="tiny">{ru ? "напишите" : "get in touch"}</span>
          </div>

          <p className="text-[clamp(15.5px,1.35vw,18px)] leading-[1.62] max-w-2xl pt-6">{s.ctaDesc}</p>

          <div className="flex flex-wrap gap-6 mt-7">
            <a href="https://t.me/biznesmind" target="_blank" rel="noopener noreferrer" className="tiny !text-[11px] px-5 py-3 bg-ink text-paper hover:opacity-80 transition-opacity">
              Telegram @biznesmind
            </a>
            <a href="mailto:jasurakhmadaliev283@gmail.com" className="tiny !text-[11px] px-5 py-3 border border-ink hover:bg-ink hover:text-paper transition-colors">
              {ru ? "Написать письмо" : "Send an email"}
            </a>
            <Link href="/" className="tiny hover:text-ink transition-colors self-center">
              ← {ru ? "На главную" : "Back to home"}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
