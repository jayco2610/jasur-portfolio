"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import DemoShell from "../DemoShell";
import PhoneFrame from "../PhoneFrame";

/* Предзаказ с трибуны в макете. Перенос app/demos/preorder/page.tsx:
   четыре экрана телефона (QR, меню, оплата, заказ), те же паузы
   (сканирование 0,9 секунды, банк 2,2, готовность 4), панель точки с
   таймером перерыва и чужими заказами раз в 4,2 секунды. Логика строка в
   строку, меняется только разметка. Сети демо не трогает. */

type Screen = "qr" | "menu" | "pay" | "order";

const MENU = [
  { id: "popcorn", emoji: "🍿", name: { en: "Popcorn", ru: "Попкорн" }, price: 350 },
  { id: "hotdog", emoji: "🌭", name: { en: "Hot dog", ru: "Хот-дог" }, price: 280 },
  { id: "nachos", emoji: "🧀", name: { en: "Nachos", ru: "Начос с сыром" }, price: 320 },
  { id: "cola", emoji: "🥤", name: { en: "Cola 0.5", ru: "Кола 0,5" }, price: 150 },
  { id: "coffee", emoji: "☕", name: { en: "Coffee", ru: "Кофе" }, price: 180 },
  { id: "water", emoji: "💧", name: { en: "Water", ru: "Вода" }, price: 100 },
];

const BANKS = ["Сбер", "Т-Банк", "Альфа", "ВТБ"];

