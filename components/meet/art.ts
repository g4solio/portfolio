// The desk's drawn things, as SVG strings: static, written here, never built from what a visitor types.
// Pixel art is a code grid; every sticker is a fact from data/meet.ts.

const GRIDS = {
  cat: ["#....#......", "##..##......", "######......", "#e##e#......", "######......", ".####.......", "######......", "#######.....", "#######.....", "#######...#.", "#######..##.", "#######.##..", "#########...", "##.###......"],
  hat: ["......#.......", ".....###......", ".....###......", "....#####.....", "....#####.....", "...#######....", "...#######....", "..#########...", "..####o####...", ".###########..", "##############", ".############."],
  lute: ["...##.....", "....##....", ".....#....", ".....#....", "....###...", "...#####..", "..#######.", ".#########", ".###oo####", ".###oo####", ".#########", "..#######.", "...#####..", "....###..."],
};
const INK = { "#": "#1b1b18", o: "#ffffff", e: "#9be36d" };
const LUTE = { "#": "#2b5bc7", o: "#1b1b18" };

/** A pixel sticker: the grid in its colours on a one-cell white die-cut border. */
function pix(name: keyof typeof GRIDS, cell: number, pal: Record<string, string> = INK) {
  const rows = GRIDS[name];
  const w = Math.max(...rows.map((r) => r.length)) + 2;
  const h = rows.length + 2;
  const cells: [number, number, string][] = [];
  rows.forEach((r, y) => [...r].forEach((ch, x) => pal[ch] && cells.push([x + 1, y + 1, pal[ch]])));
  const border = cells.map(([x, y]) => `<rect x="${x - 1}" y="${y - 1}" width="3" height="3" fill="#fff"/>`).join("");
  const body = cells.map(([x, y, c]) => `<rect x="${x}" y="${y}" width="1" height="1" fill="${c}"/>`).join("");
  return `<svg width="${w * cell}" height="${h * cell}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${border}${body}</svg>`;
}

/** The designated Mage's hat, sprayed through a stencil: a soft overspray under a hard edge. */
function stencil(cell: number) {
  const r = GRIDS.hat.flatMap((row, y) => [...row].map((ch, x) => (ch === "#" ? `<rect x="${x}" y="${y}" width="1" height="1"/>` : ""))).join("");
  return `<svg width="${14 * cell}" height="${12 * cell}" viewBox="-1 -1 16 14" shape-rendering="crispEdges"><defs><filter id="acc-spray" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation=".45"/></filter></defs>
  <g fill="#1b1b18" opacity=".22" filter="url(#acc-spray)" transform="translate(.15 .2)">${r}</g><g fill="#1b1b18" opacity=".86">${r}</g></svg>`;
}

const PIXEL = `style="font-family:var(--pixel)"`;
const DISPLAY = `style="font-family:var(--display);font-weight:700"`;

// Trig is rounded before it reaches the markup: Node and the browser can disagree on a sine's last digit.
const r2d = (v: number) => Math.round(v * 100) / 100;

const d20 = (w: number) => {
  const c = 40, R = 38, r2 = 26;
  const P = (r: number, i: number) => [r2d(c + r * Math.cos(-Math.PI / 2 + (i * Math.PI) / 3)), r2d(c + r * Math.sin(-Math.PI / 2 + (i * Math.PI) / 3))];
  const hex = (r: number) => [0, 1, 2, 3, 4, 5].map((i) => P(r, i).join(",")).join(" ");
  const pts = [0, 1, 2, 3, 4, 5].map((i) => P(r2, i));
  const tri = [[c, c - r2 * 0.55], [c + r2 * 0.5, c + r2 * 0.3], [c - r2 * 0.5, c + r2 * 0.3]];
  const lines = [[0, 0], [1, 2], [2, 4], [0, 1], [1, 1], [1, 3], [2, 3], [2, 5], [0, 5]].map(([t, p]) => `<line x1="${tri[t][0]}" y1="${tri[t][1]}" x2="${pts[p][0]}" y2="${pts[p][1]}"/>`).join("");
  return `<svg width="${w}" viewBox="0 0 80 80"><polygon points="${hex(R)}" fill="#fff"/><polygon points="${hex(R - 4)}" fill="#1b1b18"/><polygon points="${hex(r2)}" fill="#d8352a"/>
  <g stroke="#1b1b18" stroke-width="2" stroke-linejoin="round"><polygon points="${tri.map((p) => p.join(",")).join(" ")}" fill="none"/>${lines}</g>
  <text x="${c}" y="${c + 5}" ${DISPLAY} font-size="13" fill="#fff" text-anchor="middle">20</text></svg>`;
};

