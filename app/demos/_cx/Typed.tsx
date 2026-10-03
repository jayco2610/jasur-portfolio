"use client";

import { useEffect, useState } from "react";

/* Текст от модели появляется с эффектом печати, по три знака. Тот же приём,
   что в демо отзывов (TypedText в ReviewsDemo.tsx), вынесен сюда для четырёх
   демо «Для компаний». Новый текст начинает печататься заново. */
export default function Typed({ text, step = 3, speed = 16 }: { text: string; step?: number; speed?: number }) {
  const [state, setState] = useState({ text, shown: 0 });
  if (state.text !== text) setState({ text, shown: 0 });
  useEffect(() => {
    const interval = setInterval(() => {
      setState((s) => {
        if (s.shown >= s.text.length) {
          clearInterval(interval);
          return s;
        }
        return { ...s, shown: s.shown + step };
      });
    }, speed);
    return () => clearInterval(interval);
  }, [text, step, speed]);
  return <>{state.text === text ? text.slice(0, state.shown) : ""}</>;
}
