import type { Metadata } from "next";
import Photo from "../Photo";
import { NewHeader, NewFooter } from "../Chrome";
import { ByLang } from "../Lang";
import { WORKS, CHROME, type Lang, type WorkKey } from "../strings";
import { pageMeta, SITE_NAME } from "../meta";
import { GptButton } from "../gpt/Gpt";

// Описание: заголовок страницы одной фразой и подводка под ним.
export const metadata: Metadata = pageMeta({
  title: `${CHROME.ru.nav.works} · ${SITE_NAME}`,
  description: `${WORKS.ru.h1.join(" ")}. ${WORKS.ru.lead}`,
});

/* Ветка 02 по ТЗ. Задача страницы: показать руки, а не продать продукты.

   Названия, стек и адреса взяты из lib/translations.ts (русский блок
   projects.projects) — то есть из того же источника, что живая страница
   /projects. Описания сжаты до одной строки: в карточке по ТЗ четыре элемента
   плюс скриншот, и абзац на пять строк ломает строй сетки.

   Статусов нет: решение Жасура. Метрики стоят внутри строки описания и
   только там, где они действительно есть, отдельного блока под них нет.

   Скриншоты в public/new/works сняты с живых адресов, окно 1600 × 1000,
   первый экран, файл 1200 × 750. JasurGPT переснят 2 октября 2026 с
   нового сайта: открыт чат «Титр», портрет слева на тёмном, справа один
   настоящий вопрос и ответ.

   Кадры на двух языках. У JasurGPT, AI Career System, Mia и демо есть
   английская пара (имя-en.jpg, поле shotEn), снятая так же при
   английском языке сайта; при EN показывается она. abcx остаётся одним
   русским кадром (продукт русский), Expat Roadmap и так английский.

   Три карточки ведут в демо внутри макета, и их кадры сняты оттуда же, а не
   со старого дизайна (переснято 29 сентября 2026, то же окно и тот же размер
   файла): каталог (/demos) первым экраном, с заголовком и началом
   карточек демо; Mia (/demos/mia) и AI Career System (/demos/career)
   после прогона сценария, кадр от выделенной мысли до результата. У Mia
   задан первый вопрос, видны найденные фрагменты и ответ в телефоне; у
   Career System пройден весь пайплайн. Пустое демо на картинке не говорит,
   что это за вещь.

   Куда ведёт «Открыть». Демо, Mia и AI Career System открываются в макете
   (/demos...), чтобы человек не выпадал в старый дизайн. Mia раньше
   вела на пространство Hugging Face, которое спит; с 03.10.2026 живой
   ассистент отвечает прямо на странице демо, над пошаговым разбором. JasurGPT не ссылка:
   «Открыть» и скриншот на его карточке открывают чат прямо здесь, тот же,
   что всплывающая кнопка в углу каждой страницы макета (gpt/Gpt.tsx).
   Отдельного адреса у чата нет. Раньше карточка вела на главную старого
   сайта, где была кнопка, а ещё раньше на jasur.dev, который не находится.

   Тексты карточек на двух языках лежат в strings.ts, здесь только то, что от
   языка не зависит: порядок, скриншот, адрес. Тело собирается дважды, и
   ByLang показывает то, что выбрано в переключателе. */

/* Порядок карточек и то, что от языка не зависит. */
const ORDER: { key: WorkKey; shot: string; shotEn?: string; href: string }[] = [
  // abcx одним русским кадром: продукт русский. Expat Roadmap и так английский.
  { key: "abcx", shot: "/new/works/abcx.jpg", href: "https://abcx-eight.vercel.app" },
  { key: "expat", shot: "/new/works/expat.jpg", href: "https://expat-roadmap-sea.vercel.app" },
  { key: "career", shot: "/new/works/career.jpg", shotEn: "/new/works/career-en.jpg", href: "/demos/career" },
  { key: "mia", shot: "/new/works/mia.jpg", shotEn: "/new/works/mia-en.jpg", href: "/demos/mia" },
  // href не нужен: карточка открывает чат на месте.
  { key: "jasurgpt", shot: "/new/works/jasurgpt.jpg", shotEn: "/new/works/jasurgpt-en.jpg", href: "" },
  { key: "demos", shot: "/new/works/demos.jpg", shotEn: "/new/works/demos-en.jpg", href: "/demos" },
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
            const shot = lang === "en" && w.shotEn ? w.shotEn : w.shot;
            return (
              <article key={w.key} className="nm-wk-card">
                {w.key === "jasurgpt" ? (
                  <GptButton className="nm-wk-shot nm-gpt-shot" hideFromReaders>
                    <Photo src={shot} alt="" ratio="16:10" />
                  </GptButton>
                ) : (
                  <a
                    className="nm-wk-shot"
                    href={w.href}
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <Photo src={shot} alt="" ratio="16:10" />
                  </a>
                )}
                <h2 className="nm-wk-n">{t.name}</h2>
                <p className="nm-wk-d">{t.what}</p>
                <p className="nm-work-s">{t.stack.join(" · ")}</p>
                <p className="nm-work-l nm-wk-l">
                  {w.key === "jasurgpt" ? (
                    <GptButton className="nm-gpt-link">{s.open}</GptButton>
                  ) : (
                    <a href={w.href}>{s.open}</a>
                  )}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Услуги и цены не отдельная ветка сайта, а документ: решение
          Жасура. До 5 октября 2026 это была одна мелкая строка под
          карточками, и её не замечали («что с услугами? где они могут
          посмотреть?»). Теперь отдельный блок на всю ширину, устроен как
          «Поток приостановлен» на Мастерской: чёрная линейка, крупный
          заголовок, строка, главная кнопка. Кнопка открывает PDF своего
          языка в новой вкладке; файлы собирает scripts/uslugi-pdf.mjs. */}
      <section className="nm-wrap nm-sect">
        <div className="nm-state nm-svc">
          <h2 className="nm-state-t">{s.prices}</h2>
          <p className="nm-state-d">{s.pricesD}</p>
          <p className="nm-btn-w">
            <a className="nm-btn" href={`/new/uslugi-${lang}.pdf`} target="_blank" rel="noopener">
              {s.pricesBtn}{" "}
              <span className="nm-btn-tag">{s.pdf}</span>
            </a>
          </p>
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
