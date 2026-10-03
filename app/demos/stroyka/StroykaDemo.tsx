"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import DemoShell from "../DemoShell";
import PhoneFrame from "../PhoneFrame";
import Typed from "../_cx/Typed";
import { askDemo, DEMO_ERRORS, rub, type DemoError } from "../_cx/api";
import { DEVIATIONS, MESSAGES, NUMBERS, SITE_INFO, SPENT_TODAY, STAGES, type FactGroup } from "./data";

/* Отчёт прораба и контроль сметы. Слева панель владельца: цифры, график
   работ, отчёт дня, бюджет, отклонения, сводка. Справа телеграм прораба.

   По кнопке прораб «присылает» шесть сообщений за день: голосовые, фото
   объекта, фото накладной. ИИ разбирает каждое (симуляция: расшифровки и
   факты прописаны в data.ts), раскладывает факты по разделам отчёта, потом
   сверяет день с графиком и сметой и показывает отклонения. Сводку для
   владельца пишет живая модель (POST /api/demo, type: "stroyka"). */

const MSG_MS = 1500; // новое сообщение прораба
const READ_MS = 900; // столько ИИ разбирает сообщение
const CHECK_MS = 1300; // сверка с графиком и сметой

const copy = {
  en: {
    title: "Site reports and budget control",
    subtitle:
      "The foreman does not write reports. He sends voice notes and photos to Telegram, as usual. AI transcribes them, sorts them into work and materials, and checks them against the schedule and the estimate. The owner sees the whole site without calling anyone.",
    pitch:
      "Concrete overspend and a roofing delay show up the same evening, not at month end when the money is already gone.",
    hint: "Press The foreman sends a report, wait for the deviations, then press Write the summary.",
    footer:
      "Simulated data. On a real project this connects to the foreman's Telegram bot, the estimate and schedule from Excel or 1C, and speech recognition.",
    app: "Sites",
    run: "The foreman sends a report",
    running: "Receiving the report…",
    checking: "Checking against schedule and estimate…",
    again: "Run the day again",
    nums: {
      ready: (p: number) => `site completion, plan ${p}%`,
      spent: (b: string) => `spent of ${b}`,
      devs: "deviations today",
      handover: "handover forecast",
    },
    onTime: "on time",
    late: (d: number) => `+${d} days`,
    gantt: "Work schedule",
    week: "wk",
    today: "today",
    lateBy: (d: number) => `${d} days behind`,
    report: "Today's report",
    reportEmpty: "The report is built from the foreman's messages. Press the button above.",
    groups: { work: "Work", materials: "Materials", people: "Crew and equipment", issues: "Problems" } as Record<FactGroup, string>,
    src: { voice: "voice", photo: "photo", doc: "document" },
    budget: "Budget",
    planMark: "plan for today",
    todaySpent: "Today by delivery notes and receipts",
    vsPlan: "Difference from today's plan",
    devs: "Deviations",
    devsEmpty: "No deviations yet. The check runs after the foreman's report.",
    summary: "Owner's summary",
    summaryHint: "AI writes it from today's report and the deviations. Available once the report is in.",
    summaryBtn: "Write the summary",
    summaryBusy: "writing…",
    summaryAgain: "Write again",
    chatTitle: "Site log · bot",
    botHello: "Morning, Sergey! Send today's report: voice notes, photos, delivery notes. I'll handle the rest.",
    botDone: (n: number, f: number, d: number) => `Report collected: ${n} messages, ${f} facts, ${d} deviations. The owner has it.`,
    reading: "reading…",
    inReport: "in the report",
    transcript: "Transcript",
  },
  ru: {
    title: "Отчёт прораба и контроль сметы",
    subtitle:
      "Прораб не пишет отчёты: он присылает в Telegram голосовые и фото, как привык. ИИ расшифровывает их, раскладывает по работам и материалам и сверяет с графиком и сметой. Владелец видит объект целиком и никого не обзванивает.",
    pitch:
      "Перерасход бетона и отставание кровли видны в тот же вечер, а не в конце месяца, когда деньги уже потрачены.",
    hint: "Нажмите «Прораб отправляет отчёт», дождитесь отклонений, потом «Написать сводку».",
    footer:
      "Данные симулированы. На реальном проекте подключается Telegram-бот прораба, смета и график из Excel или 1С и распознавание речи.",
    app: "Объекты",
    run: "Прораб отправляет отчёт",
    running: "Принимаю отчёт…",
    checking: "Сверяю с графиком и сметой…",
    again: "Прогнать день ещё раз",
    nums: {
      ready: (p: number) => `готовность объекта, план ${p}%`,
      spent: (b: string) => `освоено из ${b}`,
      devs: "отклонений за день",
      handover: "сдача по прогнозу",
    },
    onTime: "в срок",
    late: (d: number) => `+${d} дня`,
    gantt: "График работ",
    week: "нед.",
    today: "сегодня",
    lateBy: (d: number) => `отстаёт на ${d} дня`,
    report: "Отчёт дня",
    reportEmpty: "Отчёт соберётся из сообщений прораба. Нажмите кнопку наверху.",
    groups: { work: "Работы", materials: "Материалы", people: "Люди и техника", issues: "Проблемы" } as Record<FactGroup, string>,
    src: { voice: "голосовое", photo: "фото", doc: "документ" },
    budget: "Бюджет",
    planMark: "план на сегодня",
    todaySpent: "Сегодня по накладным и чекам",
    vsPlan: "Отклонение от плана на сегодня",
    devs: "Отклонения",
    devsEmpty: "Отклонений пока нет. Сверка начнётся после отчёта прораба.",
    summary: "Сводка для владельца",
    summaryHint: "ИИ пишет её по отчёту дня и отклонениям. Доступна, когда отчёт собран.",
    summaryBtn: "Написать сводку",
    summaryBusy: "пишу…",
    summaryAgain: "Написать заново",
    chatTitle: "Стройжурнал · бот",
    botHello: "Доброе утро, Сергей! Присылайте отчёт за день: голосовые, фото, накладные. Остальное сделаю сам.",
    botDone: (n: number, f: number, d: number) => `Отчёт собран: ${n} сообщений, ${f} фактов, ${d} отклонения. Владелец его получил.`,
    reading: "разбираю…",
    inReport: "в отчёте",
    transcript: "Расшифровка",
  },
};

