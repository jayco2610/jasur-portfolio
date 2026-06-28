import type { Metadata } from "next";
import { Space_Mono, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import JasurGPT from "@/components/JasurGPT";
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
  title: "Jasur Akhmadaliev — PM · Marketing · AI",
  description:
    "Product Manager building an AI system for his own career search. Showing it live.",
  openGraph: {
    title: "Jasur Akhmadaliev — PM · Marketing · AI",
    description:
      "Product Manager building an AI system for his own career search. Showing it live.",
    siteName: "jasur.dev",
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
          <Nav />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/5 py-8 text-center text-xs font-mono text-white/30">
            © 2025 Jasur Akhmadaliev
          </footer>
          <JasurGPT />
        </LanguageProvider>
      </body>
    </html>
  );
}
