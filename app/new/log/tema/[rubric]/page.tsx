import type { Metadata } from "next";
import Photo from "../../../Photo";
import { NewFooter } from "../../../Chrome";
import LogChrome from "../../../LogChrome";
import { ruCardPosts } from "../../../posts";
import { RUBRICS, rubricName, rubricDescription, rubricCover } from "@/lib/rubrics";

/* Страница отдельной рубрики внутри макета: /new/log/tema/[ключ].

   Так это сделано и на живом сайте (app/blog/tema/[rubric]): у каждой темы
   свой адрес, своя страница, её можно открыть, отправить ссылкой и найти
   поиском. В макете рубрики сначала были кнопками, которые фильтровали список
   на месте, и переход выглядел так, будто ничего не произошло: адрес
   не менялся, назад браузером было не вернуться.

   Состав повторяет живую страницу рубрики, а не список Log: первый экран
   с названием и описанием темы, картинка рубрики, сетка её материалов, возврат
   ко всему. Карусели, подкаста, внешних публикаций, каналов и подписки здесь
   нет по той же причине, по которой их нет на живой: это блоки списка целиком,
   а не отдельной темы.

   Страница серверная. Файлы читает lib/blog через posts.ts, реагируют
   на нажатия только шапка и заглушки картинок, каждая сама по себе. */

/* Кроме шести рубрик из lib/rubrics.ts, никаких других адресов не существует.
   Без этой строки Next пытается собрать незнакомый адрес прямо на сервере,
   а там нет папки content, и вместо честной 404 читатель видит ошибку. Живая
   страница рубрики этой пометки не имеет и на выдуманном адресе действительно
   отдаёт 500 (проверено запросом), поэтому здесь она стоит с самого начала. */
export const dynamicParams = false;

// Страницы делаем для всех рубрик, даже пустых: раздел в шапке есть, значит он
// обязан открываться, а не отдавать «страница не найдена».
export function generateStaticParams() {
  return RUBRICS.map((r) => ({ rubric: r.key }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ rubric: string }>;
}): Promise<Metadata> {
  const { rubric } = await params;

  return {
    title: `${rubricName(rubric, "ru")} · Log · макет`,
    // Макет не должен попасть в поиск, как и остальные страницы /new.
    robots: { index: false, follow: false },
  };
}

export default async function NewLogRubric({
  params,
}: {
  params: Promise<{ rubric: string }>;
}) {
  // Сюда доходят только шесть ключей из generateStaticParams: остальное
  // отсекает dynamicParams выше, своей проверки здесь уже не нужно.
  const { rubric } = await params;

  const name = rubricName(rubric, "ru");
  const cover = rubricCover(rubric);
  /* Правило отбора буквально то же, что в lib/blog.getPostsByRubric:
     p.rubric === ключ. Порядок и формат даты приходят из posts.ts, то есть
     карточки здесь и карточки на Log собраны из одного списка. */
  const posts = ruCardPosts().filter((p) => p.rubricKey === rubric);

  return (
    <>
      <LogChrome />

      <div>
        {/* Первый экран той же геометрии, что у Log: текст слева, картинка
            справа. Меняются только название, описание и сама картинка. */}
        <section className="nm-log-hero">
          <div className="nm-log-hero-in">
            <div className="nm-log-hero-text">
              <h1 className="nm-h1-p">{name}</h1>
              <div className="nm-lead">
                <p>{rubricDescription(rubric, "ru")}</p>
              </div>
            </div>
            {cover && (
              <Photo
                className="nm-log-hero-photo"
                src={cover}
                alt={name}
                ratio="1:1"
              />
            )}
          </div>
        </section>

        <section className="nm-wrap nm-sect nm-sect-log">
          <p className="nm-sec-t">
            В рубрике · {String(posts.length).padStart(2, "0")}
          </p>

          {posts.length > 0 ? (
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
          ) : (
            <p className="nm-empty">
              В этой рубрике пока ничего нет. Скоро будет.
            </p>
          )}

          <p className="nm-more">
            <a href="/new/log">Все материалы в Log</a>
          </p>
        </section>

        <NewFooter />
      </div>
    </>
  );
}
