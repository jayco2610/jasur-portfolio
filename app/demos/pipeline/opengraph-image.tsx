import { ogCard } from "../../_og/card";
import { companyMetaText } from "../list-company";

/* Картинка превью ссылки на демо, 1200 × 630: название из каталога.
   Как устроена и откуда шрифт, см. app/_og/card.tsx. */

const m = companyMetaText("/demos/pipeline");

export const alt = m.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return ogCard({ title: m.name, kicker: "Демо" });
}
