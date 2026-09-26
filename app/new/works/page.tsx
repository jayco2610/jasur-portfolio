import type { Metadata } from "next";
import { NewHeader, NewFooter } from "../Chrome";

export const metadata: Metadata = {
  title: "Работы · макет",
  robots: { index: false, follow: false },
};

/* Ветка 02 по ТЗ. Задача страницы: показать руки, а не продать продукты.

   Названия, стек и адреса взяты из lib/translations.ts (русский блок
   projects.projects) — то есть из того же источника, что живая страница
   /projects. Описания сжаты до одной строки: в карточке по ТЗ ровно четыре
   элемента, и абзац на пять строк ломает строй списка.

   Статусов нет: решение Жасура. Метрики стоят внутри строки описания и
   только там, где они действительно есть, отдельного блока под них нет. */

const WORKS = [
  {
    name: "abcx",
    what:
      "Память продукта для тех, кто строит соло или маленькой командой: фиксируете фичу с гипотезой и метрикой, загружаете события, abcx показывает обрывы в воронке и фичи, которые не держат людей.",
    stack: ["Next.js", "OpenRouter", "Upstash", "Vercel"],
    href: "https://abcx-eight.vercel.app",
  },
  {
    name: "Expat Roadmap SEA",
    what:
      "Платформа для переезда в Юго-Восточную Азию: визы и города, жильё, комьюнити, события, работа. Пять продуктовых направлений, собраны в одиночку.",
    stack: ["Next.js", "Supabase", "Vercel", "TypeScript"],
    href: "https://expat-roadmap-sea.vercel.app",
  },
  {
    name: "AI Career System",
    what:
      "Поиск работы без ручных шагов: ссылка на вакансию уходит в телеграм, система разбирает описание, сравнивает с резюме и отдаёт готовое письмо. 47 вакансий, 80 секунд до письма.",
    stack: ["Claude", "n8n", "Google Sheets", "Telegram"],
    href: "/demos/career",
  },
  {
    name: "Mia",
    what:
      "Ассистент для стоматологической клиники: цены, услуги, часы, процедуры. Отвечает только по документам клиники и показывает, из какого фрагмента собран ответ.",
    stack: ["Python", "RAG", "Groq", "Gradio", "Hugging Face"],
    href: "https://huggingface.co/spaces/rag-jasur/mia-clinic-assistant",
  },
  {
    name: "JasurGPT",
    what:
      "Чат на моём сайте для тех, кому проще спросить, чем читать резюме: отвечает про опыт и проекты по собранному личному контексту.",
    stack: ["Next.js", "OpenRouter", "Vercel", "TypeScript"],
    href: "https://jasur.dev",
  },
  {
    name: "Демо автоматизаций",
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

        <section className="nm-wrap nm-sect">
          <div>
            {WORKS.map((w) => (
              <article key={w.name} className="nm-work">
                <h2 className="nm-work-n">{w.name}</h2>
                <div className="nm-work-b">
                  <p className="nm-work-d">{w.what}</p>
                  <p className="nm-work-s">{w.stack.join(" · ")}</p>
                  <p className="nm-work-l">
                    <a href={w.href}>Открыть</a>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <NewFooter />
      </div>
    </>
  );
}
