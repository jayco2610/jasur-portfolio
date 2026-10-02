"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

/* Общая обёртка каждого демо: возврат в каталог, заголовок, подводка,
   выделенная мысль, подсказка, сам интерфейс, оговорка про данные.

   Перенос components/demos/DemoShell.tsx: те же пропсы, те же блоки в том же
   порядке, те же тексты. Своя копия, а не импорт старой, по двум причинам:
   старая ведёт «Все демо» на /demos, то есть в старый дизайн, и собрана из
   классов старого сайта. Правка разметки была единственным способом сменить
   и то и другое, а старый файл трогать нельзя.

   Выделение в pitch раньше заливалось чёрной плашкой при прокрутке
   (components/Mark.tsx). В макете анимаций в обвязке нет, плашка стоит сразу. */
export default function DemoShell({
  title,
  subtitle,
  pitch,
  hint,
  footer,
  children,
}: {
  title: { en: string; ru: string };
  subtitle: { en: string; ru: string };
  pitch?: { en: string; ru: string };
  hint?: { en: string; ru: string };
  // null прячет стандартную оговорку про бизнес-демо (у страниц своих
  // продуктов она своя, внутри демо).
  footer?: { en: string; ru: string } | null;
  children: React.ReactNode;
}) {
  const { lang } = useLanguage();
  /* Имя демо из адреса (у /demos/fraud это fraud). По нему у каждого демо
     своя палитра (demos-color.css). Адрес сервер знает при сборке, поэтому
     атрибут есть уже в разметке с сервера. */
  const demo = usePathname().split("/").pop();
  return (
    <div className="nm-wrap nm-dm" data-demo={demo}>
      <Link href="/demos" className="nm-dm-back">
        ← {lang === "en" ? "All demos" : "Все демо"}
      </Link>

      <p className="nm-dm-kicker">{lang === "en" ? "Live demo" : "Живое демо"}</p>
      <h1 className="nm-h1-p">{title[lang]}</h1>
      <div className="nm-lead">
        <p>{subtitle[lang]}</p>
      </div>

      {pitch && (
        <p className="nm-dm-pitch">
          <mark>{pitch[lang]}</mark>
        </p>
      )}
      {hint && <p className="nm-dm-hint">▶ {hint[lang]}</p>}

      <div className="nm-dm-stage">{children}</div>

      {footer !== null && (
        <p className="nm-dm-foot">
          {footer
            ? footer[lang]
            : lang === "en"
            ? "Simulated data. On a real project this connects to the POS software (iiko), SBP payments, and the venue's customer base."
            : "Данные симулированы. На реальном проекте подключается кассовое ПО (iiko), оплата через СБП и база клиентов заведения."}
        </p>
      )}
    </div>
  );
}
