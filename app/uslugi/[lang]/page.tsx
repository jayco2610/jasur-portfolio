import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Photo from "../../Photo";
import { CHROME, WORKS, type Lang } from "../../strings";
import { demos, productDemos, demoShot, type Demo } from "../../demos/list";
import { companyDemos } from "../../demos/list-company";
import { DEMO_SLIDES, GROUPS, LIVE_DEMO, TITLE, type Service } from "../services";
import "../uslugi.css";

/* Исходник документа «Услуги»: слайды 16:9, из которых печатается PDF.

   Страницу никто не открывает руками. Её открывает скрипт
   scripts/uslugi-pdf.mjs, печатает через Playwright (page.pdf) и кладёт
   результат в public/new/uslugi-ru.pdf и public/new/uslugi-en.pdf. Человек
   на сайте видит только PDF: блок «Услуги и цены» на /works и строка
   «То же под ваш бизнес: услуги и цены» вверху и внизу каталога /demos.

   Состав (с 5 октября 2026): обложка, три слайда услуг, два слайда «Демо
   для компаний» (demos/list-company.ts), два слайда «Демо для локального
   бизнеса» (demos/list.ts), контакты. Номера страниц считаются сами.

   Почему страница сайта, а не отдельный html-файл: так документ собран из
   тех же шрифтов (next/font), тех же переменных new.css, той же заглушки
   картинок и тех же списков, что и сайт. Поменялись кадры демо
   (public/new/demos) или их описания (demos/list.ts), пересборка одной
   командой подхватит новое.

   Адресов два, /uslugi/ru и /uslugi/en, обе собираются при сборке,
   любой другой язык отдаёт 404. Ссылок на них нигде нет, в поиск они не
   пускаются: robots стоит прямо здесь, а не через pageMeta. Из pageMeta
   строку robots убрали при переезде макета на главную, а этот исходник в
   поиске не нужен и после переезда. В карте сайта его тоже нет.

   Все ссылки в документе абсолютные: PDF живёт отдельно от сайта, его
   скачивают и пересылают. Демо ведут на постоянные адреса
   (/demos/preorder и так далее), поэтому переезд макета с /new на главную
   документ не задел. SITE прописан и в других
   файлах сайта, при переезде на свой домен менять вместе с ними. */

const SITE = "https://jasur-portfolio-pied.vercel.app";
const LANGS: Lang[] = ["ru", "en"];

export const dynamicParams = false;

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

function isLang(x: string): x is Lang {
  return (LANGS as string[]).includes(x);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  // Заголовок вкладки становится заголовком PDF (поле Title в свойствах).
  return {
    title: { absolute: `${TITLE[lang]} · Jasur Akhmadaliev` },
    robots: { index: false, follow: false },
  };
}

/* Строки на слайде услуг: восемь позиций первой группы на один слайд 16:9
   не помещаются, по четыре помещаются с запасом под самое длинное описание.
   Демо по два: кадр должен быть крупным, иначе на нём ничего не видно. */
const ROWS_PER_SLIDE = 4;
const DEMOS_PER_SLIDE = 2;

function chunks<T>(list: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) out.push(list.slice(i, i + size));
  return out;
}

/* Цена не должна рваться посреди числа: «от 30 000 ₽» переносится только
   после «от». Пробелы внутри числа и перед знаком валюты становятся
   неразрывными. */
function price(s: string): string {
  return s.replace(/(\d) (?=\d)/g, "$1 ").replace(/ ₽/g, " ₽");
}

function permanent(href: string): string {
  return SITE + href;
}

/* Подпись ссылки на демо под услугой: «Живое демо: » и название демо из
   каталога со строчной буквы («разбор входящих заявок»). Имя собственное
   и аббревиатура в начале остаются как есть: «Mia, RAG-ассистент
   клиники», «ИИ-автоответы на отзывы», «AI replies to reviews». Адреса нет
   в каталоге: сборка падает, а не печатает пустую ссылку. */
const CATALOG: Demo[] = [...companyDemos, ...demos, ...productDemos];

function demoLabel(path: string, lang: Lang): string {
  const d = CATALOG.find((x) => x.href === path);
  if (!d) throw new Error(`Демо ${path} из services.ts нет в каталоге`);
  const name = d.name[lang];
  const keep = /^(Mia\b|AI\b|ИИ)/.test(name);
  return `${LIVE_DEMO[lang]}: ${keep ? name : name[0].toLowerCase() + name.slice(1)}`;
}

/* Слайды демо: заголовок раздела на каждом, подводка (lead) только на
   первом слайде раздела, где она есть. */
type Slide =
  | { kind: "services"; title: string; items: Service[] }
  | { kind: "demos"; title: string; lead?: string; items: Demo[] };

function Foot({ lang, n, total }: { lang: Lang; n: number; total: number }) {
  return (
    <footer className="nm-us-foot">
      <span>Jasur Akhmadaliev · {TITLE[lang]}</span>
      <span>
        {n} / {total}
      </span>
    </footer>
  );
}

