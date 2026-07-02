"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import DemoShell from "@/components/demos/DemoShell";
import PhoneFrame from "@/components/demos/PhoneFrame";

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

const copy = {
  en: {
    title: "Pre-order from the stands",
    subtitle:
      "A fan scans a QR code on the seat, orders during the period, pays via SBP without getting up, and picks the order up at a separate window in seconds. On the right: what the concession stand sees during a 15-minute break.",
    pitch:
      "The pitch: during breaks you lose fans who refuse to stand in line. Pre-orders let the stand serve about 30% more checks in the same 15 minutes.",
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
      "Питч: в перерывах вы теряете людей, которые не хотят стоять в очередях. С предзаказом точка пропускает примерно на 30% больше чеков за те же 15 минут.",
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

export default function PreorderDemoPage() {
  const { lang } = useLanguage();
  const c = copy[lang];

  const [screen, setScreen] = useState<Screen>("qr");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [scanning, setScanning] = useState(false);
  const [bank, setBank] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<"preparing" | "ready">("preparing");

  // Business panel simulation
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

  // Break countdown + other fans ordering in the background
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
    >
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Phone */}
        <PhoneFrame time="19:42">
          {screen === "qr" && (
            <div className="flex-1 flex flex-col items-center justify-center px-6 gap-5">
              <p className="font-mono text-[10px] text-white/40 tracking-widest uppercase">{c.seat}</p>
              {/* Decorative QR */}
              <div className={`p-3 bg-white rounded-lg ${scanning ? "animate-pulse" : ""}`}>
                <svg width="120" height="120" viewBox="0 0 21 21" className="block">
                  {[
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
                  ].map(([x, y], i) => (
                    <rect key={i} x={x} y={y} width="1" height="1" fill="#0a0a0a" />
                  ))}
                </svg>
              </div>
              <p className="text-xs text-white/50 text-center">{c.scanHint}</p>
              <button
                onClick={startScan}
                disabled={scanning}
                className="font-mono text-xs px-5 py-2.5 bg-[#7C3AED] text-white rounded hover:bg-[#6d28d9] transition-colors disabled:opacity-50"
              >
                {scanning ? "…" : c.scanBtn}
              </button>
            </div>
          )}

          {screen === "menu" && (
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="px-4 py-2.5 border-b border-white/5">
                <p className="font-mono text-xs font-bold text-white">{c.menuTitle}</p>
                <p className="font-mono text-[9px] text-white/35">{c.seat}</p>
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto chat-scrollbar px-3 py-2 space-y-1.5">
                {MENU.map((item) => (
                  <div key={item.id} className="flex items-center gap-2.5 px-2 py-2 bg-white/[0.03] rounded-lg">
                    <span className="text-xl">{item.emoji}</span>
                    <div className="min-w-0">
                      <p className="text-[11px] text-white/85 leading-tight">{item.name[lang]}</p>
                      <p className="font-mono text-[10px] text-white/40">{item.price} ₽</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <button
                        onClick={() => add(item.id, -1)}
                        className="w-6 h-6 rounded bg-white/5 text-white/60 text-sm hover:bg-white/10"
                      >
                        −
                      </button>
                      <span className="font-mono text-xs text-white w-4 text-center">{cart[item.id] ?? 0}</span>
                      <button
                        onClick={() => add(item.id, 1)}
                        className="w-6 h-6 rounded bg-[#7C3AED] text-white text-sm hover:bg-[#6d28d9]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-white/5">
                <button
                  onClick={() => setScreen("pay")}
                  disabled={cartCount === 0}
                  className="w-full font-mono text-xs px-4 py-3 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6d28d9] transition-colors disabled:opacity-40"
                >
                  {c.cart}: {cartCount} {c.positions} · {cartSum.toLocaleString("ru-RU")} ₽
                </button>
              </div>
            </div>
          )}

          {screen === "pay" && (
            <div className="flex-1 flex flex-col px-4 pt-6 gap-3">
              {!bank ? (
                <>
                  <p className="font-mono text-xs text-white/70 mb-1">
                    {c.payBtn} · {cartSum.toLocaleString("ru-RU")} ₽
                  </p>
                  <p className="text-[11px] text-white/40 mb-2">{c.chooseBank}</p>
                  {BANKS.map((b) => (
                    <button
                      key={b}
                      onClick={() => pay(b)}
                      className="w-full text-left px-4 py-3 bg-white/[0.04] border border-white/10 rounded-lg text-sm text-white/80 hover:border-[#7C3AED]/50 transition-colors"
                    >
                      {b}
                    </button>
                  ))}
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                  <div className="w-10 h-10 border-2 border-[#7C3AED] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-white/60 text-center">
                    {bank} · {c.paying}
                  </p>
                </div>
              )}
            </div>
          )}

          {screen === "order" && (
            <div className="flex-1 flex flex-col items-center justify-center px-6 gap-3 text-center">
              <p className="text-3xl">✅</p>
              <p className="font-mono text-xs text-emerald-400">{c.orderReady}</p>
              <p className="font-mono text-[10px] text-white/40 mt-3">{c.orderNumber}</p>
              <p className="font-mono text-4xl font-bold text-white tracking-wider">{myNumber}</p>
              <p className="font-mono text-xs text-[#a78bfa] mt-1">{c.pickup}</p>
              <div
                className={`font-mono text-[10px] px-3 py-1 rounded-full mt-2 ${
                  orderStatus === "ready"
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-amber-500/15 text-amber-400"
                }`}
              >
                {orderStatus === "ready" ? `● ${c.statusReady}` : `● ${c.statusPreparing}`}
              </div>
              <p className="text-[10px] text-white/35 mt-2">{c.showNumber}</p>
              <button
                onClick={restart}
                className="font-mono text-[10px] text-white/30 hover:text-white transition-colors mt-4 underline underline-offset-4"
              >
                {c.restart}
              </button>
            </div>
          )}
        </PhoneFrame>

        {/* Business panel */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-xs text-white/25 tracking-[0.15em] uppercase">{c.bizTitle}</p>
            <p className="font-mono text-xs text-white/50">
              {c.breakLabel}: <span className="text-[#a78bfa] font-bold">{mm}:{ss}</span>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { value: totalOrders, label: c.orders },
              { value: `${avgCheck.toLocaleString("ru-RU")} ₽`, label: c.avgCheck },
              { value: `${revenue.toLocaleString("ru-RU")} ₽`, label: c.revenue },
            ].map((s) => (
              <div key={s.label} className="p-4 bg-[#111111] border border-[#1f1f1f] rounded-lg">
                <p className="font-mono text-xl font-bold text-[#a78bfa]">{s.value}</p>
                <p className="font-mono text-[10px] text-white/30 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Queue vs pre-order comparison */}
          <div className="p-4 bg-[#111111] border border-[#1f1f1f] rounded-lg mb-6">
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-wider mb-3">{c.compareTitle}</p>
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between font-mono text-[10px] text-white/40 mb-1">
                  <span>{c.withQueue}</span>
                  <span>48</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-white/25 rounded-full" style={{ width: "62%" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between font-mono text-[10px] mb-1">
                  <span className="text-white/40">{c.withPreorder}</span>
                  <span className="text-[#a78bfa] font-bold">62 · +30%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#7C3AED] rounded-full" style={{ width: "81%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Incoming orders feed */}
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-wider mb-2">{c.feedTitle}</p>
          <div
            ref={feedRef}
            className="h-[180px] overflow-y-auto chat-scrollbar bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg p-3 font-mono text-xs space-y-1.5"
          >
            {feed.map((o, i) => (
              <div
                key={`${o.id}-${i}`}
                className={`flex items-center justify-between px-2 py-1.5 rounded ${
                  o.yours ? "bg-[#7C3AED]/15 border border-[#7C3AED]/40" : ""
                }`}
              >
                <span className={o.yours ? "text-[#a78bfa] font-bold" : "text-white/60"}>
                  {o.id}
                  {o.yours ? ` · ${c.yourOrder}` : ""}
                </span>
                <span className="text-white/40">{o.sum.toLocaleString("ru-RU")} ₽</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DemoShell>
  );
}
