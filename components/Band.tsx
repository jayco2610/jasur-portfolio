"use client";

import { useEffect, useRef } from "react";

// Слово-глава едет горизонтально при скролле страницы (параллакс).
export default function Band({ word, note }: { word: string; note: string }) {
  const bandRef = useRef<HTMLDivElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;

    const move = () => {
      ticking = false;
      const band = bandRef.current;
      const span = spanRef.current;
      if (!band || !span) return;
      const r = band.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -200 || r.top > vh + 200) return;
      const p = (vh - r.top) / (vh + r.height);
      span.style.transform = `translateY(-52%) translateX(${((p - 0.5) * -190).toFixed(1)}px)`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(move);
      }
    };

    move();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="band" ref={bandRef}>
      <span ref={spanRef}>{word}</span>
      <div className="band-no tiny">{note}</div>
    </div>
  );
}
