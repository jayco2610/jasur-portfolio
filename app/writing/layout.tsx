import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jasur / Log — блог Жасура Ахмадалиева",
  description: "Пишу про то, что делаю сам. Что сработало, что развалилось, сколько стоило.",
  alternates: { canonical: "https://jasur-portfolio-pied.vercel.app/writing" },
  openGraph: {
    title: "Jasur / Log — блог Жасура Ахмадалиева",
    description: "Пишу про то, что делаю сам. Что сработало, что развалилось, сколько стоило.",
    url: "https://jasur-portfolio-pied.vercel.app/writing",
    // Свой блок openGraph перекрывает родительский целиком, поэтому
    // картинку надо повторить здесь, иначе в репосте будет пустое место.
    images: [{ url: "/og-log.jpg", width: 1200, height: 630, alt: "Jasur Akhmadaliev" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
