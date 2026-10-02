"use client";

import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { CHAT, type L } from "./text";

/* Окно JasurGPT, вариант «Титр». Его выбрал Жасур из трёх вариантов
   лаборатории (ветка jasurgpt-variants, страница /lab/jasurgpt, в main
   не сливалась): экран темнеет, портрет проступает из темноты с медленным
   наездом, под ним разреженный титр, потом портрет уходит в левую колонку
   (на телефоне в шапку), справа переписка, ответы печатаются.

   Отличия от лабораторной версии.
   1. Портрет во вступлении другой файл: portret-noir.jpg. У исходного снимка
      светлый студийный фон, и из черноты выходил яркий прямоугольник, а не
      лицо. В portret-noir.jpg фон заменён чёрным #0b0b0b, ровно цветом
      слоя: человек вырезан маской Vision (macOS, выделение главного
      объекта), кромка маски ужата на 4 точки и смягчена на 3, просветы фона
      между прядями придавлены кривой. Скрипт лежит в
      ~/Desktop/portfolio/tools/noir.swift. Раз фон снимка совпадает с фоном
      слоя, проявка идёт одной прозрачностью, без brightness: затемнение
      фильтром делало бы фон снимка темнее фона слоя, и прямоугольник
      проступил бы снова, теперь тёмный. Зерно по той же причине лежит
      поверх портрета, а не под ним.
      В левой колонке после вступления остаётся тот же затемнённый снимок.
      Исходный там проверяли (кадры titr-1440-final и
      titr-1440-final-original, 1 октября 2026): светлый прямоугольник
      становится самым ярким пятном на экране и тянет взгляд с ответа на
      себя, и в конце полёта снимок пришлось бы подменять. Затемнённый
      продолжает вступление без шва, а самым светлым на экране остаётся
      текст.
   2. Наезд 1,12 к 1,0 вместо 1,08 к 1,0, за те же две секунды. Прежний
      почти не читался.
   3. Escape закрывает окно в любой момент, в том числе во время
      вступления. Остальные клавиши и клик вступление пропускают.

   Как устроено движение. Вёрстка слоя сразу стоит в конечном состоянии,
   CSS в gpt.css описывает именно его. Вступление собирается через Web
   Animations API (element.animate) в момент открытия, до первой отрисовки.
   Отсюда три свойства без отдельного кода:
   - пропуск: всем анимациям вызывается finish(), и всё встаёт в конец;
   - prefers-reduced-motion: анимации просто не создаются;
   - короткий повтор: та же вёрстка, другой, сжатый набор анимаций.
   Полёт портрета в колонку меряет конечное место через
   getBoundingClientRect. */

export type Mode = "full" | "short" | "none";
export type Msg = { role: "user" | "assistant"; content: string };

export const PORTRAIT = "/new/portret-noir.jpg";

const EASE = "cubic-bezier(.2,.7,.2,1)";
const MOVE = "cubic-bezier(.65,0,.35,1)";

type Rect = { top: number; left: number; width: number; height: number };

const px = (r: Rect): Keyframe => ({
  top: `${Math.round(r.top)}px`,
  left: `${Math.round(r.left)}px`,
  width: `${Math.round(r.width)}px`,
  height: `${Math.round(r.height)}px`,
});

