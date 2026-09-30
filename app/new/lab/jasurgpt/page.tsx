import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMeta, SITE_NAME } from "../../meta";
import Lab from "./Lab";
import "./lab.css";

/* Лаборатория JasurGPT: три варианта того, как открывается чат. Вариант
   выбирается параметром ?v=a, ?v=b, ?v=c.

   Страница черновая и живёт только в ветке jasurgpt-variants. Закрыта от
   поиска (noindex в pageMeta) и ни одна страница сайта на неё не
   ссылается. После выбора варианта в прод идёт только он, а сама
   лаборатория не сливается в main.

   Suspense нужен из-за useSearchParams: без него сборка отказалась бы
   собирать страницу статически. */
export const metadata: Metadata = pageMeta({
  title: `JasurGPT · лаборатория · ${SITE_NAME}`,
  description: "Три варианта того, как открывается чат JasurGPT. Черновая страница для выбора.",
});

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Lab />
    </Suspense>
  );
}
