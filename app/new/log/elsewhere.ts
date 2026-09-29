/* Внешние публикации и каналы для страницы Log.

   Ровно те же данные, что на живой странице /writing: там они лежат внутри
   app/writing/WritingContent.tsx локальными константами published и
   channelsList, наружу не экспортируются, и импортировать их оттуда нельзя.
   Поэтому здесь копия, ничего дописанного и ничего выдуманного. Когда макет
   заменит живую страницу, список останется один — этот, а старый уйдёт
   вместе с WritingContent.

   Название на двух языках. У английских публикаций английское название и
   есть настоящее, русское его перевод; у русских наоборот. Одно исключение:
   в настоящем названии статьи про 94% стоит длинное тире, в английской
   подписи оно заменено запятой по правилу для английских текстов сайта.

   Описания каналов переведены с русских строк этого файла, а не взяты со
   старой страницы: там английский местами писался отдельно и по смыслу
   расходился с русским. */

export type External = {
  title: { ru: string; en: string };
  platform: string;
  /* Язык самой публикации, а не интерфейса: половина текстов вышла
     по-английски, и читателю честно сказать это до перехода. */
  lang: "RU" | "EN";
  href: string;
};

export const PUBLISHED: External[] = [
  {
    title: {
      ru: "Как я месяцами безуспешно искал работу PM'ом, психанул и создал AI-клона, который проходит собеседования вместо меня",
      en: "How I spent months failing to find a PM job, snapped, and built an AI clone that goes to interviews for me",
    },
    platform: "VC.ru",
    lang: "RU",
    href: "https://vc.ru/id5991727",
  },
  {
    title: {
      ru: "Почему 94% продакт-менеджеров используют AI — и большинство упускает суть",
      en: "Why 94% of Product Managers Use AI, and Most Are Missing the Point",
    },
    platform: "LinkedIn",
    lang: "EN",
    href: "https://www.linkedin.com/pulse/why-94-product-managers-use-ai-most-missing-point-jasur-akhmadaliev-qfybe/",
  },
  {
    title: {
      ru: "15% повторных продаж без единого нового клиента",
      en: "15% Repeat Sales Without a Single New Customer",
    },
    platform: "LinkedIn",
    lang: "EN",
    href: "https://www.linkedin.com/pulse/15-repeat-sales-without-single-new-customer-jasur-akhmadaliev-ir9me",
  },
  {
    title: {
      ru: "Почему умные команды продолжают запускать обречённые проекты (и как это остановить)",
      en: "Why Smart Teams Still Launch Doomed Projects (and How to Stop)",
    },
    platform: "LinkedIn",
    lang: "EN",
    href: "https://www.linkedin.com/pulse/why-smart-teams-still-launch-doomed-projects-how-stop-akhmadaliev-ss0ge/",
  },
  {
    title: {
      ru: "AI-стек для PM, который реально работает (и почему 95% команд его не используют)",
      en: "The PM AI Stack That Actually Works (And Why 95% of Teams Miss It)",
    },
    platform: "Medium",
    lang: "EN",
    href: "https://medium.com/@jasurakhmadaliev283/the-pm-ai-stack-that-actually-works-and-why-95-of-teams-miss-it-9fb5e3b46c4f",
  },
  {
    title: {
      ru: "Приём NASA, который продакты почти никогда не используют",
      en: "The NASA Trick Product Managers Almost Never Use",
    },
    platform: "Medium",
    lang: "EN",
    href: "https://medium.com/@jasurakhmadaliev283/the-nasa-trick-product-managers-almost-never-use-67156efea126",
  },
  {
    title: {
      ru: "Клиенты, которые у вас уже есть — это те, кого вы теряете",
      en: "The Customers You Already Have Are the Ones You Are Losing",
    },
    platform: "Medium",
    lang: "EN",
    href: "https://medium.com/@jasurakhmadaliev283/the-customers-you-already-have-are-the-ones-you-are-losing-c69461b648f8",
  },
  {
    title: {
      ru: "Лучшие мысли появляются до того, как вы начинаете писать",
      en: "Your Best Thinking Happens Before You Start Writing",
    },
    platform: "Medium",
    lang: "EN",
    href: "https://medium.com/@jasurakhmadaliev283/your-best-thinking-happens-before-you-start-writing-0eb0f35df9c7",
  },
  {
    title: {
      ru: "Fable 5 за 36 часов: запуск, скандал, запрет. Что это значит для бизнеса на AI",
      en: "Fable 5 in 36 Hours: Launch, Controversy, Ban. What It Means for AI Businesses",
    },
    platform: "VC.ru",
    lang: "RU",
    href: "https://vc.ru/id5991727/2977300-fable-5-zapusk-skandal-posledstviya-dlya-biznesa-na-ai",
  },
];

export type Channel = {
  name: string;
  description: { ru: string; en: string };
  href: string;
};

export const CHANNELS: Channel[] = [
  {
    name: "Telegram @head_of_ceo",
    description: {
      ru: "Главный канал. AI-инструменты, продуктовое мышление, дневник поиска работы.",
      en: "The main channel. AI tools, product thinking, a job search diary.",
    },
    href: "https://t.me/head_of_ceo",
  },
  {
    name: "Medium",
    description: {
      ru: "Длинные статьи о продукте и AI на английском.",
      en: "Long articles on product and AI, in English.",
    },
    href: "https://medium.com/@jasurakhmadaliev283",
  },
  {
    name: "LinkedIn",
    description: {
      ru: "Профессиональный контент на английском. PM-кейсы и AI-обновления.",
      en: "Professional content in English. PM cases and AI updates.",
    },
    href: "https://www.linkedin.com/in/jasur-akhmadaliev",
  },
  {
    name: "VC.ru",
    description: {
      ru: "Бизнес-кейсы и продуктовое мышление на русском.",
      en: "Business cases and product thinking, in Russian.",
    },
    href: "https://vc.ru/id5991727",
  },
  {
    name: "Habr",
    description: {
      ru: "Глубокие технические и продуктовые статьи на русском.",
      en: "In-depth technical and product articles, in Russian.",
    },
    href: "https://habr.com/ru/users/Akhmadaliev/",
  },
  {
    name: "X",
    description: {
      ru: "Короткий контент на английском.",
      en: "Short posts in English.",
    },
    href: "https://x.com/Jasur1651Jasur",
  },
];
