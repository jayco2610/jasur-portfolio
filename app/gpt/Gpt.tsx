"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { preload } from "react-dom";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { hit } from "@/components/Pulse";
import Titr, { PORTRAIT, type Mode, type Msg } from "./Titr";
import { CHAT } from "./text";

/* JasurGPT в макете: одно состояние чата на все страницы и три входа в него.

   Решение Жасура: «обо мне и работы и в других местах как раньше спросите
   у jasurgpt всплывающее». Отсюда:
   - всплывающая кнопка в правом нижнем углу каждой страницы макета, как
     на старом сайте (рисует этот компонент, он стоит в app/layout.tsx);
   - кнопка в тексте «Обо мне» и «Открыть» на карточке JasurGPT в «Работах»
     (GptButton ниже), они открывают тот же чат на месте.

   Старый виджет components/JasurGPT.tsx удалён при переезде макета на
   главную 2 октября 2026: этот компонент заменил его на всём сайте.

   Запрос тот же, что у старого виджета: POST на /api/chat, в теле вся
   переписка { messages }, ответ в data.content, при пустом ответе и при
   сбое сети своя строка. Каждый вопрос отправляет событие статистики
   chat_ask, как и старый виджет: на странице /stats это строка «Вопросов
   JasurGPT». В лаборатории событие было выключено, здесь оно нужно.

   Переписка живёт, пока открыта страница: закрыли окно и открыли снова,
   вопросы на месте. Переход по ссылке макета перезагружает страницу, и
   переписка начинается заново, как на старом сайте.

   Окно оформлено как диалог (role="dialog", aria-modal). Пока оно открыто,
   всё остальное на странице inert: ни мышь, ни Tab туда не попадают, и
   фокус остаётся внутри окна. После закрытия фокус возвращается на ту
   кнопку, которая окно открыла. */

type Ctx = { open: (opener?: HTMLElement | null) => void; warm: () => void };

const GptContext = createContext<Ctx>({ open: () => {}, warm: () => {} });

/* Метка «вступление уже видели в этой вкладке»: полное вступление 2,5 с
   играет один раз, дальше короткое, 0,6 с. */
const SEEN = "jgpt-titr-seen";

