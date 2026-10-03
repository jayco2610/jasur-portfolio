"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { hit } from "@/components/Pulse";

/* Подписка: телеграм и почта. Две разные вещи рядом, потому что читатель
   выбирает не «подписаться или нет», а «где ему удобнее».

   Отправка идёт в тот же /api/subscribe, что и на живой странице, и состояния
   те же: отправляется, готово, плохой адрес, подписка выключена. Отдельное
   состояние «off» нужно потому, что почтовая подписка может быть отключена
   на стороне сервера, и тогда честнее увести человека в телеграм, а не
   показывать ошибку.

   События аналитики те же, что у старого компонента: подписка по почте
   (track subscribe_email и hit subscribe, на /stats это «Подписок на
   журнал») и нажатие на телеграм (track subscribe_telegram). Переход в
   телеграм для /stats считает Pulse сам, по любой ссылке на t.me, поэтому
   hit здесь второй раз не шлётся. Пока подписка жила в макете на /new,
   событий не было; при переезде 2 октября 2026 они вернулись.

   Английские подписи дословно из живого компонента
   (components/magazine/Subscribe.tsx): блок стоит и под английскими
   статьями, и русские слова там были бы дырой в переводе. Язык приходит
   пропом от страницы, а не из интерфейса: под английским текстом подписка
   английская, что бы ни было выбрано в переключателе раньше. */

type State = "idle" | "sending" | "done" | "bad" | "rate" | "off";

export default function Subscribe({ lang = "ru" }: { lang?: "ru" | "en" }) {
  const ru = lang === "ru";
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setState("done");
        setEmail("");
        track("subscribe_email");
        hit("subscribe");
      } else {
        const data = (await res.json()) as { reason?: string };
        setState(data.reason === "off" ? "off" : data.reason === "rate" ? "rate" : "bad");
      }
    } catch {
      setState("off");
    }
  }

  return (
    <section className="nm-subs">
      <h2 className="nm-subs-t">{ru ? "Подписка" : "Subscribe"}</h2>
      <p className="nm-subs-d">
        {ru
          ? "Новая статья или выпуск подкаста, ничего больше. Рассылки по расписанию не будет."
          : "A new piece or a podcast episode, nothing else. No scheduled newsletter."}
      </p>

      <div className="nm-subs-ways">
        <a
          className="nm-btn"
          href="https://t.me/head_of_ceo"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("subscribe_telegram")}
        >
          {ru ? "Читать в телеграме" : "Follow on Telegram"}
        </a>

        <form className="nm-subs-mail" onSubmit={send}>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (state !== "idle" && state !== "sending") setState("idle");
            }}
            placeholder={ru ? "Почта" : "Email"}
            aria-label={ru ? "Почта" : "Email"}
            required
            disabled={state === "done"}
          />
          <button type="submit" disabled={state === "sending" || state === "done"}>
            {state === "sending" ? "…" : ru ? "Подписаться" : "Subscribe"}
          </button>
        </form>
      </div>

      {state !== "idle" && state !== "sending" && (
        <p className="nm-subs-note">
          {state === "done" &&
            (ru ? "Готово. Напишу, когда выйдет новое." : "Done. I will write when something new is out.")}
          {state === "bad" && (ru ? "Проверьте адрес." : "Check the address.")}
          {state === "rate" && (ru ? "Слишком много попыток. Попробуйте через минуту." : "Too many tries. Please wait a minute.")}
          {state === "off" &&
            (ru
              ? "Подписка по почте сейчас не работает. В телеграме всё приходит сразу."
              : "Email signup is down right now. On Telegram everything arrives right away.")}
        </p>
      )}
    </section>
  );
}
