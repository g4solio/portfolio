// Generates public/og.png (1200x630 social preview) from an inline SVG.
// Run: node scripts/og.mjs
import { Resvg } from "@resvg/resvg-js";
import { decompress } from "wawoff2";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const grid = [];
for (let x = 0; x <= 1200; x += 52) grid.push(`M${x} 0V630`);
for (let y = 0; y <= 630; y += 52) grid.push(`M0 ${y}H1200`);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#08090c"/>
  <path d="${grid.join("")}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
  <rect x="60" y="60" width="1080" height="510" fill="none" stroke="rgba(184,255,69,0.35)" stroke-width="2"/>
  <text x="110" y="150" font-family="JetBrains Mono" font-size="26" fill="#9aa1ae" letter-spacing="6">DAVIDE.GOZZI // SOFTWARE ENGINEER</text>
  <text x="104" y="290" font-family="Space Grotesk" font-weight="700" font-size="84" fill="#f2f1eb">I make complex systems</text>
  <text x="104" y="390" font-family="Space Grotesk" font-weight="700" font-size="84" fill="#b8ff45">understandable.</text>
  <text x="110" y="480" font-family="JetBrains Mono" font-size="22" fill="#9aa1ae" letter-spacing="3">INDUSTRIAL · REAL-TIME · DISTRIBUTED SYSTEMS</text>
  <circle cx="1046" cy="141" r="7" fill="#b8ff45"/>
  <text x="1030" y="150" font-family="JetBrains Mono" font-size="22" fill="#b8ff45" text-anchor="end" letter-spacing="4">ONLINE</text>
</svg>`;

const dir = await mkdtemp(join(tmpdir(), "og-fonts-"));
const fonts = [];
for (const [woff2, ttf] of [
  ["app/fonts/space-grotesk-latin-wght-normal.woff2", "space-grotesk.ttf"],
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
