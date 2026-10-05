"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "@/context/LanguageContext";
import { RESUME } from "../strings";
import { RESUME_LIMIT, RESUME_ROLES, isValidEmail, type ResumeRole } from "@/lib/resumeRequest";

/* Кнопка «Запросить резюме» на «Обо мне» и окно-анкета.

   Решение Жасура: страница прежде всего для работодателей и HR, анкета
   прямо на сайте, без перехода в Telegram (HR и директора, особенно
   иностранные, часто в нём не сидят). Пять вопросов по одному на экран,
   ответы уходят на /api/resume-request, оттуда Жасуру в Telegram через бота
   Мастерской. Язык резюме: язык сайта в момент запроса, отдельно не
   спрашивается.

   Окно сделано родным <dialog> с showModal(). Это даёт без своего кода:
   верхний слой поверх всего (всплывающая кнопка JasurGPT и полоса куки
   оказываются под ним), остальная страница inert, фокус не уходит из окна,
   Escape закрывает. Фокус после закрытия возвращается на кнопку явно:
   Safari при клике по кнопке фокус на неё не ставит, и вернуть его сам
   браузер не может.

   Окно рисуется порталом в #nm-root, а не рядом с кнопкой: внутри текста
   «Обо мне» на него действовали бы правила абзацев (.nm-about-tx p), а
   <form> и <dialog> внутри абзаца ломают разметку. В #nm-root остаются
   шрифты и переменные сайта.

   Ответы живут в состоянии этого компонента: закрыли окно на третьем
   вопросе, открыли снова, ответы и номер вопроса на месте. После отправки
   повторное открытие показывает «Спасибо», второй запрос с той же страницы
   не уходит. При ошибке сервера ответы тоже не теряются, кнопка
   «Отправить ещё раз». */

type Answers = {
  role: ResumeRole | "";
  roleOther: string;
  company: string;
  what: string;
  email: string;
  telegram: string;
};

const EMPTY: Answers = { role: "", roleOther: "", company: "", what: "", email: "", telegram: "" };
const TOTAL = 5;

type Status = "idle" | "sending" | "net" | "rate" | "bad" | "done";

