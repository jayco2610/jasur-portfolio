/* Данные демо «Заявка в КП за две минуты»: компания, три заявки и то, что
   выдаёт каждый из пяти агентов по каждой заявке.

   Файл без "use client": его читает и демо (PipelineDemo.tsx), и сервер
   (lib/demo-company.ts), когда пишет текст КП. Браузер присылает только
   номер заявки, расчёт и сроки сервер берёт отсюда.

   Компания и клиенты вымышленные. Разбор, расчёт, остатки и сделка в CRM
   прописаны заранее (суммы считаются ниже из количества и цены, руками не
   пишутся): это симуляция. Живой ИИ пишет вступительный абзац КП. Время
   шагов в секундах симулированное: так агенты отработали бы с настоящими
   прайсом, складом и CRM. */

type L = { en: string; ru: string };

export const VENDOR = {
  name: { en: "Grani", ru: "«Грани»" } as L,
  about: { en: "tiles and flooring, supply and installation", ru: "плитка и напольные покрытия, поставка и укладка" } as L,
  manager: { en: "Pavel Nesterov", ru: "Павел Нестеров" } as L,
};

export type Item = { name: L; qty: number; unit: L; price: number; work?: boolean };

export type Req = {
  id: string;
  channel: L;
  client: L;
  contact: L;
  short: L;
  text: L;
  parsed: { k: L; v: L }[];
  items: Item[];
  /* Скидка на материалы в процентах, если есть. */
  discount?: number;
  stock: { tone: "ok" | "warn"; text: L }[];
  timeline: L;
  kpNo: string;
  deal: { id: string; name: L; task: L };
  /* Симулированное время пяти шагов, секунды. */
  sec: [number, number, number, number, number];
  /* Аргументы вызова инструментов в журнале. */
  sku: string;
};

const M2: L = { en: "m²", ru: "м²" };

