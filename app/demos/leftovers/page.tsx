"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import DemoShell from "@/components/demos/DemoShell";
import PhoneFrame from "@/components/demos/PhoneFrame";

const DISCOUNT = 0.4;

const STOCK = [
  { name: { en: "Apple pie", ru: "Пирог с яблоком" }, qty: 3, price: 220 },
  { name: { en: "Chicken quiche", ru: "Киш с курицей" }, qty: 2, price: 340 },
  { name: { en: "Caesar salad", ru: "Салат Цезарь" }, qty: 4, price: 290 },
  { name: { en: "Cinnamon bun", ru: "Булочка с корицей" }, qty: 6, price: 90 },
  { name: { en: "Soup of the day", ru: "Суп дня" }, qty: 2, price: 180 },
];

const RECIPIENTS = [
  { name: { en: "Maria", ru: "Мария" }, dist: "400 м", last: { en: "3 days ago", ru: "3 дня назад" } },
  { name: { en: "Dmitry", ru: "Дмитрий" }, dist: "650 м", last: { en: "yesterday", ru: "вчера" } },
  { name: { en: "Anna", ru: "Анна" }, dist: "800 м", last: { en: "5 days ago", ru: "5 дней назад" } },
  { name: { en: "Sergey", ru: "Сергей" }, dist: "950 м", last: { en: "a week ago", ru: "неделю назад" } },
  { name: { en: "Olga", ru: "Ольга" }, dist: "1 км", last: { en: "2 days ago", ru: "2 дня назад" } },
];

const copy = {
  en: {
    title: "Selling off evening leftovers with AI",
    subtitle:
      "At 7:30 pm the system looks at what is left on the counter (data comes from the POS software), AI writes the push text, and loyal customers living nearby get it. Press the button and watch it happen.",
    pitch:
      "Instead of writing prepared food off at a loss every evening, the venue sells it at 40% off to people who are a 10-minute walk away.",
    counterTitle: "Counter · 7:30 pm",
    colItem: "Item",
    colQty: "Qty",
    colPrice: "Price",
    colSum: "Sum",
    writeOffLabel: "to be written off tonight",
    runBtn: "Run the AI push",
    regenBtn: "Generate again",
    generating: "AI is writing the text…",
    unavailable: "Generation is unavailable right now. Try again in a minute.",
    recipientsTitle: "Loyal customers within 1 km",
    lastVisit: "last visit",
    sent: "sent",
    resultBefore: "write-offs before",
    resultAfter: "write-offs after",
    resultSaved: "revenue recovered at 40% off",
    pushApp: "Lavka No.1",
    pushNow: "now",
  },
  ru: {
    title: "Слив вечерних остатков через ИИ",
    subtitle:
      "В 19:30 система смотрит, что осталось на витрине (данные приходят из кассового ПО), ИИ пишет текст пуша, и его получают лояльные клиенты, живущие рядом. Нажмите кнопку и посмотрите, как это происходит.",
    pitch:
      "Вместо того чтобы каждый вечер списывать готовую еду в минус, точка продаёт её со скидкой 40% людям, которые живут в 10 минутах пешком.",
    counterTitle: "Витрина · 19:30",
    colItem: "Позиция",
    colQty: "Кол-во",
    colPrice: "Цена",
    colSum: "Сумма",
    writeOffLabel: "к списанию сегодня",
    runBtn: "Запустить ИИ-рассылку",
    regenBtn: "Сгенерировать заново",
    generating: "ИИ пишет текст…",
    unavailable: "Генерация сейчас недоступна. Попробуйте через минуту.",
    recipientsTitle: "Лояльные клиенты в радиусе 1 км",
    lastVisit: "последний визит",
    sent: "отправлено",
    resultBefore: "списания до",
    resultAfter: "списания после",
    resultSaved: "спасено выручки со скидкой 40%",
    pushApp: "Лавка №1",
    pushNow: "сейчас",
  },
};

