// Отдельно от lib/podcast.ts, потому что тот читает файлы и не может
// попасть в браузерную сборку, а название и тип выпуска нужны и на клиенте.

export const SHOW = {
  name: "Jasur / Talks",
  cover: "/podcast/cover.jpg",
  topics: ["Product", "Business", "Marketing", "AI", "Life"],
  ru: {
    tagline: "Разговоры о работе, бизнесе, продуктах и жизни.",
    about: "С людьми, у которых есть что сказать.",
    sign: "Jasur.",
  },
  en: {
    tagline: "Conversations about work, business, products and life.",
    about: "With people who have something to say.",
    sign: "Jasur.",
  },
};

// Выпуск это разговор, голосовая заметка это короткая запись без гостя.
// Разделяем их, потому что слушают их по-разному.
export type EpisodeKind = "talk" | "voice";

export type Episode = {
  slug: string;
  number: number;
  kind: EpisodeKind;
  title: string;
  date: string;
  description: string;
  lang: "ru" | "en";
  // Файл в public/podcast или прямая ссылка на чужой хостинг.
  audio: string;
  duration: string;
  cover?: string;
  guest?: string;
  guestRole?: string;
  tags: string[];
  // Тайм-коды: «12:40 — про найм». Секунды считаем сами, чтобы плеер мог
  // перемотать по клику.
  chapters: { at: number; label: string; stamp: string }[];
  links: { href: string; text: string; host: string }[];
  html: string;
  draft?: boolean;
};
