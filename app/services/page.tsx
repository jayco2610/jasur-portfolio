"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/translations";

const automation = [
  {
    price: { en: "discussed individually", ru: "обсуждается индивидуально" },
    name: { en: "Corporate AI Stack", ru: "Корпоративный AI-стек" },
    sub: { en: "Claude · ChatGPT · Local Models", ru: "Claude · ChatGPT · Локальные модели" },
    description: {
      en: "Full AI infrastructure for a company: model selection based on task requirements and data security, API integrations, employee training, internal documentation. Works with cloud solutions (Claude Enterprise, ChatGPT Team) and local models (Ollama). Result: the team saves 1–2 hours per person per day.",
      ru: "Полная AI-инфраструктура для компании: выбор модели под задачи и требования безопасности данных, API-интеграции, обучение сотрудников, внутренняя документация. Работает с облачными (Claude Enterprise, ChatGPT Team) и локальными моделями (Ollama). Результат: команда экономит 1–2 часа на человека в день.",
    },
    featured: true,
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
    featured: false,
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
    featured: true,
    tag: "RAG",
    demoLink: "https://huggingface.co/spaces/rag-jasur/mia-clinic-assistant",
    demoLabel: { en: "Try the live demo — Mia, a dental clinic assistant →", ru: "Попробовать живой демо — Mia, ассистент стоматологии →" },
  },
  {
    price: { en: "from 35,000 ₽", ru: "от 35 000 ₽" },
    name: { en: "CRM + AI Automation — Full Setup", ru: "CRM + AI-автоматизация — полная настройка" },
    sub: { en: "amoCRM / Bitrix", ru: "amoCRM / Bitrix" },
    description: {
      en: "CRM setup with an AI layer: sales funnel and deal stages, database import, basic automation (3 scenarios), AI agent for incoming requests, integration with Telegram or WhatsApp.",
      ru: "Настройка CRM с AI-слоем: воронка продаж и стадии сделок, импорт базы, базовая автоматизация (3 сценария), AI-агент для входящих, интеграция с Telegram или WhatsApp.",
    },
    featured: true,
  },
  {
    price: { en: "from 25,000 ₽", ru: "от 25 000 ₽" },
    name: { en: "AI Agent Implementation", ru: "Внедрение AI-агента" },
    sub: null,
    description: {
      en: "Custom AI agent for a specific task: handling inquiries, lead qualification, internal assistant, auto-replies. Includes task discovery and technical specification.",
      ru: "Кастомный AI-агент под конкретную задачу: обработка запросов, квалификация лидов, внутренний ассистент, авто-ответы. Включает дискавери задачи и техническое задание.",
    },
    featured: false,
  },
  {
    price: { en: "from 15,000 ₽", ru: "от 15 000 ₽" },
    name: { en: "Process Automation", ru: "Автоматизация процессов" },
    sub: { en: "n8n", ru: "n8n" },
    description: {
      en: "Connect your CRM, messengers, AI, and spreadsheets. A form submission becomes a CRM card, triggers a Telegram notification, and sends an AI reply to the client. Schema, setup, testing, instructions.",
      ru: "Связать CRM, мессенджеры, AI и таблицы. Заявка с формы → карточка в CRM → уведомление в Telegram → AI-ответ клиенту. Схема, настройка, тест, инструкция.",
    },
    featured: false,
  },
  {
    price: { en: "from 8,000 ₽", ru: "от 8 000 ₽" },
    name: { en: "AI Tools Audit", ru: "Аудит AI-инструментов" },
    sub: null,
    description: {
      en: "Review your current stack (ChatGPT, Notion AI, Copilot): find where time and money are lost. Output: a 1-page optimization plan with priorities. 1.5-hour session + document.",
      ru: "Разбор текущего стека (ChatGPT, Notion AI, Copilot): найти где теряется время и деньги. Результат: 1-страничный план оптимизации с приоритетами. Сессия 1.5 часа + документ.",
    },
    featured: false,
  },
  {
    price: { en: "from 3,500 ₽", ru: "от 3 500 ₽" },
    name: { en: "Consultation — Task Review", ru: "Консультация — разбор задачи" },
    sub: { en: "1 hour", ru: "1 час" },
    description: {
      en: "CRM, automation, AI tools, or processes. A clear action plan and tools matched to your situation. Zoom or call + written summary.",
      ru: "CRM, автоматизация, AI-инструменты или процессы. Чёткий план действий и инструменты под вашу ситуацию. Zoom или звонок + письменное резюме.",
    },
    featured: false,
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
    featured: true,
  },
  {
    price: { en: "from 40,000 ₽/mo", ru: "от 40 000 ₽/мес" },
    name: { en: "Fractional PM", ru: "Fractional PM" },
    description: {
      en: "External product manager: Discovery, CustDev, CJM, backlog, roadmap, metrics. Works in your tool (Jira, Notion, Linear). Async via Telegram + calls on demand.",
      ru: "Внешний продакт-менеджер: Discovery, CustDev, CJM, бэклог, роадмап, метрики. Работает в вашем инструменте (Jira, Notion, Linear). Async в Telegram + созвоны по запросу.",
    },
    note: null,
    featured: false,
  },
  {
    price: { en: "from 25,000 ₽", ru: "от 25 000 ₽" },
    name: { en: "Product Marketing", ru: "Продуктовый маркетинг" },
    description: {
      en: "Positioning, ICP, USP, funnel, content plan aligned with growth goals. AI competitor analysis included. Output: strategy + 30-day content plan + platform templates.",
      ru: "Позиционирование, ICP, USP, воронка, контент-план под цели роста. AI-анализ конкурентов включён. Результат: стратегия + 30-дневный контент-план + шаблоны по платформам.",
    },
    note: null,
    featured: false,
  },
  {
    price: { en: "from 20,000 ₽", ru: "от 20 000 ₽" },
    name: { en: "Department / Process Audit", ru: "Аудит отдела / процессов" },
    description: {
      en: "Marketing, sales, onboarding, or customer service. Find bottlenecks and prioritize fixes. Output: process map + optimization plan with impact estimates.",
      ru: "Маркетинг, продажи, онбординг или клиентский сервис. Найти узкие места и приоритизировать улучшения. Результат: карта процессов + план оптимизации с оценкой влияния.",
    },
    note: null,
    featured: false,
  },
];

