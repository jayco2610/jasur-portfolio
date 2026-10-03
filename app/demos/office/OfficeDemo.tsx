"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import DemoShell from "../DemoShell";
import Typed from "../_cx/Typed";
import { askDemo, DEMO_ERRORS, type DemoError } from "../_cx/api";
import { DEPTS, EMAILS, OFFICE_COMPANY, OFFICE_INBOX, QUEUE_ORDER, type Dept, type Email, type Urgency } from "./data";

/* Разбор входящих заявок. Общий ящик компании: письма приходят потоком,
   ИИ ставит каждому отдел, срочность и метки и кладёт в очередь отдела с
   таймером SLA. По клику на письмо живая модель пишет черновик ответа
   (POST /api/demo, type: "office", номер письма). Своё письмо модель
   разбирает целиком: отдел, срочность, причина и черновик.

   Разбор писем из демо симулирован (data.ts), часы тоже: одна секунда в
   браузере это 12 секунд рабочего дня, иначе таймеры SLA стояли бы на
   месте. Пауза останавливает и поток, и часы. */

const SPEED = 12; // секунд рабочего дня за секунду в браузере
const START = 10 * 3600 + 40 * 60; // 10:40
const ARRIVE_MS = 2400; // письмо в ленте раз в 2,4 с
const SORT_MS = 1100; // столько ИИ «читает» письмо
const DONE_BEFORE = 44; // писем разобрано сегодня до начала демо
const MIN_PER_EMAIL = 4; // ручной разбор одного письма, минут

type Item = {
  id: string;
  email: Email;
  arrivedAt: number; // секунда рабочего дня
  sorted: boolean;
  answeredAt?: number;
  custom?: boolean;
};

