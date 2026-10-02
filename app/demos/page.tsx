import type { Metadata } from "next";
import { NewHeader, NewFooter } from "../Chrome";
import Catalog from "./Catalog";
import { pageMeta, SITE_NAME } from "../meta";
import { t } from "@/lib/translations";

// Описание: подводка каталога, та же строка, что под заголовком страницы.
export const metadata: Metadata = pageMeta({
  title: `${t.ru.demos.label} · ${SITE_NAME}`,
  description: t.ru.demos.intro,
});

/* Каталог демо: /demos. Пока новый дизайн жил макетом на /new, «Работы»
   вели на /demos старого сайта, и человек выпадал из нового дизайна;
   поэтому каталог и шесть демо были перенесены в новое оформление.

   Отдельного пункта «Демо» в меню макета нет, демо это часть работ,
   поэтому в шапке подсвечены «Работы». Страница серверная, клиентский
   только сам каталог: он переключает язык подписей. */
export default function NewDemos() {
  return (
    <>
      <NewHeader here="works" />

      <div>
        <Catalog />
        <NewFooter />
      </div>
    </>
  );
}
