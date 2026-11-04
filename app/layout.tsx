import type { Metadata, Viewport } from "next";
import { display, mono, pixel, sans } from "./fonts";
import "./tokens.css";
import "./globals.css";

const siteUrl = new URL("https://g4solio.github.io/portfolio/");
const ogImage = new URL("og.png", siteUrl).toString();

const description =
  "Senior software engineer in Modena, Italy. I design and evolve software that has to keep working: distributed services, legacy platforms and systems connected to real machines. AI agents do most of the typing; architecture, review and verification stay mine.";

export const metadata: Metadata = {
  title: "Davide Gozzi — Senior software engineer",
  description,
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Davide Gozzi — Senior software engineer",
    description,
    url: siteUrl,
    siteName: "Davide Gozzi",
    type: "website",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "Davide Gozzi — Senior software engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Davide Gozzi — Senior software engineer",
    description,
    images: [ogImage],
  },
};

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Davide Gozzi",
  alternateName: "g4solio",
  jobTitle: "Senior software engineer",
  description,
  url: siteUrl.toString(),
  image: ogImage,
  address: { "@type": "PostalAddress", addressLocality: "Modena", addressCountry: "IT" },
  knowsAbout: ["C#", ".NET", "distributed systems", "industrial software", "OPC UA", "RabbitMQ", "legacy systems", "AI-assisted development"],
  sameAs: [
    "https://www.linkedin.com/in/davide-gozzi5/",
    "https://github.com/g4solio",
    "https://x.com/g4solio",
  ],
};

export const viewport: Viewport = {
  themeColor: "#f7f5f1",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the inline script below adds the `js` class
    // before React hydrates, an intentional html-attribute mismatch
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} ${pixel.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Content stays visible without JS; this class opts into the boot overlay. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
        {children}
      </body>
    </html>
  );
}
