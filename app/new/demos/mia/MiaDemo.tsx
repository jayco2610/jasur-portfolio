"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import DemoShell from "../DemoShell";
import PhoneFrame from "../PhoneFrame";

/* Mia в макете. Перенос app/demos/mia/page.tsx: те же документы, те же
   три вопроса с фрагментами и ответами, те же паузы (поиск 1,4 секунды,
   ответ на 2,6). Кнопка на живого ассистента ведёт туда же, на Hugging Face.
   Логика строка в строку, меняется только разметка. Сети демо не трогает. */

const HF_URL = "https://huggingface.co/spaces/rag-jasur/mia-clinic-assistant";

type Phase = "idle" | "searching" | "found" | "done";

const DOCS = [
  { icon: "📄", name: { en: "Price list.pdf", ru: "Прайс-лист.pdf" } },
  { icon: "🦷", name: { en: "Services.docx", ru: "Услуги.docx" } },
  { icon: "🗓️", name: { en: "Doctors schedule.xlsx", ru: "График врачей.xlsx" } },
  { icon: "❓", name: { en: "Patient FAQ.md", ru: "FAQ пациентов.md" } },
];

const QUESTIONS = [
  {
    id: "price",
    q: { en: "How much is professional cleaning?", ru: "Сколько стоит профессиональная чистка?" },
    fragments: [
      {
        source: { en: "Price list, page 2", ru: "Прайс-лист, стр. 2" },
        text: {
          en: "Professional AirFlow cleaning: 4,500 ₽. Ultrasonic cleaning: 3,200 ₽.",
          ru: "Профессиональная чистка AirFlow: 4 500 ₽. Ультразвуковая чистка: 3 200 ₽.",
        },
      },
      {
        source: { en: "Services: hygiene", ru: "Услуги: гигиена" },
        text: {
          en: "The visit takes 40 to 60 minutes, recommended every 6 months.",
          ru: "Приём занимает 40–60 минут, рекомендуется раз в 6 месяцев.",
        },
      },
    ],
    answer: {
      en: "Professional AirFlow cleaning costs 4,500 ₽, ultrasonic cleaning costs 3,200 ₽. The visit takes 40 to 60 minutes. We recommend it every 6 months.",
      ru: "Профессиональная чистка AirFlow стоит 4 500 ₽, ультразвуковая: 3 200 ₽. Приём занимает 40–60 минут. Рекомендуем проходить её раз в 6 месяцев.",
    },
  },
  {
    id: "sunday",
    q: { en: "Are you open on Sundays?", ru: "Вы работаете по воскресеньям?" },
    fragments: [
      {
        source: { en: "Doctors schedule", ru: "График врачей" },
        text: {
          en: "Clinic hours: Mon–Sat 9:00–20:00. Sunday: closed.",
          ru: "Часы работы клиники: пн–сб 9:00–20:00. Воскресенье: выходной.",
        },
      },
    ],
    answer: {
      en: "The clinic is open Monday to Saturday from 9:00 to 20:00. On Sundays we are closed, but you can book online for any other day.",
      ru: "Клиника работает с понедельника по субботу с 9:00 до 20:00. В воскресенье у нас выходной, но вы можете записаться онлайн на любой другой день.",
    },
  },
  {
    id: "implant",
    q: { en: "Does getting an implant hurt?", ru: "Больно ли ставить имплант?" },
    fragments: [
      {
        source: { en: "Patient FAQ", ru: "FAQ пациентов" },
        text: {
          en: "Implant placement is done under local anesthesia; patients report pressure, not pain.",
          ru: "Установка импланта проходит под местной анестезией; пациенты отмечают давление, а не боль.",
        },
      },
      {
        source: { en: "Services: implantology", ru: "Услуги: имплантология" },
        text: {
          en: "After the procedure we give written care instructions and a control visit in 7 days.",
          ru: "После процедуры выдаём письменные рекомендации и назначаем контрольный визит через 7 дней.",
        },
      },
    ],
    answer: {
      en: "Implant placement is done under local anesthesia, so patients usually feel pressure rather than pain. Afterwards you get written care instructions and a control visit in 7 days.",
      ru: "Установка импланта проходит под местной анестезией, поэтому пациенты обычно чувствуют давление, а не боль. После процедуры вы получите письменные рекомендации и контрольный визит через 7 дней.",
    },
  },
];

const copy = {
  en: {
    title: "Mia, a clinic RAG assistant",
    subtitle:
      "An assistant for a dental clinic that answers patients only from the clinic's own documents. Below is a step-by-step simulation of how it works inside; the live assistant is one click away.",
    pitch:
      "A knowledge base becomes an assistant that works round the clock and doesn't invent prices. Every answer is assembled from a document fragment. No fragment — no answer.",
    hint: "Pick a patient question under the phone and watch the answer get built from documents.",
    step1: "Knowledge base",
    step1desc: "The clinic's documents are split into fragments and indexed",
    step2: "Search",
    step2desc: "The question pulls only the relevant fragments",
    step2empty: "Fragments found in the documents will appear here",
    step3: "Grounded answer",
    step3desc: "The model answers strictly from the found fragments",
    step3check: "Answer built only from the documents above",
    chatTitle: "Mia · clinic assistant",
    chatEmpty: "Choose a question below",
    searching: "searching the knowledge base…",
    openLive: "Open the live assistant on Hugging Face →",
    tryAnother: "Try another question",
    simNote: "The walkthrough is simulated from the real project's materials. The assistant on Hugging Face is live.",
  },
  ru: {
    title: "Mia, RAG-ассистент клиники",
    subtitle:
      "Ассистент стоматологической клиники, который отвечает пациентам только по документам клиники. Ниже пошаговая симуляция того, как это устроено внутри; живой ассистент открывается в один клик.",
    pitch:
      "База знаний становится ассистентом, который работает круглосуточно и не выдумывает цены. Каждый ответ собран из фрагмента документа. Нет фрагмента — нет ответа.",
    hint: "Выберите вопрос пациента под телефоном и посмотрите, как ответ собирается из документов.",
    step1: "База знаний",
    step1desc: "Документы клиники разбиты на фрагменты и проиндексированы",
    step2: "Поиск",
    step2desc: "Вопрос вытягивает только релевантные фрагменты",
    step2empty: "Здесь появятся фрагменты, найденные в документах",
    step3: "Ответ по документам",
    step3desc: "Модель отвечает строго по найденным фрагментам",
    step3check: "Ответ собран только из документов выше",
    chatTitle: "Mia · ассистент клиники",
    chatEmpty: "Выберите вопрос ниже",
    searching: "ищу в базе знаний…",
    openLive: "Открыть живого ассистента на Hugging Face →",
    tryAnother: "Задать другой вопрос",
    simNote: "Разбор шагов симулирован на материалах реального проекта. Ассистент на Hugging Face живой.",
  },
};

