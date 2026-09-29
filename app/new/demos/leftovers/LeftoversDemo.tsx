"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import DemoShell from "../DemoShell";
import PhoneFrame from "../PhoneFrame";

/* Слив вечерних остатков в макете. Перенос app/demos/leftovers/page.tsx:
   та же витрина, те же суммы, тот же запрос. Текст пуша пишет модель через
   тот же маршрут POST /api/demo (type: "leftovers"), что и на старой
   странице, своего маршрута у макета нет. Меняется только разметка. */

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

export default function LeftoversDemo() {
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
      <div className="nm-dm-split">
        {/* Слева: витрина и получатели */}
        <div className="nm-dm-grow">
          <p className="nm-dm-label">{c.counterTitle}</p>
          <div className="nm-dm-tbl">
            <table>
              <thead>
                <tr>
                  <th>{c.colItem}</th>
                  <th>{c.colQty}</th>
                  <th>{c.colPrice}</th>
                  <th>{c.colSum}</th>
                </tr>
              </thead>
              <tbody>
                {STOCK.map((i) => (
                  <tr key={i.name.en}>
                    <td>{i.name[lang]}</td>
                    <td>{i.qty}</td>
                    <td>{i.price} ₽</td>
                    <td>{(i.qty * i.price).toLocaleString("ru-RU")} ₽</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={3}>{c.writeOffLabel}</td>
                  <td>{writeOffSum.toLocaleString("ru-RU")} ₽</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="nm-dm-mt">
            <button type="button" onClick={run} disabled={loading} className="nm-dm-btn">
              {loading ? c.generating : pushText ? c.regenBtn : c.runBtn}
            </button>
            {error && <p className="nm-dm-err">{error}</p>}
          </div>

          {pushText && (
            <>
              {/* Итог */}
              <div className="nm-dm-nums nm-dm-mt">
                {[
                  { value: `${writeOffSum.toLocaleString("ru-RU")} ₽`, label: c.resultBefore, off: true },
                  { value: "0 ₽", label: c.resultAfter, off: false },
                  { value: `~${savedSum.toLocaleString("ru-RU")} ₽`, label: c.resultSaved, off: false },
                ].map((s) => (
                  <div key={s.label}>
                    <span className={`nm-dm-num-v${s.off ? " is-off" : ""}`}>{s.value}</span>
                    <span className="nm-dm-num-k">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Получатели */}
              <p className="nm-dm-label nm-dm-mt">{c.recipientsTitle}</p>
              <div className="nm-dm-people">
                {RECIPIENTS.map((r, i) => (
                  <div key={r.name.en} className="nm-dm-person nm-dm-in" style={{ animationDelay: `${i * 120}ms` }}>
                    <span className="nm-dm-ava is-s">{r.name[lang][0]}</span>
                    <span>{r.name[lang]}</span>
                    <span className="is-dim">
                      {r.dist} · {c.lastVisit}: {r.last[lang]}
                    </span>
                    <span className="is-end">✓ {c.sent}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Справа: телефон с пушем */}
        <PhoneFrame time="19:31">
          <div className="nm-dm-lock">
            {pushText ? (
              <div className="nm-dm-push nm-dm-in">
                <div className="nm-dm-push-h">
                  <span className="nm-dm-ava">
                    <span className="nm-dm-emo">🥐</span>
                  </span>
                  <span className="nm-dm-push-a">{c.pushApp}</span>
                  <span className="nm-dm-push-m">{sentAt ?? c.pushNow}</span>
                </div>
                <p className="nm-dm-push-t">{pushText}</p>
              </div>
            ) : (
              <div className="nm-dm-center">
                <p className="nm-dm-empty">
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
