import type { Metadata } from "next";
import Photo from "../Photo";
import { NewHeader, NewFooter } from "../Chrome";

export const metadata: Metadata = {
  title: "Работы · макет",
  robots: { index: false, follow: false },
};

/* Ветка 02 по ТЗ. Задача страницы: показать руки, а не продать продукты.

   Названия, стек и адреса взяты из lib/translations.ts (русский блок
   projects.projects) — то есть из того же источника, что живая страница
   /projects. Описания сжаты до одной строки: в карточке по ТЗ четыре элемента
   плюс скриншот, и абзац на пять строк ломает строй сетки.

   Статусов нет: решение Жасура. Метрики стоят внутри строки описания и
   только там, где они действительно есть, отдельного блока под них нет.

   Скриншоты в public/new/works сняты с живых адресов, окно 1600 × 1000,
   первый экран, ширина 1200. Два исключения: Mia снята с демо на сайте
   (/demos/mia), потому что пространство на Hugging Face спит и показывает
   кнопку перезапуска; JasurGPT снят с главной живого сайта с открытым
   чатом: адрес jasur.dev из ссылки «Открыть» не открывается, домен
   не находится (проверено 28 сентября 2026). */

const WORKS = [
  {
    name: "abcx",
    shot: "/new/works/abcx.jpg",
    what:
      "Память продукта для тех, кто строит соло или маленькой командой: фиксируете фичу с гипотезой и метрикой, загружаете события, abcx показывает обрывы в воронке и фичи, которые не держат людей.",
    stack: ["Next.js", "OpenRouter", "Upstash", "Vercel"],
    href: "https://abcx-eight.vercel.app",
  },
  {
    name: "Expat Roadmap SEA",
    shot: "/new/works/expat.jpg",
    what:
      "Платформа для переезда в Юго-Восточную Азию: визы и города, жильё, комьюнити, события, работа. Пять продуктовых направлений, собраны в одиночку.",
    stack: ["Next.js", "Supabase", "Vercel", "TypeScript"],
    href: "https://expat-roadmap-sea.vercel.app",
  },
  {
    name: "AI Career System",
    shot: "/new/works/career.jpg",
    what:
      "Поиск работы без ручных шагов: ссылка на вакансию уходит в телеграм, система разбирает описание, сравнивает с резюме и отдаёт готовое письмо. 47 вакансий, 80 секунд до письма.",
    stack: ["Claude", "n8n", "Google Sheets", "Telegram"],
    href: "/demos/career",
  },
  {
    name: "Mia",
    shot: "/new/works/mia.jpg",
    what:
      "Ассистент для стоматологической клиники: цены, услуги, часы, процедуры. Отвечает только по документам клиники и показывает, из какого фрагмента собран ответ.",
    stack: ["Python", "RAG", "Groq", "Gradio", "Hugging Face"],
    href: "https://huggingface.co/spaces/rag-jasur/mia-clinic-assistant",
  },
  {
    name: "JasurGPT",
    shot: "/new/works/jasurgpt.jpg",
    what:
      "Чат на моём сайте для тех, кому проще спросить, чем читать резюме: отвечает про опыт и проекты по собранному личному контексту.",
    stack: ["Next.js", "OpenRouter", "Vercel", "TypeScript"],
    href: "https://jasur.dev",
  },
  {
    name: "Демо автоматизаций",
    shot: "/new/works/demos.jpg",
    what:
      "Четыре демо для локального бизнеса, работают в браузере с телефона: предзаказ с трибуны, слив вечерних остатков, алерты о фроде на кассе, ответы на отзывы в картах.",
    stack: ["Next.js", "OpenRouter", "Telegram WebApp", "СБП"],
    href: "/demos",
  },
];

export default function NewWorks() {
  return (
    <>
      <NewHeader here="Работы" />

      <div>
        <section className="nm-wrap nm-ptop">
          <h1 className="nm-h1-p">
            Шесть штук,
            <br />
            собранных
            <br />
            в одиночку
          </h1>
          <div className="nm-lead">
            <p>
              Код, дизайн, тексты. Всё работает, всё открывается по ссылке.
            </p>
          </div>
        </section>

        {/* Карточки сеткой, скриншот 16:10 сверху. Все одной высоты: ряды
            сетки равны самому высокому (grid-auto-rows: 1fr в .nm-wk), а
            «Открыть» прижата к низу карточки. Скриншот ведёт туда же, куда
            «Открыть»; для чтения с экрана он скрыт, чтобы ссылка не
            звучала дважды. */}
        <section className="nm-wrap nm-sect">
          <div className="nm-wk">
            {WORKS.map((w) => (
              <article key={w.name} className="nm-wk-card">
                <a
                  className="nm-wk-shot"
                  href={w.href}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <Photo src={w.shot} alt="" ratio="16:10" />
                </a>
                <h2 className="nm-wk-n">{w.name}</h2>
                <p className="nm-wk-d">{w.what}</p>
                <p className="nm-work-s">{w.stack.join(" · ")}</p>
                <p className="nm-work-l nm-wk-l">
                  <a href={w.href}>Открыть</a>
                </p>
              </article>
            ))}
          </div>
        </section>

        <NewFooter />
      </div>
    </>
  );
}
