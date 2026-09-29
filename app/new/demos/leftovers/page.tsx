import { NewHeader, NewFooter } from "../../Chrome";
import LeftoversDemo from "./LeftoversDemo";

/* /new/demos/leftovers. Серверная обёртка: шапка и подвал макета, внутри
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
