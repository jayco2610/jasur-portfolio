import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getAllSlugs, getAllPosts, rubricName } from "@/lib/blog";
import { MAGAZINE_NAME } from "@/lib/rubrics";
import Photo from "../../Photo";
import { NewFooter } from "../../Chrome";
import LogChrome from "../../LogChrome";
import Carousel from "../../log/Carousel";
import Subscribe from "../../log/Subscribe";
import { articleHref, cardDate, toCard } from "../../posts";
import Rail from "../Rail";
import Share from "../Share";
import NoTranslation from "../NoTranslation";
import Poster from "../Poster";
import { RSS, SITE_NAME } from "../../meta";

/* Страница статьи в макете: /new/blog/[slug].

   Перенос живой app/blog/[slug]/page.tsx. Состав и порядок блоков тот же,
   поведение то же, меняется только оформление:

    1. разметка Article для поисковиков (JSON-LD);
    2. шапка издания (здесь LogChrome вместо MagChrome, как на всех
       страницах Log в макете) с рубрикой статьи и переключателем языка;
    3. хлебные крошки: издание, рубрика, «статья»;
    4. строка сведений: дата, минуты чтения, теги, ссылка на перевод;
    5. заголовок и подзаголовок-описание;
    6. пометка «перевода нет», если у текста нет пары;
    7. пометка «впервые опубликовано здесь», если текст вышел на чужой площадке;
    8. обложка: широкая полоса 16:10 или постер целиком;
    9. текст статьи с иллюстрациями, главами и ссылками;
   10. источники: все внешние ссылки текста списком;
   11. «поделиться»;
   12. автор;
   13. подписка;
   14. «ещё почитать»: лента других статей на том же языке;
   15. полка справа: главы, картинки, ссылки;
   16. нижняя строка издания с возвратом ко всем материалам.

   Подвал с контактами (NewFooter) стоит на всех страницах макета вместо
   общего подвала сайта, поэтому стоит и здесь. */

const SITE = "https://jasur-portfolio-pied.vercel.app";

/* Кроме статей, собранных при сборке, никаких других адресов не существует.
   Без этой строки Next пытается собрать незнакомый адрес прямо на сервере,
   а там нет папки content, и вместо честной 404 читатель видит ошибку. */
export const dynamicParams = false;

/* Тот же список, что у живой страницы: все опубликованные статьи обоих
   языков, черновики отсекает lib/blog. */
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  // Оригинал этой статьи живёт на /blog/[slug]. Макет в поиск не пускаем,
  // а каноническим адресом, превью и ссылкой «поделиться» оставляем живой:
  // репост макета увёл бы человека на страницу, которой завтра не будет.
  // После переезда макета статья сама встанет на этот адрес.
  const live = `${SITE}/blog/${post.slug}`;

  // Превью ссылки: своя картинка 1200 × 630, если её нарисовали (ogImage),
  // иначе обложка самой статьи. Раньше без ogImage подставлялась общая
  // картинка журнала /og-log.jpg, и у четырёх статей (две про сайт, две про
  // ноль продаж) превью было чужим. Размер у обложки не указываем: он у
  // каждой свой, а неверный размер в разметке хуже, чем никакого.
  const image = post.ogImage
    ? { url: post.ogImage, width: 1200, height: 630, alt: post.title }
    : post.cover
      ? { url: post.cover, alt: post.title }
      : null;

  return {
    title: { absolute: `${post.title} · ${MAGAZINE_NAME[post.lang]}` },
    description: post.description,
    robots: { index: false, follow: false },
    alternates: {
      canonical: post.canonical ?? live,
      types: RSS,
    },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      locale: post.lang === "ru" ? "ru_RU" : "en_US",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      url: live,
      ...(image ? { images: [image] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      ...(image ? { images: [image.url] } : {}),
    },
  };
}

/* Текст статьи приходит из lib/blog готовым html, собранным для живого
   журнала. Здесь его подгоняем под макет, не трогая lib/blog:

   - иллюстрации размечены классом .mag-fig, у которого в globals.css свои
     цвета и оранжевый номер. Меняем класс на свой, и старые правила до
     картинки больше не достают;
   - таблицы оборачиваем в блок с прокруткой: широкая таблица на телефоне
     иначе распирает страницу вбок;
   - внутренние ссылки на статьи, рубрики, сам Log, подкаст, демо и главную
     ведут в макет, а не на живые страницы. Ссылка на статью меняется, только
     если такая статья есть: адреса картинок /blog/*.jpg под правило не
     попадают, потому что стоят в src, а не в href. Демо в текстах бывают
     и относительными (/demos), и полным адресом живого сайта
     (https://jasur-portfolio-pied.vercel.app/demos/mia): меняются оба,
     см. demoHref. Разделы, которых в макете нет (проекты, услуги, резюме),
     остаются живыми адресами;
   - пробелы внутри чисел («165 000») и перед знаком рубля становятся
     неразрывными: в узкой колонке таблицы на телефоне «165 000–300 000 ₽»
     рвался посреди числа, и «000 ₽» уезжало на отдельную строку. */
