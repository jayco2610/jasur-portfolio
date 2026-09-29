import type { Metadata } from "next";
import { cardPosts } from "../posts";
import { NewFooter } from "../Chrome";
import LogChrome from "../LogChrome";
import { ByLang } from "../Lang";
import LogContent from "./LogContent";

export const metadata: Metadata = {
  title: "Log · макет",
  robots: { index: false, follow: false },
};

/* Ветка 01 по ТЗ, перенесённая целиком со старой страницы /writing: издание,
   а не сетка карточек. Порядок блоков тот же — рубрики, главное, лента
   обложек, свежее, подкаст, внешние публикации, каналы, подписка.

   Здесь только чтение файлов: lib/blog ходит в файловую систему, а значит
   работает на сервере. Тело собирается дважды, из русских и из английских
   статей, и ByLang показывает то, что выбрано в переключателе. Всё, что
   умеет реагировать на нажатия (шапка, лента обложек, форма подписки),
   собрано из отдельных клиентских компонентов.

   Общая шапка сайта (Chrome) не показывается: блог открывается как отдельное
   издание со своей собственной шапкой (LogChrome). */

export default function NewLog() {
  return (
    <>
      {/* Чёрная липкая шапка издания с рубриками и выходом в портфолио */}
      <LogChrome />

      <div>
        <ByLang
          ru={<LogContent lang="ru" posts={cardPosts("ru")} />}
          en={<LogContent lang="en" posts={cardPosts("en")} />}
        />

        <NewFooter />
      </div>
    </>
  );
}
