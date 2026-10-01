"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import DemoShell from "../DemoShell";
import PhoneFrame from "../PhoneFrame";

/* Фрод-контроль касс в макете. Перенос app/demos/fraud/page.tsx: поток
   событий раз в 1,7 секунды, те же вероятности, те же четыре правила,
   кнопки «Пауза» и «Подбросить фрод-событие», алерты в телеграм справа.
   Логика строка в строку, меняется только разметка. Сети демо не трогает. */

type EventKind = "sale" | "void" | "delete" | "discount";

type PosEvent = {
  id: number;
  kind: EventKind;
  register: number;
  cashier: string;
  amount: number;
  discountPct?: number;
  time: string;
  flagged?: string | null;
};

type Alert = {
  id: number;
  register: number;
  cashier: string;
  amount: number;
  rule: string;
  time: string;
};

const CASHIERS = [
  { name: "Иванова", nameEn: "Ivanova", register: 1 },
  { name: "Петров", nameEn: "Petrov", register: 2 },
  { name: "Сидорова", nameEn: "Sidorova", register: 3 },
];

const copy = {
  en: {
    title: "POS fraud control",
    subtitle:
      "A simulated stream of register events runs on the left. Rules check every event, and anything suspicious lands in the owner's Telegram within a second: who, where, how much.",
    pitch:
      "If a cashier voids a check, deletes an item, or plays with discounts, the owner gets an alert instantly. Control 24/7 without hours of camera footage.",
    rulesTitle: "Active rules",
    rules: [
      "Check void over 1,000 ₽",
      "Third void within an hour by the same cashier",
      "Item deleted from an open check",
      "Manual discount over 30% without a loyalty card",
    ],
    feedTitle: "Register event stream",
    pause: "Pause",
    resume: "Resume",
    inject: "Inject a fraud event",
    stats: { events: "events processed", alerts: "alerts", saved: "flagged amount" },
    chatTitle: "POS Control · bot",
    chatEmpty: "Alerts will appear here",
    alertWord: "Alert",
    ruleWord: "Rule",
    registerWord: "Register",
    kinds: {
      sale: "Sale",
      void: "Check void",
      delete: "Item deleted",
      discount: "Manual discount",
    },
  },
  ru: {
    title: "Фрод-контроль касс",
    subtitle:
      "Слева идёт симулированный поток кассовых событий. Каждое событие проверяется по правилам, и всё подозрительное за секунду прилетает владельцу в Telegram: кто, где и на сколько.",
    pitch:
      "Если кассир отменяет чек, удаляет позицию или химичит со скидками, владельцу в ту же секунду летит алерт. Контроль 24/7 без отсмотра камер часами.",
    rulesTitle: "Активные правила",
    rules: [
      "Отмена чека на сумму больше 1 000 ₽",
      "Третья отмена за час у одного кассира",
      "Удаление позиции из открытого чека",
      "Ручная скидка больше 30% без карты лояльности",
    ],
    feedTitle: "Поток кассовых событий",
    pause: "Пауза",
    resume: "Продолжить",
    inject: "Подбросить фрод-событие",
    stats: { events: "событий обработано", alerts: "алертов", saved: "сумма под подозрением" },
    chatTitle: "Контроль касс · бот",
    chatEmpty: "Алерты появятся здесь",
    alertWord: "Алерт",
    ruleWord: "Правило",
    registerWord: "Касса",
    kinds: {
      sale: "Продажа",
      void: "Отмена чека",
      delete: "Удаление позиции",
      discount: "Ручная скидка",
    },
  },
};

