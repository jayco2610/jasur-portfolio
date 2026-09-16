import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import JasurGPT from "@/components/JasurGPT";
import { LanguageProvider } from "@/context/LanguageContext";
import Consent from "@/components/Consent";
import Pulse from "@/components/Pulse";

export const metadata: Metadata = {
  metadataBase: new URL("https://jasur-portfolio-pied.vercel.app"),
  // В заголовке для поиска обязательно слово «портфолио»: без него по запросу
  // «джасур портфолио» первым выдавался репозиторий на Гитхабе, а не сайт.
  // В превью для мессенджеров уходит хук, там ярлык не нужен.
  title: "Jasur Akhmadaliev — портфолио продакт-менеджера",
  description:
    "Продукты и автоматизации, журнал Jasur / Log, подкаст Jasur / Talks. Всё своё.",
  openGraph: {
    title: "Jasur Akhmadaliev — строю, пишу, говорю",
    description:
      "Продукты и автоматизации, журнал Jasur / Log, подкаст Jasur / Talks. Всё своё.",
    siteName: "Jasur Akhmadaliev",
    images: [{ url: "/og-log.jpg", width: 1200, height: 630, alt: "Jasur Akhmadaliev" }],
  },
  alternates: {
    canonical: "https://jasur-portfolio-pied.vercel.app",
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "Jasur / Log" }],
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Jasur Akhmadaliev — строю, пишу, говорю",
    description: "Продукты и автоматизации, журнал Jasur / Log, подкаст Jasur / Talks. Всё своё.",
    images: ["/og-log.jpg"],
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
          <Pulse />
        </LanguageProvider>

      </body>
    </html>
  );
}
