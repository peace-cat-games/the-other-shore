import type { Metadata, Viewport } from "next";
import { Atkinson_Hyperlegible, Literata } from "next/font/google";

import "./globals.css";

const atkinson = Atkinson_Hyperlegible({ subsets: ["latin", "latin-ext"], weight: ["400", "700"], variable: "--font-atkinson", display: "swap" });
const literata = Literata({ subsets: ["latin", "latin-ext"], variable: "--font-literata", display: "swap" });

export const metadata: Metadata = {
  title: { default: "The Other Shore: October 1943 · Peace Cat Games", template: "%s · The Other Shore" },
  description: "A free historical rescue game about the escape of Denmark's Jews to Sweden in October 1943. Play a Jewish household, a Danish boat owner or a Swedish reception organizer.",
  openGraph: { title: "The Other Shore: October 1943", description: "A free historical rescue game: ordinary people working together to bring their neighbors to safety.", siteName: "Peace Cat Games" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef1f0" },
    { media: "(prefers-color-scheme: dark)", color: "#111b21" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${atkinson.variable} ${literata.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="sr-only z-50 rounded bg-white px-4 py-2 text-black focus:not-sr-only focus:absolute focus:left-4 focus:top-4">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
