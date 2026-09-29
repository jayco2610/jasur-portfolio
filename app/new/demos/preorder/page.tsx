import { NewHeader, NewFooter } from "../../Chrome";
import PreorderDemo from "./PreorderDemo";

/* /new/demos/preorder. Серверная обёртка: шапка и подвал макета, внутри
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
