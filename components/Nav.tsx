"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/translations";

type GlowTarget = number | "lang" | null;

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [glow, setGlow] = useState<GlowTarget>(null);
  const { lang, toggle } = useLanguage();
  const nav = t[lang].nav;

  const links = [
    { href: "/", label: nav.home },
    { href: "/projects", label: nav.projects },
    { href: "/services", label: nav.services },
    { href: "/demos", label: nav.demos },
    { href: "/writing", label: nav.writing },
    { href: "/resume", label: nav.resume },
  ];

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Бегущая подсветка по очереди: разделы навигации + переключатель языка,
  // чтобы было видно, что и то и другое кликабельно.
  useEffect(() => {
    const pool: GlowTarget[] = [
      ...links.map((_, i) => i).filter((i) => links[i].href !== pathname),
      "lang",
    ];
    if (pool.length === 0) return;
    let pos = 0;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      setGlow(pool[pos]);
      interval = setInterval(() => {
        pos = (pos + 1) % pool.length;
        setGlow(pool[pos]);
      }, 900);
    }, 2000);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
      setGlow(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, lang]);

  const current = links.find((l) => l.href === pathname)?.label ?? links[0].label;

  return (
    <>
      {/* выходные данные */}
      <div className="mast">
        <div className="wrap mast-in">
          <span className="mast-name">Jasur Akhmadaliev</span>
          <span className="tiny">{lang === "ru" ? "Продакт-менеджер · AI" : "Product Manager · AI"}</span>
          <span className="tiny">{lang === "ru" ? "Москва" : "Moscow"}</span>
          <span className="tiny">2026 · {lang === "ru" ? "Ред." : "Ed."} 01</span>
        </div>
      </div>

      {/* бегущий колонтитул */}
      <header className="run">
        <div className="wrap run-in">
          <nav className="run-nav hidden md:flex">
            {links.map(({ href, label }, i) => (
              <Link key={href} href={href} data-active={pathname === href} className={glow === i ? "nav-glow" : ""}>
                {label}
              </Link>
            ))}
          </nav>

          <span className="tiny hidden md:block">{current}</span>

          <div className="flex items-center gap-4 ml-auto md:ml-0">
            <button
              onClick={toggle}
              className={`tiny hover:text-ink transition-colors ${glow === "lang" ? "nav-glow" : ""}`}
              aria-label="Toggle language"
            >
              {lang === "en" ? "RU" : "EN"}
            </button>

            <span className="run-status hidden sm:flex">
              <i />
              {lang === "ru" ? "Открыт к предложениям" : "Open to offers"}
            </span>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex flex-col gap-1.5 p-1"
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-px bg-ink transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`} />
              <span className={`block w-5 h-px bg-ink transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-px bg-ink transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-rule">
            <div className="wrap py-4">
              <ul className="flex flex-col gap-4">
                {links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`tiny ${pathname === href ? "!text-ink" : ""}`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
