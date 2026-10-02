import type { Metadata } from "next";

/* Заголовок вкладки, описание и превью ссылки для страниц сайта.

   Одна функция на все страницы, чтобы у каждой были одни и те же поля и
   ни одна не осталась с чужими. Пока их не было, страницы наследовали
   от корневого layout описание главной, её превью и канонический адрес
   главной: ссылка на «Обо мне» в мессенджере выглядела как ссылка на
   главную.

   Тексты описаний на страницах берутся из тех же строк, что стоят на самой
   странице (strings.ts, lib/rubrics.ts, lib/show.ts, demos/list.ts), ничего
   не пишется отдельно.

   Адреса в каноническом и в og:url заданы как "./": Next достраивает их из
   адреса страницы (lib/metadata/resolvers/resolve-url.js, resolveRelativeUrl).
   Так они пережили переезд макета с /new на обычные адреса 2 октября 2026
   без единой правки.

   Картинки превью в объекте не задаются: у главной и веток они лежат рядом
   со страницей файлами opengraph-image.tsx, Next подставляет их сам.

   Строки robots здесь больше нет: пока сайт жил макетом на /new, она
   закрывала его от поиска. Закрытой осталась одна страница, исходник PDF
   «Услуги» (uslugi/[lang]/page.tsx), robots стоит прямо в ней. */

/* Адрес сайта. Прописан и в других файлах (статья, выпуск, карта сайта,
   обе ленты, исходник PDF): при переезде на свой домен менять все разом. */
export const SITE = "https://jasur-portfolio-pied.vercel.app";

export const SITE_NAME = "Jasur Akhmadaliev";

/* RSS журнала. Объект alternates у страницы заменяет корневой целиком,
   поэтому ссылка на ленту повторяется в каждом: без неё страница потеряла
   бы ссылку на ленту. */
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
