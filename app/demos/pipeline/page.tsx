import { NewHeader, NewFooter } from "../../Chrome";
import type { Metadata } from "next";
import PipelineDemo from "./PipelineDemo";
import { pageMeta, SITE_NAME } from "../../meta";
import { companyMetaText } from "../list-company";
import { t } from "@/lib/translations";

const m = companyMetaText("/demos/pipeline");
export const metadata: Metadata = pageMeta({
  title: `${m.name} · ${t.ru.demos.label} · ${SITE_NAME}`,
  description: m.desc,
});

/* /demos/pipeline. Серверная обёртка: шапка и подвал, внутри клиентское
   демо. В меню подсвечены «Работы»: пункта «Демо» нет. */
export default function NewPipelineDemo() {
  return (
    <>
      <NewHeader here="works" />
      <div>
        <PipelineDemo />
        <NewFooter />
      </div>
    </>
  );
}