export default function ServicesPage() {
  const { lang } = useLanguage();
  const s = t[lang].services;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <p className="font-mono text-xs text-white/30 tracking-[0.2em] uppercase mb-3">{s.label}</p>
      <h1 className="font-mono text-3xl font-bold text-white mb-4">{s.title}</h1>

      {/* Open to work note — answers the services vs job-search conflict */}
      <div className="mb-8 px-4 py-3 border border-[#7C3AED]/20 rounded-lg bg-[#7C3AED]/5">
        <p className="font-mono text-xs text-[#a78bfa]">{s.openNote}</p>
      </div>

      <p className="text-white/40 text-sm mb-14">
        {s.contact}:{" "}
        <a href="mailto:jasurakhmadaliev283@gmail.com" className="text-[#a78bfa] hover:text-white transition-colors">
          jasurakhmadaliev283@gmail.com
        </a>{" "}
        · {s.contactTg}:{" "}
        <a href="https://t.me/biznesmind" target="_blank" rel="noopener noreferrer" className="text-[#a78bfa] hover:text-white transition-colors">
          @biznesmind
        </a>
      </p>

      {/* AI & Automation */}
      <section className="mb-16">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-6">{s.automationLabel}</p>
        <div className="space-y-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(automation as any[]).map((svc) => (
            <div key={typeof svc.name === "object" ? svc.name.en : svc.name}
              className={`p-6 rounded-lg border transition-colors ${svc.featured ? "bg-[#111111] border-[#7C3AED]/30" : "bg-[#111111] border-[#1f1f1f] hover:border-[#7C3AED]/20"}`}>
              <div className="mb-3">
                <span className="font-mono text-lg font-bold text-[#a78bfa]">
                  {typeof svc.price === "object" ? svc.price[lang] : svc.price}
                </span>
                {svc.sub && (
                  <span className="font-mono text-xs text-white/30 ml-2">
                    · {typeof svc.sub === "object" ? (svc.sub as Record<string, string>)[lang] : svc.sub}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <p className="font-mono text-sm font-bold text-white">
                  {typeof svc.name === "object" ? svc.name[lang] : svc.name}
                </p>
                {svc.tag && (
                  <span className="font-mono text-[9px] text-[#a78bfa] border border-[#7C3AED]/40 rounded px-1.5 py-0.5 uppercase tracking-wider">
                    {typeof svc.tag === "object" ? (svc.tag as Record<string, string>)[lang] : svc.tag}
                  </span>
                )}
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                {typeof svc.description === "object" ? svc.description[lang] : svc.description}
              </p>
              {(svc as { demoLink?: string; demoLabel?: Record<string, string> }).demoLink && (
                <a href={(svc as { demoLink: string }).demoLink} target="_blank" rel="noopener noreferrer"
                  className="inline-block mt-3 font-mono text-xs text-[#a78bfa] hover:text-white transition-colors">
                  {((svc as { demoLabel?: Record<string, string> }).demoLabel ?? {})[lang]}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Product & Content */}
      <section className="mb-16">
        <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mb-6">{s.productLabel}</p>
        <div className="space-y-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(product as any[]).map((svc) => (
            <div key={typeof svc.name === "object" ? svc.name.en : svc.name}
              className={`p-6 rounded-lg border transition-colors ${svc.featured ? "bg-[#111111] border-[#7C3AED]/30" : "bg-[#111111] border-[#1f1f1f] hover:border-[#7C3AED]/20"}`}>
              <div className="mb-3">
                <span className="font-mono text-lg font-bold text-[#a78bfa]">
                  {typeof svc.price === "object" ? svc.price[lang] : svc.price}
                </span>
              </div>
              <p className="font-mono text-sm font-bold text-white mb-2">
                {typeof svc.name === "object" ? svc.name[lang] : svc.name}
              </p>
              <p className="text-white/50 text-sm leading-relaxed">
                {typeof svc.description === "object" ? svc.description[lang] : svc.description}
              </p>
              {svc.note && (
                <p className="font-mono text-[10px] text-white/25 mt-3 italic">
                  {typeof svc.note === "object" ? (svc.note as Record<string, string>)[lang] : svc.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="p-6 bg-[#111111] border border-[#7C3AED]/20 rounded-lg">
        <p className="font-mono text-sm font-bold text-white mb-1">{s.cta}</p>
        <p className="text-white/40 text-sm mb-4">{s.ctaDesc}</p>
        <div className="flex gap-4 flex-wrap">
          <a href="https://t.me/biznesmind" target="_blank" rel="noopener noreferrer"
            className="font-mono text-sm px-5 py-2.5 bg-[#7C3AED] text-white rounded hover:bg-[#6d28d9] transition-colors">
            Telegram @biznesmind
          </a>
          <a href="mailto:jasurakhmadaliev283@gmail.com"
            className="font-mono text-sm px-5 py-2.5 border border-white/15 text-white/70 rounded hover:border-white/30 hover:text-white transition-colors">
            {lang === "en" ? "Send an email" : "Написать письмо"}
          </a>
          <Link href="/"
            className="font-mono text-sm px-5 py-2.5 border border-white/10 text-white/40 rounded hover:border-white/25 hover:text-white/70 transition-colors">
            ← {lang === "en" ? "Back to home" : "На главную"}
          </Link>
        </div>
      </div>
    </div>
  );
}
