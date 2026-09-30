"use client";

import { useState } from "react";

/* Фотографий в public/new может ещё не быть. Страница не должна падать и не
   должна показывать битую иконку: вместо картинки встаёт серый прямоугольник
   ровно той же пропорции, с подписью, какой файл сюда положить.

   Проверка идёт через onError самого браузера, а не через чтение файловой
   системы на сервере. Так заглушка исчезает сразу после того, как файл
   положили и страница обновилась, и одинаково работает и в dev, и в сборке. */

type Ratio = "4:5" | "16:10" | "1:1" | "3:2" | "2:3";

const RATIO: Record<Ratio, string> = {
  "4:5": "4 / 5",
  "16:10": "16 / 10",
  "1:1": "1 / 1",
  "3:2": "3 / 2",
  "2:3": "2 / 3",
};

const SIZE: Record<Ratio, string> = {
  "4:5": "1200 × 1500",
  "16:10": "1600 × 1000",
  "1:1": "1400 × 1400",
  "3:2": "1536 × 1024",
  "2:3": "1024 × 1536",
};

/* Пиксельные размеры в SIZE выше идут в атрибуты width и height картинки.
   Настоящий размер на экране задаёт CSS (ширина рамки и её aspect-ratio),
   атрибуты сообщают браузеру пропорцию заранее, до загрузки файла.

   Загрузка. По умолчанию картинка ленивая (loading="lazy"): браузер берёт её,
   только когда она подъезжает к экрану. Так на Log не грузятся сразу три
   копии ленты обложек, а в статье все картинки текста. Первый экран страницы
   помечается priority: он грузится сразу и первым (fetchpriority="high"),
   иначе главная картинка страницы ждала бы, пока браузер разложит страницу. */
function dims(ratio: Ratio): { width: number; height: number } {
  const [w, h] = SIZE[ratio].split(" × ").map(Number);
  return { width: w, height: h };
}

export default function Photo({
  src,
  alt,
  ratio,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  ratio: Ratio;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  /* Картинка успевает не загрузиться до того, как React повесит onError:
     браузер разбирает html и ломает загрузку раньше гидратации, событие
     уходит в пустоту, и вместо заглушки читатель видит битую иконку с
     alt-текстом. Поэтому при подключении узла проверяем состояние
     напрямую: complete со нулевой natural-шириной означает, что попытка
     уже была и провалилась.

     currentSrc нужен из-за ленивой загрузки: у картинки ниже экрана
     попытки ещё не было, адрес ей не назначен (currentSrc пустой), и нулевая
     ширина здесь значит «не грузили», а не «не нашли». Без этой проверки
     такие картинки превращались бы в заглушки. */
  const check = (el: HTMLImageElement | null) => {
    if (el && el.complete && el.naturalWidth === 0 && el.currentSrc) setFailed(true);
  };

  return (
    <div
      className={className ? `nm-ph ${className}` : "nm-ph"}
      style={{ aspectRatio: RATIO[ratio] }}
    >
      {/* draggable={false}: внутри едущей ленты обложек на Log попытка
          подкрутить её мышью иначе превращается в перетаскивание картинки. */}
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          {...dims(ratio)}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
          ref={check}
          onError={() => setFailed(true)}
          draggable={false}
        />
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
