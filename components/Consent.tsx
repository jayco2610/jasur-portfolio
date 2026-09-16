"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { useLanguage } from "@/context/LanguageContext";

const KEY = "consent";
// Номер проекта Clarity для этого сайта. У каждого сайта свой, иначе данные лягут в одну кучу.
// Портфолио: yj4ivfasb0. Сайт экспатов: xeojrhfu6q. ABCX: yj4jeugol8.
const CLARITY = "yj4ivfasb0";
export type Choice = "yes" | "no";

// Аналитика не загружается, пока человек не разрешил. Не потому, что так
// строже, а потому что Clarity пишет видеозапись экрана, и включать её
// молча нечестно. Пока выбора нет, не грузится ничего.
export default function Consent() {
  const { lang } = useLanguage();
  const ru = lang === "ru";
  const [choice, setChoice] = useState<Choice | null>(null);
  const [asked, setAsked] = useState(true);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {
      // Приватный режим или запрет на хранение. Тогда просто спрашиваем снова.
    }
    if (saved === "yes" || saved === "no") setChoice(saved);
    setAsked(saved === "yes" || saved === "no");
  }, []);

  function decide(value: Choice) {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      // Не сохранилось, значит спросим в следующий раз. Не страшно.
    }
    setChoice(value);
    setAsked(true);
  }

  return (
    <>
      {choice === "yes" && (
        <>
          <Analytics />
          <Script
            id="clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY}");`,
            }}
          />
        </>
      )}

      {!asked && (
        <div className="consent" role="dialog" aria-live="polite">
          <div className="consent-in">
            <p>
              {ru
                ? "Сайт использует куки, чтобы я видел, какие страницы читают и где люди уходят. Личных данных не собираю и никому не передаю."
                : "This site uses cookies so I can see which pages get read and where people leave. No personal data is collected or passed on."}
            </p>
            <div className="consent-btns">
              <button type="button" onClick={() => decide("no")} className="is-no">
                {ru ? "Отклонить" : "Decline"}
              </button>
              <button type="button" onClick={() => decide("yes")} className="is-yes">
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
