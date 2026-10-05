import type { Metadata } from "next";
import Photo from "../Photo";
import { NewHeader, NewFooter } from "../Chrome";
import { ByLang } from "../Lang";
import { WORKSHOP, CHROME, type Lang } from "../strings";
import { pageMeta, SITE_NAME } from "../meta";
import Inside from "./Inside";

// Описание: заголовок страницы и подводка под ним. Первая строка заголовка
// уже кончается точкой, вторая нет.
export const metadata: Metadata = pageMeta({
  title: `${CHROME.ru.nav.workshop} · ${SITE_NAME}`,
  description: `${WORKSHOP.ru.h1.join(" ")}. ${WORKSHOP.ru.lead}`,
});

/* Ветка 03 по ТЗ, единственная новая сущность в конструкции.
   Все тексты взяты из ТЗ дословно, ничего не переписано.

   Цены на странице нет: показывается только состояние приёма. Кнопка
   «Оставить контакт» открывает в новой вкладке бота @jasur_workshop_bot,
   он задаёт семь вопросов (седьмой, телефон, с 3 октября 2026) и
   присылает заявку Жасуру (код бота в
   app/api/workshop-bot и lib/workshopBot.ts). Метка в ссылке говорит боту,
   с какой версии страницы пришли: workshop с русской, workshop_en с
   английской. По ней и по языку Telegram бот выбирает язык опроса.
   Ставить сюда почту вместо бота нельзя: решение по каналу сбора принято.

   Тексты на двух языках лежат в strings.ts. Тело собирается дважды, и
   ByLang показывает то, что выбрано в переключателе.

   Четвёртая строка «Что внутри» — опция, а не одна из трёх групп. Потолок
   в пять человек относится только к ней, в сам канал заходит кто угодно.

   С 5 октября 2026 каждый пункт «Что внутри» раскрывается по плюсу:
   что внутри, пример поста, таблица или кадр демо, формат (Inside.tsx,
   тексты утверждены Жасуром 04.10). Второй пункт переименован в «Где ищу
   деньги», строка «Поток приостановлен» обещает цену и дату старта. */

const BOT = "https://t.me/jasur_workshop_bot";

function Body({ lang }: { lang: Lang }) {
  const s = WORKSHOP[lang];
  const labels = { inside: s.inside, post: s.postL, format: s.formatL, openDemo: s.openDemo };

  return (
    <>
      {/* Первый экран устроен как на главной: секция без .nm-wrap, текст
          слева, фото справа доходит до края окна (классы .nm-hero*).
          Кадр целиком, со своим фоном, прямые края, без обработки.
          Модификатор --ws урезает нижний отступ: здесь он складывался
          с верхним отступом «Что внутри» в двести точек пустоты. */}
      <section className="nm-hero nm-hero--ws">
        <div className="nm-hero-in">
          <div className="nm-hero-text">
            <h1 className="nm-h1-p">
              {s.h1[0]}
              <br />
              {s.h1[1]}
            </h1>
            <div className="nm-lead">
              <p>{s.lead}</p>
            </div>
          </div>

          <Photo
            className="nm-hero-photo"
            src="/new/workshop.jpg"
            alt={s.photoAlt}
            ratio="1:1"
            priority
          />
        </div>
      </section>

      {/* ——— блок 2. Что внутри ———
          Каждый пункт раскрывается по плюсу справа (Inside.tsx), все
          закрыты по умолчанию. Четвёртый пункт, опция, стоит отдельно от
          первых трёх, раскрывается так же. */}
      <section className="nm-wrap nm-sect nm-sect--ws">
        <p className="nm-sec-t">{s.inside}</p>
        <div>
          {s.items.map((i) => (
            <Inside key={i.t} item={i} labels={labels} />
          ))}
          <Inside item={s.option} labels={labels} opt />
        </div>
      </section>

      {/* ——— блок 3. Для кого и для кого нет ——— */}
      <section className="nm-wrap nm-sect">
        <p className="nm-sec-t">{s.forWhom}</p>
        <div className="nm-two">
          <div>
            <h2 className="nm-two-t">{s.yesT}</h2>
            <p className="nm-two-d">{s.yesD}</p>
          </div>
          <div>
            <h2 className="nm-two-t">{s.noT}</h2>
            <p className="nm-two-d">{s.noD}</p>
          </div>
        </div>
      </section>

      {/* ——— блоки 4 и 5. Состояние приёма и кнопка ——— */}
      <section className="nm-wrap nm-sect">
        <div className="nm-state">
          <h2 className="nm-state-t">{s.stateT}</h2>
          <p className="nm-state-d">{s.stateD}</p>
          <p className="nm-btn-w">
            <a
              className="nm-btn"
              href={`${BOT}?start=${lang === "en" ? "workshop_en" : "workshop"}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.button}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}

export default function NewWorkshop() {
  return (
    <>
      <NewHeader here="workshop" />

      <div>
        <ByLang ru={<Body lang="ru" />} en={<Body lang="en" />} />
        <NewFooter />
      </div>
    </>
  );
}
