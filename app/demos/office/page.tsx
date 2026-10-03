import { NewHeader, NewFooter } from "../../Chrome";
import type { Metadata } from "next";
import OfficeDemo from "./OfficeDemo";
import { pageMeta, SITE_NAME } from "../../meta";
import { companyMetaText } from "../list-company";
import { t } from "@/lib/translations";

const m = companyMetaText("/demos/office");
export const metadata: Metadata = pageMeta({
  title: `${m.name} · ${t.ru.demos.label} · ${SITE_NAME}`,
  description: m.desc,
});

/* /demos/office. Серверная обёртка: шапка и подвал, внутри клиентское
   демо. В меню подсвечены «Работы»: пункта «Демо» нет. */
export default function NewOfficeDemo() {
  return (
    <>
      <NewHeader here="works" />
      <div>
        <OfficeDemo />
        <NewFooter />
      </div>
    </>
  );
}
