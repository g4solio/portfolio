// Generates public/og.png (1200x630 social preview) from an inline SVG.
// Run: node scripts/og.mjs
import { Resvg } from "@resvg/resvg-js";
import { decompress } from "wawoff2";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#f7f5f1"/>
  <line x1="100" y1="150" x2="1100" y2="150" stroke="#dad6cb" stroke-width="2"/>
  <text x="100" y="128" font-family="JetBrains Mono" font-size="24" fill="#2b5bc7">davide gozzi — software engineer</text>
  <text x="96" y="300" font-family="Space Grotesk" font-weight="600" font-size="72" fill="#1b1b18">Software that has to</text>
  <text x="96" y="384" font-family="Space Grotesk" font-weight="600" font-size="72" fill="#1b1b18">keep working.</text>
  <text x="100" y="480" font-family="JetBrains Mono" font-size="22" fill="#4c4b44">distributed services · legacy platforms · real machines</text>
  <line x1="100" y1="530" x2="1100" y2="530" stroke="#dad6cb" stroke-width="2"/>
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
