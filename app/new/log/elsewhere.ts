/* Внешние публикации и каналы для страницы Log.

   Ровно те же данные, что на живой странице /writing: там они лежат внутри
   app/writing/WritingContent.tsx локальными константами published и
   channelsList, наружу не экспортируются, и импортировать их оттуда нельзя.
   Поэтому здесь копия русских строк, ничего дописанного и ничего
   выдуманного. Когда макет заменит живую страницу, список останется один —
   этот, а старый уйдёт вместе с WritingContent.

   Макет русский (переключатель языка в шапке пока только вид), поэтому от
   двуязычных полей остались русские значения. */

export type External = {
  title: string;
  platform: string;
  /* Язык самой публикации, а не интерфейса: половина текстов вышла
     по-английски, и читателю честно сказать это до перехода. */
  lang: "RU" | "EN";
  href: string;
};

export const PUBLISHED: External[] = [
  {
    title:
      "Как я месяцами безуспешно искал работу PM'ом, психанул и создал AI-клона, который проходит собеседования вместо меня",
    platform: "VC.ru",
    lang: "RU",
    href: "https://vc.ru/id5991727",
  },
  {
    title: "Почему 94% продакт-менеджеров используют AI — и большинство упускает суть",
    platform: "LinkedIn",
    lang: "EN",
    href: "https://www.linkedin.com/pulse/why-94-product-managers-use-ai-most-missing-point-jasur-akhmadaliev-qfybe/",
  },
  {
    title: "15% повторных продаж без единого нового клиента",
    platform: "LinkedIn",
    lang: "EN",
    href: "https://www.linkedin.com/pulse/15-repeat-sales-without-single-new-customer-jasur-akhmadaliev-ir9me",
  },
  {
    title: "Почему умные команды продолжают запускать обречённые проекты (и как это остановить)",
    platform: "LinkedIn",
    lang: "EN",
    href: "https://www.linkedin.com/pulse/why-smart-teams-still-launch-doomed-projects-how-stop-akhmadaliev-ss0ge/",
  },
  {
    title: "AI-стек для PM, который реально работает (и почему 95% команд его не используют)",
    platform: "Medium",
    lang: "EN",
    href: "https://medium.com/@jasurakhmadaliev283/the-pm-ai-stack-that-actually-works-and-why-95-of-teams-miss-it-9fb5e3b46c4f",
  },
  {
    title: "Приём NASA, который продакты почти никогда не используют",
    platform: "Medium",
    lang: "EN",
    href: "https://medium.com/@jasurakhmadaliev283/the-nasa-trick-product-managers-almost-never-use-67156efea126",
  },
  {
    title: "Клиенты, которые у вас уже есть — это те, кого вы теряете",
    platform: "Medium",
    lang: "EN",
    href: "https://medium.com/@jasurakhmadaliev283/the-customers-you-already-have-are-the-ones-you-are-losing-c69461b648f8",
  },
  {
    title: "Лучшие мысли появляются до того, как вы начинаете писать",
    platform: "Medium",
    lang: "EN",
    href: "https://medium.com/@jasurakhmadaliev283/your-best-thinking-happens-before-you-start-writing-0eb0f35df9c7",
  },
  {
    title: "Fable 5 за 36 часов: запуск, скандал, запрет. Что это значит для бизнеса на AI",
    platform: "VC.ru",
    lang: "RU",
    href: "https://vc.ru/id5991727/2977300-fable-5-zapusk-skandal-posledstviya-dlya-biznesa-na-ai",
  },
];

export type Channel = {
  name: string;
  description: string;
  href: string;
};

export const CHANNELS: Channel[] = [
  {
    name: "Telegram @head_of_ceo",
    description: "Главный канал. AI-инструменты, продуктовое мышление, дневник поиска работы.",
    href: "https://t.me/head_of_ceo",
  },
  {
    name: "Medium",
    description: "Длинные статьи о продукте и AI на английском.",
    href: "https://medium.com/@jasurakhmadaliev283",
  },
  {
    name: "LinkedIn",
    description: "Профессиональный контент на английском. PM-кейсы и AI-обновления.",
    href: "https://www.linkedin.com/in/jasur-akhmadaliev",
  },
  {
    name: "VC.ru",
    description: "Бизнес-кейсы и продуктовое мышление на русском.",
    href: "https://vc.ru/id5991727",
  },
  {
    name: "Habr",
    description: "Глубокие технические и продуктовые статьи на русском.",
    href: "https://habr.com/ru/users/Akhmadaliev/",
  },
  {
    name: "X",
    description: "Короткий контент на английском.",
    href: "https://x.com/Jasur1651Jasur",
  },
];
