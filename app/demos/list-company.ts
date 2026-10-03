import type { Demo } from "./list";

/* Раздел каталога «Для компаний»: четыре демо для среднего бизнеса.

   Отдельный файл, а не ещё один список в list.ts, чтобы список компаний
   можно было править, не задевая список бизнес-демо. Устроен так же: без
   "use client", потому что названия и описания нужны серверу для заголовка
   вкладки и описания страницы (page.tsx каждого демо) и карте сайта.

   У каждого демо два кадра: с русским интерфейсом (shot) и с английским
   (shotEn), сняты одинаково, окно 1600 × 1000, кадр от линейки над
   интерфейсом, файл 1200 × 750. */

/* Английский кадр здесь обязателен: в list.ts поле необязательное, а у
   новых демо он снят сразу. */
export type CompanyDemo = Demo & { shotEn: string };

export const companyDemos: CompanyDemo[] = [
  {
    href: "/demos/office",
    shot: "/new/demos/office.jpg",
    shotEn: "/new/demos/office-en.jpg",
    name: { en: "Inbound request triage", ru: "Разбор входящих заявок" },
    desc: {
      en: "AI sorts the shared inbox by department, sets urgency, and drafts a reply. Department queues with SLA timers and a counter of hours saved.",
      ru: "ИИ разбирает общий ящик компании по отделам, ставит срочность и готовит черновик ответа. Очереди с таймерами SLA и счётчик сэкономленных часов.",
    },
    tags: { en: ["Email", "SLA", "AI"], ru: ["Почта", "SLA", "AI"] },
    live: true,
  },
  {
    href: "/demos/stroyka",
    shot: "/new/demos/stroyka.jpg",
    shotEn: "/new/demos/stroyka-en.jpg",
    name: { en: "Site reports and budget control", ru: "Отчёт прораба и контроль сметы" },
    desc: {
      en: "The foreman sends voice notes and photos. AI builds the daily report, checks work against the schedule and purchases against the estimate, and flags deviations.",
      ru: "Прораб шлёт голосовые и фото с объекта. ИИ собирает отчёт дня, сверяет работы с графиком и закупки со сметой и показывает отклонения.",
    },
    tags: { en: ["Telegram", "Estimate", "AI"], ru: ["Telegram", "Смета", "AI"] },
    live: true,
  },
  {
    href: "/demos/edtech",
    shot: "/new/demos/edtech.jpg",
    shotEn: "/new/demos/edtech-en.jpg",
    name: { en: "Homework review and churn risk", ru: "Проверка ДЗ и риск оттока" },
    desc: {
      en: "AI grades homework against the course rubric and comments on it. From activity data it flags students likely to quit and suggests what to write to them.",
      ru: "ИИ проверяет домашние задания по критериям курса и пишет комментарии. По активности находит учеников, которые могут бросить, и подсказывает, что им написать.",
    },
    tags: { en: ["Online school", "Rubric", "AI"], ru: ["Онлайн-школа", "Критерии", "AI"] },
    live: true,
  },
  {
    href: "/demos/pipeline",
    shot: "/new/demos/pipeline.jpg",
    shotEn: "/new/demos/pipeline-en.jpg",
    name: { en: "From request to quote in two minutes", ru: "От заявки до КП за две минуты" },
    desc: {
      en: "A chain of five agents parses the request, prices it, checks stock and lead times, builds the quote, and opens a CRM deal. Every step is visible in the log.",
      ru: "Цепочка из пяти агентов разбирает заявку, считает по прайсу, проверяет склад и сроки, собирает КП и заводит сделку в CRM. Каждый шаг виден в журнале.",
    },
    tags: { en: ["Agents", "CRM", "AI"], ru: ["Агенты", "CRM", "AI"] },
    live: true,
  },
];

/* Заголовок вкладки и описание страницы демо из этого раздела. Та же
   функция, что demoMetaText в list.ts, только по своему списку. */
export function companyMetaText(href: string): { name: string; desc: string } {
  const d = companyDemos.find((x) => x.href === href);
  if (!d) throw new Error(`Демо ${href} нет в разделе «Для компаний»`);
  return { name: d.name.ru, desc: d.desc.ru };
}
