"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import DemoShell from "@/components/demos/DemoShell";

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
      "The pitch: every unanswered review on Yandex Maps or 2GIS costs new customers. AI drafts the replies, the manager only approves.",
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
      "Питч: каждый отзыв без ответа на Яндекс Картах или 2ГИС стоит новых клиентов. ИИ готовит черновики ответов, менеджер только утверждает.",
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

function Stars({ rating }: { rating: number }) {
  return (
    <span className="font-mono text-xs text-amber-400/90">
      {"★".repeat(rating)}
      <span className="text-white/15">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

// Reveal text with a typing effect.
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

export default function ReviewsDemoPage() {
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
    >
      {/* Tone toggle */}
      <div className="flex items-center gap-3 mb-8">
        <span className="font-mono text-xs text-white/40">{c.tone}:</span>
        {(["neutral", "warm"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTone(t)}
            className={`font-mono text-xs px-3 py-1.5 rounded border transition-colors ${
              tone === t
                ? "bg-[#7C3AED] border-[#7C3AED] text-white"
                : "border-white/15 text-white/50 hover:border-white/30"
            }`}
          >
            {t === "neutral" ? c.toneNeutral : c.toneWarm}
          </button>
        ))}
        {error && <span className="font-mono text-xs text-amber-400/90 ml-2">{error}</span>}
      </div>

      <div className="space-y-4 max-w-3xl">
        {REVIEWS.map((r) => (
          <div key={r.id} className="p-5 bg-[#111111] border border-[#1f1f1f] rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-8 rounded-full bg-[#7C3AED]/25 text-[#a78bfa] flex items-center justify-center font-mono text-xs">
                {r.name[lang][0]}
              </span>
              <div>
                <p className="font-mono text-xs font-bold text-white">{r.name[lang]}</p>
                <Stars rating={r.rating} />
              </div>
              <span className="ml-auto font-mono text-[9px] text-white/30 border border-white/10 rounded px-1.5 py-0.5 uppercase tracking-wider">
                {r.source}
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-3">{r.text[lang]}</p>

            {replies[r.id] ? (
              <div className="mt-3 pl-4 border-l-2 border-[#7C3AED]/50">
                <p className="font-mono text-[10px] text-[#a78bfa] uppercase tracking-wider mb-1">{c.replyLabel}</p>
                <p className="text-sm text-white/75 leading-relaxed">
                  <TypedText text={replies[r.id]} />
                </p>
              </div>
            ) : (
              <button
                onClick={() => reply(r.id, r.text[lang], r.rating)}
                disabled={loadingId !== null}
                className="font-mono text-xs px-4 py-2 bg-[#7C3AED] text-white rounded hover:bg-[#6d28d9] transition-colors disabled:opacity-50"
              >
                {loadingId === r.id ? c.replying : c.replyBtn}
              </button>
            )}
          </div>
        ))}

        {/* Custom review */}
        <div className="p-5 bg-[#111111] border border-[#7C3AED]/25 rounded-lg">
          <p className="font-mono text-xs font-bold text-white mb-3">{c.customTitle}</p>
          <textarea
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder={c.customPlaceholder}
            className="w-full bg-[#0d0d0d] border border-[#1f1f1f] rounded-lg px-3 py-2.5 text-sm text-white/80 placeholder:text-white/25 focus:outline-none focus:border-[#7C3AED]/50 resize-none"
          />
          <div className="flex items-center gap-3 mt-3">
            <span className="font-mono text-xs text-white/40">{c.customRating}:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setCustomRating(n)}
                className={`font-mono text-sm ${n <= customRating ? "text-amber-400" : "text-white/20"} hover:text-amber-300 transition-colors`}
              >
                ★
              </button>
            ))}
            <button
              onClick={() => reply("custom", customText.trim(), customRating)}
              disabled={loadingId !== null || customText.trim().length < 10}
              className="ml-auto font-mono text-xs px-4 py-2 bg-[#7C3AED] text-white rounded hover:bg-[#6d28d9] transition-colors disabled:opacity-40"
            >
              {loadingId === "custom" ? c.replying : c.customBtn}
            </button>
          </div>
          {replies.custom && (
            <div className="mt-4 pl-4 border-l-2 border-[#7C3AED]/50">
              <p className="font-mono text-[10px] text-[#a78bfa] uppercase tracking-wider mb-1">{c.replyLabel}</p>
              <p className="text-sm text-white/75 leading-relaxed">
                <TypedText text={replies.custom} />
              </p>
            </div>
          )}
        </div>
      </div>
    </DemoShell>
  );
}
