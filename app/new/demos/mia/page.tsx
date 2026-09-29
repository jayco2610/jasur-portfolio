import { NewHeader, NewFooter } from "../../Chrome";
import MiaDemo from "./MiaDemo";

/* /new/demos/mia. Серверная обёртка: шапка и подвал макета, внутри
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
