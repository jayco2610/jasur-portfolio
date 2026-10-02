import type { Metadata } from "next";
import "./globals.css";
import "./new.css";
import "./gpt/gpt.css";
import { unbounded, onest } from "./fonts";
import { LangAttr } from "./Lang";
import { HOME } from "./strings";
import { pageMeta, SITE, SITE_NAME } from "./meta";
import { GptProvider } from "./gpt/Gpt";
import { LanguageProvider } from "@/context/LanguageContext";
import Consent from "@/components/Consent";
import Pulse from "@/components/Pulse";

/* Корневой layout сайта. До 2 октября 2026 новый дизайн жил макетом на /new
   со своим layout внутри старого; теперь он и есть сайт.

   metadataBase обязателен: без него Next достраивает адреса превью из
   адреса конкретной выкладки Vercel, и в мессенджерах ссылка уходила бы
   на временный адрес. Заголовок и описание здесь запасные, на случай
   страницы, которая не задала своих (у каждой страницы сайта свои, см.
   meta.ts).

   Порядок стилей тот же, что был у макета: сначала globals.css (Tailwind
   и стили старых страниц, на нём держатся классы body и main ниже и
   страница /stats), потом new.css и gpt.css, чтобы правила нового сайта
   шли в каскаде позже.

   Разметка body > main > #nm-root повторяет ту, внутри которой макет
   рисовался на /new: страницы рассчитаны на готовый <main> (второй они не
   вкладывают) и на обёртку .nm, где заданы шрифты, цвета и переменные.

   Баннер согласия стоит внутри .nm, чтобы говорить шрифтом и цветами
   сайта (см. components/Consent.tsx). Pulse ничего не рисует, ему место
   неважно. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  ...pageMeta({ title: SITE_NAME, description: HOME.ru.sub }),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <LangAttr />
          <main className="flex-1">
            <div id="nm-root" className={`nm ${unbounded.variable} ${onest.variable}`}>
              <GptProvider>{children}</GptProvider>
              <Consent />
            </div>
          </main>
          <Pulse />
        </LanguageProvider>
      </body>
    </html>
  );
}
