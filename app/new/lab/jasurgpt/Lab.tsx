"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { preload } from "react-dom";
import { useLanguage } from "@/context/LanguageContext";
import { CHAT, LAB, type V } from "./text";
import { VariantA, VariantB, VariantC, type Mode, type Msg } from "./Variants";

/* Страница выбора: три переключателя, описание варианта и кнопка, которая
   открывает чат в выбранном варианте.

   Чат настоящий. Запрос тот же, что у components/JasurGPT.tsx: POST на
   /api/chat, в теле вся переписка { messages }, ответ в data.content, при
   пустом ответе и при сбое сети своя строка. Отличие одно: не шлётся
   событие статистики chat_ask, чтобы проверки в лаборатории не
   попадали в счётчик вопросов живого JasurGPT.

   Длинное вступление играет при первом открытии варианта во вкладке,
   дальше короткое. Метка лежит в sessionStorage отдельно для каждого
   варианта, чтобы все три можно было сравнить с полным вступлением. */

const ALL: V[] = ["a", "b", "c"];
const seenKey = (v: V) => `jgpt-lab-seen-${v}`;
const PORTRAIT = "/new/portret.jpg";

export default function Lab() {
  const params = useSearchParams();
  const raw = params.get("v");
  const v: V = raw === "b" || raw === "c" ? raw : "a";
  const { lang, toggle } = useLanguage();
  const s = LAB[lang];

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("full");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [fresh, setFresh] = useState(-1);
  const askRef = useRef<HTMLButtonElement>(null);

  // Портрет грузится заранее, чтобы во вступлении не проявлялась пустота.
  preload(PORTRAIT, { as: "image", fetchPriority: "high" });

  function openChat(forceFull = false) {
    if (open) return;
    let reduced = false;
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      reduced = false;
    }
    let seen = false;
    try {
      seen = !forceFull && sessionStorage.getItem(seenKey(v)) === "1";
      sessionStorage.setItem(seenKey(v), "1");
    } catch {
      seen = false;
    }
    setMode(reduced ? "none" : seen ? "short" : "full");
    setOpen(true);
  }

  function close() {
    setOpen(false);
    requestAnimationFrame(() => askRef.current?.focus());
  }

  function replay() {
    try {
      for (const x of ALL) sessionStorage.removeItem(seenKey(x));
    } catch {
      // без sessionStorage вступление и так каждый раз полное
    }
    openChat(true);
  }

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const c = CHAT[lang];
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

  const props = { lang, mode, messages, loading, fresh, send, onClose: close };

  return (
    <>
      <div className="nm-lab" inert={open}>
        <div className="nm-wrap nm-lab-in">
          <span className="nm-lab-note">{s.strip}</span>
        </div>
      </div>

      <section className="nm-wrap nm-gl" inert={open}>
        <div className="nm-gl-top">
          <h1 className="nm-h1-p">JasurGPT</h1>
          <button type="button" className="nm-lang" onClick={toggle} aria-label={s.langAction}>
            <span className={lang === "ru" ? "is-on" : "is-off"}>RU</span>
            <span className={lang === "ru" ? "is-off" : "is-on"}>EN</span>
          </button>
        </div>

        <nav className="nm-gl-tabs" aria-label="Variants">
          {ALL.map((x) => (
            <Link
              key={x}
              href={{ pathname: "/new/lab/jasurgpt", query: { v: x } }}
              replace
              scroll={false}
              className={`nm-gl-tab${x === v ? " is-here" : ""}`}
              aria-current={x === v ? "page" : undefined}
            >
              <b>{x.toUpperCase()}</b>
              <span>{s.tabs[x]}</span>
            </Link>
          ))}
        </nav>

        <p className="nm-gl-lead">{s.desc[v]}</p>
        <p className="nm-gl-spec">{s.spec}</p>

        <div className="nm-gl-actions">
          <button ref={askRef} type="button" className="nm-gl-ask" onClick={() => openChat()}>
            {s.ask}
          </button>
          <button type="button" className="nm-gl-replay" onClick={replay}>
            {s.replay}
          </button>
        </div>
      </section>

      {open && v === "a" && <VariantA {...props} />}
      {open && v === "b" && <VariantB {...props} />}
      {open && v === "c" && <VariantC {...props} />}
    </>
  );
}
