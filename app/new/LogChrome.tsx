"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { RUBRICS, rubricName, MAGAZINE_NAME } from "@/lib/rubrics";

/* Шапка издания. Стоит на списке Log и на странице подкаста: подкаст это
   часть того же издания, а не отдельный раздел сайта.

   Рубрики фильтруют список на месте, поэтому на самом Log это кнопки. На
   подкасте фильтровать нечего: обработчик не передаётся, и те же пункты
   рендерятся ссылками обратно на список. Вид у них при этом один и тот же. */
export default function LogChrome({
  activeRubric,
  onRubricChange,
}: {
  activeRubric: string | null;
  onRubricChange?: (rubric: string | null) => void;
}) {
  const { lang, toggle } = useLanguage();
  const ru = lang === "ru";
  const name = MAGAZINE_NAME[lang];

  function switchLang() {
    toggle();
  }

  const items: { key: string | null; label: string }[] = [
    { key: null, label: ru ? "Всё" : "All" },
    ...RUBRICS.map((r) => ({ key: r.key, label: rubricName(r.key, lang) })),
  ];

  return (
    <div className="nm-log-head">
      <div className="nm-wrap nm-log-head-in">
        {/* Логотип издания: косая черта */}
        <div className="nm-log-logo" aria-label={name}>
          /
        </div>

        {/* Навигация по рубрикам */}
        <nav className="nm-log-nav">
          {items.map((it) => {
            const on = activeRubric === it.key;
            const cls = `nm-log-nav-btn${on ? " is-on" : ""}`;
            return onRubricChange ? (
              <button
                key={it.key ?? "all"}
                type="button"
                className={cls}
                onClick={() => onRubricChange(it.key)}
                aria-pressed={on}
              >
                {it.label}
              </button>
            ) : (
              <Link key={it.key ?? "all"} href="/new/log" className={cls}>
                {it.label}
              </Link>
            );
          })}
          <Link
            href="/new/podcast"
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
