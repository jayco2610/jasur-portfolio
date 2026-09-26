"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import Photo from "../Photo";
import type { CardPost } from "../posts";

/* Лента обложек, которая едет сама, непрерывно и с одной скоростью.

   Механика перенесена из components/magazine/Carousel.tsx без изменений,
   потому что она уже решает три неочевидные задачи:

   1. Бесконечность сделана тремя копиями списка. Как только уехали на длину
      одной копии, сдвигаемся назад ровно на неё же. Под курсором в этот
      момент та же картинка, поэтому шва не видно.
   2. Движение живёт в requestAnimationFrame и пишет transform напрямую в
      узел, минуя состояние React. Иначе страница перерисовывалась бы
      шестьдесят раз в секунду.
   3. Ленту можно взять рукой и подкрутить. Во время протяжки автоход
      выключен, после отпускания продолжается с того же места.

   Своя копия, а не импорт старого компонента: тот тянет за собой PostCard
   с классами .mag-* и оранжевым акцентом из globals.css. Здесь карточка
   собрана из .nm-card, то есть той же, что в сетке «Свежее» ниже, и высоты
   обложек в двух списках уже нельзя развести.

   Ширина слайда считается от ширины окна ленты (--per штук в кадре), а не от
   содержимого: все карточки одинаковые, какой бы длины ни был заголовок. */

const SPEED = 26; // точек в секунду
const SWIPE_PX = 8; // порог, после которого протяжка считается протяжкой, а не кликом

const REDUCED = "(prefers-reduced-motion: reduce)";
function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export default function Carousel({ posts }: { posts: CardPost[] }) {
  const n = posts.length;
  const viewRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [slideW, setSlideW] = useState(0);
  const [perView, setPerView] = useState(3);
  const offset = useRef(0);
  const drag = useRef<{ x: number; from: number } | null>(null);
  const moved = useRef(false);

  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false
  );

  // Крутить есть смысл только если карточек больше, чем видно в кадре.
  const loop = n > Math.floor(perView);
  const oneSet = slideW * n;

  const measure = useCallback(() => {
    const view = viewRef.current;
    if (!view) return;
    const per = parseFloat(getComputedStyle(view).getPropertyValue("--per")) || 3;
    setPerView(per);
    setSlideW(view.clientWidth / per);
  }, []);

  useLayoutEffect(() => {
    measure();
    const view = viewRef.current;
    if (!view) return;
    const ro = new ResizeObserver(measure);
    ro.observe(view);
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    if (!loop || !oneSet) return;
    const track = trackRef.current;
    if (!track) return;

    const norm = (v: number) => ((v % oneSet) + oneSet) % oneSet;
    let last = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      if (!drag.current && !reduced && !document.hidden) {
        offset.current = norm(offset.current + SPEED * dt);
      }
      track.style.transform = `translate3d(${-offset.current}px, 0, 0)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [loop, oneSet, reduced]);

  const items = loop ? [...posts, ...posts, ...posts] : posts;

  return (
    <div className={`nm-car${loop ? " is-live" : ""}`}>
      <div
        ref={viewRef}
        className="nm-car-view"
        onPointerDown={(e) => {
          if (!loop) return;
          drag.current = { x: e.clientX, from: offset.current };
          moved.current = false;
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || !oneSet) return;
          const dx = e.clientX - d.x;
          if (Math.abs(dx) > SWIPE_PX && !moved.current) {
            moved.current = true;
            // Держим указатель, чтобы протяжка не обрывалась за краем ленты.
            viewRef.current?.setPointerCapture(e.pointerId);
          }
          const next = d.from - dx;
          offset.current = ((next % oneSet) + oneSet) % oneSet;
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        // Протяжка не должна заодно открывать статью, на которой началась.
        onClickCapture={(e) => {
          if (moved.current) {
            e.preventDefault();
            e.stopPropagation();
            moved.current = false;
          }
        }}
        aria-label="Лента обложек"
      >
        <div ref={trackRef} className="nm-car-track">
          {items.map((post, i) => {
            // С клавиатуры доступна только первая копия, остальные её повтор.
            const first = i < n;
            return (
              <div key={`${post.slug}-${i}`} className="nm-car-slide" aria-hidden={!first}>
                <a
                  className="nm-card"
                  href={post.href}
                  tabIndex={first ? undefined : -1}
                  draggable={false}
                >
                  <Photo src={post.cover} alt={post.title} ratio="16:10" />
                  <span className="nm-card-meta">
                    {post.date} · {post.rubric}
                  </span>
                  <span className="nm-card-t">{post.title}</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