export default function ResumeRequest({
  className,
  describedBy,
}: {
  className?: string;
  describedBy?: string;
}) {
  const { lang } = useLanguage();
  const s = RESUME[lang];
  const ids = useId();
  const qId = `${ids}-q`;
  const errId = `${ids}-err`;

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [emailBad, setEmailBad] = useState(false);

  const opener = useRef<HTMLButtonElement>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const trap = useRef<HTMLInputElement>(null);
  const downOnBackdrop = useRef(false);

  const done = status === "done";
  const sending = status === "sending";

  /* Открытие: showModal до первой отрисовки, прокрутка страницы под окном
     выключена, как у JasurGPT. */
  useLayoutEffect(() => {
    if (!open) return;
    const d = dlg.current;
    if (!d) return;
    if (!d.open) d.showModal();
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
      if (d.open) d.close();
    };
  }, [open]);

  /* Фокус на главном элементе вопроса: выбранная роль или первая, поле
     «Другое», поле ввода, на последнем экране заголовок «Спасибо». Помечен
     атрибутом data-autofocus. */
  const otherShown = a.role === "other";
  useEffect(() => {
    if (!open) return;
    dlg.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus({ preventScroll: true });
  }, [open, step, done, otherShown]);

  function close() {
    dlg.current?.close();
  }

  // Родное событие close: и кнопка «Закрыть», и Escape, и клик мимо окна.
  function onClosed() {
    setOpen(false);
    requestAnimationFrame(() => opener.current?.focus({ preventScroll: true }));
  }

  function set<K extends keyof Answers>(key: K, value: Answers[K]) {
    setA((prev) => ({ ...prev, [key]: value }));
    if (status !== "sending" && status !== "done") setStatus("idle");
    if (key === "email") setEmailBad(false);
  }

  function pickRole(role: ResumeRole) {
    setA((prev) => ({ ...prev, role }));
    if (role !== "other") setStep(1);
  }

  const canNext =
    step === 0
      ? a.role !== "" && (a.role !== "other" || a.roleOther.trim() !== "")
      : step === 1
        ? a.company.trim() !== ""
        : step === 2
          ? a.what.trim() !== ""
          : step === 3
            ? a.email.trim() !== ""
            : true;

  async function send(telegram: string) {
    setStatus("sending");
    try {
      const res = await fetch("/api/resume-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: a.role,
          roleOther: a.role === "other" ? a.roleOther : "",
          company: a.company,
          what: a.what,
          email: a.email,
          telegram,
          lang,
          website: trap.current?.value ?? "",
        }),
        signal: typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(20_000) : undefined,
      });
      if (res.ok) setStatus("done");
      else setStatus(res.status === 429 ? "rate" : res.status === 400 ? "bad" : "net");
    } catch {
      setStatus("net");
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canNext || sending) return;
    if (step === 3 && !isValidEmail(a.email.trim())) {
      setEmailBad(true);
      dlg.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
      return;
    }
    if (step < TOTAL - 1) {
      setStep(step + 1);
      return;
    }
    void send(a.telegram);
  }

  function skip() {
    if (sending) return;
    setA((prev) => ({ ...prev, telegram: "" }));
    void send("");
  }

  function back() {
    if (sending || step === 0) return;
    setStep(step - 1);
    setEmailBad(false);
    setStatus("idle");
  }

  // «Чем занимается»: Enter переходит дальше, Shift+Enter переносит строку.
  function onAreaKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  }

  const error =
    status === "net" ? s.errNet : status === "rate" ? s.errRate : status === "bad" ? s.errBad : emailBad ? s.badEmail : "";

  const questions = [s.qRole, s.qCompany, s.qWhat, s.qEmail, s.qTelegram];
  const goLabel =
    step < TOTAL - 1 ? s.next : sending ? s.sending : status === "net" || status === "rate" || status === "bad" ? s.retry : s.send;

  function field() {
    switch (step) {
      case 0:
        return (
          <>
            <div className="nm-rq-opts" role="group" aria-labelledby={qId}>
              {RESUME_ROLES.map((r, i) => (
                <button
                  key={r}
                  type="button"
                  className="nm-rq-opt"
                  aria-pressed={a.role === r}
                  data-autofocus={(a.role === "" ? i === 0 : a.role === r && r !== "other") || undefined}
                  onClick={() => pickRole(r)}
                >
                  {s.roles[r]}
                </button>
              ))}
            </div>
            {otherShown && (
              <input
                className="nm-rq-field nm-rq-other"
                type="text"
                value={a.roleOther}
                onChange={(e) => set("roleOther", e.target.value)}
                maxLength={RESUME_LIMIT.roleOther}
                aria-label={s.otherLabel}
                placeholder={s.otherPh}
                enterKeyHint="next"
                data-autofocus
              />
            )}
          </>
        );
      case 1:
        return (
          <input
            className="nm-rq-field"
            type="text"
            value={a.company}
            onChange={(e) => set("company", e.target.value)}
            maxLength={RESUME_LIMIT.company}
            aria-labelledby={qId}
            autoComplete="organization"
            enterKeyHint="next"
            data-autofocus
          />
        );
      case 2:
        return (
          <textarea
            className="nm-rq-field"
            rows={2}
            value={a.what}
            onChange={(e) => set("what", e.target.value)}
            onKeyDown={onAreaKey}
            maxLength={RESUME_LIMIT.what}
            aria-labelledby={qId}
            placeholder={s.whatPh}
            enterKeyHint="next"
            data-autofocus
          />
        );
      case 3:
        return (
          <input
            className="nm-rq-field"
            type="email"
            inputMode="email"
            value={a.email}
            onChange={(e) => set("email", e.target.value)}
            maxLength={RESUME_LIMIT.email}
            aria-labelledby={qId}
            aria-invalid={emailBad || undefined}
            aria-describedby={emailBad ? errId : undefined}
            aria-required="true"
            autoComplete="email"
            autoCapitalize="off"
            spellCheck={false}
            placeholder={s.emailPh}
            enterKeyHint="next"
            data-autofocus
          />
        );
      default:
        return (
          <>
            <input
              className="nm-rq-field"
              type="text"
              value={a.telegram}
              onChange={(e) => set("telegram", e.target.value)}
              maxLength={RESUME_LIMIT.telegram}
              aria-labelledby={qId}
              aria-describedby={error ? errId : undefined}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder={s.telegramPh}
              enterKeyHint="send"
              data-autofocus
            />
            <p className="nm-rq-note">{s.note}</p>
          </>
        );
    }
  }

  const sheet = (
    <dialog
      ref={dlg}
      className="nm-rq"
      role="dialog"
      aria-modal="true"
      aria-label={s.title}
      lang={lang}
      /* Clarity пишет видеозапись сессии: почта и ответы в неё не попадают. */
      data-clarity-mask="true"
      onClose={onClosed}
      /* Клик мимо окна закрывает его. Считается, только если и нажатие
         началось мимо окна: иначе выделение текста в поле, отпущенное за
         краем окна, закрывало бы его. */
      onPointerDown={(e) => {
        downOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (downOnBackdrop.current && e.target === e.currentTarget) close();
        downOnBackdrop.current = false;
      }}
    >
      <div className="nm-rq-in">
        <div className="nm-rq-bar">
          <span>
            {s.title}
            {!done && (
              <>
                {" · "}
                {step + 1} {s.of} {TOTAL}
              </>
            )}
          </span>
          <button type="button" className="nm-rq-x" onClick={close}>
            {s.close}
          </button>
        </div>
        <div className="nm-rq-track" aria-hidden="true">
          <i style={{ width: `${((done ? TOTAL : step + 1) / TOTAL) * 100}%` }} />
        </div>

        {done ? (
          <div className="nm-rq-body">
            <h2 className="nm-rq-q" tabIndex={-1} data-autofocus>
              {s.thanksT}
            </h2>
            <p className="nm-rq-d">{s.thanksD}</p>
            <div className="nm-rq-nav">
              <div className="nm-rq-acts">
                <button type="button" className="nm-rq-go" onClick={close}>
                  {s.close}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form className="nm-rq-body" onSubmit={onSubmit} noValidate>
            <h2 id={qId} className="nm-rq-q">
              {questions[step]}
            </h2>
            {field()}
            {error && (
              <p id={errId} className="nm-rq-err" role="alert">
                {error}
              </p>
            )}
            <div className="nm-rq-nav">
              {step > 0 && (
                <button type="button" className="nm-rq-back" onClick={back} disabled={sending}>
                  {s.back}
                </button>
              )}
              <div className="nm-rq-acts">
                {step === TOTAL - 1 && (
                  <button type="button" className="nm-rq-skip" onClick={skip} disabled={sending}>
                    {s.skip}
                  </button>
                )}
                <button type="submit" className="nm-rq-go" disabled={!canNext || sending}>
                  {goLabel}
                </button>
              </div>
            </div>
            {/* Ловушка для ботов: людям не видна и недоступна с клавиатуры,
                маршрут отклоняет запрос, если в ней что-то есть. */}
            <div className="nm-rq-trap" aria-hidden="true">
              <label>
                Website
                <input ref={trap} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
              </label>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );

  return (
    <>
      <button
        ref={opener}
        type="button"
        className={className}
        aria-haspopup="dialog"
        aria-describedby={describedBy}
        onClick={() => setOpen(true)}
      >
        {s.button}
      </button>
      {open && createPortal(sheet, document.getElementById("nm-root") ?? document.body)}
    </>
  );
}
