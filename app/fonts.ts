import localFont from "next/font/local";

// Instrument Sans — display + body. One family, used at every size; the Bending
// Spoons look comes from size and tight tracking, not weight.
export const sans = localFont({
  src: [
    { path: "./fonts/instrument-sans-latin-wght-normal.woff2", weight: "400 700", style: "normal" },
    { path: "./fonts/instrument-sans-latin-wght-italic.woff2", weight: "400 700", style: "italic" },
  ],
  variable: "--font-sans",
  display: "swap",
});

// Instrument Serif (italic) — accent words rendered in the lime accent.
export const serif = localFont({
  src: [
    { path: "./fonts/instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
});

// JetBrains Mono — kept only for micro technical annotations (figure captions,
// stack lines, the boot terminal).
export const mono = localFont({
  src: "./fonts/jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  variable: "--font-mono",
  display: "swap",
});
