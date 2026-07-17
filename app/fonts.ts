import localFont from "next/font/local";

export const display = localFont({
  src: "./fonts/space-grotesk-latin-wght-normal.woff2",
  weight: "300 700",
  variable: "--font-display",
  display: "swap",
});

export const sans = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-sans",
  display: "swap",
});

export const mono = localFont({
  src: "./fonts/jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  variable: "--font-mono",
  display: "swap",
});

export const pixel = localFont({
  src: [
    { path: "./fonts/silkscreen-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/silkscreen-latin-700-normal.woff2", weight: "700" },
  ],
  variable: "--font-pixel",
  display: "swap",
});
