import { NewHeader, NewFooter } from "../../Chrome";
import type { Metadata } from "next";
import LeftoversDemo from "./LeftoversDemo";
import { pageMeta, SITE_NAME } from "../../meta";
import { demoMetaText } from "../list";
import { t } from "@/lib/translations";

const m = demoMetaText("/demos/leftovers");
export const metadata: Metadata = pageMeta({
  title: `${m.name} · ${t.ru.demos.label} · ${SITE_NAME}`,
  description: m.desc,
});

/* /demos/leftovers. Серверная обёртка: шапка и подвал макета, внутри
   клиентское демо. В меню подсвечены «Работы»: пункта «Демо» нет. */
export default function NewLeftoversDemo() {
  return (
    <>
      <NewHeader here="works" />
      <div>
        <LeftoversDemo />
        <NewFooter />
      </div>
    </>
  );
}
