import "./demos.css";
import "./demos-color.css";
import { VariantRoot } from "./variant";

/* Каталог демо и шесть демо в новом оформлении: перенос app/demos.

   Заголовок вкладки и описание у каждой страницы раздела свои: у каталога
   в demos/page.tsx, у демо в их page.tsx (собираются из demos/list.ts).

   Ветка demos-color: VariantRoot включает цветной вариант по ?v= и рисует
   сверху переключатель вариантов (см. variant.tsx). */

export default function DemosLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <VariantRoot>{children}</VariantRoot>;
}
