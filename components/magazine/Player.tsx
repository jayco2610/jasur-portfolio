"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { hit } from "@/components/Pulse";

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
  ru,
  slug,
  chapters = [],
}: {
  src: string;
  ru: boolean;
  slug: string;
  chapters?: { at: number; label: string; stamp: string }[];
}) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [at, setAt] = useState(0);
  const [total, setTotal] = useState(0);
  const [rate, setRate] = useState(1);
  // Какие отметки уже отправлены. Иначе при перемотке назад
  // одна и та же четверть засчитается несколько раз.
  const sent = useRef<Set<string>>(new Set());

  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    const onTime = () => {
      setAt(el.currentTime);
      if (!el.duration) return;
      const share = el.currentTime / el.duration;
      for (const mark of [0.25, 0.5, 0.75]) {
        const key = `p${mark}`;
        if (share >= mark && !sent.current.has(key)) {
          sent.current.add(key);
          track("podcast_progress", { episode: slug, share: mark });
        }
      }
    };
    const onMeta = () => setTotal(el.duration);
    const onEnd = () => {
      setPlaying(false);
      if (!sent.current.has("done")) {
        sent.current.add("done");
        track("podcast_finished", { episode: slug });
      }
    };
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnd);
    };
  }, [slug]);

  function toggle() {
    const el = audio.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setPlaying(true);
      if (!sent.current.has("start")) {
        sent.current.add("start");
        track("podcast_play", { episode: slug });
        hit("podcast_play");
      }
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
    <div className="pod-player">
      <audio ref={audio} src={src} preload="metadata" />

      <div className="pod-player-row">
        <button type="button" onClick={toggle} className="pod-play" aria-label={playing ? "Пауза" : "Слушать"}>
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

        <div className="pod-bar-wrap">
          <input
            type="range"
            min={0}
            max={total || 0}
            step={1}
            value={at}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label={ru ? "Перемотка" : "Seek"}
            style={{ ["--done" as string]: `${done}%` }}
          />
          <div className="pod-times">
            <span>{stamp(at)}</span>
            <span>{total ? stamp(total) : "—:—"}</span>
          </div>
        </div>

        <div className="pod-ctrl">
          <button type="button" onClick={() => seek(at - 15)} aria-label={ru ? "Назад 15 секунд" : "Back 15s"}>
            −15
          </button>
          <button type="button" onClick={changeRate} aria-label={ru ? "Скорость" : "Speed"}>
            {rate}×
          </button>
        </div>
      </div>

      {chapters.length > 0 && (
        <ol className="pod-chapters">
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
