"use client";

import { useEffect, useRef, useState } from "react";

// Цифра набегает от нуля, когда блок попадает в кадр. Понимает префикс/суффикс
// вокруг числа ("80s", "100%", "8+", "№3") — считает только сам разряд.
export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLElement>(null);
  const [display, setDisplay] = useState(value);
  const done = useRef(false);

  useEffect(() => {
    setDisplay(value);
    done.current = false;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const m = value.match(/^(\D*)(\d+)(.*)$/);
    if (!m) return;
    const [, pre, numStr, post] = m;
    const target = parseInt(numStr, 10);
    if (target < 2) return;

    const el = ref.current;
    if (!el) return;

    setDisplay(pre + "0" + post);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !done.current) {
            done.current = true;
            io.unobserve(entry.target);
            const dur = 900;
            let start: number | null = null;
            const step = (ts: number) => {
              if (start === null) start = ts;
              const p = Math.min((ts - start) / dur, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setDisplay(pre + Math.round(target * eased) + post);
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }
        });
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return <b ref={ref}>{display}</b>;
}
