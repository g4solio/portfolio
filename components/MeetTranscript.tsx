"use client";

import { useEffect, useRef, useState } from "react";
import { Typed, linkify, prefersReducedMotion } from "@/components/meet/Typed";
import {
  type Answers,
  askLine,
  briefText,
  closingLine,
  exhaustedLine,
  factCount,
  facts,
  helpLines,
  mageLine,
  mailtoHref,
  meetEmail,
  meetTitle,
  moves,
  scope,
  scopeText,
  scoreOf,
  scoreText,
  unknownLine,
} from "@/data/meet";

type Entry = { cmd?: string; text: string };

const ending = [
  { cmd: "score", label: "the role against my scope" },
  { cmd: "inventory", label: "the brief" },
  { cmd: "send", label: "mail me the brief" },
  { cmd: "copy", label: "copy it as text" },
  { cmd: "cv", label: "my one-page CV" },
];

/** A pixel numeral that counts up or down to its value, like the chapter numbers on the home page. */
function Numeral({ value, width = 1 }: { value: number; width?: number }) {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (shown === value) return;
    const delay = prefersReducedMotion() ? 0 : 110;
    const t = window.setTimeout(() => setShown((s) => (s < value ? s + 1 : s > value ? s - 1 : s)), delay);
    return () => window.clearTimeout(t);
  }, [shown, value]);
  return <b className="pix">{String(shown).padStart(width, "0")}</b>;
}

