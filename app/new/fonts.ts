// Шрифты макета. Подключены через next/font, файлы кладутся в бандл проекта,
// внешних запросов к Google в рантайме нет.
//
// Пара зафиксирована: Unbounded для заголовков, Onest для текста.
// Второй вариант (Golos Text / Manrope) больше не нужен и удалён.
//
// Обязательное условие: полноценная кириллица.
// Bebas Neue и Space Grotesk из списка кандидатов отпали именно по нему:
// в Google Fonts у них нет кириллического набора.

import { Unbounded, Onest } from "next/font/google";

// Unbounded: широкий геометрический гротеск, заголовок сразу становится
// картинкой, а не просто крупным текстом.
export const unbounded = Unbounded({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--nm-f-unbounded",
  display: "swap",
});

// Onest: спокойный текстовый гротеск, не спорит с Unbounded в мелком кегле.
export const onest = Onest({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "700"],
  variable: "--nm-f-onest",
  display: "swap",
});
