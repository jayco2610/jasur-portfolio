import "./demos.css";
import "./demos-color.css";

/* Каталог демо и шесть демо в новом оформлении: перенос app/demos.

   Заголовок вкладки и описание у каждой страницы раздела свои: у каталога
   в demos/page.tsx, у демо в их page.tsx (собираются из demos/list.ts).

   Обёртка .nm-dmv[data-palette] включает цвет демо (demos-color.css,
   вариант «Свой продукт у каждого демо»). Она в разметке с сервера, поэтому
   цвет стоит с первого кадра. В раскладке обёртка не участвует
   (display: contents). */

export default function DemosLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="nm-dmv" data-palette="product">
      {children}
    </div>
  );
}
