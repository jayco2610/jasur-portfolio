"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

// Common wrapper for every demo page: back link, header, content, disclaimer.
export default function DemoShell({
  title,
  subtitle,
  pitch,
  hint,
  children,
}: {
  title: { en: string; ru: string };
  subtitle: { en: string; ru: string };
  pitch?: { en: string; ru: string };
  hint?: { en: string; ru: string };
  children: React.ReactNode;
}) {
  const { lang } = useLanguage();
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <Link
        href="/demos"
        className="font-mono text-xs text-white/30 hover:text-white transition-colors"
      >
        ← {lang === "en" ? "All demos" : "Все демо"}
      </Link>
      <p className="font-mono text-xs text-white/30 tracking-[0.2em] uppercase mt-6 mb-3">
        {lang === "en" ? "Live demo" : "Живое демо"}
      </p>
      <h1 className="font-mono text-3xl font-bold text-white mb-3">{title[lang]}</h1>
      <p className="text-white/50 text-sm leading-relaxed max-w-2xl mb-4">{subtitle[lang]}</p>
      {pitch && (
        <div className="mb-4 px-4 py-3 border border-[#7C3AED]/20 rounded-lg bg-[#7C3AED]/5 max-w-2xl">
          <p className="font-mono text-xs text-[#a78bfa] leading-relaxed">{pitch[lang]}</p>
        </div>
      )}
      {hint && (
        <div className="mb-10 px-4 py-3 border border-emerald-500/25 rounded-lg bg-emerald-500/5 max-w-2xl">
          <p className="font-mono text-xs text-emerald-300/90 leading-relaxed">▶ {hint[lang]}</p>
        </div>
      )}
      {children}
      <p className="font-mono text-[10px] text-white/25 mt-12">
        {lang === "en"
          ? "Simulated data. On a real project this connects to the POS software (iiko), SBP payments, and the venue's customer base."
          : "Данные симулированы. На реальном проекте подключается кассовое ПО (iiko), оплата через СБП и база клиентов заведения."}
      </p>
    </div>
  );
}