export const REQUESTS: Req[] = [
  {
    id: "r1",
    channel: { en: "Email", ru: "Почта" },
    client: { en: "Vector Development LLC", ru: "ООО «Вектор Девелопмент»" },
    contact: { en: "Irina Sokolova", ru: "Ирина Соколова" },
    short: { en: "300 m² porcelain tile, laid by Nov 20", ru: "300 м² керамогранита с укладкой до 20 ноября" },
    text: {
      en: "Good afternoon! We need 300 m² of 60×60 porcelain tile, grey matte, laid in an office on Nagatinskaya Street. The work must be finished by November 20. Please send a quote. Irina Sokolova, Vector Development LLC",
      ru: "Добрый день! Нужно 300 м² керамогранита 60×60, серый матовый, с укладкой в офисе на Нагатинской. Работы закончить до 20 ноября. Пришлите, пожалуйста, КП. Ирина Соколова, ООО «Вектор Девелопмент»",
    },
    parsed: [
      { k: { en: "Client", ru: "Клиент" }, v: { en: "Vector Development LLC, Irina Sokolova", ru: "ООО «Вектор Девелопмент», Ирина Соколова" } },
      { k: { en: "Product", ru: "Товар" }, v: { en: "porcelain tile 60×60, grey matte", ru: "керамогранит 60×60, серый матовый" } },
      { k: { en: "Volume", ru: "Объём" }, v: { en: "300 m²", ru: "300 м²" } },
      { k: { en: "Service", ru: "Услуга" }, v: { en: "installation", ru: "укладка" } },
      { k: { en: "Address", ru: "Адрес" }, v: { en: "Moscow, Nagatinskaya St., office", ru: "Москва, Нагатинская ул., офис" } },
      { k: { en: "Deadline", ru: "Срок" }, v: { en: "by November 20", ru: "до 20 ноября" } },
    ],
    items: [
      { name: { en: "Porcelain tile 60×60 «Grey Matte» (300 m² + 8% for cuts)", ru: "Керамогранит 60×60 «Грей Мат» (300 м² + 8% на подрезку)" }, qty: 324, unit: M2, price: 1290 },
      { name: { en: "Tile adhesive C2, 25 kg", ru: "Клей плиточный C2, 25 кг" }, qty: 108, unit: { en: "bags", ru: "меш." }, price: 690 },
      { name: { en: "Cement grout", ru: "Затирка цементная" }, qty: 60, unit: { en: "kg", ru: "кг" }, price: 310 },
      { name: { en: "Priming and base preparation", ru: "Грунтовка и подготовка основания" }, qty: 300, unit: M2, price: 120, work: true },
      { name: { en: "Installing 60×60 porcelain tile", ru: "Укладка керамогранита 60×60" }, qty: 300, unit: M2, price: 1150, work: true },
      { name: { en: "Delivery and lifting to the floor", ru: "Доставка и подъём на этаж" }, qty: 1, unit: { en: "trip", ru: "рейс" }, price: 18500, work: true },
    ],
    discount: 5,
    stock: [
      { tone: "ok", text: { en: "Moscow warehouse: 260 m² of «Grey Matte» in stock", ru: "Склад Москва: 260 м² «Грей Мат» в наличии" } },
      { tone: "ok", text: { en: "Supplier: 64 m² to order, 5 working days", ru: "Поставщик: 64 м² под заказ, 5 рабочих дней" } },
      { tone: "ok", text: { en: "Installation crew: free from November 2, 9 working days", ru: "Бригада укладки: свободна со 2 ноября, 9 рабочих дней" } },
      { tone: "ok", text: { en: "Done by November 13, 7 days ahead of the client's deadline", ru: "Готово 13 ноября, запас 7 дней до срока клиента" } },
    ],
    timeline: {
      en: "supply and installation from November 2 to 13, ahead of the November 20 deadline",
      ru: "поставка и укладка со 2 по 13 ноября, раньше срока 20 ноября",
    },
    kpNo: "2026-1147",
    deal: {
      id: "48213",
      name: { en: "Vector Development · porcelain tile 300 m²", ru: "Вектор Девелопмент · керамогранит 300 м²" },
      task: { en: "Call Irina Sokolova in 2 days at 11:00 to discuss the quote", ru: "Позвонить Ирине Соколовой через 2 дня в 11:00, обсудить КП" },
    },
    sec: [6, 14, 41, 38, 9],
    sku: "KG-6060-GRM",
  },
  {
    id: "r2",
    channel: { en: "Website form", ru: "Форма на сайте" },
    client: { en: "Oleg Lebedev, sole trader", ru: "ИП Лебедев" },
    contact: { en: "Oleg Lebedev", ru: "Олег Лебедев" },
    short: { en: "120 m² laminate with delivery to Khimki", ru: "120 м² ламината с доставкой в Химки" },
    text: {
      en: "Class 33 laminate, natural oak, 120 m², underlay needed. Delivery to Khimki, no installation. Deliver by the end of the month. Oleg Lebedev, sole trader",
      ru: "Ламинат 33 класс, дуб натуральный, 120 м², нужна подложка. Доставка в Химки, укладка не нужна. Привезти до конца месяца. Олег Лебедев, ИП",
    },
    parsed: [
      { k: { en: "Client", ru: "Клиент" }, v: { en: "Oleg Lebedev, sole trader", ru: "ИП Лебедев, Олег" } },
      { k: { en: "Product", ru: "Товар" }, v: { en: "class 33 laminate, natural oak", ru: "ламинат 33 класс, дуб натуральный" } },
      { k: { en: "Volume", ru: "Объём" }, v: { en: "120 m² + underlay", ru: "120 м² + подложка" } },
      { k: { en: "Service", ru: "Услуга" }, v: { en: "delivery, no installation", ru: "доставка без укладки" } },
      { k: { en: "Address", ru: "Адрес" }, v: { en: "Khimki", ru: "Химки" } },
      { k: { en: "Deadline", ru: "Срок" }, v: { en: "by the end of the month", ru: "до конца месяца" } },
    ],
    items: [
      { name: { en: "Class 33 laminate «Natural Oak», 2.2 m² pack (129.8 m²)", ru: "Ламинат 33 кл. «Дуб натуральный», упаковка 2,2 м² (129,8 м²)" }, qty: 59, unit: { en: "packs", ru: "упак." }, price: 2398 },
      { name: { en: "Underlay 3 mm", ru: "Подложка 3 мм" }, qty: 130, unit: M2, price: 95 },
      { name: { en: "Delivery to Khimki", ru: "Доставка в Химки" }, qty: 1, unit: { en: "trip", ru: "рейс" }, price: 4500, work: true },
    ],
    stock: [
      { tone: "ok", text: { en: "Moscow warehouse: 214 m² in stock, 59 packs reserved", ru: "Склад Москва: 214 м² в наличии, 59 упаковок в резерве" } },
      { tone: "ok", text: { en: "Underlay: in stock", ru: "Подложка: в наличии" } },
      { tone: "ok", text: { en: "Delivery to Khimki: earliest tomorrow", ru: "Доставка в Химки: ближайшая завтра" } },
      { tone: "ok", text: { en: "Everything in stock, any day before the end of the month", ru: "Всё в наличии, в любой день до конца месяца" } },
    ],
    timeline: {
      en: "everything is in stock, delivery any day before the end of the month, earliest tomorrow",
      ru: "всё в наличии, доставка в любой день до конца месяца, ближайшая завтра",
    },
    kpNo: "2026-1148",
    deal: {
      id: "48214",
      name: { en: "Lebedev · laminate 120 m²", ru: "ИП Лебедев · ламинат 120 м²" },
      task: { en: "Message Oleg tomorrow at 10:00 to confirm the delivery date", ru: "Написать Олегу завтра в 10:00, подтвердить дату доставки" },
    },
    sec: [5, 11, 29, 30, 6],
    sku: "LM-33-OAK",
  },
  {
    id: "r3",
    channel: { en: "Telegram", ru: "Telegram" },
    client: { en: "Penka café", ru: "Кафе «Пенка»" },
    contact: { en: "Alexey", ru: "Алексей" },
    short: { en: "~210 m² vinyl for a café, night installation", ru: "~210 м² кварцвинила для кафе, укладка ночью" },
    text: {
      en: "Hello, we need quartz vinyl for two floors of a café, about 210 m². Installation only at night, the café is open during the day. We can start from November 10. Alexey, Penka café",
      ru: "Здравствуйте, нужен кварцвинил на два этажа кафе, примерно 210 м². Укладывать только ночью, днём кафе работает. Начать можно с 10 ноября. Алексей, кафе «Пенка»",
    },
    parsed: [
      { k: { en: "Client", ru: "Клиент" }, v: { en: "Penka café, Alexey", ru: "кафе «Пенка», Алексей" } },
      { k: { en: "Product", ru: "Товар" }, v: { en: "quartz vinyl", ru: "кварцвинил" } },
      { k: { en: "Volume", ru: "Объём" }, v: { en: "about 210 m², 2 floors", ru: "около 210 м², 2 этажа" } },
      { k: { en: "Service", ru: "Услуга" }, v: { en: "installation at night", ru: "укладка ночью" } },
      { k: { en: "Start", ru: "Старт" }, v: { en: "from November 10", ru: "с 10 ноября" } },
      { k: { en: "Note", ru: "Пометка" }, v: { en: "volume is approximate, site survey needed", ru: "объём примерный, нужен замер" } },
    ],
    items: [
      { name: { en: "Quartz vinyl class 43 «Nordic Oak» (210 m² + 8%)", ru: "Кварцвинил 43 кл. «Скандинавский дуб» (210 м² + 8%)" }, qty: 227, unit: M2, price: 1640 },
      { name: { en: "Vinyl adhesive, 10 kg bucket", ru: "Клей для кварцвинила, ведро 10 кг" }, qty: 8, unit: { en: "pcs", ru: "шт." }, price: 3900 },
      { name: { en: "Installing quartz vinyl", ru: "Укладка кварцвинила" }, qty: 210, unit: M2, price: 750, work: true },
      { name: { en: "Night work rate, +25% to installation", ru: "Ночной коэффициент, +25% к укладке" }, qty: 1, unit: { en: "pcs", ru: "шт." }, price: 39375, work: true },
      { name: { en: "Delivery", ru: "Доставка" }, qty: 1, unit: { en: "trip", ru: "рейс" }, price: 6500, work: true },
    ],
    stock: [
      { tone: "ok", text: { en: "Warehouse: 150 m² in stock", ru: "Склад: 150 м² в наличии" } },
      { tone: "warn", text: { en: "77 m² short: the supplier delivers in 7 working days, in time for November 10", ru: "Не хватает 77 м²: поставщик привезёт за 7 рабочих дней, к 10 ноября успеваем" } },
      { tone: "ok", text: { en: "Night crew: 6 nights from November 10", ru: "Ночная бригада: 6 ночей с 10 ноября" } },
      { tone: "warn", text: { en: "Volume is approximate: the quote includes a site survey before work starts", ru: "Объём примерный: в КП заложен замер до старта работ" } },
    ],
    timeline: {
      en: "installation at night, 6 nights from November 10, a site survey before the start",
      ru: "укладка ночью, 6 ночей с 10 ноября, до старта замер",
    },
    kpNo: "2026-1149",
    deal: {
      id: "48215",
      name: { en: "Penka café · quartz vinyl 210 m²", ru: "Кафе «Пенка» · кварцвинил 210 м²" },
      task: { en: "Agree on a site survey with Alexey this week", ru: "Согласовать с Алексеем замер на этой неделе" },
    },
    sec: [7, 16, 44, 41, 8],
    sku: "QV-43-NOAK",
  },
];

export function findRequest(id: unknown): Req | undefined {
  return typeof id === "string" ? REQUESTS.find((r) => r.id === id) : undefined;
}

/* Суммы КП: материалы, работы и услуги, скидка на материалы, итого. */
export function totals(r: Req) {
  const line = (i: Item) => i.qty * i.price;
  const materials = r.items.filter((i) => !i.work).reduce((s, i) => s + line(i), 0);
  const works = r.items.filter((i) => i.work).reduce((s, i) => s + line(i), 0);
  const discount = r.discount ? Math.round((materials * r.discount) / 100) : 0;
  return { materials, works, discount, total: materials + works - discount };
}

export function totalSec(r: Req): number {
  return r.sec.reduce((s, x) => s + x, 0);
}
