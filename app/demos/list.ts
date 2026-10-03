/* Список демо каталога: названия, описания, метки, адреса, скриншоты.

   Вынесен из Catalog.tsx в отдельный файл без "use client", потому что те же
   названия и описания нужны серверу: из них собираются заголовок вкладки и
   описание для поисковиков и мессенджеров на страницах /demos/[демо].
   Из клиентского модуля сервер строки прочитать не может, а переписывать их
   второй раз руками значило бы завести два расходящихся списка.

   Тексты перенесены без изменений (см. историю Catalog.tsx). */

export type Demo = {
  href: string;
  /* Кадр демо с русским интерфейсом. */
  shot: string;
  /* Тот же кадр с английским интерфейсом: то же окно, тот же сценарий,
     только язык сайта английский. Без него английский каталог и английский
     PDF показывают русский кадр, поэтому поле необязательное: демо, для
     которого английского кадра ещё нет, просто останется с русским, а не с
     серой заглушкой. Выбор делает demoShot ниже. */
  shotEn?: string;
  name: { en: string; ru: string };
  desc: { en: string; ru: string };
  /* Метки тоже на двух языках: на старой странице они оставались русскими
     и в английском каталоге («Кассы», «Алерты», «СБП»). */
  tags: { en: string[]; ru: string[] };
  live: boolean;
};

export const productDemos: Demo[] = [
  {
    href: "/demos/mia",
    shot: "/new/demos/mia.jpg",
    shotEn: "/new/demos/mia-en.jpg",
    name: { en: "Mia, a clinic RAG assistant", ru: "Mia, RAG-ассистент клиники" },
    desc: {
      en: "An assistant that answers patients only from the clinic's documents. Step-by-step walkthrough plus the live assistant right on the page.",
      ru: "Ассистент, который отвечает пациентам только по документам клиники. Пошаговый разбор плюс живой ассистент прямо на странице.",
    },
    tags: {
      en: ["RAG", "Groq", "does not make things up"],
      ru: ["RAG", "Groq", "не выдумывает"],
    },
    live: true,
  },
  {
    href: "/demos/career",
    shot: "/new/demos/career.jpg",
    shotEn: "/new/demos/career-en.jpg",
    name: { en: "AI Career System", ru: "AI Career System" },
    desc: {
      en: "My own job search automation: vacancy link in, tailored cover letter out in ~80 seconds. Watch a real run step by step.",
      ru: "Автоматизация моего собственного поиска работы: на входе ссылка на вакансию, на выходе письмо за ~80 секунд. Прогон по шагам.",
    },
    tags: { en: ["Claude", "n8n", "Telegram"], ru: ["Claude", "n8n", "Telegram"] },
    live: false,
  },
];

export const demos: Demo[] = [
  {
    href: "/demos/preorder",
    shot: "/new/demos/preorder.jpg",
    shotEn: "/new/demos/preorder-en.jpg",
    name: { en: "Pre-order from the stands", ru: "Предзаказ с трибуны" },
    desc: {
      en: "A fan scans a QR on the seat, pays via SBP without getting up, and picks the order up at a separate window. The stand serves ~30% more checks per break.",
      ru: "Болельщик сканирует QR на кресле, платит через СБП не вставая с места и забирает заказ в отдельном окне. Точка пропускает на ~30% больше чеков за перерыв.",
    },
    tags: { en: ["Telegram WebApp", "SBP", "QR"], ru: ["Telegram WebApp", "СБП", "QR"] },
    live: false,
  },
  {
    href: "/demos/leftovers",
    shot: "/new/demos/leftovers.jpg",
    shotEn: "/new/demos/leftovers-en.jpg",
    name: { en: "Evening leftovers sold by AI", ru: "Слив вечерних остатков через ИИ" },
    desc: {
      en: "At 7:30 pm AI looks at the counter, writes a push, and sends it to loyal customers nearby. Write-offs go to zero.",
      ru: "В 19:30 ИИ смотрит на витрину, пишет пуш и отправляет его лояльным клиентам рядом. Списания уходят в ноль.",
    },
    tags: { en: ["iiko", "AI", "Push"], ru: ["iiko", "AI", "Push"] },
    live: true,
  },
  {
    href: "/demos/fraud",
    shot: "/new/demos/fraud.jpg",
    shotEn: "/new/demos/fraud-en.jpg",
    name: { en: "POS fraud control", ru: "Фрод-контроль касс" },
    desc: {
      en: "Check voids, deleted items, and suspicious discounts trigger an instant Telegram alert to the owner: who, where, how much.",
      ru: "Отмены чеков, удаления позиций и подозрительные скидки мгновенно летят алертом владельцу в Telegram: кто, где и на сколько.",
    },
    tags: { en: ["POS", "Telegram", "Alerts"], ru: ["Кассы", "Telegram", "Алерты"] },
    live: false,
  },
  {
    href: "/demos/reviews",
    shot: "/new/demos/reviews.jpg",
    shotEn: "/new/demos/reviews-en.jpg",
    name: { en: "AI replies to reviews", ru: "ИИ-автоответы на отзывы" },
    desc: {
      en: "AI drafts replies to Yandex Maps and 2GIS reviews in the venue's tone. The manager only approves.",
      ru: "ИИ готовит ответы на отзывы в Яндекс Картах и 2ГИС в тоне заведения. Менеджер только утверждает.",
    },
    tags: { en: ["Yandex", "2GIS", "AI"], ru: ["Яндекс", "2ГИС", "AI"] },
    live: true,
  },
];

/* Кадр демо на языке страницы: английский, если он есть, иначе русский.
   Одна функция на каталог (Catalog.tsx) и PDF «Услуги» (uslugi/[lang]),
   чтобы правило выбора не расходилось. */
export function demoShot(d: Demo, lang: "en" | "ru"): string {
  return lang === "en" && d.shotEn ? d.shotEn : d.shot;
}

/* Заголовок вкладки и описание страницы демо: название и описание из
   каталога. Их читает сервер (page.tsx каждого демо), поэтому функция живёт
   здесь, а не в клиентском Catalog.tsx. */
export function demoMetaText(href: string): { name: string; desc: string } {
  const d = [...demos, ...productDemos].find((x) => x.href === href);
  if (!d) throw new Error(`Демо ${href} нет в каталоге`);
  return { name: d.name.ru, desc: d.desc.ru };
}
