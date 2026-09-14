"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import PostCard, { type CardPost } from "./PostCard";

// Лента статей в одну строку, которая проворачивается по кругу на одну
// карточку, как колёсико. Бесконечность сделана тремя копиями списка:
// ездим по средней, а когда уехали в крайнюю, без анимации перескакиваем
// обратно в среднюю на то же место. Глаз этого не видит.

const AUTO_MS = 5000;
const SWIPE_PX = 40;

// Системная настройка «меньше движения». Читается без эффекта, чтобы
// не перерисовывать ленту лишний раз.
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
  const [slideW, setSlideW] = useState(0);
  const [perView, setPerView] = useState(3);
  const [index, setIndex] = useState(n);
  // Стартуем без анимации: пока ширина не измерена, лента не должна ехать.
  const [animate, setAnimate] = useState(false);
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia(REDUCED).matches,
    () => false
  );
  const startX = useRef<number | null>(null);
  const swiped = useRef(false);

  const loop = n > Math.floor(perView);

  // Сменился язык, значит сменился и список: начинаем с первой карточки.
  // Сбрасываем прямо при отрисовке, как советует React, а не эффектом.
  const [prevN, setPrevN] = useState(n);
  if (prevN !== n) {
    setPrevN(n);
    setAnimate(false);
    setIndex(n);
  }

  const measure = useCallback(() => {
    const view = viewRef.current;
    if (!view) return;
    const per = parseFloat(getComputedStyle(view).getPropertyValue("--per")) || 3;
    // При смене ширины переставляем без анимации, иначе лента дёргается.
    setAnimate(false);
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

  const step = useCallback(
    (dir: 1 | -1) => {
      if (!loop) return;
      if (reduced) {
        // Без анимации ехать некуда: сразу ставим нужную карточку в средней копии.
        setAnimate(false);
        setIndex((i) => ((((i + dir) % n) + n) % n) + n);
        return;
      }
      setAnimate(true);
      setIndex((i) => i + dir);
    },
    [loop, reduced, n]
  );

  // Уехали в крайнюю копию: без анимации возвращаемся в среднюю на то же место.
  const settle = useCallback(() => {
    if (index >= 2 * n || index < n) {
      setAnimate(false);
      setIndex((((index % n) + n) % n) + n);
    }
  }, [index, n]);

  // Анимацию включаем обратно через два кадра, когда перескок уже отрисован.
  useEffect(() => {
    if (animate || reduced) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setAnimate(true));
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [animate, reduced]);

  useEffect(() => {
    if (!loop || paused || reduced) return;
    const id = setInterval(() => {
      if (!document.hidden) step(1);
    }, AUTO_MS);
    return () => clearInterval(id);
  }, [loop, paused, reduced, step]);

  const items = loop ? [...posts, ...posts, ...posts] : posts;
  const offset = loop ? index * slideW : 0;
  const current = (((index - n) % n) + n) % n;

  return (
    <div
      className={`car${narrow ? " car--narrow" : ""}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        ref={viewRef}
        className="car-view"
        onPointerDown={(e) => {
          startX.current = e.clientX;
          swiped.current = false;
          setPaused(true);
        }}
        onPointerUp={(e) => {
          if (startX.current !== null) {
            const dx = e.clientX - startX.current;
            if (Math.abs(dx) > SWIPE_PX) {
              swiped.current = true;
              step(dx < 0 ? 1 : -1);
            }
          }
          startX.current = null;
          // У пальца нет «увёл мышь», поэтому паузу снимаем сами.
          if (e.pointerType !== "mouse") setPaused(false);
        }}
        onPointerCancel={() => {
          startX.current = null;
          setPaused(false);
        }}
        // Свайп не должен заодно открывать статью, на которой начался.
        onClickCapture={(e) => {
          if (swiped.current) {
            e.preventDefault();
            e.stopPropagation();
            swiped.current = false;
          }
        }}
      >
        <div
          className={`car-track${animate ? "" : " no-anim"}`}
          style={{ transform: `translate3d(${-offset}px, 0, 0)` }}
          onTransitionEnd={(e) => {
            // Событие всплывает и от наведения на карточки, нужно только своё.
            if (e.target === e.currentTarget && e.propertyName === "transform") settle();
          }}
        >
          {items.map((post, i) => {
            // Копии за краем недоступны с клавиатуры, иначе фокус уезжает в невидимое.
            const visible = !loop || (i >= index && i < index + Math.ceil(perView));
            return (
              <div key={`${post.slug}-${i}`} className="car-slide" aria-hidden={!visible}>
                <PostCard post={post} tabIndex={visible ? undefined : -1} />
              </div>
            );
          })}
        </div>
      </div>

      {loop && (
        <div className="car-bar">
          <span className="tiny">
            {String(current + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
          <div className="car-btns">
            <button type="button" onClick={() => step(-1)} aria-label={ru ? "Предыдущая" : "Previous"}>
              ←
            </button>
            <button type="button" onClick={() => step(1)} aria-label={ru ? "Следующая" : "Next"}>
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
