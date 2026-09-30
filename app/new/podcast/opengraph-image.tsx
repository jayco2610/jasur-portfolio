import { ogCard } from "../_og/card";

/* Картинка превью ссылки для этого раздела, 1200 × 630. Как устроена и
   откуда шрифт, см. app/new/_og/card.tsx. Собирается при сборке. */

export const alt = "Jasur / Talks";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return ogCard({ title: "Подкаст", kicker: "Jasur / Talks", mark: true });
}
