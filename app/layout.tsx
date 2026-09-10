import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import JasurGPT from "@/components/JasurGPT";
import { LanguageProvider } from "@/context/LanguageContext";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://jasur-portfolio-pied.vercel.app"),
  title: "Jasur Akhmadaliev — PM · AI Builder",
  description:
    "Product Manager building an AI system for his own career search. Showing it live.",
  openGraph: {
    title: "Jasur Akhmadaliev — PM · AI Builder",
    description:
      "Product Manager building an AI system for his own career search. Showing it live.",
    siteName: "jasur.dev",
    images: [{ url: "/jasur.jpg", width: 1200, height: 800, alt: "Jasur Akhmadaliev" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jasur Akhmadaliev — PM · AI Builder",
    description: "Product Manager building an AI system for his own career search. Showing it live.",
    images: ["/jasur.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <footer className="wrap">
            <div className="flex flex-wrap justify-between gap-2.5 border-t border-ink pt-7 pb-24 mt-11">
              <span className="tiny">Jasur Akhmadaliev</span>
              <span className="tiny">Москва</span>
              <span className="tiny">2026 · Prompt-injection hardened</span>
            </div>
          </footer>
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
