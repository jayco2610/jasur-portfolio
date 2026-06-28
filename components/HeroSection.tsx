"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/translations";

const SCRAMBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>?[]{}";
const MARKER = "JasurGPT";

function rand() {
  return SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
}

function renderBio(text: string) {
  const idx = text.indexOf(MARKER);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-[#a78bfa]">{MARKER}</span>
      {text.slice(idx + MARKER.length)}
    </>
  );
}

export default function HeroSection() {
  const { lang } = useLanguage();
  const hero = t[lang].hero;
  const TITLE = hero.title;

  const [chars, setChars] = useState<(string | null)[]>(Array(TITLE.length).fill(null));
  const [titleDone, setTitleDone] = useState(false);
  const [bioText, setBioText] = useState("");
  const [bioDone, setBioDone] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    setChars(Array(TITLE.length).fill(null));
    setTitleDone(false);
    setBioText("");
    setBioDone(false);
    setShowButtons(false);

    const SCRAMBLE_FRAMES = 8;
    const FRAME_MS = 42;
    let tick = 0;
    let settled = 0;

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setChars((prev) => {
          const next = [...prev];
          if (settled < TITLE.length) {
            const ch = TITLE[settled];
            if (ch === " " || ch === ".") {
              next[settled] = ch;
              settled++;
              tick = 0;
            } else {
              next[settled] = rand();
              tick++;
              if (tick >= SCRAMBLE_FRAMES) {
                next[settled] = ch;
                settled++;
                tick = 0;
              }
            }
          }
          return next;
        });
        if (settled >= TITLE.length) {
          clearInterval(interval);
          setTitleDone(true);
        }
      }, FRAME_MS);
      return () => clearInterval(interval);
    }, 300);

    return () => clearTimeout(timeout);
  }, [lang]);

  useEffect(() => {
    if (!titleDone) return;
    const BIO = hero.bio;
    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        i++;
        setBioText(BIO.slice(0, i));
        if (i >= BIO.length) { clearInterval(interval); setBioDone(true); }
      }, 28);
    }, 150);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [titleDone, lang]);

  useEffect(() => {
    if (!bioDone) return;
    const timeout = setTimeout(() => setShowButtons(true), 300);
    return () => clearTimeout(timeout);
  }, [bioDone]);

  return (
    <section className="relative h-[100dvh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <img src="/jasur.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-top" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-[#0a0a0a]" />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <h1 className="font-mono text-5xl md:text-7xl font-bold text-[#a78bfa] mb-8 leading-none min-h-[1.2em]">
          {chars.map((c, i) => (
            <span key={i} className={c !== null && c !== TITLE[i] ? "opacity-50" : ""}>
              {c ?? ""}
            </span>
          ))}
          {!titleDone && chars.every(c => c === null) && (
            <span className="inline-block w-[4px] h-[0.75em] bg-[#a78bfa] ml-1 align-middle animate-pulse" />
          )}
        </h1>

        <p className="font-mono text-base md:text-lg text-white leading-relaxed whitespace-pre-line min-h-[5em]">
          {renderBio(bioText)}
          {titleDone && !bioDone && (
            <span className="inline-block w-[2px] h-[1em] bg-white/60 ml-0.5 align-middle animate-pulse" />
          )}
        </p>

        <div className={`mt-10 flex gap-3 justify-center flex-wrap transition-opacity duration-700 ${showButtons ? "opacity-100" : "opacity-0"}`}>
          <Link href="/projects" className="font-mono text-sm px-5 py-2.5 bg-[#7C3AED] text-white rounded hover:bg-[#6d28d9] transition-colors">
            {hero.viewProjects}
          </Link>
          <Link href="/resume" className="font-mono text-sm px-5 py-2.5 border border-white/25 text-white/80 rounded hover:border-white/50 hover:text-white transition-colors">
            {hero.resume}
          </Link>
        </div>
      </div>

      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-1000 ${showButtons ? "opacity-40" : "opacity-0"}`}>
        <span className="font-mono text-[10px] text-white tracking-[0.2em] uppercase">{hero.scroll}</span>
        <div className="w-px h-8 bg-white/50" />
      </div>
    </section>
  );
}
