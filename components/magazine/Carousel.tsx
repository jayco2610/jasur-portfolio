"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import PostCard, { type CardPost } from "./PostCard";

// Лента статей, которая крутится сама, непрерывно и с одной скоростью.
// Бесконечность сделана тремя копиями списка: как только уехали на длину
// одной копии, сдвигаемся обратно на неё же. Картинка при этом та же,
// поэтому шва не видно.
//
// Мышкой или пальцем ленту можно подкрутить: во время протяжки она слушается
// руки, после отпускания продолжает ехать сама с того же места.

const SPEED = 0; // точек в секунду. Ноль: лента не крутится сама, только руками
const SWIPE_PX = 8;

const REDUCED = "(prefers-reduced-motion: reduce)";
function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export default function Carousel({
  posts,
  ru,
  narrow = false,
}: {
  posts: CardPost[];
  ru: boolean;
  // В колонке статьи места меньше, там видно две карточки, а не три.
  narrow?: boolean;
}) {
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

  // Движение крутится в requestAnimationFrame и пишет transform напрямую,
  // без состояния React: иначе страница перерисовывалась бы шестьдесят раз в секунду.
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
    <div className={`car${narrow ? " car--narrow" : ""}${loop ? " car--live" : ""}`}>
      <div
        ref={viewRef}
        className="car-view"
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
            // Держим указатель, чтобы протяжка не обрывалась, если увести его за край.
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
        aria-label={ru ? "Лента статей" : "Article feed"}
      >
        <div ref={trackRef} className="car-track">
          {items.map((post, i) => {
            // С клавиатуры доступна только первая копия, остальные её повтор.
            const first = i < n;
            return (
              <div key={`${post.slug}-${i}`} className="car-slide" aria-hidden={!first}>
                <PostCard post={post} tabIndex={first ? undefined : -1} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
