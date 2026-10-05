/* Все надписи сайта на двух языках.

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
    nav: { works: "Работы", log: "Log", workshop: "Мастерская", about: "Обо мне" },
    // Подпись для читалки экрана: говорит, что случится по нажатию.
    langAction: "Switch to English",
    write: "Пишите",
    message: "Написать",
    read: "Читать",
    email: "почта",
  },
  en: {
    nav: { works: "Works", log: "Log", workshop: "Workshop", about: "About" },
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
      works: "шесть собранных продуктов",
      log: "тексты и подкаст",
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
      works: "six products built",
      log: "writing and a podcast",
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
        stack: ["Next.js", "RAG", "Groq", "Vercel"],
      },
      jasurgpt: {
        name: "JasurGPT",
        what: "Чат на моём сайте для тех, кому проще спросить, чем читать резюме: отвечает про опыт и проекты по собранному личному контексту.",
        stack: ["Next.js", "Groq / OpenRouter", "Vercel", "TypeScript"],
      },
      demos: {
        name: "Демо автоматизаций",
        what: "Четыре демо для локального бизнеса, работают в браузере с телефона: предзаказ с трибуны, слив вечерних остатков, алерты о фроде на кассе, ответы на отзывы в картах.",
        stack: ["Next.js", "Groq / OpenRouter", "Telegram WebApp", "СБП"],
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
        stack: ["Next.js", "RAG", "Groq", "Vercel"],
      },
      jasurgpt: {
        name: "JasurGPT",
        what: "A chat on my site for people who would rather ask than read a resume: it answers about my experience and projects from a personal context I put together.",
        stack: ["Next.js", "Groq / OpenRouter", "Vercel", "TypeScript"],
      },
      demos: {
        name: "Automation demos",
        what: "Four demos for local businesses that run in a phone browser: pre-orders from the stands, selling off evening leftovers, fraud alerts at the till, replies to map reviews.",
        stack: ["Next.js", "Groq / OpenRouter", "Telegram WebApp", "SBP"],
      },
    },
  },
};

/* ---------- Мастерская ---------- */

/* Пункт «Что внутри»: видимые заголовок и строка (t, d) и то, что
   открывается по плюсу (more), workshop/Inside.tsx. Тексты раскрытых
   пунктов утверждены Жасуром 4 октября 2026 и стоят дословно.

   post: абзацы примера поста. Перенос строки внутри абзаца пишется "\n",
   абзац целиком в **...** выводится жирным.
   table: настоящая таблица, не картинка. Первая ячейка строки служит её
   заголовком (th scope="row"); пустая ячейка шапки над ними так и остаётся
   пустой.
   shot: кадр демо вместо таблицы (пункт 4), файл в public/new/workshop. */
export type WsTable = { head: string[]; rows: string[][]; cap: string };

export type WsItem = {
  t: string;
  d: string;
  more: {
    inside: string[];
    post: string[];
    table?: WsTable;
    shot?: { src: string; alt: string; href: string; cap: string };
    format: string;
  };
};

export const WORKSHOP: Record<
  Lang,
  {
    h1: string[];
    lead: string;
    photoAlt: string;
    inside: string;
    postL: string;
    formatL: string;
    openDemo: string;
    items: WsItem[];
    option: WsItem;
    forWhom: string;
    yesT: string;
    yesD: string;
    noT: string;
    noD: string;
    stateT: string;
    stateD: string;
    button: string;
  }
