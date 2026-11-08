"use client";

import { type RefObject, useEffect, useRef, useState } from "react";
import { rounds } from "@/data/meet";

// Three one-button rounds, each twenty seconds, each ending with the fact whatever the score.
// The pixel art is code grids in the tube's colours; the loop is requestAnimationFrame with delta time.

const W = 384;
const H = 256;
const SECONDS = 20;
const TEXT = "#d9d9d3";
const HI = "#7ea2ea";
const DIM = "#6f726e";

type Kind = (typeof rounds)[string];

export const ROUND_TITLES: Record<Kind, string> = { runner: "ENUMERATED TWICE", shooter: "GALACTIC FIGHTERS", pounce: "ALWAYS CATS" };
const HINTS: Record<Kind, string> = { runner: "A · JUMP", shooter: "A · FIRE", pounce: "A · POUNCE" };

type Game = {
  unit: string;
  score: () => number;
  press: () => void;
  update: (dt: number, t: number) => void;
  draw: (g: CanvasRenderingContext2D, t: number) => void;
};

const grid = (rows: string[]) => rows.map((r) => [...r].map((ch) => ch === "#"));
function sprite(g: CanvasRenderingContext2D, cells: boolean[][], x: number, y: number, px: number, color: string) {
  g.fillStyle = color;
  cells.forEach((row, j) => row.forEach((on, i) => on && g.fillRect(Math.round(x + i * px), Math.round(y + j * px), px, px)));
}

const DINO = grid([
  "..........########..",
  ".........##########.",
  ".........##.#######.",
  ".........##########.",
  ".........#######....",
  ".........##########.",
  "#........#######....",
  "#.......########....",
  "##.....#########....",
  "###...##########....",
  "################....",
  ".###############....",
  "..#############.....",
  "...###########......",
  "....#########.......",
  ".....##...##........",
  ".....##...##........",
  ".....#....#.........",
  ".....##...##........",
]);
const CACTUS = grid(["..##..", "..##..", "#.##.#", "#.##.#", "#.##.#", "######", "..##..", "..##..", "..##..", "..##..", "..##..", "..##.."]);
const SHIP = grid([".....#.....", "....###....", "....###....", "#...###...#", "##.#####.##", "###########", "#.#######.#"]);
const DRONE = grid(["....###....", "...#####...", "..##.#.##..", ".#########.", "..#.###.#..", "...#...#..."]);
const CAT = grid(["#....#......", "##..##......", "######......", "#.##.#......", "######......", ".####.......", "######......", "#######.....", "#######.....", "#######...#.", "#######..##.", "#######.##..", "#########...", "##.###......"]);

/** The bug that lives in his head: every obstacle comes twice, so every jump has to clear the pair. */
function runner(): Game {
  const ground = H - 36;
  const px = 2;
  const pairs: { x: number; passed: boolean; hit: boolean }[] = [];
  let y = 0;
  let vy = 0;
  let speed = 260;
  let hits = 0;
  let cleared = 0;
  let flash = 0;
  let spawn = 1.1;
  return {
    unit: "PAIRS CLEARED",
    score: () => cleared,
    press() {
      if (y <= 0) vy = 640;
    },
    update(dt, t) {
      speed = 260 + 110 * (t / SECONDS);
      vy -= 1900 * dt;
      y = Math.max(0, y + vy * dt);
      if (y === 0 && vy < 0) vy = 0;
      spawn -= dt;
      if (spawn <= 0) {
        pairs.push({ x: W + 20, passed: false, hit: false });
        spawn = 1.5 + Math.random() * 0.9;
      }
      const dinoX = 36;
      for (const p of pairs) {
        p.x -= speed * dt;
        const overlap = p.x < dinoX + 30 && p.x + 30 > dinoX + 8;
        if (overlap && y < 20 && !p.hit) {
          p.hit = true;
          hits++;
          flash = 0.25;
        }
        if (!p.passed && p.x + 30 < dinoX) {
          p.passed = true;
          if (!p.hit) cleared++;
        }
      }
      while (pairs.length && pairs[0].x < -40) pairs.shift();
      flash = Math.max(0, flash - dt);
    },
    draw(g) {
      g.fillStyle = TEXT;
      g.fillRect(0, ground, W, 1);
      for (const p of pairs) {
        sprite(g, CACTUS, p.x, ground - 24, px, p.hit ? DIM : TEXT);
        g.globalAlpha = 0.55; // the second enumeration: the same obstacle, again
        sprite(g, CACTUS, p.x + 18, ground - 24, px, HI);
        g.globalAlpha = 1;
      }
      sprite(g, DINO, 36, ground - 38 - y, px, flash > 0 ? HI : TEXT);
      g.fillStyle = DIM;
      g.font = '400 11px "JetBrains Mono", monospace';
      g.textAlign = "right";
      g.fillText(`hits ${hits}`, W - 12, 20);
      g.textAlign = "left";
    },
  };
}

