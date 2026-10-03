"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import DemoShell from "../DemoShell";
import PhoneFrame from "../PhoneFrame";
import MiaLive from "./MiaLive";
import { MIA_CHUNKS } from "@/lib/mia";
import { searchMia, sourcesFor } from "@/lib/miaSearch";

/* Mia в макете. Перенос app/demos/mia/page.tsx: те же три вопроса, те же
   паузы (поиск 1,4 секунды, ответ на 2,6). Пошаговый разбор сети не трогает.
   С 03.10.2026 разбор идёт на настоящем документе клиники: вместо четырёх
   выдуманных файлов разделы документа, вместо вписанных фрагментов те,
   что находит поиск живого ассистента.

   Сверху живой ассистент (MiaLive.tsx, /api/mia). До 03.10.2026 на его
   месте стояла кнопка на пространство Hugging Face, которое засыпало. Три
   готовых вопроса у живого те же, что в разборе. */

type Phase = "idle" | "searching" | "found" | "done";

/* Разделы настоящего документа клиники (lib/mia.ts), те же, что видит поиск
   живого ассистента. Значки только для вида. */
const SECTION_ICONS: Record<string, string> = {
  about: "🏥",
  hours: "🕒",
  contacts: "📍",
  guarantees: "🛡️",
  payment: "💳",
  implants: "🦷",
  "implant-faq": "❓",
  prosthetics: "🦷",
  veneers: "✨",
  treatment: "🩺",
  removal: "🦷",
  hygiene: "🪥",
};

/* Фрагменты в каждом вопросе не вписаны руками: их находит тот же поиск
   (lib/miaSearch.ts), что отвечает живому ассистенту, а цитата это строки
   настоящего документа. Руками написаны только английский перевод цитаты
   и готовый ответ; ответ собран из слов цитаты. */
const QUESTION_DEFS = [
  {
    id: "price",
    q: { en: "How much is professional cleaning?", ru: "Сколько стоит профессиональная чистка?" },
    quoteEn: { hygiene: "Professional oral hygiene: 8,400 ₽" } as Record<string, string>,
    answer: {
      en: "Professional oral hygiene costs 8,400 ₽.",
      ru: "Профессиональная гигиена полости рта стоит 8 400 ₽.",
    },
  },
  {
    id: "sunday",
    q: { en: "Are you open on Sundays?", ru: "Вы работаете по воскресеньям?" },
    quoteEn: {
      hours: "Hours: daily 10:00–20:00 / How does the clinic work? Daily from 10:00 to 20:00.",
    } as Record<string, string>,
    answer: {
      en: "Yes, the clinic is open daily from 10:00 to 20:00, Sundays included.",
      ru: "Да, клиника работает ежедневно с 10:00 до 20:00, воскресенье тоже.",
    },
  },
  {
    id: "implant",
    q: { en: "Does getting an implant hurt?", ru: "Больно ли ставить имплант?" },
    quoteEn: {
      "implant-faq":
        "Is implant placement painful? Anti-stress implantation is offered to those who fear pain. Anesthesia is used.",
    } as Record<string, string>,
    answer: {
      en: "For patients who are afraid of pain we offer anti-stress implantation. Anesthesia is used.",
      ru: "Для тех, кто боится боли, проводится антистресс-имплантация. Используется анестезия.",
    },
  },
];

const QUESTIONS = QUESTION_DEFS.map((d) => ({
  id: d.id,
  q: d.q,
  answer: d.answer,
  fragments: sourcesFor(searchMia(d.q.ru), d.q.ru).map((src) => ({
    id: src.id,
    source: { en: src.titleEn, ru: src.title },
    text: { en: d.quoteEn[src.id] ?? src.quote, ru: src.quote },
  })),
}));