function nowTime() {
  return new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function rnd(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

export default function FraudDemo() {
  const { lang } = useLanguage();
  const c = copy[lang];

  const [events, setEvents] = useState<PosEvent[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [running, setRunning] = useState(true);
  const [processed, setProcessed] = useState(0);
  const [flaggedSum, setFlaggedSum] = useState(0);
  const nextId = useRef(1);
  const voidCounts = useRef<Record<string, number>>({});
  const chatRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  function ruleFor(ev: Omit<PosEvent, "flagged" | "id" | "time">): string | null {
    if (ev.kind === "void") {
      const count = (voidCounts.current[ev.cashier] ?? 0) + 1;
      voidCounts.current[ev.cashier] = count;
      if (count >= 3) return c.rules[1];
      if (ev.amount > 1000) return c.rules[0];
      return null;
    }
    if (ev.kind === "delete") return c.rules[2];
    if (ev.kind === "discount" && (ev.discountPct ?? 0) > 30) return c.rules[3];
    return null;
  }

  function pushEvent(kind: EventKind, forcedAmount?: number) {
    const cashier = CASHIERS[rnd(0, CASHIERS.length - 1)];
    const base = {
      kind,
      register: cashier.register,
      cashier: lang === "en" ? cashier.nameEn : cashier.name,
      amount: forcedAmount ?? (kind === "sale" ? rnd(120, 900) : rnd(300, 2400)),
      discountPct: kind === "discount" ? rnd(15, 60) : undefined,
    };
    const flagged = ruleFor(base);
    const ev: PosEvent = { ...base, id: nextId.current++, time: nowTime(), flagged };
    setEvents((prev) => [...prev.slice(-30), ev]);
    setProcessed((n) => n + 1);
    if (flagged) {
      setFlaggedSum((s) => s + ev.amount);
      setAlerts((prev) => [
        ...prev.slice(-20),
        { id: ev.id, register: ev.register, cashier: ev.cashier, amount: ev.amount, rule: flagged, time: ev.time },
      ]);
    }
  }

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      const roll = Math.random();
      if (roll < 0.72) pushEvent("sale");
      else if (roll < 0.84) pushEvent("void");
      else if (roll < 0.92) pushEvent("delete");
      else pushEvent("discount");
    }, 1700);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, lang]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [alerts]);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
  }, [events]);

  const nums = (
    <div className="nm-dm-nums nm-dm-w">
      {[
        { value: processed, label: c.stats.events },
        { value: alerts.length, label: c.stats.alerts },
        { value: `${flaggedSum.toLocaleString("ru-RU")} ₽`, label: c.stats.saved },
      ].map((s) => (
        <div key={s.label}>
          <span className="nm-dm-num-v">{s.value}</span>
          <span className="nm-dm-num-k">{s.label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <DemoShell
      title={{ en: copy.en.title, ru: copy.ru.title }}
      subtitle={{ en: copy.en.subtitle, ru: copy.ru.subtitle }}
      pitch={{ en: copy.en.pitch, ru: copy.ru.pitch }}
      hint={{ en: "Press Inject a fraud event and watch the alert land in Telegram on the right.", ru: "Нажмите «Подбросить фрод-событие» и следите за алертом в Telegram справа." }}
    >
      <div className="nm-dm-split nm-dm-mt">
        {/* Слева: поток событий и правила */}
        <div className="nm-dm-grow nm-dm-app">
          {/* Цифры внутри панели слева, в общем окне с потоком и
              правилами: это одна панель владельца, а не две. */}
          {nums}
          <div className={`nm-dm-biz-h nm-dm-mt${running ? " is-live" : ""}`}>
            <p className="nm-dm-label">{c.feedTitle}</p>
            <div className="nm-dm-row is-tight">
              <button type="button" onClick={() => setRunning((v) => !v)} className="nm-dm-btn2 is-s">
                {running ? c.pause : c.resume}
              </button>
              <button type="button" onClick={() => pushEvent("void", rnd(1100, 3500))} className="nm-dm-btn is-s">
                {c.inject}
              </button>
            </div>
          </div>

          <div ref={feedRef} className="nm-dm-feed is-events">
            {events.map((ev) => (
              <div key={ev.id} className={`nm-dm-feed-i${ev.flagged ? " is-hot is-alert" : ""}`}>
                <span className="is-dim">{ev.time}</span>
                <span className="is-dim">
                  {c.registerWord} {ev.register}
                </span>
                <span className={`nm-dm-kind is-${ev.kind}${ev.flagged || ev.kind !== "sale" ? "" : " is-dim"}`}>
                  {c.kinds[ev.kind]}
                  {ev.kind === "discount" ? ` ${ev.discountPct}%` : ""}
                </span>
                <span className="is-end">{ev.amount.toLocaleString("ru-RU")} ₽</span>
                {ev.flagged && <span className="nm-dm-flag">⚠</span>}
              </div>
            ))}
          </div>

          <p className="nm-dm-label nm-dm-mt">{c.rulesTitle}</p>
          <ul className="nm-dm-list">
            {c.rules.map((r) => (
              <li key={r}>
                <span className="nm-dm-mark">▸</span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Справа: телеграм владельца */}
        <PhoneFrame time={nowTime().slice(0, 5)}>
          <div className="nm-dm-chat-h">
            <div className="nm-dm-ava">
              <span className="nm-dm-emo">🛡️</span>
            </div>
            <div>
              <p className="nm-dm-chat-t">{c.chatTitle}</p>
              <p className="nm-dm-chat-s">online</p>
            </div>
          </div>
          <div ref={chatRef} className="nm-dm-chat">
            {alerts.length === 0 && <p className="nm-dm-empty">{c.chatEmpty}</p>}
            {alerts.map((a) => (
              <div key={a.id} className="nm-dm-msg is-wide is-alert">
                <p className="nm-dm-msg-k">
                  <span className="nm-dm-emo">⚠️</span> {c.alertWord} · {c.registerWord.toLowerCase()} {a.register}
                </p>
                <p>
                  {a.cashier} · {a.amount.toLocaleString("ru-RU")} ₽
                </p>
                <p className="nm-dm-msg-d">
                  {c.ruleWord}: {a.rule.toLowerCase()}
                </p>
                <p className="nm-dm-msg-m">{a.time.slice(0, 5)}</p>
              </div>
            ))}
          </div>
        </PhoneFrame>
      </div>
    </DemoShell>
  );
}
