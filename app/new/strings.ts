/* Все надписи макета на двух языках.

   Одно место, а не строки внутри каждой страницы: переводчик и тот, кто
   вычитывает, видят русский и английский рядом, и новая надпись, заведённая
   только на одном языке, сразу бросается в глаза. Правило из
   lib/translations.ts то же: любая надпись заводится сразу на обоих.

   Русский текст утверждён Жасуром, английский это перевод, а не
   пересочинение: те же факты, те же цифры, тот же регистр.

   Файл без импортов и без кода, только данные. Поэтому его можно
   подключать и на сервере, и в браузере. */

export type Lang = "ru" | "en";

/* ---------- шапка и подвал всех страниц ---------- */

export const CHROME = {
  ru: {
    nav: { log: "Log", works: "Работы", workshop: "Мастерская", about: "Обо мне" },
    lab: "Макет",
    labNote: "не продакшен",
    // Подпись для читалки экрана: говорит, что случится по нажатию.
    langAction: "Switch to English",
    write: "Пишите",
    message: "Написать",
    read: "Читать",
    email: "почта",
  },
  en: {
    nav: { log: "Log", works: "Works", workshop: "Workshop", about: "About" },
    lab: "Mockup",
    labNote: "not production",
    langAction: "Переключить на русский",
    write: "Write",
    message: "Message",
    read: "Read",
    email: "email",
  },
};

export type NavKey = keyof (typeof CHROME)["ru"]["nav"];

/* ---------- главная ---------- */

export const HOME = {
  ru: {
    h1: ["Вы пришли", "понять", "кто это"],
    sub: "Делаю сам, пишу сам, снимаю сам. Здесь всё, что собрал, и разборы. Забирайте, что пригодится.",
    status: "Открыт к знакомствам и партнёрствам",
    nums: [
      { v: "30 000", k: "реакций на один пост" },
      { v: "21 000", k: "просмотров одной статьи" },
      { v: "#3", k: "блог на VC.ru, июнь 2026" },
      { v: "6", k: "собранных продуктов" },
      { v: "0", k: "нанятых людей" },
    ],
    next: "Куда дальше",
    branches: {
      log: "тексты и подкаст",
      works: "шесть собранных продуктов",
      workshop: "закрытый канал",
      about: "опыт и контакты",
    },
    fresh: "Свежее",
    more: "Все материалы в Log",
  },
  en: {
    h1: ["You came", "to find out", "who this is"],
    sub: "I build it myself, write it myself, film it myself. Here is everything I have built, and the breakdowns. Take whatever you can use.",
    status: "Open to introductions and partnerships",
    nums: [
      { v: "30,000", k: "reactions on one post" },
      { v: "21,000", k: "views on one article" },
      { v: "#3", k: "blog on VC.ru, June 2026" },
      { v: "6", k: "products built" },
      { v: "0", k: "people hired" },
    ],
    next: "Where next",
    branches: {
      log: "writing and a podcast",
      works: "six products built",
      workshop: "private channel",
      about: "experience and contacts",
    },
    fresh: "Latest",
    more: "Everything in Log",
  },
};

/* ---------- Log, рубрики, подкаст ---------- */

export const LOG = {
  ru: {
    lead: "Пишу про то, что делаю сам. Что сработало, что развалилось, сколько стоило.",
    featured: "Главное",
    latest: "Свежее",
    carousel: "Лента обложек",
    empty: "Статей пока нет. Скоро будут.",
    podcast: "Подкаст",
    listen: "Слушать",
    elsewhere: "Где ещё я пишу",
    channels: "Каналы",
    // страница рубрики
    inRubric: "В рубрике",
    rubricEmpty: "В этой рубрике пока ничего нет. Скоро будет.",
    more: "Все материалы в Log",
  },
  en: {
    lead: "I write about what I build myself. What worked, what fell apart, what it cost.",
    featured: "Featured",
    latest: "Latest",
    carousel: "Article covers",
    empty: "No articles yet. Soon.",
    podcast: "Podcast",
    listen: "Listen",
    elsewhere: "Where else I write",
    channels: "Channels",
    inRubric: "In this topic",
    rubricEmpty: "Nothing in this topic yet. Soon.",
    more: "Everything in Log",
  },
};