export function MeetTranscript() {
  const [answers, setAnswers] = useState<Answers>({});
  const [log, setLog] = useState<Entry[]>([{ text: moves[0].line }]);
  const [input, setInput] = useState("");
  // After every answer it is the recruiter's turn to ask: the "ask" phase.
  const [phase, setPhase] = useState<"answer" | "ask">("answer");
  // Facts told so far, per topic.
  const [asked, setAsked] = useState<Record<string, number>>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const step = moves.findIndex((m) => !(m.key in answers));
  const current = step === -1 ? undefined : moves[step];
  const name = answers.name ?? "";
  const score = scoreOf(answers);
  const known = Object.values(asked).reduce((n, k) => n + k, 0);
  const remaining = facts.filter((t) => (asked[t.cmd] ?? 0) < t.lines.length);

  useEffect(() => {
    if (log.length < 2) return;
    endRef.current?.scrollIntoView({ block: "end", behavior: prefersReducedMotion() ? "auto" : "smooth" });
    if (phase === "answer" && current?.typed) inputRef.current?.focus({ preventScroll: true });
  }, [log.length, current, phase]);

  const say = (cmd: string, text: string) => setLog((l) => [...l, { cmd, text }]);

  const tell = (topic: string) => {
    const t = facts.find((f) => f.cmd === topic);
    if (!t) return exhaustedLine;
    const i = asked[t.cmd] ?? 0;
    setAsked({ ...asked, [t.cmd]: i + 1 });
    return t.lines[i];
  };

  /** The recruiter answered a move; now it is their turn to ask, unless every fact is out. */
  const answer = (echo: string, value: string) => {
    if (!current) return;
    setAnswers({ ...answers, [current.key]: value });
    const nm = current.key === "name" ? value : name;
    if (remaining.length > 0) {
      setPhase("ask");
      return say(echo, askLine(nm));
    }
    const next = moves[step + 1];
    say(echo, next ? next.line : closingLine(nm));
  };

  /** The ask is done (a fact, or skipped); the next question follows. */
  const proceed = (echo: string, fact?: string) => {
    const question = current ? current.line : closingLine(name);
    setPhase("answer");
    setLog((l) => (fact ? [...l, { cmd: echo, text: fact }, { text: question }] : [...l, { cmd: echo, text: question }]));
  };

  const run = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    const cmd = text.toLowerCase();
    setInput("");
    switch (cmd) {
      case "help":
        return say(text, helpLines.join("\n"));
      case "look":
        return say(text, remaining[0] ? tell(remaining[0].cmd) : exhaustedLine);
      case "scope":
        return say(text, scopeText());
      case "score":
        return say(text, scoreText(answers));
      case "inventory":
        return say(text, briefText(answers));
      case "back": {
        const last = moves.filter((m) => m.key in answers).at(-1);
        if (!last) return say(text, "Nothing to undo yet.");
        const rest = { ...answers };
        delete rest[last.key];
        setAnswers(rest);
        setPhase("answer");
        return say(text, last.line);
      }
      case "send":
        window.location.assign(mailtoHref(answers));
        return say(text, "Opening your mail client with the brief. If nothing happens, copy works too.");
      case "copy":
        navigator.clipboard.writeText(briefText(answers)).then(
          () => say(text, "Copied. Paste it wherever you reached me."),
          () => say(text, "Couldn’t copy here. Type inventory and select the text."),
        );
        return;
      case "cv":
        // relative: the site deploys under a basePath on GitHub Pages
        window.open("../Davide_Gozzi_CV.pdf", "_blank", "noopener");
        return say(text, "The CV opens in a new tab.");
      case "cast":
      case "fireball":
      case "magic missile":
        return say(text, mageLine);
    }
    if (phase === "ask") {
      if (cmd === "skip") return proceed(text);
      const n = Number.parseInt(cmd, 10);
      const topic = remaining.find((t) => t.cmd === cmd || t.label === cmd) ?? (Number.isInteger(n) ? remaining[n - 1] : undefined);
      return topic ? proceed(topic.cmd, tell(topic.cmd)) : say(text, unknownLine);
    }
    if (!current) return say(text, "The moves are done. Commands: score, inventory, send, copy, cv.");
    if (current.choices) {
      const n = Number.parseInt(cmd, 10);
      const choice =
        current.choices.find((c) => c.cmd === cmd || c.label.toLowerCase() === cmd) ??
        (Number.isInteger(n) ? current.choices[n - 1] : undefined);
      return choice ? answer(choice.cmd, choice.cmd) : say(text, unknownLine);
    }
    if (current.typed) {
      if (cmd === "skip") return current.typed.optional ? answer(text, "") : say(text, "I need an answer here.");
      return answer(text, text.slice(0, current.typed.max));
    }
  };

  const commands =
    phase === "ask"
      ? [...remaining.map((t) => ({ cmd: t.cmd, label: t.label })), { cmd: "skip", label: "on to the next question" }]
      : current
        ? (current.choices ?? [])
        : ending;
  const topic = phase === "ask" ? "Ask me" : current ? current.topic : "Brief";
  const moveNo = step === -1 ? moves.length : step + 1;
  const hint = phase === "ask" ? "a topic, or skip" : (current?.typed?.hint ?? "type a command");
  // The current exchange starts at the last echoed command; everything before it is past.
  const currentStart = log.findLastIndex((e) => e.cmd !== undefined);

  return (
    <section className="meet">
      <header className="meet-title">
        <p>Davide Gozzi · a text adventure</p>
        <h1>{meetTitle}</h1>
        <p>
          <b className="pix">{moves.length}</b> moves about the role · <b className="pix">{factCount}</b> facts about me,
          your pick · a brief at the end
        </p>
      </header>

      {/* The game; globals.css shows it only on a JS-enabled page (html.js). */}
      <div className="meet-game">
        {/* The status line stays pinned while the log scrolls. */}
        <div className="meet-hud">
          <div className="meet-status">
            <span>{topic}</span>
            <span>
              Score <Numeral value={score} /> / <b className="pix">{scope.length}</b> · Known <Numeral value={known} /> /{" "}
              <b className="pix">{factCount}</b> · Move <Numeral value={moveNo} width={2} /> / <b className="pix">{moves.length}</b>
            </span>
          </div>
        </div>

        <ol className="meet-log" aria-live="polite">
          {log.map((e, i) => (
            <li key={i} className={[e.cmd ? "has-cmd" : "", i < currentStart ? "is-past" : "is-new"].join(" ").trim()}>
              {e.cmd && <span className="meet-echo">&gt; {e.cmd}</span>}
              <p>{i === log.length - 1 ? <Typed text={e.text} /> : linkify(e.text)}</p>
            </li>
          ))}
        </ol>

        {commands.length > 0 && (
          <ul className="meet-cmds">
            {commands.map((c) => (
              <li key={c.cmd}>
                <button type="button" onClick={() => run(c.cmd)}>
                  <b>{c.cmd}</b>
                  <span>{c.label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <form
          className="meet-prompt"
          onSubmit={(e) => {
            e.preventDefault();
            run(input);
          }}
        >
          <label>
            <span aria-hidden="true">&gt;</span>
            <span className="sr-only">Command or answer</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={hint}
              maxLength={phase === "answer" ? (current?.typed?.max ?? 40) : 40}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              enterKeyHint="send"
            />
          </label>
        </form>
        <div ref={endRef} />
      </div>

      {/* Without JavaScript the moves and the facts are a readable document and the answer is an email. */}
      <div className="meet-doc">
        <p>
          With JavaScript this page is an intake desk: thirteen questions about the role, a fact
          about me of your choice after each one, and a brief to mail me at the end. Without it, here
          is what I’m looking for, the questions, and the facts; answer the questions in an email to{" "}
          <a href={`mailto:${meetEmail}`}>{meetEmail}</a> with the subject “Role brief for Davide
          Gozzi”.
        </p>
        <ul>
          {scope.map((s) => (
            <li key={s.key}>
              {s.label}: {s.line}
            </li>
          ))}
        </ul>
        <ol>
          {moves.map((m) => (
            <li key={m.key}>
              <p>{m.line}</p>
              {m.choices && (
                <ul>
                  {m.choices.map((c) => (
                    <li key={c.cmd}>{c.label}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
        <ul>
          {facts.map((t) => (
            <li key={t.cmd}>
              {t.label}: {t.lines.join(" ")}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
