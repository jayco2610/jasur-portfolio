import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Демо — Jasur Akhmadaliev",
  description: "Живые демо автоматизаций для локального бизнеса. Работают прямо в браузере, без установки.",
  alternates: { canonical: "https://jasur-portfolio-pied.vercel.app/demos" },
  openGraph: {
    title: "Демо — Jasur Akhmadaliev",
    description: "Живые демо автоматизаций для локального бизнеса. Работают прямо в браузере, без установки.",
    url: "https://jasur-portfolio-pied.vercel.app/demos",
    // Свой блок openGraph перекрывает родительский целиком, поэтому
    // картинку надо повторить здесь, иначе в репосте будет пустое место.
    images: [{ url: "/og-jasur-2026.jpg", width: 1200, height: 630, alt: "Jasur Akhmadaliev" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
