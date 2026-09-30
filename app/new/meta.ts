import type { Metadata } from "next";

/* Заголовок вкладки, описание и превью ссылки для страниц макета.

   Одна функция на все страницы, чтобы у каждой были одни и те же поля и
   ни одна не осталась с чужими. Пока их не было, страницы /new наследовали
   от корневого layout сайта описание главной, её превью «строю, пишу,
   говорю» и канонический адрес главной: ссылка на «Обо мне» в мессенджере
   выглядела как ссылка на главную.

   Тексты описаний на страницах берутся из тех же строк, что стоят на самой
   странице (strings.ts, lib/rubrics.ts, lib/show.ts, demos/list.ts), ничего
   не пишется отдельно.

   Адреса в каноническом и в og:url заданы как "./": Next достраивает их из
   адреса страницы (lib/metadata/resolvers/resolve-url.js, resolveRelativeUrl).
   Сейчас это /new/about, после переезда макета на главную будет /about, и
   переписывать ничего не придётся.

   Картинки превью в объекте не задаются: у главной и веток они лежат рядом
   со страницей файлами opengraph-image.tsx, Next подставляет их сам.

   robots: noindex, пока макет живёт рядом с живым сайтом. При переезде
   убрать строку robots здесь, в layout.tsx и в статье. */

export const SITE_NAME = "Jasur Akhmadaliev";

/* RSS журнала: корневой layout ставит ссылку на ленту на каждой странице,
   а объект alternates здесь заменяет корневой целиком. Без этой строки
   страницы макета потеряли бы ссылку на ленту. */
export const RSS = {
  "application/rss+xml": [{ url: "/feed.xml", title: "Jasur / Log" }],
};

export function pageMeta({
  title,
  description,
  lang = "ru",
}: {
  /* Полный заголовок вкладки, уже с именем или названием издания. */
  title: string;
  description: string;
  lang?: "ru" | "en";
}): Metadata {
  return {
    title: { absolute: title },
    description,
    robots: { index: false, follow: false },
    alternates: { canonical: "./", types: RSS },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: lang === "ru" ? "ru_RU" : "en_US",
      url: "./",
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
