import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Резюме — Jasur Akhmadaliev",
  description: "Опыт, образование, навыки, проекты. PDF на русском и английском.",
  alternates: { canonical: "https://jasur-portfolio-pied.vercel.app/resume" },
  openGraph: {
    title: "Резюме — Jasur Akhmadaliev",
    description: "Опыт, образование, навыки, проекты. PDF на русском и английском.",
    url: "https://jasur-portfolio-pied.vercel.app/resume",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
