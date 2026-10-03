"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

/* Живая Mia прямо на странице демо. Раньше здесь стояла кнопка на
   пространство Hugging Face, которое засыпало и не отвечало.

   Вопрос уходит в /api/mia вместе с последними шестью репликами, отвечает
   модель строго по документу клиники (lib/mia.ts). Три готовых вопроса те
   же, что в пошаговом разборе ниже. Ошибка хранится кодом, а не текстом:
   переключатель языка переводит и её.

   Под ответом стоит «Источник: раздел» с раскрывающейся цитатой из
   фрагмента документа, по которому модель отвечала (их присылает
   /api/mia). Цитата всегда из русского документа, название раздела на
   языке страницы.

   Вопрос, на который модель не ответила, остаётся в переписке, но в
   историю для следующего запроса не идёт: иначе модель получила бы два
   вопроса подряд без ответа между ними.

   Цвет: окно красится переменными интерфейса демо (demos-color.css,
   .nm-dm-live), у Mia это бирюзовый. Прокручивается только переписка, а
   не страница: ответ не дёргает экран. */

type Source = { id: string; title: string; titleEn: string; quote: string };
type Turn = { role: "user" | "assistant"; content: string; failed?: boolean; sources?: Source[] };
type ErrCode = "busy" | "daily" | "rate_limited" | "network";

const MAX_QUESTION = 500;
const MAX_HISTORY = 6;

const copy = {
  en: {
    title: "Mia · live assistant",
    status: "online",
    empty: "Ask about prices, services or treatment terms",
    typing: "searching the clinic document…",
    placeholder: "Your question about the clinic",
    send: "Send",
    source: "Source",
    sendLabel: "Send the question",
    inputLabel: "Question for Mia",
    errors: {
      busy: "Mia can't answer right now: the free models are overloaded. Try again in a minute.",
      daily: "The free daily limit is used up. Try again tomorrow; the walkthrough below works without it.",
      rate_limited: "Too many questions in a row. Wait a minute and ask again.",
      network: "Could not reach Mia. Check the connection and try again.",
    },
    note: "Live: a model answers strictly from the MIA.RF clinic document. Below is a step-by-step look at how it works inside.",
  },
  ru: {
    title: "Mia · живой ассистент",
    status: "online",
    empty: "Спросите о ценах, услугах или условиях лечения",
    typing: "ищу в документе клиники…",
    placeholder: "Ваш вопрос о клинике",
    send: "Отправить",
    source: "Источник",
    sendLabel: "Отправить вопрос",
    inputLabel: "Вопрос для Mia",
    errors: {
      busy: "Mia сейчас не может ответить: бесплатные модели перегружены. Попробуйте через минуту.",
      daily: "Бесплатный лимит на сегодня исчерпан. Попробуйте завтра; пошаговый разбор ниже работает и без него.",
      rate_limited: "Слишком много вопросов подряд. Подождите минуту и спросите снова.",
      network: "Не получилось связаться с Mia. Проверьте связь и попробуйте ещё раз.",
    },
    note: "Живой ассистент: отвечает модель, строго по документу клиники МИА.РФ. Ниже пошаговый разбор того, как это устроено внутри.",
  },
};

export default function MiaLive({ questions }: { questions: { en: string; ru: string }[] }) {
  const { lang } = useLanguage();
  const c = copy[lang];

  const [turns, setTurns] = useState<Turn[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrCode | null>(null);
  const log = useRef<HTMLDivElement>(null);

  // Новая реплика, ожидание или ошибка: переписка уезжает вниз сама.
  useEffect(() => {
    const el = log.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, loading, error]);

  async function ask(text: string) {
    const question = text.trim().slice(0, MAX_QUESTION);
    if (!question || loading) return;
    const history = turns
      .filter((t) => !t.failed)
      .slice(-MAX_HISTORY)
      .map(({ role, content }) => ({ role, content }));
    setTurns((prev) => [...prev, { role: "user", content: question }]);
    setDraft("");
    setError(null);
    setLoading(true);
    let failure: ErrCode | null = null;
    try {
      const res = await fetch("/api/mia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && typeof data?.content === "string" && data.content) {
        const sources: Source[] = Array.isArray(data.sources)
          ? data.sources.filter(
              (x: Source) => x && typeof x.title === "string" && typeof x.titleEn === "string" && typeof x.quote === "string"
            )
          : [];
        setTurns((prev) => [...prev, { role: "assistant", content: data.content, sources }]);
      } else {
        const code = data?.error;
        failure = code === "daily" || code === "rate_limited" ? code : "busy";
      }
    } catch {
      failure = "network";
    }
    if (failure) {
      setTurns((prev) => prev.map((t, i) => (i === prev.length - 1 ? { ...t, failed: true } : t)));
      setError(failure);
    }
    setLoading(false);
  }

  return (
    <div className="nm-dm-live-wrap">
      <div className="nm-dm-live">
        <div className="nm-dm-chat-h">
          <div className="nm-dm-ava">
            <span className="nm-dm-emo">🦷</span>
          </div>
          <div>
            <p className="nm-dm-chat-t">{c.title}</p>
            <p className="nm-dm-chat-s">{c.status}</p>
          </div>
        </div>

        <div className="nm-dm-chat nm-dm-live-log" ref={log} aria-live="polite">
          {turns.length === 0 && !loading && !error && <p className="nm-dm-empty">{c.empty}</p>}
          {turns.map((t, i) => (
            <div key={i} className={`nm-dm-msg nm-dm-in${t.role === "user" ? " is-out" : ""}`}>
              <p>{t.content}</p>
              {t.sources && t.sources.length > 0 && (
                <div className="nm-dm-cites">
                  {t.sources.map((src) => (
                    <details key={src.id} className="nm-dm-cite">
                      <summary>
                        {c.source}: {lang === "en" ? src.titleEn : src.title}
                      </summary>
                      <p className="nm-dm-cite-q">{src.quote}</p>
                    </details>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="nm-dm-msg is-typing">
              <p className="nm-dm-msg-d">{c.typing}</p>
            </div>
          )}
          {error && (
            <p className="nm-dm-err nm-dm-in" role="alert">
              {c.errors[error]}
            </p>
          )}
        </div>

        <div className="nm-dm-opts">
          {questions.map((q) => (
            <button key={q.en} type="button" className="nm-dm-opt" onClick={() => ask(q[lang])} disabled={loading}>
              {q[lang]}
            </button>
          ))}
        </div>

        <form
          className="nm-dm-live-f"
          onSubmit={(e) => {
            e.preventDefault();
            ask(draft);
          }}
        >
          <input
            type="text"
            className="nm-dm-area"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={MAX_QUESTION}
            placeholder={c.placeholder}
            aria-label={c.inputLabel}
            enterKeyHint="send"
            autoComplete="off"
          />
          <button
            type="submit"
            className={`nm-dm-btn${loading ? " is-busy" : ""}`}
            disabled={loading || !draft.trim()}
            aria-label={c.sendLabel}
          >
            {c.send}
          </button>
        </form>
      </div>
      <p className="nm-dm-note nm-dm-live-note">{c.note}</p>
    </div>
  );
}
