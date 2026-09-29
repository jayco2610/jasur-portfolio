"use client";

import { useEffect, useRef, useState } from "react";
import { PODCAST, type Lang } from "../strings";

/* Плеер выпуска. Перенос components/magazine/Player.tsx: те же кнопки (пуск и
   пауза, полоса перемотки, назад на 15 секунд, скорость 1, 1,25, 1,5, 2),
   те же тайм-коды глав, по нажатию на главу плеер перематывает на неё,
   пройденные главы гаснут.

   Своя копия, а не импорт старого, по той же причине, что у ленты обложек и
   полки статьи: старый собран из классов .pod-* со своими цветами,
   скруглениями и оранжевым бегунком. Здесь только классы .nm-*: квадратная
   кнопка, линейки, чёрный вместо оранжевого.

   Событий аналитики здесь нет намеренно, как в подписке макета
   (log/Subscribe.tsx): /new это макет, и его прослушивания не должны
   подмешиваться в цифры живого сайта. При переносе на прод вернуть
   track и hit из старого плеера. */

function stamp(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const s = Math.floor(sec % 60);
  const m = Math.floor(sec / 60) % 60;
  const h = Math.floor(sec / 3600);
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  return `${h > 0 ? `${h}:` : ""}${mm}:${String(s).padStart(2, "0")}`;
}

export default function Player({
  src,
  lang,
  chapters = [],
}: {
  src: string;
  /* Язык выпуска, а не интерфейса: подписи кнопок идут за текстом страницы. */
  lang: Lang;
  chapters?: { at: number; label: string; stamp: string }[];
}) {
  const s = PODCAST[lang];
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [at, setAt] = useState(0);
  const [total, setTotal] = useState(0);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    const onTime = () => setAt(el.currentTime);
    const onMeta = () => setTotal(el.duration);
    const onEnd = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnd);
    };
  }, []);

  function toggle() {
    const el = audio.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  function seek(sec: number) {
    const el = audio.current;
    if (!el) return;
    el.currentTime = Math.max(0, Math.min(sec, el.duration || sec));
    setAt(el.currentTime);
  }

  function changeRate() {
    const next = rate === 1 ? 1.25 : rate === 1.25 ? 1.5 : rate === 1.5 ? 2 : 1;
    setRate(next);
    if (audio.current) audio.current.playbackRate = next;
  }

  const done = total > 0 ? (at / total) * 100 : 0;

  return (
    <div className="nm-player">
      {/* Метаданные могут прийти раньше гидратации, и тогда событие
          loadedmetadata уходит в пустоту, а длительность так и остаётся
          неизвестной. Поэтому при подключении узла она читается напрямую,
          тем же приёмом, что у заглушек картинок (Photo.tsx). */}
      <audio
        ref={(el) => {
          audio.current = el;
          if (el && el.readyState >= 1 && Number.isFinite(el.duration)) {
            setTotal(el.duration);
          }
        }}
        src={src}
        preload="metadata"
      />

      <div className="nm-player-row">
        <button
          type="button"
          onClick={toggle}
          className="nm-player-play"
          aria-label={playing ? s.pause : s.play}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <rect x="6" y="4" width="4" height="16" fill="currentColor" />
              <rect x="14" y="4" width="4" height="16" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M7 4l13 8-13 8z" fill="currentColor" />
            </svg>
          )}
        </button>

        <div className="nm-player-bar">
          <input
            type="range"
            min={0}
            max={total || 0}
            step={1}
            value={at}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label={s.seek}
            style={{ ["--done" as string]: `${done}%` }}
          />
          <div className="nm-player-times">
            <span>{stamp(at)}</span>
            {/* Пока длительность неизвестна, вместо неё прочерки. Не длинное
                тире: у цифр своё место, и строка не должна прыгать. */}
            <span>{total ? stamp(total) : "-:--"}</span>
          </div>
        </div>

        <div className="nm-player-ctrl">
          <button type="button" onClick={() => seek(at - 15)} aria-label={s.back}>
            −15
          </button>
          <button type="button" onClick={changeRate} aria-label={s.speed}>
            {rate}×
          </button>
        </div>
      </div>

      {chapters.length > 0 && (
        <ol className="nm-player-ch">
          {chapters.map((c) => (
            <li key={c.stamp}>
              <button
                type="button"
                onClick={() => seek(c.at)}
                className={at >= c.at ? "is-past" : ""}
              >
                <b>{c.stamp}</b>
                <span>{c.label}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
