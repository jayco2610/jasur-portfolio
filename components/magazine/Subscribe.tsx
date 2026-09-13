"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { useLanguage } from "@/context/LanguageContext";

type State = "idle" | "sending" | "done" | "bad" | "off";

export default function Subscribe() {
  const { lang } = useLanguage();
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
      } else {
        const data = (await res.json()) as { reason?: string };
        setState(data.reason === "off" ? "off" : "bad");
      }
    } catch {
      setState("off");
    }
  }

  return (
    <section className="sub">
      <div className="sub-tx">
        <h3>{ru ? "Чтобы не пропустить" : "So you do not miss it"}</h3>
        <p>
          {ru
            ? "Новая статья или выпуск подкаста, ничего больше. Никакой рассылки по расписанию."
            : "A new piece or a podcast episode, nothing else. No scheduled newsletter."}
        </p>
      </div>

      <div className="sub-ways">
        <a
          href="https://t.me/head_of_ceo"
          target="_blank"
          rel="noopener noreferrer"
          className="sub-tg"
          onClick={() => track("subscribe_telegram")}
        >
          <span>{ru ? "Читать в Телеграме" : "Follow on Telegram"}</span>
          <i aria-hidden="true">→</i>
        </a>

        <form onSubmit={send} className="sub-mail">
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
        <p className={`sub-note${state === "done" ? " is-ok" : ""}`}>
          {state === "done" &&
            (ru ? "Готово. Напишу, когда выйдет новое." : "Done. I will write when something new is out.")}
          {state === "bad" && (ru ? "Проверьте адрес." : "Check the address.")}
          {state === "off" &&
            (ru
              ? "Подписка сейчас не работает. Приходите в Телеграм, там точно не пропустите."
              : "Email signup is down right now. Telegram works.")}
        </p>
      )}
    </section>
  );
}
