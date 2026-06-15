"use client";

import { useState, useEffect, useRef } from "react";

// Module-level flag: resets on hard refresh, persists across client navigation
let hasEntered = false;

export default function SiteEntrance() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!hasEntered) setVisible(true);
  }, []);

  const enter = () => {
    if (fading) return;
    hasEntered = true;
    setFading(true);

    // Play audio after click — browser allows it
    try {
      const audio = new Audio("/intro.mp3");
      audio.volume = 1;
      audio.playbackRate = 1.4;
      audioRef.current = audio;
      audio.play().catch(() => {});
    } catch {}

    setTimeout(() => setVisible(false), 800);
  };

  if (!visible) return null;

  return (
    <div
      onClick={enter}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center cursor-pointer select-none transition-opacity duration-700 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      style={{ background: "rgba(10,10,10,0.97)" }}
    >
      <div className="relative mb-10">
        <div className="absolute inset-0 rounded-full bg-[#7C3AED]/20 animate-ping" style={{ animationDuration: "2s" }} />
        <div className="w-20 h-20 rounded-full border border-[#7C3AED]/50 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        </div>
      </div>
      <p className="font-mono text-white text-lg tracking-[0.15em] mb-3">JASUR.DEV</p>
      <p className="font-mono text-white/40 text-xs tracking-[0.3em] uppercase animate-pulse">
        Click anywhere to enter
      </p>
    </div>
  );
}
