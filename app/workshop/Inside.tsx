"use client";

import { useId, useState, type ReactNode } from "react";
import Photo from "../Photo";
import type { WsItem, WsTable } from "../strings";

/* Пункт блока «Что внутри» на /workshop: видимые заголовок и строка, по
   плюсу справа раскрывается полное описание с примером поста.

   Зачем. Жасур о странице: «если бы я попал и прочитал, я бы не прошёл, не
   продаёт». Одной строки под заголовком мало, чтобы понять, что будет в
   канале, поэтому у каждого пункта есть то, что открывается: что внутри,
   пример поста, таблица или кадр демо, формат (тексты в strings.ts).

   Как устроено.
   - Кнопка это вся строка заголовка: название слева, плюс справа. Она
     внутри h2, поэтому заголовки остаются заголовками для читалки, а
     состояние слышно по aria-expanded. Enter и пробел работают сами:
     это настоящая кнопка.
   - По умолчанию все пункты закрыты. Состояние у каждого пункта своё,
     ByLang собирает тело страницы дважды, и id у русского и английского
     пункта разные (useId).
   - Закрытая панель не видна и для читалки, и для Tab: visibility: hidden
     включается после того, как высота схлопнулась (new.css, .nm-acc-*).
     Высота анимируется через grid-template-rows 0fr/1fr, при
     prefers-reduced-motion без анимации.
   - На плюсе метка data-fab-avoid: всплывающая «Спросите у JasurGPT»
     уходит, пока стоит поверх плюса (gpt/Gpt.tsx), и не закрывает его на
     телефоне при прокрутке. */

/* Неразрывные пробелы: «0 ₽», «10 $» и единица после числа («6-40 с»,
   «5 тыс. т», «5 thousand t») не рвутся по строкам. */
function nb(s: string): string {
  return s
    .replace(/(\d) (?=[₽$])/g, "$1 ")
    .replace(/(\d|тыс\.|thousand) (т|t|с|s)(?=$|[\s,.;])/g, "$1 $2");
}

/* Абзац примера поста: "\n" внутри становится переносом строки, абзац в
   **...** целиком выводится жирным. */
function PostPara({ text }: { text: string }) {
  const strong = text.startsWith("**") && text.endsWith("**");
  const body = strong ? text.slice(2, -2) : text;
  const lines = body.split("\n");
  const content: ReactNode[] = lines.flatMap((l, i) => (i ? [<br key={`b${i}`} />, nb(l)] : [nb(l)]));
  return <p>{strong ? <strong>{content}</strong> : content}</p>;
}

function Table({ t, capId }: { t: WsTable; capId: string }) {
  return (
    <figure className="nm-acc-fig">
      {/* Обёртка прокручивается вбок, если таблица шире колонки (на
          телефоне). role и tabIndex: прокрутку можно сделать клавишами. */}
      <div className="nm-acc-scroll" role="region" aria-labelledby={capId} tabIndex={0}>
        <table className={`nm-acc-tbl${t.head.length > 3 ? " is-wide" : ""}`}>
          <thead>
            <tr>
              {t.head.map((h, i) => (h ? <th key={i} scope="col">{h}</th> : <td key={i} />))}
            </tr>
          </thead>
          <tbody>
            {t.rows.map((r) => (
              <tr key={r[0]}>
                <th scope="row">{nb(r[0])}</th>
                {r.slice(1).map((c, i) => (
                  <td key={i}>{nb(c)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption id={capId} className="nm-acc-cap">
        {t.cap}
      </figcaption>
    </figure>
  );
}

export default function Inside({
  item,
  labels,
  opt = false,
}: {
  item: WsItem;
  labels: { inside: string; post: string; format: string; openDemo: string };
  opt?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const btn = `${id}-b`;
  const panel = `${id}-p`;
  const cap = `${id}-c`;
  const m = item.more;

  return (
    <div className={`nm-item nm-acc${opt ? " is-opt" : ""}${open ? " is-open" : ""}`}>
      <h2 className="nm-item-t">
        <button
          type="button"
          id={btn}
          className="nm-acc-btn"
          aria-expanded={open}
          aria-controls={panel}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="nm-acc-t">{item.t}</span>
          <span className="nm-acc-ic" aria-hidden="true" data-fab-avoid="" />
        </button>
      </h2>
      <p className="nm-item-d">{item.d}</p>

      <div id={panel} className="nm-acc-panel" role="region" aria-labelledby={btn}>
        <div className="nm-acc-clip">
          <div className="nm-acc-body">
            <div className="nm-acc-sec">
              <p className="nm-acc-k">{labels.inside}</p>
              <ul className="nm-acc-list">
                {m.inside.map((x) => (
                  <li key={x}>{nb(x)}</li>
                ))}
              </ul>
            </div>

            <div className="nm-acc-sec">
              <p className="nm-acc-k">{labels.post}</p>
              <div>
                <blockquote className="nm-acc-post">
                  {m.post.map((p) => (
                    <PostPara key={p} text={p} />
                  ))}
                </blockquote>

                {m.table && <Table t={m.table} capId={cap} />}

                {m.shot && (
                  <figure className="nm-acc-fig">
                    {/* Кадр ведёт туда же, куда ссылка под ним; для читалки
                        и Tab скрыт, чтобы переход не звучал дважды. */}
                    <a className="nm-acc-shot" href={m.shot.href} tabIndex={-1} aria-hidden="true">
                      <Photo src={m.shot.src} alt="" ratio="16:10" />
                    </a>
                    <figcaption className="nm-acc-cap">
                      {/* Описание кадра для читалки: сам кадр скрыт вместе
                          со ссылкой. sr-only из Tailwind (globals.css). */}
                      <span className="sr-only">{m.shot.alt}. </span>
                      {m.shot.cap}
                    </figcaption>
                    <p className="nm-work-l nm-acc-open">
                      <a href={m.shot.href}>{labels.openDemo}</a>
                    </p>
                  </figure>
                )}
              </div>
            </div>

            <div className="nm-acc-sec">
              <p className="nm-acc-k">{labels.format}</p>
              <p className="nm-acc-fmt">{m.format}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