export default function LeftoversDemoPage() {
  const { lang } = useLanguage();
  const c = copy[lang];

  const [pushText, setPushText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentAt, setSentAt] = useState<string | null>(null);

  const writeOffSum = STOCK.reduce((s, i) => s + i.qty * i.price, 0);
  const savedSum = Math.round(writeOffSum * (1 - DISCOUNT));

  async function run() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "leftovers",
          lang,
          items: STOCK.map((i) => ({ name: i.name[lang], qty: i.qty, price: i.price })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.content) {
        setError(c.unavailable);
      } else {
        setPushText(data.content);
        setSentAt(new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }));
      }
    } catch {
      setError(c.unavailable);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DemoShell
      title={{ en: copy.en.title, ru: copy.ru.title }}
      subtitle={{ en: copy.en.subtitle, ru: copy.ru.subtitle }}
      pitch={{ en: copy.en.pitch, ru: copy.ru.pitch }}
      hint={{ en: "Press Run the AI push and watch the push land on the phone.", ru: "Нажмите «Запустить ИИ-рассылку» и посмотрите, как пуш придёт на телефон справа." }}
    >
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Left: counter + recipients */}
        <div className="flex-1 min-w-0 w-full">
          <p className="tiny mb-3">{c.counterTitle}</p>
          <div className="border border-rule overflow-hidden mb-4">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-dim border-b border-rule">
                  <th className="text-left px-4 py-2.5 font-normal">{c.colItem}</th>
                  <th className="text-right px-3 py-2.5 font-normal">{c.colQty}</th>
                  <th className="text-right px-3 py-2.5 font-normal">{c.colPrice}</th>
                  <th className="text-right px-4 py-2.5 font-normal">{c.colSum}</th>
                </tr>
              </thead>
              <tbody>
                {STOCK.map((i) => (
                  <tr key={i.name.en} className="border-b border-rule-soft">
                    <td className="px-4 py-2.5">{i.name[lang]}</td>
                    <td className="text-right px-3 py-2.5">{i.qty}</td>
                    <td className="text-right px-3 py-2.5">{i.price} ₽</td>
                    <td className="text-right px-4 py-2.5">{(i.qty * i.price).toLocaleString("ru-RU")} ₽</td>
                  </tr>
                ))}
                <tr>
                  <td className="px-4 py-3 font-bold" colSpan={3}>
                    {c.writeOffLabel}
                  </td>
                  <td className="text-right px-4 py-3 font-bold text-acc">
                    {writeOffSum.toLocaleString("ru-RU")} ₽
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            onClick={run}
            disabled={loading}
            className="tiny !text-[11px] px-5 py-3 bg-ink text-paper hover:opacity-80 transition-opacity disabled:opacity-50 mb-2"
          >
            {loading ? c.generating : pushText ? c.regenBtn : c.runBtn}
          </button>
          {error && <p className="text-xs text-acc mt-2">{error}</p>}

          {pushText && (
            <>
              {/* Results */}
              <div className="grid grid-cols-3 gap-3 mt-6 mb-6">
                {[
                  { value: `${writeOffSum.toLocaleString("ru-RU")} ₽`, label: c.resultBefore, cls: "text-dim line-through" },
                  { value: "0 ₽", label: c.resultAfter, cls: "text-ink" },
                  { value: `~${savedSum.toLocaleString("ru-RU")} ₽`, label: c.resultSaved, cls: "text-acc" },
                ].map((s) => (
                  <div key={s.label} className="demo-card">
                    <p className={`text-lg font-bold ${s.cls}`}>{s.value}</p>
                    <p className="tiny !text-[10px] mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Recipients */}
              <p className="tiny mb-2">{c.recipientsTitle}</p>
              <div className="space-y-1.5">
                {RECIPIENTS.map((r, i) => (
                  <div
                    key={r.name.en}
                    className="flex items-center gap-3 px-3 py-2 border border-rule text-xs animate-[fadeUp_0.5s_ease_both]"
                    style={{ animationDelay: `${i * 120}ms` }}
                  >
                    <span className="w-6 h-6 rounded-full border border-ink flex items-center justify-center text-[10px]">
                      {r.name[lang][0]}
                    </span>
                    <span>{r.name[lang]}</span>
                    <span className="text-dim">
                      {r.dist} · {c.lastVisit}: {r.last[lang]}
                    </span>
                    <span className="ml-auto text-acc">✓ {c.sent}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right: phone with push */}
        <PhoneFrame time="19:31">
          <div className="flex-1 flex flex-col px-3 pt-10 gap-2 bg-[radial-gradient(circle_at_50%_0%,rgba(124,58,237,0.12),transparent_60%)]">
            {pushText ? (
              <div className="bg-[#1c1c1e]/95 rounded-2xl px-3.5 py-3 animate-[fadeUp_0.4s_ease_both] shadow-lg">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 rounded-md bg-[#7C3AED] flex items-center justify-center text-[10px]">🥐</span>
                  <span className="font-mono text-[10px] text-white/60 uppercase">{c.pushApp}</span>
                  <span className="font-mono text-[9px] text-white/30 ml-auto">{sentAt ?? c.pushNow}</span>
                </div>
                <p className="text-[12px] text-white/90 leading-snug">{pushText}</p>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="font-mono text-[10px] text-white/25 text-center px-6">
                  {loading ? c.generating : lang === "en" ? "The push will appear here" : "Пуш появится здесь"}
                </p>
              </div>
            )}
          </div>
        </PhoneFrame>
      </div>
    </DemoShell>
  );
}
