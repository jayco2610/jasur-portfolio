/* Общая обвязка макета: служебная полоса, шапка и подвал.

   Вынесено из page.tsx в отдельный файл, потому что теперь страниц пять, а не
   одна. Пока разметка шапки лежала внутри главной, любая правка отступа или
   ссылки расходилась бы по пяти файлам, и блог уже ловил ровно это: разные
   высоты и форматы в двух списках, собранных по отдельности.

   Оба компонента серверные: состояния в них нет, липкость держит CSS. */

const NAV = [
  { t: "Log", href: "/new/log" },
  { t: "Работы", href: "/new/works" },
  { t: "Мастерская", href: "/new/workshop" },
  { t: "Обо мне", href: "/new/about" },
];

/* Отступ шапки сверху (--nm-head-top в CSS) равен высоте служебной полосы.
   Полоса на живом сайте исчезнет вместе с этим компонентом, и тогда
   шапка просто прилипнет к нулю. */
export function NewHeader({ here }: { here?: string }) {
  return (
    <>
      <div className="nm-lab">
        <div className="nm-wrap nm-lab-in">
          <span className="nm-lab-note">
            Макет · {here ? `${here} · ` : ""}не продакшен
          </span>
        </div>
      </div>

      <header className="nm-head">
        <div className="nm-wrap nm-head-in">
          <a className="nm-logo" href="/new">
            Jasur Akhmadaliev
          </a>
          <nav className="nm-nav">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={here === n.t ? "is-here" : undefined}
                aria-current={here === n.t ? "page" : undefined}
              >
                {n.t}
              </a>
            ))}
          </nav>
          {/* переключатель языка нерабочий, только вид */}
          <div className="nm-lang">
            <span className="is-on">RU</span>
            <span className="is-off">EN</span>
          </div>
        </div>
      </header>
    </>
  );
}

/* Блок 5 по ТЗ: контакты разделены по действию, формы нет, в подвале
   год и имя. Один и тот же на всех пяти страницах. */
export function NewFooter() {
  return (
    <section className="nm-wrap nm-contacts">
      <h2 className="nm-h2">Пишите</h2>

      <div className="nm-cline">
        <span className="nm-cline-k">Написать</span>
        <a className="nm-cline-v nm-ink-link" href="https://t.me/biznesmind">
          @biznesmind
        </a>
      </div>

      <div className="nm-cline">
        <span className="nm-cline-k">Читать</span>
        <a className="nm-cline-v" href="https://t.me/head_of_ceo">
          @head_of_ceo
        </a>
      </div>

      <p className="nm-small">
        <a href="mailto:jasurakhmadaliev283@gmail.com">почта</a>
        <a href="https://www.linkedin.com/in/jasur-akhmadaliev">LinkedIn</a>
        <a href="https://github.com/jayco2610">GitHub</a>
      </p>

      <footer className="nm-foot">
        <span>2026</span>
        <span>Jasur Akhmadaliev</span>
      </footer>
    </section>
  );
}
