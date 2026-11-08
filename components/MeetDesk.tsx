"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  type Answers,
  answerText,
  askLine,
  briefText,
  doneLine,
  facts,
  keysLine,
  mailtoHref,
  meetTitle,
  moves,
  scope,
  scoreOf,
  verdicts,
  verdictWord,
} from "@/data/meet";
import * as art from "./meet/art";
import { linkify } from "./meet/Typed";

type Turn = { kind: "move" } | { kind: "ask" } | { kind: "fact"; topic: string; line: string };
/** A balloon on the sheet. Its number is the digit that picks it, unless it carries a mark of its own. */
type Item = { id: string; label: string; run: () => void; mark?: string };

const pad2 = (n: number) => String(n).padStart(2, "0");
const svg = (html: string) => ({ dangerouslySetInnerHTML: { __html: html } });
const TAG_COLOURS = ["#c4493a", "#d9b445", "#41639e", "#4d7d55", "#e4e1d6"];
/** How long the red ring takes to draw before the answer goes onto the job card. */
const RING_MS = 480;

// The day's date, read on the client: the static page was built on another day.
const noSubscribe = () => () => {};
const today = () => new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();

/**
 * /meet/ as the officina's accettazione: Davide asks on the wall, the answers sit on the drafting board,
 * the job card fills in as the brief, and between questions the recruiter takes a key off the board.
 */