export function GptProvider({ children }: { children: ReactNode }) {
  const { lang } = useLanguage();
  const c = CHAT[lang];

  const [isOpen, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("full");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [fresh, setFresh] = useState(-1);
  const [away, setAway] = useState(false);
  const [inDemo, setInDemo] = useState(false);
  const pathname = usePathname();
  const opener = useRef<HTMLElement | null>(null);
  const fab = useRef<HTMLButtonElement>(null);
  const [warmed, setWarmed] = useState(false);

  /* Портрет вступления (178 КБ) не грузится с каждой страницей: только
     когда к кнопке потянулись (наведение, фокус, касание). Если нажали
     сразу, вступление само подождёт снимок (Titr.tsx). */
  const warm = useCallback(() => setWarmed(true), []);
  if (warmed) preload(PORTRAIT, { as: "image", fetchPriority: "high" });

  const open = useCallback((el?: HTMLElement | null) => {
    setWarmed(true);
    opener.current = el ?? (document.activeElement as HTMLElement | null);
    let reduced = false;
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      reduced = false;
    }
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN) === "1";
      sessionStorage.setItem(SEEN, "1");
    } catch {
      seen = false;
    }
    setMode(reduced ? "none" : seen ? "short" : "full");
    setOpen(true);
  }, []);

  function close() {
    setOpen(false);
    const back = opener.current;
    requestAnimationFrame(() => {
      if (back && back.isConnected && !back.closest("[inert]")) back.focus({ preventScroll: true });
      else fab.current?.focus({ preventScroll: true });
    });
  }

  async function send(text: string) {
    if (!text.trim() || loading) return;
    hit("chat_ask");
    const userMsg: Msg = { role: "user", content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await res.json();
      setFresh(history.length);
      setMessages((prev) => [...prev, { role: "assistant", content: data.content || c.noResponse }]);
    } catch {
      setFresh(history.length);
      setMessages((prev) => [...prev, { role: "assistant", content: c.connError }]);
    } finally {
      setLoading(false);
    }
  }

  /* Кнопка уходит, пока в фокусе поле ввода самой страницы: почта в
     подписке, поля демо. На телефоне клавиатура поднимает кнопку прямо к
     этому полю и закрывала бы его или кнопку отправки. */
  useEffect(() => {
    const isField = (t: EventTarget | null) =>
      t instanceof HTMLElement &&
      !t.closest(".nm-gx") &&
      (t.isContentEditable ||
        t instanceof HTMLTextAreaElement ||
        t instanceof HTMLSelectElement ||
        (t instanceof HTMLInputElement &&
          !["button", "submit", "reset", "checkbox", "radio", "range", "file", "image", "color"].includes(t.type)));
    const onIn = (e: FocusEvent) => setAway(isField(e.target));
    const onOut = (e: FocusEvent) => {
      if (!isField(e.relatedTarget)) setAway(false);
    };
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  /* Демо. Интерфейс демо (.nm-dm-stage) сделан под телефон и под палец:
     варианты вопросов у Mia стоят внизу экрана телефона, кнопки «Ответить
     с ИИ» в отзывах, «Сканировать QR» в предзаказе. Когда человек смотрит
     на демо целиком, всё это оказывается ровно у нижнего края окна, под
     плашкой. Поэтому кнопка уходит, как только первая кнопка или поле
     демо доходит до уровня плашки, и возвращается, когда весь интерфейс
     демо уехал выше неё, то есть у подписи под демо и у подвала. На первом
     экране демо (заголовок, подводка) она видна. Одно переключение туда и
     одно обратно, без мигания на каждой кнопке. Адрес в зависимостях: «Все
     демо» и рубрики Log переходят без перезагрузки, а layout с этим
     компонентом при таком переходе остаётся. */
  useEffect(() => {
    const stage = document.querySelector(".nm-dm-stage");
    let raf = 0;
    const check = () => {
      raf = 0;
      if (!stage) {
        setInDemo(false);
        return;
      }
      const r = stage.getBoundingClientRect();
      const first = (stage.querySelector("button, input, textarea, select, a[href]") ?? stage).getBoundingClientRect();
      const f = fab.current?.getBoundingClientRect();
      const fabTop = f && f.height ? f.top : window.innerHeight - 80;
      const fabBottom = f && f.height ? f.bottom : window.innerHeight;
      setInDemo(first.top < fabBottom && r.bottom > fabTop);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    on();
    if (!stage) return () => cancelAnimationFrame(raf);
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [pathname]);

  return (
    <GptContext.Provider value={{ open, warm }}>
      {/* display: contents: обёртка не создаёт своей коробки, вёрстка и
          липкие шапки страниц ведут себя так же, как без неё. Нужна она
          ради inert на время открытого окна. */}
      <div style={{ display: "contents" }} inert={isOpen}>
        {children}
        <div className="nm-fab-room" aria-hidden="true" />
        <button
          ref={fab}
          type="button"
          className={`nm-fab${away || inDemo ? " is-away" : ""}`}
          hidden={isOpen}
          onClick={(e) => open(e.currentTarget)}
          onPointerEnter={warm}
          onFocus={warm}
          onTouchStart={warm}
        >
          {c.ask}
        </button>
      </div>
      {isOpen && (
        <Titr
          lang={lang}
          mode={mode}
          messages={messages}
          loading={loading}
          fresh={fresh}
          send={send}
          onClose={close}
        />
      )}
    </GptContext.Provider>
  );
}

/* Кнопка-вход внутри страницы: «Спросите у JasurGPT» на «Обо мне»,
   «Открыть» и скриншот на карточке JasurGPT в «Работах». */
export function GptButton({
  className,
  children,
  hideFromReaders,
}: {
  className?: string;
  children?: ReactNode;
  /* Скриншот карточки: для читалки экрана скрыт, чтобы вход не звучал
     дважды подряд, как у соседних карточек. */
  hideFromReaders?: boolean;
}) {
  const { open, warm } = useContext(GptContext);
  const { lang } = useLanguage();
  return (
    <button
      type="button"
      className={className}
      onClick={(e) => open(e.currentTarget)}
      onPointerEnter={warm}
      onFocus={warm}
      onTouchStart={warm}
      tabIndex={hideFromReaders ? -1 : undefined}
      aria-hidden={hideFromReaders || undefined}
    >
      {children ?? CHAT[lang].ask}
    </button>
  );
}
