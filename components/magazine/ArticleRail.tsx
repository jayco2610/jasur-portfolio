"use client";

import { useEffect, useState } from "react";
import type { Heading, Figure, SourceLink } from "@/lib/blog";

type Tab = "toc" | "figs" | "links";

export default function ArticleRail({
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

  // Подсветка текущей главы. Нижняя граница поднята почти под шапку,
  // чтобы активной считалась та глава, которую человек читает, а не следующая.
  useEffect(() => {
    if (headings.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const shown = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (shown[0]) setActive(shown[0].target.id);
      },
      { rootMargin: "-96px 0px -68% 0px" }
    );
    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [headings]);

  if (tabs.length === 0) return null;

  return (
    <aside className="mag-rail">
      <div className="mag-rail-in">
        <div className="mag-rail-tabs">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={tab === t.key ? "is-on" : ""}
            >
              {t.label} <i>{t.count}</i>
            </button>
          ))}
        </div>

        {tab === "toc" && (
          <nav className="mag-toc">
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
          <div className="mag-rail-figs">
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
          <ol className="mag-rail-links">
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
