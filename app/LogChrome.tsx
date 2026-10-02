"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage, type Lang } from "@/context/LanguageContext";
import { RUBRICS, rubricName, MAGAZINE_NAME } from "@/lib/rubrics";

/* Что шапке нужно знать, когда она стоит над статьёй или выпуском подкаста.
   На списке, в рубрике и на странице подкаста проп не передаётся, и шапка
   говорит на языке, выбранном на сайте. */
export type ArticleContext = {
  /* Язык самой статьи. Над статьёй шапка говорит на её языке и отмечает
     его в переключателе: переключатель здесь про текст, а не про интерфейс. */
  lang: Lang;
  /* Рубрика статьи: подсвечивается в строке рубрик. У выпуска подкаста
     рубрики нет, там подсвечен пункт «Подкаст» (по адресу). */
  rubric?: string;
  /* Адрес парной статьи на другом языке. Нет пары — переключатель неактивен. */
  twinHref?: string;
};

/* Шапка издания. Стоит на списке Log, на странице рубрики, на странице
   подкаста и над каждой статьёй: подкаст и статьи это части того же
   издания, а не отдельные разделы сайта.

   Рубрики это ссылки на отдельные адреса /log/tema/[ключ], как на живом
   сайте (components/magazine/MagChrome.tsx). Раньше это были кнопки,
   фильтровавшие список на месте: адрес не менялся, перехода не было, ссылку
   на тему нельзя было никому отправить, и на нажатие это не походило вовсе.

   Подсветка берётся из адреса, а не из состояния в памяти: адрес и есть
   состояние. Поэтому при возврате браузером назад подсветка не может
   разойтись с тем, что на странице.

   Исключение одно: страница статьи. Её адрес /blog/[slug] ни с одной
   рубрикой не совпадает, поэтому рубрику статьи шапке сообщает сама
   страница через проп article. Проверка по адресу при этом остаётся как
   была, проп только добавляет подсветку и не отменяет её. aria-current
   ставится по-прежнему только по адресу: статья не является страницей
   рубрики, читалка экрана не должна говорить «текущая страница: Процесс».

   Переключатель языка над статьёй работает как на живой странице статьи
   (components/magazine/MagChrome.tsx): если у текста есть перевод, он
   уводит на перевод и заодно переключает язык интерфейса. Одно отличие:
   живая шапка переключает язык вслепую (toggle), и если человек пришёл
   по ссылке на английскую статью с русским интерфейсом, отметка в
   переключателе и язык текста расходились навсегда. Здесь отметка стоит
   на языке статьи, а при переходе интерфейс ставится ровно в язык перевода.
   Если перевода нет, переключатель неактивен и никуда не ведёт.

   Выпуск подкаста ведёт себя как статья без перевода: выпуски выходят на
   одном языке, пары у них не бывает. Шапка над выпуском говорит на его
   языке, переключатель неактивен, а если язык сайта другой, под заголовком
   выпуска стоит та же пометка, что у статьи без перевода.

   На всех остальных страницах издания переключатель это кнопка: меняет язык
   всего сайта, адрес остаётся тем же, а страница перестраивается на
   выбранный язык (списки статей, подписи, рубрики). */
export default function LogChrome({ article }: { article?: ArticleContext } = {}) {
  const { lang: uiLang, toggle } = useLanguage();
  const pathname = usePathname();
  const lang = article?.lang ?? uiLang;
  const ru = lang === "ru";
  const name = MAGAZINE_NAME[lang];

  const cls = (on: boolean) => `nm-log-nav-btn${on ? " is-on" : ""}`;

  const langMarks = (
    <>
      <span className={ru ? "is-on" : ""}>RU</span>
      <i aria-hidden="true">/</i>
      <span className={ru ? "" : "is-on"}>EN</span>
    </>
  );

  let langSwitch;
  if (!article) {
    langSwitch = (
      <button
        type="button"
        onClick={toggle}
        className="nm-log-lang"
        aria-label={ru ? "Switch to English" : "Переключить на русский"}
      >
        {langMarks}
      </button>
    );
  } else if (article.twinHref) {
    const target: Lang = article.lang === "ru" ? "en" : "ru";
    langSwitch = (
      <Link
        href={article.twinHref}
        className="nm-log-lang"
        hrefLang={target}
        aria-label={ru ? "Read in English" : "Читать по-русски"}
        // Интерфейс идёт следом за текстом: на английской статье и списки,
        // и подписи дальше будут английскими.
        onClick={() => {
          if (uiLang !== target) toggle();
        }}
      >
        {langMarks}
      </Link>
    );
  } else {
    langSwitch = (
      <span
        className="nm-log-lang is-off"
        aria-disabled="true"
        title={ru ? "Перевода пока нет" : "No translation yet"}
      >
        {langMarks}
      </span>
    );
  }

  return (
    // lang: над английской статьёй шапка говорит по-английски, даже если
    // интерфейс сайта русский, и читалка экрана должна читать её английским
    // голосом. Атрибут у <html> идёт за языком интерфейса, а не статьи.
    <div className="nm-log-head" lang={lang}>
      <div className="nm-wrap nm-log-head-in">
        {/* Логотип издания: косая черта */}
        <div className="nm-log-logo" aria-label={name}>
          /
        </div>

        {/* Навигация по рубрикам */}
        <nav className="nm-log-nav">
          <Link
            href="/log"
            className={cls(pathname === "/log")}
            aria-current={pathname === "/log" ? "page" : undefined}
          >
            {ru ? "Всё" : "All"}
          </Link>
          {RUBRICS.map((r) => {
            const href = `/log/tema/${r.key}`;
            const here = pathname === href;
            const on = here || article?.rubric === r.key;
            return (
              <Link
                key={r.key}
                href={href}
                className={cls(on)}
                aria-current={here ? "page" : undefined}
              >
                {rubricName(r.key, lang)}
              </Link>
            );
          })}
          {/* Подсвечен и на странице подкаста, и над каждым выпуском:
              выпуск это часть подкаста, как статья часть рубрики. Отметка
              «текущая страница» только на самой странице подкаста. */}
          <Link
            href="/podcast"
            className={`${cls(pathname === "/podcast" || pathname.startsWith("/podcast/"))} nm-log-nav-pod`}
            aria-current={pathname === "/podcast" ? "page" : undefined}
          >
            {ru ? "Подкаст" : "Podcast"}
          </Link>
        </nav>

        {/* Переключатель языка и выход */}
        <div className="nm-log-head-right">
          {langSwitch}
          <Link href="/" className="nm-log-exit">
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
