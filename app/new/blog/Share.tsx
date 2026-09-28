"use client";

import { useState } from "react";

/* «Поделиться». Перенос components/ShareLinks.tsx: те же три площадки и
   копирование адреса, без внешних сервисов и счётчиков. Своя копия только
   ради классов .nm-*: старый компонент оформлен классами из globals.css. */
export default function Share({
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
    <div className="nm-share">
      <span className="nm-share-k">{ru ? "Поделиться" : "Share"}</span>

      <a
        className="nm-share-a"
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Telegram
      </a>

      <a
        className="nm-share-a"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        LinkedIn
      </a>

      <a
        className="nm-share-a"
        href={`https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        VK
      </a>

      <button className="nm-share-a" onClick={copy} type="button">
        {copied ? (ru ? "Скопировано" : "Copied") : ru ? "Копировать ссылку" : "Copy link"}
      </button>
    </div>
  );
}
