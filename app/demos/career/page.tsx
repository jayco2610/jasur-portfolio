"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import DemoShell from "@/components/demos/DemoShell";

const GITHUB_URL = "https://github.com/jayco2610/claude-outreach-system";

const STEP_DELAYS = [0, 1600, 3400, 5200, 7200, 8600];

const copy = {
  en: {
    title: "AI Career System",
    subtitle:
      "My own job search runs on this pipeline: a vacancy link dropped into Telegram comes back as a tailored cover letter logged to Google Sheets, with zero manual steps in between. Below is a walkthrough of one real run.",
    pitch:
      "A vacancy goes in, a ready cover letter comes out in about 80 seconds. 47 vacancies processed, the letter waits for my approval in Telegram before anything is sent.",
    hint: "Press Run the pipeline and watch a vacancy travel through all five steps.",
    run: "Run the pipeline",
    rerun: "Run it again",
    steps: [
      { name: "Vacancy received in Telegram", desc: "A link is all the system needs" },
      { name: "Claude parses the job description", desc: "Requirements extracted from the posting" },
      { name: "Match against the resume", desc: "Skills compared, gaps highlighted" },
      { name: "Cover letter generated", desc: "Tailored to this exact posting" },
      { name: "Logged to Google Sheets", desc: "Status, score, and letter in one row" },
    ],
    vacancy: { title: "Product Manager, AI product", meta: "Remote · Full-time · example posting" },
    requirements: ["2+ years in product", "AI tools in daily work", "English B2+", "Metrics-driven"],
    matches: [
      { skill: "Product: discovery, MVP, metrics", ok: true },
      { skill: "AI: Claude, n8n, prompt engineering", ok: true },
      { skill: "English: professional", ok: true },
      { skill: "Domain: fintech", ok: false },
    ],
    matchScore: "match",
    letterLabel: "Cover letter, shortened example from a real run",
    letter:
      "Hello! I am applying for the Product Manager role. Over the last year I shipped products hands-on: launched a foodtech MVP to first paying users and built an AI system that automates my own job search end to end. I work with metrics daily and use Claude and n8n in real workflows...",
    sheetLabel: "Google Sheets, new row",
    sheetRow: ["PM, AI product", "78%", "letter ready", "waiting approval"],
    doneTitle: "Done in ~80 seconds",
    doneDesc: "The letter waits for approval in Telegram. Nothing is sent automatically.",
    stats: [
      { value: "47", label: "vacancies processed" },
      { value: "~80 s", label: "per vacancy, average" },
      { value: "100%", label: "pipeline automation" },
    ],
    simNote: "Interface simulation based on real runs. The pipeline itself lives in Claude + n8n + Telegram; the code is public.",
    github: "Code on GitHub →",
  },
  ru: {
    title: "AI Career System",
    subtitle:
      "На этом пайплайне работает мой собственный поиск работы: ссылка на вакансию, брошенная в Telegram, возвращается готовым письмом в Google Sheets, без ручных шагов по пути. Ниже разбор одного реального прогона.",
    pitch:
      "На входе вакансия, на выходе готовое письмо примерно за 80 секунд. 47 вакансий обработано, письмо ждёт моего аппрува в Telegram, ничего не отправляется само.",
    hint: "Нажмите «Запустить пайплайн» и посмотрите, как вакансия проходит все пять шагов.",
    run: "Запустить пайплайн",
    rerun: "Запустить ещё раз",
    steps: [
      { name: "Вакансия получена в Telegram", desc: "Системе достаточно одной ссылки" },
      { name: "Claude парсит описание вакансии", desc: "Требования извлечены из текста" },
      { name: "Сравнение с резюме", desc: "Навыки сопоставлены, пробелы подсвечены" },
      { name: "Генерация письма", desc: "Под конкретную вакансию" },
      { name: "Запись в Google Sheets", desc: "Статус, скор и письмо в одной строке" },
    ],
    vacancy: { title: "Product Manager, AI-продукт", meta: "Удалённо · Полная занятость · пример вакансии" },
    requirements: ["2+ года в продукте", "AI-инструменты в работе", "Английский B2+", "Работа с метриками"],
    matches: [
      { skill: "Продукт: discovery, MVP, метрики", ok: true },
      { skill: "AI: Claude, n8n, промт-инжиниринг", ok: true },
      { skill: "Английский: professional", ok: true },
      { skill: "Домен: финтех", ok: false },
    ],
    matchScore: "совпадение",
    letterLabel: "Письмо, сокращённый пример из реального прогона",
    letter:
      "Здравствуйте! Откликаюсь на позицию Product Manager. За последний год я запускал продукты руками: довёл фудтех-MVP до первых платящих пользователей и построил AI-систему, которая полностью автоматизирует мой собственный поиск работы. Ежедневно работаю с метриками, использую Claude и n8n в реальных процессах...",
    sheetLabel: "Google Sheets, новая строка",
    sheetRow: ["PM, AI-продукт", "78%", "письмо готово", "ждёт аппрува"],
    doneTitle: "Готово за ~80 секунд",
    doneDesc: "Письмо ждёт аппрува в Telegram. Ничего не отправляется автоматически.",
    stats: [
      { value: "47", label: "вакансий обработано" },
      { value: "~80 с", label: "на вакансию в среднем" },
      { value: "100%", label: "автоматизация пайплайна" },
    ],
    simNote: "Симуляция интерфейса на основе реальных прогонов. Сам пайплайн работает в Claude + n8n + Telegram; код открыт.",
    github: "Код на GitHub →",
  },
};

