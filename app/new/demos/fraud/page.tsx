import { NewHeader, NewFooter } from "../../Chrome";
import FraudDemo from "./FraudDemo";

/* /new/demos/fraud. Серверная обёртка: шапка и подвал макета, внутри
   клиентское демо. В меню подсвечены «Работы»: пункта «Демо» нет. */
export default function NewFraudDemo() {
  return (
    <>
      <NewHeader here="Работы" />
      <div>
        <FraudDemo />
        <NewFooter />
      </div>
    </>
  );
}
