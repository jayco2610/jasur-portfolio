/* Данные демо «Проверка ДЗ и риск оттока»: курс, задание, критерии,
   пример ответа ученика и список учеников с активностью.

   Файл без "use client": задание и критерии читает и демо (EdtechDemo.tsx),
   и сервер (lib/demo-company.ts), когда проверяет ответ. Браузер присылает
   только язык и текст ответа ученика, задание и критерии сервер берёт
   отсюда, подменить их нельзя.

   Школа и ученики вымышленные. Живой ИИ проверяет ответ ученика. Риск
   оттока и подсказки, что написать ученику, прописаны заранее: это
   симуляция того, что система выдала бы по активности. */

type L = { en: string; ru: string };

export const SCHOOL = {
  name: { en: "Metod online school", ru: "Онлайн-школа «Метод»" } as L,
  course: { en: "Product Manager, cohort 14", ru: "Курс «Продакт-менеджер», поток 14" } as L,
  curator: { en: "Anna Belova, curator", ru: "Анна Белова, куратор" } as L,
};

export const TASK = {
  code: "3.2",
  title: { en: "Hypothesis and metric", ru: "Гипотеза и метрика" } as L,
  text: {
    en: "An online cinema loses users after the free trial: only 18% move to a paid subscription. Write one hypothesis on how to raise this conversion, choose a metric, describe how you would test it, and set a success criterion.",
    ru: "Онлайн-кинотеатр теряет пользователей после бесплатного пробного периода: в платную подписку переходят 18%. Сформулируйте одну гипотезу, как поднять эту конверсию, выберите метрику, опишите способ проверки и критерий успеха.",
  } as L,
};

export const CRITERIA: { name: L; max: number }[] = [
  { name: { en: "Testable hypothesis: change, reason, expected effect", ru: "Гипотеза проверяемая: изменение, причина, ожидаемый эффект" }, max: 3 },
  { name: { en: "The metric fits the goal", ru: "Метрика выбрана под цель" }, max: 3 },
  { name: { en: "Test design: groups, sample, duration", ru: "Способ проверки: группы, выборка, срок" }, max: 2 },
  { name: { en: "Success criterion is a number", ru: "Критерий успеха задан числом" }, max: 2 },
];

export const STUDENT_ANSWER = {
  name: { en: "Maria Kovaleva", ru: "Мария Ковалёва" } as L,
  sent: { en: "submitted 2 hours ago", ru: "сдано 2 часа назад" } as L,
  text: {
    en: "Hypothesis: if we send trial users a weekly pick of films based on their taste, more of them will pay for a subscription. Metric: number of views during the trial. Test: an A/B test, half of new users get the picks, half do not. If views go up, the hypothesis is confirmed.",
    ru: "Гипотеза: если в пробный период присылать пользователям подборку фильмов под их вкус, больше людей оплатят подписку. Метрика: количество просмотров за пробный период. Проверка: сделаем A/B-тест, половине новых пользователей будем отправлять подборки, половине нет. Если просмотров станет больше, гипотеза подтвердилась.",
  } as L,
};

export type Risk = "high" | "medium" | "ok";

export type Student = {
  id: string;
  name: L;
  last: L;
  /* Сколько дней назад заходил: для сортировки и цвета. */
  lastDays: number;
  hw: number;
  hwTotal: number;
  watched: number;
  risk: Risk;
  signals?: L[];
  message?: L;
};

