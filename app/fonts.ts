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

// ponytail: only the 400 weight is used (.pix, .chapter-number); re-add 700 if bold pixel text ever ships
export const pixel = localFont({
  src: "./fonts/silkscreen-latin-400-normal.woff2",
  weight: "400",
  variable: "--font-pixel",
  display: "swap",
});
