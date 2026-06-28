export const t = {
  en: {
    nav: {
      home: "Home",
      projects: "Projects",
      services: "Services",
      writing: "Writing",
      resume: "Resume",
    },
    footer: "© 2025 Jasur Akhmadaliev",

    hero: {
      title: "Welcome.",
      bio: "Product Manager who moves from messy problems to shipped products.\nI lead discovery, define what to cut, and drive delivery — then measure what changed for real users.\nBuilding AI systems for my own job search and publishing every step.\nAny questions? Ask JasurGPT — the button in the corner knows everything about me.",
      viewProjects: "View projects",
      resume: "Resume",
      scroll: "Scroll",
    },

    home: {
      selectedWork: "Selected work",
      byNumbers: "By the numbers",
      statsDesc:
        "I wrote about building an AI clone to run my own job search. The post went viral on VK — 30K engagements — and pushed my blog to Top-3 on VC.ru.",
      stats: [
        { value: "#3", label: "VC.ru blog ranking", sub: "June 2026" },
        { value: "30K", label: "engagements", sub: "single post, VK" },
        { value: "21K", label: "views on Habr", sub: "per article" },
        { value: "8+", label: "platforms", sub: "one content system" },
      ],
      about: "About",
      aboutP1:
        "I'm a Product Manager and marketing analyst from Tashkent, Uzbekistan. I've shipped products at Instameal (food delivery), IDF Lab (B2B SaaS), and Synergia. Currently building AI tooling for my own job search — and publishing the process publicly.",
      aboutP2:
        "Looking for a remote PM or product marketing role with an international team. The AI career system you see above is both my portfolio and my actual workflow.",
      gptHint: "Have questions about my experience or projects?",
      gptCta: "Ask JasurGPT — button in the bottom right corner.",
      allProjects: "All projects →",
      projects: [
        {
          name: "AI Career System",
          status: "live",
          desc: "End-to-end job search automation. Claude + n8n + Google Sheets + Telegram. Vacancy in → cover letter out in 55 seconds.",
          tags: ["Claude", "n8n", "Telegram"],
          link: null,
        },
        {
          name: "Expat Roadmap SEA",
          status: "shipped",
          desc: "Full-stack relocation platform for Southeast Asia. 5 product areas built solo: visa map, housing, jobs, events, community.",
          tags: ["Next.js", "Supabase", "Vercel"],
          link: "https://expat-roadmap-sea.vercel.app",
        },
        {
          name: "Mia — Clinic RAG Assistant",
          status: "live",
          desc: "Retrieval-augmented assistant for a dental clinic. Answers patient questions from clinic documents only — 0% hallucination rate. Live on Hugging Face.",
          tags: ["Python", "RAG", "LangChain"],
          link: "https://huggingface.co/spaces/rag-jasur/mia-clinic-assistant",
        },
        {
          name: "Portfolio + JasurGPT",
          status: "live",
          desc: "This site. AI chat trained on 3,000+ words of personal context — resume, projects, experience. Ask using the button below.",
          tags: ["Next.js", "OpenRouter", "Vercel"],
          link: null,
        },
      ],
    },

    projects: {
      label: "Projects",
      title: "Things I built.",
      subtitle: "Real use cases, real results.",
      openSource: "Open Source",
      openSourceDesc: "AI systems, tools, and products I built — all public on GitHub.",
      allRepos: "All repos on GitHub →",
      projects: [
        {
          name: "Portfolio + JasurGPT",
          status: "live",
          stack: ["Next.js", "OpenRouter", "Vercel", "TypeScript"],
          description:
            "Personal site with JasurGPT — an AI assistant trained on 3,000+ words of personal context: resume, projects, experience. Runs on OpenRouter with a 4-model fallback chain.",
          metrics: [
            "$0/month infrastructure",
            "4-model fallback — always on",
            "Context: 3,000+ words of personal data",
          ],
          link: "https://jasur.dev",
          github: "https://github.com/jayco2610/jasur-portfolio",
        },
        {
          name: "Mia — Dental Clinic RAG Assistant",
          status: "live",
          stack: ["Python", "RAG", "Groq", "Gradio", "Hugging Face"],
          description:
            "Retrieval-augmented assistant for a dental clinic. Answers patient questions about services, pricing, hours, and procedures from the clinic's own documents — grounded answers only, 0% hallucination rate. Deployed live on Hugging Face Spaces.",
          metrics: [
            "Hallucination rate: 0% (strict retrieval-only mode)",
            "4 query categories: pricing, services, hours, procedures",
            "Live demo on Hugging Face Spaces",
          ],
          link: "https://huggingface.co/spaces/rag-jasur/mia-clinic-assistant",
          github: "https://github.com/jayco2610/rag-starter",
        },
        {
          name: "Expat Roadmap SEA",
          status: "shipped",
          stack: ["Next.js", "Supabase", "Vercel", "TypeScript"],
          description:
            "Full-stack relocation platform for Southeast Asia. 5 product areas built and shipped solo: interactive visa/city map, housing board, community, events, and jobs. Zero infrastructure cost.",
          metrics: [
            "5 product areas shipped solo",
            "Time-to-production: 4 weeks from zero",
            "Infrastructure cost: $0/month (Vercel + Supabase free tier)",
          ],
          link: "https://expat-roadmap-sea.vercel.app",
          github: "https://github.com/jayco2610/expat-roadmap-sea",
        },
        {
          name: "AI Career System",
          status: "live",
          stack: ["Claude", "n8n", "Google Sheets", "Telegram"],
          description:
            "End-to-end job search automation. Receives a vacancy link in Telegram, parses and analyzes the JD, compares against resume, generates a tailored cover letter, logs to Google Sheets — zero manual touchpoints.",
          metrics: [
            "Pipeline automation rate: 100% (zero manual steps)",
            "Time-to-output: 55s avg (vs. 45 min manual)",
            "Manual touchpoints eliminated: 7",
          ],
          link: null,
          github: "https://github.com/jayco2610/claude-outreach-system",
        },
        {
          name: "Personal Brandbook",
          status: "shipped",
          stack: ["Canva", "PDF", "GitHub Pages"],
          description:
            "10-page brand portfolio covering positioning, experience with real metrics, services with pricing, and project case studies including Expat Roadmap SEA and Portfolio + JasurGPT.",
          metrics: ["10 pages", "Services with pricing", "Expat Roadmap case study"],
          link: "/brandbook.pdf",
          github: "https://github.com/jayco2610/jasur-brandbook",
        },
      ],
      repos: [
        {
          name: "rag-starter",
          description:
            "Minimal RAG engine — feed it documents, ask questions, get grounded answers. Runs fully offline with Ollama. Powers the Mia clinic assistant.",
          url: "https://github.com/jayco2610/rag-starter",
        },
        {
          name: "claude-outreach-system",
          description:
            "AI Career System: vacancy link in Telegram → JD parsed → resume matched → cover letter generated → logged to Google Sheets. Built inside Claude Code.",
          url: "https://github.com/jayco2610/claude-outreach-system",
        },
        {
          name: "claude-skills",
          description:
            "21 custom Claude Code skills for content creation, PM workflows, and AI automation.",
          url: "https://github.com/jayco2610/claude-skills",
        },
        {
          name: "expat-roadmap-sea",
          description:
            "Full-stack relocation platform for Southeast Asia: visa and city map, housing board, community, events. Next.js + Supabase, shipped solo.",
          url: "https://github.com/jayco2610/expat-roadmap-sea",
        },
        {
          name: "jasur-portfolio",
          description:
            "This site, with JasurGPT — an AI assistant trained on full professional context. Next.js + OpenRouter, $0/month infrastructure.",
          url: "https://github.com/jayco2610/jasur-portfolio",
        },
        {
          name: "jasur-brandbook",
          description:
            "Personal brandbook as an HTML-to-PDF pipeline: positioning, services, and project case studies.",
          url: "https://github.com/jayco2610/jasur-brandbook",
        },
      ],
    },

    resume: {
      label: "Resume",
      name: "Jasur Akhmadaliev",
      title: "AI Product Manager · AI Implementation & Deployment · Claude · n8n · RAG · Voiceflow",
      pdfEn: "PDF — EN",
      pdfRu: "PDF — RU",
      education: "Education",
      hse: "HSE University (Higher School of Economics)",
      hseLocation: "Moscow · 2023–2025",
      hseDegree: "Bachelor of Business and Economics, International Program · Graduated 2025",
      certifications: "Certifications",
      experience: "Experience",
      projects: "Projects",
      content: "Content & Publications",
      skills: "Skills",
      about: "About",
      certPreview: "Certificate Preview",
      aboutText:
        "Product Manager who ships digital products hands-on, from customer discovery to live users. Built and deployed Expat Roadmap SEA (Next.js + Supabase) and Portfolio + JasurGPT solo. Configured Claude + Telegram + Whisper pipeline independently, built AI Career System for automated job search, developing an AI agent for business analytics. Use n8n, Voiceflow, and NotebookLM in real projects. Publishing about the process publicly at @pmvision_ai.",
      contentBullets: [
        "Publishing publicly about AI experiments, product thinking, and job search process",
        "Dzen: 67% read-through rate; Threads: ~15,000 views per thread",
        "Active on: Telegram, Dzen, Threads, LinkedIn, VC.ru, Habr, Medium, X",
      ],
      experience_data: [
        {
          role: "Independent AI Builder",
          company: "Personal AI Projects",
          period: "May 2026 – Present",
          bullets: [
            "Built expat networking platform solo using AI-assisted development (Cursor + Claude)",
            "Built Portfolio + JasurGPT — personal site with AI chat trained on resume and projects",
            "Built AI Career System — end-to-end job search automation (Claude + n8n + Google Sheets + Telegram); vacancy in → cover letter out in 55 seconds; pipeline automation rate: 100%",
            "Configured Claude + Telegram + Whisper voice pipeline end-to-end, independently",
            "Developing AI agent for ABC/XYZ inventory analysis using n8n (in progress)",
            "Built conversational automation bots in Voiceflow for real business use cases",
          ],
          skills: "Claude API, Cursor, Telegram Bot API, Whisper, n8n, Voiceflow, Prompt Engineering, Facebook API",
        },
        {
          role: "AI Analyst (Freelance)",
          company: "Consulting Project — Food Court Molot",
          period: "Jan 2026 – May 2026",
          bullets: [
            "Audited operational and procurement data using Claude + Google Sheets",
            "Built automated reporting system to track cost categories across departments",
            "Result: –18% reduction in procurement costs (estimated)",
          ],
          skills: "Claude, Google Sheets, Data Analysis, Workflow Automation",
        },
        {
          role: "Product Manager / Co-founder",
          company: "Yonma Yon — Local Startup",
          period: "Nov 2024 – 2025",
          bullets: [
            "Ran customer discovery: 10+ user interviews, analyzed insights via NotebookLM and ChatGPT",
            "Defined product hypotheses across monetization models, UX flows, and user scenarios",
            "Designed and launched MVP: landing page + Telegram bot; tracked activation funnel from Day 1",
            "Configured AI agents to automate incoming request processing via Voiceflow + n8n",
            "Opened B2B direction: analytics-as-a-service; D30 retention measured across cohorts",
            "Result: 150+ users acquired, first B2B pipeline inquiries received",
          ],
          skills: "CustDev, CJM, MVP, Voiceflow, n8n, NotebookLM, ChatGPT, Telegram Bot API",
        },
        {
          role: "Data Analyst",
          company: "IDF Lab — Analytics Project (HSE)",
          period: "Jun 2023 – Nov 2024",
          bullets: [
            "Performed RFM segmentation of client database for an external business client",
            "Delivered retention recommendations based on customer segment behavior",
            "Result: estimated +15% increase in repeat-purchase retention rate",
          ],
          skills: "RFM Analysis, Google Sheets, Data Analytics, AI-assisted Research",
        },
        {
          role: "Client Relations Coordinator",
          company: "Synergia University",
          period: "Aug 2023 – Apr 2025",
          bullets: [
            "Managed portfolio of 40+ clients: onboarding, support, and contract oversight",
            "Gathered client requirements and translated them into technical specs for the delivery team",
            "Monitored timelines and quality across concurrent accounts",
            "Used Claude and ChatGPT to accelerate document preparation and data structuring",
            "Result: 3 projects on time, NPS 62→78 (+26 pts), response time –30%",
            "Presented process improvements at internal team meetup",
          ],
          skills: "Client Management, Requirements Gathering, Excel, Google Sheets, Claude, ChatGPT, Documentation",
        },
        {
          role: "Product Manager / Co-founder",
          company: "Instameal — FoodTech Startup",
          period: "Mar 2024 – Jul 2024",
          bullets: [
            "Launched product from zero: customer discovery, CJM, MVP development, first paying users",
            "Built MVP using AI-assisted development: Telegram bot + website; designed UI flows in Figma",
            "Set up conversion funnel and product metrics dashboard; measured D7 activation rate: ~40%",
            "Coordinated cross-functional team of 8 across logistics, development, and marketing",
            "Result: ~400 users, ~40% activation rate (signup → first order)",
          ],
          skills: "CustDev, CJM, Figma, Telegram Bot API, Product Metrics, Scrum, AI Research",
        },
      ],
      projects_data: [
        {
          name: "Expat Networking Platform",
          period: "May 2026 – Present",
          link: "https://expat-roadmap-sea.vercel.app",
          bullets: [
            "Built full-stack platform solo: interactive visa/city map, community, housing board, events, jobs",
            "Deployed Telegram bot as the primary user engagement channel",
          ],
          skills: "Next.js, Supabase, Cursor, Claude API, Telegram, AI-assisted development",
        },
        {
          name: "Portfolio + JasurGPT",
          period: "2026",
          link: "https://jasur.dev",
          bullets: [
            "Personal site with AI chat (JasurGPT) trained on full context: resume, projects, experience",
            "Showcases: AI Career System, Expat Roadmap SEA, RAG Starter",
          ],
          skills: "Next.js, OpenRouter, Vercel, TypeScript, Tailwind CSS",
        },
        {
          name: "AI Career System",
          period: "2026 · Live",
          link: null,
          bullets: [
            "End-to-end job search automation: vacancy parsing, ATS resume adaptation, auto cover letter generation",
            "Claude + n8n + Google Sheets + Telegram; pipeline automation rate: 100%; time-to-output: 55s",
          ],
          skills: "Claude API, n8n, Google Sheets, Telegram Bot API, Prompt Engineering",
        },
        {
          name: "Claude + Telegram + Whisper Voice Pipeline",
          period: "2026",
          link: null,
          bullets: [
            "Configured end-to-end pipeline: Whisper transcribes audio → Claude processes → Telegram delivers",
            "Set up independently, without templates or tutorials",
          ],
          skills: "Whisper API, Claude API, Telegram Bot API",
        },
      ],
      skills_data: {
        Product: ["Product Discovery", "CustDev", "CJM", "User Stories", "Backlog Prioritization", "Hypothesis Formation", "A/B Testing", "MVP", "Scrum", "SAFe (basic)", "NPS", "LTV / CAC", "Funnel Analytics", "D7/D30 Retention", "Activation Rate"],
        Development: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Prisma", "Vercel", "Git / GitHub", "REST API"],
        "AI & Automation": ["Claude API", "OpenRouter API", "ChatGPT", "Prompt Engineering", "NotebookLM", "n8n", "Voiceflow", "Cursor", "AI Agents", "Whisper API"],
        Tools: ["Google Sheets", "Figma", "Canva", "Telegram Bot API", "Facebook API"],
        Languages: ["English (professional)", "Russian (Native)", "Turkish (B2)", "Uzbek (Native)"],
      },
    },

    services: {
      label: "Services",
      title: "What I can help with.",
      openNote: "Open to full-time PM and AI PM roles. The services below reflect my hands-on AI consulting practice — available as an independent track or to bridge until the right role.",
      contact: "Contact",
      contactTg: "Telegram",
      cta: "Let's talk",
      ctaDesc: "CRM, automation, AI tools, or processes. Write — we'll figure out the right format together.",
      automationLabel: "AI & Automation",
      productLabel: "Product & Content",
    },

    writing: {
      label: "Writing",
      title: "Articles & Content",
      subtitle: "Cases, technical breakdowns, and product thinking.",
      statsDesc:
        "I wrote about building an AI clone to run my own job search. The post went viral on VK — 30K engagements — and pushed my blog to Top-3 on VC.ru.",
      stats: [
        { value: "#3", label: "VC.ru blog ranking", sub: "June 2026" },
        { value: "30K", label: "engagements", sub: "single post, VK" },
        { value: "21K", label: "views on Habr", sub: "per article" },
      ],
      publishedLabel: "Published",
      channelsLabel: "Channels",
    },
  },

  ru: {
    nav: {
      home: "Главная",
      projects: "Проекты",
      services: "Услуги",
      writing: "Статьи",
      resume: "Резюме",
    },
    footer: "© 2025 Жасур Ахмадалиев",

    hero: {
      title: "Привет.",
      bio: "Продакт-менеджер: от размытых проблем до запущенного продукта.\nПровожу дискавери, определяю что резать, координирую доставку — и измеряю что реально изменилось для пользователей.\nСтрою AI-систему для своего поиска работы и публикую каждый шаг открыто.\nЕсть вопросы? Спросите JasurGPT — кнопка в углу знает всё обо мне.",
      viewProjects: "Посмотреть проекты",
      resume: "Резюме",
      scroll: "Листать",
    },

    home: {
      selectedWork: "Избранные проекты",
      byNumbers: "В цифрах",
      statsDesc:
        "Написал о том, как создал AI-клона для своего поиска работы. Пост завирусился во ВКонтакте — 30K взаимодействий — и вывел блог в Топ-3 VC.ru.",
      stats: [
        { value: "№3", label: "рейтинг блогов VC.ru", sub: "Июнь 2026" },
        { value: "30K", label: "взаимодействий", sub: "один пост, ВКонтакте" },
        { value: "21K", label: "просмотров на Хабре", sub: "на статью" },
        { value: "8+", label: "площадок", sub: "одна контент-система" },
      ],
      about: "О себе",
      aboutP1:
        "Продакт-менеджер и маркетинг-аналитик из Ташкента. Запускал продукты в Instameal (фудтех), IDF Lab (B2B SaaS) и Synergia. Сейчас строю AI-инструменты для собственного поиска работы — и публикую процесс открыто.",
      aboutP2:
        "Ищу удалённую PM или product marketing роль в международной команде. AI Career System выше — это одновременно моё портфолио и реальный рабочий инструмент.",
      gptHint: "Есть вопросы об опыте или проектах?",
      gptCta: "Спросите JasurGPT — кнопка в правом нижнем углу.",
      allProjects: "Все проекты →",
      projects: [
        {
          name: "AI Career System",
          status: "в работе",
          desc: "Автоматизация поиска работы от начала до конца. Claude + n8n + Google Sheets + Telegram. Вакансия на входе → сопроводительное письмо за 55 секунд.",
          tags: ["Claude", "n8n", "Telegram"],
          link: null,
        },
        {
          name: "Expat Roadmap SEA",
          status: "запущен",
          desc: "Full-stack платформа для переезда в Юго-Восточную Азию. 5 продуктовых направлений, построенных соло: карта виз, жильё, работа, события, комьюнити.",
          tags: ["Next.js", "Supabase", "Vercel"],
          link: "https://expat-roadmap-sea.vercel.app",
        },
        {
          name: "Mia — RAG-ассистент для клиники",
          status: "в работе",
          desc: "Ретривал-ассистент для стоматологической клиники. Отвечает на вопросы пациентов только по документам клиники — 0% галлюцинаций. Живой демо на Hugging Face.",
          tags: ["Python", "RAG", "LangChain"],
          link: "https://huggingface.co/spaces/rag-jasur/mia-clinic-assistant",
        },
        {
          name: "Портфолио + JasurGPT",
          status: "в работе",
          desc: "Этот сайт. AI-чат обучен на 3 000+ словах личного контекста — резюме, проекты, опыт. Спросите через кнопку ниже.",
          tags: ["Next.js", "OpenRouter", "Vercel"],
          link: null,
        },
      ],
    },

    projects: {
      label: "Проекты",
      title: "Что я построил.",
      subtitle: "Реальные задачи, реальные результаты.",
      openSource: "Open Source",
      openSourceDesc: "AI-системы, инструменты и продукты — всё открыто на GitHub.",
      allRepos: "Все репозитории на GitHub →",
      projects: [
        {
          name: "Портфолио + JasurGPT",
          status: "в работе",
          stack: ["Next.js", "OpenRouter", "Vercel", "TypeScript"],
          description:
            "Личный сайт с JasurGPT — AI-ассистентом, обученным на 3 000+ словах личного контекста: резюме, проекты, опыт. Работает на OpenRouter с цепочкой из 4 моделей-фолбэков.",
          metrics: [
            "Инфраструктура: $0 в месяц",
            "4 модели в цепочке фолбэков — всегда онлайн",
            "Контекст: 3 000+ слов персональных данных",
          ],
          link: "https://jasur.dev",
          github: "https://github.com/jayco2610/jasur-portfolio",
        },
        {
          name: "Mia — RAG-ассистент для стоматологии",
          status: "в работе",
          stack: ["Python", "RAG", "Groq", "Gradio", "Hugging Face"],
          description:
            "Ретривал-ассистент для стоматологической клиники. Отвечает на вопросы пациентов об услугах, ценах, часах работы и процедурах только по документам клиники — 0% галлюцинаций.",
          metrics: [
            "Уровень галлюцинаций: 0% (только ретривал, без выдумок)",
            "4 категории запросов: цены, услуги, часы, процедуры",
            "Живой демо на Hugging Face Spaces",
          ],
          link: "https://huggingface.co/spaces/rag-jasur/mia-clinic-assistant",
          github: "https://github.com/jayco2610/rag-starter",
        },
        {
          name: "Expat Roadmap SEA",
          status: "запущен",
          stack: ["Next.js", "Supabase", "Vercel", "TypeScript"],
          description:
            "Full-stack платформа для переезда в Юго-Восточную Азию. 5 продуктовых направлений построено и запущено соло: карта виз/городов, жильё, комьюнити, события, работа.",
          metrics: [
            "5 продуктовых направлений — один разработчик",
            "Время до продакшена: 4 недели с нуля",
            "Стоимость инфраструктуры: $0 в месяц",
          ],
          link: "https://expat-roadmap-sea.vercel.app",
          github: "https://github.com/jayco2610/expat-roadmap-sea",
        },
        {
          name: "AI Career System",
          status: "в работе",
          stack: ["Claude", "n8n", "Google Sheets", "Telegram"],
          description:
            "Автоматизация поиска работы от начала до конца. Получает ссылку на вакансию в Telegram, парсит и анализирует описание, сравнивает с резюме, генерирует письмо, логирует в Google Sheets — без ручных шагов.",
          metrics: [
            "Уровень автоматизации пайплайна: 100% (ноль ручных шагов)",
            "Время до результата: 55 сек. в среднем (против 45 мин. вручную)",
            "Устранено ручных действий: 7",
          ],
          link: null,
          github: "https://github.com/jayco2610/claude-outreach-system",
        },
        {
          name: "Personal Brandbook",
          status: "запущен",
          stack: ["Canva", "PDF", "GitHub Pages"],
          description:
            "10-страничное брендовое портфолио: позиционирование, опыт с реальными метриками, услуги с ценами, кейсы проектов Expat Roadmap SEA и Portfolio + JasurGPT.",
          metrics: ["10 страниц", "Услуги с ценами", "Кейс Expat Roadmap"],
          link: "/brandbook.pdf",
          github: "https://github.com/jayco2610/jasur-brandbook",
        },
      ],
      repos: [
        {
          name: "rag-starter",
          description: "Минимальный RAG-движок — подаёте документы, задаёте вопросы, получаете обоснованные ответы. Работает офлайн через Ollama. Основа ассистента Mia.",
          url: "https://github.com/jayco2610/rag-starter",
        },
        {
          name: "claude-outreach-system",
          description: "AI Career System: ссылка на вакансию в Telegram → парсинг JD → сравнение с резюме → генерация письма → лог в Google Sheets. Построено в Claude Code.",
          url: "https://github.com/jayco2610/claude-outreach-system",
        },
        {
          name: "claude-skills",
          description: "21 кастомный навык для Claude Code: создание контента, PM-процессы и AI-автоматизация.",
          url: "https://github.com/jayco2610/claude-skills",
        },
        {
          name: "expat-roadmap-sea",
          description: "Full-stack платформа для переезда в ЮВА: карта виз и городов, доска жилья, комьюнити, события. Next.js + Supabase, запущено соло.",
          url: "https://github.com/jayco2610/expat-roadmap-sea",
        },
        {
          name: "jasur-portfolio",
          description: "Этот сайт с JasurGPT — AI-ассистентом на полном профессиональном контексте. Next.js + OpenRouter, $0 в месяц.",
          url: "https://github.com/jayco2610/jasur-portfolio",
        },
        {
          name: "jasur-brandbook",
          description: "Personal brandbook как HTML-в-PDF пайплайн: позиционирование, услуги и кейсы проектов.",
          url: "https://github.com/jayco2610/jasur-brandbook",
        },
      ],
    },

    resume: {
      label: "Резюме",
      name: "Жасур Ахмадалиев",
      title: "AI Продакт-менеджер · Внедрение и деплой AI · Claude · n8n · RAG · Voiceflow",
      pdfEn: "PDF — EN",
      pdfRu: "PDF — RU",
      education: "Образование",
      hse: "НИУ ВШЭ (Высшая школа экономики)",
      hseLocation: "Москва · 2023–2025",
      hseDegree: "Бакалавр бизнеса и экономики, Международная программа · Окончил 2025",
      certifications: "Сертификаты",
      experience: "Опыт работы",
      projects: "Проекты",
      content: "Контент и публикации",
      skills: "Навыки",
      about: "О себе",
      certPreview: "Предпросмотр сертификата",
      aboutText:
        "Продакт-менеджер, который запускает цифровые продукты руками — от Customer Discovery до живых пользователей. Построил и задеплоил Expat Roadmap SEA (Next.js + Supabase) и Portfolio + JasurGPT соло. Настроил пайплайн Claude + Telegram + Whisper самостоятельно, построил AI Career System для автоматизации поиска работы, разрабатываю AI-агента для бизнес-аналитики. Использую n8n, Voiceflow и NotebookLM в реальных проектах. Публикую о процессе открыто в @pmvision_ai.",
      contentBullets: [
        "Пишу публично об AI-экспериментах, продуктовом мышлении и поиске работы",
        "Дзен: 67% дочитываемость; Threads: ~15 000 просмотров на тред",
        "Активен на: Telegram, Дзен, Threads, LinkedIn, VC.ru, Хабр, Medium, X",
      ],
      experience_data: [
        {
          role: "Независимый AI-разработчик",
          company: "Личные AI-проекты",
          period: "Май 2026 — наст. время",
          bullets: [
            "Построил платформу для экспатов соло с помощью AI-assisted разработки (Cursor + Claude)",
            "Создал Portfolio + JasurGPT — личный сайт с AI-чатом, обученным на резюме и проектах",
            "Построил AI Career System — автоматизация поиска работы (Claude + n8n + Google Sheets + Telegram); от вакансии до письма за 55 секунд; уровень автоматизации: 100%",
            "Настроил голосовой пайплайн Claude + Telegram + Whisper с нуля",
            "Разрабатываю AI-агента для ABC/XYZ-анализа запасов на n8n (в процессе)",
            "Создал conversational-боты в Voiceflow для реальных бизнес-задач",
          ],
          skills: "Claude API, Cursor, Telegram Bot API, Whisper, n8n, Voiceflow, Prompt Engineering, Facebook API",
        },
        {
          role: "AI-аналитик (фриланс)",
          company: "Консалтинговый проект — Фудкорт Молот",
          period: "Янв 2026 — Май 2026",
          bullets: [
            "Аудит операционных и закупочных данных с Claude + Google Sheets",
            "Построил автоматизированную систему отчётности по категориям затрат",
            "Результат: снижение затрат на закупки на 18% (оценочно)",
          ],
          skills: "Claude, Google Sheets, Data Analysis, Workflow Automation",
        },
        {
          role: "Продакт-менеджер / Сооснователь",
          company: "Yonma Yon — локальный стартап",
          period: "Нояб 2024 — 2025",
          bullets: [
            "Customer Discovery: 10+ пользовательских интервью, анализ через NotebookLM и ChatGPT",
            "Сформулировал продуктовые гипотезы по монетизации, UX и сценариям использования",
            "Запустил MVP: лендинг + Telegram-бот; с Day 1 отслеживал активационную воронку",
            "Настроил AI-агентов для обработки входящих запросов (Voiceflow + n8n)",
            "Открыл B2B-направление: analytics-as-a-service; измерял D30-удержание по когортам",
            "Результат: 150+ пользователей, первые B2B-запросы в пайплайне",
          ],
          skills: "CustDev, CJM, MVP, Voiceflow, n8n, NotebookLM, ChatGPT, Telegram Bot API",
        },
        {
          role: "Аналитик данных",
          company: "IDF Lab — Аналитический проект (ВШЭ)",
          period: "Июнь 2023 — Нояб 2024",
          bullets: [
            "RFM-сегментация клиентской базы для внешнего заказчика",
            "Рекомендации по удержанию на основе поведения клиентских сегментов",
            "Результат: оценочный прирост повторных покупок на 15%",
          ],
          skills: "RFM-анализ, Google Sheets, Data Analytics, AI-assisted Research",
        },
        {
          role: "Координатор по работе с клиентами",
          company: "Synergia University",
          period: "Авг 2023 — Апр 2025",
          bullets: [
            "Управлял портфелем 40+ клиентов: онбординг, поддержка, контроль договоров",
            "Собирал требования заказчиков и переводил в техзадания для команды доставки",
            "Контролировал сроки и качество по нескольким аккаунтам одновременно",
            "Использовал Claude и ChatGPT для ускорения подготовки документов",
            "Результат: 3 проекта в срок, NPS 62→78 (+26 пп), время ответа –30%",
            "Презентовал улучшения процессов на внутреннем командном митапе",
          ],
          skills: "Client Management, Requirements Gathering, Excel, Google Sheets, Claude, ChatGPT, Documentation",
        },
        {
          role: "Продакт-менеджер / Сооснователь",
          company: "Instameal — FoodTech стартап",
          period: "Март 2024 — Июль 2024",
          bullets: [
            "Запустил продукт с нуля: CustDev, CJM, разработка MVP, первые платящие пользователи",
            "Создал MVP с помощью AI-assisted разработки: Telegram-бот + сайт; UI-флоу в Figma",
            "Настроил воронку конверсии и дашборд метрик; D7-уровень активации: ~40%",
            "Координировал кросс-функциональную команду 8 человек: логистика, разработка, маркетинг",
            "Результат: ~400 пользователей, ~40% activation rate (регистрация → первый заказ)",
          ],
          skills: "CustDev, CJM, Figma, Telegram Bot API, Product Metrics, Scrum, AI Research",
        },
      ],
      projects_data: [
        {
          name: "Платформа для экспатов",
          period: "Май 2026 — наст. время",
          link: "https://expat-roadmap-sea.vercel.app",
          bullets: [
            "Построил full-stack платформу соло: карта виз/городов, комьюнити, жильё, события, работа",
            "Telegram-бот как основной канал вовлечения пользователей",
          ],
          skills: "Next.js, Supabase, Cursor, Claude API, Telegram, AI-assisted разработка",
        },
        {
          name: "Портфолио + JasurGPT",
          period: "2026",
          link: "https://jasur.dev",
          bullets: [
            "Личный сайт с AI-чатом (JasurGPT), обученным на полном контексте: резюме, проекты, опыт",
            "Демонстрирует: AI Career System, Expat Roadmap SEA, RAG Starter",
          ],
          skills: "Next.js, OpenRouter, Vercel, TypeScript, Tailwind CSS",
        },
        {
          name: "AI Career System",
          period: "2026 · В работе",
          link: null,
          bullets: [
            "Автоматизация поиска работы: парсинг вакансий, адаптация резюме под ATS, автогенерация писем",
            "Claude + n8n + Google Sheets + Telegram; уровень автоматизации: 100%; время до результата: 55 сек.",
          ],
          skills: "Claude API, n8n, Google Sheets, Telegram Bot API, Prompt Engineering",
        },
        {
          name: "Голосовой пайплайн Claude + Telegram + Whisper",
          period: "2026",
          link: null,
          bullets: [
            "Пайплайн: Whisper транскрибирует аудио → Claude обрабатывает → Telegram доставляет",
            "Настроено самостоятельно, без шаблонов и туториалов",
          ],
          skills: "Whisper API, Claude API, Telegram Bot API",
        },
      ],
      skills_data: {
        "Продукт": ["Product Discovery", "CustDev", "CJM", "User Stories", "Бэклог и приоритизация", "Формирование гипотез", "A/B тестирование", "MVP", "Scrum", "SAFe (основы)", "NPS", "LTV / CAC", "Аналитика воронок", "D7/D30 Retention", "Activation Rate"],
        "Разработка": ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Prisma", "Vercel", "Git / GitHub", "REST API"],
        "AI и автоматизация": ["Claude API", "OpenRouter API", "ChatGPT", "Prompt Engineering", "NotebookLM", "n8n", "Voiceflow", "Cursor", "AI Agents", "Whisper API"],
        "Инструменты": ["Google Sheets", "Figma", "Canva", "Telegram Bot API", "Facebook API"],
        "Языки": ["Английский (профессиональный)", "Русский (родной)", "Турецкий (B2)", "Узбекский (родной)"],
      },
    },

    services: {
      label: "Услуги",
      title: "Чем могу помочь.",
      openNote: "Рассматриваю full-time PM / AI PM позиции. Услуги ниже — моя AI-консалтинговая практика, доступная параллельно или как промежуточный вариант.",
      contact: "Контакт",
      contactTg: "Telegram",
      cta: "Обсудить",
      ctaDesc: "CRM, автоматизация, AI-инструменты или процессы. Напишите — вместе определим формат.",
      automationLabel: "AI и автоматизация",
      productLabel: "Продукт и контент",
    },

    writing: {
      label: "Статьи",
      title: "Публикации и контент",
      subtitle: "Кейсы, технические разборы и продуктовое мышление.",
      statsDesc:
        "Написал о том, как создал AI-клона для своего поиска работы. Пост завирусился во ВКонтакте — 30K взаимодействий — и вывел блог в Топ-3 VC.ru.",
      stats: [
        { value: "№3", label: "рейтинг блогов VC.ru", sub: "Июнь 2026" },
        { value: "30K", label: "взаимодействий", sub: "один пост, ВКонтакте" },
        { value: "21K", label: "просмотров на Хабре", sub: "на статью" },
      ],
      publishedLabel: "Опубликовано",
      channelsLabel: "Каналы",
    },
  },
} as const;
