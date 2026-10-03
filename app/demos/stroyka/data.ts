/* Данные демо «Отчёт прораба и контроль сметы»: объект, график, смета,
   сообщения прораба за день и то, что ИИ из них извлёк.

   Файл без "use client": его читает и демо (StroykaDemo.tsx), и сервер
   (lib/demo-company.ts), когда пишет сводку владельцу. Браузер присылает
   только язык, факты дня сервер берёт отсюда.

   Объект и подрядчик вымышленные. Расшифровки голосовых, распознанная
   накладная, сверка с графиком и сметой прописаны заранее: это симуляция.
   Живой ИИ пишет только сводку для владельца. */

type L = { en: string; ru: string };

export const SITE_INFO = {
  name: { en: "Aerated concrete house, 186 m²", ru: "Дом из газобетона, 186 м²" } as L,
  place: { en: "Lesnye Dali village, plot 24", ru: "КП «Лесные дали», участок 24" } as L,
  contractor: { en: "StroyKontur", ru: "«СтройКонтур»" } as L,
  foreman: { en: "Sergey Mikhailov", ru: "Сергей Михайлов" } as L,
  /* Смета целиком, рубли. */
  budget: 11_400_000,
  /* Освоено до сегодняшнего отчёта и план освоения на сегодня по графику. */
  spentBefore: 5_485_000,
  planToday: 5_640_000,
  weeks: 18,
  /* Сегодня: неделя 9, третий день после планового старта кровли. */
  today: 9.43,
};

/* Этапы графика: старт и длительность в неделях, готовность до и после
   отчёта, в процентах. late: на сколько дней этап отстаёт после отчёта. */
export type Stage = { name: L; start: number; len: number; before: number; after: number; late?: number };

export const STAGES: Stage[] = [
  { name: { en: "Foundation", ru: "Фундамент" }, start: 0, len: 3, before: 100, after: 100 },
  { name: { en: "Ground floor walls", ru: "Стены 1 этажа" }, start: 3, len: 2, before: 100, after: 100 },
  { name: { en: "Ground floor slab", ru: "Перекрытие 1 этажа" }, start: 5, len: 1, before: 100, after: 100 },
  { name: { en: "First floor walls", ru: "Стены 2 этажа" }, start: 6, len: 2, before: 100, after: 100 },
  { name: { en: "First floor slab", ru: "Перекрытие 2 этажа" }, start: 8, len: 1, before: 70, after: 100 },
  { name: { en: "Roof", ru: "Кровля" }, start: 9, len: 2.4, before: 0, after: 0, late: 3 },
  { name: { en: "Windows and doors", ru: "Окна и двери" }, start: 11.2, len: 1.4, before: 0, after: 0 },
  { name: { en: "Utilities", ru: "Инженерные сети" }, start: 12, len: 3, before: 0, after: 0 },
  { name: { en: "Facade", ru: "Фасад" }, start: 14.2, len: 3, before: 0, after: 0 },
];

/* Сообщения прораба за день. kind: голосовое, фото с объекта или фото
   документа. facts: что ИИ извлёк, с разделом отчёта. */
export type FactGroup = "work" | "materials" | "people" | "issues";

export type SiteMsg = {
  id: string;
  kind: "voice" | "photo" | "doc";
  time: string;
  dur?: string;
  text: L;
  facts: { group: FactGroup; text: L; tone?: "warn" | "bad" }[];
};

