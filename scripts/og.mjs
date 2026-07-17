// Generates public/og.png (1200x630 social preview) from an inline SVG.
// Run: node scripts/og.mjs
import { Resvg } from "@resvg/resvg-js";
import { decompress } from "wawoff2";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#000000"/>
  <line x1="100" y1="150" x2="1100" y2="150" stroke="rgba(255,255,255,0.16)" stroke-width="2"/>
  <text x="100" y="128" font-family="JetBrains Mono" font-size="24" fill="#c7ff9f" letter-spacing="2">DAVIDE GOZZI — SOFTWARE ENGINEER</text>
  <text x="96" y="300" font-family="Instrument Sans" font-weight="500" font-size="78" letter-spacing="-3" fill="#ffffff">Software that has to</text>
  <text x="96" y="392" font-family="Instrument Serif" font-style="italic" font-size="82" letter-spacing="-2" fill="#c7ff9f">keep working.</text>
  <text x="100" y="484" font-family="JetBrains Mono" font-size="22" fill="#c9c9c2">distributed services · legacy platforms · real machines</text>
  <line x1="100" y1="530" x2="1100" y2="530" stroke="rgba(255,255,255,0.16)" stroke-width="2"/>
</svg>`;

const dir = await mkdtemp(join(tmpdir(), "og-fonts-"));
const fonts = [];
for (const [woff2, ttf] of [
  ["app/fonts/instrument-sans-latin-wght-normal.woff2", "instrument-sans.ttf"],
  ["app/fonts/instrument-serif-latin-400-italic.woff2", "instrument-serif-italic.ttf"],
  ["app/fonts/jetbrains-mono-latin-wght-normal.woff2", "jetbrains-mono.ttf"],
]) {
  const out = join(dir, ttf);
  await writeFile(out, Buffer.from(await decompress(await readFile(woff2))));
  fonts.push(out);
}

const png = new Resvg(svg, {
  fitTo: { mode: "width", value: 1200 },
  font: { fontFiles: fonts, loadSystemFonts: false },
}).render().asPng();

await writeFile("public/og.png", png);
console.log(`public/og.png written (${(png.length / 1024).toFixed(0)} KB)`);
