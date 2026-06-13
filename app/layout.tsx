import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#111827] text-[#F8FAFF]">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/10 py-6 text-center text-sm text-white/40">
          © 2025 Jasur Akhmadaliev · @pmvision_ai
        </footer>
      </body>
    </html>
  );
}