> = {
  ru: {
    h1: ["Запустил шесть проектов.", "Разбираю каждый"],
    lead: "Что делал, где ошибся, сколько это стоило. Если вы запускаете первый, половину моих граблей вы обойдёте.",
    photoAlt: "Человек в металлическом лифте нажимает кнопку этажа",
    inside: "Что внутри",
    postL: "Пример поста",
    formatL: "Формат",
    openDemo: "Открыть демо",
    items: [
      {
        t: "Как собирается",
        d: "Разборы моих инструментов по шагам: JasurGPT, RAG-ассистент, боты, автоматизации. Что использовал, сколько стоило, где сломалось.",
        more: {
          inside: [
            "Как 3 октября весь ИИ на сайте лёг из-за лимита в 50 запросов. И почему после переезда на Groq он отвечает за 0,85-1,9 секунды вместо 6-40, а стоит по-прежнему 0 ₽.",
            "Почему Mia, ассистент стоматологии, молчала с 16 августа. Модель отключили, а пространство на Hugging Face засыпало через 48 часов без посетителей.",
            "Карточка обещала источник под ответом, а чат его не показывал. В разборе стояла чистка за 4 500 ₽ вместо 8 400 ₽ и выходной в воскресенье. Как появился настоящий поиск по 12 разделам документа.",
            "Сайт на 127 адресов, собранный с ИИ-агентами, и ни одного битого адреса. Где агенты обрываются посреди работы и как при этом не потерять сделанное.",
            "Бот заявок за вечер: вебхук на Vercel, хранилище Upstash, бесплатно.",
          ],
          post: [
            "Третьего октября весь ИИ на сайте замолчал. Не сломался, а кончился: бесплатный OpenRouter даёт пятьдесят запросов в сутки на весь аккаунт, и их съела проверка сайта.",
            "Причина оказалась смешнее лимита. На один клик демо перебирало до шестнадцати моделей. Часть из них давно удалили, но код всё равно стучался к каждой, и каждый стук списывался из общего лимита.",
            "За тысячу запросов в сутки просят 10 $. Платить не стал, перевёл всё на Groq: тысяча запросов в сутки на каждую из трёх моделей, без карты.",
            "Ответ шёл от шести до сорока секунд. Теперь меньше двух.",
            "**Стоимость та же, ноль рублей. Скорость другая.**",
          ],
          table: {
            head: ["", "До 3 октября", "После"],
            rows: [
              ["Лимит", "50 в сутки на аккаунт", "1000 в сутки на модель"],
              ["Время ответа", "6-40 с", "0,85-1,9 с"],
              ["Моделей на клик", "до 16", "1"],
              ["Стоимость", "0 ₽", "0 ₽"],
            ],
            cap: "Было и стало после 3 октября. Цена в обеих колонках одна.",
          },
          format: "Один случай на пост: что сломалось, почему, что сделал, сколько стоило. Текст и скриншоты.",
        },
      },
      {
        t: "Где ищу деньги",
        d: "Посредничество, связи, темы, которые прилетают: уголь, брусчатка, NFC-метки. Закрытых сделок пока ноль. Показываю, на каком шаге встаёт каждая.",
        more: {
          inside: [
            "Уголь: почему разговор встал раньше, чем дошло до первого покупателя.",
            "Брусчатка: производство в Красногорске, которому не хватает объёма: 5 тыс. тонн против нужных 15-20 тыс. Что требуется от меня и есть ли процент, пока не выяснено. Этот момент тоже показываю.",
            "NFC-метки для кафе: порог был пятнадцать визитов. Поговорил с одним заведением, меня даже не дослушали. Через шесть дней закрыл направление. Разбор, почему так вышло.",
            "Визитка с нулевым оборотом в сообществе предпринимателей: почему она собрала больше реакций, чем визитки людей с оборотом, и дала два входящих контакта в первый день.",
            "По каждой теме один и тот же порядок: что предложили, что я спросил, что ответили, на каком шаге встало.",
          ],
          post: [
            "Человек, с которым мы обсуждали брусчатку, предложил ещё и уголь. Посредничество.",
            "Я попросил вводные. Ответ: сначала компания-покупатель, потом вводные.",
            "Только покупатель первым делом спросит три вещи: марку, цену и базис поставки. Без них я не могу даже начать с ним разговор.",
            "Получается круг. Чтобы найти клиента, нужна цена. Чтобы получить цену, нужен клиент.",
            "Сделки нет. Часов на это не трачу, но телефон не выключаю.",
          ],
          table: {
            head: ["Тема", "Что нужно было", "Где встало", "Статус"],
            rows: [
              ["Уголь", "марка, цена, базис", "не дают, пока нет покупателя", "фоном"],
              ["Брусчатка", "объём 15-20 тыс. т, есть 5 тыс. т", "моя роль не определена", "фоном"],
              ["NFC-метки", "15 визитов", "один разговор, не дослушали", "закрыто"],
            ],
            cap: "Три темы, ноль закрытых сделок. Внутри по шагам, где встала каждая.",
          },
          format: "Переговоры по шагам: пост плюс общая таблица статусов, она обновляется, когда что-то сдвинулось.",
        },
      },
      {
        t: "Что происходит у меня",
        d: "Цифры по каждой публикации, сколько собрал и сколько не собрал, что пробую на этой неделе. Без монтажа.",
        more: {
          inside: [
            "Цифры по каждой публикации: показы, открытия, дочитывания, комментарии, подписки. Сравнение площадок на одном тексте.",
            "Деньги по моим проектам, включая ноль.",
            "Что пробую на этой неделе и по какой цифре пойму, что не сработало.",
            "Что бросил и почему, без пересказа задним числом.",
          ],
          post: [
            "Двадцать третьего сентября выложил один и тот же текст на DTF и VC.ru. Без правок под площадку.",
            "DTF: 1390 показов, 149 открытий, 99 дочитали, 13 комментариев.\nVC.ru: 199 показов, 28 открытий, 16 дочитали, 2 комментария.",
            "По охвату DTF выиграл в семь раз. По тому, как читают, почти ничья: дочитали 66% и 57%. Текст зашёл одинаково, просто лента DTF показала его большему числу людей.",
            "Подписок на блог по одной с каждой площадки. Один пост, закономерностью это не считаю.",
            "Версию с заголовком под каждую площадку я подготовил и не выложил. Сколько она дала бы, не знаю.",
          ],
          // Таблица стоит, пока Жасур не пришлёт скриншот статистики DTF,
          // потом её заменит скриншот.
          table: {
            head: ["", "DTF", "VC.ru"],
            rows: [
              ["Показы", "1390", "199"],
              ["Открытия", "149", "28"],
              ["Дочитали", "99 (66%)", "16 (57%)"],
              ["Комментарии", "13", "2"],
              ["Подписки", "1", "1"],
            ],
            cap: "23 сентября, один и тот же текст на двух площадках.",
          },
          format: "Пост с цифрами после каждой публикации.",
        },
      },
    ],
    option: {
      t: "Час на вашу задачу",
      d: "Один-два раза в месяц разбираю чью-то задачу: собираю инструмент, смотрю цифры, придумываю подачу. Беру пять человек, больше не вытяну: свободных часов у меня десять-двенадцать в неделю.",
      more: {
        inside: [
          "Вы присылаете задачу, я беру одну из трёх вещей: собрать инструмент, посмотреть цифры, придумать подачу.",
          "Сначала переписка, потом назначаем созвон.",
          "Один-два раза в месяц, пять мест, задачи выбираю я.",
          "На выходе один из трёх результатов: черновик инструмента, разбор цифр или вариант подачи.",
          "Без обязательств с обеих сторон: это не подряд и не консультация эксперта.",
        ],
        post: [
          "Задача. Владелец строит дом на 186 метров и не успевает слушать, что прораб присылает за день.",
          "Что собрал. Прораб пишет как привык: голосовые, фото с объекта, фото накладной. Из них складывается отчёт по четырём разделам: работы, материалы, люди, проблемы. Дальше сверка с графиком и сметой.",
          "Что показали цифры. Перекрытие второго этажа залито, а кровля по графику уже должна идти и отстаёт на три дня.",
          "Что получает владелец. Вечером одно сообщение вместо пачки голосовых.",
          "Объект выдуманный, демо открывается на сайте. Голосовые и сверка в нём прописаны заранее, живой ИИ пишет только сводку.",
        ],
        // Кадр /demos/stroyka с живого сайта после прохода сценария, окно
        // 1600 × 1000, снят 5 октября 2026.
        shot: {
          src: "/new/workshop/stroyka.jpg",
          alt: "Демо «Отчёт прораба и контроль сметы»: расшифровка голосового прораба, отчёт дня по разделам, отклонение «Кровля отстаёт на 3 дня» и сводка для владельца",
          href: "/demos/stroyka",
          cap: "Демо на выдуманном объекте. Под вашу задачу то же самое, только на ваших данных.",
        },
        format: "Один-два раза в месяц, пять мест, задачи выбираю я. Сначала переписка, потом созвон.",
      },
    },
    forWhom: "Для кого",
    yesT: "Для тех, кто уже что-то запускает или вот-вот начнёт.",
    yesD: "Вы собираете первый продукт, ищете, на чём заработать, и хотите видеть чужой процесс без монтажа. Вам не нужна мотивация, вам нужно посмотреть, как оно выглядит изнутри у того, кто идёт на шаг впереди.",
    noT: "Не для тех, кто ищет схему.",
    noD: "Здесь нет готовых способов заработать и нет гарантий, что у вас получится. Сам ещё не разбогател. Как разбогатею, подниму цену.",
    stateT: "Поток приостановлен",
    stateD: "Открою, когда смогу вести нормально. Оставьте контакт: напишу первым, сразу с ценой и датой старта.",
    button: "Оставить контакт",
  },
  en: {
    h1: ["Launched six projects.", "Taking each one apart"],
    lead: "What I did, where I got it wrong, what it cost. If you are launching your first, you will dodge half of my screwups.",
    photoAlt: "A man in a metal elevator pressing a floor button",
    inside: "What's inside",
    postL: "Sample post",
    formatL: "Format",
    openDemo: "Open the demo",
    items: [
      {
        t: "How it gets built",
        d: "Step-by-step breakdowns of my tools: JasurGPT, the RAG assistant, bots, automations. What I used, what it cost, where it broke.",
        more: {
          inside: [
            "How on October 3 all the AI on my site went down over a 50-request limit. And why after moving to Groq it answers in 0.85-1.9 seconds instead of 6-40, and still costs nothing.",
            "Why Mia, the dental clinic assistant, had been silent since August 16. The model was switched off, and the Hugging Face space went to sleep after 48 hours without visitors.",
            "The card promised a source under each answer, the chat did not show one. The walkthrough had a cleaning at 4,500 ₽ instead of 8,400 ₽ and Sunday as a day off. How real search across 12 sections of the document got built.",
            "A 127-page site built with AI agents, not one broken link. Where agents cut out mid-task and how not to lose the work.",
            "The waitlist bot built in one evening: a Vercel webhook, Upstash storage, free.",
          ],
          post: [
            "On October 3 all the AI on my site went quiet. Nothing broke, it ran out: free OpenRouter gives fifty requests a day for the whole account, and a site check used them up.",
            "The cause turned out to be sillier than the limit. On a single click the demo cycled through up to sixteen models. Some had been removed long ago, but the code knocked on every door anyway, and every knock came out of the shared limit.",
            "A thousand requests a day costs $10. I did not pay. I moved everything to Groq: a thousand requests a day for each of three models, no card needed.",
            "Replies used to take six to forty seconds. Now under two.",
            "**Same cost, zero. Different speed.**",
          ],
          table: {
            head: ["", "Before October 3", "After"],
            rows: [
              ["Limit", "50 a day per account", "1,000 a day per model"],
              ["Response time", "6-40 s", "0.85-1.9 s"],
              ["Models per click", "up to 16", "1"],
              ["Cost", "0 ₽", "0 ₽"],
            ],
            cap: "Before and after October 3. The price is the same in both columns.",
          },
          format: "One case per post: what broke, why, what I did, what it cost. Text and screenshots.",
        },
      },
      {
        t: "Where I look for money",
        d: "Brokering, connections, deals that land in my lap: coal, paving stones, NFC tags. Zero closed deals so far. I show the step where each one stalls.",
        more: {
          inside: [
            "Coal: why the talk stalled before it got to a single buyer.",
            "Paving stones: a plant in Krasnogorsk short on volume: 5 thousand tonnes against the 15-20 thousand it needs. What is required from me and whether there is a cut is still unclear. I show that part too.",
            "NFC tags for cafes: the bar was fifteen visits. I talked to one place, and they did not even hear me out. Six days later I closed it. Why it went that way.",
            "A zero-revenue intro in an entrepreneurs' community: why it got more reactions than intros from people with revenue, and two inbound contacts on day one.",
            "Every topic goes the same way: what was offered, what I asked, what they said, where it stalled.",
          ],
          post: [
            "A man I had been discussing paving stones with offered coal as well. Brokering.",
            "I asked for the basics. The answer: first a buyer company, then the basics.",
            "But a buyer asks three things first: grade, price and delivery terms. Without them I cannot even start the conversation.",
            "So it is a loop. To find a client I need a price. To get a price I need a client.",
            "No deal. I spend no hours on it, but I keep my phone on.",
          ],
          table: {
            head: ["Topic", "What was needed", "Where it stalled", "Status"],
            rows: [
              ["Coal", "grade, price, delivery terms", "not given until there is a buyer", "background"],
              ["Paving stones", "volume 15-20 thousand t, have 5 thousand t", "my role undefined", "background"],
              ["NFC tags", "15 visits", "one talk, not heard out", "closed"],
            ],
            cap: "Three topics, zero closed deals. Inside, step by step, where each one stalled.",
          },
          format: "Negotiations step by step: a post plus a shared status table, updated when something moves.",
        },
      },
      {
        t: "What is going on with me",
        d: "Numbers for every post, how much came in and how much did not, what I am trying this week. Uncut.",
        more: {
          inside: [
            "Numbers for every post: impressions, opens, read-throughs, comments, follows. Platforms compared on the same text.",
            "Money from my projects, zero included.",
            "What I am trying this week and which number will tell me it failed.",
            "What I dropped and why, without rewriting it after the fact.",
          ],
          post: [
            "On September 23 I posted the same text on DTF and VC.ru. No edits for either platform.",
            "DTF: 1,390 impressions, 149 opens, 99 read to the end, 13 comments.\nVC.ru: 199 impressions, 28 opens, 16 read to the end, 2 comments.",
            "On reach DTF won seven to one. On how people read, it is almost a tie: 66% and 57% finished. The text landed the same way, DTF's feed just showed it to more people.",
            "One blog follow from each platform. One post, so I do not call it a pattern.",
            "I had a version with a headline for each platform ready and did not post it. How much it would have added, I do not know.",
          ],
          table: {
            head: ["", "DTF", "VC.ru"],
            rows: [
              ["Impressions", "1,390", "199"],
              ["Opens", "149", "28"],
              ["Read to the end", "99 (66%)", "16 (57%)"],
              ["Comments", "13", "2"],
              ["Follows", "1", "1"],
            ],
            cap: "September 23, the same text on two platforms.",
          },
          format: "A post with numbers after every publication.",
        },
      },
    ],
    option: {
      t: "An hour on your problem",
      d: "Once or twice a month I take on someone's problem: build a tool, look at the numbers, work out how to pitch it. I take five people, I cannot carry more: I have ten to twelve free hours a week.",
      more: {
        inside: [
          "You send a problem, I take one of three things: build a tool, look at the numbers, work out how to pitch it.",
          "First we write, then we set up a call.",
          "Once or twice a month, five places, I pick the problems.",
          "What you get: a draft tool, a read of the numbers or a pitch.",
          "No obligations on either side: it is not a contract and not an expert consultation.",
        ],
        post: [
          "The problem. An owner is building a 186 m² house and has no time to listen to what the foreman sends during the day.",
          "What I built. The foreman writes the way he always does: voice notes, site photos, a photo of the delivery note. They turn into a report in four sections: work, materials, people, issues. Then it is checked against the schedule and the estimate.",
          "What the numbers showed. The first-floor slab is poured, but the roof should already be underway and is three days behind.",
          "What the owner gets. One message in the evening instead of a pile of voice notes.",
          "The site is made up, the demo opens on my website. Its voice notes and checks are scripted in advance, the live AI only writes the summary.",
        ],
        shot: {
          src: "/new/workshop/stroyka-en.jpg",
          alt: "The Site reports and budget control demo: a transcribed voice note from the foreman, the day's report by section, the deviation Roof 3 days behind and the owner's summary",
          href: "/demos/stroyka",
          cap: "A demo on a made-up site. For your problem, the same thing on your data.",
        },
        format: "Once or twice a month, five places, I pick the problems. First we write, then a call.",
      },
    },
    forWhom: "Who it is for",
    yesT: "For people who are already launching something or about to start.",
    yesD: "You are building your first product, looking for a way to make money, and want to see someone else's process uncut. You do not need motivation. You need to see what it looks like from the inside for someone one step ahead.",
    noT: "Not for people looking for a scheme.",
    noD: "There are no ready-made ways to make money here and no guarantee it will work for you. I am not rich yet. When I am, the price goes up.",
    stateT: "Intake paused",
    stateD: "I will reopen when I can run it properly. Leave a contact and I will write first, with the price and the start date.",
    button: "Leave a contact",
  },
};

