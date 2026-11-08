"use client";

import { type ReactElement, type ReactNode, useEffect, useRef } from "react";
import { Schematic } from "@/components/Schematic";
import { type Layout, type Move, layoutSlots } from "@/data/meet";
import type { SchematicId } from "@/data/portfolio";

// The laid-out cabinet screens: same tube, same four colours, the same items and keys as the plain menu.
// What changes is the layout and its pixel art. Picked from rendered candidates for issue #6.

type Item = { id: string; label: string; run: () => void };

/** Pixel art as code grids in the tube's colours: # text, o highlight, d dim. One rect per run of a row. */
const INK: Record<string, string> = { "#": "px-t", o: "px-h", d: "px-d" };
function Pixels({ rows, cell }: { rows: string[]; cell: number }) {
  const w = Math.max(...rows.map((r) => r.length));
  const runs: ReactElement[] = [];
  rows.forEach((row, y) => {
    for (let x = 0, n = 1; x < row.length; x += n, n = 1) {
      while (row[x + n] === row[x]) n++;
      if (INK[row[x]]) runs.push(<rect key={`${x}.${y}`} x={x} y={y} width={n} height={1} className={INK[row[x]]} />);
    }
  });
  return (
    <svg className="crt-px" width={w * cell} height={rows.length * cell} viewBox={`0 0 ${w} ${rows.length}`} shapeRendering="crispEdges" aria-hidden="true">
      {runs}
    </svg>
  );
}

const HOUSE = ["....##....", "...####...", "..######..", ".########.", "##########", ".#......#.", ".#.oo.###.", ".#.oo.#.#.", ".#....#.#.", ".########."];
const OFFICE = ["##########", "#o.o.o.o.#", "#........#", "#o.o.o.o.#", "#........#", "#o.o.o.o.#", "#........#", "#o.o##o.o#", "#...##...#", "##########"];
/** The Ghirlandina, Modena's tower: it stands behind the stages within reach of home. */
const TOWER = ["...d...", "...d...", "..ddd..", "..ddd..", "..ddd..", ".ddddd.", ".ddddd.", ".d.d.d.", ".ddddd.", ".ddddd.", ".dd.dd.", ".ddddd.", ".ddddd.", ".ddddd.", ".dd.dd.", ".ddddd.", ".ddddd.", ".ddddd.", ".ddddd.", "ddddddd"];
const CHEVRON = ["...#...", "..###..", ".##.##.", "##...##"];
const chevrons = (n: number) => Array.from({ length: n }, () => CHEVRON).flatMap((c, i) => (i ? ["", ...c] : c));
const STAR = ["....#....", "....#....", "...###...", "#########", ".#######.", "..#####..", "..##.##..", ".##...##.", "##.....##"];
/** One insignia per rung, top rung first, as the ladder's choices are ordered. */
const RUNGS = [STAR, ["#######", "", ...chevrons(3)], chevrons(3), chevrons(2), chevrons(1)];
/** The cat asleep on the hood, the same grid as the sticker in scripts/cabinet/render.html. */
const CAT = ["#....#......", "##..##......", "######......", "#o##o#......", "######......", ".####.......", "######......", "#######.....", "#######.....", "#######...#.", "#######..##.", "#######.##..", "#########...", "##.###......"];

/** The designated Mage from the side art: the 24 × 34 grid scripts/cabinet/render.html builds, in the tube's inks. */
const MAGE = (() => {
  const g = Array.from({ length: 34 }, () => Array(24).fill("."));
  const span = (r: number, c0: number, c1: number, ch = "#") => {
    for (let c = c0; c <= c1; c++) g[r][c] = ch;
  };
  ["..ooooo..", ".ooooooo.", "ooooooooo", "ooooooooo", "ooooooooo", ".ooooooo.", "..ooooo.."].forEach((row, i) => [...row].forEach((ch, j) => ch !== "." && (g[8 + i][j] = ch)));
  span(6, 4, 4, "o"); span(7, 3, 3, "o"); span(7, 5, 5, "o"); // flame
  [[0, 16, 16], [1, 16, 16], [2, 15, 17], [3, 15, 17], [4, 14, 18], [5, 14, 18], [6, 13, 19], [7, 13, 19], [8, 12, 20], [9, 9, 22], [10, 13, 19], [11, 13, 19]].forEach(([r, a, b]) => span(r, a, b)); // hat, brim, head
  for (let r = 12; r <= 33; r++) span(r, r < 18 ? 12 : r < 24 ? 11 : r < 30 ? 10 : 9, 20); // robe
  span(15, 9, 11); span(16, 8, 11); span(17, 8, 11); span(18, 9, 11); // sleeve
  span(16, 6, 7, "d"); span(17, 6, 7, "d"); // hand
  for (let r = 12; r <= 14; r++) span(r, 14, 18, "d");
  span(15, 15, 17, "d"); span(16, 15, 17, "d"); span(17, 16, 16, "d"); // beard
  span(20, 11, 20, "o"); // sash
  for (let r = 4; r <= 33; r++) span(r, 22, 22);
  span(1, 22, 22, "o"); span(2, 21, 23, "o"); span(3, 22, 22, "o"); // staff, crystal
  return g.map((r) => r.join(""));
})();

