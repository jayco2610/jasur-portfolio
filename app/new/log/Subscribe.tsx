"use client";

import { useState } from "react";

/* Подписка: телеграм и почта. Две разные вещи рядом, потому что читатель
   выбирает не «подписаться или нет», а «где ему удобнее».

   Отправка идёт в тот же /api/subscribe, что и на живой странице, и состояния
   те же: отправляется, готово, плохой адрес, подписка выключена. Отдельное
   состояние «off» нужно потому, что почтовая подписка может быть отключена
   на стороне сервера, и тогда честнее увести человека в телеграм, а не
   показывать ошибку.

   Событий аналитики здесь нет намеренно, в отличие от старого компонента:
   /new это макет, и его нажатия не должны подмешиваться в цифры живого
   сайта. При переносе на прод вернуть track/hit. */

type State = "idle" | "sending" | "done" | "bad" | "off";

export default function Subscribe() {
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
      } else {
        const data = (await res.json()) as { reason?: string };
        setState(data.reason === "off" ? "off" : "bad");
      }
    } catch {
      setState("off");
    }
  }

  return (
    <section className="nm-subs">
      <h2 className="nm-subs-t">Чтобы не пропустить</h2>
      <p className="nm-subs-d">
        Новая статья или выпуск подкаста, ничего больше. Рассылки по расписанию
        не будет.
      </p>

      <div className="nm-subs-ways">
        <a
          className="nm-btn"
          href="https://t.me/head_of_ceo"
          target="_blank"
          rel="noopener noreferrer"
        >
          Читать в телеграме
        </a>

        <form className="nm-subs-mail" onSubmit={send}>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (state !== "idle" && state !== "sending") setState("idle");
            }}
            placeholder="Почта"
            aria-label="Почта"
            required
            disabled={state === "done"}
          />
          <button type="submit" disabled={state === "sending" || state === "done"}>
            {state === "sending" ? "…" : "Подписаться"}
          </button>
        </form>
      </div>

      {state !== "idle" && state !== "sending" && (
        <p className="nm-subs-note">
          {state === "done" && "Готово. Напишу, когда выйдет новое."}
          {state === "bad" && "Проверьте адрес."}
          {state === "off" &&
            "Подписка по почте сейчас не работает. В телеграме точно не пропустите."}
        </p>
      )}
    </section>
  );
}
