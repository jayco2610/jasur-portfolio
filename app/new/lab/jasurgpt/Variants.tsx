"use client";

import {
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { CHAT, type L } from "./text";

/* Три варианта появления JasurGPT. Каждый вариант это слой поверх
   страницы лаборатории со своим вступлением и своей подачей переписки.
   Сам чат общий: состояние и запрос к /api/chat живут в Lab.tsx.

   Как устроено движение. Вёрстка каждого слоя сразу стоит в конечном
   состоянии, CSS в lab.css описывает именно его. Вступление собирается
   через Web Animations API (element.animate) в момент открытия, до первой
   отрисовки. Отсюда три свойства без отдельного кода:
   - пропуск: всем анимациям вызывается finish(), и всё встаёт в конец;
   - prefers-reduced-motion: анимации просто не создаются;
   - короткий повтор: та же вёрстка, другой, сжатый набор анимаций.
   Анимации, которым нужны размеры экрана (полёт портрета в колонку или в
   аватарку), меряют конечное место через getBoundingClientRect. */

export type Mode = "full" | "short" | "none";
export type Msg = { role: "user" | "assistant"; content: string };

export type VariantProps = {
  lang: L;
  mode: Mode;
  messages: Msg[];
  loading: boolean;
  /* Индекс ответа, который пришёл последним и должен напечататься. */
  fresh: number;
  send: (text: string) => void;
  onClose: () => void;
};

const PORTRAIT = "/new/portret.jpg";
const EASE = "cubic-bezier(.2,.7,.2,1)";
const MOVE = "cubic-bezier(.65,0,.35,1)";

type Rect = { top: number; left: number; width: number; height: number };

/* Целые пиксели: на дробных краях снимок под белой шторкой проступал
   тонкой полосой. */
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
   последний после конца. Вторая анимация того же свойства на том же
   элементе ставится с fill "forwards", иначе её первый кадр перебил бы
   первую анимацию ещё до своего старта. */
function timeline() {
  const list: Animation[] = [];
  const add = (
    el: Element | null,
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

/* Общая механика слоя: вступление, пропуск, фокус, Escape, блокировка
   прокрутки страницы под слоем. Возвращает фазу: "intro" или "chat". */
function useOverlay({
  mode,
  rootRef,
  inputRef,
  build,
  onClose,
}: {
  mode: Mode;
  rootRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  build: (m: "full" | "short") => Animation[];
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<"intro" | "chat">(mode === "none" ? "chat" : "intro");
  const buildIntro = useEffectEvent(build);
  const finishIntro = useEffectEvent(() => setPhase("chat"));
  const close = useEffectEvent(onClose);

  useLayoutEffect(() => {
    const root = rootRef.current;
    root?.focus({ preventScroll: true });
    if (mode === "none") return;

    const list = buildIntro(mode);
    let alive = true;
    const skip = () => {
      for (const a of list) {
        try {
          a.finish();
        } catch {
          // анимация уже отменена
        }
      }
    };
    const off = () => {
      root?.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
    root?.addEventListener("pointerdown", skip);
    window.addEventListener("keydown", skip);
    Promise.all(list.map((a) => a.finished)).then(
      () => {
        off();
        if (alive) finishIntro();
      },
      () => {}
    );
    return () => {
      alive = false;
      off();
      for (const a of list) a.cancel();
    };
  }, [mode, rootRef]);

  // Прокрутка страницы под слоем выключена, пока слой открыт.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, []);

  /* После вступления: Escape закрывает, фокус в поле ввода. На телефоне
     фокус не ставится, иначе клавиатура сразу закрыла бы полэкрана. */
  useEffect(() => {
    if (phase !== "chat") return;
    let coarse = false;
    try {
      coarse = window.matchMedia("(pointer: coarse)").matches;
    } catch {
      coarse = false;
    }
    /* Через таймер: если вступление пропустили кликом, браузер после
       этого клика сам ставит фокус на слой и перебил бы поле ввода. */
    const t = window.setTimeout(() => {
      if (!coarse) inputRef.current?.focus({ preventScroll: true });
    }, 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [phase, inputRef]);

  return phase;
}

/* Переписка прокручивается к последнему сообщению, в том числе пока ответ
   печатается и растёт. */
function useStickToBottom(
  boxRef: RefObject<HTMLDivElement | null>,
  innerRef: RefObject<HTMLDivElement | null>
) {
  useEffect(() => {
    const box = boxRef.current;
    const inner = innerRef.current;
    if (!box || !inner) return;
    const ro = new ResizeObserver(() => {
      box.scrollTop = box.scrollHeight;
    });
    ro.observe(inner);
    return () => ro.disconnect();
  }, [boxRef, innerRef]);
}

/* Печать текста. Скорость в знаках в секунду, но длинный ответ целиком
   печатается не дольше 3,5 секунды: дольше уже не кино, а ожидание. */
function Typed({
  text,
  instant,
  cps = 70,
  caret = false,
}: {
  text: string;
  instant: boolean;
  cps?: number;
  caret?: boolean;
}) {
  const [n, setN] = useState(instant ? text.length : 0);
  useEffect(() => {
    if (instant) return;
    let raf = 0;
    const t0 = performance.now();
    const rate = Math.max(cps, text.length / 3.5);
    const tick = (now: number) => {
      const k = Math.min(text.length, Math.floor(((now - t0) / 1000) * rate));
      setN(k);
      if (k < text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, instant, cps]);
  return (
    <>
      {text.slice(0, n)}
      {caret && n < text.length && <i className="nm-gx-caret" aria-hidden="true" />}
    </>
  );
}

/* Субтитры: ответ режется на карточки не длиннее двух строк, как в кино.
   Сначала по предложениям, короткие соседние склеиваются, длинное
   предложение делится по словам на равные куски. */
function toCards(text: string, max = 88): string[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [""];
  const out: string[] = [];
  for (const s of clean.split(/(?<=[.!?…])\s+/)) {
    if (s.length <= max) {
      const last = out[out.length - 1];
      if (last && last.length < 44 && last.length + 1 + s.length <= max) {
        out[out.length - 1] = `${last} ${s}`;
      } else {
        out.push(s);
      }
      continue;
    }
    const parts = Math.ceil(s.length / max);
    const target = Math.ceil(s.length / parts);
    let cur = "";
    for (const w of s.split(" ")) {
      if (cur && cur.length + 1 + w.length > target) {
        out.push(cur);
        cur = w;
      } else {
        cur = cur ? `${cur} ${w}` : w;
      }
    }
    if (cur) out.push(cur);
  }
  return out;
}

function Subtitle({ text, instant }: { text: string; instant: boolean }) {
  const cards = useMemo(() => toCards(text), [text]);
  const [st, setSt] = useState({ i: 0, n: instant ? cards[0].length : 0 });
  useEffect(() => {
    const plan = cards.map((c) => ({
      len: c.length,
      type: instant ? 0 : c.length * 24,
      hold: Math.max(1400, c.length * 48),
    }));
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      let t = now - t0;
      let i = 0;
      while (i < plan.length - 1 && t >= plan[i].type + plan[i].hold) {
        t -= plan[i].type + plan[i].hold;
        i += 1;
      }
      const p = plan[i];
      const n = p.type ? Math.min(p.len, Math.floor((t / p.type) * p.len)) : p.len;
      setSt((prev) => (prev.i === i && prev.n === n ? prev : { i, n }));
      if (i < plan.length - 1 || n < p.len) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [cards, instant]);
  return <>{cards[st.i]?.slice(0, st.n)}</>;
}

function Chips({ lang, send }: { lang: L; send: (t: string) => void }) {
  return (
    <div className="nm-gx-chips">
      {CHAT[lang].chips.map((q) => (
        <button key={q} type="button" className="nm-gx-chip" onClick={() => send(q)}>
          {q}
        </button>
      ))}
    </div>
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

/* Последний ответ целиком для читалки экрана: печать по буквам в живом
   регионе зачитывалась бы по буквам. */
function Live({ messages, fresh }: { messages: Msg[]; fresh: number }) {
  return (
    <p className="nm-gx-sr" aria-live="polite">
      {fresh >= 0 ? messages[fresh]?.content ?? "" : ""}
    </p>
  );
}

/* ============ A. Титр ============ */

/* Где стоит портрет во вступлении: по центру, под ним место для титра. */
function introA(W: number, H: number): Rect {
  const mobile = W <= 760;
  let h = mobile ? Math.min(H * 0.52, (W - 96) * 1.5) : Math.min(H * 0.6, 720);
  let w = h / 1.5;
  if (w > W - 48) {
    w = W - 48;
    h = w * 1.5;
  }
  return { top: Math.max(16, (H - h - 84) / 2), left: (W - w) / 2, width: w, height: h };
}

export function VariantA(p: VariantProps) {
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

  const phase = useOverlay({
    mode: p.mode,
    rootRef: root,
    inputRef: input,
    onClose: p.onClose,
    build: (m) => {
      const { list, add } = timeline();
      if (m === "short") {
        add(bg.current, [{ opacity: 0 }, { opacity: 1 }], 0, 220, "ease-out");
        add(pic.current?.firstElementChild ?? null, [
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
      const from = introA(W, H);
      const to = pic.current ? measure(pic.current) : from;
      if (title.current) title.current.style.top = `${from.top + from.height + 30}px`;

      // 0,0–0,4 с: экран уходит в чёрный.
      add(bg.current, [{ opacity: 0 }, { opacity: 1 }], 0, 400, "ease-out");
      // 0,2–2,2 с: портрет проявляется из черноты, масштаб 1,08 к 1,0.
      add(fly.current, [px(from), px(to)], 1750, 600, MOVE);
      add(fly.current, [{ opacity: 0 }, { opacity: 1 }], 200, 1100, "ease-in-out");
      add(fly.current?.firstElementChild ?? null, [
        { transform: "scale(1.08)", filter: "grayscale(1) contrast(1.06) brightness(.3)" },
        { transform: "scale(1)", filter: "grayscale(1) contrast(1.06) brightness(1)" },
      ], 200, 2000, "cubic-bezier(.25,.6,.3,1)");
      // 0,75–1,75 с: начальный титр, разрядка сходится.
      const [name, gpt] = Array.from(title.current?.children ?? []);
      add(name ?? null, [
        { opacity: 0, letterSpacing: "0.9em" },
        { opacity: 1, letterSpacing: "0.5em" },
      ], 750, 1000);
      add(gpt ?? null, [{ opacity: 0 }, { opacity: 1 }], 1150, 600, "ease-out");
      add(title.current, [{ opacity: 1 }, { opacity: 0 }], 1650, 300, "ease-in");
      // 1,75–2,35 с: портрет уходит в колонку. Переписка открывается
      // справа, когда портрет уже освободил место, а не под ним.
      add(pic.current, [{ opacity: 0 }, { opacity: 0, offset: 0.999 }, { opacity: 1 }], 0, 2350, "linear");
      add(cap.current, fadeIn(6), 2200, 300);
      add(chat.current, fadeIn(0, 28), 2100, 400);
      add(x.current, fadeIn(), 2200, 300);
      return list;
    },
  });
  useStickToBottom(box, inner);
  const instant = p.mode === "none";

  return (
    <div ref={root} className="nm-gx nm-ga" role="dialog" aria-modal="true" aria-label="JasurGPT" tabIndex={-1}>
      <div ref={bg} className="nm-gx-bg" />
      <div className="nm-gx-grain" aria-hidden="true" />

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
          <div ref={box} className="nm-ga-msgs" data-clarity-mask="true">
            <div ref={inner}>
              {p.messages.length === 0 && !p.loading ? (
                <div className="nm-ga-empty">
                  <p>{c.greet}</p>
                  <Chips lang={p.lang} send={p.send} />
                </div>
              ) : (
                p.messages.map((m, i) => (
                  <div key={i} className={`nm-ga-msg${m.role === "user" ? " is-user" : ""}`}>
                    <span className="nm-gx-who">{m.role === "user" ? c.you : "JasurGPT"}</span>
                    <p className="nm-ga-txt">
                      {m.role === "assistant" && i === p.fresh ? (
                        <Typed text={m.content} instant={instant} caret />
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
      <Live messages={p.messages} fresh={p.fresh} />
    </div>
  );
}

/* ============ B. Субтитры ============ */

const gradeB = (blur: number) => `grayscale(1) contrast(1.22) brightness(.84) blur(${blur}px)`;

export function VariantB(p: VariantProps) {
  const c = CHAT[p.lang];
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  const barT = useRef<HTMLDivElement>(null);
  const barB = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);

  const phase = useOverlay({
    mode: p.mode,
    rootRef: root,
    inputRef: input,
    onClose: p.onClose,
    build: (m) => {
      const { list, add } = timeline();
      const photo = img.current?.firstElementChild ?? null;
      if (m === "short") {
        add(bg.current, [{ opacity: 0 }, { opacity: 1 }], 0, 200, "ease-out");
        add(img.current, [{ opacity: 0 }, { opacity: 1 }], 0, 350, "ease-out");
        add(photo, [{ filter: gradeB(8) }, { filter: gradeB(0) }], 0, 550);
        add(top.current, fadeIn(), 100, 450);
        add(body.current, fadeIn(8), 150, 450);
        return list;
      }
      // 0,0–0,35 с: экран в чёрный.
      add(bg.current, [{ opacity: 0 }, { opacity: 1 }], 0, 350, "ease-out");
      // 0,15–0,85 с: кадр 16:9 появляется, пока не в фокусе.
      add(img.current, [{ opacity: 0 }, { opacity: 1 }], 150, 700, "ease-out");
      // 0,35–1,25 с: полосы въезжают, кадр становится 2,39:1.
      add(barT.current, [{ transform: "translateY(-101%)" }, { transform: "none" }], 350, 900, "cubic-bezier(.7,0,.2,1)");
      add(barB.current, [{ transform: "translateY(101%)" }, { transform: "none" }], 350, 900, "cubic-bezier(.7,0,.2,1)");
      // 0,6–2,1 с: перевод фокуса из размытия в резкость.
      add(photo, [
        { filter: gradeB(18), transform: "scale(1.07)" },
        { filter: gradeB(0), transform: "scale(1)" },
      ], 600, 1500, "cubic-bezier(.45,0,.2,1)");
      add(scrim.current, [{ opacity: 0 }, { opacity: 1 }], 1500, 600, "ease-out");
      // 1,9–2,5 с: подпись, поле ввода, переписка.
      add(top.current, fadeIn(), 1900, 500);
      add(body.current, fadeIn(10), 1950, 550);
      return list;
    },
  });
  const instant = p.mode === "none";

  const lastUser = [...p.messages].reverse().find((m) => m.role === "user");
  const answer = p.fresh >= 0 ? p.messages[p.fresh]?.content : undefined;

  return (
    <div ref={root} className="nm-gx nm-gb" role="dialog" aria-modal="true" aria-label="JasurGPT" tabIndex={-1}>
      <div ref={bg} className="nm-gx-bg" />
      <div className="nm-gb-scroll">
        <div className={`nm-gb-in${p.messages.length === 0 && !p.loading ? " is-empty" : ""}`}>
        <div ref={top} className="nm-gb-top">
          <span className="nm-ga-name">
            Jasur Akhmadaliev <i>· JasurGPT</i>
          </span>
          <button type="button" className="nm-gx-close" onClick={p.onClose}>
            {c.close}
          </button>
        </div>

        <div className="nm-gb-stage">
          <div ref={img} className="nm-gb-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PORTRAIT} alt="" width={1024} height={1536} />
          </div>
          <div ref={scrim} className="nm-gb-scrim" />
          <div className="nm-gb-vig" />
          <div ref={barT} className="nm-gb-bar is-top" />
          <div ref={barB} className="nm-gb-bar is-bot" />
          <p className="nm-gb-sub" aria-hidden="true" data-clarity-mask="true">
            {p.loading && lastUser ? (
              <span style={{ color: "#bdbdbd" }}>
                {lastUser.content}
                <i className="nm-gx-caret" />
              </span>
            ) : answer !== undefined ? (
              <Subtitle key={`a${p.fresh}`} text={answer} instant={instant} />
            ) : phase === "chat" ? (
              <Subtitle key="greet" text={c.greet} instant={instant} />
            ) : null}
          </p>
        </div>

        <div ref={body} className="nm-gb-body">
          <Form lang={p.lang} loading={p.loading} send={p.send} inputRef={input} />
          {p.messages.length === 0 && !p.loading ? (
            <Chips lang={p.lang} send={p.send} />
          ) : (
            <div data-clarity-mask="true">
            <p className="nm-gb-list-h">{c.transcript}</p>
            <ol className="nm-gb-list">
              {p.messages.map((m, i) => (
                <li key={i} className={m.role === "user" ? "is-user" : undefined}>
                  <span className="nm-gx-who">{m.role === "user" ? c.you : "JasurGPT"}</span>
                  <p>{m.content}</p>
                </li>
              ))}
              {p.loading && (
                <li>
                  <span className="nm-gx-who">JasurGPT</span>
                  <p>
                    <i className="nm-gx-caret" aria-hidden="true" />
                  </p>
                </li>
              )}
            </ol>
            </div>
          )}
        </div>
        </div>
      </div>
      <div className="nm-gx-grain" aria-hidden="true" />
      <Live messages={p.messages} fresh={p.fresh} />
    </div>
  );
}

/* ============ C. Проявка ============ */

function introC(W: number, H: number): Rect {
  const mobile = W <= 760;
  let h = mobile ? Math.min(H * 0.56, (W - 64) * 1.5) : Math.min(H * 0.64, 720);
  let w = h / 1.5;
  if (w > W - 48) {
    w = W - 48;
    h = w * 1.5;
  }
  return { top: (H - h) / 2, left: (W - w) / 2, width: w, height: h };
}

const WASHED = "grayscale(1) contrast(.3) brightness(1.75)";
const DEVELOPED = "grayscale(1) contrast(1.06) brightness(1)";

export function VariantC(p: VariantProps) {
  const c = CHAT[p.lang];
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const ava = useRef<HTMLDivElement>(null);
  const who = useRef<HTMLDivElement>(null);
  const x = useRef<HTMLButtonElement>(null);
  const rule = useRef<HTMLDivElement>(null);
  const formWrap = useRef<HTMLDivElement>(null);
  const fly = useRef<HTMLDivElement>(null);
  const white = useRef<HTMLDivElement>(null);
  const edge = useRef<HTMLDivElement>(null);
  const grain = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  const phase = useOverlay({
    mode: p.mode,
    rootRef: root,
    inputRef: input,
    onClose: p.onClose,
    build: (m) => {
      const { list, add } = timeline();
      if (m === "short") {
        add(bg.current, [{ opacity: 0 }, { opacity: 1 }], 0, 200, "ease-out");
        add(ava.current?.firstElementChild ?? null, [{ filter: WASHED }, { filter: DEVELOPED }], 0, 550);
        add(who.current, fadeIn(), 100, 450);
        add(x.current, fadeIn(), 100, 450);
        add(rule.current, fadeIn(), 100, 450);
        add(box.current, fadeIn(8), 150, 450);
        add(formWrap.current, fadeIn(), 150, 450);
        return list;
      }
      const from = introC(window.innerWidth, window.innerHeight);
      const to = ava.current ? measure(ava.current) : from;

      // 0,0–0,3 с: лист под слоем становится чистым.
      add(bg.current, [{ opacity: 0 }, { opacity: 1 }], 0, 300, "ease-out");
      // 0,25–1,35 с: шторка идёт сверху вниз и открывает снимок.
      add(white.current, [{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(100% 0 0 0)" }], 250, 1100, "cubic-bezier(.55,0,.35,1)");
      add(edge.current, [{ top: "0%" }, { top: "calc(100% - 2px)" }], 250, 1100, "cubic-bezier(.55,0,.35,1)");
      add(edge.current, [{ opacity: 1 }, { opacity: 0 }], 1300, 200, "ease-out");
      // 0,25–1,85 с: из белого в изображение, зерно оседает.
      add(fly.current?.firstElementChild ?? null, [{ filter: WASHED }, { filter: DEVELOPED }], 250, 1600, "cubic-bezier(.3,.1,.3,1)");
      add(grain.current, [{ opacity: 0.6 }, { opacity: 0.16 }], 250, 1600, "ease-out");
      // 1,85–2,5 с: снимок сжимается в квадратную аватарку в шапке.
      add(fly.current, [px(from), px(to)], 1850, 650, MOVE);
      add(grain.current, [{ opacity: 0.16 }, { opacity: 0 }], 1850, 500, "ease-in", "forwards");
      add(ava.current, [{ opacity: 0 }, { opacity: 0, offset: 0.999 }, { opacity: 1 }], 0, 2500, "linear");
      add(who.current, fadeIn(), 2150, 350);
      add(x.current, fadeIn(), 2150, 350);
      add(rule.current, [{ opacity: 0 }, { opacity: 1 }], 2000, 400, "ease-out");
      add(box.current, fadeIn(8), 2150, 350);
      add(formWrap.current, fadeIn(), 2150, 350);
      return list;
    },
  });
  useStickToBottom(box, inner);
  const instant = p.mode === "none";

  // Вопрос и ответ на него идут одним блоком, блоки разделены линейками.
  const pairs: { q: string; a?: string; ai: number }[] = [];
  p.messages.forEach((m, i) => {
    const last = pairs[pairs.length - 1];
    if (m.role === "user") pairs.push({ q: m.content, ai: -1 });
    else if (last && last.ai < 0) {
      last.a = m.content;
      last.ai = i;
    } else pairs.push({ q: "", a: m.content, ai: i });
  });

  return (
    <div ref={root} className="nm-gx nm-gc" role="dialog" aria-modal="true" aria-label="JasurGPT" tabIndex={-1}>
      <div ref={bg} className="nm-gx-bg" />
      <div className="nm-gc-col">
        <div className="nm-gc-head">
          <div ref={ava} className="nm-gc-ava">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={PORTRAIT} alt="" width={1024} height={1536} />
          </div>
          <div ref={who} className="nm-gc-who">
            <b>JasurGPT</b>
            <span>{c.sub}</span>
          </div>
          <button ref={x} type="button" className="nm-gx-close" onClick={p.onClose}>
            {c.close}
          </button>
        </div>
        <div ref={rule} className="nm-gc-rule" />
          <div ref={box} className="nm-gc-msgs" data-clarity-mask="true">
            <div ref={inner}>
              {pairs.length === 0 && !p.loading ? (
                <div className="nm-gc-empty">
                  <p>{c.greet}</p>
                  <Chips lang={p.lang} send={p.send} />
                </div>
              ) : (
                pairs.map((pr, k) => (
                  <article key={k} className="nm-gc-item">
                    {pr.q && <h3 className="nm-gc-q">{pr.q}</h3>}
                    {pr.a !== undefined ? (
                      <p className="nm-gc-a">
                        {pr.ai === p.fresh ? <Typed text={pr.a} instant={instant} cps={120} /> : pr.a}
                      </p>
                    ) : (
                      p.loading && (
                        <p className="nm-gc-a">
                          <i className="nm-gx-caret" aria-hidden="true" />
                        </p>
                      )
                    )}
                  </article>
                ))
              )}
            </div>
          </div>
          <div ref={formWrap}>
            <Form lang={p.lang} loading={p.loading} send={p.send} inputRef={input} />
          </div>
      </div>

      {p.mode === "full" && phase === "intro" && (
        <div ref={fly} className="nm-gc-fly" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={PORTRAIT} alt="" width={1024} height={1536} />
          <div ref={white} className="nm-gc-white" />
          <div ref={edge} className="nm-gc-edge" />
          <div ref={grain} className="nm-gx-grain" />
        </div>
      )}
      <Live messages={p.messages} fresh={p.fresh} />
    </div>
  );
}
