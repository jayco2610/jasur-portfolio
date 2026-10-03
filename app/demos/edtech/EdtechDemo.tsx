"use client";

import { useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import DemoShell from "../DemoShell";
import Typed from "../_cx/Typed";
import { askDemo, DEMO_ERRORS, type DemoError } from "../_cx/api";
import { CRITERIA, SCHOOL, STUDENTS, STUDENT_ANSWER, TASK, type Risk } from "./data";

/* Проверка ДЗ и риск оттока. Слева проверка домашнего задания: ответ
   ученика можно поправить, живая модель оценивает его по четырём критериям
   курса и пишет комментарии (POST /api/demo, type: "homework", только текст
   ответа: задание и критерии сервер берёт из data.ts). Справа ученики потока
   со статусом риска: почему ИИ отметил ученика и что ему написать. Риск и
   подсказки симулированы. */

type Result = { lang: "en" | "ru"; scores: { score: number; comment: string }[]; summary: string };

const PASS = 7; // из 10: с этого балла работа зачтена

const copy = {
  en: {
    title: "Homework review and churn risk",
    subtitle:
      "An online school curator spends 15-20 minutes on one homework and notices a student is about to quit only when they ask for a refund. Here AI grades work against the course rubric in seconds and checks student activity every day.",
    pitch:
      "Students get homework feedback within the hour, and the curator only confirms the grade. AI notices students who start drifting away while there is still time to bring them back.",
    hint: "Press Check with AI under the student's answer. Edit the answer and check again if you like. On the right, pick a student at risk.",
    footer:
      "Simulated data. On a real project this connects to the school's platform (GetCourse, Stepik, or a custom LMS), the course rubric, and the student chat in Telegram.",
    nums: {
      checked: "assignments checked by AI today",
      time: "per assignment, 15-20 min by hand",
      risk: "students at risk of 120",
      back: "came back after a message, this month",
    },
    timeVal: "40 s",
    review: "Homework review",
    task: "Assignment",
    answer: "Student's answer",
    editable: "you can edit it",
    reset: "Restore the original answer",
    check: "Check with AI",
    checking: "checking…",
    recheck: "Check again",
    rubric: "Rubric",
    pending: "AI is grading against the rubric…",
    notYet: "not checked yet",
    upTo: (n: number) => `max ${n}`,
    total: "Total",
    of: (n: number, m: number) => `${n} of ${m}`,
    passed: "passed",
    rework: "needs rework",
    feedback: "Feedback for the student",
    approve: "Approve and send",
    sent: "Sent to the student's account. The curator checked the grade.",
    churn: "Churn risk",
    cohort: "Cohort 14 · 8 of 120 shown",
    tabRisk: "At risk",
    tabAll: "All",
    risk: { high: "high risk", medium: "medium risk", ok: "on track" } as Record<Risk, string>,
    last: "last visit",
    hw: "assignments",
    watched: "lessons watched",
    why: "Why AI flagged this student",
    suggest: "AI suggests writing",
    sendTg: "Send in Telegram",
    sentTg: "Sent in Telegram",
    okNote: "Activity is normal, no message needed.",
  },
  ru: {
    title: "Проверка ДЗ и риск оттока",
    subtitle:
      "Куратор онлайн-школы тратит на одну домашку 15-20 минут, а то, что ученик вот-вот бросит курс, замечает, когда тот уже просит возврат. Здесь ИИ проверяет работу по критериям курса за секунды и каждый день смотрит на активность учеников.",
    pitch:
      "Ученик получает разбор домашки в тот же час, куратор только подтверждает оценку. Тех, кто начал пропадать, ИИ замечает по активности, пока их ещё можно вернуть.",
    hint: "Нажмите «Проверить с ИИ» под ответом ученика. Ответ можно исправить и проверить снова. Справа выберите ученика из зоны риска.",
    footer:
      "Данные симулированы. На реальном проекте подключается платформа школы (GetCourse, Stepik или своя LMS), критерии курса и чат с учениками в Telegram.",
    nums: {
      checked: "ДЗ проверено ИИ сегодня",
      time: "на одну работу, вручную 15-20 мин",
      risk: "учеников в зоне риска из 120",
      back: "вернулись после сообщения за месяц",
    },
    timeVal: "40 с",
    review: "Проверка ДЗ",
    task: "Задание",
    answer: "Ответ ученика",
    editable: "можно исправить",
    reset: "Вернуть исходный ответ",
    check: "Проверить с ИИ",
    checking: "проверяю…",
    recheck: "Проверить снова",
    rubric: "Критерии",
    pending: "ИИ проверяет по критериям…",
    notYet: "ещё не проверено",
    upTo: (n: number) => `до ${n}`,
    total: "Итого",
    of: (n: number, m: number) => `${n} из ${m}`,
    passed: "зачтено",
    rework: "на доработку",
    feedback: "Комментарий для ученика",
    approve: "Подтвердить и отправить",
    sent: "Отправлено в личный кабинет ученика. Куратор подтвердил оценку.",
    churn: "Риск оттока",
    cohort: "Поток 14 · показаны 8 из 120",
    tabRisk: "В зоне риска",
    tabAll: "Все",
    risk: { high: "высокий риск", medium: "средний риск", ok: "в норме" } as Record<Risk, string>,
    last: "заходил",
    hw: "ДЗ",
    watched: "уроков просмотрено",
    why: "Почему ИИ отметил ученика",
    suggest: "ИИ предлагает написать",
    sendTg: "Отправить в Telegram",
    sentTg: "Отправлено в Telegram",
    okNote: "Активность в норме, писать не нужно.",
  },
};

const MAX = CRITERIA.reduce((s, c) => s + c.max, 0);

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
}