/* ---------- Обо мне ---------- */

const COURSES = [
  "AI for Product Manager · DeepLearning.AI, Coursera",
  "CJM and CustDev Tools · ProductStar",
  "Metrics and Models for Project Managers · Shelf",
];

export const ABOUT = {
  ru: {
    h1: "Обо мне",
    photoAlt: "Портрет",
    cap: "Рис. 01, Москва",
    // Вводный блок справа от портрета, утверждён Жасуром 03.10. Два абзаца:
    // стартапы, потом штат и сейчас. Слово из work страница делает ссылкой
    // на «Работы».
    intro: [
      "Запускал продукты с нуля в двух стартапах, оба раза сооснователем. В Instameal был продакт-менеджером и координировал команду из 8 человек: около 400 пользователей, 40% дошли до первого заказа. В Yonma Yon собрал MVP из лендинга и телеграм-бота: 150 пользователей и B2B-направление.",
      "Потом в штате Braiden Consulting внедрял ИИ в процессы компании. Сейчас собираю продукты сам, шесть из них лежат в «Работах».",
    ],
    work: "Работах",
    // Строка контактов под вводным блоком: город и подпись к телеграму,
    // адреса и ссылки одинаковые для обоих языков (about/page.tsx).
    city: "Москва",
    telegram: "Телеграм",
    // Строка под кнопками. Сама кнопка и окно анкеты в RESUME ниже.
    resumeNote: "Пара вопросов о вас и компании. Резюме пришлю сам, на почту или в телеграм.",
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
    // Образование и курсы без годов, раздела «Языки» нет: решение Жасура
    // 03.10. Названия курсов одинаковые на обоих языках.
    edu: "Образование",
    eduV: "НИУ ВШЭ, бизнес и экономика",
    courses: "Курсы",
    coursesV: COURSES,
    // Последний раздел страницы, под «Курсами». Log и @имена страница делает
    // ссылками.
    outside: "Кроме работы",
    outsideV:
      "Около года снимаю видео, учусь монтажу. Тексты выходят в Log и в телеграме @head_of_ceo. Если знаете человека, с которым нам стоит познакомиться, пишите @biznesmind.",
  },
  en: {
    h1: "About",
    photoAlt: "Portrait",
    cap: "Fig. 01, Moscow",
    intro: [
      "I launched products from zero at two startups, both times as a co-founder. At Instameal I was the product manager and coordinated a team of 8: about 400 users, 40% made it to a first order. At Yonma Yon I built an MVP from a landing page and a Telegram bot: 150 users and a B2B line.",
      "Then, on staff at Braiden Consulting, I brought AI into the company's processes. Now I build products on my own, six of them are in Works.",
    ],
    work: "Works",
    city: "Moscow",
    telegram: "Telegram",
    resumeNote: "A few questions about you and your company. I'll send the resume myself, by email or Telegram.",
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
    eduV: "HSE University, business and economics",
    courses: "Courses",
    coursesV: COURSES,
    outside: "Outside work",
    outsideV:
      "I have been filming video for about a year and am learning to edit. My writing goes to Log and to Telegram @head_of_ceo. If you know someone I should meet, message @biznesmind.",
  },
};

