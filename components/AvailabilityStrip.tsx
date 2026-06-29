"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function AvailabilityStrip() {
  const { lang } = useLanguage();

  return (
    <div className="bg-[#080808] border-b border-emerald-500/15 py-2 px-6">
      <p className="font-mono text-[11px] text-white/50 flex items-center justify-center gap-2.5">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        {lang === "en"
          ? "Open to PM / AI PM roles · Remote or Relocation · Available now"
          : "Открыт к PM / AI PM позициям · Удалённо или релокация · Готов сейчас"}
      </p>
    </div>
  );
}
