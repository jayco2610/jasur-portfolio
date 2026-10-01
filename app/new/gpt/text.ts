/* Надписи JasurGPT в макете на двух языках. Любая новая надпись заводится
   сразу в обоих, иначе при переключении вылезет русское слово.

   Тексты переписки те же, что Жасур видел и утвердил в лаборатории, когда
   выбирал вариант «Титр» (ветка jasurgpt-variants). Подпись кнопки
   «Спросите у JasurGPT» его дословная. */

export type L = "ru" | "en";

export const CHAT = {
  ru: {
    ask: "Спросите у JasurGPT",
    sub: "Отвечает о Жасуре",
    greet: "Спросите об опыте Жасура, его проектах или о том, как с ним связаться.",
    chips: ["Какой у Жасура опыт?", "Что он запустил сам?", "Как с ним связаться?"],
    you: "Вы",
    placeholder: "Ваш вопрос",
    send: "Спросить",
    close: "Закрыть",
    noResponse: "Нет ответа.",
    connError: "Ошибка соединения. Попробуйте ещё раз.",
  },
  en: {
    ask: "Ask JasurGPT",
    sub: "Answers about Jasur",
    greet: "Ask about Jasur's experience, his projects, or how to reach him.",
    chips: ["What is Jasur's experience?", "What has he shipped himself?", "How can I reach him?"],
    you: "You",
    placeholder: "Your question",
    send: "Ask",
    close: "Close",
    noResponse: "No response.",
    connError: "Connection error. Try again.",
  },
} as const;
