/* Телефон для демо: корпус, строка состояния, экран.

   Перенос components/demos/PhoneFrame.tsx: время в строке состояния и
   содержимое экрана (className старого никто не передавал). Старый
   рисует тёмный скруглённый корпус с фиолетовым свечением, и поменять это
   можно только в разметке, поэтому здесь своя копия: рамка в пиксель, вырез
   чёрным прямоугольником, строка состояния тем же шрифтом, что весь макет.

   Состояния нет, поэтому директива "use client" не нужна: компонент
   собирается там же, где стоит демо, внутри которого он используется. */
export default function PhoneFrame({
  children,
  time = "19:30",
}: {
  children: React.ReactNode;
  time?: string;
}) {
  return (
    <div className="nm-dm-phone">
      <div className="nm-dm-screen">
        <div className="nm-dm-status">
          {/* Фрод-контроль передаёт текущее время. Сервер собирает страницу
              заранее, и его время с временем в браузере не совпадает; без
              пометки React ругается на расхождение (ошибка 418) и
              перерисовывает весь экран заново. */}
          <span suppressHydrationWarning>{time}</span>
          <span className="nm-dm-notch" aria-hidden="true" />
          <span>
            <span className="nm-dm-batt" aria-hidden="true" />
            LTE
          </span>
        </div>
        <div className="nm-dm-screen-in">{children}</div>
        <div className="nm-dm-home" aria-hidden="true" />
      </div>
    </div>
  );
}
