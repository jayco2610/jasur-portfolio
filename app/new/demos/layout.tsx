import "./demos.css";

/* Каталог демо и шесть демо в новом оформлении: перенос app/demos.

   Заголовок вкладки и описание у каждой страницы раздела свои: у каталога
   в demos/page.tsx, у демо в их page.tsx (собираются из demos/list.ts). */

export default function DemosLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
