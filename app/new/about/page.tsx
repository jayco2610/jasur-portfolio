import type { Metadata } from "next";
import Photo from "../Photo";
import { NewHeader, NewFooter } from "../Chrome";

export const metadata: Metadata = {
  title: "Обо мне · макет",
  robots: { index: false, follow: false },
};

/* Ветка 04 по ТЗ.

   Опыт: без должностей и без месяцев, от нового к старому, тексты из ТЗ.
   Последняя позиция идёт без названия компании — правило из CLAUDE.md:
   Молот не указывается как официальное место работы.

   Образование: только период, без слова об окончании. Это правка по сути,
   а не по стилю: на живом сайте и в резюме сейчас стоит «окончил 2025»,
   диплома нет. Тот же текст надо будет поправить в lib/translations.ts,
   в PDF-резюме и в контексте JasurGPT, иначе расхождение останется.

   JasurGPT на эту страницу не ставится: решение, где он живёт, отложено. */

const EXPERIENCE = [
  {
    name: "Braiden Consulting",
    what: "AI-проджект-менеджер. Внедрял ИИ в процессы компании.",
  },
  {
    name: "Synergia",
    what: "Вёл сорок клиентов, собирал требования, следил за сроками. NPS вырос с 62 до 78, время ответа снизилось на треть.",
  },
  {
    name: "Instameal",
    what: "Фудтех-стартап, запуск с нуля. Кастдев, MVP из бота и сайта, первые платящие. Около четырёхсот пользователей, до первого заказа доходили сорок процентов. Координировал команду из восьми человек.",
  },
  {
    name: "Yonma Yon",
    what: "MVP: лендинг и телеграм-бот. Больше десяти пользовательских интервью, сто пятьдесят пользователей, открыл B2B-направление.",
  },
  {
    name: "IDF Lab",
    what: "RFM-сегментация клиентской базы для внешнего заказчика, рекомендации по удержанию.",
  },
  {
    name: "Консалтинговый проект, фриланс",
    what: "Аудит закупок и операционных данных, автоматизированная отчётность по категориям затрат. Затраты снизились примерно на восемнадцать процентов.",
  },
];

const LANGS = [
  "Русский — родной",
  "Узбекский — родной",
  "Английский — профессиональный",
  "Турецкий — B2",
];

export default function NewAbout() {
  return (
    <>
      <NewHeader here="Обо мне" />

      <div>
        <section className="nm-ptop nm-about-top">
          <div className="nm-about-in">
            <div>
              <h1 className="nm-h1-p">Обо мне</h1>
              <div className="nm-lead">
                <p>
                  Меня зовут Жасур. Продакт-менеджер: собираю продукты в
                  одиночку, код, дизайн и тексты делаю сам.
                </p>
                <p>
                  Всё, что собрал, лежит в «Работах», а как это собиралось и что
                  из этого вышло — в Log, вместе с цифрами.
                </p>
              </div>
            </div>

            <Photo
              className="nm-about-photo"
              src="/new/portret.jpg"
              alt="Jasur Akhmadaliev"
              ratio="4:5"
            />
          </div>
        </section>

        <section className="nm-wrap nm-sect">
          <p className="nm-sec-t">Опыт</p>
          <div className="nm-exp">
            {EXPERIENCE.map((e) => (
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
            <span className="nm-cline-k">Образование</span>
            <span className="nm-cline-s">
              НИУ ВШЭ, бизнес и экономика, 2023-2025
            </span>
          </div>
          <div className="nm-cline">
            <span className="nm-cline-k">Языки</span>
            <span className="nm-cline-s">{LANGS.join(" · ")}</span>
          </div>
        </section>

        <NewFooter />
      </div>
    </>
  );
}
