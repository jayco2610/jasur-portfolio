import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Услуги — Jasur Akhmadaliev",
  description: "AI-автоматизация, ассистенты на ваших документах, настройка CRM, продуктовый разбор. Цены и сроки.",
  alternates: { canonical: "https://jasur-portfolio-pied.vercel.app/services" },
  openGraph: {
    title: "Услуги — Jasur Akhmadaliev",
    description: "AI-автоматизация, ассистенты на ваших документах, настройка CRM, продуктовый разбор. Цены и сроки.",
    url: "https://jasur-portfolio-pied.vercel.app/services",
    // Свой блок openGraph перекрывает родительский целиком, поэтому
    // картинку надо повторить здесь, иначе в репосте будет пустое место.
    images: [{ url: "/og-studio.jpg", width: 1200, height: 630, alt: "Jasur Akhmadaliev" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