export default function CareerDemoPage() {
  const { lang } = useLanguage();
  const c = copy[lang];

  // -1 idle; 0..4 step running; 5 done
  const [stage, setStage] = useState(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function run() {
    timers.current.forEach(clearTimeout);
    setStage(-1);
    timers.current = STEP_DELAYS.map((delay, i) => setTimeout(() => setStage(i), delay + 50));
  }

  const stepState = (i: number) => (stage >= 5 ? "done" : stage === i ? "active" : stage > i ? "done" : "idle");

  return (
    <DemoShell
      title={{ en: copy.en.title, ru: copy.ru.title }}
      subtitle={{ en: copy.en.subtitle, ru: copy.ru.subtitle }}
      pitch={{ en: copy.en.pitch, ru: copy.ru.pitch }}
      hint={{ en: copy.en.hint, ru: copy.ru.hint }}
      footer={null}
    >
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <button
          onClick={run}
          className="font-mono text-sm px-5 py-2.5 bg-[#7C3AED] text-white rounded hover:bg-[#6d28d9] transition-colors"
        >
          {stage >= 5 ? c.rerun : c.run}
        </button>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-[#a78bfa] hover:text-white transition-colors"
        >
          {c.github}
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-10 max-w-2xl">
        {c.stats.map((s) => (
          <div key={s.label} className="p-4 bg-[#111111] border border-[#1f1f1f] rounded-lg">
            <p className="font-mono text-xl font-bold text-[#a78bfa]">{s.value}</p>
            <p className="font-mono text-[10px] text-white/30 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="max-w-2xl space-y-3">
        {c.steps.map((step, i) => {
          const st = stepState(i);
          return (
            <div
              key={step.name}
              className={`p-5 bg-[#111111] border rounded-lg transition-colors ${
                st === "active" ? "border-[#7C3AED]/60" : st === "done" ? "border-emerald-500/30" : "border-[#1f1f1f]"
              }`}
            >
              <div className="flex items-center gap-3 mb-1">
                <span
                  className={`w-6 h-6 shrink-0 rounded-full flex items-center justify-center font-mono text-[10px] ${
                    st === "done"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : st === "active"
                      ? "bg-[#7C3AED]/20 text-[#a78bfa]"
                      : "bg-white/5 text-white/30"
                  }`}
                >
                  {st === "done" ? "✓" : i + 1}
                </span>
                <p className={`font-mono text-sm font-bold ${st === "idle" ? "text-white/35" : "text-white"}`}>{step.name}</p>
                {st === "active" && (
                  <span className="ml-auto w-3.5 h-3.5 border border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
                )}
              </div>
              <p className={`text-xs ml-9 ${st === "idle" ? "text-white/25" : "text-white/45"}`}>{step.desc}</p>

              {/* Step payloads */}
              {i === 0 && st !== "idle" && (
                <div className="ml-9 mt-3 px-3 py-2.5 bg-[#182533] rounded-lg max-w-sm animate-[fadeUp_0.4s_ease_both]">
                  <p className="font-mono text-[11px] text-white/85">🔗 {c.vacancy.title}</p>
                  <p className="font-mono text-[9px] text-white/40 mt-0.5">{c.vacancy.meta}</p>
                </div>
              )}
              {i === 1 && (st === "done" || st === "active") && stage >= 1 && (
                <div className="ml-9 mt-3 flex flex-wrap gap-1.5 animate-[fadeUp_0.4s_ease_both]">
                  {c.requirements.map((r) => (
                    <span key={r} className="font-mono text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 text-white/55">
                      {r}
                    </span>
                  ))}
                </div>
              )}
              {i === 2 && stage >= 2 && (
                <div className="ml-9 mt-3 space-y-1.5 animate-[fadeUp_0.4s_ease_both]">
                  {c.matches.map((m) => (
                    <p key={m.skill} className={`font-mono text-[11px] ${m.ok ? "text-emerald-400/90" : "text-amber-400/80"}`}>
                      {m.ok ? "✓" : "△"} {m.skill}
                    </p>
                  ))}
                  <p className="font-mono text-xs text-[#a78bfa] font-bold pt-1">78% {c.matchScore}</p>
                </div>
              )}
              {i === 3 && stage >= 3 && (
                <div className="ml-9 mt-3 px-4 py-3 bg-white/[0.03] border-l-2 border-[#7C3AED]/50 rounded-r animate-[fadeUp_0.4s_ease_both]">
                  <p className="font-mono text-[9px] text-white/35 uppercase tracking-wider mb-1.5">{c.letterLabel}</p>
                  <p className="text-xs text-white/65 leading-relaxed">{c.letter}</p>
                </div>
              )}
              {i === 4 && stage >= 4 && (
                <div className="ml-9 mt-3 overflow-x-auto animate-[fadeUp_0.4s_ease_both]">
                  <p className="font-mono text-[9px] text-white/35 uppercase tracking-wider mb-1.5">{c.sheetLabel}</p>
                  <div className="flex font-mono text-[10px] border border-emerald-500/25 rounded overflow-hidden w-max">
                    {c.sheetRow.map((cell) => (
                      <span key={cell} className="px-3 py-1.5 bg-emerald-500/5 text-white/60 border-r border-emerald-500/15 last:border-r-0 whitespace-nowrap">
                        {cell}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {stage >= 5 && (
          <div className="p-5 border border-emerald-500/40 bg-emerald-500/5 rounded-lg animate-[fadeUp_0.4s_ease_both]">
            <p className="font-mono text-sm font-bold text-emerald-400 mb-1">✓ {c.doneTitle}</p>
            <p className="text-xs text-white/50">{c.doneDesc}</p>
          </div>
        )}
      </div>

      <p className="font-mono text-[10px] text-white/25 mt-8 max-w-2xl">{c.simNote}</p>
    </DemoShell>
  );
}
