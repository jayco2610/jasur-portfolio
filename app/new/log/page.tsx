import type { Metadata } from "next";
import { NewHeader } from "../Chrome";
import { ruCardPosts } from "../posts";
import LogContent from "./LogContent";

export const metadata: Metadata = {
  title: "Log · макет",
  robots: { index: false, follow: false },
};

/* Ветка 01 по ТЗ, перенесённая целиком со старой страницы /writing: издание,
   а не сетка карточек. Порядок блоков тот же — рубрики, главное, лента
   обложек, свежее, подкаст, внешние публикации, каналы, подписка.

   Здесь только чтение файлов: lib/blog ходит в файловую систему, а значит
   работает на сервере. Всё, что умеет реагировать на нажатия (фильтр рубрик,
   лента, форма подписки), живёт в LogContent. */

export default function NewLog() {
  const posts = ruCardPosts();

  return (
    <>
      <NewHeader here="Log" />
      <LogContent posts={posts} />
    </>
  );
}
