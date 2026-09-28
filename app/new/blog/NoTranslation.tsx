"use client";

import { useLanguage } from "@/context/LanguageContext";

/* Перенос components/magazine/NoTranslation.tsx. Показывается, только если
   у текста нет перевода, а человек раньше выбрал другой язык интерфейса.
   Молча оставлять его перед чужим языком нечестно. Сейчас пара есть у всех
   статей, и пометка не появляется нигде, но правило должно работать, как
   только выйдет текст без перевода. */
export default function NoTranslation({ postLang }: { postLang: "ru" | "en" }) {
  const { lang } = useLanguage();
  if (lang === postLang) return null;

  return (
    <p className="nm-nolang">
      {postLang === "ru"
        ? "This one has not been translated yet. The text below is in Russian."
        : "Этот текст пока не переведён. Ниже английская версия."}
    </p>
  );
}