export function MeetDesk({ active, onTextMode }: { active: boolean; onTextMode: () => void }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [asked, setAsked] = useState<Record<string, number>>({});
  const [turn, setTurn] = useState<Turn>({ kind: "move" });
  const [typedValue, setTypedValue] = useState("");
  const [note, setNote] = useState("");
  const [picked, setPicked] = useState<string | null>(null);
  const [cardOpen, setCardOpen] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef<HTMLDivElement>(null);
  const date = useSyncExternalStore(noSubscribe, today, () => "");

  const step = moves.findIndex((m) => !(m.key in answers));
  const current = step === -1 ? undefined : moves[step];
  const over = !current && turn.kind === "move";
  const asking = turn.kind === "ask";
  const name = answers.name ?? "";
  const remaining = facts.filter((t) => (asked[t.cmd] ?? 0) < t.lines.length);
  const filled = moves.filter((m) => answers[m.key]).length;
  const moveNo = step === -1 ? moves.length : step + 1;
  const answered = moves.filter((m) => m.key in answers).length;
  const canGoBack = turn.kind === "move" && answered > 0;

  /** A question answered: the recruiter's turn to ask, unless every fact is out. */
  const answer = (value: string) => {
    if (!current) return;
    setAnswers({ ...answers, [current.key]: value });
    setTypedValue("");
    setNote("");
    setPicked(null);
    setTurn(remaining.length > 0 ? { kind: "ask" } : { kind: "move" });
  };

  // The ring draws, then the answer goes onto the card.
  const pick = (cmd: string) => {
    setPicked(cmd);
    window.setTimeout(() => answer(cmd), RING_MS);
  };

  const submitTyped = () => {
    if (!current?.typed) return;
    const value = typedValue.trim();
    if (value) answer(value.slice(0, current.typed.max));
    else if (current.typed.optional) answer("");
    else setNote("This one needs an answer.");
  };

  const ask = (topic: string) => {
    const t = facts.find((f) => f.cmd === topic);
    const i = asked[topic] ?? 0;
    if (!t || i >= t.lines.length) return;
    setAsked({ ...asked, [topic]: i + 1 });
    setTurn({ kind: "fact", topic, line: t.lines[i] });
  };

  const proceed = () => setTurn({ kind: "move" });

  const back = () => {
    const last = moves.filter((m) => m.key in answers).at(-1);
    if (!last) return;
    const rest = { ...answers };
    delete rest[last.key];
    setAnswers(rest);
    setTypedValue(last.typed ? (answers[last.key] ?? "") : "");
    setNote("");
    setTurn({ kind: "move" });
  };

  const reset = () => {
    setAnswers({});
    setAsked({});
    setTurn({ kind: "move" });
    setTypedValue("");
    setNote("");
    setCardOpen(false);
  };

  // What the wall says, what the sheet is called, and the numbered balloons on it.
  let head = { ask: "", say: "" };
  let tavola = "";
  let items: Item[] = [];
  if (over) {
    const done = doneLine(name);
    head = { ask: done.ask, say: done.line };
    tavola = "RIEPILOGO";
    items = [
      {
        id: "send",
        label: "send it to me",
        run: () => {
          window.location.assign(mailtoHref(answers));
          setNote("Opening your email app. If nothing happens, use copy instead.");
        },
      },
      {
        id: "copy",
        label: "copy it as text",
        run: () =>
          navigator.clipboard.writeText(briefText(answers)).then(
            () => setNote("Copied. Paste it wherever you reached me."),
            () => setNote("Couldn’t copy here. Text mode prints the brief to select."),
          ),
      },
      // relative: the site deploys under a basePath on GitHub Pages
      { id: "cv", label: "my one-page CV", run: () => window.open("../Davide_Gozzi_CV.pdf", "_blank", "noopener") },
      { id: "again", label: "start again", run: reset },
    ];
  } else if (turn.kind === "ask") {
    // The rule the first time, with the keys named; a short nudge after.
    const turnLine = askLine(name, answered);
    head = { ask: turnLine.ask, say: turnLine.line && `${turnLine.line} ${keysLine}` };
    tavola = "TOCCA A TE";
    // The digits are the keys on this turn, so skipping carries an arrow, not a number.
    items = [{ id: "skip", label: "skip to the next question", run: proceed, mark: "→" }];
  } else if (turn.kind === "fact") {
    const label = facts.find((t) => t.cmd === turn.topic)?.label ?? "";
    head = { ask: label.charAt(0).toUpperCase() + label.slice(1), say: "" };
    tavola = "TOCCA A TE";
    items = [{ id: "next", label: current ? "on to the next question" : "on to the brief", run: proceed }];
  } else if (current) {
    head = { ask: current.ask, say: current.line };
    tavola = current.tavola;
    items = current.choices
      ? current.choices.map((c) => ({ id: c.cmd, label: c.label, run: () => pick(c.cmd) }))
      : [
          { id: "write", label: "write it on the card", run: submitTyped },
          ...(current.typed?.optional ? [{ id: "skip", label: "skip", run: () => answer("") }] : []),
        ];
  }
  const typing = turn.kind === "move" && !!current?.typed;

  // A new turn hands the keyboard to its first control: the field, the first key, or the first balloon.
  const turnKey = `${step}-${turn.kind}-${over}`;
  const firstTurn = useRef(turnKey);
  useEffect(() => {
    if (firstTurn.current === turnKey) return;
    firstTurn.current = "";
    const target = asking ? keysRef.current?.querySelector("button") : boardRef.current?.querySelector("input, button");
    (target as HTMLElement | null)?.focus({ preventScroll: true });
  }, [turnKey, asking]);

  // Digits pick a balloon, or a key on the recruiter's turn (0 is key 10); Enter moves on from a fact;
  // Backspace undoes a question. Typing in the field keeps its own keys.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || picked) return;
      const target = e.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      if (/^[0-9]$/.test(e.key)) {
        const n = e.key === "0" ? 10 : Number(e.key);
        const run = asking ? (facts[n - 1] && (() => ask(facts[n - 1].cmd))) : !typing && items[n - 1]?.run;
        if (run) {
          e.preventDefault();
          run();
        }
      } else if (e.key === "Enter" && turn.kind === "fact" && target === document.body) {
        e.preventDefault();
        proceed();
      } else if (e.key === "Backspace" && canGoBack) {
        e.preventDefault();
        back();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const balloons = (
    <ol className="acc-opts">
      {items.map((it, i) => (
        <li key={it.id} className={picked === it.id ? "is-picked" : undefined}>
          <button type={typing && it.id === "write" ? "submit" : "button"} onClick={typing && it.id === "write" ? undefined : it.run} disabled={!!picked}>
            <b>{it.mark ?? i + 1}</b>
            <span>{it.label}</span>
          </button>
          {picked === it.id && (
            <svg className="acc-ring" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path d={art.scribble(step + 5)} pathLength={1} strokeWidth={2.1} />
              <path d={art.scribble(step + 11)} pathLength={1} strokeWidth={1} opacity={0.5} />
            </svg>
          )}
        </li>
      ))}
    </ol>
  );

  let sheet: ReactNode = balloons;
  if (typing && current?.typed) {
    sheet = (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitTyped();
        }}
      >
        <label className="acc-field">
          <span>{current.brief}</span>
          <input
            key={current.key}
            value={typedValue}
            onChange={(e) => setTypedValue(e.target.value)}
            maxLength={current.typed.max}
            placeholder={current.typed.hint}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="send"
          />
        </label>
        {balloons}
      </form>
    );
  } else if (turn.kind === "fact") {
    sheet = (
      <>
        <p className="acc-written">{linkify(turn.line)}</p>
        {balloons}
      </>
    );
  } else if (over) {
    const v = verdicts(answers);
    sheet = (
      <>
        {/* The fit, one plain row per criterion and a plain sum: a miss never reads as losing. */}
        <dl className="acc-fit">
          {scope.map((c) => (
            <div key={c.key}>
              <dt>{c.label}</dt>
              <dd>{verdictWord(v[c.key])}</dd>
            </div>
          ))}
        </dl>
        <p className="acc-sum">
          Inside my scope on {scoreOf(answers)} of {scope.length}.
        </p>
        {balloons}
      </>
    );
  }

  return (
    <section className="acc" data-turn={over ? "over" : turn.kind} aria-label="The intake desk">
      <h1 className="sr-only">{meetTitle}</h1>
      <p className="acc-caption">
        <span>digits pick · backspace goes back</span>
        <button type="button" onClick={onTextMode}>
          text mode
        </button>
      </p>

      <div className="acc-scene">
        {/* The key board: one key per topic, a worn tag on its ring. A key whose facts are all told is gone from its hook. */}
        <div className="acc-keys" ref={keysRef} role={asking ? "group" : undefined} aria-label={asking ? "The keys, one topic each" : undefined} aria-hidden={!asking}>
          {facts.map((t, i) => {
            const left = (asked[t.cmd] ?? 0) < t.lines.length;
            const tag = (
              <>
                <b>{pad2(i + 1)}</b>
                <span>{t.label}</span>
              </>
            );
            const style = { background: TAG_COLOURS[i % 5], "--k": i % 3 } as CSSProperties;
            return (
              <div className="acc-slot" key={t.cmd}>
                {left &&
                  (asking ? (
                    <button type="button" className="acc-tag" style={style} onClick={() => ask(t.cmd)}>
                      {tag}
                    </button>
                  ) : (
                    <div className="acc-tag" style={style} aria-hidden="true">
                      {tag}
                    </div>
                  ))}
                <svg className="acc-hook" viewBox="0 0 40 80" aria-hidden="true" {...svg(left ? art.hookAndKey(i, 24, 6) : art.emptyHook(24, 6))} />
              </div>
            );
          })}
        </div>

        <div className="acc-main">
          <div className="acc-head" aria-hidden="true">
            <div className="acc-sign">ACCETTAZIONE</div>
            <div className="acc-turno">
              <small>TURNO</small>
              <span {...svg(art.sevenSeg(pad2(moveNo), 46))} />
              <em>/{moves.length}</em>
            </div>
          </div>

          <div className="acc-ask" aria-live="polite">
            <h2>{head.ask}</h2>
            {head.say && <p>{head.say}</p>}
          </div>

          {/* The drafting board: the sheet taped down, the balloons, the title block, the parallel rule. */}
          <div className="acc-board" ref={boardRef}>
            <div className="acc-paper">
              <div className="acc-frame">
                {sheet}
                {note && <p className="acc-note">{note}</p>}
                {canGoBack && !picked && (
                  <button type="button" className="acc-back" onClick={back}>
                    ← back one question
                  </button>
                )}
                <div className="acc-cart" aria-hidden="true">
                  <span>
                    TAV. {pad2(moveNo)} / {moves.length}
                  </span>
                  <span>{tavola}</span>
                  <span>SCALA 1:1</span>
                  <span>DIS. D. GOZZI{date && ` · ${date.replace(/ /g, ".")}`}</span>
                </div>
              </div>
              <i className="acc-tape" />
              <i className="acc-tape" />
              <i className="acc-tape" />
              <i className="acc-tape" />
            </div>
            <i className="acc-rule" />
            <span className="acc-pencils" {...svg(art.pencils)} />
          </div>
        </div>

        <div className="acc-side" aria-hidden="true">
          <span className="acc-window" {...svg(art.windowView)} />
          <span className="acc-clock" {...svg(art.clock)} />
        </div>

        {/* The job card is the brief: it fills in as the recruiter answers. On a phone it is a tab at the bottom. */}
        <div className="acc-card" data-open={cardOpen}>
          <button type="button" className="acc-peek" onClick={() => setCardOpen(!cardOpen)} aria-expanded={cardOpen}>
            <b>Job card</b>
            <span>
              {filled} of {moves.length} filled {cardOpen ? "↓" : "↑"}
            </span>
          </button>
          <div className="acc-clip">
            <i className="acc-jaw" />
            <i className="acc-carbon" />
            <div className="acc-sheet">
              <header>
                <div>
                  <h3>Job card</h3>
                  <p>Davide Gozzi · Modena</p>
                </div>
                {date && <p className="acc-stamp">{date}</p>}
              </header>
              <dl>
                {moves.map((m, i) => (
                  <div key={m.key} className={i === step && turn.kind === "move" ? "is-now" : undefined}>
                    <dt>{m.brief}</dt>
                    <dd title={answers[m.key] || undefined}>{answers[m.key] ? answerText(m, answers) : ""}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <span className="acc-pen" {...svg(art.pen)} />
          </div>
        </div>
      </div>

      <div className="acc-counter" aria-hidden="true">
        <div className="acc-counter-in">
          <i className="acc-sun" />
          <i className="acc-coffee" />
          <span className="acc-bell" {...svg(art.bell)} />
          <span className="acc-cat" {...svg(art.cat)} />
          <div className="acc-stickers">
            {art.stickers.map((s, i) => (
              <span key={i} style={{ left: s.x, top: s.y, transform: `rotate(${s.r}deg)` }} {...svg(s.svg)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