/* Декоративный QR, те же клетки, что на старой странице. */
const QR_CELLS = [
  [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [9, 0], [12, 0], [14, 0], [16, 0], [18, 0], [20, 0],
  [0, 1], [6, 1], [8, 1], [11, 1], [14, 1], [16, 1], [20, 1],
  [0, 2], [2, 2], [3, 2], [4, 2], [6, 2], [9, 2], [10, 2], [13, 2], [14, 2], [18, 2], [20, 2],
  [0, 3], [2, 3], [3, 3], [4, 3], [6, 3], [8, 3], [12, 3], [15, 3], [17, 3], [20, 3],
  [0, 4], [2, 4], [3, 4], [4, 4], [6, 4], [9, 4], [11, 4], [13, 4], [16, 4], [18, 4], [20, 4],
  [0, 5], [6, 5], [10, 5], [12, 5], [15, 5], [19, 5],
  [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [8, 6], [10, 6], [12, 6], [14, 6], [16, 6], [18, 6], [20, 6],
  [9, 7], [13, 7], [17, 7],
  [0, 8], [3, 8], [5, 8], [6, 8], [7, 8], [10, 8], [11, 8], [14, 8], [18, 8], [19, 8],
  [1, 9], [4, 9], [8, 9], [12, 9], [16, 9], [20, 9],
  [0, 10], [2, 10], [5, 10], [6, 10], [9, 10], [13, 10], [15, 10], [17, 10],
  [1, 11], [3, 11], [7, 11], [11, 11], [14, 11], [19, 11],
  [0, 12], [4, 12], [6, 12], [8, 12], [10, 12], [12, 12], [16, 12], [18, 12], [20, 12],
  [2, 13], [5, 13], [9, 13], [13, 13], [15, 13], [19, 13],
  [0, 14], [1, 14], [2, 14], [3, 14], [4, 14], [5, 14], [6, 14], [10, 14], [12, 14], [14, 14], [16, 14], [20, 14],
  [0, 15], [6, 15], [8, 15], [11, 15], [15, 15], [18, 15],
  [0, 16], [2, 16], [3, 16], [4, 16], [6, 16], [9, 16], [12, 16], [14, 16], [17, 16], [20, 16],
  [0, 17], [2, 17], [3, 17], [4, 17], [6, 17], [8, 17], [13, 17], [16, 17], [19, 17],
  [0, 18], [2, 18], [3, 18], [4, 18], [6, 18], [10, 18], [11, 18], [15, 18], [18, 18], [20, 18],
  [0, 19], [6, 19], [9, 19], [12, 19], [14, 19], [17, 19],
  [0, 20], [1, 20], [2, 20], [3, 20], [4, 20], [5, 20], [6, 20], [8, 20], [11, 20], [13, 20], [16, 20], [19, 20],
];

const copy = {
  en: {
    title: "Pre-order from the stands",
    subtitle:
      "A fan scans a QR code on the seat, orders during the period, pays via SBP without getting up, and picks the order up at a separate window in seconds. On the right: what the concession stand sees during a 15-minute break.",
    pitch:
      "During breaks you lose fans who refuse to stand in line. Pre-orders let the stand serve about 30% more checks in the same 15 minutes.",
    seat: "Sector B · Row 7 · Seat 12",
    scanHint: "Scan the QR code on your seat",
    scanBtn: "Scan QR",
    menuTitle: "Molot Arena · Stand No.2",
    cart: "Cart",
    positions: "items",
    payBtn: "Pay via SBP",
    chooseBank: "Choose your bank",
    paying: "Confirm in your bank app…",
    orderReady: "Order paid",
    orderNumber: "Your number",
    pickup: "Pickup window No.2",
    showNumber: "Show this number at the window",
    statusPreparing: "preparing",
    statusReady: "ready to pick up",
    bizTitle: "What the stand sees",
    breakLabel: "Break time left",
    orders: "orders this break",
    avgCheck: "average check",
    revenue: "revenue this break",
    compareTitle: "Same 15 minutes, checks served",
    withQueue: "queue only",
    withPreorder: "with pre-order",
    feedTitle: "Incoming orders",
    yourOrder: "your order",
    restart: "Restart the flow",
  },
  ru: {
    title: "Предзаказ с трибуны",
    subtitle:
      "Болельщик сканирует QR на кресле, заказывает во время матча, платит через СБП не вставая с места и забирает заказ в отдельном окне за секунды. Справа: что видит точка питания за 15-минутный перерыв.",
    pitch:
      "В перерывах вы теряете людей, которые не хотят стоять в очередях. С предзаказом точка пропускает примерно на 30% больше чеков за те же 15 минут.",
    seat: "Сектор B · Ряд 7 · Место 12",
    scanHint: "Отсканируйте QR-код на вашем кресле",
    scanBtn: "Сканировать QR",
    menuTitle: "Молот Арена · Точка №2",
    cart: "Корзина",
    positions: "поз.",
    payBtn: "Оплатить через СБП",
    chooseBank: "Выберите ваш банк",
    paying: "Подтвердите в приложении банка…",
    orderReady: "Заказ оплачен",
    orderNumber: "Ваш номер",
    pickup: "Окно выдачи №2",
    showNumber: "Покажите номер на выдаче",
    statusPreparing: "готовится",
    statusReady: "готов к выдаче",
    bizTitle: "Что видит точка",
    breakLabel: "До конца перерыва",
    orders: "заказов за перерыв",
    avgCheck: "средний чек",
    revenue: "выручка за перерыв",
    compareTitle: "Те же 15 минут, обслужено чеков",
    withQueue: "только очередь",
    withPreorder: "с предзаказом",
    feedTitle: "Входящие заказы",
    yourOrder: "ваш заказ",
    restart: "Пройти заново",
  },
};

function rnd(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

type FeedOrder = { id: string; sum: number; yours?: boolean };

/* Номер заказа хранится с русской буквой (Б-41), на английском показывается
   латиницей (B-41): иначе в английском демо оставалась кириллица. Меняется
   только подпись, сами номера и их порядок те же. */
function orderLabel(id: string, lang: "en" | "ru"): string {
  return lang === "en" ? id.replace(/^Б-/, "B-") : id;
}

export default function PreorderDemo() {
  const { lang } = useLanguage();
  const c = copy[lang];

  const [screen, setScreen] = useState<Screen>("qr");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [scanning, setScanning] = useState(false);
  const [bank, setBank] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<"preparing" | "ready">("preparing");

  // Панель точки: симуляция
  const [breakSeconds, setBreakSeconds] = useState(15 * 60);
  const [feed, setFeed] = useState<FeedOrder[]>([{ id: "Б-41", sum: 630 }, { id: "Б-42", sum: 450 }]);
  const orderNo = useRef(43);
  const feedRef = useRef<HTMLDivElement>(null);

  const cartEntries = Object.entries(cart).filter(([, q]) => q > 0);
  const cartCount = cartEntries.reduce((s, [, q]) => s + q, 0);
  const cartSum = cartEntries.reduce((s, [id, q]) => {
    const item = MENU.find((m) => m.id === id);
    return s + (item ? item.price * q : 0);
  }, 0);

  const totalOrders = feed.length;
  const revenue = feed.reduce((s, o) => s + o.sum, 0);
  const avgCheck = totalOrders ? Math.round(revenue / totalOrders) : 0;

  // Отсчёт перерыва и заказы других болельщиков в фоне
  useEffect(() => {
    const tick = setInterval(() => setBreakSeconds((s) => (s > 0 ? s - 1 : 15 * 60)), 1000);
    const orders = setInterval(() => {
      const order = { id: `Б-${orderNo.current++}`, sum: rnd(150, 980) };
      setFeed((prev) => [...prev.slice(-14), order]);
    }, 4200);
    return () => {
      clearInterval(tick);
      clearInterval(orders);
    };
  }, []);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
  }, [feed]);

  function add(id: string, delta: number) {
    setCart((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }));
  }

  function startScan() {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScreen("menu");
    }, 900);
  }

  const [myNumber, setMyNumber] = useState("");

  function pay(chosenBank: string) {
    setBank(chosenBank);
    setTimeout(() => {
      const num = `Б-${orderNo.current++}`;
      setMyNumber(num);
      setFeed((prev) => [...prev.slice(-14), { id: num, sum: cartSum, yours: true }]);
      setScreen("order");
      setOrderStatus("preparing");
      setTimeout(() => setOrderStatus("ready"), 4000);
    }, 2200);
  }

  function restart() {
    setScreen("qr");
    setCart({});
    setBank(null);
    setOrderStatus("preparing");
  }

  const mm = String(Math.floor(breakSeconds / 60)).padStart(2, "0");
  const ss = String(breakSeconds % 60).padStart(2, "0");

  return (
    <DemoShell
      title={{ en: copy.en.title, ru: copy.ru.title }}
      subtitle={{ en: copy.en.subtitle, ru: copy.ru.subtitle }}
      pitch={{ en: copy.en.pitch, ru: copy.ru.pitch }}
      hint={{ en: "Press Scan QR on the phone and walk the order through to pickup.", ru: "Нажмите «Сканировать QR» в телефоне и пройдите заказ до конца, до статуса «готов к выдаче»." }}
    >
      <div className="nm-dm-split">
        {/* Телефон */}
        <PhoneFrame time="19:42">
          {screen === "qr" && (
            <div className="nm-dm-qr">
              <p className="nm-dm-seat">{c.seat}</p>
              <div className={`nm-dm-qr-box${scanning ? " is-scan" : ""}`}>
                <svg width="120" height="120" viewBox="0 0 21 21" aria-hidden="true">
                  {QR_CELLS.map(([x, y], i) => (
                    <rect key={i} x={x} y={y} width="1" height="1" fill="#0b0b0b" />
                  ))}
                </svg>
              </div>
              <p className="nm-dm-small">{c.scanHint}</p>
              <button type="button" onClick={startScan} disabled={scanning} className="nm-dm-btn">
                {scanning ? "…" : c.scanBtn}
              </button>
            </div>
          )}

          {screen === "menu" && (
            <>
              <div className="nm-dm-chat-h">
                <div>
                  <p className="nm-dm-chat-t">{c.menuTitle}</p>
                  <p className="nm-dm-chat-s">{c.seat}</p>
                </div>
              </div>
              <div className="nm-dm-menu">
                {MENU.map((item) => (
                  <div key={item.id} className="nm-dm-item">
                    <span className="nm-dm-item-e nm-dm-emo">{item.emoji}</span>
                    <div>
                      <p className="nm-dm-item-n">{item.name[lang]}</p>
                      <p className="nm-dm-item-p">{item.price} ₽</p>
                    </div>
                    <div className="nm-dm-qty">
                      <button type="button" onClick={() => add(item.id, -1)} aria-label="−">
                        −
                      </button>
                      <span>{cart[item.id] ?? 0}</span>
                      <button type="button" onClick={() => add(item.id, 1)} className="is-add" aria-label="+">
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="nm-dm-phone-foot">
                <button type="button" onClick={() => setScreen("pay")} disabled={cartCount === 0} className="nm-dm-btn">
                  {c.cart}: {cartCount} {c.positions} · {cartSum.toLocaleString("ru-RU")} ₽
                </button>
              </div>
            </>
          )}

          {screen === "pay" && (
            <div className="nm-dm-pay">
              {!bank ? (
                <>
                  <p className="nm-dm-pay-t">
                    {c.payBtn} · {cartSum.toLocaleString("ru-RU")} ₽
                  </p>
                  <p className="nm-dm-small" style={{ marginBottom: 6 }}>
                    {c.chooseBank}
                  </p>
                  {BANKS.map((b) => (
                    <button key={b} type="button" onClick={() => pay(b)} className="nm-dm-bank">
                      {b}
                    </button>
                  ))}
                </>
              ) : (
                <div className="nm-dm-order">
                  <span className="nm-dm-spin is-l" aria-hidden="true" />
                  <p className="nm-dm-small">
                    {bank} · {c.paying}
                  </p>
                </div>
              )}
            </div>
          )}

          {screen === "order" && (
            <div className="nm-dm-order">
              <p className="nm-dm-emo" style={{ fontSize: 30, lineHeight: 1 }}>
                ✅
              </p>
              <p className="nm-dm-pay-t">{c.orderReady}</p>
              <p className="nm-dm-seat" style={{ marginTop: 10 }}>
                {c.orderNumber}
              </p>
              <p className="nm-dm-order-no">{orderLabel(myNumber, lang)}</p>
              <p className="nm-dm-small" style={{ color: "var(--nm-ink)" }}>
                {c.pickup}
              </p>
              <span className={`nm-dm-state${orderStatus === "ready" ? " is-ready" : ""}`}>
                {orderStatus === "ready" ? `● ${c.statusReady}` : `● ${c.statusPreparing}`}
              </span>
              <p className="nm-dm-small">{c.showNumber}</p>
              <button type="button" onClick={restart} className="nm-dm-textbtn">
                {c.restart}
              </button>
            </div>
          )}
        </PhoneFrame>

        {/* Панель точки */}
        <div className="nm-dm-grow">
          <div className="nm-dm-biz-h">
            <p className="nm-dm-label">{c.bizTitle}</p>
            <p className="nm-dm-timer">
              {c.breakLabel}:{" "}
              <b>
                {mm}:{ss}
              </b>
            </p>
          </div>

          <div className="nm-dm-nums">
            {[
              { value: totalOrders, label: c.orders },
              { value: `${avgCheck.toLocaleString("ru-RU")} ₽`, label: c.avgCheck },
              { value: `${revenue.toLocaleString("ru-RU")} ₽`, label: c.revenue },
            ].map((s) => (
              <div key={s.label}>
                <span className="nm-dm-num-v">{s.value}</span>
                <span className="nm-dm-num-k">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Очередь против предзаказа */}
          <div className="nm-dm-panel nm-dm-mt">
            <p className="nm-dm-label">{c.compareTitle}</p>
            <div className="nm-dm-bars">
              <div>
                <div className="nm-dm-bar-k">
                  <span>{c.withQueue}</span>
                  <span>48</span>
                </div>
                <div className="nm-dm-bar">
                  <i style={{ width: "62%" }} />
                </div>
              </div>
              <div>
                <div className="nm-dm-bar-k">
                  <span>{c.withPreorder}</span>
                  <b>62 · +30%</b>
                </div>
                <div className="nm-dm-bar">
                  <i className="is-ink" style={{ width: "81%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Входящие заказы */}
          <p className="nm-dm-label nm-dm-mt">{c.feedTitle}</p>
          <div ref={feedRef} className="nm-dm-feed is-orders">
            {feed.map((o, i) => (
              <div key={`${o.id}-${i}`} className={`nm-dm-feed-i${o.yours ? " is-hot" : ""}`}>
                <span className={o.yours ? undefined : "is-dim"}>
                  {o.yours ? <b>{orderLabel(o.id, lang)}</b> : orderLabel(o.id, lang)}
                  {o.yours ? ` · ${c.yourOrder}` : ""}
                </span>
                <span className="is-dim">{o.sum.toLocaleString("ru-RU")} ₽</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DemoShell>
  );
}
