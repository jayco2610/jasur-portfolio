"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Одно событие на открытие страницы. Без куки: сервер просто прибавляет
// единицу к счётчику этого адреса за сегодня.
export function hit(event: string, path?: string) {
  try {
    fetch("/api/hit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(path ? { event, path } : { event }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // счётчик никогда не должен мешать странице работать
  }
}

export default function Pulse() {
  const pathname = usePathname();

  useEffect(() => {
    hit("page", pathname);
  }, [pathname]);

  // Переходы в Telegram и открытия демо ловим один раз на весь сайт, чтобы не
  // дописывать обработчик к каждой ссылке.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as HTMLElement | null)?.closest?.("a");
      const href = link?.getAttribute("href") ?? "";
      if (href.includes("t.me/")) hit("telegram_click");
      else if (href.startsWith("/demos/")) hit("demo_open");
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
