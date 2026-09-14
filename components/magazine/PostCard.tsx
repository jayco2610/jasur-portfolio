import Link from "next/link";
import { rubricName } from "@/lib/rubrics";

// Карточка статьи для ленты-карусели. Без анимации появления: карточки
// в ленте постоянно въезжают и уезжают, и эффект появления срабатывал бы
// посреди прокрутки.
export type CardPost = {
  slug: string;
  title: string;
  date: string;
  lang: "ru" | "en";
  rubric: string;
  cover?: string;
  tag?: string;
};

function shortDate(date: string, lang: "ru" | "en"): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
    day: "2-digit",
    month: "long",
  });
}

export default function PostCard({ post, tabIndex }: { post: CardPost; tabIndex?: number }) {
  return (
    <Link href={`/blog/${post.slug}`} className="mag-card" tabIndex={tabIndex} draggable={false}>
      <div className="mag-im">
        {post.cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover} alt="" loading="lazy" draggable={false} />
        )}
      </div>
      <div className="mag-rub">{rubricName(post.rubric, post.lang)}</div>
      <h4>{post.title}</h4>
      <div className="mag-card-meta">
        <span className="tiny">{shortDate(post.date, post.lang)}</span>
        {post.tag && <span className="tiny">{post.tag}</span>}
      </div>
    </Link>
  );
}
