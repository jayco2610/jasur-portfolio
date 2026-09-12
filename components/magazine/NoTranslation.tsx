"use client";

import { useLanguage } from "@/context/LanguageContext";

// Показывается, только если человек переключил язык, а у этого текста
// перевода нет. Молча оставлять его перед чужим языком нечестно.
export default function NoTranslation({ postLang }: { postLang: "ru" | "en" }) {
  const { lang } = useLanguage();
  if (lang === postLang) return null;

  return (
    <p className="mag-nolang">
      {postLang === "ru"
        ? "This one has not been translated yet. The text below is in Russian."
        : "Этот текст пока не переведён. Ниже английская версия."}
    </p>
  );
}