/**
 * The typed moves dress the one input the cabinet owns, passed in as `field`: NAME ENTRY seats the
 * recruiter as player 2 beside Davide, INSERT COIN puts the coin door above it, PLAYER 1 writes the role
 * as the Mage's class, FREE PLAY opens it up. Any other typed move gets the plain field.
 */
export function TypedField({ layout, field, prefix, filled }: { layout?: Layout; field: ReactNode; prefix: string; filled: boolean }) {
  if (layout === "players") {
    return (
      <div className="crt-players">
        <div>
          <b>1P</b>
          <span>DAVIDE</span>
          <i>HOST</i>
        </div>
        <label className="is-on">
          <b>2P</b>
          {field}
          <i>JOINING</i>
        </label>
      </div>
    );
  }
  if (layout === "class") {
    return (
      <div className="crt-class">
        <Pixels rows={MAGE} cell={2.6} />
        <div>
          <span className="crt-k">PLAYER 1</span>
          <b>DAVIDE</b>
          <label>
            <span className="crt-k">CLASS</span>
            {field}
          </label>
        </div>
      </div>
    );
  }
  const plain = (
    <label className={`crt-field${layout === "open" ? " crt-open" : ""}`}>
      <span>{layout === "coin" ? "◉" : prefix}</span>
      {field}
    </label>
  );
  if (layout !== "coin") return plain;
  return (
    <>
      <div className="crt-door" aria-hidden="true">
        {[0, 1].map((i) => (
          <span key={i}>
            <i />
            <b>INSERT COIN</b>
          </span>
        ))}
      </div>
      {plain}
      <p className="crt-credit" aria-hidden="true">
        CREDIT {filled ? 1 : 0}
      </p>
    </>
  );
}

const SCENES: Record<string, ReactNode> = {
  REMOTE: <Pixels rows={HOUSE} cell={3} />,
  HYBRID: (
    <span className="crt-scene">
      <Pixels rows={HOUSE} cell={2.6} />
      <Pixels rows={OFFICE} cell={2.1} />
    </span>
  ),
  "ON SITE": <Pixels rows={OFFICE} cell={3} />,
};

/** CONTINUE?: the countdown stops at 1, with the cat asleep on it. Nothing blocks anyone. */
export function Countdown({ title }: { title: string }) {
  return (
    <div className="crt-count">
      <h2 className="crt-title">{title}</h2>
      <span className="crt-count-art" aria-hidden="true">
        <span className="crt-count-n">1</span>
        <span className="crt-count-cat">
          <Pixels rows={CAT} cell={4} />
        </span>
      </span>
    </div>
  );
}

/**
 * A boss portrait: the engineering note's own schematic, rendered by <Schematic>, rasterized small and
 * snapped to the tube's colours. Nothing is drawn by hand, so a portrait cannot drift from its note.
 */
function Portrait({ id }: { id: SchematicId }) {
  const host = useRef<HTMLSpanElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const svg = host.current?.querySelector("svg");
    const c = canvas.current;
    if (!svg || !c) return;
    const css = getComputedStyle(c);
    const ink: Record<string, string> = { "s-accent": css.getPropertyValue("--crt-hi").trim(), "s-line": css.getPropertyValue("--crt-text").trim(), "s-faint": "#6f726e" };
    const copy = svg.cloneNode(true) as SVGSVGElement;
    copy.querySelectorAll("text").forEach((t) => t.remove());
    copy.setAttribute("width", String(c.width));
    copy.setAttribute("height", String(c.height));
    copy.querySelector("g")?.setAttribute("stroke-width", "5.75"); // about one pixel at 64 wide
    copy.querySelectorAll("path, rect, circle").forEach((el) => {
      el.removeAttribute("pathLength"); // the draw-in's unit length would turn every dash solid
      const k = Object.keys(ink).find((key) => el.classList.contains(key));
      if (k) el.setAttribute("stroke", ink[k]);
      if (el.hasAttribute("stroke-dasharray")) el.setAttribute("stroke-dasharray", "16 16");
    });
    const rgb = Object.values(ink).map((hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)));
    const img = new Image();
    img.onload = () => {
      const g = c.getContext("2d");
      if (!g) return;
      g.clearRect(0, 0, c.width, c.height);
      g.drawImage(img, 0, 0, c.width, c.height);
      const d = g.getImageData(0, 0, c.width, c.height);
      for (let i = 0; i < d.data.length; i += 4) {
        if (d.data[i + 3] < 70) {
          d.data[i + 3] = 0;
          continue;
        }
        const dist = (p: number[]) => p.reduce((s, v, j) => s + (v - d.data[i + j]) ** 2, 0);
        d.data.set([...rgb.reduce((a, b) => (dist(b) < dist(a) ? b : a)), 255], i);
      }
      g.putImageData(d, 0, 0);
    };
    img.src = "data:image/svg+xml," + encodeURIComponent(new XMLSerializer().serializeToString(copy));
  }, [id]);
  return (
    <span className="crt-portrait">
      <span ref={host} hidden>
        <Schematic id={id} />
      </span>
      <canvas ref={canvas} width={64} height={40} />
    </span>
  );
}

