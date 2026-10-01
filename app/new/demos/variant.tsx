"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

/* Цветные варианты демо. Только в ветке demos-color: Жасур выбирает
   один из трёх, в прод уходит только выбранный, а этот файл вместе с
   переключателем удаляется.

   Вариант берётся из адреса: ?v=1, ?v=2, ?v=3. Без параметра демо такие,
   как на живом сайте, монохромные.

   Как вариант доходит до стилей. Обёртка раздела (VariantRoot) ставит себе
   атрибут data-v, а весь цвет живёт в demos-color.css под селектором
   .nm-dmv[data-v]. Сервер собирает страницы заранее и адреса не видит,
   поэтому в разметке с сервера атрибута нет. Чтобы цвет не включался с
   опозданием, после загрузки скриптов, первым ребёнком обёртки стоит
   маленький встроенный скрипт: он читает адрес и ставит атрибут ещё до
   того, как браузер нарисует демо. Дальше React держит тот же атрибут сам.

   Номер варианта нужен и в разметке: ссылки каталога и «Все демо» несут
   ?v= дальше, каталог берёт кадры нужного варианта, фрод-контроль
   переставляет цифры внутрь панели. Для этого useVariant. */

export type Variant = 0 | 1 | 2 | 3;

function parse(search: string): Variant {
  const m = /[?&]v=([123])(?:&|$)/.exec(search);
  return m ? (Number(m[1]) as Variant) : 0;
}

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

export function useVariant(): Variant {
  return useSyncExternalStore(
    subscribe,
    () => parse(window.location.search),
    () => 0,
  );
}

/* Ссылка внутри раздела с тем же вариантом. */
export function withVariant(href: string, v: Variant): string {
  return v ? `${href}?v=${v}` : href;
}

const SET_ATTR =
  "(function(){var m=/[?&]v=([123])(?:&|$)/.exec(location.search);if(m)document.currentScript.parentNode.setAttribute('data-v',m[1])})()";

export function VariantRoot({ children }: { children: React.ReactNode }) {
  const v = useVariant();
  return (
    <div className="nm-dmv" data-v={v || undefined} suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: SET_ATTR }} />
      <VariantBar v={v} />
      {children}
    </div>
  );
}

const LABELS = {
  ru: { title: "Цвет демо", names: ["Сейчас", "Один акцент", "Свой продукт", "Тёмные"] },
  en: { title: "Demo colour", names: ["Current", "One accent", "Own product", "Dark"] },
};

/* Переключатель вариантов сверху страницы. Обычные ссылки, а не Link:
   страница перезагружается целиком, и встроенный скрипт выше ставит
   вариант заново, без промежуточного кадра. */
function VariantBar({ v }: { v: Variant }) {
  const path = usePathname();
  const { lang } = useLanguage();
  const l = LABELS[lang];
  return (
    <nav className="nm-dmv-bar" aria-label={l.title}>
      <div className="nm-wrap nm-dmv-bar-in">
        <span className="nm-dmv-bar-t">{l.title}</span>
        {([0, 1, 2, 3] as const).map((n) => (
          /* Выбранный пункт подсвечивает CSS по data-n и атрибуту обёртки,
             а не класс: так подсветка верна с первого кадра, до React. */
          <a
            key={n}
            href={withVariant(path, n)}
            data-n={n}
            aria-current={v === n ? "page" : undefined}
          >
            {n ? `${n} · ` : ""}
            {l.names[n]}
          </a>
        ))}
      </div>
    </nav>
  );
}
