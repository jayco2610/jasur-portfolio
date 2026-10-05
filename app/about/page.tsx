import type { Metadata } from "next";
import Link from "next/link";
import Photo from "../Photo";
import { NewHeader, NewFooter } from "../Chrome";
import { ByLang } from "../Lang";
import { ABOUT, type Lang } from "../strings";
import { pageMeta, SITE_NAME } from "../meta";
import { GptButton } from "../gpt/Gpt";
import ResumeRequest from "./ResumeRequest";

// Описание: первая фраза вводного блока и названия разделов страницы.
export const metadata: Metadata = pageMeta({
  title: `${ABOUT.ru.h1} · ${SITE_NAME}`,
  description: `${ABOUT.ru.intro[0].split(". ")[0]}. ${ABOUT.ru.exp}, ${ABOUT.ru.edu.toLowerCase()}, ${ABOUT.ru.courses.toLowerCase()}.`,
});

/* Ветка 04 по ТЗ.

   Опыт: без должностей и без месяцев, от нового к старому, тексты из ТЗ.
   Последняя позиция идёт без названия компании — правило из CLAUDE.md:
   Молот не указывается как официальное место работы.

   Образование: без годов и без слова об окончании (диплома нет). Под ним
   «Курсы», тоже без годов. Раздела «Языки» больше нет. Все три правки
   Жасура 03.10. Тот же текст надо будет поправить в lib/translations.ts,
   в PDF-резюме и в контексте JasurGPT, иначе расхождение останется.
   Картинку сертификата (public/certificate-deeplearning.png) на страницу
   не ставить, пока Жасур не решит.

   Справа от портрета (тексты утверждены Жасуром 03.10): вводный блок в два
   абзаца, под ним строка контактов мелким шрифтом через точку, под ней две
   кнопки. Страница прежде всего для работодателей и HR, поэтому главная
   кнопка «Запросить резюме» (чёрная плашка, открывает анкету,
   ResumeRequest.tsx), вторая «Спросите у JasurGPT» обводкой, она открывает
   тот же чат, что всплывающая кнопка в углу (gpt/Gpt.tsx). Под кнопками
   строка о том, что будет после запроса.

   Обе кнопки помечены data-fab-avoid: всплывающая кнопка JasurGPT уходит,
   пока стоит поверх них (на телефоне и планшете они попадают под неё при
   прокрутке).

   Внизу раздел «Кроме работы» в оформлении «Образования» и «Курсов»: видео,
   тексты, знакомства. Раньше это были два абзаца под кнопкой JasurGPT.

   Тексты на двух языках лежат в strings.ts. Тело собирается дважды, и
   ByLang показывает то, что выбрано в переключателе. */

const TG = "https://t.me/";
const EMAIL = "jasurakhmadaliev283@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/jasur-akhmadaliev";
const GITHUB = "https://github.com/jayco2610";

// Ссылки внутри текста: @имя ведёт в Telegram, слова из words на страницы
// сайта («Работах» на /works, Log на /log). Точка после имени в ссылку не
// попадает: в имени Telegram её не бывает. Латинские слова ищутся целиком,
// чтобы Log не нашёлся внутри другого слова.
function rich(text: string, words: Record<string, string> = {}) {
  const keys = Object.keys(words).map((w) =>
    /^[A-Za-z]+$/.test(w) ? `\\b${w}\\b` : w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const re = new RegExp(`(@[A-Za-z0-9_]{5,32}${keys.map((k) => `|${k}`).join("")})`);
  return text.split(re).map((part, i) => {
    if (i % 2 === 0) return part;
    if (part.startsWith("@")) {
      return (
        <a key={i} href={TG + part.slice(1)} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    return (
      <Link key={i} href={words[part]}>
        {part}
      </Link>
    );
  });
}

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
            {s.intro.map((p, i) => (
              <p key={i}>{rich(p, { [s.work]: "/works" })}</p>
            ))}

            {/* Строка контактов: точки-разделители склеены неразрывным
                пробелом с пунктом слева, поэтому строка переносится после
                точки, а не перед ней. Каждый пункт целиком на одной строке. */}
            <p className="nm-about-ct">
              <span>{s.city}</span>
              {"\u00a0· "}
              <span>
                {s.telegram}{" "}
                <a href={TG + "biznesmind"} target="_blank" rel="noopener noreferrer">
                  @biznesmind
                </a>
              </span>
              {"\u00a0· "}
              <span>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </span>
              {"\u00a0· "}
              <span>
                <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </span>
              {"\u00a0· "}
              <span>
                <a href={GITHUB} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </span>
            </p>

            <div className="nm-about-act">
              <div className="nm-about-btns">
                <span className="nm-about-bw" data-fab-avoid>
                  <ResumeRequest className="nm-about-b1" describedBy={`about-resume-note-${lang}`} />
                </span>
                <span className="nm-about-bw" data-fab-avoid>
                  <GptButton className="nm-about-b2" />
                </span>
              </div>
              <p id={`about-resume-note-${lang}`} className="nm-about-note">
                {s.resumeNote}
              </p>
            </div>
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
          <span className="nm-cline-k">{s.courses}</span>
          <span className="nm-cline-s nm-cline-list">
            {s.coursesV.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </span>
        </div>
        <div className="nm-cline">
          <span className="nm-cline-k">{s.outside}</span>
          <span className="nm-cline-s">{rich(s.outsideV, { Log: "/log" })}</span>
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
