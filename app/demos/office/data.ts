/* Данные демо «Разбор входящих заявок»: компания, отделы, письма.

   Файл без "use client": его читает и само демо (OfficeDemo.tsx), и сервер
   (lib/demo-company.ts), когда пишет черновик ответа. Браузер присылает
   только номер письма, текст письма сервер берёт отсюда. Так модели нельзя
   подсунуть чужой текст под видом письма из демо.

   Компания вымышленная. Всё, что ИИ «решил» про письма из демо (отдел,
   срочность, метки, причина, извлечённые поля), прописано здесь заранее:
   это симуляция разбора. Живой ИИ в демо пишет черновики ответов и
   разбирает письмо, которое человек вставил сам. */

type L = { en: string; ru: string };

export type Dept = "sales" | "service" | "accounting" | "procurement" | "hr" | "spam";
export type Urgency = "high" | "medium" | "low";

export const OFFICE_COMPANY: L = { en: "NordTerm", ru: "«НордТерм»" };
export const OFFICE_COMPANY_ABOUT: L = {
  en: "a manufacturer and supplier of heating equipment",
  ru: "производство и поставка отопительного оборудования",
};
export const OFFICE_INBOX = "info@nordterm.ru";

/* Отделы и норма ответа (SLA) в минутах. Реклама не очередь, она уходит
   в архив, поэтому SLA у неё нет. */
export const DEPTS: Record<Dept, { name: L; sla: number; sign: L }> = {
  sales: {
    name: { en: "Sales", ru: "Продажи" },
    sla: 60,
    sign: { en: "NordTerm Sales", ru: "Отдел продаж «НордТерм»" },
  },
  service: {
    name: { en: "Service & claims", ru: "Сервис и претензии" },
    sla: 120,
    sign: { en: "NordTerm Service", ru: "Сервисная служба «НордТерм»" },
  },
  accounting: {
    name: { en: "Accounting", ru: "Бухгалтерия" },
    sla: 240,
    sign: { en: "NordTerm Accounting", ru: "Бухгалтерия «НордТерм»" },
  },
  procurement: {
    name: { en: "Procurement", ru: "Снабжение" },
    sla: 240,
    sign: { en: "NordTerm Procurement", ru: "Отдел снабжения «НордТерм»" },
  },
  hr: {
    name: { en: "HR", ru: "HR" },
    sla: 1440,
    sign: { en: "NordTerm HR", ru: "HR «НордТерм»" },
  },
  spam: {
    name: { en: "Promo", ru: "Реклама" },
    sla: 0,
    sign: { en: "NordTerm", ru: "«НордТерм»" },
  },
};

export const QUEUE_ORDER: Dept[] = ["sales", "service", "accounting", "procurement", "hr"];

export type Email = {
  id: string;
  from: L;
  org: L;
  address: string;
  subject: L;
  body: L;
  dept: Dept;
  urgency: Urgency;
  tags: { en: string[]; ru: string[] };
  reason: L;
  fields: { k: L; v: L }[];
  /* Только у писем, которые уже лежали в ящике к началу демо: сколько
     минут назад пришло и ответили ли на него. */
  agoMin?: number;
  answeredMin?: number;
};

