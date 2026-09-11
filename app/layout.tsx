import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import JasurGPT from "@/components/JasurGPT";
import { LanguageProvider } from "@/context/LanguageContext";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

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
    images: [{ url: "/og-cover.jpg", width: 1200, height: 630, alt: "Jasur Akhmadaliev" }],
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
    images: ["/og-cover.jpg"],
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
        </LanguageProvider>
        <Analytics />
        <Script
          id="clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","xeojrhfu6q");`,
          }}
        />
      </body>
    </html>
  );
}