const twice = `<svg width="150" viewBox="0 0 150 62"><rect width="150" height="62" rx="10" fill="#fff"/><rect x="4" y="4" width="142" height="54" rx="7" fill="#ffcc00"/>
  <clipPath id="acc-hazard"><rect x="4" y="4" width="22" height="54"/><rect x="124" y="4" width="22" height="54"/></clipPath><g clip-path="url(#acc-hazard)">${[...Array(12)].map((_, k) => `<path d="M${k * 14 - 20} 58 l18 -54 h7 l-18 54z" fill="#1b1b18"/>`).join("")}</g>
  <text x="75" y="27" ${PIXEL} font-size="11" text-anchor="middle">ENUMERATED</text><text x="75" y="45" ${PIXEL} font-size="11" text-anchor="middle">TWICE</text></svg>`;
const linq = `<svg width="110" viewBox="0 0 110 50"><rect width="110" height="50" rx="12" fill="#fff"/><rect x="5" y="5" width="100" height="40" rx="8" fill="none" stroke="#1b1b18" stroke-width="3"/>
  <path d="M27 36 C13 27 18 14 27 21 C36 14 41 27 27 36Z" fill="#d8352a"/><text x="44" y="33" ${DISPLAY} font-size="19">LINQ</text></svg>`;
const mo = `<svg width="92" viewBox="0 0 100 66"><ellipse cx="50" cy="33" rx="50" ry="33" fill="#fff"/><ellipse cx="50" cy="33" rx="45" ry="28" fill="#1b1b18"/><ellipse cx="50" cy="33" rx="39" ry="22" fill="#fff"/>
  <text x="50" y="43" ${DISPLAY} font-size="28" text-anchor="middle">MO</text></svg>`;
const handle = `<svg width="104" viewBox="0 0 110 45"><rect width="110" height="45" rx="22" fill="#fff"/><rect x="4" y="4" width="102" height="37" rx="18" fill="#1b1b18"/>
  <text x="55" y="28" ${PIXEL} font-size="15" fill="#fff" text-anchor="middle">g4solio</text></svg>`;

/** The counter front's stickers, placed in a 600 × 150 box from its top-left corner. */
export const stickers: { svg: string; x: number; y: number; r: number }[] = [
  { svg: stencil(9), x: 0, y: 18, r: 0 },
  { svg: pix("lute", 4, LUTE), x: 172, y: 10, r: 12 },
  { svg: d20(74), x: 152, y: 70, r: 9 },
  { svg: pix("cat", 5), x: 250, y: 8, r: -6 },
  { svg: twice, x: 325, y: 22, r: -4 },
  { svg: linq, x: 478, y: 8, r: 3 },
  { svg: mo, x: 492, y: 74, r: -5 },
  { svg: handle, x: 348, y: 90, r: 4 },
];

