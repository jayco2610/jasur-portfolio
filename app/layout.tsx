import type { Metadata } from "next";
import { Space_Mono, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import JasurGPT from "@/components/JasurGPT";
import AvailabilityStrip from "@/components/AvailabilityStrip";
import { LanguageProvider } from "@/context/LanguageContext";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

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
    <html
      lang="en"
      className={`${spaceMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-[#e8e8e8]">
        <LanguageProvider>
          <AvailabilityStrip />
          <Nav />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/5 py-8 text-center text-xs font-mono text-white/30">
            © 2026 Jasur Akhmadaliev
          </footer>
          <JasurGPT />
        </LanguageProvider>
      </body>
    </html>
  );
}
