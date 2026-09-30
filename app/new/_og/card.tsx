import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/* Картинка превью ссылки (Open Graph) для главной и веток макета.

   Стиль макета: лист #f9f9f7, чёрный Unbounded, линейка, никаких
   градиентов, теней и скруглений. Сверху имя латиницей, под линейкой
   название раздела. У Log и подкаста справа знак издания, квадрат с косой
   чертой, как в шапке Log.

   Шрифт лежит рядом файлами woff: Unbounded 500 и 700, полные файлы
   Google Fonts с кириллицей и латиницей. woff2, которые кладёт в сборку
   next/font, сюда не годятся: библиотека, рисующая картинку (satori),
   woff2 не читает. Без своего шрифта кириллица на картинке превратилась бы
   в пустые квадраты: встроенный шрифт next/og только латинский.

   Картинки собираются при сборке (статические маршруты), папка app/new/_og
   читается с диска только тогда. Подчёркивание в имени папки убирает её
   из маршрутов. */

const OG_SIZE = { width: 1200, height: 630 };

const INK = "#0b0b0b";
const PAPER = "#f9f9f7";
const DIM = "#6b6b6b";

const dir = join(process.cwd(), "app/new/_og");

/* Кегль названия раздела подбирается по длине: «МАСТЕРСКАЯ» при кегле
   «LOG» не влезла бы в ширину, а «LOG» при кегле «МАСТЕРСКОЙ» потерялся бы.
   Unbounded широкий, прописная буква около 0,9 кегля. */
function titleSize(text: string): number {
  const longest = Math.max(...text.split("\n").map((l) => l.length));
  return Math.min(150, Math.floor(1000 / (longest * 0.92)));
}

export async function ogCard({
  title,
  kicker,
  mark = false,
  name = true,
}: {
  /* Крупно под линейкой. Перенос строки через \n. */
  title: string;
  /* Мелко над линейкой справа от имени: пункты меню, название издания. */
  kicker?: string;
  /* Знак издания Log: чёрный квадрат с белой косой чертой. */
  mark?: boolean;
  /* Имя сверху. У главной имя стоит крупно под линейкой, повторять его
     мелко сверху незачем. */
  name?: boolean;
}) {
  const [w500, w700] = await Promise.all([
    readFile(join(dir, "Unbounded-500.woff")),
    readFile(join(dir, "Unbounded-700.woff")),
  ]);
  const size = titleSize(title);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PAPER,
          color: INK,
          padding: "64px 72px 72px",
          fontFamily: "Unbounded",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {name && (
              <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: 3.5 }}>
                JASUR AKHMADALIEV
              </span>
            )}
            {kicker && (
              <span
                style={{
                  marginTop: name ? 14 : 0,
                  fontSize: 17,
                  fontWeight: 500,
                  letterSpacing: 2.5,
                  color: DIM,
                  textTransform: "uppercase",
                }}
              >
                {kicker}
              </span>
            )}
          </div>
          {mark && (
            <div
              style={{
                width: 84,
                height: 84,
                background: INK,
                color: PAPER,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 44,
                fontWeight: 700,
              }}
            >
              /
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ height: 3, width: "100%", background: INK }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 34,
              fontSize: size,
              fontWeight: 700,
              lineHeight: 0.98,
              letterSpacing: -size * 0.03,
              textTransform: "uppercase",
            }}
          >
            {title.split("\n").map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Unbounded", data: w500, weight: 500, style: "normal" },
        { name: "Unbounded", data: w700, weight: 700, style: "normal" },
      ],
    }
  );
}