const copy = {
  en: {
    title: "Mia, a clinic RAG assistant",
    subtitle:
      "An assistant for a dental clinic that answers patients only from the clinic's own documents. The live assistant answers right on this page; below it is a step-by-step simulation of how it works inside.",
    pitch:
      "A knowledge base becomes an assistant that works round the clock and doesn't invent prices. Every answer is assembled from a document fragment. No fragment, no answer.",
    hint: "Pick a patient question under the phone and watch the answer get built from the clinic document.",
    step1: "Knowledge base",
    step1desc: "The clinic document is split into fragments by section and indexed",
    step2: "Search",
    step2desc: "The question pulls only the relevant fragments",
    step2empty: "Fragments found in the document will appear here",
    step3: "Grounded answer",
    step3desc: "The model answers strictly from the found fragments",
    step3check: "Answer built only from the fragments above",
    chatTitle: "Mia · clinic assistant",
    chatEmpty: "Choose a question below",
    searching: "searching the knowledge base…",
    tryAnother: "Try another question",
    simNote: "The walkthrough runs on the real clinic document. The assistant above it is live.",
  },
  ru: {
    title: "Mia, RAG-ассистент клиники",
    subtitle:
      "Ассистент стоматологической клиники, который отвечает пациентам только по документам клиники. Живой ассистент отвечает прямо на этой странице, под ним пошаговая симуляция того, как это устроено внутри.",
    pitch:
      "База знаний становится ассистентом, который работает круглосуточно и не выдумывает цены. Каждый ответ собран из фрагмента документа. Нет фрагмента, нет ответа.",
    hint: "Выберите вопрос пациента под телефоном и посмотрите, как ответ собирается из документа клиники.",
    step1: "База знаний",
    step1desc: "Документ клиники разбит на фрагменты по разделам и проиндексирован",
    step2: "Поиск",
    step2desc: "Вопрос вытягивает только релевантные фрагменты",
    step2empty: "Здесь появятся фрагменты, найденные в документе",
    step3: "Ответ по документам",
    step3desc: "Модель отвечает строго по найденным фрагментам",
    step3check: "Ответ собран только из фрагментов выше",
    chatTitle: "Mia · ассистент клиники",
    chatEmpty: "Выберите вопрос ниже",
    searching: "ищу в базе знаний…",
    tryAnother: "Задать другой вопрос",
    simNote: "Разбор шагов построен на настоящем документе клиники. Ассистент над ним живой.",
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
      footer={null}
    >
      <MiaLive questions={QUESTIONS.map((q) => q.q)} />

      <p className="nm-dm-hint">▶ {c.hint}</p>

      <div className="nm-dm-split nm-dm-mt">
        {/* Слева: шаги */}
        <div className="nm-dm-grow nm-dm-stack nm-dm-app">
          {/* Шаг 1: база знаний */}
          <div className="nm-dm-panel" data-st="done">
            <p className="nm-dm-panel-t">1 · {c.step1}</p>
            <p className="nm-dm-panel-d">{c.step1desc}</p>
            <div className="nm-dm-docs">
              {MIA_CHUNKS.map((d) => (
                <div key={d.id}>
                  <span className="nm-dm-emo">{SECTION_ICONS[d.id] ?? "📄"}</span> {d.title[lang]}
                </div>
              ))}
            </div>
          </div>

          {/* Шаг 2: поиск */}
          <div className={`nm-dm-panel${phase === "idle" ? "" : " is-on"}`} data-st={phase === "idle" ? "idle" : phase === "searching" ? "run" : "done"}>
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
                <div key={f.id} className="nm-dm-quote nm-dm-in" style={{ animationDelay: `${i * 150}ms` }}>
                  <p className="nm-dm-quote-k">{f.source[lang]}</p>
                  <p className="nm-dm-quote-t">{f.text[lang]}</p>
                </div>
              ))}
          </div>

          {/* Шаг 3: ответ по документам */}
          <div className={`nm-dm-panel${phase === "done" ? " is-on" : ""}`} data-st={phase === "done" ? "done" : phase === "found" ? "run" : "idle"}>
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
                <div className="nm-dm-msg is-typing">
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
