"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { RUBRICS, rubricName, MAGAZINE_NAME } from "@/lib/rubrics";

export default function LogChrome({
  activeRubric,
  onRubricChange,
}: {
  activeRubric: string | null;
  onRubricChange: (rubric: string | null) => void;
}) {
  const { lang, toggle } = useLanguage();
  const ru = lang === "ru";
  const name = MAGAZINE_NAME[lang];

  function switchLang() {
    toggle();
  }

  return (
    <div className="nm-log-head">
      <div className="nm-wrap nm-log-head-in">
        {/* Логотип издания: косая черта */}
        <div className="nm-log-logo" aria-label={name}>
          /
        </div>

        {/* Навигация по рубрикам */}
        <nav className="nm-log-nav">
          <button
            type="button"
            className={`nm-log-nav-btn${activeRubric === null ? " is-on" : ""}`}
            onClick={() => onRubricChange(null)}
            aria-pressed={activeRubric === null}
          >
            {ru ? "Всё" : "All"}
          </button>
          {RUBRICS.map((r) => (
            <button
              key={r.key}
              type="button"
              className={`nm-log-nav-btn${activeRubric === r.key ? " is-on" : ""}`}
              onClick={() => onRubricChange(r.key)}
              aria-pressed={activeRubric === r.key}
            >
              {rubricName(r.key, lang)}
            </button>
          ))}
          <Link
            href="/podcast"
            className={`nm-log-nav-btn nm-log-nav-pod${activeRubric === "podcast" ? " is-on" : ""}`}
          >
            {ru ? "Подкаст" : "Podcast"}
          </Link>
        </nav>

        {/* Переключатель языка и выход */}
        <div className="nm-log-head-right">
          <button
            type="button"
            onClick={switchLang}
            className="nm-log-lang"
            aria-label="Toggle language"
          >
            <span className={ru ? "is-on" : ""}>RU</span>
            <i aria-hidden="true">/</i>
            <span className={ru ? "" : "is-on"}>EN</span>
          </button>
          <Link href="/new" className="nm-log-exit">
            <span aria-hidden="true">←</span>
            <span className="nm-log-exit-full">
              {ru ? "Портфолио" : "Portfolio"}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
