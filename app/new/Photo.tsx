"use client";

import { useState } from "react";

/* Фотографий в public/new может ещё не быть. Страница не должна падать и не
   должна показывать битую иконку: вместо картинки встаёт серый прямоугольник
   ровно той же пропорции, с подписью, какой файл сюда положить.

   Проверка идёт через onError самого браузера, а не через чтение файловой
   системы на сервере. Так заглушка исчезает сразу после того, как файл
   положили и страница обновилась, и одинаково работает и в dev, и в сборке. */

type Ratio = "4:5" | "16:10" | "1:1";

const RATIO: Record<Ratio, string> = {
  "4:5": "4 / 5",
  "16:10": "16 / 10",
  "1:1": "1 / 1",
};

export default function Photo({
  src,
  alt,
  ratio,
  className,
}: {
  src: string;
  alt: string;
  ratio: Ratio;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={className ? `nm-ph ${className}` : "nm-ph"}
      style={{ aspectRatio: RATIO[ratio] }}
    >
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} onError={() => setFailed(true)} />
      )}
      {failed && (
        <span className="nm-ph-note">
          <b>public{src}</b>
          <span>
            {ratio} {ratio === "4:5" ? "1200 × 1500" : ratio === "16:10" ? "1600 × 1000" : "1400 × 1400"}
          </span>
        </span>
      )}
    </div>
  );
}
