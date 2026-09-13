import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import JasurGPT from "@/components/JasurGPT";
import { LanguageProvider } from "@/context/LanguageContext";
import Consent from "@/components/Consent";

export const metadata: Metadata = {
  metadataBase: new URL("https://jasur-portfolio-pied.vercel.app"),
  title: "Jasur Akhmadaliev — Portfolio · PM · AI Builder",
  description:
    "Portfolio of Jasur Akhmadaliev, a Product Manager building an AI system for his own career search. Showing it live.",
  openGraph: {
    title: "Jasur Akhmadaliev — Portfolio · PM · AI Builder",
    description:
      "Portfolio of Jasur Akhmadaliev, a Product Manager building an AI system for his own career search. Showing it live.",
    siteName: "Jasur Akhmadaliev — Portfolio",
    images: [{ url: "/og-jasur-2026.jpg", width: 1200, height: 630, alt: "Jasur Akhmadaliev" }],
  },
  alternates: {
    canonical: "https://jasur-portfolio-pied.vercel.app",
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "Блокнот · блог Жасура Ахмадалиева" }],
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Jasur Akhmadaliev — Portfolio · PM · AI Builder",
    description: "Portfolio of Jasur Akhmadaliev, a Product Manager building an AI system for his own career search. Showing it live.",
    images: ["/og-jasur-2026.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <JasurGPT />
          <Consent />
        </LanguageProvider>

      </body>
    </html>
  );
}
