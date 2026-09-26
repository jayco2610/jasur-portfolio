import { getAllPosts, formatDate, rubricName } from "@/lib/blog";

/* Материалы для макета берутся из тех же файлов content/blog, что и живой
   сайт, через lib/blog. Руками список не переписывается: как только выйдет
   новая статья, она появится и здесь. Прежние заголовки в блоке «Свежее»
   были заглушками, придуманными в обход этих файлов, и публиковать их
   под именем Жасура было нельзя.

   Читается на сервере: lib/blog ходит в файловую систему. */

export type CardPost = {
  slug: string;
  href: string;
  cover: string;
  date: string;
  rubric: string;
  title: string;
};

/* Формат даты по ТЗ один на весь сайт: «17 сентября 2026».
   lib/formatDate отдаёт русскую дату через toLocaleDateString, а он в ru-RU
   всегда дописывает « г.». Отрезаем именно этот хвост, а не форматируем дату
   заново: названия месяцев остаются на совести платформы, а не наши. */
function ruDate(date: string): string {
  return formatDate(date, "ru").replace(/\s*г\.\s*$/, "");
}

/* Только русские и только опубликованные. Английские версии живут по своим
   адресам и в русский список попадать не должны: иначе один и тот же текст
   стоял бы в списке дважды.

   Сортировка строго от новых к старым. Флаг featured, который в журнале
   поднимает статью наверх независимо от даты, здесь намеренно не учитывается:
   по ТЗ это список по дате. */
export function ruCardPosts(): CardPost[] {
  return getAllPosts()
    .filter((p) => p.lang === "ru")
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((p) => ({
      slug: p.slug,
      href: `/blog/${p.slug}`,
      // Обложка есть у всех текущих материалов; если у нового её не будет,
      // Photo покажет заглушку с нужным размером, а не битую картинку.
      cover: p.cover ?? "",
      date: ruDate(p.date),
      rubric: rubricName(p.rubric, "ru"),
      title: p.title,
    }));
}