const copy = {
  en: {
    title: "Inbound request triage",
    subtitle:
      "A company's shared inbox gets dozens of emails a day: customers, suppliers, candidates, accounting, complaints. Here AI reads each one, picks the department and urgency, and drops it into the right queue. Click an email and AI writes a draft reply.",
    pitch:
      "A customer email no longer waits half a day for someone to forward it. AI sorts the inbox in seconds, and staff get each email with a draft reply already attached.",
    hint: "Click any email in the feed or a queue, then press Draft a reply. To test your own email, press Try your own email.",
    footer:
      "Simulated data. On a real project this connects to the company mailbox (Gmail, Outlook, or Yandex 360), the CRM (Bitrix24 or amoCRM), and each department's rules.",
    app: "Shared inbox",
    pause: "Pause",
    resume: "Resume",
    restart: "Run the stream again",
    own: "Try your own email",
    nums: {
      done: "emails triaged today",
      saved: "saved today",
      speed: "to triage one email, ~4 min by hand",
      risk: "at risk of missing SLA",
    },
    hours: (m: number) => `${(m / 60).toFixed(1)} h`,
    sec: "3 s",
    queues: "Department queues",
    feed: "Incoming",
    feedDone: "All emails triaged",
    sorting: "AI is reading the email…",
    archived: "archived",
    answered: "answered",
    answeredIn: (m: number) => `answered in ${m} min`,
    more: (n: number) => `+${n} more`,
    emptyQueue: "Queue is empty",
    urgency: { high: "urgent", medium: "today", low: "not urgent" } as Record<Urgency, string>,
    slaNorm: (min: number) => (min >= 1440 ? "SLA 24 h" : min >= 60 ? `SLA ${min / 60} h` : `SLA ${min} min`),
    left: "left",
    overdue: "overdue",
    detailEmpty: "Pick an email in the feed or a queue: here you will see why AI routed it this way and its draft reply.",
    why: "Why this route",
    extracted: "Extracted by AI",
    letter: "Email",
    draftBtn: "Draft a reply",
    drafting: "writing…",
    draftLabel: "Draft reply",
    fillNote: "Fields in square brackets are for the manager to fill in: AI does not invent numbers, dates or prices that are not in the email.",
    send: "Send",
    again: "Another version",
    sent: "Sent. The email has left the queue.",
    noReply: "No reply needed: the email went to the archive.",
    ownTitle: "Your email",
    ownHint: "Paste any email: a price request, a complaint, a CV. AI picks the department and urgency and writes a draft.",
    ownPlaceholder: "Paste the email text here…",
    ownBtn: "Triage and reply",
    ownFrom: "You",
    ownOrg: "pasted email",
    min: "min",
  },
  ru: {
    title: "Разбор входящих заявок",
    subtitle:
      "В общий ящик компании за день приходят десятки писем: клиенты, поставщики, соискатели, бухгалтерия, жалобы. Здесь ИИ читает каждое письмо, определяет отдел и срочность и кладёт его в нужную очередь. Нажмите на письмо, и ИИ напишет черновик ответа.",
    pitch:
      "Письмо клиента больше не ждёт полдня, пока его кто-то перешлёт. ИИ разбирает ящик за секунды, сотрудник получает письмо уже с черновиком ответа.",
    hint: "Нажмите на любое письмо в ленте или очереди, потом «Написать черновик». Своё письмо можно проверить кнопкой «Проверить на своём письме».",
    footer:
      "Данные симулированы. На реальном проекте подключается почта компании (Gmail, Outlook или Яндекс 360), CRM (Битрикс24 или amoCRM) и правила отделов.",
    app: "Общий ящик",
    pause: "Пауза",
    resume: "Продолжить",
    restart: "Запустить поток заново",
    own: "Проверить на своём письме",
    nums: {
      done: "писем разобрано сегодня",
      saved: "сэкономлено за день",
      speed: "на разбор письма, вручную ~4 мин",
      risk: "под угрозой SLA",
    },
    hours: (m: number) => `${(m / 60).toFixed(1).replace(".", ",")} ч`,
    sec: "3 с",
    queues: "Очереди отделов",
    feed: "Входящие",
    feedDone: "Все письма разобраны",
    sorting: "ИИ читает письмо…",
    archived: "в архиве",
    answered: "отвечено",
    answeredIn: (m: number) => `отвечено за ${m} мин`,
    more: (n: number) => `ещё ${n}`,
    emptyQueue: "Очередь пуста",
    urgency: { high: "срочно", medium: "сегодня", low: "не срочно" } as Record<Urgency, string>,
    slaNorm: (min: number) => (min >= 1440 ? "SLA 24 ч" : min >= 60 ? `SLA ${min / 60} ч` : `SLA ${min} мин`),
    left: "осталось",
    overdue: "просрочено",
    detailEmpty: "Выберите письмо в ленте или очереди: здесь будет видно, почему ИИ отправил его в этот отдел, и черновик ответа.",
    why: "Почему сюда",
    extracted: "ИИ извлёк",
    letter: "Письмо",
    draftBtn: "Написать черновик",
    drafting: "пишу…",
    draftLabel: "Черновик ответа",
    fillNote: "Поля в квадратных скобках заполняет менеджер: ИИ не выдумывает цифры, даты и цены, которых нет в письме.",
    send: "Отправить",
    again: "Другой вариант",
    sent: "Отправлено. Письмо ушло из очереди.",
    noReply: "Ответ не нужен: письмо ушло в архив.",
    ownTitle: "Своё письмо",
    ownHint: "Вставьте любое письмо: запрос цены, жалобу, резюме. ИИ определит отдел и срочность и напишет черновик.",
    ownPlaceholder: "Вставьте сюда текст письма…",
    ownBtn: "Разобрать и ответить",
    ownFrom: "Вы",
    ownOrg: "своё письмо",
    min: "мин",
  },
};

const TONE: Record<Dept, string> = {
  sales: "blue",
  service: "red",
  accounting: "teal",
  procurement: "amber",
  hr: "violet",
  spam: "grey",
};

