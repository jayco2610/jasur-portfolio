import { NewHeader, NewFooter } from "../../Chrome";
import ReviewsDemo from "./ReviewsDemo";

/* /new/demos/reviews. Серверная обёртка: шапка и подвал макета, внутри
   клиентское демо. В меню подсвечены «Работы»: пункта «Демо» нет. */
export default function NewReviewsDemo() {
  return (
    <>
      <NewHeader here="Работы" />
      <div>
        <ReviewsDemo />
        <NewFooter />
      </div>
    </>
  );
}