export const PODCAST = {
  ru: {
    kicker: "Подкаст",
    where: "Слушать прямо здесь, ничего скачивать не нужно",
    talks: "Разговоры",
    voices: "Голосовые",
    voice: "Голосовая",
    episode: "Выпуск",
    soonT: "Первый выпуск пишется.",
    soonD: "Как выйдет, появится здесь и в канале. Там же можно предложить тему или прийти гостем.",
    channel: "Канал @head_of_ceo",
    write: "Написать: @biznesmind",
    // страница выпуска
    crumbVoice: "голосовая",
    crumbEpisode: "выпуск",
    guest: "Гость",
    mentioned: "Из разговора",
    next: "Ещё послушать",
    all: "Все выпуски",
    // плеер
    play: "Слушать",
    pause: "Пауза",
    seek: "Перемотка",
    back: "Назад 15 секунд",
    speed: "Скорость",
  },
  en: {
    kicker: "Podcast",
    where: "Listen right here, nothing to download",
    talks: "Conversations",
    voices: "Voice notes",
    voice: "Voice note",
    episode: "Episode",
    soonT: "The first episode is being recorded.",
    soonD: "Once it is out, it will show up here and in the channel. That is also where you can suggest a topic or come on as a guest.",
    channel: "Channel @head_of_ceo",
    write: "Write: @biznesmind",
    crumbVoice: "voice note",
    crumbEpisode: "episode",
    guest: "Guest",
    mentioned: "Mentioned",
    next: "Listen next",
    all: "All episodes",
    play: "Play",
    pause: "Pause",
    seek: "Seek",
    back: "Back 15 seconds",
    speed: "Speed",
  },
};

/* ---------- Работы ---------- */

export type WorkKey = "abcx" | "expat" | "career" | "mia" | "jasurgpt" | "demos";

type WorkText = { name: string; what: string; stack: string[] };

/* prices и pdf: строка-ссылка внизу страницы на документ «Услуги» (PDF
   своего языка в public/new, собирается scripts/uslugi-pdf.mjs). */
export const WORKS: Record<
  Lang,
  { h1: string[]; lead: string; open: string; prices: string; pdf: string; items: Record<WorkKey, WorkText> }
> = {
  ru: {
    h1: ["Шесть штук,", "собранных", "в одиночку"],
    lead: "Код, дизайн, тексты. Всё работает, всё открывается по ссылке.",
    open: "Открыть",
    prices: "Услуги и цены",
    pdf: "PDF",
    items: {
      abcx: {
        name: "abcx",
        what: "Память продукта для тех, кто строит соло или маленькой командой: фиксируете фичу с гипотезой и метрикой, загружаете события, abcx показывает обрывы в воронке и фичи, которые не держат людей.",
        stack: ["Next.js", "OpenRouter", "Upstash", "Vercel"],
      },
      expat: {
        name: "Expat Roadmap SEA",
        what: "Платформа для переезда в Юго-Восточную Азию: визы и города, жильё, комьюнити, события, работа. Пять продуктовых направлений, собраны в одиночку.",
        stack: ["Next.js", "Supabase", "Vercel", "TypeScript"],
      },
      career: {
        name: "AI Career System",
        what: "Поиск работы без ручных шагов: ссылка на вакансию уходит в телеграм, система разбирает описание, сравнивает с резюме и отдаёт готовое письмо. 47 вакансий, 80 секунд до письма.",
        stack: ["Claude", "n8n", "Google Sheets", "Telegram"],
      },
      mia: {
        name: "Mia",
        what: "Ассистент для стоматологической клиники: цены, услуги, часы, процедуры. Отвечает только по документам клиники и показывает, из какого фрагмента собран ответ.",
        stack: ["Python", "RAG", "Groq", "Gradio", "Hugging Face"],
      },
      jasurgpt: {
        name: "JasurGPT",
        what: "Чат на моём сайте для тех, кому проще спросить, чем читать резюме: отвечает про опыт и проекты по собранному личному контексту.",
        stack: ["Next.js", "OpenRouter", "Vercel", "TypeScript"],
      },
      demos: {
        name: "Демо автоматизаций",
        what: "Четыре демо для локального бизнеса, работают в браузере с телефона: предзаказ с трибуны, слив вечерних остатков, алерты о фроде на кассе, ответы на отзывы в картах.",
        stack: ["Next.js", "OpenRouter", "Telegram WebApp", "СБП"],
      },
    },
  },
  en: {
    h1: ["Six things,", "built", "solo"],
    lead: "Code, design, copy. Everything works, everything opens from a link.",
    open: "Open",
    prices: "Services and prices",
    pdf: "PDF",
    items: {
      abcx: {
        name: "abcx",
        what: "Product memory for people who build solo or in a small team: you log a feature with a hypothesis and a metric, upload events, and abcx shows the drops in the funnel and the features that do not hold people.",
        stack: ["Next.js", "OpenRouter", "Upstash", "Vercel"],
      },
      expat: {
        name: "Expat Roadmap SEA",
        what: "A platform for moving to Southeast Asia: visas and cities, housing, community, events, jobs. Five product areas, built solo.",
        stack: ["Next.js", "Supabase", "Vercel", "TypeScript"],
      },
      career: {
        name: "AI Career System",
        what: "Job search with no manual steps: a vacancy link goes into Telegram, the system parses the description, compares it with the resume and returns a finished cover letter. 47 vacancies, 80 seconds to a letter.",
        stack: ["Claude", "n8n", "Google Sheets", "Telegram"],
      },
      mia: {
        name: "Mia",
        what: "An assistant for a dental clinic: prices, services, hours, procedures. It answers only from the clinic's documents and shows which fragment the answer was built from.",
        stack: ["Python", "RAG", "Groq", "Gradio", "Hugging Face"],
      },
      jasurgpt: {
        name: "JasurGPT",
        what: "A chat on my site for people who would rather ask than read a resume: it answers about my experience and projects from a personal context I put together.",
        stack: ["Next.js", "OpenRouter", "Vercel", "TypeScript"],
      },
      demos: {
        name: "Automation demos",
        what: "Four demos for local businesses that run in a phone browser: pre-orders from the stands, selling off evening leftovers, fraud alerts at the till, replies to map reviews.",
        stack: ["Next.js", "OpenRouter", "Telegram WebApp", "SBP"],
      },
    },
  },
};

