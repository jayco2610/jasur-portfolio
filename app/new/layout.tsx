import type { Metadata } from "next";
import "./new.css";
import "./gpt/gpt.css";
import { unbounded, onest } from "./fonts";
import { LangAttr } from "./Lang";
import { HOME } from "./strings";
import { pageMeta, SITE_NAME } from "./meta";
import { GptProvider } from "./gpt/Gpt";

/* Запасные значения на случай страницы, которая не задала своих: имя вместо
   «Макет новой главной» и описание главной. У каждой страницы макета свои
   заголовок и описание (см. meta.ts).

   Макет не должен попасть в поиск: он живёт рядом с живым сайтом и в выдаче
   выглядел бы как второй, сломанный вариант главной. noindex стоит в
   pageMeta. */
export const metadata: Metadata = pageMeta({
  title: SITE_NAME,
  description: HOME.ru.sub,
});

/* Корневой layout сайта оборачивает каждую страницу своей шапкой, подвалом,
   JasurGPT, баннером согласия и пульсом. Убрать их можно только на уровне
   разметки: app/layout.tsx общий для всех маршрутов и трогать его нельзя.

   Поэтому на маршруте /new всё, что лежит в body и не является <main>,
   прячется. Стиль отрисовывается на сервере вместе со страницей, то есть
   вспышки живой шапки перед гидрацией не будет, а при уходе с /new тег
   удаляется вместе с layout и сайт возвращается к обычному виду.

   nextjs-portal не трогаем: это оверлей ошибок в режиме разработки,
   спрятав его, мы перестали бы видеть собственные ошибки.

   Третья строка чинит липкие элементы. globals.css ставит html и body
   overflow-x: hidden, чтобы страница не ездила вбок. У body от этого
   появляется собственная прокрутка (браузер делает overflow-y: auto), и
   всё position: sticky внутри прилипает к body, который никогда не
   прокручивается, а не к окну. Поэтому шапки макета (.nm-lab, .nm-head,
   .nm-log-head) и полка статьи уезжали вместе со страницей, хотя задуманы
   липкими. На живом сайте ровно та же поломка (шапка журнала и полка
   статьи тоже не липнут), но globals.css общий, и чинить его отсюда нельзя.
   overflow-x: clip режет вбок так же, как hidden, но собственной прокрутки
   не создаёт. Боковую прокрутку всё так же держит html.

   Старый JasurGPT (components/JasurGPT.tsx) тоже лежит вне <main> и
   прячется этим же правилом. У макета свой JasurGPT: GptProvider рисует
   всплывающую кнопку на каждой странице и окно чата «Титр» (папка gpt/). */
const isolate = `
body > *:not(main):not(nextjs-portal) { display: none !important; }
body { background: #f9f9f7 !important; }
body { overflow-x: clip !important; overflow-y: visible !important; }
`;

export default function NewLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: isolate }} />
      <LangAttr />
      <div
        id="nm-root"
        className={`nm ${unbounded.variable} ${onest.variable}`}
      >
        <GptProvider>{children}</GptProvider>
      </div>
    </>
  );
}