/** The black cat, curled asleep, the window's light on its back. */
export const cat = `<svg viewBox="0 0 260 124"><defs>
  <radialGradient id="acc-fur" cx=".7" cy=".1" r="1"><stop offset="0" stop-color="#2d2925"/><stop offset=".6" stop-color="#161513"/><stop offset="1" stop-color="#0f0e0d"/></radialGradient></defs>
  <path d="M74 118 C56 86 82 46 142 42 C204 38 250 70 246 104 C245 114 238 118 228 118 Z" fill="url(#acc-fur)"/>
  <path d="M118 46 C170 36 224 52 244 90" fill="none" stroke="rgba(255,226,170,.55)" stroke-width="3" stroke-linecap="round"/>
  <path d="M244 112 C226 128 140 128 96 118 C86 116 86 108 96 108 C140 114 210 114 232 102" fill="#141311" stroke="#2c2824" stroke-width="1.5"/>
  <path d="M30 104 C24 82 36 62 56 58 L52 30 C52 26 56 25 58 28 L74 52 C82 50 90 50 98 52 L112 30 C114 26 119 27 118 32 L116 62 C126 74 126 96 116 108 C104 120 54 122 30 104 Z" fill="url(#acc-fur)"/>
  <path d="M57 34 L68 50 L58 52 Z M113 36 L110 56 L102 52 Z" fill="#3a2f2b"/>
  <path d="M112 30 C114 26 119 27 118 32" fill="none" stroke="rgba(255,226,170,.6)" stroke-width="2"/>
  <path d="M50 84 q8 6 16 0 M84 84 q8 6 16 0" fill="none" stroke="#86817a" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M71 96 l4 3 l4 -3" fill="none" stroke="#5a5550" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M60 100 l-26 -2 M60 103 l-24 4 M90 100 l26 -2 M90 103 l24 4" stroke="rgba(200,195,185,.45)" stroke-width="1"/>
  <path d="M46 118 C48 108 70 108 72 118 M80 118 C82 108 104 108 106 118" fill="#1a1917" stroke="#2c2824" stroke-width="1.5"/></svg>`;

export const bell = `<svg viewBox="0 0 120 90"><defs><linearGradient id="acc-steel" x1="0" x2="1"><stop offset="0" stop-color="#7d8080"/><stop offset=".35" stop-color="#f3f3ef"/><stop offset="1" stop-color="#8d8f8f"/></linearGradient></defs>
  <rect x="52" y="6" width="16" height="10" rx="3" fill="url(#acc-steel)" stroke="#4c4b44" stroke-width="1.5"/><rect x="57" y="14" width="6" height="12" fill="url(#acc-steel)" stroke="#4c4b44" stroke-width="1.5"/>
  <path d="M18 72 Q18 26 60 26 Q102 26 102 72 Z" fill="url(#acc-steel)" stroke="#4c4b44" stroke-width="1.5"/><rect x="8" y="72" width="104" height="12" rx="3" fill="#1b1b18"/></svg>`;

/** Modena through the window: the Ghirlandina, the roofs, the afternoon sky. */
export const windowView = `<svg viewBox="0 0 160 260"><defs>
  <linearGradient id="acc-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd3e0"/><stop offset=".55" stop-color="#ecd9b0"/><stop offset="1" stop-color="#f3d39a"/></linearGradient>
  <linearGradient id="acc-glass" x1="0" y1="0" x2="1" y2="1"><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".45" stop-color="#fff" stop-opacity=".28"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  <rect width="160" height="250" fill="#7a5434"/>
  <rect x="10" y="10" width="140" height="232" fill="url(#acc-sky)"/>
  <g opacity=".9">
    <path d="M96 242 V118 h12 V242Z" fill="#e6dcc8"/><path d="M95 118 h14 v-12 h-14Z" fill="#ddd2bc"/><path d="M97 106 h10 l-5 -40 Z" fill="#d6cab2"/><circle cx="102" cy="64" r="1.6" fill="#c9bea6"/>
    <path d="M100 140 v8 M104 140 v8 M100 176 v8 M104 176 v8 M100 210 v6 M104 210 v6" stroke="#b7ab92" stroke-width="1.4"/>
    <path d="M10 196 h22 v-10 l12 -8 l12 8 v10 h16 v46 H10Z" fill="#d79a5e"/><path d="M8 196 l24 -12 l24 12Z M56 196 l18 -10 l18 10Z" fill="#a5472a"/>
    <path d="M112 204 h38 v38 h-38Z" fill="#e2b67a"/><path d="M110 206 l20 -12 l22 12Z" fill="#a5472a"/>
    <path d="M60 214 h36 v28 h-36Z" fill="#c98a52"/><path d="M14 210 h6 v8 h-6Z M40 210 h6 v8 h-6Z M66 222 h6 v8 h-6Z M120 216 h6 v8 h-6Z" fill="#8a5a36"/>
  </g>
  <rect x="10" y="10" width="140" height="232" fill="url(#acc-glass)"/>
  <path d="M10 88 h140 M10 166 h140" stroke="#7a5434" stroke-width="5"/><path d="M80 10 v232" stroke="#7a5434" stroke-width="8"/>
  <rect x="-6" y="246" width="172" height="12" fill="#e9e4da"/><rect x="-6" y="256" width="172" height="4" fill="#cfc8ba"/></svg>`;