/* Ссылка на демо, относительная или полным адресом живого сайта, ведёт в
   макет: /demos/mia становится /new/demos/mia. Любая другая ссылка
   возвращается как была. Отдельной функцией, потому что тот же адрес стоит
   ещё в двух местах, кроме текста: в списке источников под статьёй и на
   полке справа. Полные адреса lib/blog считает внешними и открывает в новой
   вкладке; это поведение живой страницы, оно сохраняется, меняется только
   адрес. */
const DEMO_RE = /^(?:https:\/\/jasur-portfolio-pied\.vercel\.app)?\/demos(\/[a-z0-9-]+)?\/?(?=$|[?#])/;
function demoHref(href: string): string {
  return href.replace(DEMO_RE, (_m, name?: string) => `/new/demos${name ?? ""}`);
}

function adapt(html: string, slugs: Set<string>): string {
  return html
    .replace(/<figure class="mag-fig"/g, '<figure class="nm-fig"')
    .replace(/href="([^"]*)"/g, (m, href: string) => {
      const to = demoHref(href);
      return to === href ? m : `href="${to}"`;
    })
    .replace(/<table>/g, '<div class="nm-tbl"><table>')
    .replace(/<\/table>/g, "</table></div>")
    .replace(/href="\/blog\/tema\/([a-z0-9-]+)"/g, 'href="/new/log/tema/$1"')
    .replace(/href="\/blog\/([a-z0-9-]+)"/g, (m, slug: string) =>
      slugs.has(slug) ? `href="${articleHref(slug)}"` : m
    )
    .replace(/href="\/writing"/g, 'href="/new/log"')
    .replace(/href="\/podcast"/g, 'href="/new/podcast"')
    .replace(/href="\/"/g, 'href="/new"')
    .replace(/(\d) (?=\d{3}(?!\d))/g, "$1\u00a0")
    .replace(/ ₽/g, "\u00a0₽");
}

