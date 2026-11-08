// Renders the /meet/ cabinet once, from scripts/cabinet/render.html, with headless Chrome: a WebP per view
// (hero: the whole cabinet at 30°; play: standing at it, face-on) into public/, and data/meet-cabinet.json
// with the screen's corners and the hotspots the page maps its live screen and its clicks onto.
// Run: node scripts/cabinet.mjs [--theme garage] [--png <dir>]   (--png also saves a PNG preview of each view)
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : fallback;
};
const chrome = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const theme = arg("theme", "garage");
const png = arg("png");
const page = pathToFileURL(resolve("scripts/cabinet/render.html")).href;
const views = { hero: ["quarter", "1200,1600"], play: ["play", "1200,1500"] };
if (png) mkdirSync(png, { recursive: true });

const meta = {};
for (const [name, [variant, size]] of Object.entries(views)) {
  const url = `${page}?theme=${theme}&bg=clear#${variant}`;
  const common = [
    "--headless=new",
    "--disable-gpu",
    "--allow-file-access-from-files",
    "--hide-scrollbars",
    `--window-size=${size}`,
    "--force-device-scale-factor=1.5",
    "--virtual-time-budget=30000",
    "--default-background-color=00000000",
  ];
  const dom = spawnSync(chrome, [...common, "--dump-dom", url], { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 });
  const text = /<pre id="meta">([\s\S]*?)<\/pre>/.exec(dom.stdout ?? "")?.[1];
  if (!text) throw new Error(`no render metadata for ${variant}\n${(dom.stderr ?? "").slice(-600)}`);
  const view = JSON.parse(text);
  const bytes = Buffer.from(view.webp.split(",")[1], "base64");
  delete view.webp;
  delete view.variant;
  delete view.theme;
  writeFileSync(`public/meet-cabinet-${name}.webp`, bytes);
  meta[name] = view;
  if (png) spawnSync(chrome, [...common, `--screenshot=${resolve(png)}/meet-cabinet-${name}.png`, url]);
  console.log(`${name}: ${(bytes.length / 1024).toFixed(0)} kB  ${JSON.stringify(view)}`);
}
writeFileSync("data/meet-cabinet.json", JSON.stringify(meta, null, 2) + "\n");
