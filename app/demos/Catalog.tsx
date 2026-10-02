"use client";

import Link from "next/link";
import Photo from "../Photo";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/translations";
import { demos, productDemos, type Demo } from "./list";

/* Каталог демо. Перенос app/demos/page.tsx: те же три блока (вступление,
   демо для бизнеса, свои продукты), те же тексты, те же номера D.01 и P.01,
   та же пометка «live AI» у демо с живой генерацией. Подписи раздела берутся
   из lib/translations.ts, как на старой странице, списки демо переписаны
   сюда без изменений: из файла страницы их не импортировать.

   Меняется подача. Строки стали карточками со скриншотом, как на «Работах»:
   в макете списки проектов показываются так. Скриншоты сняты с самих демо в
   новом оформлении и лежат в public/new/demos: окно 1100 точек, кадр
   начинается у линейки над интерфейсом демо, пропорция у всех 16:10, файл
   1200 × 750. Демо сняты в середине сценария (пайплайн пройден, алерты
   пришли, вопрос задан, корзина собрана). Остатки и отзывы сняты до нажатия:
   их текст пишет модель, а придумывать за неё ответ для картинки нельзя.
   Въезд строк слева при прокрутке (hooks/useReveal) не перенесён: в
   обвязке макета анимаций нет. */

/* Карточек в ряду две. Шаблон рядов общей сетки: на каждый раздел строка
   заголовка по содержимому и ряды карточек по 1fr, то есть все ряды
   карточек во всём каталоге одной высоты. На телефоне шаблон отключается
   в demos.css, там карточки идут столбиком. */
const PER_ROW = 2;
function rowsFor(...groups: number[]): string {
  return groups
    .map((n) => ["auto", ...Array(Math.ceil(n / PER_ROW)).fill("1fr")].join(" "))
    .join(" ");
}

function DemoCard({
  demo,
  lang,
  index,
  letter,
  openLabel,
}: {
  demo: Demo;
  lang: "en" | "ru";
  index: number;
  letter: string;
  openLabel: string;
}) {
  return (
    <Link href={demo.href} className="nm-dm-card">
      <Photo src={demo.shot} alt="" ratio="16:10" />
      <h3 className="nm-dm-card-n">{demo.name[lang]}</h3>
      <p className="nm-dm-card-s">{demo.tags[lang].join(" · ")}</p>
      <p className="nm-dm-card-d">{demo.desc[lang]}</p>
      <p className="nm-dm-card-f">
        <span>
          <i>
            {letter}.0{index + 1}
          </i>
          <b>{demo.live ? "live AI" : openLabel}</b>
        </span>
      </p>
    </Link>
  );
}

export default function Catalog() {
  const { lang } = useLanguage();
  const d = t[lang].demos;
  const [first, ...rest] = d.title.split(" ");

  return (
    <>
      <section className="nm-wrap nm-ptop">
        <p className="nm-sec-t">{d.label}</p>
        <div className="nm-dm-sh">
          <span className="nm-dm-no">01</span>
          <h1 className="nm-h1-p">
            {first} <span className="nm-dm-h1-soft">{rest.join(" ")}</span>
          </h1>
          <span className="nm-dm-no">{demos.length + productDemos.length}</span>
        </div>

        <div className="nm-dm-intro">
          <p className="nm-dm-intro-t">{d.intro}</p>
          <p className="nm-dm-intro-n">{d.note}</p>
        </div>
      </section>

      <section className="nm-wrap nm-sect">
        <div
          className="nm-dm-cat"
          style={{ "--nm-dm-rows": rowsFor(demos.length, productDemos.length) } as React.CSSProperties}
        >
          <div className="nm-dm-sh">
            <span className="nm-dm-no">02</span>
            <h2 className="nm-dm-h2">{d.groupBusiness}</h2>
            <span className="nm-dm-no">{demos.length}</span>
          </div>
          {demos.map((demo, i) => (
            <DemoCard key={demo.href} demo={demo} lang={lang} index={i} letter="D" openLabel={d.open} />
          ))}

          <div className="nm-dm-sh is-next">
            <span className="nm-dm-no">03</span>
            <h2 className="nm-dm-h2">{d.groupProducts}</h2>
            <span className="nm-dm-no">{productDemos.length}</span>
          </div>
          {productDemos.map((demo, i) => (
            <DemoCard key={demo.href} demo={demo} lang={lang} index={i} letter="P" openLabel={d.open} />
          ))}
        </div>
      </section>
    </>
  );
}
