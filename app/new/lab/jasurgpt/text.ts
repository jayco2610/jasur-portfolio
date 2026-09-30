/* Тексты лаборатории JasurGPT на двух языках. Любая новая надпись
   заводится сразу в обоих, иначе при переключении вылезет русское слово. */

export type V = "a" | "b" | "c";
export type L = "ru" | "en";

export const LAB = {
  ru: {
    strip: "Лаборатория · JasurGPT · три варианта, на сайт пойдёт один",
    langAction: "Switch to English",
    tabs: { a: "Титр", b: "Субтитры", c: "Проявка" },
    desc: {
      a: "Экран уходит в чёрный. Портрет проявляется из темноты с медленным наездом, под ним начальный титр. Потом портрет отходит влево, справа открывается переписка, ответы печатаются.",
      b: "Сверху и снизу въезжают чёрные полосы, кадр становится широким, фокус переходит из размытия в резкость. Ответ идёт субтитром внизу кадра, вся переписка под кадром.",
      c: "Страница остаётся светлой. Портрет проявляется, как фотография, и сжимается в аватарку над колонкой чата. Переписка набрана как статья журнала.",
    },
    spec: "Вступление до 2,5 секунды, повторно в этой вкладке 0,6. Пропускается кликом или любой клавишей.",
    ask: "Спросить JasurGPT",
    replay: "Показать вступление целиком ещё раз",
  },
  en: {
    strip: "Lab · JasurGPT · three variants, one goes live",
    langAction: "Переключить на русский",
    tabs: { a: "Title card", b: "Subtitles", c: "Developing" },
    desc: {
      a: "The screen fades to black. The portrait emerges from the dark with a slow push, an opening title appears beneath it. Then the portrait moves left, the conversation opens on the right, and answers type out.",
      b: "Black bars slide in from top and bottom, the frame turns widescreen, and focus pulls from blur to sharp. The answer runs as a subtitle at the bottom of the frame, the full conversation sits below.",
      c: "The page stays light. The portrait develops like a photograph and shrinks into an avatar above the chat column. The conversation is set like a magazine article.",
    },
    spec: "Intro up to 2.5 seconds, 0.6 on repeat in this tab. Click or press any key to skip.",
    ask: "Ask JasurGPT",
    replay: "Play the full intro again",
  },
} as const;

export const CHAT = {
  ru: {
    sub: "Отвечает о Жасуре",
    greet: "Спросите об опыте Жасура, его проектах или о том, как с ним связаться.",
    start: "С чего начать",
    chips: ["Какой у Жасура опыт?", "Что он запустил сам?", "Как с ним связаться?"],
    you: "Вы",
    placeholder: "Ваш вопрос",
    send: "Спросить",
    close: "Закрыть",
    transcript: "Переписка",
    noResponse: "Нет ответа.",
    connError: "Ошибка соединения. Попробуйте ещё раз.",
  },
  en: {
    sub: "Answers about Jasur",
    greet: "Ask about Jasur's experience, his projects, or how to reach him.",
    start: "Where to start",
    chips: ["What is Jasur's experience?", "What has he shipped himself?", "How can I reach him?"],
    you: "You",
    placeholder: "Your question",
    send: "Ask",
    close: "Close",
    transcript: "Transcript",
    noResponse: "No response.",
    connError: "Connection error. Try again.",
  },
} as const;