export const MESSAGES: SiteMsg[] = [
  {
    id: "m1",
    kind: "voice",
    time: "08:12",
    dur: "0:42",
    text: {
      en: "Morning. We poured the first-floor slab today, it took forty-two cubic meters of concrete. Six people on site.",
      ru: "Доброе утро. Сегодня залили плиту перекрытия второго этажа, ушло сорок два куба бетона. На объекте шесть человек.",
    },
    facts: [
      { group: "work", text: { en: "First floor slab: poured, 100%", ru: "Перекрытие 2 этажа: залито, 100%" } },
      { group: "materials", text: { en: "M300 concrete: 42 m³", ru: "Бетон М300: 42 м³" } },
      { group: "people", text: { en: "Crew: 6 people", ru: "Бригада: 6 человек" } },
    ],
  },
  {
    id: "m2",
    kind: "photo",
    time: "08:15",
    text: { en: "Slab, axes A-D", ru: "Плита перекрытия, оси А-Г" },
    facts: [
      {
        group: "work",
        text: { en: "Photo matched to the stage «First floor slab»", ru: "Фото привязано к этапу «Перекрытие 2 этажа»" },
      },
    ],
  },
  {
    id: "m3",
    kind: "doc",
    time: "09:40",
    text: { en: "Delivery note No. 3317", ru: "Накладная № 3317" },
    facts: [
      {
        group: "materials",
        text: {
          en: "Delivery note read: M300 concrete, 42 m³, 268,800 ₽",
          ru: "Накладная распознана: бетон М300, 42 м³, 268 800 ₽",
        },
        tone: "bad",
      },
    ],
  },
  {
    id: "m4",
    kind: "voice",
    time: "11:05",
    dur: "0:27",
    text: {
      en: "We bought another half ton of rebar, ran short on the slab. I'll send the receipt.",
      ru: "Арматуру докупили, полтонны, на плиту не хватило. Чек скину.",
    },
    facts: [
      {
        group: "materials",
        text: { en: "A500 rebar: +0.5 t, 41,500 ₽, not in the estimate", ru: "Арматура A500: +0,5 т, 41 500 ₽, сверх сметы" },
        tone: "warn",
      },
    ],
  },
  {
    id: "m5",
    kind: "voice",
    time: "14:30",
    dur: "0:31",
    text: {
      en: "The roofers didn't show up, they're on another site until Thursday. They won't start before Friday.",
      ru: "Кровельщики не вышли, у них другой объект до четверга. Раньше пятницы не начнут.",
    },
    facts: [
      {
        group: "issues",
        text: { en: "Roof: not started, the crew is busy until Thursday", ru: "Кровля: не начата, бригада занята до четверга" },
        tone: "bad",
      },
    ],
  },
  {
    id: "m6",
    kind: "voice",
    time: "17:48",
    dur: "0:14",
    text: {
      en: "Tomorrow we need a crane for four hours for the blocks.",
      ru: "На завтра нужен кран на четыре часа под блоки.",
    },
    facts: [
      { group: "people", text: { en: "Request: crane for 4 hours, tomorrow", ru: "Заявка: кран на 4 часа, завтра" }, tone: "warn" },
    ],
  },
];

/* Траты дня по смете, рубли: бетон, арматура, смена бригады. */
export const SPENT_TODAY = 268_800 + 41_500 + 38_000;

/* Отклонения после сверки с графиком и сметой. */
export type Deviation = { tone: "bad" | "warn"; title: L; text: L; money?: number };

export const DEVIATIONS: Deviation[] = [
  {
    tone: "bad",
    title: { en: "Concrete overspend 12%", ru: "Перерасход бетона 12%" },
    text: {
      en: "First floor slab: 42 m³ instead of 37.5 m³ in the estimate. The extra 4.5 m³ cost 28,800 ₽. Check the formwork volume and the delivery note.",
      ru: "Плита 2 этажа: 42 м³ вместо 37,5 м³ по смете. Лишние 4,5 м³ стоят 28 800 ₽. Проверить объём опалубки и накладную.",
    },
    money: 28_800,
  },
  {
    tone: "bad",
    title: { en: "Roof 3 days behind", ru: "Кровля отстаёт на 3 дня" },
    text: {
      en: "The roofers did not show up, they are busy on another site until Thursday. If the roof does not start by Monday, windows and facade move by a week.",
      ru: "Кровельщики не вышли, заняты на другом объекте до четверга. Если не начать до понедельника, окна и фасад сдвинутся на неделю.",
    },
  },
  {
    tone: "warn",
    title: { en: "Rebar beyond the estimate: 0.5 t", ru: "Арматура сверх сметы: 0,5 т" },
    text: {
      en: "0.5 t of A500 bought for 41,500 ₽. The slab estimate had no reserve, this needs your approval.",
      ru: "Докуплено 0,5 т A500 на 41 500 ₽. В смете на плиту запаса не было, нужно подтверждение.",
    },
    money: 41_500,
  },
];

/* Цифры в шапке до и после отчёта. */
export const NUMBERS = {
  readyBefore: 44,
  readyAfter: 46,
  readyPlan: 49,
};
