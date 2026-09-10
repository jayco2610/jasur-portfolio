"use client";

import { useEffect, useRef, useState } from "react";

// Строки списка въезжают слева с задержкой 65мс друг за другом, когда
// попадают в кадр. index — позиция строки в своём списке (0, 1, 2…).
// Возвращает ref + className для навешивания прямо на существующий элемент
// строки (a.row, div.row, Link…), без лишней обёртки, чтобы не ломать grid.
export function useReveal<T extends HTMLElement>(index = 0) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    let timeout: ReturnType<typeof setTimeout>;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = Math.min(index, 6) * 65;
            timeout = setTimeout(() => setVisible(true), delay);
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return { ref, className: `reveal${visible ? " reveal-in" : ""}` };
}