export default async function NewArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const ru = post.lang === "ru";
  const all = getAllPosts();
  // В подборке «ещё почитать» только тексты на языке этой статьи, в том же
  // порядке и того же размера, что на живой странице.
  const others = all
    .filter((p) => p.slug !== post.slug && p.lang === post.lang)
    .slice(0, 8);
  const twin = post.translation ? getPost(post.translation) : null;
  const twinHref = twin ? articleHref(twin.slug) : undefined;
  const html = adapt(post.html, new Set(all.map((p) => p.slug)));
  // Источники под статьёй и полка справа собраны из тех же ссылок текста,
  // поэтому ссылки на демо в них ведут туда же, куда в тексте.
  // lib/blog вынимает адрес прямо из html, где & записан как &amp;. В тексте
  // статьи браузер это раскодирует сам, а здесь адрес идёт в JSX, и React
  // экранирует его второй раз: ссылка на Хабр Карьеру в источниках уводила
  // на адрес с «&amp;amp;» внутри и теряла второй параметр запроса.
  const links = post.links.map((l) => ({
    ...l,
    href: demoHref(l.href.replace(/&amp;/g, "&")),
  }));
  const rubric = rubricName(post.rubric, post.lang);
  const live = `${SITE}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: post.lang,
    ...(post.cover || post.ogImage ? { image: `${SITE}${post.ogImage ?? post.cover}` } : {}),
    keywords: post.tags.join(", "),
    author: {
      "@type": "Person",
      name: "Jasur Akhmadaliev",
      url: SITE,
      sameAs: [
        "https://www.linkedin.com/in/jasur-akhmadaliev/",
        "https://t.me/head_of_ceo",
        "https://vc.ru/id5991727",
        "https://dev.to/jasurakhmadaliev",
        "https://github.com/jayco2610",
      ],
    },
    publisher: { "@type": "Person", name: "Jasur Akhmadaliev", url: SITE },
    mainEntityOfPage: post.canonical ?? live,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <LogChrome article={{ lang: post.lang, rubric: post.rubric, twinHref }} />

      <div lang={post.lang}>
        <div className="nm-wrap">
          <nav className="nm-crumbs">
            <Link href="/new/log">{MAGAZINE_NAME[post.lang]}</Link>
            <span aria-hidden="true">›</span>
            <Link href={`/new/log/tema/${post.rubric}`}>{rubric}</Link>
            <span aria-hidden="true">›</span>
            <b>{ru ? "статья" : "article"}</b>
          </nav>

          <div className="nm-art">
            <div className="nm-art-main">
              <article>
                <div className="nm-art-meta">
                  <span>{cardDate(post.date, post.lang)}</span>
                  <span>
                    {post.readingMinutes} {ru ? "мин чтения" : "min read"}
                  </span>
                  {post.tags.length > 0 && <span>{post.tags.join(" · ")}</span>}
                  {twin && (
                    <Link
                      href={articleHref(twin.slug)}
                      className="nm-art-twin"
                      hrefLang={twin.lang}
                    >
                      {ru ? "Read in English" : "Читать по-русски"}
                    </Link>
                  )}
                </div>

                <h1 className="nm-art-h1">{post.title}</h1>

                {post.description && <p className="nm-art-lead">{post.description}</p>}

                {!twin && <NoTranslation postLang={post.lang} />}

                {post.canonical && (
                  <p className="nm-art-orig">
                    {ru ? "Впервые опубликовано здесь: " : "First published here: "}
                    <a href={post.canonical} target="_blank" rel="noopener noreferrer">
                      {new URL(post.canonical).hostname.replace("www.", "")}
                    </a>
                  </p>
                )}

                {/* Обычная обложка режется в полосу 16:10, той же пропорции,
                    что карточки: обложка статьи и её превью в списке это один
                    кадр. Нарисованная обложка-постер показывается целиком. */}
                {post.cover &&
                  (post.coverFit === "poster" ? (
                    <Poster src={post.cover} />
                  ) : (
                    <Photo className="nm-art-cover" src={post.cover} alt="" ratio="16:10" priority />
                  ))}

                <div className="nm-body" dangerouslySetInnerHTML={{ __html: html }} />
              </article>

              {links.length > 0 && (
                <section className="nm-art-sec nm-src">
                  <p className="nm-sec-t">
                    {ru ? "Источники" : "Sources"} · {String(links.length).padStart(2, "0")}
                  </p>
                  <ol>
                    {links.map((l) => (
                      <li key={l.href}>
                        <a href={l.href} target="_blank" rel="noopener noreferrer">
                          {l.text}
                        </a>
                        <span>{l.host}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              <div className="nm-art-sec">
                <Share url={live} title={post.title} ru={ru} />
              </div>

              <div className="nm-author">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/new/portret.jpg"
                  alt="Jasur Akhmadaliev"
                  width={92}
                  height={92}
                  loading="lazy"
                  decoding="async"
                  className="nm-author-ph"
                />
                <div>
                  <p className="nm-author-n">Jasur Akhmadaliev</p>
                  <p className="nm-author-d">
                    {ru
                      ? "Собираю продукты в одиночку и пишу, как это выходит. Москва."
                      : "I build products solo and write about how it goes. Moscow."}
                  </p>
                  <p className="nm-author-l">
                    <a href="https://t.me/head_of_ceo" target="_blank" rel="noopener noreferrer">
                      {ru ? "Канал @head_of_ceo" : "Channel @head_of_ceo"}
                    </a>
                    <a href="https://t.me/biznesmind" target="_blank" rel="noopener noreferrer">
                      {ru ? "Написать: @biznesmind" : "Write: @biznesmind"}
                    </a>
                    <Link href="/resume">{ru ? "Резюме" : "Resume"}</Link>
                  </p>
                </div>
              </div>

              <div className="nm-art-sec">
                <Subscribe lang={post.lang} />
              </div>

              {others.length > 0 && (
                <section className="nm-art-sec nm-next">
                  <p className="nm-sec-t">
                    {ru ? "Ещё почитать" : "Read next"} · {String(others.length).padStart(2, "0")}
                  </p>
                  {/* Та же лента обложек, что в «Свежем» на Log: те же
                      карточки, та же пропорция, тот же формат даты. В колонке
                      статьи в кадре две карточки, как на живой странице. */}
                  <Carousel
                    narrow
                    label={ru ? "Ещё почитать" : "Read next"}
                    posts={others.map(toCard)}
                  />
                </section>
              )}
            </div>

            <Rail
              headings={post.headings}
              figures={post.figures}
              links={links}
              ru={ru}
            />
          </div>

          <footer className="nm-art-foot">
            <span>{MAGAZINE_NAME[post.lang]}</span>
            <Link href="/new/log">{ru ? "← Все материалы" : "← All pieces"}</Link>
          </footer>
        </div>

        <NewFooter lang={post.lang} />
      </div>
    </>
  );
}