/** Galactic Fighters, the one-button cut: the ship sweeps on its own, A fires. */
function shooter(): Game {
  const stars = Array.from({ length: 40 }, () => [Math.random() * W, Math.random() * (H - 40)]);
  let shots: { x: number; y: number }[] = [];
  let drones: { x: number; y: number; vy: number; dead: number }[] = [];
  let x = W / 2;
  let dir = 1;
  let hits = 0;
  let spawn = 0.5;
  let cool = 0;
  return {
    unit: "HITS",
    score: () => hits,
    press() {
      if (cool <= 0 && shots.length < 3) {
        shots.push({ x, y: H - 40 });
        cool = 0.14;
      }
    },
    update(dt) {
      x += dir * 170 * dt;
      if (x < 24 || x > W - 24) {
        dir = -dir;
        x = Math.min(W - 24, Math.max(24, x));
      }
      cool -= dt;
      spawn -= dt;
      if (spawn <= 0) {
        drones.push({ x: 30 + Math.random() * (W - 60), y: -10, vy: 45 + Math.random() * 35, dead: 0 });
        spawn = 0.75 + Math.random() * 0.5;
      }
      for (const s of shots) s.y -= 460 * dt;
      for (const d of drones) {
        if (d.dead) {
          d.dead += dt;
          continue;
        }
        d.y += d.vy * dt;
        for (const s of shots) {
          if (Math.abs(s.x - d.x) < 14 && Math.abs(s.y - d.y) < 10) {
            d.dead = 0.001;
            hits++;
            s.y = -100;
          }
        }
      }
      shots = shots.filter((s) => s.y > -20);
      drones = drones.filter((d) => d.y < H + 10 && d.dead < 0.3);
    },
    draw(g) {
      g.fillStyle = DIM;
      for (const [sx, sy] of stars) g.fillRect(sx, sy, 1, 1);
      sprite(g, SHIP, x - 11, H - 36, 2, TEXT);
      g.fillStyle = HI;
      for (const s of shots) g.fillRect(s.x - 1, s.y - 6, 2, 8);
      for (const d of drones) {
        if (d.dead) {
          const r = 3 + d.dead * 50;
          g.fillStyle = HI;
          for (const [ox, oy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) g.fillRect(d.x + ox * r - 1, d.y + oy * r - 1, 3, 3);
        } else sprite(g, DRONE, d.x - 11, d.y - 6, 2, TEXT);
      }
    },
  };
}

/** Cats, always cats: the dot wanders, A pounces where it is now, and it had better still be there. */
function pounce(): Game {
  const pick = () => ({ x: 30 + Math.random() * (W - 60), y: 60 + Math.random() * (H - 120) });
  const dot = { x: W / 2, y: H / 2 };
  let target = pick();
  let retarget = 1.2;
  const cat = { x: W / 2 - 18, y: H - 70, air: 0, fromX: 0, fromY: 0, toX: 0, toY: 0 };
  let catches = 0;
  return {
    unit: "CATCHES",
    score: () => catches,
    press() {
      if (cat.air > 0) return;
      cat.air = 0.4;
      cat.fromX = cat.x;
      cat.fromY = cat.y;
      cat.toX = dot.x - 18;
      cat.toY = dot.y - 24;
    },
    update(dt) {
      const dx = target.x - dot.x;
      const dy = target.y - dot.y;
      const dist = Math.hypot(dx, dy);
      const stepLength = Math.min(dist, 130 * dt);
      if (dist > 0) {
        dot.x += (dx / dist) * stepLength;
        dot.y += (dy / dist) * stepLength;
      }
      retarget -= dt;
      if (dist < 2 || retarget <= 0) {
        target = pick();
        retarget = 0.9 + Math.random() * 0.8;
      }
      if (cat.air > 0) {
        cat.air -= dt;
        const k = 1 - Math.max(0, cat.air) / 0.4;
        cat.x = cat.fromX + (cat.toX - cat.fromX) * k;
        cat.y = cat.fromY + (cat.toY - cat.fromY) * k;
        if (cat.air <= 0 && Math.hypot(cat.x + 18 - dot.x, cat.y + 24 - dot.y) < 24) {
          catches++;
          target = pick();
          dot.x = target.x;
          dot.y = target.y;
          target = pick();
        }
      }
    },
    draw(g, t) {
      g.fillStyle = DIM;
      for (let i = 0; i < 8; i++) g.fillRect(16 + i * 48, H - 20, 24, 1);
      const lift = cat.air > 0 ? Math.sin((1 - cat.air / 0.4) * Math.PI) * 26 : 0;
      if (lift > 0) {
        g.fillStyle = DIM;
        g.fillRect(cat.x + 6, cat.y + 40, 24, 2);
      }
      sprite(g, CAT, cat.x, cat.y - lift, 3, TEXT);
      g.fillStyle = HI;
      const r = 3 + Math.sin(t * 9) * 0.8;
      g.beginPath();
      g.arc(dot.x, dot.y, r, 0, Math.PI * 2);
      g.fill();
    },
  };
}

const GAMES: Record<Kind, () => Game> = { runner, shooter, pounce };

/**
 * One round: the countdown, the canvas, the soft A and SKIP under it. Space, Enter, the up arrow and a
 * tap on the canvas all press A; the physical button on the still presses through `pressRef`.
 */
export function Round({ topic, pressRef, onDone }: { topic: string; pressRef: RefObject<() => void>; onDone: (result: string) => void }) {
  const kind = rounds[topic];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const doneRef = useRef(onDone);
  const [left, setLeft] = useState(SECONDS);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    doneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const g = canvas?.getContext("2d");
    if (!canvas || !g) return;
    const dpr = Math.min(3, (window.devicePixelRatio || 1) * 1.5);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.imageSmoothingEnabled = false;
    const game = (gameRef.current ??= GAMES[kind]());
    let last = performance.now();
    let t = 0;
    let shown = SECONDS;
    let finished = false;
    let raf = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      game.update(dt, t);
      g.fillStyle = "#0b0d0b";
      g.fillRect(0, 0, W, H);
      game.draw(g, t);
      const l = Math.max(0, Math.ceil(SECONDS - t));
      if (l !== shown) {
        shown = l;
        setLeft(l);
      }
      if (t >= SECONDS) {
        finished = true;
        const r = `${game.score()} ${game.unit}`;
        setResult(r);
        window.setTimeout(() => doneRef.current(r), 1300);
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const press = () => {
      if (!finished) game.press();
    };
    pressRef.current = press;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        press();
      }
    };
    window.addEventListener("keydown", onKey);
    canvas.addEventListener("pointerdown", press);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      canvas.removeEventListener("pointerdown", press);
    };
  }, [kind, pressRef]);

  return (
    <div className="crt-round">
      <div className="crt-round-hud" aria-hidden="true">
        <span>{HINTS[kind]}</span>
        <span>00:{String(left).padStart(2, "0")}</span>
      </div>
      <canvas ref={canvasRef} className="crt-canvas" width={W} height={H} aria-label={`${ROUND_TITLES[kind]}: a twenty-second round, one button`} />
      {result ? (
        <p className="crt-result" aria-live="polite">
          ROUND CLEAR · {result}
        </p>
      ) : (
        <div className="crt-soft">
          <button type="button" onClick={() => pressRef.current?.()}>
            A
          </button>
          <button type="button" onClick={() => onDone("SKIPPED")}>
            SKIP
          </button>
        </div>
      )}
    </div>
  );
}
