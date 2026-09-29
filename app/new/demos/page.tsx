import { NewHeader, NewFooter } from "../Chrome";
import Catalog from "./Catalog";

/* Каталог демо в макете: /new/demos. Раньше «Работы» вели на /demos
   старого сайта, и человек выпадал из нового дизайна.

   Отдельного пункта «Демо» в меню макета нет, демо это часть работ,
   поэтому в шапке подсвечены «Работы». Страница серверная, клиентский
   только сам каталог: он переключает язык подписей. */
export default function NewDemos() {
  return (
    <>
      <NewHeader here="Работы" />

      <div>
        <Catalog />
        <NewFooter />
      </div>
    </>
  );
}
