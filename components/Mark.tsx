"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Чёрная плашка заливается слева направо, когда попадает в кадр.
export default function Mark({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLit(true);
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "-25% 0px -25% 0px", threshold: 0.9 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <mark ref={ref} className={`mark${lit ? " mark-lit" : ""}`}>
      {children}
    </mark>
  );
}
