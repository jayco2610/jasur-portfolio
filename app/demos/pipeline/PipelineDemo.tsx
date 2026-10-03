"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import DemoShell from "../DemoShell";
import Typed from "../_cx/Typed";
import { askDemo, DEMO_ERRORS, rub, type DemoError } from "../_cx/api";
import { REQUESTS, VENDOR, totals, totalSec, type Req } from "./data";

/* От заявки до КП за две минуты. Цепочка из пяти агентов: разбор заявки,
   расчёт по прайсу, остатки и сроки, сборка КП, сделка в CRM. Каждый шаг
   показывает вход, выход, вызванные инструменты и время, как журнал работы
   агента. Справа по ходу собирается документ КП и карточка сделки.

   Разбор, расчёт, склад и CRM симулированы (data.ts), время шагов тоже:
   часы показывают, сколько шли бы настоящие вызовы, сам прогон занимает
   секунд десять. Вступительный абзац КП пишет живая модель (POST /api/demo,
   type: "pipeline", номер заявки). Запрос к ней уходит в момент запуска,
   а шаг 4 ждёт ответа: если модель недоступна, шаг честно говорит об этом,
   и цепочка идёт дальше без абзаца. */

const STEP_MS = [1600, 2300, 2900, 2300, 1400];

type Ai = { state: "idle" | "loading" | "ok" | "error"; text?: string; error?: DemoError; lang?: "en" | "ru" };

