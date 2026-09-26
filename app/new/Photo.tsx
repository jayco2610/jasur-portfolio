"use client";

import { useState } from "react";

/* Фотографий в public/new может ещё не быть. Страница не должна падать и не
   должна показывать битую иконку: вместо картинки встаёт серый прямоугольник
   ровно той же пропорции, с подписью, какой файл сюда положить.

   Проверка идёт через onError самого браузера, а не через чтение файловой
   системы на сервере. Так заглушка исчезает сразу после того, как файл
   положили и страница обновилась, и одинаково работает и в dev, и в сборке. */

type Ratio = "4:5" | "16:10" | "1:1" | "3:2";

const RATIO: Record<Ratio, string> = {
  "4:5": "4 / 5",
  "16:10": "16 / 10",
  "1:1": "1 / 1",
  "3:2": "3 / 2",
};

const SIZE: Record<Ratio, string> = {
  "4:5": "1200 × 1500",
  "16:10": "1600 × 1000",
  "1:1": "1400 × 1400",
  "3:2": "1536 × 1024",
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

  /* Картинка успевает не загрузиться до того, как React повесит onError:
     браузер разбирает html и ломает загрузку раньше гидратации, событие
     уходит в пустоту, и вместо заглушки читатель видит битую иконку с
     alt-текстом. Поэтому при подключении узла проверяем состояние
     напрямую: complete со нулевой natural-шириной означает, что попытка
     уже была и провалилась. */
  const check = (el: HTMLImageElement | null) => {
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  };

  return (
    <div
      className={className ? `nm-ph ${className}` : "nm-ph"}
      style={{ aspectRatio: RATIO[ratio] }}
    >
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} ref={check} onError={() => setFailed(true)} />
      )}
      {failed && (
        <span className="nm-ph-note">
          <b>public{src}</b>
          <span>
            {ratio} {SIZE[ratio]}
          </span>
        </span>
      )}
    </div>
  );
}
