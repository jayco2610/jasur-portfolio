import { redirect } from "next/navigation";

// Отдельной страницы у /blog нет: журнал живёт на /writing.
// Без этого адрес отдавал «страница не найдена».
export default function BlogIndex() {
  redirect("/writing");
}
