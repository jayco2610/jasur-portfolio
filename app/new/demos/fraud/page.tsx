import { NewHeader, NewFooter } from "../../Chrome";
import type { Metadata } from "next";
import FraudDemo from "./FraudDemo";
import { pageMeta, SITE_NAME } from "../../meta";
import { demoMetaText } from "../list";
import { t } from "@/lib/translations";

const m = demoMetaText("/new/demos/fraud");
export const metadata: Metadata = pageMeta({
  title: `${m.name} · ${t.ru.demos.label} · ${SITE_NAME}`,
  description: m.desc,
});

/* /new/demos/fraud. Серверная обёртка: шапка и подвал макета, внутри
   клиентское демо. В меню подсвечены «Работы»: пункта «Демо» нет. */
export default function NewFraudDemo() {
  return (
    <>
      <NewHeader here="works" />
      <div>
        <FraudDemo />
        <NewFooter />
      </div>
    </>
  );
}