export default function MiaDemo() {
  const { lang } = useLanguage();
  const c = copy[lang];

  const [phase, setPhase] = useState<Phase>("idle");
  const [questionId, setQuestionId] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const question = QUESTIONS.find((q) => q.id === questionId) ?? null;

  function ask(id: string) {
    timers.current.forEach(clearTimeout);
    setQuestionId(id);
    setPhase("searching");
    timers.current = [
      setTimeout(() => setPhase("found"), 1400),
      setTimeout(() => setPhase("done"), 2600),
    ];
  }

  return (
    <DemoShell
      title={{ en: copy.en.title, ru: copy.ru.title }}
      subtitle={{ en: copy.en.subtitle, ru: copy.ru.subtitle }}
      pitch={{ en: copy.en.pitch, ru: copy.ru.pitch }}
      hint={{ en: copy.en.hint, ru: copy.ru.hint }}
      footer={null}
    >
      <a href={HF_URL} target="_blank" rel="noopener noreferrer" className="nm-dm-btn">
        {c.openLive}
      </a>

      <div className="nm-dm-split nm-dm-mt">
        {/* Слева: шаги */}
        <div className="nm-dm-grow nm-dm-stack">
          {/* Шаг 1: база знаний */}
          <div className="nm-dm-panel">
            <p className="nm-dm-panel-t">1 · {c.step1}</p>
            <p className="nm-dm-panel-d">{c.step1desc}</p>
            <div className="nm-dm-docs">
              {DOCS.map((d) => (
                <div key={d.name.en}>
                  <span className="nm-dm-emo">{d.icon}</span> {d.name[lang]}
                </div>
              ))}
            </div>
          </div>

          {/* Шаг 2: поиск */}
          <div className={`nm-dm-panel${phase === "idle" ? "" : " is-on"}`}>
            <p className="nm-dm-panel-t">2 · {c.step2}</p>
            <p className="nm-dm-panel-d">{c.step2desc}</p>
            {phase === "idle" && (
              <p className="nm-dm-note nm-dm-mts">{c.step2empty}</p>
            )}
            {phase === "searching" && (
              <div className="nm-dm-wait nm-dm-mts">
                <span className="nm-dm-spin" aria-hidden="true" />
                {c.searching}
              </div>
            )}
            {(phase === "found" || phase === "done") &&
              question?.fragments.map((f, i) => (
                <div key={f.source.en} className="nm-dm-quote nm-dm-in" style={{ animationDelay: `${i * 150}ms` }}>
                  <p className="nm-dm-quote-k">{f.source[lang]}</p>
                  <p className="nm-dm-quote-t">{f.text[lang]}</p>
                </div>
              ))}
          </div>

          {/* Шаг 3: ответ по документам */}
          <div className={`nm-dm-panel${phase === "done" ? " is-on" : ""}`}>
            <p className="nm-dm-panel-t">3 · {c.step3}</p>
            <p className="nm-dm-panel-d">{c.step3desc}</p>
            {phase === "done" && <p className="nm-dm-done-t nm-dm-mts nm-dm-in">✓ {c.step3check}</p>}
          </div>
        </div>

        {/* Справа: чат */}
        <div className="nm-dm-phone-col">
          <PhoneFrame time="12:05">
            <div className="nm-dm-chat-h">
              <div className="nm-dm-ava">
                <span className="nm-dm-emo">🦷</span>
              </div>
              <div>
                <p className="nm-dm-chat-t">{c.chatTitle}</p>
                <p className="nm-dm-chat-s">online</p>
              </div>
            </div>
            <div className="nm-dm-chat">
              {!question && <p className="nm-dm-empty">{c.chatEmpty}</p>}
              {question && (
                <div className="nm-dm-msg is-out">
                  <p>{question.q[lang]}</p>
                </div>
              )}
              {phase === "searching" && (
                <div className="nm-dm-msg">
                  <p className="nm-dm-msg-d">{c.searching}</p>
                </div>
              )}
              {phase === "done" && question && (
                <div className="nm-dm-msg nm-dm-in">
                  <p>{question.answer[lang]}</p>
                </div>
              )}
            </div>
            <div className="nm-dm-opts">
              {QUESTIONS.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => ask(q.id)}
                  disabled={phase === "searching" || (phase === "found" && questionId === q.id)}
                  className={`nm-dm-opt${questionId === q.id ? " is-on" : ""}`}
                >
                  {q.q[lang]}
                </button>
              ))}
            </div>
          </PhoneFrame>
          <p className="nm-dm-note nm-dm-sim">{c.simNote}</p>
        </div>
      </div>
    </DemoShell>
  );
}
