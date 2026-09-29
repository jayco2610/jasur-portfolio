import type { Metadata } from "next";
import "./demos.css";

/* Каталог демо и шесть демо в новом оформлении: перенос app/demos.

   Как и на старом сайте, заголовок вкладки задаётся здесь один на весь
   раздел: у старых страниц демо своих заголовков нет. */
export const metadata: Metadata = {
  title: "Демо · макет",
  robots: { index: false, follow: false },
};

export default function DemosLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
