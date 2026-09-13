"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { RUBRICS, rubricName, MAGAZINE_NAME } from "@/lib/rubrics";

// Обвязка журнала: полоса возврата в портфолио, чёрная липкая шапка
// с рубриками и вертикальные подписи по краям полосы.
export default function MagChrome({
  activeRubric,
  rightLabel,
  section,
  twinHref,
}: {
  activeRubric?: string;
  rightLabel?: string;
  // Подкаст стоит рядом с рубриками, но рубрикой не является:
  // это другой вид материала, а не другая тема.
  section?: "podcast";
  // Адрес этого же текста на другом языке. Если он есть, переключатель
  // не просто меняет интерфейс, а уводит читателя на перевод.
  twinHref?: string;
}) {
  const { lang, toggle } = useLanguage();
  const router = useRouter();
  const ru = lang === "ru";
  const name = MAGAZINE_NAME[lang];

  function switchLang() {
    toggle();
    if (twinHref) router.push(twinHref);
  }

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
          {/* Косая черта из названия и есть знак издания: один символ,
              одинаковый на обоих языках. */}
          <Link href="/writing" className="mag-logo" aria-label={name}>
            /
          </Link>
          <nav className="mag-nav">
            <Link href="/writing" data-on={!activeRubric && !section}>
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
            <Link href="/podcast" data-on={section === "podcast"} className="mag-nav-pod">
              {ru ? "Подкаст" : "Podcast"}
            </Link>
          </nav>
          {/* Верхняя полоса уезжает при скролле, поэтому выход из журнала
              и смена языка дублируются в липкой шапке. */}
          <div className="mag-head-right">
            <button type="button" onClick={switchLang} className="mag-lang" aria-label="Toggle language">
              <span className={ru ? "is-on" : ""}>RU</span>
              <i aria-hidden="true">/</i>
              <span className={ru ? "" : "is-on"}>EN</span>
            </button>
            <Link href="/" className="mag-exit">
              <span aria-hidden="true">←</span>
              <span className="mag-exit-full">{ru ? "Портфолио" : "Portfolio"}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mag-vl">{name}</div>
      <div className="mag-vr">{rightLabel ?? (ru ? "Продукт · AI" : "Product · AI")}</div>
    </>
  );
}
