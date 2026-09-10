"use client";

import Link from "next/link";
import Mark from "@/components/Mark";
import { useLanguage } from "@/context/LanguageContext";

// Common wrapper for every demo page: back link, header, content, disclaimer.
export default function DemoShell({
  title,
  subtitle,
  pitch,
  hint,
  footer,
  children,
}: {
  title: { en: string; ru: string };
  subtitle: { en: string; ru: string };
  pitch?: { en: string; ru: string };
  hint?: { en: string; ru: string };
  // null hides the default business-demo disclaimer (used by product pages
  // that carry their own note).
  footer?: { en: string; ru: string } | null;
  children: React.ReactNode;
}) {
  const { lang } = useLanguage();
  return (
    <div className="wrap pt-11 pb-24">
      <Link href="/demos" className="tiny hover:text-ink transition-colors">
        ← {lang === "en" ? "All demos" : "Все демо"}
      </Link>

      <div className="tiny mt-7 mb-3">{lang === "en" ? "Live demo" : "Живое демо"}</div>
      <h1 className="text-[clamp(30px,4.2vw,48px)] leading-[0.98] tracking-[-0.036em] font-bold">{title[lang]}</h1>
      <p className="text-[15px] text-dim leading-relaxed max-w-2xl mt-4">{subtitle[lang]}</p>

      {pitch && (
        <p className="mt-5 max-w-2xl text-[clamp(15.5px,1.35vw,18px)] leading-[1.62]">
          <Mark>{pitch[lang]}</Mark>
        </p>
      )}
      {hint && <p className="tiny normal-case tracking-normal text-[13px] mt-4 max-w-2xl border-t border-rule pt-3">▶ {hint[lang]}</p>}

      <div className="mt-10">{children}</div>

      {footer !== null && (
        <p className="tiny normal-case tracking-normal text-[11px] mt-12 border-t border-rule pt-4 max-w-2xl">
          {footer
            ? footer[lang]
            : lang === "en"
            ? "Simulated data. On a real project this connects to the POS software (iiko), SBP payments, and the venue's customer base."
            : "Данные симулированы. На реальном проекте подключается кассовое ПО (iiko), оплата через СБП и база клиентов заведения."}
        </p>
      )}
    </div>
  );
}
