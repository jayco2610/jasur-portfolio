"use client";

import { useEffect, useState } from "react";
import type { Heading, Figure, SourceLink } from "@/lib/blog";

/* Полка рядом со статьёй: главы, картинки, ссылки. Перенос
   components/magazine/ArticleRail.tsx один к одному по поведению:
   те же три вкладки, пустые не показываются, первой открыта первая
   непустая, текущая глава подсвечивается по мере чтения.

   Своя копия, а не импорт старого компонента, по той же причине, что и у
   ленты обложек (log/Carousel.tsx): старый собран из классов .mag-*, которые
   живут в globals.css со своими цветами и оранжевым акцентом. Здесь только
   классы .nm-*. Текущая глава отмечается чёрной линейкой, а не оранжевой:
   оранжевый в издании остаётся за шапкой.

   Импорт из lib/blog только типов: import type стирается при сборке, и код
   с файловой системой в браузер не попадает. */

type Tab = "toc" | "figs" | "links";

export default function Rail({
  headings,
  figures,
  links,
  ru,
}: {
  headings: Heading[];
  figures: Figure[];
  links: SourceLink[];
  ru: boolean;
}) {
  const tabs = (
    [
      { key: "toc", label: ru ? "Главы" : "Chapters", count: headings.length },
      { key: "figs", label: ru ? "Картинки" : "Images", count: figures.length },
      { key: "links", label: ru ? "Ссылки" : "Links", count: links.length },
    ] as { key: Tab; label: string; count: number }[]
  ).filter((t) => t.count > 0);

  const [tab, setTab] = useState<Tab>(tabs[0]?.key ?? "toc");
  const [active, setActive] = useState("");

  // Подсветка текущей главы. Верхняя граница опущена под липкую шапку
  // издания, нижняя поднята почти к ней же, чтобы активной считалась та
  // глава, которую человек читает, а не следующая.
  useEffect(() => {
    if (headings.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const shown = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (shown[0]) setActive(shown[0].target.id);
      },
      { rootMargin: "-80px 0px -68% 0px" }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [headings]);

  if (tabs.length === 0) return null;

  return (
    <aside className="nm-rail">
      <div className="nm-rail-in">
        <div className="nm-rail-tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              aria-pressed={tab === t.key}
              onClick={() => setTab(t.key)}
              className={tab === t.key ? "is-on" : ""}
            >
              {t.label} <i>{t.count}</i>
            </button>
          ))}
        </div>

        {tab === "toc" && (
          <nav className="nm-toc">
            {headings.map((h) => (
              <a
                key={h.id}
                href={`#${h.id}`}
                className={`${h.level === 3 ? "is-sub" : ""} ${active === h.id ? "is-here" : ""}`}
              >
                {h.text}
              </a>
            ))}
          </nav>
        )}

        {tab === "figs" && (
          <div className="nm-rail-figs">
            {figures.map((f) => (
              <a key={f.id} href={`#${f.id}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.src} alt="" loading="lazy" />
                <span>
                  <b>{ru ? `Илл. ${f.index}` : `Fig. ${f.index}`}</b>
                  {f.alt && <em>{f.alt}</em>}
                </span>
              </a>
            ))}
          </div>
        )}

        {tab === "links" && (
          <ol className="nm-rail-links">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.text}
                </a>
                <span>{l.host}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </aside>
  );
}
