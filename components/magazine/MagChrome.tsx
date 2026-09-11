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
          <Link href="/">
            ← {ru ? "Жасур Ахмадалиев · портфолио" : "Jasur Akhmadaliev · portfolio"}
          </Link>
          <span className="tiny">
            {name} · {ru ? "издание" : "publication"}
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
        </div>
      </div>

      <div className="mag-vl">{name}</div>
      <div className="mag-vr">{rightLabel ?? (ru ? "Продукт · AI" : "Product · AI")}</div>
    </>
  );
}