function clock(sec: number): string {
  const h = Math.floor(sec / 3600) % 24;
  const m = Math.floor((sec % 3600) / 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function initialItems(): Item[] {
  return EMAILS.filter((e) => e.agoMin !== undefined).map((e) => ({
    id: e.id,
    email: e,
    arrivedAt: START - (e.agoMin ?? 0) * 60,
    sorted: true,
    answeredAt: e.answeredMin !== undefined ? START - (e.agoMin ?? 0) * 60 + e.answeredMin * 60 : undefined,
  }));
}

const STREAM = EMAILS.filter((e) => e.agoMin === undefined);

export default function OfficeDemo() {
  const { lang } = useLanguage();
  const c = copy[lang];

  const [items, setItems] = useState<Item[]>(initialItems);
  const [now, setNow] = useState(START);
  const [next, setNext] = useState(0); // сколько писем потока уже пришло
  const [running, setRunning] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, DemoError>>({});
  const [ownText, setOwnText] = useState("");
  const [ownCount, setOwnCount] = useState(0);
  const detailRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  // Те же часы для таймеров потока: время прихода письма берётся отсюда.
  const nowRef = useRef(START);

  // Часы рабочего дня.
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      nowRef.current += SPEED;
      setNow(nowRef.current);
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  // Поток писем: новое письмо раз в ARRIVE_MS, через SORT_MS у него метки.
  useEffect(() => {
    if (!running || next >= STREAM.length) return;
    const t = setTimeout(() => {
      const e = STREAM[next];
      setItems((prev) => [...prev, { id: e.id, email: e, arrivedAt: nowRef.current, sorted: false }]);
      setNext((n) => n + 1);
      timers.current.push(
        setTimeout(() => {
          setItems((prev) => prev.map((it) => (it.id === e.id ? { ...it, sorted: true } : it)));
          // Первое письмо потока открывается само: справа сразу видно, что
          // ИИ решил и почему.
          if (next === 0) setSelected((s) => s ?? e.id);
        }, SORT_MS)
      );
    }, next === 0 ? 900 : ARRIVE_MS);
    return () => clearTimeout(t);
  }, [running, next]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function restart() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setItems(initialItems());
    nowRef.current = START;
    setNow(START);
    setNext(0);
    setSelected(null);
    // Черновики остаются: письма те же, модель второй раз не спрашиваем.
    setErrors({});
    setRunning(true);
  }

  function select(id: string) {
    setSelected(id);
    // На телефоне карточка письма под лентой: доводим до неё прокруткой.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }

  async function draft(it: Item) {
    setLoadingId(it.id);
    setErrors((e) => {
      const n = { ...e };
      delete n[it.id];
      return n;
    });
    const r = await askDemo<{ content: string }>({ type: "office", lang, emailId: it.id });
    if (r.ok) setDrafts((d) => ({ ...d, [`${lang}:${it.id}`]: r.data.content }));
    else setErrors((e) => ({ ...e, [it.id]: r.error }));
    setLoadingId(null);
  }

  async function triageOwn() {
    const text = ownText.trim();
    setLoadingId("own");
    setErrors((e) => {
      const n = { ...e };
      delete n.own;
      return n;
    });
    const r = await askDemo<{ content: string; label: { dept: Dept; urgency: Urgency; reason: string } }>({
      type: "office",
      lang,
      text,
    });
    setLoadingId(null);
    if (!r.ok) {
      setErrors((e) => ({ ...e, own: r.error }));
      return;
    }
    const id = `own${ownCount + 1}`;
    setOwnCount((n) => n + 1);
    const firstLine = text.split("\n")[0].trim();
    const subject = firstLine.length > 72 ? `${firstLine.slice(0, 70).trim()}…` : firstLine;
    const both = (s: string) => ({ en: s, ru: s });
    const email: Email = {
      id,
      from: both(c.ownFrom),
      org: both(c.ownOrg),
      address: "",
      subject: both(subject),
      body: both(text),
      dept: r.data.label.dept,
      urgency: r.data.label.urgency,
      tags: { en: [], ru: [] },
      reason: both(r.data.label.reason),
      fields: [],
    };
    setItems((prev) => [...prev, { id, email, arrivedAt: now, sorted: true, custom: true }]);
    if (r.data.label.dept !== "spam") setDrafts((d) => ({ ...d, [`${lang}:${id}`]: r.data.content }));
    setOwnText("");
    setSelected(id);
  }

  function send(id: string) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, answeredAt: now } : it)));
  }

  // SLA: сколько секунд осталось и в каком состоянии таймер.
  function sla(it: Item) {
    const norm = DEPTS[it.email.dept].sla * 60;
    const left = norm - (now - it.arrivedAt);
    const state = left <= 0 ? "bad" : left <= norm * 0.25 ? "warn" : "ok";
    return { left, state };
  }

  function slaText(left: number): string {
    const a = Math.abs(left);
    if (a >= 3600) {
      const h = Math.floor(a / 3600);
      const m = Math.floor((a % 3600) / 60);
      return lang === "en" ? `${h} h ${String(m).padStart(2, "0")} min` : `${h} ч ${String(m).padStart(2, "0")} мин`;
    }
    return `${String(Math.floor(a / 60)).padStart(2, "0")}:${String(Math.floor(a % 60)).padStart(2, "0")}`;
  }

  function timer(it: Item) {
    if (it.answeredAt !== undefined) {
      return <span className="nm-cx-timer is-done">✓ {c.answered}</span>;
    }
    const s = sla(it);
    return (
      <span className={`nm-cx-timer is-${s.state}`}>
        {s.left <= 0 ? `${c.overdue} ${slaText(s.left)}` : slaText(s.left)}
      </span>
    );
  }

  const sorted = items.filter((it) => it.sorted);
  const open = sorted.filter((it) => it.email.dept !== "spam" && it.answeredAt === undefined);
  const atRisk = open.filter((it) => sla(it).state !== "ok").length;
  const done = DONE_BEFORE + sorted.length;
  const feed = [...items].sort((a, b) => b.arrivedAt - a.arrivedAt);
  const sel = selected === "own" ? null : items.find((it) => it.id === selected) ?? null;
  const streamDone = next >= STREAM.length && items.every((it) => it.sorted);

  const nums = [
    { v: String(done), k: c.nums.done },
    { v: c.hours(done * MIN_PER_EMAIL), k: c.nums.saved, good: true },
    { v: c.sec, k: c.nums.speed },
    { v: String(atRisk), k: c.nums.risk, warn: atRisk > 0 },
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
        {/* Шапка приложения: графитовая полоса, как у почтового клиента. */}
        <div className="nm-cx-bar">
          <div className="nm-cx-brand">
            <span className="nm-cx-logo" aria-hidden="true">
              {OFFICE_COMPANY[lang].replace(/[«»]/g, "")[0]}
            </span>
            <div>
              <p className="nm-cx-brand-t">
                {c.app} · {OFFICE_COMPANY[lang]}
              </p>
              <p className="nm-cx-brand-s">{OFFICE_INBOX}</p>
            </div>
          </div>
          <div className="nm-cx-bar-r">
            <span className={`nm-cx-clock${running && !streamDone ? " is-live" : ""}`}>{clock(now)}</span>
            {streamDone ? (
              <button type="button" className="nm-dm-btn2 is-s" onClick={restart}>
                {c.restart}
              </button>
            ) : (
              <button type="button" className="nm-dm-btn2 is-s" onClick={() => setRunning((r) => !r)}>
                {running ? c.pause : c.resume}
              </button>
            )}
            <button
              type="button"
              className={`nm-dm-btn2 is-s${selected === "own" ? " is-on" : ""}`}
              onClick={() => select("own")}
            >
              {c.own}
            </button>
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

        {/* Очереди отделов */}
        <p className="nm-dm-label nm-cx-mt">{c.queues}</p>
        <div className="nm-cx-queues">
          {QUEUE_ORDER.map((d) => {
            const q = open
              .filter((it) => it.email.dept === d)
              .sort((a, b) => sla(a).left - sla(b).left);
            return (
              <div key={d} className="nm-cx-queue" data-tone={TONE[d]}>
                <div className="nm-cx-queue-h">
                  <span className="nm-cx-queue-n">{DEPTS[d].name[lang]}</span>
                  <span className="nm-cx-count">{q.length}</span>
                </div>
                <p className="nm-cx-queue-s">{c.slaNorm(DEPTS[d].sla)}</p>
                <div className="nm-cx-queue-l">
                  {q.length === 0 && <p className="nm-cx-queue-e">{c.emptyQueue}</p>}
                  {q.slice(0, 3).map((it) => (
                    <button
                      key={it.id}
                      type="button"
                      className={`nm-cx-qi${selected === it.id ? " is-sel" : ""}`}
                      onClick={() => select(it.id)}
                    >
                      <span className={`nm-cx-dot is-${it.email.urgency}`} aria-hidden="true" />
                      <span className="nm-cx-qi-t">{it.email.from[lang]}</span>
                      {timer(it)}
                    </button>
                  ))}
                  {q.length > 3 && <p className="nm-cx-queue-e">{c.more(q.length - 3)}</p>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="nm-cx-office">
          {/* Лента входящих с метками */}
          <div className="nm-cx-col">
            <div className="nm-cx-col-h">
              <p className="nm-dm-label">{c.feed}</p>
              {streamDone && <span className="nm-cx-muted">{c.feedDone}</span>}
            </div>
            <div className="nm-cx-feed">
              {feed.map((it) => {
                const e = it.email;
                const spam = e.dept === "spam";
                return (
                  <button
                    key={it.id}
                    type="button"
                    className={`nm-cx-mail${selected === it.id ? " is-sel" : ""}${spam ? " is-spam" : ""}${it.sorted ? "" : " is-new"}`}
                    data-urg={it.sorted ? e.urgency : undefined}
                    onClick={() => it.sorted && select(it.id)}
                    disabled={!it.sorted}
                  >
                    <span className="nm-cx-mail-h">
                      <span className="nm-cx-mail-f">
                        {e.from[lang]}
                        <span className="nm-cx-mail-o"> · {e.org[lang]}</span>
                      </span>
                      <span className="nm-cx-mail-time">{clock(it.arrivedAt)}</span>
                    </span>
                    <span className="nm-cx-mail-s">{e.subject[lang]}</span>
                    {it.sorted ? (
                      <span className="nm-cx-chips nm-dm-in">
                        <span className="nm-cx-chip" data-tone={TONE[e.dept]}>
                          {DEPTS[e.dept].name[lang]}
                        </span>
                        {spam ? (
                          <span className="nm-cx-chip">{c.archived}</span>
                        ) : it.answeredAt !== undefined ? (
                          <span className="nm-cx-chip" data-tone="ok">
                            ✓ {c.answered}
                          </span>
                        ) : (
                          <span className={`nm-cx-chip is-urg-${e.urgency}`}>{c.urgency[e.urgency]}</span>
                        )}
                        {e.tags[lang].map((t) => (
                          <span key={t} className="nm-cx-chip is-tag">
                            {t}
                          </span>
                        ))}
                      </span>
                    ) : (
                      <span className="nm-cx-sorting">
                        <span className="nm-dm-spin" aria-hidden="true" />
                        {c.sorting}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Карточка письма или своё письмо */}
          <div ref={detailRef} className="nm-cx-col nm-cx-detail">
            {selected === "own" ? (
              <div className="nm-cx-card">
                <p className="nm-cx-card-t">{c.ownTitle}</p>
                <p className="nm-cx-muted nm-cx-mts">{c.ownHint}</p>
                <textarea
                  className="nm-dm-area nm-cx-area"
                  rows={6}
                  maxLength={1500}
                  value={ownText}
                  onChange={(e) => setOwnText(e.target.value)}
                  placeholder={c.ownPlaceholder}
                />
                <div className="nm-cx-actions">
                  <button
                    type="button"
                    className={`nm-dm-btn${loadingId === "own" ? " is-busy" : ""}`}
                    disabled={loadingId !== null || ownText.trim().length < 20}
                    onClick={triageOwn}
                  >
                    {loadingId === "own" ? c.drafting : c.ownBtn}
                  </button>
                </div>
                {errors.own && <p className="nm-dm-err">{DEMO_ERRORS[lang][errors.own]}</p>}
              </div>
            ) : sel ? (
              <MailCard
                key={sel.id}
                it={sel}
                lang={lang}
                c={c}
                timer={timer(sel)}
                draft={drafts[`${lang}:${sel.id}`]}
                loading={loadingId === sel.id}
                busy={loadingId !== null}
                error={errors[sel.id]}
                onDraft={() => draft(sel)}
                onSend={() => send(sel.id)}
              />
            ) : (
              <div className="nm-cx-card nm-cx-blank">
                <span className="nm-cx-blank-i" aria-hidden="true" />
                <p className="nm-cx-muted">{c.detailEmpty}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DemoShell>
  );
}

function MailCard({
  it,
  lang,
  c,
  timer,
  draft,
  loading,
  busy,
  error,
  onDraft,
  onSend,
}: {
  it: Item;
  lang: "en" | "ru";
  c: (typeof copy)["ru"];
  timer: React.ReactNode;
  draft?: string;
  loading: boolean;
  busy: boolean;
  error?: DemoError;
  onDraft: () => void;
  onSend: () => void;
}) {
  const e = it.email;
  const spam = e.dept === "spam";
  const answered = it.answeredAt !== undefined;
  return (
    <div className="nm-cx-card">
      <div className="nm-cx-mailcard-h">
        <span className="nm-cx-chips">
          <span className="nm-cx-chip" data-tone={TONE[e.dept]}>
            {DEPTS[e.dept].name[lang]}
          </span>
          {!spam && <span className={`nm-cx-chip is-urg-${e.urgency}`}>{c.urgency[e.urgency]}</span>}
        </span>
        {!spam && timer}
      </div>
      <h3 className="nm-cx-mailcard-s">{e.subject[lang]}</h3>
      <p className="nm-cx-muted">
        {e.from[lang]} · {e.org[lang]}
        {e.address && <span className="nm-cx-addr"> · {e.address}</span>}
      </p>

      <div className="nm-cx-why">
        <p className="nm-cx-why-k">
          <span className="nm-cx-ai">AI</span> {c.why}
        </p>
        <p>{e.reason[lang]}</p>
      </div>

      {e.fields.length > 0 && (
        <>
          <p className="nm-cx-sub">{c.extracted}</p>
          <dl className="nm-cx-kv">
            {e.fields.map((f) => (
              <div key={f.k.en}>
                <dt>{f.k[lang]}</dt>
                <dd>{f.v[lang]}</dd>
              </div>
            ))}
          </dl>
        </>
      )}

      <p className="nm-cx-sub">{c.letter}</p>
      <p className="nm-cx-body">{e.body[lang]}</p>

      {spam ? (
        <p className="nm-cx-note">{c.noReply}</p>
      ) : (
        <div className="nm-cx-draft-zone">
          {draft ? (
            <div className="nm-dm-quote is-ai nm-cx-draft">
              <p className="nm-dm-quote-k">{c.draftLabel}</p>
              <p className="nm-dm-quote-t">
                <Typed text={draft} />
              </p>
              {/\[[^\]]+\]/.test(draft) ? <p className="nm-cx-note">{c.fillNote}</p> : null}
            </div>
          ) : null}
          {answered ? (
            <p className="nm-cx-note is-ok">
              ✓ {it.email.answeredMin !== undefined ? c.answeredIn(it.email.answeredMin) : c.sent}
            </p>
          ) : (
            <div className="nm-cx-actions">
              {draft ? (
                <>
                  <button type="button" className="nm-dm-btn" onClick={onSend} disabled={busy}>
                    {c.send}
                  </button>
                  <button
                    type="button"
                    className={`nm-dm-btn2${loading ? " is-busy" : ""}`}
                    onClick={onDraft}
                    disabled={busy}
                  >
                    {loading ? c.drafting : c.again}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className={`nm-dm-btn${loading ? " is-busy" : ""}`}
                  onClick={onDraft}
                  disabled={busy}
                >
                  {loading ? c.drafting : c.draftBtn}
                </button>
              )}
            </div>
          )}
          {error && <p className="nm-dm-err">{DEMO_ERRORS[lang][error]}</p>}
        </div>
      )}
    </div>
  );
}