/* ---------- Мастерская ---------- */

export const WORKSHOP = {
  ru: {
    h1: ["Запустил шесть проектов.", "Разбираю каждый"],
    lead: "Что делал, где ошибся, сколько это стоило. Если вы запускаете первый, половину моих граблей вы обойдёте.",
    photoAlt: "Человек в металлическом лифте нажимает кнопку этажа",
    inside: "Что внутри",
    items: [
      {
        t: "Как собирается",
        d: "Разборы моих инструментов по шагам: JasurGPT, RAG-ассистент, боты, автоматизации. Что использовал, сколько стоило, где сломалось.",
      },
      {
        t: "Как находятся деньги",
        d: "Связи, посредничество, темы, которые прилетают. Уголь, брусчатка, NFC-метки для локального бизнеса. Что сработало, что нет и почему.",
      },
      {
        t: "Что происходит у меня",
        d: "Цифры по каждой публикации, сколько собрал и сколько не собрал, что пробую на этой неделе. Без монтажа.",
      },
    ],
    option: {
      t: "Час на вашу задачу",
      d: "Один-два раза в месяц разбираю чью-то задачу: собираю инструмент, смотрю цифры, придумываю подачу. Беру пять человек, больше не вытяну: свободных часов у меня десять-двенадцать в неделю.",
    },
    forWhom: "Для кого",
    yesT: "Для тех, кто уже что-то запускает или вот-вот начнёт.",
    yesD: "Вы собираете первый продукт, ищете, на чём заработать, и хотите видеть чужой процесс без монтажа. Вам не нужна мотивация, вам нужно посмотреть, как оно выглядит изнутри у того, кто идёт на шаг впереди.",
    noT: "Не для тех, кто ищет схему.",
    noD: "Здесь нет готовых способов заработать и нет гарантий, что у вас получится. Сам ещё не разбогател. Как разбогатею, подниму цену.",
    stateT: "Поток приостановлен",
    stateD: "Открою, когда смогу вести нормально. Оставьте контакт, напишу первым.",
    button: "Оставить контакт",
  },
  en: {
    h1: ["Launched six projects.", "Taking each one apart"],
    lead: "What I did, where I got it wrong, what it cost. If you are launching your first, you will dodge half of my screwups.",
    photoAlt: "A man in a metal elevator pressing a floor button",
    inside: "What's inside",
    items: [
      {
        t: "How it gets built",
        d: "Step-by-step breakdowns of my tools: JasurGPT, the RAG assistant, bots, automations. What I used, what it cost, where it broke.",
      },
      {
        t: "How the money turns up",
        d: "Connections, brokering, deals that land in my lap. Coal, paving stones, NFC tags for local businesses. What worked, what did not, and why.",
      },
      {
        t: "What is going on with me",
        d: "Numbers for every post, how much came in and how much did not, what I am trying this week. Uncut.",
      },
    ],
    option: {
      t: "An hour on your problem",
      d: "Once or twice a month I take on someone's problem: build a tool, look at the numbers, work out how to pitch it. I take five people, I cannot carry more: I have ten to twelve free hours a week.",
    },
    forWhom: "Who it is for",
    yesT: "For people who are already launching something or about to start.",
    yesD: "You are building your first product, looking for a way to make money, and want to see someone else's process uncut. You do not need motivation. You need to see what it looks like from the inside for someone one step ahead.",
    noT: "Not for people looking for a scheme.",
    noD: "There are no ready-made ways to make money here and no guarantee it will work for you. I am not rich yet. When I am, the price goes up.",
    stateT: "Intake paused",
    stateD: "I will reopen when I can run it properly. Leave a contact and I will write first.",
    button: "Leave a contact",
  },
};

