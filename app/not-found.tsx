import Link from "next/link";
import { NewHeader, NewFooter } from "./Chrome";
import { ByLang } from "./Lang";
import type { Lang } from "./strings";

/* Страница «не найдено». Пока у сайта был старый корневой layout, на 404
   стояли его шапка и подвал, и из тупика можно было уйти. После переезда
   макета на главную (2 октября 2026) без этого файла Next рисовал свою
   заглушку по-английски, без шапки и без единой ссылки.

   Шапка, подвал и классы те же, что у остальных страниц. Статус 404 и
   noindex Next ставит сам. Надписи только здесь: страница одна, и класть
   их в strings.ts ради трёх строк незачем. */

const TEXT = {
  ru: {
    h1: "Такой страницы нет",
    lead: "Адрес мог устареть или в нём опечатка.",
    home: "На главную",
    log: "Все материалы в Log",
  },
  en: {
    h1: "No such page",
    lead: "The address may be out of date, or it has a typo.",
    home: "Home",
    log: "All pieces in Log",
  },
};

function Body({ lang }: { lang: Lang }) {
  const s = TEXT[lang];
  return (
    <section className="nm-wrap nm-ptop">
      <h1 className="nm-h1-p">{s.h1}</h1>
      <div className="nm-lead">
        <p>{s.lead}</p>
      </div>
      <p className="nm-more nm-more-nf">
        <Link href="/">{s.home}</Link>
        <Link href="/log">{s.log}</Link>
      </p>
    </section>
  );
}

export default function NotFound() {
  return (
    <>
      <NewHeader />
      <div>
        <ByLang ru={<Body lang="ru" />} en={<Body lang="en" />} />
        <NewFooter />
      </div>
    </>
  );
}