export default function EdtechDemo() {
  const { lang } = useLanguage();
  const c = copy[lang];

  // Свой текст ответа; null значит исходный ответ ученика на языке страницы.
  const [own, setOwn] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<DemoError | null>(null);
  const [checked, setChecked] = useState(46);
  const [approved, setApproved] = useState(false);
  // Тот же ответ на том же языке модель второй раз не проверяет: результат
  // берётся из памяти, общий дневной лимит бесплатных моделей не тратится.
  const cache = useRef(new Map<string, Result>());

  const [tab, setTab] = useState<"risk" | "all">("risk");
  const [picked, setPicked] = useState(STUDENTS[0].id);
  const [sentTo, setSentTo] = useState<Record<string, boolean>>({});

  const answer = own ?? STUDENT_ANSWER.text[lang];
  const res = result && result.lang === lang ? result : null;
  const total = res ? res.scores.reduce((s, x) => s + x.score, 0) : 0;

  async function check() {
    setError(null);
    setApproved(false);
    const key = `${lang}:${answer.trim()}`;
    const cached = cache.current.get(key);
    if (cached) {
      setResult(cached);
      return;
    }
    setLoading(true);
    const r = await askDemo<{ content: string; result: { scores: { score: number; comment: string }[]; summary: string } }>({
      type: "homework",
      lang,
      answer: answer.trim(),
    });
    if (r.ok && r.data.result) {
      const res: Result = { lang, ...r.data.result };
      cache.current.set(key, res);
      setResult(res);
      setChecked((n) => n + 1);
    } else {
      setError(r.ok ? "unavailable" : r.error);
    }
    setLoading(false);
  }

  const list = STUDENTS.filter((s) => tab === "all" || s.risk !== "ok");
  const atRisk = STUDENTS.filter((s) => s.risk !== "ok").length;
  const st = STUDENTS.find((s) => s.id === picked) ?? STUDENTS[0];

  const nums = [
    { v: String(checked), k: c.nums.checked },
    { v: c.timeVal, k: c.nums.time, good: true },
    { v: String(atRisk), k: c.nums.risk, warn: true },
    { v: "11", k: c.nums.back },
  ];

  return (
    <DemoShell
      title={{ en: copy.en.title, ru: copy.ru.title }}
      subtitle={{ en: copy.en.subtitle, ru: copy.ru.subtitle }}
      pitch={{ en: copy.en.pitch, ru: copy.ru.pitch }}
      hint={{ en: copy.en.hint, ru: copy.ru.hint }}
      footer={{ en: copy.en.footer, ru: copy.ru.footer }}
    >
      <div className="nm-dm-app nm-cx-app">
        <div className="nm-cx-bar">
          <div className="nm-cx-brand">
            <span className="nm-cx-logo" aria-hidden="true">
              {SCHOOL.name[lang].replace(/^.*«|»/g, "")[0] ?? "M"}
            </span>
            <div>
              <p className="nm-cx-brand-t">{SCHOOL.name[lang]}</p>
              <p className="nm-cx-brand-s">
                {SCHOOL.course[lang]} · {SCHOOL.curator[lang]}
              </p>
            </div>
          </div>
        </div>

        <div className="nm-dm-nums nm-cx-nums4">
          {nums.map((n) => (
            <div key={n.k}>
              <span className={`nm-dm-num-v${n.good ? " is-good" : ""}${n.warn ? " is-warn" : ""}`}>{n.v}</span>
              <span className="nm-dm-num-k">{n.k}</span>
            </div>
          ))}
        </div>

        <div className="nm-cx-two is-edu nm-cx-mt">
          {/* Проверка ДЗ */}
          <div className="nm-cx-card">
            <div className="nm-cx-card-h">
              <p className="nm-cx-card-t">{c.review}</p>
              <span className="nm-cx-chip" data-tone="violet">
                {lang === "en" ? "Assignment" : "ДЗ"} {TASK.code}
              </span>
            </div>

            <p className="nm-cx-sub">
              {c.task}: {TASK.title[lang]}
            </p>
            <p className="nm-cx-body">{TASK.text[lang]}</p>

            <div className="nm-cx-student">
              <span className="nm-dm-ava">{initials(STUDENT_ANSWER.name[lang])}</span>
              <div>
                <p className="nm-cx-student-n">{STUDENT_ANSWER.name[lang]}</p>
                <p className="nm-cx-muted">
                  {c.answer} · {STUDENT_ANSWER.sent[lang]} · {c.editable}
                </p>
              </div>
            </div>
            <textarea
              className="nm-dm-area nm-cx-area"
              rows={6}
              maxLength={1500}
              value={answer}
              onChange={(e) => setOwn(e.target.value)}
              aria-label={c.answer}
            />
            <div className="nm-cx-actions">
              <button
                type="button"
                className={`nm-dm-btn${loading ? " is-busy" : ""}`}
                onClick={check}
                disabled={loading || answer.trim().length < 20}
              >
                {loading ? c.checking : res ? c.recheck : c.check}
              </button>
              {own !== null && (
                <button type="button" className="nm-dm-btn2" onClick={() => setOwn(null)} disabled={loading}>
                  {c.reset}
                </button>
              )}
            </div>
            {error && <p className="nm-dm-err">{DEMO_ERRORS[lang][error]}</p>}

            {/* Критерии */}
            <div className="nm-cx-card-h nm-cx-mt">
              <p className="nm-cx-sub nm-cx-sub-0">{c.rubric}</p>
              {loading ? (
                <span className="nm-cx-sorting">
                  <span className="nm-dm-spin" aria-hidden="true" />
                  {c.pending}
                </span>
              ) : !res ? (
                <span className="nm-cx-muted">{c.notYet}</span>
              ) : null}
            </div>
            <ol className={`nm-cx-rubric${loading ? " is-busy" : ""}`}>
              {CRITERIA.map((cr, i) => {
                const sc = res?.scores[i];
                const tone = sc ? (sc.score === cr.max ? "ok" : sc.score === 0 ? "bad" : "warn") : "none";
                return (
                  <li key={cr.name.en} data-tone-s={tone}>
                    <div className="nm-cx-rubric-h">
                      <span className="nm-cx-rubric-n">
                        <b>{i + 1}</b>
                        {cr.name[lang]}
                      </span>
                      <span className="nm-cx-score">
                        <span className="nm-cx-dots" aria-hidden="true">
                          {Array.from({ length: cr.max }, (_, j) => (
                            <i key={j} className={sc && j < sc.score ? "is-on" : undefined} />
                          ))}
                        </span>
                        {sc ? `${sc.score}/${cr.max}` : c.upTo(cr.max)}
                      </span>
                    </div>
                    {sc && <p className="nm-cx-rubric-c nm-dm-in">{sc.comment}</p>}
                  </li>
                );
              })}
            </ol>

            {res && (
              <div className="nm-cx-result nm-dm-in">
                <div className="nm-cx-total">
                  <span className="nm-cx-total-k">{c.total}</span>
                  <span className="nm-cx-total-v">{c.of(total, MAX)}</span>
                  <span className="nm-cx-chip" data-tone={total >= PASS ? "ok" : "amber"}>
                    {total >= PASS ? c.passed : c.rework}
                  </span>
                </div>
                <div className="nm-dm-quote is-ai">
                  <p className="nm-dm-quote-k">{c.feedback}</p>
                  <p className="nm-dm-quote-t">
                    <Typed text={res.summary} />
                  </p>
                </div>
                {approved ? (
                  <p className="nm-cx-note is-ok">✓ {c.sent}</p>
                ) : (
                  <div className="nm-cx-actions">
                    <button type="button" className="nm-dm-btn" onClick={() => setApproved(true)}>
                      {c.approve}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Риск оттока */}
          <div className="nm-cx-card">
            <div className="nm-cx-card-h">
              <div>
                <p className="nm-cx-card-t">{c.churn}</p>
                <p className="nm-cx-muted nm-cx-mts">{c.cohort}</p>
              </div>
              <div className="nm-cx-seg" role="group">
                {(["risk", "all"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={tab === t ? "is-on" : undefined}
                    aria-pressed={tab === t}
                    onClick={() => setTab(t)}
                  >
                    {t === "risk" ? `${c.tabRisk} · ${atRisk}` : `${c.tabAll} · ${STUDENTS.length}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="nm-cx-people">
              {list.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`nm-cx-person${picked === s.id ? " is-sel" : ""}`}
                  data-risk={s.risk}
                  onClick={() => setPicked(s.id)}
                >
                  <span className="nm-dm-ava">{initials(s.name[lang])}</span>
                  <span className="nm-cx-person-m">
                    <span className="nm-cx-person-n">{s.name[lang]}</span>
                    <span className="nm-cx-person-s">
                      {c.last}: {s.last[lang]} · {c.hw} {s.hw}/{s.hwTotal} · {s.watched}%
                    </span>
                  </span>
                  <span className={`nm-cx-chip is-risk-${s.risk}`}>{c.risk[s.risk]}</span>
                </button>
              ))}
            </div>

            <div className="nm-cx-pick" key={st.id}>
              <div className="nm-cx-pick-h">
                <span className="nm-dm-ava">{initials(st.name[lang])}</span>
                <div>
                  <p className="nm-cx-student-n">{st.name[lang]}</p>
                  <p className="nm-cx-muted">
                    {c.last}: {st.last[lang]}
                  </p>
                </div>
                <span className={`nm-cx-chip is-risk-${st.risk}`}>{c.risk[st.risk]}</span>
              </div>

              <div className="nm-cx-meters">
                <div>
                  <span>
                    {c.hw} {st.hw}/{st.hwTotal}
                  </span>
                  <i style={{ "--cx-v": `${(st.hw / st.hwTotal) * 100}%` } as React.CSSProperties} />
                </div>
                <div>
                  <span>
                    {c.watched} {st.watched}%
                  </span>
                  <i style={{ "--cx-v": `${st.watched}%` } as React.CSSProperties} />
                </div>
              </div>

              {st.signals && st.message ? (
                <>
                  <p className="nm-cx-sub">{c.why}</p>
                  <ul className="nm-cx-signals">
                    {st.signals.map((sg) => (
                      <li key={sg.en}>{sg[lang]}</li>
                    ))}
                  </ul>
                  <p className="nm-cx-sub">
                    <span className="nm-cx-ai">AI</span> {c.suggest}
                  </p>
                  <div className="nm-cx-bubble">
                    <Typed text={st.message[lang]} step={4} />
                  </div>
                  {sentTo[st.id] ? (
                    <p className="nm-cx-note is-ok">✓ {c.sentTg}</p>
                  ) : (
                    <div className="nm-cx-actions">
                      <button
                        type="button"
                        className="nm-dm-btn"
                        onClick={() => setSentTo((m) => ({ ...m, [st.id]: true }))}
                      >
                        {c.sendTg}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="nm-cx-note is-ok">{c.okNote}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DemoShell>
  );
}
