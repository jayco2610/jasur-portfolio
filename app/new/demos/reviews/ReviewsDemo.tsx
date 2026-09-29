"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import DemoShell from "../DemoShell";

/* ИИ-автоответы на отзывы в макете. Перенос app/demos/reviews/page.tsx:
   те же пять отзывов, переключатель тона, кнопка под каждым отзывом и поле
   для своего отзыва с оценкой. Ответ пишет модель через тот же маршрут
   POST /api/demo (type: "review"), что и на старой странице, своего
   маршрута у макета нет. Ответ печатается по два знака, как раньше.
   Логика строка в строку, меняется только разметка. */

type Review = {
  id: string;
  source: "Яндекс" | "2ГИС";
  rating: number;
  name: { en: string; ru: string };
  text: { en: string; ru: string };
};

const REVIEWS: Review[] = [
  {
    id: "r1",
    source: "Яндекс",
    rating: 5,
    name: { en: "Ekaterina", ru: "Екатерина" },
    text: {
      en: "Great pastries, the cinnamon buns are amazing. Staff is friendly, always clean inside.",
      ru: "Отличная выпечка, булочки с корицей просто супер. Персонал приветливый, внутри всегда чисто.",
    },
  },
  {
    id: "r2",
    source: "2ГИС",
    rating: 2,
    name: { en: "Andrey", ru: "Андрей" },
    text: {
      en: "Waited 15 minutes at the register while two employees were chatting. The pie was good but I almost left.",
      ru: "Простоял на кассе 15 минут, пока два сотрудника болтали. Пирог вкусный, но я чуть не ушёл.",
    },
  },
  {
    id: "r3",
    source: "Яндекс",
    rating: 4,
    name: { en: "Marina", ru: "Марина" },
    text: {
      en: "Good spot for lunch, soups are always fresh. Wish there were more seats at noon.",
      ru: "Хорошее место для обеда, супы всегда свежие. Не хватает мест в полдень.",
    },
  },
  {
    id: "r4",
    source: "2ГИС",
    rating: 1,
    name: { en: "Igor", ru: "Игорь" },
    text: {
      en: "Bought a salad in the evening, it was clearly not fresh. Money wasted, not coming back.",
      ru: "Купил вечером салат, он был явно не свежий. Деньги на ветер, больше не приду.",
    },
  },
  {
    id: "r5",
    source: "Яндекс",
    rating: 3,
    name: { en: "Svetlana", ru: "Светлана" },
    text: {
      en: "Average. Coffee is decent, pastries are hit or miss. Prices went up recently.",
      ru: "Средне. Кофе нормальный, выпечка когда как. Цены недавно выросли.",
    },
  },
];

const copy = {
  en: {
    title: "AI replies to reviews",
    subtitle:
      "Managers spend hours answering reviews on maps services. Here AI does it in seconds: click a review and watch the venue's reply being written. Every reply follows the venue's tone rules.",
    pitch:
      "Every unanswered review on Yandex Maps or 2GIS costs new customers. AI drafts the replies, the manager only approves.",
    tone: "Reply tone",
    toneNeutral: "neutral",
    toneWarm: "warm",
    replyBtn: "Reply with AI",
    replying: "writing…",
    replyLabel: "Venue's reply",
    unavailable: "Generation is unavailable right now. Try again in a minute.",
    customTitle: "Try your own review",
    customPlaceholder: "Paste any customer review here…",
    customRating: "Rating",
    customBtn: "Generate a reply",
  },
  ru: {
    title: "ИИ-автоответы на отзывы",
    subtitle:
      "Менеджеры тратят часы на ответы в Яндекс Картах и 2ГИС. Здесь это делает ИИ за секунды: нажмите на отзыв и посмотрите, как пишется ответ заведения. Каждый ответ следует правилам тона заведения.",
    pitch:
      "Каждый отзыв без ответа на Яндекс Картах или 2ГИС стоит новых клиентов. ИИ готовит черновики ответов, менеджер только утверждает.",
    tone: "Тон ответа",
    toneNeutral: "нейтральный",
    toneWarm: "тёплый",
    replyBtn: "Ответить с ИИ",
    replying: "пишу…",
    replyLabel: "Ответ заведения",
    unavailable: "Генерация сейчас недоступна. Попробуйте через минуту.",
    customTitle: "Проверьте на своём отзыве",
    customPlaceholder: "Вставьте сюда любой отзыв клиента…",
    customRating: "Оценка",
    customBtn: "Сгенерировать ответ",
  },
};

/* Звёзды: закрашенные чёрным, пустые серым. Раньше закрашенные были
   оранжевыми, в макете цвета нет. */
