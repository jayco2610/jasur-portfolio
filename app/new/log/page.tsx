import type { Metadata } from "next";
import Photo from "../Photo";
import { NewHeader, NewFooter } from "../Chrome";
import { ruCardPosts } from "../posts";

export const metadata: Metadata = {
  title: "Log · макет",
  robots: { index: false, follow: false },
};

/* Ветка 01 по ТЗ. Список материалов, рубрики человеческими словами, даты
   в одном формате. Описаний в карточках нет намеренно: они разной длины и
   тут же ломают высоту соседних карточек в ряду.

   Подкаста на странице нет: папки content/podcast в проекте не существует,
   выпусков ноль. Раздел появится вместе с первым выпуском, выдумывать его
   нельзя. Движок для него в проекте уже есть (lib/podcast.ts). */

export default function NewLog() {
  const posts = ruCardPosts();

  return (
    <>
      <NewHeader here="Log" />

      <div>
        <section className="nm-wrap nm-ptop">
          <h1 className="nm-h1-p">Log</h1>
          <div className="nm-lead">
            <p>
              Бортжурнал: запись хода, а не готовые выводы. Что собираю, что
              считаю, где ошибся.
            </p>
          </div>
        </section>

        <section className="nm-wrap nm-sect">
          <p className="nm-sec-t">Все материалы · {posts.length}</p>
          <div className="nm-grid">
            {posts.map((p) => (
              <a key={p.slug} className="nm-card" href={p.href}>
                <Photo src={p.cover} alt={p.title} ratio="16:10" />
                <span className="nm-card-meta">
                  {p.date} · {p.rubric}
                </span>
                <span className="nm-card-t">{p.title}</span>
              </a>
            ))}
          </div>
        </section>

        <NewFooter />
      </div>
    </>
  );
}
