import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Проекты — Jasur Akhmadaliev",
  description: "Что построил: система поиска работы на AI, платформа для экспатов, RAG-ассистент клиники. С цифрами и кодом.",
  alternates: { canonical: "https://jasur-portfolio-pied.vercel.app/projects" },
  openGraph: {
    title: "Проекты — Jasur Akhmadaliev",
    description: "Что построил: система поиска работы на AI, платформа для экспатов, RAG-ассистент клиники. С цифрами и кодом.",
    url: "https://jasur-portfolio-pied.vercel.app/projects",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
