import { NewHeader, NewFooter } from "../../Chrome";
import type { Metadata } from "next";
import MiaDemo from "./MiaDemo";
import { pageMeta, SITE_NAME } from "../../meta";
import { demoMetaText } from "../list";
import { t } from "@/lib/translations";

const m = demoMetaText("/demos/mia");
export const metadata: Metadata = pageMeta({
  title: `${m.name} · ${t.ru.demos.label} · ${SITE_NAME}`,
  description: m.desc,
});

/* /demos/mia. Серверная обёртка: шапка и подвал макета, внутри
   клиентское демо. В меню подсвечены «Работы»: пункта «Демо» нет. */
export default function NewMiaDemo() {
  return (
    <>
      <NewHeader here="works" />
      <div>
        <MiaDemo />
        <NewFooter />
      </div>
    </>
  );
}
