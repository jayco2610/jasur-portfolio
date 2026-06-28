"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/translations";

export default function Nav() {
  const pathname = usePathname();
  const [cycleIdx, setCycleIdx] = useState(-1);
  const [mounted, setMounted] = useState(false);
  const { lang, toggle } = useLanguage();
  const nav = t[lang].nav;

  const links = [
    { href: "/", label: nav.home },
    { href: "/projects", label: nav.projects },
    { href: "/services", label: nav.services },
    { href: "/writing", label: nav.writing },
    { href: "/resume", label: nav.resume },
  ];

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const inactive = links.map((l, i) => i).filter((i) => links[i].href !== pathname);
    if (inactive.length === 0) return;
    let pos = 0;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      setCycleIdx(inactive[pos]);
      interval = setInterval(() => {
        pos = (pos + 1) % inactive.length;
        setCycleIdx(inactive[pos]);
      }, 850);
    }, 2200);
    return () => { clearTimeout(timeout); clearInterval(interval); setCycleIdx(-1); };
  }, [pathname, lang]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/95 backdrop-blur-sm">
      <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm font-bold text-white hover:text-[#a78bfa] transition-colors">
          jasur.dev
        </Link>
        <div className="flex items-center gap-6">
          <ul className="flex gap-6 font-mono text-xs">
            {links.map(({ href, label }, i) => {
              const isActive = pathname === href;
              const isGlowing = cycleIdx === i && !isActive;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`nav-link transition-all duration-500 ${
                      isActive
                        ? "text-white"
                        : isGlowing
                        ? "text-white [text-shadow:0_0_12px_rgba(167,139,250,0.9),0_0_24px_rgba(124,58,237,0.5)]"
                        : "text-white/35 hover:text-white"
                    }`}
                    style={{ animationDelay: mounted ? undefined : `${i * 110}ms` }}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <button
            onClick={toggle}
            className="font-mono text-[10px] px-2.5 py-1 rounded border border-white/10 text-white/40 hover:text-white hover:border-[#7C3AED]/50 transition-all"
            aria-label="Toggle language"
          >
            {lang === "en" ? "RU" : "EN"}
          </button>
        </div>
      </nav>
    </header>
  );
}
