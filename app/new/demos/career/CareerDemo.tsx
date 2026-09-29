"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import DemoShell from "../DemoShell";

/* AI Career System в макете. Перенос app/demos/career/page.tsx: тексты,
   задержки шагов и логика прогона те же, строка в строку. Меняется только
   разметка: классы .nm-dm-* вместо классов старого сайта. Сети демо не
   трогает, всё считается в браузере по таймерам. */

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

export default function CareerDemo() {
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
      <div className="nm-dm-row">
        <button type="button" onClick={run} className="nm-dm-btn">
          {stage >= 5 ? c.rerun : c.run}
        </button>
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="nm-dm-link">
          {c.github}
        </a>
      </div>

      {/* Цифры */}
      <div className="nm-dm-nums nm-dm-w nm-dm-mt">
        {c.stats.map((s) => (
          <div key={s.label}>
            <span className="nm-dm-num-v">{s.value}</span>
            <span className="nm-dm-num-k">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Шаги пайплайна */}
      <div className="nm-dm-w nm-dm-stack nm-dm-mt">
        {c.steps.map((step, i) => {
          const st = stepState(i);
          return (
            <div key={step.name} className={`nm-dm-panel${st === "idle" ? "" : " is-on"}`}>
              <div className="nm-dm-step-h">
                <span className={`nm-dm-step-no${st === "done" ? " is-done" : st === "active" ? " is-run" : ""}`}>
                  {st === "done" ? "✓" : i + 1}
                </span>
                <p className={`nm-dm-step-n${st === "idle" ? " is-idle" : ""}`}>{step.name}</p>
                {st === "active" && <span className="nm-dm-spin" aria-hidden="true" />}
              </div>
              <p className={`nm-dm-step-d${st === "idle" ? " is-idle" : ""}`}>{step.desc}</p>

              {/* Что выдаёт каждый шаг */}
              {i === 0 && st !== "idle" && (
                <div className="nm-dm-step-x nm-dm-in">
                  <div className="nm-dm-vac">
                    <p>
                      <span className="nm-dm-emo">🔗</span> {c.vacancy.title}
                    </p>
                    <p>{c.vacancy.meta}</p>
                  </div>
                </div>
              )}
              {i === 1 && (st === "done" || st === "active") && stage >= 1 && (
                <div className="nm-dm-step-x nm-dm-chips nm-dm-in">
                  {c.requirements.map((r) => (
                    <span key={r}>{r}</span>
                  ))}
                </div>
              )}
              {i === 2 && stage >= 2 && (
                <div className="nm-dm-step-x nm-dm-match nm-dm-in">
                  {c.matches.map((m) => (
                    <p key={m.skill} className={m.ok ? undefined : "is-gap"}>
                      {m.ok ? "✓" : "△"} {m.skill}
                    </p>
                  ))}
                  <p className="is-score">78% {c.matchScore}</p>
                </div>
              )}
              {i === 3 && stage >= 3 && (
                <div className="nm-dm-step-x nm-dm-quote nm-dm-in">
                  <p className="nm-dm-quote-k">{c.letterLabel}</p>
                  <p className="nm-dm-quote-t">{c.letter}</p>
                </div>
              )}
              {i === 4 && stage >= 4 && (
                <div className="nm-dm-step-x nm-dm-scroll-x nm-dm-in">
                  <p className="nm-dm-quote-k">{c.sheetLabel}</p>
                  <div className="nm-dm-sheet">
                    {c.sheetRow.map((cell) => (
                      <span key={cell}>{cell}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {stage >= 5 && (
          <div className="nm-dm-panel is-on nm-dm-in">
            <p className="nm-dm-done-t">✓ {c.doneTitle}</p>
            <p className="nm-dm-panel-d">{c.doneDesc}</p>
          </div>
        )}
      </div>

      <p className="nm-dm-note nm-dm-w nm-dm-mt">{c.simNote}</p>
    </DemoShell>
  );
}
