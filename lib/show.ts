// Отдельно от lib/podcast.ts, потому что тот читает файлы и не может
// попасть в браузерную сборку, а название и тип выпуска нужны и на клиенте.

export const SHOW = {
  name: "Product Talks",
  cover: "/podcast/cover.jpg",
  ru: {
    tagline: "Подкаст о том, как делать продукты, которые имеют значение.",
    about:
      "Разговоры и короткие голосовые про продукт, бизнес, маркетинг и AI. Без гостей ради гостей: зову тех, у кого есть что рассказать, и говорю сам, когда есть что сказать.",
  },
  en: {
    tagline: "A podcast about building products that matter.",
    about:
      "Conversations and short voice notes on product, business, marketing and AI. No guests for the sake of guests: I invite people who have something to say, and speak myself when I do.",
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
