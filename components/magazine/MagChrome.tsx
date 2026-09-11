"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { RUBRICS, rubricName, MAGAZINE_NAME } from "@/lib/rubrics";

// Обвязка журнала: полоса возврата в портфолио, чёрная липкая шапка
// с рубриками и вертикальные подписи по краям полосы.
export default function MagChrome({
  activeRubric,
  rightLabel,
}: {
  activeRubric?: string;
  rightLabel?: string;
}) {
  const { lang } = useLanguage();
  const ru = lang === "ru";
  const name = MAGAZINE_NAME[lang];

  return (
    <>
      <div className="mag-back">
        <div className="mag-w mag-back-in">
          <Link href="/" className="mag-back-link">
            <span aria-hidden="true">←</span>
            {ru ? "Вернуться в портфолио" : "Back to portfolio"}
          </Link>
          <span className="tiny">
            {name} · {ru ? "блог Жасура Ахмадалиева" : "a blog by Jasur Akhmadaliev"}
          </span>
        </div>
      </div>

      <div className="mag-head">
        <div className="mag-w mag-head-in">
          <Link href="/writing" className="mag-logo" aria-label={name}>
            {ru ? "Б" : "N"}
          </Link>
          <nav className="mag-nav">
            <Link href="/writing" data-on={!activeRubric}>
              {ru ? "Всё" : "All"}
            </Link>
            {RUBRICS.map((r) => (
              <Link
                key={r.key}
                href={`/blog/tema/${r.key}`}
                data-on={activeRubric === r.key}
              >
                {rubricName(r.key, lang)}
              </Link>
            ))}
          </nav>
          {/* Верхняя полоса уезжает при скролле, поэтому выход из журнала
              дублируем в липкой шапке. */}
          <Link href="/" className="mag-exit">
            <span aria-hidden="true">←</span>
            <span className="mag-exit-full">{ru ? "Портфолио" : "Portfolio"}</span>
          </Link>
        </div>
      </div>

      <div className="mag-vl">{name}</div>
      <div className="mag-vr">{rightLabel ?? (ru ? "Продукт · AI" : "Product · AI")}</div>
    </>
  );
}
