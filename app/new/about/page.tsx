import type { Metadata } from "next";
import Photo from "../Photo";
import { NewHeader, NewFooter } from "../Chrome";
import { ByLang } from "../Lang";
import { ABOUT, type Lang } from "../strings";
import { pageMeta, SITE_NAME } from "../meta";
import { GptButton } from "../gpt/Gpt";

// Описание: первая строка страницы и названия её разделов.
export const metadata: Metadata = pageMeta({
  title: `${ABOUT.ru.h1} · ${SITE_NAME}`,
  description: `${ABOUT.ru.p1} ${ABOUT.ru.exp}, ${ABOUT.ru.edu.toLowerCase()}, ${ABOUT.ru.langs.toLowerCase()}.`,
});

/* Ветка 04 по ТЗ.

   Опыт: без должностей и без месяцев, от нового к старому, тексты из ТЗ.
   Последняя позиция идёт без названия компании — правило из CLAUDE.md:
   Молот не указывается как официальное место работы.

   Образование: только период, без слова об окончании. Это правка по сути,
   а не по стилю: на живом сайте и в резюме сейчас стоит «окончил 2025»,
   диплома нет. Тот же текст надо будет поправить в lib/translations.ts,
   в PDF-резюме и в контексте JasurGPT, иначе расхождение останется.

   JasurGPT: после вводных абзацев кнопка «Спросите у JasurGPT», она
   открывает тот же чат, что всплывающая кнопка в углу (gpt/Gpt.tsx).
   Решение Жасура, новых фраз к кнопке не добавлено.

   Тексты на двух языках лежат в strings.ts. Тело собирается дважды, и
   ByLang показывает то, что выбрано в переключателе. */

function Body({ lang }: { lang: Lang }) {
  const s = ABOUT[lang];

  return (
    <>
      {/* Подача портрета взята со старой страницы (app/page.tsx, раздел
          «О себе»): заголовок, под линейкой две колонки, слева портрет
          на треть ширины с подписью «Рис. 01 — Москва / 2026», справа
          текст. Имени в тексте страницы нет, решение Жасура; в шапке и
          подвале оно остаётся, это общая обвязка всех страниц. */}
      <section className="nm-wrap nm-ptop">
        <h1 className="nm-h1-p">{s.h1}</h1>

        <div className="nm-about-in">
          <figure className="nm-about-fig">
            <Photo
              className="nm-about-photo"
              src="/new/portret.jpg"
              alt={s.photoAlt}
              ratio="2:3"
              priority
            />
            <figcaption className="nm-about-cap">
              <span>{s.cap}</span>
              <span>2026</span>
            </figcaption>
          </figure>

          <div className="nm-about-tx">
            <p>{s.p1}</p>
            <p>{s.p2}</p>
            <p className="nm-gpt-in">
              <GptButton />
            </p>
          </div>
        </div>
      </section>

      <section className="nm-wrap nm-sect">
        <p className="nm-sec-t">{s.exp}</p>
        <div className="nm-exp">
          {s.experience.map((e) => (
            <article key={e.name} className="nm-work">
              <h2 className="nm-work-n">{e.name}</h2>
              <div className="nm-work-b">
                <p className="nm-work-d">{e.what}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="nm-wrap nm-sect">
        <div className="nm-cline">
          <span className="nm-cline-k">{s.edu}</span>
          <span className="nm-cline-s">{s.eduV}</span>
        </div>
        <div className="nm-cline">
          <span className="nm-cline-k">{s.langs}</span>
          <span className="nm-cline-s">{s.langsV.join(" · ")}</span>
        </div>
      </section>
    </>
  );
}

export default function NewAbout() {
  return (
    <>
      <NewHeader here="about" />

      <div>
        <ByLang ru={<Body lang="ru" />} en={<Body lang="en" />} />
        <NewFooter />
      </div>
    </>
  );
}
