/* Услуги и цены для документа «Услуги» (PDF, см. [lang]/page.tsx).

   Источник: старая страница app/services/page.tsx (массивы automation и
   product) и подписи групп из lib/translations.ts (services.automationLabel,
   services.productLabel). Скопировано 1 октября 2026. Позиции, группы,
   порядок, названия, описания и цены те же.

   Что изменено против старого текста, и только это:
   - длинные тире заменены двоеточием или запятой;
   - стрелки заменены словами («База знаний → ассистент 24/7» стало
     «Из базы знаний в ассистента 24/7», цепочка «заявка → карточка → ...»
     стала фразой, как в английской версии того же описания);
   - короткие тире в диапазонах («1–2 часа») заменены дефисом, как на новом
     сайте («десять-двенадцать часов»);
   - подпись демо у RAG-ассистента: было «Попробовать живой демо — Mia,
     ассистент стоматологии», стало «Живое демо: Mia, ассистент
     стоматологии», в одном ряду с остальными подписями демо;
   - ссылки демо ведут на постоянные адреса /demos/... без /new: сейчас они
     открывают старый дизайн, после переезда макета на главную новый, и PDF
     пересобирать не придётся. У Mia старая ссылка вела прямо на Hugging
     Face, теперь на страницу демо, откуда живой ассистент открывается
     кнопкой.

   Не перенесено: метки «Enterprise», «Новое», «RAG» (у «Новое» нет даты, в
   документе, который живёт месяцами, она врёт) и вся вводная часть старой
   страницы, в том числе services.openNote про поиск работы и full-time.

   Файл без импортов и без кода, только данные. */

type L = { ru: string; en: string };

/* Слово на обложке: подпись раздела старой страницы (services.label в
   lib/translations.ts). Продублировано здесь, чтобы документ не зависел от
   файла старого сайта, который уйдёт после переезда макета. */
export const TITLE: L = { ru: "Услуги", en: "Services" };

export type Service = {
  name: L;
  sub?: L;
  price: L;
  desc: L;
  note?: L;
  demo?: { path: string; label: L };
};

export type Group = { title: L; items: Service[] };

