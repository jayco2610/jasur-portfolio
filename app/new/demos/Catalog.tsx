"use client";

import Link from "next/link";
import Photo from "../Photo";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/translations";

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

type Demo = {
  href: string;
  shot: string;
  name: { en: string; ru: string };
  desc: { en: string; ru: string };
  /* Метки тоже на двух языках: на старой странице они оставались русскими
     и в английском каталоге («Кассы», «Алерты», «СБП»). */
  tags: { en: string[]; ru: string[] };
  live: boolean;
};

const productDemos: Demo[] = [
  {
    href: "/new/demos/mia",
    shot: "/new/demos/mia.jpg",
    name: { en: "Mia, a clinic RAG assistant", ru: "Mia, RAG-ассистент клиники" },
    desc: {
      en: "An assistant that answers patients only from the clinic's documents. Step-by-step walkthrough plus the live assistant on Hugging Face.",
      ru: "Ассистент, который отвечает пациентам только по документам клиники. Пошаговый разбор плюс живой ассистент на Hugging Face.",
    },
    tags: {
      en: ["RAG", "Hugging Face", "does not make things up"],
      ru: ["RAG", "Hugging Face", "не выдумывает"],
    },
    live: true,
  },
  {
    href: "/new/demos/career",
    shot: "/new/demos/career.jpg",
    name: { en: "AI Career System", ru: "AI Career System" },
    desc: {
      en: "My own job search automation: vacancy link in, tailored cover letter out in ~80 seconds. Watch a real run step by step.",
      ru: "Автоматизация моего собственного поиска работы: на входе ссылка на вакансию, на выходе письмо за ~80 секунд. Прогон по шагам.",
    },
    tags: { en: ["Claude", "n8n", "Telegram"], ru: ["Claude", "n8n", "Telegram"] },
    live: false,
  },
];

const demos: Demo[] = [
  {
    href: "/new/demos/preorder",
    shot: "/new/demos/preorder.jpg",
    name: { en: "Pre-order from the stands", ru: "Предзаказ с трибуны" },
    desc: {
      en: "A fan scans a QR on the seat, pays via SBP without getting up, and picks the order up at a separate window. The stand serves ~30% more checks per break.",
      ru: "Болельщик сканирует QR на кресле, платит через СБП не вставая с места и забирает заказ в отдельном окне. Точка пропускает на ~30% больше чеков за перерыв.",
    },
    tags: { en: ["Telegram WebApp", "SBP", "QR"], ru: ["Telegram WebApp", "СБП", "QR"] },
    live: false,
  },
  {
    href: "/new/demos/leftovers",
    shot: "/new/demos/leftovers.jpg",
    name: { en: "Evening leftovers sold by AI", ru: "Слив вечерних остатков через ИИ" },
    desc: {
      en: "At 7:30 pm AI looks at the counter, writes a push, and sends it to loyal customers nearby. Write-offs go to zero.",
      ru: "В 19:30 ИИ смотрит на витрину, пишет пуш и отправляет его лояльным клиентам рядом. Списания уходят в ноль.",
    },
    tags: { en: ["iiko", "AI", "Push"], ru: ["iiko", "AI", "Push"] },
    live: true,
  },
  {
    href: "/new/demos/fraud",
    shot: "/new/demos/fraud.jpg",
    name: { en: "POS fraud control", ru: "Фрод-контроль касс" },
    desc: {
      en: "Check voids, deleted items, and suspicious discounts trigger an instant Telegram alert to the owner: who, where, how much.",
      ru: "Отмены чеков, удаления позиций и подозрительные скидки мгновенно летят алертом владельцу в Telegram: кто, где и на сколько.",
    },
    tags: { en: ["POS", "Telegram", "Alerts"], ru: ["Кассы", "Telegram", "Алерты"] },
    live: false,
  },
  {
    href: "/new/demos/reviews",
    shot: "/new/demos/reviews.jpg",
    name: { en: "AI replies to reviews", ru: "ИИ-автоответы на отзывы" },
    desc: {
      en: "AI drafts replies to Yandex Maps and 2GIS reviews in the venue's tone. The manager only approves.",
      ru: "ИИ готовит ответы на отзывы в Яндекс Картах и 2ГИС в тоне заведения. Менеджер только утверждает.",
    },
    tags: { en: ["Yandex", "2GIS", "AI"], ru: ["Яндекс", "2ГИС", "AI"] },
    live: true,
  },
];

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
