import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Блокнот — Jasur Akhmadaliev",
  description: "Блог про продукт, маркетинг и AI. Только то, что делаю сам.",
  alternates: { canonical: "https://jasur-portfolio-pied.vercel.app/writing" },
  openGraph: {
    title: "Блокнот — Jasur Akhmadaliev",
    description: "Блог про продукт, маркетинг и AI. Только то, что делаю сам.",
    url: "https://jasur-portfolio-pied.vercel.app/writing",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
