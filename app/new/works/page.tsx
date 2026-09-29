import type { Metadata } from "next";
import Photo from "../Photo";
import { NewHeader, NewFooter } from "../Chrome";
import { ByLang } from "../Lang";
import { WORKS, type Lang, type WorkKey } from "../strings";

export const metadata: Metadata = {
  title: "Работы · макет",
  robots: { index: false, follow: false },
};

/* Ветка 02 по ТЗ. Задача страницы: показать руки, а не продать продукты.

   Названия, стек и адреса взяты из lib/translations.ts (русский блок
   projects.projects) — то есть из того же источника, что живая страница
   /projects. Описания сжаты до одной строки: в карточке по ТЗ четыре элемента
   плюс скриншот, и абзац на пять строк ломает строй сетки.

   Статусов нет: решение Жасура. Метрики стоят внутри строки описания и
   только там, где они действительно есть, отдельного блока под них нет.

   Скриншоты в public/new/works сняты с живых адресов, окно 1600 × 1000,
   первый экран, файл 1200 × 750. JasurGPT снят с главной живого сайта с
   открытым чатом.

   Три карточки ведут в демо внутри макета, и их кадры сняты оттуда же, а не
   со старого дизайна (переснято 29 сентября 2026, то же окно и тот же размер
   файла): каталог (/new/demos) первым экраном, с заголовком и началом
   карточек демо; Mia (/new/demos/mia) и AI Career System (/new/demos/career)
   после прогона сценария, кадр от выделенной мысли до результата. У Mia
   задан первый вопрос, видны найденные фрагменты и ответ в телефоне; у
   Career System пройден весь пайплайн. Пустое демо на картинке не говорит,
   что это за вещь.

   Куда ведёт «Открыть». Демо, Mia и AI Career System открываются в макете
   (/new/demos...), чтобы человек не выпадал в старый дизайн. Mia раньше
   вела на пространство Hugging Face, которое спит; живой ассистент
   по-прежнему открывается кнопкой со страницы демо. JasurGPT раньше вёл на
   jasur.dev, а этот домен не находится (проверено 28 сентября 2026).
   Отдельного адреса у чата нет: он открывается кнопкой в углу любой
   страницы живого сайта, ни параметра в адресе, ни якоря он не слушает.
   Поэтому ссылка ведёт на главную живого сайта, где кнопка есть. В макете
   кнопки нет: layout.tsx прячет всё, что общий layout кладёт вне <main>.

   Тексты карточек на двух языках лежат в strings.ts, здесь только то, что от
   языка не зависит: порядок, скриншот, адрес. Тело собирается дважды, и
   ByLang показывает то, что выбрано в переключателе. */

/* Порядок карточек и то, что от языка не зависит. */
const ORDER: { key: WorkKey; shot: string; href: string }[] = [
  { key: "abcx", shot: "/new/works/abcx.jpg", href: "https://abcx-eight.vercel.app" },
  { key: "expat", shot: "/new/works/expat.jpg", href: "https://expat-roadmap-sea.vercel.app" },
  { key: "career", shot: "/new/works/career.jpg", href: "/new/demos/career" },
  { key: "mia", shot: "/new/works/mia.jpg", href: "/new/demos/mia" },
  { key: "jasurgpt", shot: "/new/works/jasurgpt.jpg", href: "/" },
  { key: "demos", shot: "/new/works/demos.jpg", href: "/new/demos" },
];

function Body({ lang }: { lang: Lang }) {
  const s = WORKS[lang];

  return (
    <>
      <section className="nm-wrap nm-ptop">
        <h1 className="nm-h1-p">
          {s.h1.map((line, i) => (
            <span key={line}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </h1>
        <div className="nm-lead">
          <p>{s.lead}</p>
        </div>
      </section>

      {/* Карточки сеткой, скриншот 16:10 сверху. Все одной высоты: ряды
          сетки равны самому высокому (grid-auto-rows: 1fr в .nm-wk), а
          «Открыть» прижата к низу карточки. Скриншот ведёт туда же, куда
          «Открыть»; для чтения с экрана он скрыт, чтобы ссылка не
          звучала дважды. */}
      <section className="nm-wrap nm-sect">
        <div className="nm-wk">
          {ORDER.map((w) => {
            const t = s.items[w.key];
            return (
              <article key={w.key} className="nm-wk-card">
                <a
                  className="nm-wk-shot"
                  href={w.href}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <Photo src={w.shot} alt="" ratio="16:10" />
                </a>
                <h2 className="nm-wk-n">{t.name}</h2>
                <p className="nm-wk-d">{t.what}</p>
                <p className="nm-work-s">{t.stack.join(" · ")}</p>
                <p className="nm-work-l nm-wk-l">
                  <a href={w.href}>{s.open}</a>
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default function NewWorks() {
  return (
    <>
      <NewHeader here="works" />

      <div>
        <ByLang ru={<Body lang="ru" />} en={<Body lang="en" />} />
        <NewFooter />
      </div>
    </>
  );
}
