"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { RUBRICS, rubricName, MAGAZINE_NAME } from "@/lib/rubrics";

/* Шапка издания. Стоит на списке Log, на странице рубрики и на странице
   подкаста: подкаст это часть того же издания, а не отдельный раздел сайта.

   Рубрики это ссылки на отдельные адреса /new/log/tema/[ключ], как на живом
   сайте (components/magazine/MagChrome.tsx). Раньше это были кнопки,
   фильтровавшие список на месте: адрес не менялся, перехода не было, ссылку
   на тему нельзя было никому отправить, и на нажатие это не походило вовсе.

   Подсветка берётся из адреса, а не из состояния в памяти: адрес и есть
   состояние. Поэтому при возврате браузером назад подсветка не может
   разойтись с тем, что на странице, и шапке больше не нужны пропсы. */
export default function LogChrome() {
  const { lang, toggle } = useLanguage();
  const pathname = usePathname();
  const ru = lang === "ru";
  const name = MAGAZINE_NAME[lang];

  const cls = (on: boolean) => `nm-log-nav-btn${on ? " is-on" : ""}`;

  return (
    <div className="nm-log-head">
      <div className="nm-wrap nm-log-head-in">
        {/* Логотип издания: косая черта */}
        <div className="nm-log-logo" aria-label={name}>
          /
        </div>

        {/* Навигация по рубрикам */}
        <nav className="nm-log-nav">
          <Link
            href="/new/log"
            className={cls(pathname === "/new/log")}
            aria-current={pathname === "/new/log" ? "page" : undefined}
          >
            {ru ? "Всё" : "All"}
          </Link>
          {RUBRICS.map((r) => {
            const href = `/new/log/tema/${r.key}`;
            const on = pathname === href;
            return (
              <Link
                key={r.key}
                href={href}
                className={cls(on)}
                aria-current={on ? "page" : undefined}
              >
                {rubricName(r.key, lang)}
              </Link>
            );
          })}
          <Link
            href="/new/podcast"
            className={`${cls(pathname === "/new/podcast")} nm-log-nav-pod`}
            aria-current={pathname === "/new/podcast" ? "page" : undefined}
          >
            {ru ? "Подкаст" : "Podcast"}
          </Link>
        </nav>

        {/* Переключатель языка и выход */}
        <div className="nm-log-head-right">
          <button
            type="button"
            onClick={toggle}
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
