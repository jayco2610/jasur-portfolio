import { NewHeader, NewFooter } from "../../Chrome";
import type { Metadata } from "next";
import PreorderDemo from "./PreorderDemo";
import { pageMeta, SITE_NAME } from "../../meta";
import { demoMetaText } from "../list";
import { t } from "@/lib/translations";

const m = demoMetaText("/demos/preorder");
export const metadata: Metadata = pageMeta({
  title: `${m.name} · ${t.ru.demos.label} · ${SITE_NAME}`,
  description: m.desc,
});

/* /demos/preorder. Серверная обёртка: шапка и подвал макета, внутри
   клиентское демо. В меню подсвечены «Работы»: пункта «Демо» нет. */
export default function NewPreorderDemo() {
  return (
    <>
      <NewHeader here="works" />
      <div>
        <PreorderDemo />
        <NewFooter />
      </div>
    </>
  );
}