function ServiceRow({ s, lang }: { s: Service; lang: Lang }) {
  return (
    <div className="nm-us-row">
      <div>
        <h3 className="nm-us-name">{s.name[lang]}</h3>
        {s.sub && <p className="nm-us-sub">{s.sub[lang]}</p>}
      </div>
      <div>
        <p className="nm-us-desc">{s.desc[lang]}</p>
        {s.note && <p className="nm-us-note">{s.note[lang]}</p>}
        {s.demos && (
          <p className="nm-us-link nm-us-links">
            {s.demos.map((path) => (
              <a key={path} href={permanent(path)}>
                {demoLabel(path, lang)}
              </a>
            ))}
          </p>
        )}
      </div>
      <p className="nm-us-price">{price(s.price[lang])}</p>
    </div>
  );
}

function DemoCard({ d, lang }: { d: Demo; lang: Lang }) {
  const href = permanent(d.href);
  return (
    <article className="nm-us-demo">
      <a href={href} className="nm-us-shot">
        <Photo src={demoShot(d, lang)} alt={d.name[lang]} ratio="16:10" priority />
      </a>
      <h3 className="nm-us-dn">{d.name[lang]}</h3>
      <p className="nm-us-dd">{d.desc[lang]}</p>
      <p className="nm-us-sub">{d.tags[lang].join(" · ")}</p>
      <p className="nm-us-link">
        <a href={href}>{WORKS[lang].open}</a>
      </p>
    </article>
  );
}

export default async function Uslugi({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const c = CHROME[lang];

  /* Демо для компаний идут первыми, без подводки: своей утверждённой
     подводки у раздела нет. У локального бизнеса подводка прежняя, из
     карточки «Демо автоматизаций» на /works. */
  const demoSlides = (list: Demo[], title: string, lead?: string): Slide[] =>
    chunks(list, DEMOS_PER_SLIDE).map(
      (items, k): Slide => ({ kind: "demos", title, lead: k === 0 ? lead : undefined, items }),
    );

  const slides: Slide[] = [
    ...GROUPS.flatMap((g) =>
      chunks(g.items, ROWS_PER_SLIDE).map(
        (items): Slide => ({ kind: "services", title: g.title[lang], items }),
      ),
    ),
    ...demoSlides(companyDemos, DEMO_SLIDES.company[lang]),
    ...demoSlides(demos, DEMO_SLIDES.local[lang], WORKS[lang].items.demos.what),
  ];
  // Обложка, слайды выше, контакты.
  const total = slides.length + 2;

  return (
    <div className="nm-us" lang={lang}>
      {/* ——— обложка ——— */}
      <section className="nm-us-s nm-us-cover">
        <p className="nm-us-logo">Jasur Akhmadaliev</p>
        <h1 className="nm-us-title">{TITLE[lang]}</h1>
      </section>

      {slides.map((sl, i) =>
        sl.kind === "services" ? (
          <section key={i} className="nm-us-s">
            <h2 className="nm-us-h">{sl.title}</h2>
            <div className="nm-us-rows">
              {sl.items.map((s) => (
                <ServiceRow key={s.name.ru} s={s} lang={lang} />
              ))}
            </div>
            <Foot lang={lang} n={i + 2} total={total} />
          </section>
        ) : (
          <section key={i} className="nm-us-s">
            <div className="nm-us-dhead">
              <h2 className="nm-us-h">{sl.title}</h2>
              {/* Подводка один раз, на первом слайде раздела: на втором тот
                  же абзац читался бы повтором. */}
              {sl.lead && <p className="nm-us-lead">{sl.lead}</p>}
            </div>
            <div className="nm-us-demos">
              {sl.items.map((d) => (
                <DemoCard key={d.href} d={d} lang={lang} />
              ))}
            </div>
            <Foot lang={lang} n={i + 2} total={total} />
          </section>
        ),
      )}

      {/* ——— контакты, как в подвале сайта (Chrome.tsx, NewFooter) ———
          Почта, LinkedIn и GitHub показаны адресами, а не словами «почта»,
          «LinkedIn»: распечатанный PDF ссылку не откроет, адрес прочитать
          можно. */}
      <section className="nm-us-s nm-us-end">
        <h2 className="nm-us-write">{c.write}</h2>
        <div>
          <div className="nm-us-cline">
            <span className="nm-us-k">{c.message}</span>
            <a className="nm-us-v" href="https://t.me/biznesmind">
              @biznesmind
            </a>
          </div>
          <div className="nm-us-cline">
            <span className="nm-us-k">{c.read}</span>
            <a className="nm-us-v" href="https://t.me/head_of_ceo">
              @head_of_ceo
            </a>
          </div>
        </div>
        <p className="nm-us-small">
          <a href="mailto:jasurakhmadaliev283@gmail.com">jasurakhmadaliev283@gmail.com</a>
          <a href="https://www.linkedin.com/in/jasur-akhmadaliev">linkedin.com/in/jasur-akhmadaliev</a>
          <a href="https://github.com/jayco2610">github.com/jayco2610</a>
        </p>
        <footer className="nm-us-foot">
          <span>2026</span>
          <span>
            Jasur Akhmadaliev · {total} / {total}
          </span>
        </footer>
      </section>
    </div>
  );
}
