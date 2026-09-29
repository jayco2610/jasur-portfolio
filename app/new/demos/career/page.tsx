import { NewHeader, NewFooter } from "../../Chrome";
import CareerDemo from "./CareerDemo";

/* /new/demos/career. Серверная обёртка: шапка и подвал макета, внутри
   клиентское демо. В меню подсвечены «Работы»: пункта «Демо» нет. */
export default function NewCareerDemo() {
  return (
    <>
      <NewHeader here="works" />
      <div>
        <CareerDemo />
        <NewFooter />
      </div>
    </>
  );
}