const copy = {
  en: {
    title: "From request to quote in two minutes",
    subtitle:
      "A sales manager spends 2-3 hours on one quote: read the request, price it, ask the warehouse, build the document, log the deal. Here a chain of five agents does it. Each step shows its input, its output, and the tool it called.",
    pitch:
      "The client gets your quote while still choosing between you and a competitor. The manager reviews the finished document and makes the call.",
    hint: "Pick a request and press Run the agents. The quote's opening paragraph is written by a live model.",
    footer:
      "Simulated data. On a real project this connects to email or the website form, prices and stock from 1C or MoySklad, the supplier's API, and amoCRM or Bitrix24.",
    app: "Sales agent",
    appSub: "request to quote · 5 agents",
    ready: "ready",
    working: "working",
    finished: "done",
    pick: "Incoming requests",
    run: "Run the agents",
    rerun: "Run again",
    runningBtn: "agents at work…",
    nums: { time: "run time", calls: "tool calls", steps: "steps done", manual: "by hand" },
    manual: "2-3 h",
    steps: ["Parse the request", "Price it", "Stock and lead times", "Build the quote", "CRM deal and follow-up"],
    input: "Input",
    output: "Output",
    tools: "Tools",
    waitAi: "waiting for the model…",
    inputs: [
      (r: Req) => `Request via ${r.channel.en}, ${r.text.en.length} characters`,
      () => "Product, volume, and service from step 1",
      () => "Lines and quantities from step 2, the client's deadline",
      () => "Pricing, timeline, client details",
      (r: Req) => `Client, total, quote No. ${r.kpNo}`,
    ],
    item: "Item",
    qty: "Qty",
    price: "Price",
    sum: "Total",
    materials: "Materials",
    works: "Work and services",
    discount: (p: number) => `Volume discount ${p}% on materials`,
    total: "Total incl. VAT",
    pdf: "Quote PDF, 2 pages",
    pdfStamp: "PDF · 2 pages",
    introOk: "Opening paragraph written by the model",
    introFail: "No opening paragraph: the model did not answer",
    retry: "Try the paragraph again",
    dealCreated: (id: string) => `Deal No. ${id} created`,
    stage: "Stage: quote sent",
    draftMail: "The email with the quote is in the manager's drafts until reviewed",
    doneTitle: (s: string) => `Quote ready in ${s}`,
    doneSub: "By hand a manager spends 2-3 hours on a quote like this. The email waits for their review in the CRM.",
    min: "min",
    sec: "s",
    doc: "Quote",
    docNo: "Quote No.",
    to: "To",
    docEmpty: "The document builds up as the agents work.",
    writing: "The model is writing the opening…",
    timeline: "Timeline",
    validity: "Valid for 10 days",
    manager: "Manager",
    crm: "amoCRM · deal",
    budget: "Budget",
    owner: "Owner",
    task: "Task",
    pipelineStages: ["New request", "Pricing", "Quote sent", "Negotiation", "Won"],
  },
  ru: {
    title: "От заявки до КП за две минуты",
    subtitle:
      "Менеджер по продажам тратит на одно коммерческое предложение 2-3 часа: прочитать заявку, посчитать, спросить склад, собрать документ, завести сделку. Здесь это делает цепочка из пяти агентов. Каждый шаг показывает, что получил на входе, что выдал и какой инструмент вызвал.",
    pitch:
      "Клиент получает КП, пока ещё выбирает между вами и конкурентом. Менеджер проверяет готовый документ и звонит.",
    hint: "Выберите заявку и нажмите «Запустить агентов». Вступление к КП пишет живая модель.",
    footer:
      "Данные симулированы. На реальном проекте подключается почта или форма на сайте, прайс и остатки из 1С или МойСклад, API поставщика и amoCRM или Битрикс24.",
    app: "Агент продаж",
    appSub: "заявка в КП · 5 агентов",
    ready: "готов",
    working: "в работе",
    finished: "готово",
    pick: "Входящие заявки",
    run: "Запустить агентов",
    rerun: "Запустить ещё раз",
    runningBtn: "агенты работают…",
    nums: { time: "время прогона", calls: "вызовов инструментов", steps: "шагов готово", manual: "вручную" },
    manual: "2-3 ч",
    steps: ["Разбор заявки", "Расчёт по прайсу", "Остатки и сроки", "Сборка КП", "Сделка в CRM и задача"],
    input: "Вход",
    output: "Выход",
    tools: "Инструменты",
    waitAi: "жду модель…",
    inputs: [
      (r: Req) => `Заявка из канала «${r.channel.ru}», ${r.text.ru.length} знаков`,
      () => "Товар, объём и услуга из шага 1",
      () => "Позиции и количество из шага 2, срок клиента",
      () => "Расчёт, сроки, данные клиента",
      (r: Req) => `Клиент, сумма, КП № ${r.kpNo}`,
    ],
    item: "Позиция",
    qty: "Кол-во",
    price: "Цена",
    sum: "Сумма",
    materials: "Материалы",
    works: "Работы и услуги",
    discount: (p: number) => `Скидка ${p}% на материалы за объём`,
    total: "Итого с НДС",
    pdf: "КП в PDF, 2 страницы",
    pdfStamp: "PDF · 2 стр.",
    introOk: "Вступление написала модель",
    introFail: "Без вступления: модель не ответила",
    retry: "Повторить вступление",
    dealCreated: (id: string) => `Сделка № ${id} создана`,
    stage: "Этап: КП отправлено",
    draftMail: "Письмо с КП лежит в черновиках менеджера до проверки",
    doneTitle: (s: string) => `КП готово за ${s}`,
    doneSub: "Вручную менеджер тратит на такое КП 2-3 часа. Письмо ждёт его проверки в CRM.",
    min: "мин",
    sec: "с",
    doc: "КП",
    docNo: "КП №",
    to: "Кому",
    docEmpty: "Документ собирается по ходу работы агентов.",
    writing: "Модель пишет вступление…",
    timeline: "Сроки",
    validity: "Действует 10 дней",
    manager: "Менеджер",
    crm: "amoCRM · сделка",
    budget: "Бюджет",
    owner: "Ответственный",
    task: "Задача",
    pipelineStages: ["Новая заявка", "Расчёт", "КП отправлено", "Переговоры", "Успешно"],
  },
};

// Вызовы инструментов в журнале шага.
function calls(r: Req, step: number, lang: "en" | "ru"): string[] {
  const t = totals(r);
  const first = r.items[0];
  if (step === 0) {
    const ch = { r1: "email", r2: "site_form", r3: "telegram" }[r.id] ?? "email";
    return [`inbox.fetch(channel="${ch}")`, `llm.extract(schema="request_v2")`];
  }
  if (step === 1) {
    return [
      `price_list.lookup(sku="${r.sku}")`,
      `estimate.calc(lines=${r.items.length}${r.discount ? `, discount=${r.discount}` : ""})`,
    ];
  }
  if (step === 2) {
    const third = {
      r1: `crew.calendar(team="tile", from="11-02")`,
      r2: `delivery.slots(city="${lang === "en" ? "Khimki" : "Химки"}")`,
      r3: `crew.calendar(team="night", from="11-10")`,
    }[r.id];
    return [`stock.check(sku="${r.sku}", qty=${first.qty})`, `supplier_api.lead_time(sku="${r.sku}")`, third ?? ""];
  }
  if (step === 3) {
    return [`llm.write(section="intro")`, `kp.render_pdf(no="${r.kpNo}")`];
  }
  const due = { r1: "+2d 11:00", r2: "+1d 10:00", r3: "this_week" }[r.id];
  return [`amocrm.leads.add(price=${t.total})`, `amocrm.tasks.add(due="${due}")`];
}