// Миллионы до двух знаков без лишних нулей: 5,83 млн ₽, 11,4 млн ₽.
function mln(n: number, lang: "en" | "ru"): string {
  const v = String(Number((n / 1_000_000).toFixed(2)));
  return lang === "en" ? `${v} M ₽` : `${v.replace(".", ",")} млн ₽`;
}

// Полоски голосового: одинаковые при каждой отрисовке, а не случайные.
const WAVE = [5, 9, 14, 8, 12, 16, 10, 6, 13, 9, 15, 7, 11, 14, 8, 5, 10, 13, 6, 9, 12, 7];

export default function StroykaDemo() {
  const { lang } = useLanguage();
  const c = copy[lang];

  // shown: сколько сообщений пришло; read: сколько разобрано.
  const [shown, setShown] = useState(0);
  const [read, setRead] = useState(0);
  const [phase, setPhase] = useState<"idle" | "receiving" | "checking" | "done">("idle");
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<DemoError | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [shown, read, phase]);

  function run() {
    timers.current.forEach(clearTimeout);
    setShown(0);
    setRead(0);
    setSummary(null);
    setError(null);
    setPhase("receiving");
    const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));
    MESSAGES.forEach((_, i) => {
      at(400 + i * MSG_MS, () => setShown(i + 1));
      at(400 + i * MSG_MS + READ_MS, () => setRead(i + 1));
    });
    const end = 400 + (MESSAGES.length - 1) * MSG_MS + READ_MS;
    at(end + 200, () => setPhase("checking"));
    at(end + 200 + CHECK_MS, () => setPhase("done"));
  }

  async function writeSummary() {
    setLoading(true);
    setError(null);
    const r = await askDemo<{ content: string }>({ type: "stroyka", lang });
    if (r.ok) setSummary(r.data.content);
    else setError(r.error);
    setLoading(false);
  }

  const done = phase === "done";
  const facts = MESSAGES.slice(0, read).flatMap((m) =>
    m.facts.map((f, i) => ({ ...f, key: `${m.id}-${i}`, kind: m.kind, dur: m.dur }))
  );
  const spent = SITE_INFO.spentBefore + (done ? SPENT_TODAY : 0);
  const diff = spent - SITE_INFO.planToday;
  const factCount = MESSAGES.reduce((s, m) => s + m.facts.length, 0);

  const nums = [
    {
      v: `${done ? NUMBERS.readyAfter : NUMBERS.readyBefore}%`,
      k: c.nums.ready(NUMBERS.readyPlan),
    },
    { v: mln(spent, lang), k: c.nums.spent(mln(SITE_INFO.budget, lang)) },
    { v: String(done ? DEVIATIONS.length : 0), k: c.nums.devs, bad: done },
    { v: done ? c.late(3) : c.onTime, k: c.nums.handover, warn: done },
  ];

  const pct = (x: number) => `${(x / SITE_INFO.budget) * 100}%`;
  const wk = (x: number) => `${(x / SITE_INFO.weeks) * 100}%`;

  return (
    <DemoShell
      title={{ en: copy.en.title, ru: copy.ru.title }}
      subtitle={{ en: copy.en.subtitle, ru: copy.ru.subtitle }}
      pitch={{ en: copy.en.pitch, ru: copy.ru.pitch }}
      hint={{ en: copy.en.hint, ru: copy.ru.hint }}
      footer={{ en: copy.en.footer, ru: copy.ru.footer }}
    >
      <div className="nm-dm-split">
        {/* Панель владельца */}
        <div className="nm-dm-grow nm-dm-app nm-cx-app">
          <div className="nm-cx-bar">
            <div className="nm-cx-brand">
              <span className="nm-cx-logo" aria-hidden="true">
                {SITE_INFO.contractor[lang].replace(/[«»]/g, "")[0]}
              </span>
              <div>
                <p className="nm-cx-brand-t">{SITE_INFO.name[lang]}</p>
                <p className="nm-cx-brand-s">
                  {SITE_INFO.place[lang]} · {SITE_INFO.contractor[lang]}
                </p>
              </div>
            </div>
            <button
              type="button"
              className={`nm-dm-btn${phase === "receiving" || phase === "checking" ? " is-busy" : ""}`}
              onClick={run}
              disabled={phase === "receiving" || phase === "checking"}
            >
              {phase === "receiving" ? c.running : phase === "checking" ? c.checking : done ? c.again : c.run}
            </button>
          </div>

          <div className="nm-dm-nums nm-cx-nums4">
            {nums.map((n) => (
              <div key={n.k}>
                <span className={`nm-dm-num-v${n.bad ? " is-bad" : ""}${n.warn ? " is-warn" : ""}`}>{n.v}</span>
                <span className="nm-dm-num-k">{n.k}</span>
              </div>
            ))}
          </div>

          {/* График работ */}
          <div className="nm-cx-card nm-cx-mt">
            <p className="nm-cx-card-t">{c.gantt}</p>
            <div
              className="nm-cx-gantt"
              style={{ "--cx-today": SITE_INFO.today / SITE_INFO.weeks } as React.CSSProperties}
            >
              <div className="nm-cx-gantt-axis">
                <span />
                <div className="nm-cx-gantt-track">
                  {[1, 4, 7, 10, 13, 16].map((w, i) => (
                    <span key={w} className={i % 2 ? "is-wide" : undefined} style={{ left: wk(w - 1) }}>
                      {c.week} {w}
                    </span>
                  ))}
                </div>
              </div>
              {STAGES.map((s) => {
                const p = done ? s.after : s.before;
                const late = done && s.late;
                const state = p >= 100 ? "done" : p > 0 ? "run" : late ? "late" : "plan";
                return (
                  <div key={s.name.en} className="nm-cx-gantt-row" data-st={state}>
                    <span className="nm-cx-gantt-n">{s.name[lang]}</span>
                    <div className="nm-cx-gantt-track">
                      <span className="nm-cx-gantt-bar" style={{ left: wk(s.start), width: wk(s.len) }}>
                        <i style={{ width: `${p}%` }} />
                      </span>
                      {late ? (
                        <span className="nm-cx-gantt-flag" style={{ left: `calc(${wk(s.start + s.len)} + 6px)` }}>
                          <span className="is-l">{c.lateBy(s.late!)}</span>
                          <span className="is-s">{c.late(s.late!)}</span>
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })}
              <div className="nm-cx-gantt-foot">
                <span />
                <div className="nm-cx-gantt-track">
                  <b>{c.today}</b>
                </div>
              </div>
            </div>
          </div>

          <div className="nm-cx-two nm-cx-mt">
            {/* Отчёт дня */}
            <div className="nm-cx-card">
              <p className="nm-cx-card-t">{c.report}</p>
              {facts.length === 0 ? (
                <p className="nm-cx-muted nm-cx-mt-s">{c.reportEmpty}</p>
              ) : (
                (["work", "materials", "people", "issues"] as FactGroup[]).map((g) => {
                  const list = facts.filter((f) => f.group === g);
                  if (list.length === 0) return null;
                  return (
                    <div key={g} className="nm-cx-facts">
                      <p className="nm-cx-sub">{c.groups[g]}</p>
                      <ul>
                        {list.map((f) => (
                          <li key={f.key} className={`nm-dm-in${f.tone ? ` is-${f.tone}` : ""}`}>
                            <span>{f.text[lang]}</span>
                            <span className="nm-cx-src">
                              {c.src[f.kind]}
                              {f.dur ? ` ${f.dur}` : ""}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })
              )}
            </div>

            <div className="nm-cx-stack">
              {/* Бюджет */}
              <div className="nm-cx-card">
                <div className="nm-cx-card-h">
                  <p className="nm-cx-card-t">{c.budget}</p>
                  <p className="nm-cx-muted">
                    {rub(spent)} / {rub(SITE_INFO.budget)}
                  </p>
                </div>
                <div className="nm-cx-budget">
                  <span className="nm-cx-budget-fill" style={{ width: pct(Math.min(spent, SITE_INFO.planToday)) }} />
                  {diff > 0 && (
                    <span
                      className="nm-cx-budget-over"
                      style={{ left: pct(SITE_INFO.planToday), width: pct(diff) }}
                    />
                  )}
                  <span className="nm-cx-budget-mark" style={{ left: pct(SITE_INFO.planToday) }} />
                </div>
                <p className="nm-cx-budget-k">
                  <span style={{ left: pct(SITE_INFO.planToday) }}>
                    {c.planMark}: {mln(SITE_INFO.planToday, lang)}
                  </span>
                </p>
                <dl className="nm-cx-kv is-num nm-cx-mt-s">
                  <div>
                    <dt>{c.todaySpent}</dt>
                    <dd>{done ? `+${rub(SPENT_TODAY)}` : rub(0)}</dd>
                  </div>
                  <div>
                    <dt>{c.vsPlan}</dt>
                    <dd className={diff > 0 ? "is-bad" : "is-ok"}>
                      {diff > 0 ? "+" : "−"}
                      {rub(Math.abs(diff))}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Отклонения */}
              <div className="nm-cx-card">
                <p className="nm-cx-card-t">{c.devs}</p>
                {!done ? (
                  <p className="nm-cx-muted nm-cx-mt-s">
                    {phase === "checking" ? (
                      <span className="nm-cx-sorting">
                        <span className="nm-dm-spin" aria-hidden="true" />
                        {c.checking}
                      </span>
                    ) : (
                      c.devsEmpty
                    )}
                  </p>
                ) : (
                  <div className="nm-cx-devs">
                    {DEVIATIONS.map((d, i) => (
                      <div
                        key={d.title.en}
                        className={`nm-cx-dev is-${d.tone} nm-dm-in`}
                        style={{ animationDelay: `${i * 140}ms` }}
                      >
                        <p className="nm-cx-dev-t">
                          {d.title[lang]}
                          {d.money ? <span className="nm-cx-dev-m">+{rub(d.money)}</span> : null}
                        </p>
                        <p className="nm-cx-dev-d">{d.text[lang]}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Сводка для владельца: живая модель */}
          <div className="nm-cx-card nm-cx-mt nm-cx-summary">
            <div className="nm-cx-card-h">
              <p className="nm-cx-card-t">
                <span className="nm-cx-ai">AI</span> {c.summary}
              </p>
              <button
                type="button"
                className={`nm-dm-btn${loading ? " is-busy" : ""}`}
                onClick={writeSummary}
                disabled={!done || loading}
              >
                {loading ? c.summaryBusy : summary ? c.summaryAgain : c.summaryBtn}
              </button>
            </div>
            {summary ? (
              <p className="nm-cx-summary-t">
                <Typed text={summary} />
              </p>
            ) : (
              <p className="nm-cx-muted nm-cx-mt-s">{c.summaryHint}</p>
            )}
            {error && <p className="nm-dm-err">{DEMO_ERRORS[lang][error]}</p>}
          </div>
        </div>

        {/* Телеграм прораба */}
        <PhoneFrame time="18:02">
          <div className="nm-dm-chat-h">
            <div className="nm-dm-ava">
              <span className="nm-cx-ava-k" aria-hidden="true" />
            </div>
            <div>
              <p className="nm-dm-chat-t">{c.chatTitle}</p>
              <p className="nm-dm-chat-s">online</p>
            </div>
          </div>
          <div ref={chatRef} className="nm-dm-chat nm-cx-site-chat">
            <div className="nm-dm-msg is-wide">
              <p>{c.botHello}</p>
              <p className="nm-dm-msg-m">07:30</p>
            </div>
            {MESSAGES.slice(0, shown).map((m, i) => {
              const isRead = i < read;
              return (
                <div key={m.id} className="nm-cx-out nm-dm-in">
                  <div className={`nm-dm-msg is-out is-wide nm-cx-m is-${m.kind}`}>
                    {m.kind === "voice" ? (
                      <>
                        <span className="nm-cx-voice">
                          <span className="nm-cx-play" aria-hidden="true" />
                          <span className="nm-cx-wave" aria-hidden="true">
                            {WAVE.map((h, j) => (
                              <i key={j} style={{ height: h }} />
                            ))}
                          </span>
                          <span className="nm-cx-dur">{m.dur}</span>
                        </span>
                        {isRead && (
                          <span className="nm-cx-tr nm-dm-in">
                            <b>{c.transcript}:</b> {m.text[lang]}
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className={`nm-cx-photo is-${m.kind}`} aria-hidden="true">
                          {m.kind === "doc" ? (
                            <>
                              <i />
                              <i />
                              <i />
                              <i />
                            </>
                          ) : null}
                        </span>
                        <span className="nm-cx-cap">{m.text[lang]}</span>
                      </>
                    )}
                    <span className="nm-dm-msg-m nm-cx-m-meta">{m.time}</span>
                  </div>
                  <p className={`nm-cx-status${isRead ? " is-ok" : ""}`}>
                    {isRead ? (
                      `✓ ${c.inReport}`
                    ) : (
                      <>
                        <span className="nm-dm-spin" aria-hidden="true" /> {c.reading}
                      </>
                    )}
                  </p>
                </div>
              );
            })}
            {done && (
              <div className="nm-dm-msg is-wide nm-dm-in">
                <p>{c.botDone(MESSAGES.length, factCount, DEVIATIONS.length)}</p>
                <p className="nm-dm-msg-m">18:02</p>
              </div>
            )}
          </div>
        </PhoneFrame>
      </div>
    </DemoShell>
  );
}