/** The choices of a laid-out move: the layout holds the first ones, the rest sit aside as buttons. */
export function MoveLayout({ move, items, sel, setSel }: { move: Move; items: Item[]; sel: number; setSel: (i: number) => void }) {
  const layout = move.layout as keyof typeof layoutSlots;
  const slots = layoutSlots[layout];
  const choices = move.choices ?? [];
  const on = (i: number) => (i === sel ? " is-on" : "");
  const pick = (i: number) => ({
    type: "button" as const,
    onClick: items[i].run,
    onMouseEnter: () => setSel(i),
    onFocus: () => setSel(i),
    "aria-current": i === sel ? ("true" as const) : undefined,
  });
  const asideLabel = (i: number) => `${choices[i]?.cmd === "unknown" ? "? " : ""}${choices[i]?.short ?? items[i].label}`;
  const held = items.slice(0, slots);
  const aside = (cls: string) =>
    items.slice(slots).map((it, k) => (
      <button key={it.id} className={`${cls}${on(slots + k)}`} {...pick(slots + k)}>
        {asideLabel(slots + k)}
      </button>
    ));

  if (layout === "stages") {
    return (
      <>
        <div className="crt-tiles">
          {held.map((it, i) => {
            const [mode, where] = (choices[i].short ?? "").split(" · ");
            return (
              <button key={it.id} className={`crt-tile${on(i)}`} aria-label={it.label} {...pick(i)}>
                {i % 2 === 0 && (
                  <span className="crt-tile-bd">
                    <Pixels rows={TOWER} cell={2.6} />
                  </span>
                )}
                {SCENES[mode]}
                <span className="crt-tile-t">
                  <b>{mode}</b>
                  <span>{where}</span>
                </span>
              </button>
            );
          })}
          {aside("crt-tile crt-tile-wide")}
        </div>
        <p className="crt-caption">› {items[sel]?.label}</p>
      </>
    );
  }

  if (layout === "ladder") {
    return (
      <>
        <div className="crt-ladder">
          {held.map((it, i) => (
            <button key={it.id} className={`crt-rung${on(i)}`} {...pick(i)}>
              <span className="crt-rung-ins">
                <Pixels rows={RUNGS[i]} cell={2} />
              </span>
              {it.label}
            </button>
          ))}
        </div>
        <div className="crt-asides">{aside("crt-aside")}</div>
      </>
    );
  }

  if (layout === "counter") {
    const band = sel < slots ? choices[sel]?.short : undefined;
    return (
      <>
        <div className="crt-counter">
          <span className="crt-counter-k" aria-hidden="true">
            CREDIT · RAL
          </span>
          <button type="button" className="crt-counter-ar" aria-label="A band up" onClick={() => setSel(Math.max(0, sel - 1))}>
            ▲
          </button>
          <button type="button" className={`crt-counter-v${band ? "" : " is-off"}`} aria-label={`Choose: ${items[sel]?.label}`} onClick={() => items[sel]?.run()}>
            {band ?? "– –"}
          </button>
          <button type="button" className="crt-counter-ar" aria-label="A band down" onClick={() => setSel(Math.min(items.length - 1, sel + 1))}>
            ▼
          </button>
        </div>
        {/* The meter reads low to high, left to right: the reverse of the data's top-first order. */}
        <div className="crt-meter">
          {held
            .map((it, i) => <button key={it.id} className={on(i).trim()} aria-label={it.label} {...pick(i)} />)
            .reverse()}
        </div>
        <div className="crt-asides">{aside("crt-aside")}</div>
      </>
    );
  }

  // bosses
  return (
    <>
      <div className="crt-bosses">
        {held.map((it, i) => (
          <button key={it.id} className={`crt-boss${on(i)}`} aria-label={it.label} {...pick(i)}>
            <span className="crt-boss-n">{it.label.slice(0, 2)}</span>
            <Portrait id={choices[i].cmd as SchematicId} />
          </button>
        ))}
      </div>
      <p className="crt-caption crt-caption-px">{items[sel]?.label}</p>
      <div className="crt-asides">{aside("crt-aside")}</div>
    </>
  );
}
