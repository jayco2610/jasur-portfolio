import type { Metadata } from "next";
import "./new.css";
import { unbounded, onest } from "./fonts";

export const metadata: Metadata = {
  title: "Макет новой главной",
  description: "Локальный макет для просмотра. Не продакшен.",
  // Макет не должен попасть в поиск: он живёт рядом с живым сайтом
  // и в выдаче выглядел бы как второй, сломанный вариант главной.
  robots: { index: false, follow: false },
};

/* Корневой layout сайта оборачивает каждую страницу своей шапкой, подвалом,
   JasurGPT, баннером согласия и пульсом. Убрать их можно только на уровне
   разметки: app/layout.tsx общий для всех маршрутов и трогать его нельзя.

   Поэтому на маршруте /new всё, что лежит в body и не является <main>,
   прячется. Стиль отрисовывается на сервере вместе со страницей, то есть
   вспышки живой шапки перед гидрацией не будет, а при уходе с /new тег
   удаляется вместе с layout и сайт возвращается к обычному виду.

   nextjs-portal не трогаем: это оверлей ошибок в режиме разработки,
   спрятав его, мы перестали бы видеть собственные ошибки. */
const isolate = `
body > *:not(main):not(nextjs-portal) { display: none !important; }
body { background: #f9f9f7 !important; }
`;

export default function NewLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: isolate }} />
      <div
        id="nm-root"
        className={`nm ${unbounded.variable} ${onest.variable}`}
      >
        {children}
      </div>
    </>
  );
}
