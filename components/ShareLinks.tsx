"use client";

import { useState } from "react";

// Кнопки «поделиться». Ссылки на площадки открываются в новом окне,
// копирование адреса работает без внешних сервисов и без счётчиков.
export default function ShareLinks({
  url,
  title,
  ru,
}: {
  url: string;
  title: string;
  ru: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Буфер обмена недоступен, например если страница открыта не по https.
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-6 items-center">
      <span className="tiny">{ru ? "Поделиться" : "Share"}</span>

      <a
        className="share-link"
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Telegram
      </a>

      <a
        className="share-link"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>

      <a
        className="share-link"
        href={`https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        VK
      </a>

      <button className="share-link" onClick={copy} type="button">
        {copied ? (ru ? "Скопировано" : "Copied") : ru ? "Копировать ссылку" : "Copy link"}
      </button>
    </div>
  );
}