function mmss(sec: number): string {
  const s = Math.max(0, Math.round(sec));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export default function PipelineDemo() {
  const { lang } = useLanguage();
  const c = copy[lang];

  const [reqId, setReqId] = useState(REQUESTS[0].id);
  // -1 до запуска, 0..4 идёт шаг, 5 готово.
  const [stage, setStage] = useState(-1);
  const [clock, setClock] = useState(0);
  const [shownCalls, setShownCalls] = useState(0);
  const [ai, setAi] = useState<Ai>({ state: "idle" });
  const [today, setToday] = useState("");

  const runId = useRef(0);
  const stageRef = useRef(-1);
  const gate = useRef(false); // шаг 4 отработал своё время и ждёт модель
  const aiSettled = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  // Абзац КП по каждой заявке на каждом языке спрашивается у модели один
  // раз: повторный прогон берёт готовый текст и не тратит общий дневной
  // лимит бесплатных моделей.
  const introCache = useRef(new Map<string, string>());

  const r = REQUESTS.find((x) => x.id === reqId) ?? REQUESTS[0];
  const t = totals(r);
  const cum = r.sec.reduce<number[]>((a, s) => [...a, a[a.length - 1] + s], [0]);
  const running = stage >= 0 && stage < 5;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Часы прогона: от начала шага до его конца по симулированному времени.
  useEffect(() => {
    if (!running) return;
    // Начало шага засекается здесь же, при первом тике нового шага.
    let seen = -1;
    let started = 0;
    const iv = setInterval(() => {
      const i = stageRef.current;
      if (i < 0 || i > 4) return;
      if (i !== seen) {
        seen = i;
        started = Date.now();
      }
      const p = Math.min(1, (Date.now() - started) / STEP_MS[i]);
      const start = r.sec.slice(0, i).reduce((a, b) => a + b, 0);
      setClock(start + p * r.sec[i]);
      // Вызовы инструментов появляются по ходу шага.
      const n = calls(r, i, lang).length;
      const before = [0, 1, 2, 3, 4].slice(0, i).reduce((s, k) => s + calls(r, k, lang).length, 0);
      setShownCalls(before + Math.min(n, Math.floor(p * n) + 1));
    }, 100);
    return () => clearInterval(iv);
  }, [running, r, lang]);

  function goTo(i: number, id: number) {
    if (id !== runId.current) return;
    stageRef.current = i;
    setStage(i);
    if (i === 5) {
      setClock(totalSec(r));
      setShownCalls([0, 1, 2, 3, 4].reduce((s, k) => s + calls(r, k, lang).length, 0));
      return;
    }
    timers.current.push(
      setTimeout(() => {
        if (i === 3 && !aiSettled.current) {
          gate.current = true; // дождёмся модели
          return;
        }
        goTo(i + 1, id);
      }, STEP_MS[i])
    );
  }

  async function writeIntro(id: number) {
    const key = `${lang}:${r.id}`;
    const cached = introCache.current.get(key);
    if (cached) {
      setAi({ state: "ok", text: cached, lang });
      aiSettled.current = true;
      return;
    }
    aiSettled.current = false;
    setAi({ state: "loading" });
    const res = await askDemo<{ content: string }>({ type: "pipeline", lang, requestId: r.id });
    if (id !== runId.current) return;
    if (res.ok) introCache.current.set(key, res.data.content);
    setAi(res.ok ? { state: "ok", text: res.data.content, lang } : { state: "error", error: res.error, lang });
    aiSettled.current = true;
    if (gate.current) {
      gate.current = false;
      goTo(4, id);
    }
  }

  function run() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const id = ++runId.current;
    gate.current = false;
    setClock(0);
    setShownCalls(0);
    setToday(
      new Date().toLocaleDateString(lang === "en" ? "en-GB" : "ru-RU", { day: "numeric", month: "long", year: "numeric" })
    );
    goTo(0, id);
    writeIntro(id);
  }

  // Повтор вступления после ошибки: цепочка уже прошла, меняется только абзац.
  async function retryIntro() {
    setAi({ state: "loading" });
    const res = await askDemo<{ content: string }>({ type: "pipeline", lang, requestId: r.id });
    if (res.ok) introCache.current.set(`${lang}:${r.id}`, res.data.content);
    setAi(res.ok ? { state: "ok", text: res.data.content, lang } : { state: "error", error: res.error, lang });
  }

  function pickReq(id: string) {
    if (running) return;
    runId.current++;
    timers.current.forEach(clearTimeout);
    stageRef.current = -1;
    setReqId(id);
    setStage(-1);
    setClock(0);
    setShownCalls(0);
    setAi({ state: "idle" });
  }

  const doneText = (() => {
    const s = totalSec(r);
    const m = Math.floor(s / 60);
    const rest = s % 60;
    return m > 0 ? `${m} ${c.min} ${rest} ${c.sec}` : `${rest} ${c.sec}`;
  })();

  const stepsDone = stage < 0 ? 0 : Math.min(stage, 5);
  const allCalls = [0, 1, 2, 3, 4].reduce((s, k) => s + calls(r, k, lang).length, 0);
  const aiOk = ai.state === "ok" && ai.lang === lang && ai.text;
  const status = stage < 0 ? c.ready : stage >= 5 ? c.finished : c.working;

  // Сколько вызовов шага i уже видно.
  function visibleCalls(i: number): number {
    const before = [0, 1, 2, 3, 4].slice(0, i).reduce((s, k) => s + calls(r, k, lang).length, 0);
    return Math.max(0, Math.min(calls(r, i, lang).length, shownCalls - before));
  }

  const nums = [
    { v: mmss(clock), k: c.nums.time, mono: true },
    { v: `${shownCalls}/${allCalls}`, k: c.nums.calls, mono: true },
    { v: `${stepsDone}/5`, k: c.nums.steps, mono: true },
    { v: c.manual, k: c.nums.manual },
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
              {VENDOR.name[lang].replace(/[«»]/g, "")[0]}
            </span>
            <div>
              <p className="nm-cx-brand-t">
                {VENDOR.name[lang]} · {c.app}
              </p>
              <p className="nm-cx-brand-s">{c.appSub}</p>
            </div>
          </div>
          <span className={`nm-cx-run is-${stage < 0 ? "idle" : stage >= 5 ? "done" : "live"}`}>{status}</span>
        </div>

        <div className="nm-dm-nums nm-cx-nums4">
          {nums.map((n) => (
            <div key={n.k}>
              <span className={`nm-dm-num-v${n.mono ? " is-mono" : ""}`}>{n.v}</span>
              <span className="nm-dm-num-k">{n.k}</span>
            </div>
          ))}
        </div>

        {/* Заявки */}
        <p className="nm-dm-label nm-cx-mt">{c.pick}</p>
        <div className="nm-cx-reqs" role="radiogroup" aria-label={c.pick}>
          {REQUESTS.map((q) => (
            <button
              key={q.id}
              type="button"
              role="radio"
              aria-checked={q.id === reqId}
              className={`nm-cx-req${q.id === reqId ? " is-sel" : ""}`}
              onClick={() => pickReq(q.id)}
              disabled={running && q.id !== reqId}
            >
              <span className="nm-cx-req-h">
                <span className="nm-cx-chip">{q.channel[lang]}</span>
                <span className="nm-cx-req-c">{q.client[lang]}</span>
              </span>
              <span className="nm-cx-req-t">{q.short[lang]}</span>
            </button>
          ))}
        </div>

        <div className="nm-cx-incoming">
          <p className="nm-cx-incoming-t">{r.text[lang]}</p>
          <button
            type="button"
            className={`nm-dm-btn${running ? " is-busy" : ""}`}
            onClick={run}
            disabled={running}
          >
            {running ? c.runningBtn : stage >= 5 ? c.rerun : c.run}
          </button>
        </div>

        <div className="nm-cx-pipe">
          {/* Журнал агентов */}
          <ol className="nm-cx-log">
            {c.steps.map((name, i) => {
              const st = stage > i ? "done" : stage === i ? "run" : "idle";
              // Шаг 4 отработал своё время, часы дошли до его конца, а модель ещё пишет.
              const waiting = st === "run" && i === 3 && ai.state === "loading" && clock >= cum[4] - 0.05;
              const list = calls(r, i, lang).slice(0, st === "idle" ? 0 : st === "done" ? undefined : visibleCalls(i));
              return (
                <li key={name} className="nm-cx-step" data-st={st}>
                  <div className="nm-cx-step-h">
                    <span className="nm-cx-step-no">{st === "done" ? "✓" : String(i + 1).padStart(2, "0")}</span>
                    <span className="nm-cx-step-n">{name}</span>
                    <span className="nm-cx-step-time">
                      {st === "done" ? `${r.sec[i]} ${c.sec}` : st === "run" ? (waiting ? c.waitAi : mmss(clock - cum[i])) : ""}
                    </span>
                  </div>
                  {st !== "idle" && (
                    <div className="nm-cx-step-b">
                      <p className="nm-cx-io">
                        <b>{c.input}</b> {c.inputs[i](r)}
                      </p>
                      {list.length > 0 && (
                        <div className="nm-cx-calls" aria-label={c.tools}>
                          {list.map((call) => (
                            <code key={call} className="nm-dm-in">
                              {call}
                            </code>
                          ))}
                        </div>
                      )}
                      {st === "done" && (
                        <div className="nm-cx-out-b nm-dm-in">
                          <p className="nm-cx-io">
                            <b>{c.output}</b>
                          </p>
                          {i === 0 && (
                            <dl className="nm-cx-kv">
                              {r.parsed.map((f) => (
                                <div key={f.k.en}>
                                  <dt>{f.k[lang]}</dt>
                                  <dd>{f.v[lang]}</dd>
                                </div>
                              ))}
                            </dl>
                          )}
                          {i === 1 && (
                            <ul className="nm-cx-lines">
                              {r.items.map((it) => (
                                <li key={it.name.en}>
                                  <span>{it.name[lang]}</span>
                                  <span>{rub(it.qty * it.price)}</span>
                                </li>
                              ))}
                              {t.discount > 0 && (
                                <li className="is-disc">
                                  <span>{c.discount(r.discount!)}</span>
                                  <span>−{rub(t.discount)}</span>
                                </li>
                              )}
                              <li className="is-total">
                                <span>{c.total}</span>
                                <span>{rub(t.total)}</span>
                              </li>
                            </ul>
                          )}
                          {i === 2 && (
                            <ul className="nm-cx-checks">
                              {r.stock.map((s) => (
                                <li key={s.text.en} className={`is-${s.tone}`}>
                                  {s.text[lang]}
                                </li>
                              ))}
                            </ul>
                          )}
                          {i === 3 && (
                            <ul className="nm-cx-checks">
                              <li className="is-ok">{c.pdf}</li>
                              <li className={ai.state === "error" ? "is-warn" : "is-ok"}>
                                {ai.state === "error" ? c.introFail : c.introOk}
                              </li>
                            </ul>
                          )}
                          {i === 4 && (
                            <ul className="nm-cx-checks">
                              <li className="is-ok">
                                {c.dealCreated(r.deal.id)}: {r.deal.name[lang]}
                              </li>
                              <li className="is-ok">{c.stage}</li>
                              <li className="is-ok">
                                {c.task}: {r.deal.task[lang]}
                              </li>
                              <li className="is-ok">{c.draftMail}</li>
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>

          {/* Документ и сделка */}
          <div className="nm-cx-side">
            <div className="nm-cx-doc" data-empty={stage < 0 ? "" : undefined}>
              <div className="nm-cx-doc-h">
                <span className="nm-cx-doc-logo">
                  <i aria-hidden="true">{VENDOR.name[lang].replace(/[«»]/g, "")[0]}</i>
                  {VENDOR.name[lang].replace(/[«»]/g, "")}
                </span>
                <span className="nm-cx-doc-no">
                  {c.docNo} {r.kpNo}
                  {today && stage >= 0 && <small>{today}</small>}
                  {stage >= 5 && <span className="nm-cx-doc-pdf nm-dm-in">{c.pdfStamp}</span>}
                </span>
              </div>
              <p className="nm-cx-doc-to">
                <span>{c.to}:</span> {stage >= 1 ? `${r.client[lang]}, ${r.contact[lang]}` : ""}
              </p>

              {/* Вступление от модели */}
              <div className="nm-cx-doc-intro">
                {aiOk && stage >= 4 ? (
                  <p>
                    <Typed text={ai.text!} />
                  </p>
                ) : ai.state === "error" && stage >= 4 ? (
                  <div className="nm-cx-doc-fail">
                    <p className="nm-dm-err">{DEMO_ERRORS[lang][ai.error ?? "unavailable"]}</p>
                    <button type="button" className="nm-dm-btn2 is-s" onClick={retryIntro}>
                      {c.retry}
                    </button>
                  </div>
                ) : stage === 3 || (ai.state === "loading" && stage >= 4) ? (
                  <p className="nm-cx-doc-wait">
                    <span className="nm-dm-spin" aria-hidden="true" /> {c.writing}
                  </p>
                ) : (
                  <span className="nm-cx-skel" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                )}
              </div>

              {stage >= 2 ? (
                <div className="nm-cx-doc-tbl nm-dm-in">
                  <table>
                    <thead>
                      <tr>
                        <th>{c.item}</th>
                        <th>{c.qty}</th>
                        <th className="is-price">{c.price}</th>
                        <th>{c.sum}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {r.items.map((it) => (
                        <tr key={it.name.en}>
                          <td>{it.name[lang]}</td>
                          <td>
                            {it.qty.toLocaleString("ru-RU")} {it.unit[lang]}
                          </td>
                          <td className="is-price">{rub(it.price)}</td>
                          <td>{rub(it.qty * it.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <dl className="nm-cx-doc-sum">
                    <div>
                      <dt>{c.materials}</dt>
                      <dd>{rub(t.materials)}</dd>
                    </div>
                    <div>
                      <dt>{c.works}</dt>
                      <dd>{rub(t.works)}</dd>
                    </div>
                    {t.discount > 0 && (
                      <div>
                        <dt>{c.discount(r.discount!)}</dt>
                        <dd>−{rub(t.discount)}</dd>
                      </div>
                    )}
                    <div className="is-total">
                      <dt>{c.total}</dt>
                      <dd>{rub(t.total)}</dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <div className="nm-cx-doc-blank">
                  <span className="nm-cx-skel is-tbl" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                  {stage < 0 && <p className="nm-cx-doc-hint">{c.docEmpty}</p>}
                </div>
              )}

              {stage >= 3 && (
                <p className="nm-cx-doc-line nm-dm-in">
                  <b>{c.timeline}:</b> {r.timeline[lang]}.
                </p>
              )}
              <p className="nm-cx-doc-foot">
                {c.manager}: {VENDOR.manager[lang]} · {c.validity}
              </p>
            </div>

            {stage >= 5 && (
              <div className="nm-cx-crm nm-dm-in">
                <div className="nm-cx-crm-h">
                  <span className="nm-cx-crm-k">{c.crm}</span>
                  <span className="nm-cx-crm-id">№ {r.deal.id}</span>
                </div>
                <p className="nm-cx-crm-n">{r.deal.name[lang]}</p>
                <div className="nm-cx-crm-stages">
                  {c.pipelineStages.map((s, i) => (
                    <span key={s} className={i < 2 ? "is-past" : i === 2 ? "is-on" : undefined}>
                      {s}
                    </span>
                  ))}
                </div>
                <dl className="nm-cx-kv is-num">
                  <div>
                    <dt>{c.budget}</dt>
                    <dd>{rub(t.total)}</dd>
                  </div>
                  <div>
                    <dt>{c.owner}</dt>
                    <dd>{VENDOR.manager[lang]}</dd>
                  </div>
                </dl>
                <p className="nm-cx-crm-task">
                  <b>{c.task}:</b> {r.deal.task[lang]}
                </p>
              </div>
            )}
          </div>
        </div>

        {stage >= 5 && (
          <div className="nm-cx-done nm-dm-in">
            <p className="nm-cx-done-t">✓ {c.doneTitle(doneText)}</p>
            <p className="nm-cx-done-d">{c.doneSub}</p>
          </div>
        )}
      </div>
    </DemoShell>
  );
}
