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
  const [menuOpen, setMenuOpen] = useState(false);
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
    const timeout = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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

        {/* Desktop links */}
        <ul className="hidden md:flex gap-6 font-mono text-xs">
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

        {/* Right: lang toggle + hamburger */}
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={toggle}
            className="font-mono text-xs font-bold px-3 py-1 rounded border border-[#7C3AED]/60 text-[#a78bfa] hover:bg-[#7C3AED]/20 hover:text-white transition-all"
            aria-label="Toggle language"
          >
            {lang === "en" ? "RU" : "EN"}
          </button>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col gap-1.5 p-1"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-px bg-white/70 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
            <span className={`block w-5 h-px bg-white/70 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-px bg-white/70 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0a0a0a] px-6 py-4">
          <ul className="flex flex-col gap-4 font-mono text-sm">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`transition-colors ${pathname === href ? "text-white" : "text-white/40 hover:text-white"}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
