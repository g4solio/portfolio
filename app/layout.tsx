import type { Metadata, Viewport } from "next";
import { display, mono, sans } from "./fonts";
import "./globals.css";

// TODO: confirm final GitHub Pages URL (assumes user site g4solio.github.io).
const siteUrl = "https://g4solio.github.io";

export const metadata: Metadata = {
  title: "Davide Gozzi — Software Engineer",
  description:
    "I don't chase complexity. I make it understandable. Software engineer building industrial, real-time and distributed systems — from Unity games to machines on factory floors.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Davide Gozzi — Software Engineer",
    description:
      "I make complex systems understandable. Industrial real-time software, distributed systems, and OSUS — an independent product lab.",
    url: siteUrl,
    siteName: "Davide Gozzi",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Davide Gozzi — I make complex systems understandable." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Davide Gozzi — Software Engineer",
    description: "I make complex systems understandable.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#08090c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        {/* Content stays visible without JS; this class opts into the boot overlay. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {children}
      </body>
    </html>
  );
}
