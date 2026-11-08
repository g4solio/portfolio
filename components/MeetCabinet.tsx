"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  type Answers,
  askLine,
  briefText,
  factCount,
  facts,
  gameOverLine,
  mailtoHref,
  moves,
  rounds,
  scope,
  scoreOf,
  verdicts,
  verdictWord,
} from "@/data/meet";
import views from "@/data/meet-cabinet.json";
import { ROUND_TITLES, Round } from "./meet/rounds";
import { type Cue, createSound } from "./meet/sound";
import { Typed, linkify } from "./meet/Typed";

/** The live screen's logical size; a homography maps it onto the tube in the still. */
const SCREEN_W = 420;
const SCREEN_H = 560;

type Stage = "attract" | "play" | "over";
type Turn =
  | { kind: "move" }
  | { kind: "ask" }
  | { kind: "round"; topic: string; line: string }
  | { kind: "fact"; topic: string; index: number; line: string; result?: string };
type Item = { id: string; label: string; run: () => void };
type View = { width: number; height: number; screen: number[][]; button: number[] };

/** A CSS matrix3d that maps a w × h rectangle onto four points: top-left, top-right, bottom-right, bottom-left. */
function homography(w: number, h: number, q: number[][]): string {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const dy3 = y0 - y1 + y2 - y3;
  let a: number, b: number, d: number, e: number, g = 0, hh = 0;
  if (dx3 === 0 && dy3 === 0) {
    a = x1 - x0;
    b = x2 - x1;
    d = y1 - y0;
    e = y2 - y1;
  } else {
    const den = dx1 * dy2 - dx2 * dy1;
    g = (dx3 * dy2 - dx2 * dy3) / den;
    hh = (dx1 * dy3 - dx3 * dy1) / den;
    a = x1 - x0 + g * x1;
    b = x3 - x0 + hh * x3;
    d = y1 - y0 + g * y1;
    e = y3 - y0 + hh * y3;
  }
  const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, x0, y0, 0, 1];
  return `matrix3d(${m.map((v) => v.toFixed(6)).join(",")})`;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const pad2 = (n: number) => String(n).padStart(2, "0");
const topicLabel = (cmd: string) => facts.find((t) => t.cmd === cmd)?.label ?? cmd;

