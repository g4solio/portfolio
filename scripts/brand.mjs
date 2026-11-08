// Renders every brand asset from brand/tokens.json: the Open Graph image, the LinkedIn
// banner, the X header, the GitHub README banner in Paper and Ink, the repository social
// previews, the avatars and the Ink mark. One composition, several sizes (see the Casebook
// design system, Surfaces). Outputs land in public/brand/ so the site serves them.
// Run: node scripts/brand.mjs
import { Resvg } from "@resvg/resvg-js";
import { decompress } from "wawoff2";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const tokens = JSON.parse(await readFile("brand/tokens.json", "utf8"));
const color = (name, theme) => {
  const t = tokens.color.find((c) => c.name === name);
  if (!t) throw new Error(`unknown token ${name}`);
  const v = t[theme];
  const alias = /^\{(.+)\}$/.exec(v);
  return alias ? color(alias[1], theme) : v;
};

// Fonts: resvg wants TTF; the repo ships woff2.
const dir = await mkdtemp(join(tmpdir(), "brand-fonts-"));
const fonts = [];
for (const [woff2, ttf] of [
  ["scripts/fonts/space-grotesk-latin-600-normal.woff2", "space-grotesk-600.ttf"],
  ["app/fonts/jetbrains-mono-latin-wght-normal.woff2", "jetbrains-mono.ttf"],
]) {
  const out = join(dir, ttf);
  await writeFile(out, Buffer.from(await decompress(await readFile(woff2))));
  fonts.push(out);
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

/** The mark as an SVG group at a given size and theme, with or without its tile. */
function mark(theme, size, { tile = false } = {}) {
  const s = size / 64;
  const ink = color("ink", theme), paper = color("paper", theme), accent = color("accent", theme), faint = color("ink-faint", theme);
  return `<g transform="scale(${s})">
    ${tile ? `<rect width="64" height="64" rx="12" fill="${paper}"/>` : ""}
    <circle cx="26" cy="32" r="18" fill="none" stroke="${ink}" stroke-opacity="0.22" stroke-width="0.9"/>
    <path d="M10 14H54M10 50H54" stroke="${ink}" stroke-opacity="0.22" stroke-width="0.9"/>
    <path fill="${accent}" fill-rule="evenodd" d="M16 14h10a18 18 0 0 1 0 36H16Zm10 8v20a10 10 0 0 0 0-20Z"/>
    <path d="M16 56H44M16 54v4M44 54v4" stroke="${faint}" stroke-width="0.9"/>
  </g>`;
}

/**
 * The banner composition: hairline, eyebrow, statement, tagline, hairline, the mark at right.
 * `left` is where the text block starts (LinkedIn and X keep a clear zone for the photo).
 */
function banner({ w, h, theme, eyebrow, statement, tagline, left = 100, pad = 100, statementSize = 72, markSize = 128 }) {
  const paper = color("paper", theme), ink = color("ink", theme), soft = color("ink-soft", theme), accent = color("accent", theme), rule = color("rule", theme);
  const lines = statement.length;
  const lineH = statementSize * 1.16;
  const blockH = 24 + 28 + lines * lineH + 24 + 22; // eyebrow, gap, statement, gap, tagline
  const top = Math.round((h - blockH) / 2);
  const eyebrowY = top + 24;
  const statementY = eyebrowY + 28 + statementSize * 0.92;
  const taglineY = statementY + (lines - 1) * lineH + 24 + 22;
  const ruleTop = Math.max(40, eyebrowY - 40);
  const ruleBottom = Math.min(h - 40, taglineY + 40);
  const markX = w - pad - markSize;
  const markY = Math.round((h - markSize) / 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${paper}"/>
  <line x1="${left}" y1="${ruleTop}" x2="${w - pad}" y2="${ruleTop}" stroke="${rule}" stroke-width="2"/>
  <text x="${left}" y="${eyebrowY}" font-family="JetBrains Mono" font-size="22" letter-spacing="1.5" fill="${accent}">${esc(eyebrow)}</text>
  ${statement.map((line, i) => `<text x="${left - 4}" y="${statementY + i * lineH}" font-family="Space Grotesk" font-weight="600" font-size="${statementSize}" letter-spacing="${-statementSize * 0.012}" fill="${ink}">${esc(line)}</text>`).join("\n  ")}
  <text x="${left}" y="${taglineY}" font-family="JetBrains Mono" font-size="20" fill="${soft}">${esc(tagline)}</text>
  <line x1="${left}" y1="${ruleBottom}" x2="${w - pad}" y2="${ruleBottom}" stroke="${rule}" stroke-width="2"/>
  <g transform="translate(${markX} ${markY})">${mark(theme, markSize)}</g>
</svg>`;
}

function avatar(theme, size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${mark(theme, size, { tile: true })}</svg>`;
}

const EYEBROW = "davide gozzi — senior software engineer";
const TAGLINE = "distributed services · legacy platforms · real machines";
const STATEMENT = ["Software that has to", "keep working."];

const assets = [
  { file: "public/og.png", svg: banner({ w: 1200, h: 630, theme: "paper", eyebrow: EYEBROW, statement: STATEMENT, tagline: TAGLINE }) },
  { file: "public/og-meet.png", svg: banner({ w: 1200, h: 630, theme: "paper", eyebrow: "davide gozzi — for recruiters", statement: ["Let’s get to know", "each other."], tagline: "an intake desk · thirteen questions · a brief you can send me" }) },
  { file: "public/brand/linkedin-banner.png", svg: banner({ w: 1584, h: 396, theme: "paper", eyebrow: EYEBROW, statement: STATEMENT, tagline: TAGLINE, left: 470, pad: 80, statementSize: 54, markSize: 112 }) },
  { file: "public/brand/x-header.png", svg: banner({ w: 1500, h: 500, theme: "paper", eyebrow: EYEBROW, statement: STATEMENT, tagline: TAGLINE, left: 470, pad: 80, statementSize: 58, markSize: 120 }) },
  { file: "public/brand/github-readme-banner-paper.png", svg: banner({ w: 1280, h: 320, theme: "paper", eyebrow: EYEBROW, statement: ["Software that has to keep working."], tagline: TAGLINE, left: 64, pad: 64, statementSize: 46, markSize: 96 }) },
  { file: "public/brand/github-readme-banner-ink.png", svg: banner({ w: 1280, h: 320, theme: "ink", eyebrow: EYEBROW, statement: ["Software that has to keep working."], tagline: TAGLINE, left: 64, pad: 64, statementSize: 46, markSize: 96 }) },
  { file: "public/brand/social-preview-portfolio.png", svg: banner({ w: 1280, h: 640, theme: "paper", eyebrow: "g4solio/portfolio", statement: STATEMENT, tagline: "an engineering casebook · six chapters, four decisions, one lab", left: 96, pad: 96, statementSize: 68 }) },
  { file: "public/brand/social-preview-g4solio.png", svg: banner({ w: 1280, h: 640, theme: "paper", eyebrow: "github.com/g4solio", statement: ["Davide Gozzi"], tagline: "senior software engineer · shipping with AI agents, owning architecture and verification", left: 96, pad: 96, statementSize: 84 }) },
  { file: "public/brand/social-preview-collectionvault-peek.png", svg: banner({ w: 1280, h: 640, theme: "paper", eyebrow: "g4solio/CollectionVault_Peek", statement: ["The operating model", "behind CollectionVault."], tagline: "what an agent reads before it writes · what CI checks after", left: 96, pad: 96, statementSize: 60 }) },
  { file: "public/brand/avatar-paper.png", svg: avatar("paper", 400) },
  { file: "public/brand/avatar-ink.png", svg: avatar("ink", 400) },
];

for (const { file, svg } of assets) {
  const png = new Resvg(svg, { font: { fontFiles: fonts, loadSystemFonts: false } }).render().asPng();
  await writeFile(file, png);
  console.log(`${file} (${(png.length / 1024).toFixed(0)} KB)`);
}
await writeFile("public/brand/mark-ink.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${mark("ink", 64, { tile: true })}</svg>\n`);
console.log("public/brand/mark-ink.svg");
