import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Услуги — Jasur Akhmadaliev",
  description: "AI-автоматизация, ассистенты на ваших документах, настройка CRM, продуктовый разбор. Цены и сроки.",
  alternates: { canonical: "https://jasur-portfolio-pied.vercel.app/services" },
  openGraph: {
    title: "Услуги — Jasur Akhmadaliev",
    description: "AI-автоматизация, ассистенты на ваших документах, настройка CRM, продуктовый разбор. Цены и сроки.",
    url: "https://jasur-portfolio-pied.vercel.app/services",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