export const EMAILS: Email[] = [
  /* ---- уже разобраны к началу демо ---- */
  {
    id: "e1",
    from: { en: "Marina Belova", ru: "Марина Белова" },
    org: { en: "TeploService Group LLC", ru: "ООО «ТеплоСервис Групп»" },
    address: "m.belova@teploservice-group.ru",
    subject: { en: "NT-18 boilers in stock in Kazan?", ru: "Наличие котлов НТ-18 на складе в Казани" },
    body: {
      en: "Hello! Do you have 12 NT-18 boilers at the Kazan warehouse? We need them shipped next week.",
      ru: "Здравствуйте! Есть ли на складе в Казани котлы НТ-18, 12 штук? Нужна отгрузка на следующей неделе.",
    },
    dept: "sales",
    urgency: "medium",
    tags: { en: ["stock", "regular client"], ru: ["наличие", "постоянный клиент"] },
    reason: {
      en: "A stock and shipping question: sales. Regular client, shipping next week, so medium urgency.",
      ru: "Вопрос о наличии и отгрузке: продажи. Постоянный клиент, отгрузка на следующей неделе, поэтому средняя срочность.",
    },
    fields: [
      { k: { en: "Product", ru: "Товар" }, v: { en: "NT-18 boiler · 12 pcs", ru: "котёл НТ-18 · 12 шт." } },
      { k: { en: "Warehouse", ru: "Склад" }, v: { en: "Kazan", ru: "Казань" } },
      { k: { en: "Deadline", ru: "Срок" }, v: { en: "next week", ru: "следующая неделя" } },
    ],
    agoMin: 41,
    answeredMin: 7,
  },
  {
    id: "e2",
    from: { en: "Anna Litvinova", ru: "Анна Литвинова" },
    org: { en: "Candidate", ru: "Кандидат" },
    address: "anna.litvinova@mail.ru",
    subject: { en: "CV: service engineer", ru: "Резюме: инженер сервисной службы" },
    body: {
      en: "Hello! I saw your service engineer opening on hh.ru. I have 4 years of experience servicing gas boilers and a gas safety permit. My CV is attached.",
      ru: "Добрый день! Увидела вакансию инженера сервиса на hh.ru. Опыт 4 года в сервисе газовых котлов, есть допуск по газу. Резюме во вложении.",
    },
    dept: "hr",
    urgency: "low",
    tags: { en: ["opening", "CV"], ru: ["вакансия", "резюме"] },
    reason: {
      en: "A job application with a CV: HR. The department's reply standard is 24 hours.",
      ru: "Отклик на вакансию с резюме: HR. Норма ответа отдела 24 часа.",
    },
    fields: [
      { k: { en: "Opening", ru: "Вакансия" }, v: { en: "service engineer", ru: "инженер сервиса" } },
      { k: { en: "Experience", ru: "Опыт" }, v: { en: "4 years", ru: "4 года" } },
      { k: { en: "Attachment", ru: "Вложение" }, v: { en: "cv.pdf", ru: "резюме.pdf" } },
    ],
    agoMin: 52,
  },
  {
    id: "e3",
    from: { en: "Elena Grishina", ru: "Елена Гришина" },
    org: { en: "TeploDom LLC, accounting", ru: "ООО «ТеплоДом», бухгалтерия" },
    address: "buh@teplodom-msk.ru",
    subject: { en: "Q3 reconciliation: 18,400 ₽ mismatch", ru: "Акт сверки за III квартал: расхождение 18 400 ₽" },
    body: {
      en: "Good afternoon. Please find the July to September reconciliation attached. By our records there is an 18,400 ₽ mismatch: we do not see payment order No. 1187 of September 12 on your side. Please check.",
      ru: "Добрый день. Направляем акт сверки за июль-сентябрь. По нашим данным расхождение 18 400 ₽: не видим у вас оплату по платёжному поручению № 1187 от 12.09. Просим проверить.",
    },
    dept: "accounting",
    urgency: "medium",
    tags: { en: ["reconciliation", "mismatch"], ru: ["акт сверки", "расхождение"] },
    reason: {
      en: "Account reconciliation with a mismatch amount: accounting. Nothing is blocked, so medium urgency.",
      ru: "Сверка взаиморасчётов с суммой расхождения: бухгалтерия. Ничего не блокирует, поэтому средняя срочность.",
    },
    fields: [
      { k: { en: "Counterparty", ru: "Контрагент" }, v: { en: "TeploDom LLC", ru: "ООО «ТеплоДом»" } },
      { k: { en: "Period", ru: "Период" }, v: { en: "Q3", ru: "III квартал" } },
      { k: { en: "Mismatch", ru: "Расхождение" }, v: { en: "18,400 ₽", ru: "18 400 ₽" } },
    ],
    agoMin: 26,
  },

  /* ---- приходят потоком ---- */
  {
    id: "s1",
    from: { en: "Dmitry Kozlov", ru: "Дмитрий Козлов" },
    org: { en: "StroyMontazh LLC", ru: "ООО «СтройМонтаж»" },
    address: "d.kozlov@stroymontazh.ru",
    subject: { en: "Quote request: 40 NT-24 boilers by November 15", ru: "Запрос КП: 40 котлов НТ-24 до 15 ноября" },
    body: {
      en: "Good afternoon. We are fitting out a residential complex in Podolsk and need 40 NT-24 wall-mounted boilers delivered to the site by November 15. Please send a quote and payment terms. If we get it by Thursday, we are ready to sign this week.",
      ru: "Добрый день. Комплектуем жилой комплекс в Подольске, нужно 40 настенных котлов НТ-24 с доставкой на объект до 15 ноября. Пришлите коммерческое предложение и условия оплаты. Если получим до четверга, готовы подписать на этой неделе.",
    },
    dept: "sales",
    urgency: "high",
    tags: { en: ["new client", "quote"], ru: ["новый клиент", "КП"] },
    reason: {
      en: "A price request for 40 boilers with a delivery date: sales. The client is ready to sign this week, so high urgency.",
      ru: "Запрос цены на 40 котлов с датой поставки: продажи. Клиент готов подписать на этой неделе, поэтому срочно.",
    },
    fields: [
      { k: { en: "Product", ru: "Товар" }, v: { en: "NT-24 boiler · 40 pcs", ru: "котёл НТ-24 · 40 шт." } },
      { k: { en: "Deadline", ru: "Срок" }, v: { en: "by November 15", ru: "до 15 ноября" } },
      { k: { en: "Site", ru: "Объект" }, v: { en: "residential complex, Podolsk", ru: "ЖК в Подольске" } },
    ],
  },
  {
    id: "s2",
    from: { en: "Oleg Rumyantsev", ru: "Олег Румянцев" },
    org: { en: "Private customer", ru: "Частный клиент" },
    address: "o.rumyantsev@yandex.ru",
    subject: { en: "Boiler won't start after repair, third day without heating", ru: "Котёл не включается после ремонта, третий день без отопления" },
    body: {
      en: "Your technician came on Monday and replaced the control board. Since then the boiler shows error E05 and won't start. We have two small children at home and have been using a space heater for three days. Please send a technician urgently.",
      ru: "Ваш мастер приезжал в понедельник, менял плату. С тех пор котёл выдаёт ошибку E05 и не запускается. В доме двое маленьких детей, третий день греемся обогревателем. Прошу срочно прислать мастера.",
    },
    dept: "service",
    urgency: "high",
    tags: { en: ["complaint", "warranty", "repeat visit"], ru: ["жалоба", "гарантия", "повторный выезд"] },
    reason: {
      en: "A fault after repair and a family without heating: service. High urgency and a risk of a public review.",
      ru: "Неисправность после ремонта, семья без отопления: сервис. Высокая срочность и риск публичного отзыва.",
    },
    fields: [
      { k: { en: "Model", ru: "Модель" }, v: { en: "NT-18 boiler", ru: "котёл НТ-18" } },
      { k: { en: "Error", ru: "Ошибка" }, v: { en: "E05", ru: "E05" } },
      { k: { en: "Last repair", ru: "Ремонт" }, v: { en: "Monday, board replaced", ru: "понедельник, замена платы" } },
    ],
  },
  {
    id: "s3",
    from: { en: "Shipping department", ru: "Отдел отгрузки" },
    org: { en: "MetallProm", ru: "«МеталлПром»" },
    address: "otgruzka@metallprom.ru",
    subject: { en: "Heat exchanger batch delayed by 6 days", ru: "Задержка партии теплообменников на 6 дней" },
    body: {
      en: "Please note that the batch of TO-18 heat exchangers under order No. 2291 is delayed. The new shipping date is October 14 instead of October 8. Please confirm by the end of the day whether you keep the order.",
      ru: "Сообщаем, что партия теплообменников ТО-18 по заказу № 2291 задерживается. Новая дата отгрузки 14 октября вместо 8 октября. Просим до конца дня подтвердить, сохраняете ли заказ.",
    },
    dept: "procurement",
    urgency: "high",
    tags: { en: ["supplier", "delay"], ru: ["поставщик", "срыв сроков"] },
    reason: {
      en: "A supplier is moving a parts shipment and wants an answer today: procurement, high urgency.",
      ru: "Поставщик сдвигает отгрузку комплектующих и ждёт ответа сегодня: снабжение, срочно.",
    },
    fields: [
      { k: { en: "Order", ru: "Заказ" }, v: { en: "No. 2291", ru: "№ 2291" } },
      { k: { en: "Item", ru: "Позиция" }, v: { en: "TO-18 heat exchanger", ru: "теплообменник ТО-18" } },
      { k: { en: "New date", ru: "Новая дата" }, v: { en: "Oct 14 (was Oct 8)", ru: "14 октября (было 8)" } },
    ],
  },
  {
    id: "s4",
    from: { en: "Biznes-Rost", ru: "«Бизнес-Рост»" },
    org: { en: "Newsletter", ru: "Рассылка" },
    address: "news@biznes-rost.info",
    subject: { en: "Webinar: triple your sales in 30 days", ru: "Вебинар: как утроить продажи за 30 дней" },
    body: {
      en: "Today only: a free webinar for business owners. Grab your seat!",
      ru: "Только сегодня бесплатный вебинар для собственников бизнеса. Успейте занять место!",
    },
    dept: "spam",
    urgency: "low",
    tags: { en: ["newsletter"], ru: ["рассылка"] },
    reason: {
      en: "A mass promotional mailing nobody asked for: archived, no reply needed.",
      ru: "Массовая рекламная рассылка без запроса: в архив, ответ не нужен.",
    },
    fields: [
      { k: { en: "Type", ru: "Тип" }, v: { en: "newsletter", ru: "рассылка" } },
      { k: { en: "Action", ru: "Действие" }, v: { en: "archive", ru: "архив" } },
    ],
  },
  {
    id: "s5",
    from: { en: "Igor Safronov", ru: "Игорь Сафронов" },
    org: { en: "Sole trader", ru: "ИП" },
    address: "safronov.ip@gmail.com",
    subject: { en: "Invoice for contract 54/24 never arrived", ru: "Не пришёл счёт по договору 54/24" },
    body: {
      en: "Hello. I agreed with your manager on 6 radiators, but the invoice never came. Please send it today, I want to pay before the end of the week.",
      ru: "Здравствуйте. Договорились с вашим менеджером о поставке 6 радиаторов, но счёт так и не пришёл. Пришлите, пожалуйста, сегодня, хочу оплатить до конца недели.",
    },
    dept: "accounting",
    urgency: "medium",
    tags: { en: ["invoice", "payment"], ru: ["счёт", "оплата"] },
    reason: {
      en: "The client is waiting for an invoice and ready to pay: accounting. Medium urgency, the money comes sooner if you reply today.",
      ru: "Клиент ждёт счёт и готов платить: бухгалтерия. Средняя срочность, деньги придут быстрее, если ответить сегодня.",
    },
    fields: [
      { k: { en: "Contract", ru: "Договор" }, v: { en: "54/24", ru: "54/24" } },
      { k: { en: "Product", ru: "Товар" }, v: { en: "radiator · 6 pcs", ru: "радиатор · 6 шт." } },
      { k: { en: "Payment", ru: "Оплата" }, v: { en: "by end of week", ru: "до конца недели" } },
    ],
  },
  {
    id: "s6",
    from: { en: "Tender department", ru: "Тендерный отдел" },
    org: { en: "Alfa Development LLC", ru: "ООО «Альфа Девелопмент»" },
    address: "tender@alfa-dev.ru",
    subject: { en: "Tender invitation: boiler equipment, bids until October 20", ru: "Приглашение к тендеру: котельное оборудование, заявки до 20 октября" },
    body: {
      en: "We invite you to bid on boiler equipment for two residential buildings. The specification is attached. Bids are accepted until October 20.",
      ru: "Приглашаем принять участие в закупке котельного оборудования для двух жилых домов. Техническое задание во вложении. Заявки принимаем до 20 октября.",
    },
    dept: "sales",
    urgency: "medium",
    tags: { en: ["tender", "spec attached"], ru: ["тендер", "ТЗ во вложении"] },
    reason: {
      en: "A procurement invitation with a bid deadline: sales. The deadline is more than two weeks away, so medium urgency.",
      ru: "Приглашение к закупке со сроком подачи: продажи. До срока больше двух недель, поэтому средняя срочность.",
    },
    fields: [
      { k: { en: "Scope", ru: "Объект" }, v: { en: "2 residential buildings", ru: "2 жилых дома" } },
      { k: { en: "Bids until", ru: "Подача" }, v: { en: "October 20", ru: "до 20 октября" } },
      { k: { en: "Attachment", ru: "Вложение" }, v: { en: "spec.pdf", ru: "ТЗ.pdf" } },
    ],
  },
  {
    id: "s7",
    from: { en: "Igor Tarasov", ru: "Игорь Тарасов" },
    org: { en: "Candidate", ru: "Кандидат" },
    address: "i.tarasov.sales@gmail.com",
    subject: { en: "Application: sales manager", ru: "Отклик на вакансию менеджера по продажам" },
    body: {
      en: "Good afternoon! I have sold engineering equipment to developers for five years and have my own client base in the Moscow region. I can start in two weeks.",
      ru: "Добрый день! Пять лет продаю инженерное оборудование застройщикам, своя база клиентов в Московской области. Готов выйти через две недели.",
    },
    dept: "hr",
    urgency: "low",
    tags: { en: ["opening", "sales", "strong fit"], ru: ["вакансия", "продажи", "сильный кандидат"] },
    reason: {
      en: "A candidate application: HR. Relevant experience, so AI marked him as a strong fit.",
      ru: "Отклик кандидата: HR. Профильный опыт, поэтому ИИ отметил его как сильного кандидата.",
    },
    fields: [
      { k: { en: "Opening", ru: "Вакансия" }, v: { en: "sales manager", ru: "менеджер по продажам" } },
      { k: { en: "Experience", ru: "Опыт" }, v: { en: "5 years", ru: "5 лет" } },
      { k: { en: "Start", ru: "Выход" }, v: { en: "in 2 weeks", ru: "через 2 недели" } },
    ],
  },
  {
    id: "s8",
    from: { en: "Natalya Eremina", ru: "Наталья Ерёмина" },
    org: { en: "Komfort Service LLC", ru: "ООО «Комфорт Сервис»" },
    address: "n.eremina@komfort-service.ru",
    subject: { en: "Warranty replacement for three pumps", ru: "Замена трёх насосов по гарантии" },
    body: {
      en: "In the September 2 batch, three NTs-25 circulation pumps are noisy and overheat. The inspection report and photos are attached. Please approve a warranty replacement.",
      ru: "В партии от 2 сентября три циркуляционных насоса НЦ-25 шумят и перегреваются. Акт осмотра и фото прикладываем. Просим согласовать замену по гарантии.",
    },
    dept: "service",
    urgency: "medium",
    tags: { en: ["warranty", "defect"], ru: ["гарантия", "брак"] },
    reason: {
      en: "A warranty claim with a report and photos: service. The client is not left without equipment, so medium urgency.",
      ru: "Гарантийная претензия с актом и фото: сервис. Клиент не стоит без оборудования, поэтому средняя срочность.",
    },
    fields: [
      { k: { en: "Item", ru: "Позиция" }, v: { en: "NTs-25 pump · 3 pcs", ru: "насос НЦ-25 · 3 шт." } },
      { k: { en: "Batch", ru: "Партия" }, v: { en: "September 2", ru: "от 2 сентября" } },
      { k: { en: "Documents", ru: "Документы" }, v: { en: "report, photos", ru: "акт, фото" } },
    ],
  },
  {
    id: "s9",
    from: { en: "Sales department", ru: "Отдел продаж" },
    org: { en: "Polimer-Trade", ru: "«Полимер-Трейд»" },
    address: "sales@polimer-trade.ru",
    subject: { en: "New prices from November 1: fittings up 7%", ru: "Новый прайс с 1 ноября: фитинги дороже на 7%" },
    body: {
      en: "Please note the price change from November 1: PPR fittings go up by 7%. Until October 31 we ship at the old prices.",
      ru: "Уведомляем об изменении цен с 1 ноября: фитинги PPR дорожают на 7%. До 31 октября отгружаем по старым ценам.",
    },
    dept: "procurement",
    urgency: "medium",
    tags: { en: ["supplier", "prices"], ru: ["поставщик", "цены"] },
    reason: {
      en: "A supplier price increase with a window to buy at the old price: procurement, medium urgency.",
      ru: "Поставщик поднимает цены, есть окно закупки по старой цене: снабжение, средняя срочность.",
    },
    fields: [
      { k: { en: "Item", ru: "Позиция" }, v: { en: "PPR fittings", ru: "фитинги PPR" } },
      { k: { en: "Change", ru: "Изменение" }, v: { en: "+7% from Nov 1", ru: "+7% с 1 ноября" } },
      { k: { en: "Window", ru: "Окно" }, v: { en: "until Oct 31", ru: "до 31 октября" } },
    ],
  },
];

export function findEmail(id: unknown): Email | undefined {
  return typeof id === "string" ? EMAILS.find((e) => e.id === id) : undefined;
}