/* ---------- Запрос резюме (окно-анкета на «Обо мне») ----------

   Кнопка и окно в app/about/ResumeRequest.tsx, маршрут
   app/api/resume-request. Подпись кнопки утверждена Жасуром 03.10, менять
   одной строкой здесь (button). Тексты окна: обращение на «вы», без длинных
   тире и стрелок. Порядок вопросов задан в окне, здесь только слова. */

export const RESUME = {
  ru: {
    button: "Запросить резюме",
    title: "Запрос резюме",
    of: "из",
    close: "Закрыть",
    back: "Назад",
    next: "Далее",
    send: "Отправить",
    sending: "Отправляем…",
    retry: "Отправить ещё раз",
    skip: "Пропустить",
    qRole: "Кто вы?",
    roles: {
      director: "Директор",
      founder: "Основатель компании",
      hr: "HR / рекрутер",
      other: "Другое",
    },
    otherLabel: "Кто именно",
    otherPh: "Например, руководитель отдела",
    qCompany: "Как называется компания?",
    qWhat: "Чем занимается компания?",
    whatPh: "Одной-двумя строками",
    qEmail: "Почта для ответа",
    emailPh: "name@company.com",
    qTelegram: "Телеграм, если удобно",
    telegramPh: "@username",
    note: "Ответы увидит только Жасур.",
    badEmail: "Проверьте адрес: нужен вид name@company.com.",
    errNet: "Не получилось отправить. Проверьте соединение и отправьте ещё раз, ответы сохранены.",
    errRate: "Слишком много попыток подряд. Подождите несколько минут и отправьте ещё раз.",
    errBad: "Сервер не принял ответы. Проверьте их и отправьте ещё раз.",
    thanksT: "Спасибо.",
    thanksD: "Жасур посмотрит запрос и лично пришлёт вам резюме.",
  },
  en: {
    button: "Request my resume",
    title: "Resume request",
    of: "of",
    close: "Close",
    back: "Back",
    next: "Next",
    send: "Send",
    sending: "Sending…",
    retry: "Send again",
    skip: "Skip",
    qRole: "Who are you?",
    roles: {
      director: "Director",
      founder: "Company founder",
      hr: "HR / recruiter",
      other: "Other",
    },
    otherLabel: "Your role",
    otherPh: "For example, head of department",
    qCompany: "What is the company called?",
    qWhat: "What does the company do?",
    whatPh: "A line or two",
    qEmail: "Your email for the reply",
    emailPh: "name@company.com",
    qTelegram: "Telegram, if you like",
    telegramPh: "@username",
    note: "Only Jasur will see your answers.",
    badEmail: "Check the address: it should look like name@company.com.",
    errNet: "Could not send. Check your connection and send again, your answers are saved.",
    errRate: "Too many attempts in a row. Wait a few minutes and send again.",
    errBad: "The server did not accept the answers. Check them and send again.",
    thanksT: "Thank you.",
    thanksD: "Jasur will review your request and send you his resume personally.",
  },
};