/** The officina clock at twenty to five, the hour of the light on the counter. */
export const clock = (() => {
  const ticks = [...Array(12)]
    .map((_, i) => {
      const a = (i * Math.PI) / 6;
      return `<line x1="${r2d(50 + 38 * Math.sin(a))}" y1="${r2d(50 - 38 * Math.cos(a))}" x2="${r2d(50 + 43 * Math.sin(a))}" y2="${r2d(50 - 43 * Math.cos(a))}" stroke="#1b1b18" stroke-width="${i % 3 ? 1.6 : 3}"/>`;
    })
    .join("");
  const hand = (deg: number, len: number, wid: number, col: string) =>
    `<line x1="50" y1="50" x2="${r2d(50 + len * Math.sin((deg * Math.PI) / 180))}" y2="${r2d(50 - len * Math.cos((deg * Math.PI) / 180))}" stroke="${col}" stroke-width="${wid}" stroke-linecap="round"/>`;
  const nums = (
    [
      ["12", 50, 24],
      ["3", 77, 54],
      ["6", 50, 83],
      ["9", 23, 54],
    ] as const
  )
    .map(([t, x, y]) => `<text x="${x}" y="${y}" ${DISPLAY} font-size="10" text-anchor="middle">${t}</text>`)
    .join("");
  return `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="49" fill="#1b1b18"/><circle cx="50" cy="50" r="45" fill="#fbfaf6"/>${ticks}${nums}
  ${hand(140, 22, 4, "#1b1b18")}${hand(240, 33, 2.6, "#1b1b18")}${hand(196, 36, 1, "#d8352a")}<circle cx="50" cy="50" r="2.6" fill="#d8352a"/></svg>`;
})();

/** The graphite pencil and the red one that draws the rings, lying on the parallel rule. */
export const pencils = `<svg viewBox="0 0 210 30">
  <g transform="rotate(-4 100 15)"><rect x="20" y="6" width="150" height="9" fill="#2f5b46"/><path d="M170 6 l18 4.5 l-18 4.5z" fill="#e2c9a0"/><path d="M184 9 l4 1.5 l-4 1.5z" fill="#3a3a38"/><rect x="12" y="6" width="9" height="9" fill="#b8b8b2"/></g>
  <g transform="rotate(3 100 22)"><rect x="40" y="18" width="120" height="9" fill="#c8322a"/><path d="M160 18 l18 4.5 l-18 4.5z" fill="#e2c9a0"/><path d="M174 21 l4 1.5 l-4 1.5z" fill="#c8322a"/></g></svg>`;

export const pen = `<svg viewBox="0 0 26 200"><rect x="6" y="20" width="14" height="160" rx="3" fill="#f4f4f0" stroke="#bdbdb6"/><rect x="6" y="20" width="14" height="22" rx="3" fill="#24408f"/>
  <rect x="17" y="24" width="5" height="70" rx="2" fill="#24408f"/><path d="M6 180 L13 198 L20 180Z" fill="#e6e3da" stroke="#bdbdb6"/></svg>`;

