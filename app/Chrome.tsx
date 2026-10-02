"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { CHROME, type Lang, type NavKey } from "./strings";

/* Общая обвязка сайта: шапка и подвал.

   Вынесено из page.tsx в отдельный файл, потому что страниц несколько, а не
   одна. Пока разметка шапки лежала внутри главной, любая правка отступа или
   ссылки расходилась бы по всем файлам, и блог уже ловил ровно это: разные
   высоты и форматы в двух списках, собранных по отдельности.

   Оба компонента клиентские: шапка держит переключатель языка, подвал
   говорит на выбранном языке. Язык берётся из общего контекста
   (context/LanguageContext.tsx), того же, на котором работают старые
   страницы, демо и статьи. Липкость по-прежнему держит CSS. */

const NAV: { key: NavKey; href: string }[] = [
  { key: "log", href: "/log" },
  { key: "works", href: "/works" },
  { key: "workshop", href: "/workshop" },
  { key: "about", href: "/about" },
];

/* Пока сайт жил макетом на /new, над шапкой стояла служебная полоса
   «Макет · не продакшен», и шапка прилипала под ней. 2 октября 2026 полоса
   убрана вместе с адресом /new, шапка прилипает к верху окна.

   here это ключ ветки, а не её подпись: подпись на двух языках разная, и
   сравнение по русскому слову перестало бы подсвечивать пункт на английском. */
export function NewHeader({ here }: { here?: NavKey }) {
  const { lang, toggle } = useLanguage();
  const s = CHROME[lang];
  const ru = lang === "ru";

  return (
    <header className="nm-head">
      <div className="nm-wrap nm-head-in">
        <Link className="nm-logo" href="/">
          Jasur Akhmadaliev
        </Link>
        <nav className="nm-nav">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className={here === n.key ? "is-here" : undefined}
              aria-current={here === n.key ? "page" : undefined}
            >
              {s.nav[n.key]}
            </a>
          ))}
        </nav>
        {/* Кнопка, а не ссылка: адрес не меняется, меняется язык всего
            сайта. Выбор запоминается и действует на всех страницах. */}
        <button
          type="button"
          className="nm-lang"
          onClick={toggle}
          aria-label={s.langAction}
        >
          <span className={ru ? "is-on" : "is-off"}>RU</span>
          <span className={ru ? "is-off" : "is-on"}>EN</span>
        </button>
      </div>
    </header>
  );
}

/* Блок 5 по ТЗ: контакты разделены по действию, формы нет, в подвале
   год и имя. Один и тот же на всех страницах.

   Строка «почта, LinkedIn, GitHub» мелко и без выделения стоит здесь с
   26 сентября; данные те же, что на старой странице резюме.

   Язык подвала по умолчанию тот, что выбран на сайте. Страница статьи
   передаёт язык самой статьи: под английским текстом подвал английский, что
   бы ни было выбрано в переключателе. */
export function NewFooter({ lang }: { lang?: Lang } = {}) {
  const { lang: uiLang } = useLanguage();
  const s = CHROME[lang ?? uiLang];
  return (
    <section className="nm-wrap nm-contacts">
      <h2 className="nm-h2">{s.write}</h2>

      <div className="nm-cline">
        <span className="nm-cline-k">{s.message}</span>
        <a className="nm-cline-v nm-ink-link" href="https://t.me/biznesmind">
          @biznesmind
        </a>
      </div>

      <div className="nm-cline">
        <span className="nm-cline-k">{s.read}</span>
        <a className="nm-cline-v" href="https://t.me/head_of_ceo">
          @head_of_ceo
        </a>
      </div>

      <p className="nm-small">
        <a href="mailto:jasurakhmadaliev283@gmail.com">{s.email}</a>
        <a href="https://www.linkedin.com/in/jasur-akhmadaliev">LinkedIn</a>
        <a href="https://github.com/jayco2610">GitHub</a>
      </p>

      <footer className="nm-foot">
        <span>2026</span>
        <span>Jasur Akhmadaliev</span>
      </footer>
    </section>
  );
}