/** The first games fact is a top three, so it goes up as the high-score table. */
function FactBody({ topic, index, line }: { topic: string; index: number; line: string }) {
  const top = topic === "games" && index === 0 ? /top three: (.+)\.$/.exec(line) : null;
  if (!top) {
    return (
      <p className="crt-line">
        <Typed text={line} />
      </p>
    );
  }
  return (
    <>
      <table className="crt-scores">
        <tbody>
          {top[1].split(", ").map((title, i) => (
            <tr key={title}>
              <td>{["1ST", "2ND", "3RD"][i]}</td>
              <td>{title}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="crt-line">{line.slice(0, top.index).trim()}</p>
    </>
  );
}

export function MeetCabinet({ active, onTextMode }: { active: boolean; onTextMode: () => void }) {
  const [stage, setStage] = useState<Stage>("attract");
  const [answers, setAnswers] = useState<Answers>({});
  const [asked, setAsked] = useState<Record<string, number>>({});
  const [turn, setTurn] = useState<Turn>({ kind: "move" });
  const [sel, setSel] = useState(0);
  const [typedValue, setTypedValue] = useState("");
  const [soundOn, setSoundOn] = useState(false);
  const [note, setNote] = useState("");
  const [box, setBox] = useState({ w: 0, h: 0 });
  const sound = useRef<ReturnType<typeof createSound> | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pressRef = useRef<() => void>(() => {});

  const step = moves.findIndex((m) => !(m.key in answers));
  const current = step === -1 ? undefined : moves[step];
  const name = answers.name ?? "";
  const known = Object.values(asked).reduce((n, k) => n + k, 0);
  const remaining = facts.filter((t) => (asked[t.cmd] ?? 0) < t.lines.length);
  const moveNo = step === -1 ? moves.length : step + 1;

  const cue = (c: Cue) => {
    if (soundOn) (sound.current ??= createSound()).play(c);
  };

  // The box the still sits in; its size decides the scale of the still and the live screen.
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setBox({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const insertCoin = () => {
    cue("coin");
    setStage("play");
    setSel(0);
  };

  const finish = () => {
    setStage("over");
    setSel(0);
    cue("over");
  };

  /** A move answered: the recruiter's turn to ask, unless every fact is out. */
  const answer = (value: string) => {
    if (!current) return;
    const next = { ...answers, [current.key]: value };
    setAnswers(next);
    setTypedValue("");
    setNote("");
    setSel(0);
    cue("select");
    if (remaining.length > 0) setTurn({ kind: "ask" });
    else if (moves.some((m) => !(m.key in next))) setTurn({ kind: "move" });
    else finish();
  };

  const submitTyped = () => {
    if (!current?.typed) return;
    const value = typedValue.trim();
    if (!value) {
      if (current.typed.optional) answer("");
      else setNote("I need an answer here.");
      return;
    }
    answer(value.slice(0, current.typed.max));
  };

  /** A topic picked: its first fact on three topics is a round; every other fact is a screen. */
  const ask = (topic: string) => {
    const t = facts.find((f) => f.cmd === topic);
    if (!t) return;
    const i = asked[t.cmd] ?? 0;
    setAsked({ ...asked, [t.cmd]: i + 1 });
    setSel(0);
    cue("select");
    const line = t.lines[i];
    setTurn(i === 0 && rounds[topic] ? { kind: "round", topic, line } : { kind: "fact", topic, index: i, line });
  };

  /** The ask is done, told or skipped: the next question, or the end. */
  const proceed = () => {
    setSel(0);
    if (current) setTurn({ kind: "move" });
    else finish();
  };

  const roundDone = (result: string) => {
    cue("clear");
    setTurn((t) => (t.kind === "round" ? { kind: "fact", topic: t.topic, index: 0, line: t.line, result } : t));
  };

  const back = () => {
    const last = moves.filter((m) => m.key in answers).at(-1);
    if (!last) return;
    const rest = { ...answers };
    delete rest[last.key];
    setAnswers(rest);
    setTypedValue(last.typed ? (answers[last.key] ?? "") : "");
    setTurn({ kind: "move" });
    setSel(0);
    cue("move");
  };

  const reset = () => {
    setAnswers({});
    setAsked({});
    setTurn({ kind: "move" });
    setTypedValue("");
    setNote("");
    setSel(0);
    setStage("attract");
  };

  // What the screen shows and what A does there.
  let title = "";
  let line = "";
  let hint = "";
  let items: Item[] = [];
  if (stage === "over") {
    title = "GAME OVER";
    line = gameOverLine(name);
    hint = "↑↓ MOVE · A SELECT";
    items = [
      {
        id: "submit",
        label: "SUBMIT · mail me the brief",
        run: () => {
          window.location.assign(mailtoHref(answers));
          setNote("Opening your mail client with the brief. If nothing happens, COPY works too.");
        },
      },
      {
        id: "copy",
        label: "COPY · the brief as text",
        run: () =>
          navigator.clipboard.writeText(briefText(answers)).then(
            () => setNote("Copied. Paste it wherever you reached me."),
            () => setNote("Couldn’t copy here. Select the brief above instead."),
          ),
      },
      // relative: the site deploys under a basePath on GitHub Pages
      { id: "manual", label: "MANUAL · my one-page CV", run: () => window.open("../Davide_Gozzi_CV.pdf", "_blank", "noopener") },
      { id: "again", label: "PLAY AGAIN", run: reset },
    ];
  } else if (turn.kind === "ask") {
    title = "BONUS STAGE";
    line = askLine(name);
    hint = "↑↓ MOVE · A SELECT";
    items = [...remaining.map((t) => ({ id: t.cmd, label: t.label, run: () => ask(t.cmd) })), { id: "skip", label: "skip · next question", run: proceed }];
  } else if (turn.kind === "fact") {
    title = `BONUS · ${topicLabel(turn.topic)}`;
    hint = "A · CONTINUE";
    items = [{ id: "ok", label: "PRESS A", run: proceed }];
  } else if (turn.kind === "round") {
    title = `ROUND · ${ROUND_TITLES[rounds[turn.topic]]}`;
  } else if (current) {
    title = current.screen;
    line = current.line;
    if (current.choices) {
      hint = "↑↓ MOVE · A SELECT";
      items = current.choices.map((c) => ({ id: c.cmd, label: c.label, run: () => answer(c.cmd) }));
    } else {
      hint = current.typed?.hint ?? "";
      items = [{ id: "ok", label: "OK", run: submitTyped }, ...(current.typed?.optional ? [{ id: "skip", label: "SKIP", run: () => answer("") }] : [])];
    }
  }
  const menu = (stage === "over" || turn.kind === "ask" || (turn.kind === "move" && current?.choices)) && stage !== "attract";
  const pressA = () => {
    if (stage === "attract") insertCoin();
    else if (turn.kind === "round") pressRef.current();
    else items[sel]?.run();
  };

  // The keyboard is the joystick and the button: arrows or W and S move, Enter or Space is A, digits pick
  // an item outright, Backspace undoes a move. Typing in the field and the rounds handle their own keys.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const typing = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA";
      if (stage === "attract") {
        if (!typing && !["Shift", "Tab", "CapsLock", "Escape"].includes(e.key)) {
          e.preventDefault();
          insertCoin();
        }
        return;
      }
      if (typing || turn.kind === "round") return;
      const moveSel = (delta: number) => {
        if (items.length === 0) return;
        setSel((s) => (s + delta + items.length) % items.length);
        cue("move");
      };
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        moveSel(1);
      } else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        moveSel(-1);
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        items[sel]?.run();
      } else if (/^[1-9]$/.test(e.key) && menu && items[Number(e.key) - 1]) {
        e.preventDefault();
        items[Number(e.key) - 1].run();
      } else if (e.key === "Backspace" && turn.kind === "move" && step > 0) {
        e.preventDefault();
        back();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Standing at the cabinet: the still is scaled so the tube is as wide as the box allows, centred on it,
  // with the panel kept in view below. The live screen follows through the homography.
  const play = views.play as View;
  const hero = views.hero as View;
  const tubeW = play.screen[1][0] - play.screen[0][0];
  const cx = (play.screen[0][0] + play.screen[1][0]) / 2;
  const cy = (play.screen[0][1] + play.screen[3][1]) / 2;
  const s = clamp(box.w * 0.92, 260, 460) / tubeW;
  const frame = { w: play.width * s, h: play.height * s, left: box.w / 2 - cx * s, top: box.h * 0.46 - cy * s };
  const quad = play.screen.map(([x, y]) => [x * s + frame.left, y * s + frame.top]);
  const [bx, by, br] = play.button;
  const ready = box.w > 0;

  // A typed screen takes the keyboard as soon as the screen is visible. Mount-time autofocus is not
  // enough: on arrival the view is measured a frame after the coin drops, and a focus call inside a
  // still-hidden screen is ignored.
  const typedKey = stage === "play" && turn.kind === "move" && current?.typed ? current.key : null;
  useEffect(() => {
    if (ready && typedKey) inputRef.current?.focus({ preventScroll: true });
  }, [ready, typedKey]);

  return (
    <section className="room" data-stage={stage} aria-label="The arcade cabinet">
      {/* The arrival: the whole cabinet in its corner. A key or a tap walks up to it. */}
      <div className="cab-hero">
        <button type="button" className="cab-hero-btn" onClick={insertCoin} aria-label="Insert a coin and start">
          {/* eslint-disable-next-line @next/next/no-img-element -- a static export with a pre-rendered still; nothing to optimise */}
          <img
            src="../meet-cabinet-hero.webp"
            width={hero.width}
            height={hero.height}
            alt="A plywood arcade cabinet with a stencilled wizard on its side, stickers around the coin door and a cat asleep on the hood. Its screen says: insert coin."
          />
        </button>
      </div>

      {/* Standing at the cabinet: the still, the live screen mapped onto its tube, the button as a hotspot. */}
      <div className="cab-view" ref={boxRef}>
        {/* eslint-disable-next-line @next/next/no-img-element -- same still, same reason */}
        <img className="cab-still" src="../meet-cabinet-play.webp" alt="" style={{ left: frame.left, top: frame.top, width: frame.w, height: frame.h }} />
        <button
          type="button"
          className="cab-hot"
          aria-label="A button"
          onClick={pressA}
          style={{ left: bx * s + frame.left - br * s, top: by * s + frame.top - br * s, width: 2 * br * s, height: 2 * br * s }}
        />
        <div
          className={`crt${turn.kind === "fact" && stage === "play" ? " is-tap" : ""}`}
          role="region"
          aria-label="Arcade screen"
          style={{ width: SCREEN_W, height: SCREEN_H, transform: homography(SCREEN_W, SCREEN_H, quad), visibility: ready ? "visible" : "hidden" }}
          onClick={turn.kind === "fact" && stage === "play" ? proceed : undefined}
        >
          {stage === "attract" ? (
            <button type="button" className="crt-attract" onClick={insertCoin}>
              <span className="crt-kicker">DAVIDE GOZZI PRESENTS</span>
              <span className="crt-big">LET’S GET TO KNOW EACH OTHER</span>
              <span className="crt-blink">INSERT COIN</span>
              <span className="crt-dim">
                {moves.length} moves · {factCount} facts · 1 brief
              </span>
            </button>
          ) : (
            <>
              <div className="crt-hud" aria-hidden="true">
                <span>
                  KNOWN {pad2(known)}/{factCount}
                </span>
                <span>
                  MOVE {pad2(moveNo)}/{moves.length}
                </span>
              </div>
              <h2 className="crt-title">{title}</h2>

              {turn.kind === "round" && stage === "play" && <Round key={turn.topic} topic={turn.topic} pressRef={pressRef} onDone={roundDone} />}

              {turn.kind === "fact" && stage === "play" && (
                <>
                  {turn.result && <p className="crt-result">ROUND CLEAR · {turn.result}</p>}
                  <FactBody topic={turn.topic} index={turn.index} line={turn.line} />
                </>
              )}

              {(turn.kind === "move" || turn.kind === "ask" || stage === "over") && line && (
                <p className="crt-line" aria-live="polite">
                  <Typed key={`${stage}-${turn.kind}-${step}`} text={line} />
                </p>
              )}

              {stage === "over" && (
                <>
                  <dl className="crt-fit">
                    <dt>FIT</dt>
                    <dd>
                      {scoreOf(answers)}/{scope.length} INSIDE MY SCOPE
                    </dd>
                    {scope.map((c) => (
                      <div key={c.key}>
                        <dt>{c.label}</dt>
                        <dd>{verdictWord(verdicts(answers)[c.key])}</dd>
                      </div>
                    ))}
                  </dl>
                  <pre className="crt-brief" tabIndex={0}>
                    {linkify(briefText(answers))}
                  </pre>
                </>
              )}

              {turn.kind === "move" && stage === "play" && current?.typed && (
                <form
                  className="crt-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitTyped();
                  }}
                >
                  <label className="crt-field">
                    <span>{current.key === "name" ? "NAME:" : "> "}</span>
                    <input
                      key={current.key}
                      ref={inputRef}
                      value={typedValue}
                      onChange={(e) => setTypedValue(e.target.value)}
                      maxLength={current.typed.max}
                      placeholder={current.typed.hint}
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      enterKeyHint="send"
                      aria-label={current.topic}
                    />
                  </label>
                </form>
              )}

              {menu && (
                <ol className="crt-menu">
                  {items.map((it, i) => (
                    <li key={it.id} className={i === sel ? "is-on" : ""}>
                      <button type="button" onClick={it.run} onMouseEnter={() => setSel(i)} onFocus={() => setSel(i)} aria-current={i === sel ? "true" : undefined}>
                        {it.label}
                      </button>
                    </li>
                  ))}
                </ol>
              )}

              {note && <p className="crt-note">{note}</p>}

              {turn.kind !== "round" && (
                <div className="crt-foot">
                  {turn.kind === "move" && stage === "play" && current && !current.choices ? (
                    <div className="crt-soft">
                      {items.map((it) => (
                        <button type="button" key={it.id} onClick={it.run}>
                          {it.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className={turn.kind === "fact" ? "crt-blink" : ""}>{hint}</span>
                  )}
                  {turn.kind === "move" && stage === "play" && step > 0 && (
                    <button type="button" className="crt-back" onClick={back}>
                      ◀ BACK
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <p className="room-caption">
        <span>{stage === "attract" ? "press any key or tap the cabinet to insert a coin" : "arrows move · enter is A · digits pick"}</span>
        <button type="button" onClick={() => setSoundOn(!soundOn)} aria-pressed={soundOn}>
          sound {soundOn ? "on" : "off"}
        </button>
        <button type="button" onClick={onTextMode}>
          text mode
        </button>
      </p>
    </section>
  );
}
