"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/writing", label: "Writing" },
  { href: "/resume", label: "Resume" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#111827]/90 backdrop-blur-sm">
      <nav className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-[#F8FAFF] hover:text-[#7C3AED] transition-colors"
        >
          Jasur Akhmadaliev
        </Link>
        <ul className="flex gap-6 text-sm">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={
                  pathname === href
                    ? "text-[#7C3AED] font-medium"
                    : "text-white/60 hover:text-[#F8FAFF] transition-colors"
                }
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
