"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import DemoShell from "@/components/demos/DemoShell";
import PhoneFrame from "@/components/demos/PhoneFrame";

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
      "The pitch: if a cashier voids a check, deletes an item, or plays with discounts, the owner gets an alert instantly. Control 24/7 without hours of camera footage.",
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
      "Питч: если кассир отменяет чек, удаляет позицию или химичит со скидками, владельцу в ту же секунду летит алерт. Контроль 24/7 без отсмотра камер часами.",
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

export default function FraudDemoPage() {
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

  const kindColor: Record<EventKind, string> = {
    sale: "text-white/40",
    void: "text-amber-400/80",
    delete: "text-orange-400/80",
    discount: "text-sky-400/80",
  };

  return (
    <DemoShell
      title={{ en: copy.en.title, ru: copy.ru.title }}
      subtitle={{ en: copy.en.subtitle, ru: copy.ru.subtitle }}
      pitch={{ en: copy.en.pitch, ru: copy.ru.pitch }}
    >
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8 max-w-2xl">
        {[
          { value: processed, label: c.stats.events },
          { value: alerts.length, label: c.stats.alerts },
          { value: `${flaggedSum.toLocaleString("ru-RU")} ₽`, label: c.stats.saved },
        ].map((s) => (
          <div key={s.label} className="p-4 bg-[#111111] border border-[#1f1f1f] rounded-lg">
            <p className="font-mono text-xl font-bold text-[#a78bfa]">{s.value}</p>
            <p className="font-mono text-[10px] text-white/30 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Left: feed + rules */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center justify-between mb-3">
            <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase">{c.feedTitle}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setRunning((v) => !v)}
                className="font-mono text-xs px-3 py-1.5 border border-white/15 text-white/70 rounded hover:border-white/30 hover:text-white transition-colors"
              >
                {running ? c.pause : c.resume}
              </button>
              <button
                onClick={() => pushEvent("void", rnd(1100, 3500))}
                className="font-mono text-xs px-3 py-1.5 bg-[#7C3AED] text-white rounded hover:bg-[#6d28d9] transition-colors"
              >
                {c.inject}
              </button>
            </div>
          </div>

          <div
            ref={feedRef}
            className="h-[340px] overflow-y-auto chat-scrollbar bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg p-3 font-mono text-xs space-y-1.5"
          >
            {events.map((ev) => (
              <div
                key={ev.id}
                className={`flex items-center gap-2 px-2 py-1.5 rounded ${
                  ev.flagged ? "bg-red-500/10 border border-red-500/30" : ""
                }`}
              >
                <span className="text-white/25 shrink-0">{ev.time}</span>
                <span className="text-white/30 shrink-0">
                  {c.registerWord} {ev.register}
                </span>
                <span className={`shrink-0 ${ev.flagged ? "text-red-400" : kindColor[ev.kind]}`}>
                  {c.kinds[ev.kind]}
                  {ev.kind === "discount" ? ` ${ev.discountPct}%` : ""}
                </span>
                <span className="text-white/50 ml-auto shrink-0">{ev.amount.toLocaleString("ru-RU")} ₽</span>
                {ev.flagged && <span className="text-red-400 shrink-0">⚠</span>}
              </div>
            ))}
          </div>

          <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase mt-6 mb-3">{c.rulesTitle}</p>
          <ul className="space-y-2">
            {c.rules.map((r) => (
              <li key={r} className="flex items-start gap-2 text-sm text-white/50">
                <span className="text-[#a78bfa] mt-0.5">▸</span>
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: owner's Telegram */}
        <PhoneFrame time={nowTime().slice(0, 5)}>
          <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#7C3AED]/30 flex items-center justify-center text-sm">🛡️</div>
            <div>
              <p className="font-mono text-xs font-bold text-white">{c.chatTitle}</p>
              <p className="font-mono text-[9px] text-emerald-400/80">online</p>
            </div>
          </div>
          <div ref={chatRef} className="flex-1 min-h-0 overflow-y-auto chat-scrollbar px-3 py-3 space-y-2">
            {alerts.length === 0 && (
              <p className="font-mono text-[10px] text-white/25 text-center mt-8">{c.chatEmpty}</p>
            )}
            {alerts.map((a) => (
              <div key={a.id} className="bg-[#182533] rounded-lg rounded-tl-sm px-3 py-2 max-w-[92%]">
                <p className="font-mono text-[11px] text-red-400 font-bold mb-1">
                  ⚠️ {c.alertWord} · {c.registerWord.toLowerCase()} {a.register}
                </p>
                <p className="text-[11px] text-white/85 leading-snug">
                  {a.cashier} · {a.amount.toLocaleString("ru-RU")} ₽
                </p>
                <p className="text-[10px] text-white/50 leading-snug mt-0.5">
                  {c.ruleWord}: {a.rule.toLowerCase()}
                </p>
                <p className="font-mono text-[9px] text-white/30 text-right mt-1">{a.time.slice(0, 5)}</p>
              </div>
            ))}
          </div>
        </PhoneFrame>
      </div>
    </DemoShell>
  );
}
