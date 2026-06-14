"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/writing", label: "Writing" },
  { href: "/resume", label: "Resume" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0a]/95 backdrop-blur-sm">
      <nav className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-mono text-sm font-bold text-white hover:text-[#a78bfa] transition-colors">
          jasur.dev
        </Link>
        <ul className="flex gap-8 font-mono text-xs">
          {links.map(({ href, label }, i) => (
            <li key={href}>
              <Link
                href={href}
                className={`nav-link ${
                  pathname === href
                    ? "text-[#a78bfa]"
                    : "text-white/40 hover:text-white transition-colors"
                }`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
