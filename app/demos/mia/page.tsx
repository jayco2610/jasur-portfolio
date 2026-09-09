"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import DemoShell from "@/components/demos/DemoShell";
import PhoneFrame from "@/components/demos/PhoneFrame";

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

export default function MiaDemoPage() {
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
      <a
        href={HF_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block font-mono text-sm px-5 py-2.5 bg-[#7C3AED] text-white rounded hover:bg-[#6d28d9] transition-colors mb-10"
      >
        {c.openLive}
      </a>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Left: pipeline steps */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          {/* Step 1: knowledge base */}
          <div className="p-5 bg-[#111111] border border-[#1f1f1f] rounded-lg">
            <p className="font-mono text-xs font-bold text-white mb-1">1 · {c.step1}</p>
            <p className="text-white/40 text-xs mb-3">{c.step1desc}</p>
            <div className="grid grid-cols-2 gap-2">
              {DOCS.map((d) => (
                <div key={d.name.en} className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] rounded font-mono text-[11px] text-white/60">
                  <span>{d.icon}</span> {d.name[lang]}
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: retrieval */}
          <div
            className={`p-5 bg-[#111111] border rounded-lg transition-colors ${
              phase === "searching" ? "border-[#7C3AED]/60" : phase === "found" || phase === "done" ? "border-[#7C3AED]/30" : "border-[#1f1f1f]"
            }`}
          >
            <p className="font-mono text-xs font-bold text-white mb-1">2 · {c.step2}</p>
            <p className="text-white/40 text-xs mb-3">{c.step2desc}</p>
            {phase === "idle" && <p className="font-mono text-[10px] text-white/25">{c.step2empty}</p>}
            {phase === "searching" && (
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#a78bfa]">
                <span className="w-3 h-3 border border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
                {c.searching}
              </div>
            )}
            {(phase === "found" || phase === "done") &&
              question?.fragments.map((f, i) => (
                <div
                  key={f.source.en}
                  className="mb-2 px-3 py-2.5 bg-[#7C3AED]/10 border border-[#7C3AED]/25 rounded animate-[fadeUp_0.4s_ease_both]"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <p className="font-mono text-[9px] text-[#a78bfa] uppercase tracking-wider mb-1">{f.source[lang]}</p>
                  <p className="text-xs text-white/70 leading-relaxed">{f.text[lang]}</p>
                </div>
              ))}
          </div>

          {/* Step 3: grounded answer */}
          <div
            className={`p-5 bg-[#111111] border rounded-lg transition-colors ${
              phase === "done" ? "border-emerald-500/40" : "border-[#1f1f1f]"
            }`}
          >
            <p className="font-mono text-xs font-bold text-white mb-1">3 · {c.step3}</p>
            <p className="text-white/40 text-xs">{c.step3desc}</p>
            {phase === "done" && (
              <p className="font-mono text-[11px] text-emerald-400 mt-3 animate-[fadeUp_0.4s_ease_both]">✓ {c.step3check}</p>
            )}
          </div>
        </div>

        {/* Right: chat */}
        <div className="flex flex-col items-center gap-4">
          <PhoneFrame time="12:05">
            <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#7C3AED]/30 flex items-center justify-center text-sm">🦷</div>
              <div>
                <p className="font-mono text-xs font-bold text-white">{c.chatTitle}</p>
                <p className="font-mono text-[9px] text-emerald-400/80">online</p>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto chat-scrollbar px-3 py-3 space-y-2">
              {!question && <p className="font-mono text-[10px] text-white/25 text-center mt-8">{c.chatEmpty}</p>}
              {question && (
                <div className="bg-[#7C3AED]/25 rounded-lg rounded-tr-sm px-3 py-2 ml-auto max-w-[88%]">
                  <p className="text-[11px] text-white/90 leading-snug">{question.q[lang]}</p>
                </div>
              )}
              {phase === "searching" && (
                <div className="bg-[#182533] rounded-lg rounded-tl-sm px-3 py-2 max-w-[88%]">
                  <p className="font-mono text-[10px] text-white/40">{c.searching}</p>
                </div>
              )}
              {phase === "done" && question && (
                <div className="bg-[#182533] rounded-lg rounded-tl-sm px-3 py-2 max-w-[88%] animate-[fadeUp_0.4s_ease_both]">
                  <p className="text-[11px] text-white/85 leading-snug">{question.answer[lang]}</p>
                </div>
              )}
            </div>
            <div className="p-3 border-t border-white/5 space-y-1.5">
              {QUESTIONS.map((q) => (
                <button
                  key={q.id}
                  onClick={() => ask(q.id)}
                  disabled={phase === "searching" || (phase === "found" && questionId === q.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-[11px] transition-colors disabled:opacity-40 ${
                    questionId === q.id
                      ? "bg-[#7C3AED]/20 border border-[#7C3AED]/40 text-white/85"
                      : "bg-white/[0.04] border border-white/10 text-white/60 hover:border-[#7C3AED]/40"
                  }`}
                >
                  {q.q[lang]}
                </button>
              ))}
            </div>
          </PhoneFrame>
          <p className="font-mono text-[10px] text-white/25 max-w-[300px] text-center">{c.simNote}</p>
        </div>
      </div>
    </DemoShell>
  );
}