/* ---------- Обо мне ---------- */

export const ABOUT = {
  ru: {
    h1: "Обо мне",
    photoAlt: "Портрет",
    cap: "Рис. 01 — Москва",
    p1: "Собираю продукты в одиночку: код, дизайн и тексты делаю сам.",
    p2: "Всё, что собрал, лежит в «Работах», а как это собиралось и что из этого вышло — в Log, вместе с цифрами.",
    exp: "Опыт",
    experience: [
      { name: "Braiden Consulting", what: "AI-проджект-менеджер. Внедрял ИИ в процессы компании." },
      {
        name: "Synergia",
        what: "Вёл сорок клиентов, собирал требования, следил за сроками. NPS вырос с 62 до 78, время ответа снизилось на треть.",
      },
      {
        name: "Instameal",
        what: "Фудтех-стартап, запуск с нуля. Кастдев, MVP из бота и сайта, первые платящие. Около четырёхсот пользователей, до первого заказа доходили сорок процентов. Координировал команду из восьми человек.",
      },
      {
        name: "Yonma Yon",
        what: "MVP: лендинг и телеграм-бот. Больше десяти пользовательских интервью, сто пятьдесят пользователей, открыл B2B-направление.",
      },
      { name: "IDF Lab", what: "RFM-сегментация клиентской базы для внешнего заказчика, рекомендации по удержанию." },
      {
        name: "Консалтинговый проект, фриланс",
        what: "Аудит закупок и операционных данных, автоматизированная отчётность по категориям затрат. Затраты снизились примерно на восемнадцать процентов.",
      },
    ],
    edu: "Образование",
    eduV: "НИУ ВШЭ, бизнес и экономика, 2023-2025",
    langs: "Языки",
    langsV: ["Русский — родной", "Узбекский — родной", "Английский — профессиональный", "Турецкий — B2"],
  },
  en: {
    h1: "About",
    photoAlt: "Portrait",
    cap: "Fig. 01, Moscow",
    p1: "I build products solo: I do the code, design and copy myself.",
    p2: "Everything I have built is in Works. How it was built and what came of it is in Log, with the numbers.",
    exp: "Experience",
    experience: [
      { name: "Braiden Consulting", what: "AI project manager. Brought AI into the company's processes." },
      {
        name: "Synergia",
        what: "Managed forty clients, gathered requirements, kept deadlines. NPS went from 62 to 78, response time dropped by a third.",
      },
      {
        name: "Instameal",
        what: "Foodtech startup, launched from zero. Customer interviews, an MVP made of a bot and a website, the first paying users. About four hundred users, forty percent got as far as a first order. Coordinated a team of eight.",
      },
      {
        name: "Yonma Yon",
        what: "MVP: a landing page and a Telegram bot. More than ten user interviews, a hundred and fifty users, opened a B2B line.",
      },
      { name: "IDF Lab", what: "RFM segmentation of a customer base for an outside client, with retention recommendations." },
      {
        name: "Consulting project, freelance",
        what: "Audit of procurement and operations data, automated reporting by cost category. Costs fell by about eighteen percent.",
      },
    ],
    edu: "Education",
    eduV: "HSE University, business and economics, 2023-2025",
    langs: "Languages",
    langsV: ["Russian: native", "Uzbek: native", "English: professional", "Turkish: B2"],
  },
};
