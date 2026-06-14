"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/writing", label: "Writing" },
  { href: "/resume", label: "Resume" },
];

export default function Nav() {
  const pathname = usePathname();
  const [cycleIdx, setCycleIdx] = useState(-1);
  const [mounted, setMounted] = useState(false);

  // Entry animation flag
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Cycling glow for inactive links
  useEffect(() => {
    const inactive = links
      .map((l, i) => i)
      .filter((i) => links[i].href !== pathname);

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

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
      setCycleIdx(-1);
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/95 backdrop-blur-sm">
      <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-sm font-bold text-white hover:text-[#a78bfa] transition-colors"
        >
          jasur.dev
        </Link>
        <ul className="flex gap-8 font-mono text-xs">
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
                  style={{
                    animationDelay: mounted ? undefined : `${i * 110}ms`,
                  }}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