function Stars({ rating }: { rating: number }) {
  return (
    <span className="nm-dm-stars" aria-label={`${rating}/5`}>
      {"★".repeat(rating)}
      <i>{"★".repeat(5 - rating)}</i>
    </span>
  );
}

// Текст ответа появляется с эффектом печати.
function TypedText({ text }: { text: string }) {
  const [state, setState] = useState({ text, shown: 0 });
  if (state.text !== text) setState({ text, shown: 0 });
  useEffect(() => {
    const interval = setInterval(() => {
      setState((s) => {
        if (s.shown >= s.text.length) {
          clearInterval(interval);
          return s;
        }
        return { ...s, shown: s.shown + 2 };
      });
    }, 18);
    return () => clearInterval(interval);
  }, [text]);
  return <>{state.text === text ? text.slice(0, state.shown) : ""}</>;
}

function Reply({ label, text }: { label: string; text: string }) {
  return (
    <div className="nm-dm-quote">
      <p className="nm-dm-quote-k">{label}</p>
      <p className="nm-dm-quote-t">
        <TypedText text={text} />
      </p>
    </div>
  );
}

export default function ReviewsDemo() {
  const { lang } = useLanguage();
  const c = copy[lang];

  const [tone, setTone] = useState<"neutral" | "warm">("warm");
  const [replies, setReplies] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [customText, setCustomText] = useState("");
  const [customRating, setCustomRating] = useState(3);

  async function reply(id: string, text: string, rating: number) {
    setLoadingId(id);
    setError(null);
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "review", lang, review: text, rating, tone }),
      });
      const data = await res.json();
      if (!res.ok || !data.content) {
        setError(c.unavailable);
      } else {
        setReplies((prev) => ({ ...prev, [id]: data.content }));
      }
    } catch {
      setError(c.unavailable);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <DemoShell
      title={{ en: copy.en.title, ru: copy.ru.title }}
      subtitle={{ en: copy.en.subtitle, ru: copy.ru.subtitle }}
      pitch={{ en: copy.en.pitch, ru: copy.ru.pitch }}
      hint={{ en: "Press Reply with AI under any review, or paste your own review below.", ru: "Нажмите «Ответить с ИИ» под любым отзывом или вставьте свой отзыв в поле внизу." }}
    >
      {/* Тон ответа */}
      <div className="nm-dm-row is-tight">
        <span className="nm-dm-label nm-dm-tone-k">{c.tone}:</span>
        {(["neutral", "warm"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTone(t)}
            className={`nm-dm-btn2 is-s${tone === t ? " is-on" : ""}`}
            aria-pressed={tone === t}
          >
            {t === "neutral" ? c.toneNeutral : c.toneWarm}
          </button>
        ))}
        {error && <span className="nm-dm-err nm-dm-tone-err">{error}</span>}
      </div>

      <div className="nm-dm-reviews nm-dm-stack nm-dm-mt">
        {REVIEWS.map((r) => (
          <div key={r.id} className="nm-dm-panel">
            <div className="nm-dm-rev-h">
              <span className="nm-dm-ava">{r.name[lang][0]}</span>
              <div>
                <p className="nm-dm-rev-n">{r.name[lang]}</p>
                <Stars rating={r.rating} />
              </div>
              <span className="nm-dm-src">{r.source}</span>
            </div>
            <p className="nm-dm-rev-t is-dim">{r.text[lang]}</p>

            {replies[r.id] ? (
              <Reply label={c.replyLabel} text={replies[r.id]} />
            ) : (
              <button
                type="button"
                onClick={() => reply(r.id, r.text[lang], r.rating)}
                disabled={loadingId !== null}
                className="nm-dm-btn is-s"
              >
                {loadingId === r.id ? c.replying : c.replyBtn}
              </button>
            )}
          </div>
        ))}

        {/* Свой отзыв */}
        <div className="nm-dm-panel is-on">
          <p className="nm-dm-rev-n nm-dm-custom-t">{c.customTitle}</p>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder={c.customPlaceholder}
            className="nm-dm-area"
          />
          <div className="nm-dm-rate">
            <span className="nm-dm-label nm-dm-tone-k">{c.customRating}:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCustomRating(n)}
                className={`nm-dm-star${n <= customRating ? " is-on" : ""}`}
                aria-label={`${n}/5`}
                aria-pressed={n === customRating}
              >
                ★
              </button>
            ))}
            <button
              type="button"
              onClick={() => reply("custom", customText.trim(), customRating)}
              disabled={loadingId !== null || customText.trim().length < 10}
              className="nm-dm-btn is-s"
            >
              {loadingId === "custom" ? c.replying : c.customBtn}
            </button>
          </div>
          {replies.custom && (
            <div className="nm-dm-mts">
              <Reply label={c.replyLabel} text={replies.custom} />
            </div>
          )}
        </div>
      </div>
    </DemoShell>
  );
}