/** A key on its brass screw hook, the split ring over the tag's hole. Silver or brass, swaying a little. */
export function hookAndKey(i: number, hx: number, hy: number) {
  const [fill, line] = i % 3 === 1 ? ["#cfa94e", "#8a6a2a"] : ["#cfd2cf", "#7d817f"];
  const sway = [-4, 3, -2, 5, -1][i % 5];
  return `<circle cx="${hx}" cy="${hy}" r="4" fill="#cfa94e" stroke="#8a6a2a"/>
  <path d="M${hx} ${hy} v9 q0 7 -6 7" fill="none" stroke="#b08a3a" stroke-width="2.6" stroke-linecap="round"/>
  <g transform="translate(${hx - 2} ${hy + 22}) rotate(${sway})"><circle r="9" fill="${fill}" stroke="${line}" stroke-width="1.3"/><circle r="3" fill="#cdb488"/>
  <path d="M-3 8 L3 8 L3 22 L8 22 L8 26 L5 26 L5 30 L9 30 L9 34 L3 34 L3 46 L0 49 L-3 46 Z" fill="${fill}" stroke="${line}" stroke-width="1.3" stroke-linejoin="round"/></g>
  <circle cx="${hx - 10}" cy="${hy + 28}" r="6" fill="none" stroke="#b9bdba" stroke-width="2"/>`;
}

/** An empty hook, where a key whose facts are all told used to hang. */
export const emptyHook = (hx: number, hy: number) =>
  `<circle cx="${hx}" cy="${hy}" r="4" fill="#cfa94e" stroke="#8a6a2a"/><path d="M${hx} ${hy} v9 q0 7 -6 7" fill="none" stroke="#b08a3a" stroke-width="2.6" stroke-linecap="round"/>`;

const SEGMENTS: Record<string, string> = { "0": "abcdef", "1": "bc", "2": "abdeg", "3": "abcdg", "4": "bcfg", "5": "acdfg", "6": "acdefg", "7": "abc", "8": "abcdefg", "9": "abcdfg" };

/** Two seven-segment digits, the unlit segments faint behind the lit ones. */
export function sevenSeg(digits: string, h: number) {
  const w = h * 0.55, t = h * 0.11, m = h / 2;
  const seg: Record<string, number[]> = {
    a: [t, 0, w - 2 * t, t], d: [t, h - t, w - 2 * t, t], g: [t, m - t / 2, w - 2 * t, t],
    f: [0, t, t, m - 1.5 * t], b: [w - t, t, t, m - 1.5 * t], e: [0, m + t / 2, t, m - 1.5 * t], c: [w - t, m + t / 2, t, m - 1.5 * t],
  };
  const digit = (d: string, x: number) =>
    Object.entries(seg)
      .map(([k, [sx, sy, sw, sh]]) => `<rect x="${x + sx}" y="${sy}" width="${sw}" height="${sh}" rx="${t / 2}" fill="${SEGMENTS[d].includes(k) ? "#ff3b1f" : "#221210"}" transform="skewX(-6)"/>`)
      .join("");
  return `<svg viewBox="0 0 ${h * 1.3} ${h}" aria-hidden="true">${digit(digits[0], 4)}${digit(digits[1], 4 + h * 0.66)}</svg>`;
}

/** A ring drawn by hand: a little over one turn, the ends crossing where the pencil lifted. */
export function scribble(seed: number) {
  let r = (seed * 7919) % 233280;
  const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  const a0 = Math.PI * (0.9 + rnd() * 0.12);
  const pts: string[] = [];
  for (let k = 0; k <= 56; k++) {
    const t = k / 56, a = a0 + Math.PI * 2 * 1.12 * t;
    const rx = 50 * (1 + 0.03 * Math.sin(3 * a + seed) + (t > 0.88 ? (t - 0.88) * 0.7 : 0));
    const ry = 50 * (1 + 0.07 * Math.cos(2 * a + seed * 2) - (t > 0.85 ? (t - 0.85) * 0.9 : 0));
    pts.push(`${(50 + rx * Math.cos(a)).toFixed(1)},${(50 + ry * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}