function measure(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

/* Сборщик списка анимаций. fill "both" держит первый кадр до старта и
   последний после конца. */
function timeline() {
  const list: Animation[] = [];
  const add = (
    el: Element | null | undefined,
    frames: Keyframe[],
    delay: number,
    duration: number,
    easing = EASE,
    fill: FillMode = "both"
  ) => {
    if (el) list.push(el.animate(frames, { delay, duration, easing, fill }));
  };
  return { list, add };
}

const fadeIn = (dy = 0, dx = 0): Keyframe[] => [
  { opacity: 0, transform: `translate(${dx}px, ${dy}px)` },
  { opacity: 1, transform: "none" },
];

/* Где стоит портрет во вступлении: по центру, под ним место для титра. */
function introRect(W: number, H: number): Rect {
  const mobile = W <= 760;
  let h = mobile ? Math.min(H * 0.52, (W - 96) * 1.5) : Math.min(H * 0.6, 720);
  let w = h / 1.5;
  if (w > W - 48) {
    w = W - 48;
    h = w * 1.5;
  }
  return { top: Math.max(16, (H - h - 84) / 2), left: (W - w) / 2, width: w, height: h };
}

/* Печать ответа. Скорость в знаках в секунду, но длинный ответ целиком
   печатается не дольше 3,5 секунды: дольше уже не кино, а ожидание. */
function Typed({ text, instant }: { text: string; instant: boolean }) {
  const [n, setN] = useState(instant ? text.length : 0);
  useEffect(() => {
    if (instant) return;
    let raf = 0;
    const t0 = performance.now();
    const rate = Math.max(70, text.length / 3.5);
    const tick = (now: number) => {
      const k = Math.min(text.length, Math.floor(((now - t0) / 1000) * rate));
      setN(k);
      if (k < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, instant]);
  return (
    <>
      {text.slice(0, n)}
      {n < text.length && <i className="nm-gx-caret" aria-hidden="true" />}
    </>
  );
}

function Form({
  lang,
  loading,
  send,
  inputRef,
}: {
  lang: L;
  loading: boolean;
  send: (t: string) => void;
  inputRef: RefObject<HTMLInputElement | null>;
}) {
  const [input, setInput] = useState("");
  const c = CHAT[lang];
  return (
    <form
      className="nm-gx-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        send(input);
        setInput("");
      }}
    >
      <input
        ref={inputRef}
        className="nm-gx-input"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={c.placeholder}
        aria-label={c.placeholder}
        maxLength={1000}
      />
      <button type="submit" className="nm-gx-send" disabled={!input.trim() || loading}>
        {c.send}
      </button>
    </form>
  );
}

export type TitrProps = {
  lang: L;
  mode: Mode;
  messages: Msg[];
  loading: boolean;
  /* Индекс ответа, который пришёл последним и должен напечататься. */
  fresh: number;
  send: (text: string) => void;
  onClose: () => void;
};

export default function Titr(p: TitrProps) {
  const c = CHAT[p.lang];
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const pic = useRef<HTMLDivElement>(null);
  const cap = useRef<HTMLDivElement>(null);
  const chat = useRef<HTMLElement>(null);
  const x = useRef<HTMLButtonElement>(null);
  const fly = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<"intro" | "chat">(p.mode === "none" ? "chat" : "intro");
  const finishIntro = useEffectEvent(() => setPhase("chat"));
  const close = useEffectEvent(() => p.onClose());

  const build = useEffectEvent((m: "full" | "short") => {
    const { list, add } = timeline();
    if (m === "short") {
      add(bg.current, [{ opacity: 0 }, { opacity: 1 }], 0, 220, "ease-out");
      add(pic.current?.firstElementChild, [
        { opacity: 0, transform: "scale(1.04)" },
        { opacity: 1, transform: "scale(1)" },
      ], 40, 520);
      add(cap.current, fadeIn(6), 150, 420);
      add(chat.current, fadeIn(0, 16), 150, 450);
      add(x.current, fadeIn(), 200, 400);
      return list;
    }
    const W = window.innerWidth;
    const H = window.innerHeight;
    const from = introRect(W, H);
    const to = pic.current ? measure(pic.current) : from;
    if (title.current) title.current.style.top = `${from.top + from.height + 30}px`;

    // 0,0–0,4 с: экран уходит в чёрный.
    add(bg.current, [{ opacity: 0 }, { opacity: 1 }], 0, 400, "ease-out");
    // 0,2–2,2 с: лицо проступает из черноты, наезд 1,12 к 1,0.
    add(fly.current, [{ opacity: 0 }, { opacity: 1 }], 200, 1100, "ease-in-out");
    add(fly.current?.firstElementChild, [
      { transform: "scale(1.12)" },
      { transform: "scale(1)" },
    ], 200, 2000, "cubic-bezier(.25,.6,.3,1)");
    // 0,75–1,75 с: начальный титр, разрядка сходится.
    const [name, gpt] = Array.from(title.current?.children ?? []);
    add(name, [
      { opacity: 0, letterSpacing: "0.9em" },
      { opacity: 1, letterSpacing: "0.5em" },
    ], 750, 1000);
    add(gpt, [{ opacity: 0 }, { opacity: 1 }], 1150, 600, "ease-out");
    add(title.current, [{ opacity: 1 }, { opacity: 0 }], 1650, 300, "ease-in");
    // 1,75–2,35 с: портрет уходит в колонку. Переписка открывается справа,
    // когда портрет уже освободил место, а не под ним.
    add(fly.current, [px(from), px(to)], 1750, 600, MOVE);
    add(pic.current, [{ opacity: 0 }, { opacity: 0, offset: 0.999 }, { opacity: 1 }], 0, 2350, "linear");
    add(cap.current, fadeIn(6), 2200, 300);
    add(chat.current, fadeIn(0, 28), 2100, 400);
    add(x.current, fadeIn(), 2200, 300);
    return list;
  });

  /* Вступление, пропуск и Escape. Вступление строится до первой отрисовки
     (useLayoutEffect), иначе на кадр мелькнуло бы конечное состояние. */
  useLayoutEffect(() => {
    const el = root.current;
    el?.focus({ preventScroll: true });
    const list = p.mode === "none" ? [] : build(p.mode);
    const skip = () => {
      for (const a of list) {
        try {
          a.finish();
        } catch {
          // анимация уже отменена
        }
      }
    };

    /* Если портрет ещё не скачан (человек нажал кнопку сразу, не наведя
       на неё мышь), вступление ждёт его, но не дольше 1,2 секунды:
       проявлять из темноты пустую рамку бессмысленно. */
    const img = fly.current?.querySelector("img");
    let waiting = 0;
    if (img && !img.complete && list.length) {
      for (const a of list) a.pause();
      const go = () => {
        if (!waiting) return;
        window.clearTimeout(waiting);
        waiting = 0;
        for (const a of list) if (a.playState === "paused") a.play();
      };
      waiting = window.setTimeout(go, 1200);
      img.decode().then(go, go);
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else {
        skip();
      }
    };
    el?.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", onKey);
    let alive = true;
    Promise.all(list.map((a) => a.finished)).then(
      () => {
        if (alive) finishIntro();
      },
      () => {}
    );
    return () => {
      alive = false;
      window.clearTimeout(waiting);
      el?.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", onKey);
      for (const a of list) a.cancel();
    };
  }, [p.mode]);

  // Прокрутка страницы под окном выключена, пока окно открыто.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, []);

  /* После вступления фокус в поле ввода. На телефоне не ставится, иначе
     клавиатура сразу закрыла бы полэкрана. Через таймер: если вступление
     пропустили кликом, браузер после этого клика сам ставит фокус на окно и
     перебил бы поле ввода. */
  useEffect(() => {
    if (phase !== "chat") return;
    let coarse = false;
    try {
      coarse = window.matchMedia("(pointer: coarse)").matches;
    } catch {
      coarse = false;
    }
    const t = window.setTimeout(() => {
      if (!coarse) input.current?.focus({ preventScroll: true });
    }, 0);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Переписка прокручивается к последнему сообщению, пока ответ печатается.
  useEffect(() => {
    const b = box.current;
    const i = inner.current;
    if (!b || !i) return;
    const ro = new ResizeObserver(() => {
      b.scrollTop = b.scrollHeight;
    });
    ro.observe(i);
    return () => ro.disconnect();
  }, []);

  const instant = p.mode === "none";

  return (
    <div
      ref={root}
      className="nm-gx nm-ga"
      role="dialog"
      aria-modal="true"
      aria-label="JasurGPT"
      tabIndex={-1}
      lang={p.lang}
    >
      <div ref={bg} className="nm-gx-bg" />

      <div className="nm-ga-layout">
        <aside className="nm-ga-side">
          <div ref={pic} className="nm-ga-pic">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PORTRAIT} alt="" width={1024} height={1536} />
          </div>
          <div ref={cap}>
            <span className="nm-ga-name">Jasur Akhmadaliev</span>
            <span className="nm-ga-gpt">JasurGPT</span>
          </div>
        </aside>

        <section ref={chat} className="nm-ga-chat">
          <div className="nm-ga-bar">
            <span>{c.sub}</span>
          </div>
          {/* Clarity пишет видеозапись сессии. Без этой пометки в записи
              видно, что незнакомые люди писали в чат. */}
          <div ref={box} className="nm-ga-msgs" data-clarity-mask="true">
            <div ref={inner}>
              {p.messages.length === 0 && !p.loading ? (
                <div className="nm-ga-empty">
                  <p>{c.greet}</p>
                  <div className="nm-gx-chips">
                    {c.chips.map((q) => (
                      <button key={q} type="button" className="nm-gx-chip" onClick={() => p.send(q)}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                p.messages.map((m, i) => (
                  <div key={i} className={`nm-ga-msg${m.role === "user" ? " is-user" : ""}`}>
                    <span className="nm-gx-who">{m.role === "user" ? c.you : "JasurGPT"}</span>
                    <p className="nm-ga-txt">
                      {m.role === "assistant" && i === p.fresh ? (
                        <Typed text={m.content} instant={instant} />
                      ) : (
                        m.content
                      )}
                    </p>
                  </div>
                ))
              )}
              {p.loading && (
                <div className="nm-ga-msg">
                  <span className="nm-gx-who">JasurGPT</span>
                  <p className="nm-ga-txt">
                    <i className="nm-gx-caret" aria-hidden="true" />
                  </p>
                </div>
              )}
            </div>
          </div>
          <Form lang={p.lang} loading={p.loading} send={p.send} inputRef={input} />
        </section>
      </div>

      {/* Кнопка закрытия лежит в корне слоя, а не в колонке переписки:
          колонка во вступлении едет трансформацией, и всё закреплённое
          внутри неё уехало бы вместе с ней. */}
      <button ref={x} type="button" className="nm-gx-close nm-ga-x" onClick={p.onClose}>
        {c.close}
      </button>

      {p.mode === "full" && phase === "intro" && (
        <>
          <div ref={fly} className="nm-ga-fly" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PORTRAIT} alt="" width={1024} height={1536} />
          </div>
          <div ref={title} className="nm-ga-title" aria-hidden="true">
            <span className="nm-ga-name">Jasur Akhmadaliev</span>
            <span className="nm-ga-gpt">JasurGPT</span>
          </div>
        </>
      )}

      {/* Зерно поверх всего слоя, в том числе поверх портрета. Под портретом
          оно оставляло бы снимок чуть темнее зернистого фона вокруг, и
          граница снимка читалась бы тёмным прямоугольником. */}
      <div className="nm-gx-grain" aria-hidden="true" />

      {/* Последний ответ целиком для читалки экрана: печать по буквам в
          живом регионе зачитывалась бы по буквам. */}
      <p className="nm-gx-sr" aria-live="polite">
        {p.fresh >= 0 ? p.messages[p.fresh]?.content ?? "" : ""}
      </p>
    </div>
  );
}
