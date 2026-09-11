"use client";

import { usePathname } from "next/navigation";

// Подвал портфолио. У журнала свой, поэтому на его страницах не выводим.
export default function SiteFooter() {
  const pathname = usePathname();
  if (pathname === "/writing" || pathname.startsWith("/blog")) return null;

  return (
    <footer className="wrap">
      <div className="flex flex-wrap justify-between gap-2.5 border-t border-ink pt-7 pb-24 mt-11">
        <span className="tiny">Jasur Akhmadaliev</span>
        <span className="tiny">Москва</span>
        <span className="tiny">2026 · Prompt-injection hardened</span>
      </div>
    </footer>
  );
}