export const STUDENTS: Student[] = [
  {
    id: "st2",
    name: { en: "Artem Sergeev", ru: "Артём Сергеев" },
    last: { en: "9 days ago", ru: "9 дней назад" },
    lastDays: 9,
    hw: 3,
    hwTotal: 6,
    watched: 41,
    risk: "high",
    signals: [
      { en: "Has not logged in for 9 days, usually every 2 days", ru: "Не заходит 9 дней, обычно заходил раз в 2 дня" },
      { en: "Missed two assignments in a row", ru: "Пропустил два ДЗ подряд" },
      { en: "Next installment payment in 5 days", ru: "Через 5 дней платёж по рассрочке" },
    ],
    message: {
      en: "Hi Artem! I see the metrics module is still unopened. It is the densest one in the course, and many people get stuck there. I can do a 15-minute call on Thursday or Friday and help with assignment 3.1 so you keep up with the cohort. What time suits you?",
      ru: "Артём, здравствуйте! Вижу, что модуль про метрики пока не открыт. Он самый плотный на курсе, на нём многие буксуют. Могу созвониться на 15 минут в четверг или пятницу и помочь с ДЗ 3.1, чтобы вы не отстали от потока. Какое время удобно?",
    },
  },
  {
    id: "st5",
    name: { en: "Ekaterina Volkova", ru: "Екатерина Волкова" },
    last: { en: "12 days ago", ru: "12 дней назад" },
    lastDays: 12,
    hw: 2,
    hwTotal: 6,
    watched: 25,
    risk: "high",
    signals: [
      { en: "No logins for 12 days", ru: "12 дней без входа" },
      { en: "2 of 6 assignments submitted", ru: "Сдано 2 ДЗ из 6" },
      { en: "Last chat message: «I can't keep up»", ru: "Последнее сообщение в чате: «не успеваю»" },
    ],
    message: {
      en: "Hi Ekaterina! You mentioned you are short on time, which is normal at this stage. You can move to the next cohort from module 3 at no extra cost, and all your assignments stay. Shall I tell you how?",
      ru: "Екатерина, здравствуйте! Вы писали, что не хватает времени, на этом этапе так бывает у многих. Можно перейти в следующий поток с 3 модуля без доплаты, все ваши ДЗ сохранятся. Рассказать, как это сделать?",
    },
  },
  {
    id: "st3",
    name: { en: "Olga Kim", ru: "Ольга Ким" },
    last: { en: "4 days ago", ru: "4 дня назад" },
    lastDays: 4,
    hw: 4,
    hwTotal: 6,
    watched: 63,
    risk: "medium",
    signals: [
      { en: "Chat activity fell from 12 messages a week to zero", ru: "Сообщений в чате было 12 в неделю, стало ноль" },
      { en: "Assignment scores falling: 9, 8, 6 out of 10", ru: "Оценки за ДЗ снижаются: 9, 8, 6 из 10" },
    ],
    message: {
      en: "Hi Olga! Your unit economics assignment was one of the strongest in the cohort. I noticed you have been quieter in the chat lately. If anything in module 3 is unclear, send me your question directly and we will go through it in a voice message.",
      ru: "Ольга, добрый день! Ваша работа по юнит-экономике была одной из сильных в потоке. Заметила, что последние две недели вы реже в чате. Если что-то в модуле 3 непонятно, пришлите вопрос мне лично, разберём голосовым.",
    },
  },
  {
    id: "st7",
    name: { en: "Alina Sharipova", ru: "Алина Шарипова" },
    last: { en: "6 days ago", ru: "6 дней назад" },
    lastDays: 6,
    hw: 4,
    hwTotal: 6,
    watched: 52,
    risk: "medium",
    signals: [
      { en: "Watches lessons at 2x and skips the practice parts", ru: "Смотрит уроки на скорости 2x и пропускает практику" },
      { en: "Assignment 3.1 submitted 4 days late", ru: "ДЗ 3.1 сдано с опозданием на 4 дня" },
    ],
    message: {
      en: "Hi Alina! In module 3 the practice matters more than the theory: the cohort project is built on it. If time is short, start with the 20-minute practice in lesson 3.3, it covers the rest. Shall I send the link?",
      ru: "Алина, добрый день! В модуле 3 практика важнее теории: на ней строится проект потока. Если времени мало, начните с 20-минутной практики в уроке 3.3, она закрывает остальное. Прислать ссылку?",
    },
  },
  {
    id: "st1",
    name: { en: "Maria Kovaleva", ru: "Мария Ковалёва" },
    last: { en: "today", ru: "сегодня" },
    lastDays: 0,
    hw: 6,
    hwTotal: 6,
    watched: 92,
    risk: "ok",
  },
  {
    id: "st4",
    name: { en: "Denis Orlov", ru: "Денис Орлов" },
    last: { en: "today", ru: "сегодня" },
    lastDays: 0,
    hw: 5,
    hwTotal: 6,
    watched: 88,
    risk: "ok",
  },
  {
    id: "st6",
    name: { en: "Nikita Pavlov", ru: "Никита Павлов" },
    last: { en: "yesterday", ru: "вчера" },
    lastDays: 1,
    hw: 6,
    hwTotal: 6,
    watched: 95,
    risk: "ok",
  },
  {
    id: "st8",
    name: { en: "Ruslan Akhmedov", ru: "Руслан Ахмедов" },
    last: { en: "2 days ago", ru: "2 дня назад" },
    lastDays: 2,
    hw: 5,
    hwTotal: 6,
    watched: 79,
    risk: "ok",
  },
];
