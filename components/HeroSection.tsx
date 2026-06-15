"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const TITLE = "Welcome.";
const BIO =
  "Hi — I'm Jasur, AI Product Manager from Tashkent.\nI build and ship digital products solo: from discovery to live users.\nUse the menu above to explore my projects, resume, and services.\nAny questions? Ask JasurGPT — the button in the corner knows everything about me.";
const VOICE_TEXT =
  "Hi. I'm Jasur — AI Product Manager from Tashkent. I build and ship digital products solo, from discovery to live users. Use the menu above to explore my projects, resume, and services. Any questions? Ask JasurGPT — the button in the corner knows everything about me.";
const MARKER = "JasurGPT";

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

function SpeakerIcon({ speaking }: { speaking: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      {speaking ? (
        <>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </>
      ) : (
        <line x1="23" y1="9" x2="17" y2="15" />
      )}
    </svg>
  );
}

export default function HeroSection() {
  const [titleText, setTitleText] = useState("");
  const [bioText, setBioText] = useState("");
  const [titleDone, setTitleDone] = useState(false);
  const [bioDone, setBioDone] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Type title
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        i++;
        setTitleText(TITLE.slice(0, i));
        if (i >= TITLE.length) { clearInterval(interval); setTitleDone(true); }
      }, 65);
    }, 350);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, []);

  // Type bio
  useEffect(() => {
    if (!titleDone) return;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        i++;
        setBioText(BIO.slice(0, i));
        if (i >= BIO.length) { clearInterval(interval); setBioDone(true); }
      }, 15);
    }, 180);
    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, [titleDone]);

  // Show buttons
  useEffect(() => {
    if (!bioDone) return;
    const t = setTimeout(() => setShowButtons(true), 350);
    return () => clearTimeout(t);
  }, [bioDone]);

  // Stop speech on unmount
  useEffect(() => {
    return () => { if (typeof window !== "undefined") window.speechSynthesis?.cancel(); };
  }, []);

  const toggleVoice = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(VOICE_TEXT);
    utterance.lang = "en-US";
    utterance.rate = 0.82;
    utterance.pitch = 0.75;
    utterance.volume = 1;

    // Pick the best available voice (JARVIS-like: deep, clear English)
    const trySetVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferred = [
        "Daniel",        // macOS — sounds closest to JARVIS
        "Aaron",
        "Fred",
        "Alex",
        "Samantha",
        "Google UK English Male",
        "Google US English",
      ];
      for (const name of preferred) {
        const match = voices.find((v) => v.name === name && /en/i.test(v.lang));
        if (match) { utterance.voice = match; break; }
      }
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      trySetVoice();
    } else {
      window.speechSynthesis.addEventListener("voiceschanged", trySetVoice, { once: true });
    }

    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }, [speaking]);

  return (
    <section className="relative h-[100dvh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <img src="/jasur.jpg" alt="" className="absolute inset-0 w-full h-full object-cover object-top" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-[#0a0a0a]" />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <h1 className="font-mono text-5xl md:text-7xl font-bold text-[#a78bfa] mb-8 leading-none min-h-[1.2em]">
          {titleText}
          {!titleDone && (
            <span className="inline-block w-[4px] h-[0.75em] bg-[#a78bfa] ml-1 align-middle animate-pulse" />
          )}
        </h1>

        <p className="font-mono text-base md:text-lg text-white leading-relaxed whitespace-pre-line min-h-[5em]">
          {renderBio(bioText)}
          {titleDone && !bioDone && (
            <span className="inline-block w-[2px] h-[1em] bg-white/60 ml-0.5 align-middle animate-pulse" />
          )}
        </p>

        <div className={`mt-10 flex gap-3 justify-center flex-wrap items-center transition-opacity duration-700 ${showButtons ? "opacity-100" : "opacity-0"}`}>
          <Link href="/projects" className="font-mono text-sm px-5 py-2.5 bg-[#7C3AED] text-white rounded hover:bg-[#6d28d9] transition-colors">
            View projects
          </Link>
          <Link href="/resume" className="font-mono text-sm px-5 py-2.5 border border-white/25 text-white/80 rounded hover:border-white/50 hover:text-white transition-colors">
            Resume
          </Link>

          {/* Voice button */}
          <button
            onClick={toggleVoice}
            title={speaking ? "Stop" : "Play intro"}
            className={`flex items-center gap-2 font-mono text-xs px-4 py-2.5 rounded border transition-all duration-300 ${
              speaking
                ? "border-[#a78bfa] text-[#a78bfa] bg-[#7C3AED]/10"
                : "border-white/20 text-white/50 hover:border-white/40 hover:text-white/80"
            }`}
          >
            <span className={`flex items-center ${speaking ? "[&>svg]:drop-shadow-[0_0_6px_rgba(167,139,250,0.8)]" : ""}`}>
              <SpeakerIcon speaking={speaking} />
            </span>
            {speaking ? (
              <span className="flex gap-[3px] items-end h-3">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="w-[2px] bg-[#a78bfa] rounded-full animate-bounce"
                    style={{ height: `${8 + i * 3}px`, animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </span>
            ) : (
              <span>Play intro</span>
            )}
          </button>
        </div>
      </div>

      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-1000 ${showButtons ? "opacity-40" : "opacity-0"}`}>
        <span className="font-mono text-[10px] text-white tracking-[0.2em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-white/50" />
      </div>
    </section>
  );
}
