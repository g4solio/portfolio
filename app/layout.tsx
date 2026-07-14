import type { Metadata, Viewport } from "next";
import { display, mono, sans } from "./fonts";
import "./globals.css";

// TODO: confirm final GitHub Pages URL (assumes user site g4solio.github.io).
const siteUrl = "https://g4solio.github.io";

const description =
  "Software engineer in Modena, Italy. I design and evolve software that has to keep working: distributed services, legacy platforms and systems connected to real machines.";

export const metadata: Metadata = {
  title: "Davide Gozzi — Software engineer",
  description,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Davide Gozzi — Software engineer",
    description,
    url: siteUrl,
    siteName: "Davide Gozzi",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Davide Gozzi — Software engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Davide Gozzi — Software engineer",
    description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f5f1",
  colorScheme: "light",
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