export const GROUPS: Group[] = [
  {
    title: { ru: "AI и автоматизация", en: "AI & Automation" },
    items: [
      {
        price: { ru: "обсуждается индивидуально", en: "discussed individually" },
        name: { ru: "Корпоративный AI-стек", en: "Corporate AI Stack" },
        sub: { ru: "Claude · ChatGPT · Локальные модели", en: "Claude · ChatGPT · Local Models" },
        desc: {
          ru: "Полная AI-инфраструктура для компании: выбор модели под задачи и требования безопасности данных, API-интеграции, обучение сотрудников, внутренняя документация. Работает с облачными (Claude Enterprise, ChatGPT Team) и локальными моделями (Ollama). Результат: команда экономит 1-2 часа на человека в день.",
          en: "Full AI infrastructure for a company: model selection based on task requirements and data security, API integrations, employee training, internal documentation. Works with cloud solutions (Claude Enterprise, ChatGPT Team) and local models (Ollama). Result: the team saves 1-2 hours per person per day.",
        },
      },
      {
        price: { ru: "от 30 000 ₽", en: "from 30,000 ₽" },
        name: { ru: "AI-настройка для отдела", en: "AI Setup for a Department" },
        sub: { ru: "PM · Маркетинг · Поддержка", en: "PM · Marketing · Support" },
        desc: {
          ru: "Настройка AI для конкретной команды: аудит задач, выбор модели, настройка воркфлоу и промтов, обучение. 2-3 недели от старта до рабочего результата.",
          en: "Configure AI for a specific team: audit current tasks, select the right model, set up workflows and prompts, train the team. 2-3 weeks from kickoff to working result.",
        },
      },
      {
        price: { ru: "от 40 000 ₽", en: "from 40,000 ₽" },
        name: { ru: "RAG-ассистент на ваших данных", en: "RAG Assistant on Your Data" },
        sub: { ru: "Из базы знаний в ассистента 24/7", en: "From knowledge base to 24/7 assistant" },
        desc: {
          ru: "Превратите документы, базу знаний или каталог продуктов в ассистента, который отвечает только по вашим данным, без выдумок. Обрабатывает вопросы клиентов и сотрудников об услугах, ценах, политиках и процедурах.",
          en: "Turn your company's documents, knowledge base, or product catalog into an assistant that answers only from your data, with no made-up facts. Handles client and staff questions about services, pricing, policies, and procedures.",
        },
        demo: {
          path: "/demos/mia",
          label: { ru: "Живое демо: Mia, ассистент стоматологии", en: "Live demo: Mia, a dental clinic assistant" },
        },
      },
      {
        price: { ru: "от 35 000 ₽", en: "from 35,000 ₽" },
        name: { ru: "CRM + AI-автоматизация: полная настройка", en: "CRM + AI Automation: Full Setup" },
        sub: { ru: "amoCRM / Bitrix", en: "amoCRM / Bitrix" },
        desc: {
          ru: "Настройка CRM с AI-слоем: воронка продаж и стадии сделок, импорт базы, базовая автоматизация (3 сценария), AI-агент для входящих, интеграция с Telegram или WhatsApp.",
          en: "CRM setup with an AI layer: sales funnel and deal stages, database import, basic automation (3 scenarios), AI agent for incoming requests, integration with Telegram or WhatsApp.",
        },
        demo: {
          path: "/demos/leftovers",
          label: { ru: "Живое демо: ИИ сливает вечерние остатки", en: "Live demo: AI sells the evening leftovers" },
        },
      },
      {
        price: { ru: "от 25 000 ₽", en: "from 25,000 ₽" },
        name: { ru: "Внедрение AI-агента", en: "AI Agent Implementation" },
        desc: {
          ru: "Кастомный AI-агент под конкретную задачу: обработка запросов, квалификация лидов, внутренний ассистент, авто-ответы. Включает дискавери задачи и техническое задание.",
          en: "Custom AI agent for a specific task: handling inquiries, lead qualification, internal assistant, auto-replies. Includes task discovery and technical specification.",
        },
        demo: {
          path: "/demos/reviews",
          label: { ru: "Живое демо: ИИ-ответы на отзывы", en: "Live demo: AI replies to reviews" },
        },
      },
      {
        price: { ru: "от 15 000 ₽", en: "from 15,000 ₽" },
        name: { ru: "Автоматизация процессов", en: "Process Automation" },
        sub: { ru: "n8n", en: "n8n" },
        desc: {
          ru: "Связать CRM, мессенджеры, AI и таблицы. Заявка с формы становится карточкой в CRM, запускает уведомление в Telegram и AI-ответ клиенту. Схема, настройка, тест, инструкция.",
          en: "Connect your CRM, messengers, AI, and spreadsheets. A form submission becomes a CRM card, triggers a Telegram notification, and sends an AI reply to the client. Schema, setup, testing, instructions.",
        },
        demo: {
          path: "/demos/fraud",
          label: { ru: "Живое демо: алерты о фроде на кассе в Telegram", en: "Live demo: POS fraud alerts in Telegram" },
        },
      },
      {
        price: { ru: "от 8 000 ₽", en: "from 8,000 ₽" },
        name: { ru: "Аудит AI-инструментов", en: "AI Tools Audit" },
        desc: {
          ru: "Разбор текущего стека (ChatGPT, Notion AI, Copilot): найти где теряется время и деньги. Результат: 1-страничный план оптимизации с приоритетами. Сессия 1.5 часа + документ.",
          en: "Review your current stack (ChatGPT, Notion AI, Copilot): find where time and money are lost. Output: a 1-page optimization plan with priorities. 1.5-hour session + document.",
        },
      },
      {
        price: { ru: "от 3 500 ₽", en: "from 3,500 ₽" },
        name: { ru: "Консультация: разбор задачи", en: "Consultation: Task Review" },
        sub: { ru: "1 час", en: "1 hour" },
        desc: {
          ru: "CRM, автоматизация, AI-инструменты или процессы. Чёткий план действий и инструменты под вашу ситуацию. Zoom или звонок + письменное резюме.",
          en: "CRM, automation, AI tools, or processes. A clear action plan and tools matched to your situation. Zoom or call + written summary.",
        },
      },
    ],
  },
  {
    title: { ru: "Продукт и контент", en: "Product & Content" },
    items: [
      {
        price: { ru: "от 60 000 ₽/мес", en: "from 60,000 ₽/mo" },
        name: { ru: "Контент-фабрика / AI Brand Ambassador", en: "Content Factory / AI Brand Ambassador" },
        desc: {
          ru: "AI-driven контент-система: скрипты, видео с AI-аватаром, посты, сторис на 3-5 платформах. Claude + n8n + HeyGen + планировщик. 20-40 материалов в месяц: бренд активен каждый день без съёмок.",
          en: "AI-driven daily content system: scripts, AI avatar videos, posts, stories across 3-5 platforms. Claude + n8n + HeyGen + scheduler. 20-40 content pieces per month: the brand stays active every day without filming.",
        },
        note: {
          ru: "Подписки на AI-сервисы (HeyGen, Claude API) оплачиваются клиентом отдельно, около $80-250/мес.",
          en: "AI service subscriptions (HeyGen, Claude API) are paid by the client separately, approximately $80-250/mo.",
        },
      },
      {
        price: { ru: "от 40 000 ₽/мес", en: "from 40,000 ₽/mo" },
        name: { ru: "Fractional PM", en: "Fractional PM" },
        desc: {
          ru: "Внешний продакт-менеджер: Discovery, CustDev, CJM, бэклог, роадмап, метрики. Работает в вашем инструменте (Jira, Notion, Linear). Async в Telegram + созвоны по запросу.",
          en: "External product manager: Discovery, CustDev, CJM, backlog, roadmap, metrics. Works in your tool (Jira, Notion, Linear). Async via Telegram + calls on demand.",
        },
      },
      {
        price: { ru: "от 25 000 ₽", en: "from 25,000 ₽" },
        name: { ru: "Продуктовый маркетинг", en: "Product Marketing" },
        desc: {
          ru: "Позиционирование, ICP, USP, воронка, контент-план под цели роста. AI-анализ конкурентов включён. Результат: стратегия + 30-дневный контент-план + шаблоны по платформам.",
          en: "Positioning, ICP, USP, funnel, content plan aligned with growth goals. AI competitor analysis included. Output: strategy + 30-day content plan + platform templates.",
        },
      },
      {
        price: { ru: "от 20 000 ₽", en: "from 20,000 ₽" },
        name: { ru: "Аудит отдела / процессов", en: "Department / Process Audit" },
        desc: {
          ru: "Маркетинг, продажи, онбординг или клиентский сервис. Найти узкие места и приоритизировать улучшения. Результат: карта процессов + план оптимизации с оценкой влияния.",
          en: "Marketing, sales, onboarding, or customer service. Find bottlenecks and prioritize fixes. Output: process map + optimization plan with impact estimates.",
        },
      },
    ],
  },
];
