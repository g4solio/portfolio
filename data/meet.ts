// /meet/ — the intake desk for recruiters: the scope, the thirteen moves in Davide's voice,
// the facts about him the recruiter asks for between moves, and the brief they mail back.
// Facts only (PRODUCT.md, content truth rules): every line here was confirmed by Davide on 2026-11-07.
// Imports carry the .ts extension so `node scripts/meet-check.mjs` can load this file directly.
import { chapters } from "./portfolio.ts";

export const meetEmail = "david3gozz1@gmail.com";
export const meetTitle = "Let’s get to know each other";
export const meetDescription =
  "For recruiters: tell me about the role, I’ll tell you about me, and you leave with a short brief to send me.";
export const siteUrl = "https://g4solio.github.io/portfolio/";

export type CriterionKey = "location" | "seniority" | "stack" | "pay" | "relocation";
export type Verdict = "inside" | "outside" | "unknown";

/** The scope: stated inside the questions, printed by `scope`, judged live. Nothing here blocks anyone. */
export const scope: { key: CriterionKey; label: string; line: string }[] = [
  {
    key: "location",
    label: "Location",
    line: "Remote with a team on European hours, or hybrid up to two days a week within reach of Modena, Bologna or Reggio Emilia.",
  },
  { key: "seniority", label: "Seniority", line: "Senior and above, by the title offered." },
  {
    key: "stack",
    label: "Stack",
    line: ".NET and C# with backend at the centre. Full-stack .NET is fine; frontend-only or another primary language is not.",
  },
  { key: "pay", label: "Compensation", line: "RAL from €60k. I aim for €65k and above." },
  { key: "relocation", label: "Relocation", line: "None." },
];

export type Choice = {
  /** What the headhunter taps or types. */
  cmd: string;
  label: string;
  /** What this answer says about the scope; absent when the move is not judged. */
  verdicts?: Partial<Record<CriterionKey, Verdict>>;
};

/** What Davide says: the question big, and his side of it under it. */
export type Said = { ask: string; line: string };
/** Davide's words as one text-mode entry: the question on its own line, then the rest. */
export const spoken = (s: Said) => (s.line ? `${s.ask}\n${s.line}` : s.ask);

export type Move = {
  key: string;
  /** Status-line topic. */
  topic: string;
  /** The sheet's name in the drafting board's title block, in Italian like the rest of the officina. */
  tavola: string;
  /** The question, drawn big. */
  ask: string;
  /** Davide's side of it, drawn small under the question. */
  line: string;
  /** Command moves list choices; typed moves take free text. */
  choices?: Choice[];
  typed?: { hint: string; max: number; optional?: boolean };
  /** Label in the brief. */
  brief: string;
};

const inside = (keys: CriterionKey[]) => Object.fromEntries(keys.map((k) => [k, "inside"])) as Partial<Record<CriterionKey, Verdict>>;

export const moves: Move[] = [
  {
    key: "name",
    topic: "Hello",
    tavola: "PRESENTAZIONI",
    ask: "Hi, I’m Davide. What should I call you?",
    line: "Let’s take turns: you tell me about the role, I tell you about me. At the end you get a short brief to send me.",
    typed: { hint: "your first name, or skip", max: 40, optional: true },
    brief: "From",
  },
  {
    key: "company",
    topic: "Company",
    tavola: "AZIENDA",
    ask: "Who’s hiring?",
    line: "If you can’t say yet, “confidential” is fine.",
    typed: { hint: "company name, or confidential", max: 80 },
    brief: "Company",
  },
  {
    key: "role",
    topic: "Role",
    tavola: "RUOLO",
    ask: "What’s the job title?",
    line: "I’m happiest on the backend of software that has to keep working: distributed services, legacy platforms, things wired to real machines.",
    typed: { hint: "job title", max: 80 },
    brief: "Role",
  },
  {
    key: "location",
    topic: "Location",
    tavola: "SEDE",
    ask: "Where’s the job based?",
    line:
      "I live in Modena. Remote suits me if the team works European hours. Hybrid works too, if the office is close and it’s two days a week at most.",
    choices: [
      { cmd: "remote-eu", label: "fully remote, team on European hours", verdicts: inside(["location", "relocation"]) },
      { cmd: "remote", label: "fully remote, team elsewhere", verdicts: { location: "outside", relocation: "inside" } },
      { cmd: "hybrid-modena", label: "hybrid, within reach of Modena", verdicts: inside(["location", "relocation"]) },
      { cmd: "hybrid", label: "hybrid, elsewhere in Italy", verdicts: { location: "outside", relocation: "outside" } },
      { cmd: "onsite-modena", label: "on site, within reach of Modena", verdicts: { location: "outside", relocation: "inside" } },
      { cmd: "onsite", label: "on site, elsewhere", verdicts: { location: "outside", relocation: "outside" } },
      { cmd: "unknown", label: "not decided yet" },
    ],
    brief: "Location",
  },
  {
    key: "seniority",
    topic: "Seniority",
    tavola: "LIVELLO",
    ask: "How senior is the role?",
    line: "I’ve been doing this professionally for seven years and got the senior title at MSC in 2021, so I’m looking at senior roles and up.",
    choices: [
      // Top rung first.
      { cmd: "principal", label: "principal, or head of", verdicts: inside(["seniority"]) },
      { cmd: "lead", label: "lead or staff", verdicts: inside(["seniority"]) },
      { cmd: "senior", label: "senior", verdicts: inside(["seniority"]) },
      { cmd: "mid", label: "mid-level", verdicts: { seniority: "outside" } },
      { cmd: "junior", label: "junior", verdicts: { seniority: "outside" } },
      { cmd: "unknown", label: "not defined yet" },
    ],
    brief: "Seniority",
  },
  {
    key: "stack",
    topic: "Stack",
    tavola: "STACK",
    ask: "What’s the stack?",
    line:
      "I’m a .NET backend developer: C#, Redis, RabbitMQ, SQL, and the protocols machines speak. Full-stack .NET is fine too. AI agents do most of my typing now, but the architecture and the review are still mine.",
    choices: [
      { cmd: "dotnet-backend", label: ".NET, backend at the centre", verdicts: inside(["stack"]) },
      { cmd: "dotnet-fullstack", label: ".NET, full-stack", verdicts: inside(["stack"]) },
      { cmd: "dotnet-frontend", label: ".NET shop, mostly frontend", verdicts: { stack: "outside" } },
      { cmd: "other-backend", label: "another language, backend", verdicts: { stack: "outside" } },
      { cmd: "other", label: "another language, not backend", verdicts: { stack: "outside" } },
      { cmd: "unknown", label: "not sure" },
    ],
    brief: "Stack",
  },
  {
    key: "pay",
    topic: "Compensation",
    tavola: "COMPENSO",
    ask: "What does it pay?",
    line: "I’m aiming for a RAL of €65k or more, and €60k is my floor.",
    choices: [
      // Top band first.
      { cmd: "75-plus", label: "€75k and above", verdicts: inside(["pay"]) },
      { cmd: "65-75", label: "€65k to €75k", verdicts: inside(["pay"]) },
      { cmd: "60-65", label: "€60k to €65k", verdicts: inside(["pay"]) },
      { cmd: "50-60", label: "€50k to €60k", verdicts: { pay: "outside" } },
      { cmd: "under-50", label: "under €50k", verdicts: { pay: "outside" } },
      { cmd: "consulting", label: "a consulting rate; the figure goes in the notes" },
      { cmd: "undisclosed", label: "not disclosed" },
    ],
    brief: "Compensation",
  },
  {
    key: "contract",
    topic: "Contract",
    tavola: "CONTRATTO",
    ask: "What kind of contract is it?",
    line: "Whatever it is, I can start about two months after signing: one month of notice, then one to recharge so I show up at my best.",
    choices: [
      { cmd: "employee", label: "permanent employee" },
      { cmd: "fixed-term", label: "fixed-term employee" },
      { cmd: "consulting", label: "consulting, through my own company" },
      { cmd: "agency", label: "through an agency" },
      { cmd: "unknown", label: "not decided yet" },
    ],
    brief: "Contract",
  },
  {
    key: "note",
    topic: "Engineering note",
    tavola: "NOTA TECNICA",
    ask: "Which of these is closest to the job?",
    line: "Each one is an engineering note from my portfolio, about a real decision and what it taught me.",
    choices: [
      ...chapters.flatMap((c) => (c.decision ? [{ cmd: c.decision.schematic, label: `${c.decision.number} · ${c.decision.title}` }] : [])),
      { cmd: "none", label: "none of them" },
    ],
    brief: "Closest engineering note",
  },
  {
    key: "process",
    topic: "Process",
    tavola: "SELEZIONE",
    ask: "What’s the hiring process like?",
    line:
      "I do best when I meet the engineering lead by round two and work on a real problem from your codebase instead of a puzzle. Take-homes are fine if they fit in two hours, and I’d love a decision within three weeks.",
    choices: [
      { cmd: "short", label: "up to three rounds, no take-home" },
      { cmd: "take-home", label: "includes a take-home" },
      { cmd: "long", label: "four rounds or more" },
      { cmd: "unknown", label: "not defined yet" },
    ],
    brief: "Process",
  },
  {
    key: "notes",
    topic: "Notes",
    tavola: "NOTE",
    ask: "Anything I didn’t ask about?",
    line: "A link to the job ad helps a lot, and so does the team size or why the position is open.",
    typed: { hint: "job ad link, notes, or skip", max: 200, optional: true },
    brief: "Notes",
  },
  {
    key: "feedback-exchange",
    topic: "Feedback",
    tavola: "IMPRESSIONI",
    ask: "What would have made this better?",
    line: "Two quick ones for me now. Both are optional.",
    typed: { hint: "what to change, or skip", max: 200, optional: true },
    brief: "Feedback on the exchange",
  },
  {
    key: "feedback-profile",
    topic: "Feedback",
    tavola: "PROFILO",
    ask: "What’s missing from my profile for this role?",
    line: "Last one. Be honest, it’s the one I learn the most from.",
    typed: { hint: "what’s missing, or skip", max: 200, optional: true },
    brief: "What my profile is missing",
  },
];

/** Between moves it is the recruiter's turn: one topic, one true line, first person. The label is the question they ask. */
export type FactTopic = { cmd: string; label: string; lines: string[] };

export const facts: FactTopic[] = [
  {
    cmd: "games",
    label: "what do you play?",
    lines: [
      "I love video games. My top three: Portal 2, Psychonauts, Baldur’s Gate 3.",
      "Big League of Legends player. Right now it is a lot of Enshrouded with my squad.",
      "My first computer was more than twenty years ago. Back then it was a lot of Team Fortress 2.",
    ],
  },
  {
    cmd: "tabletop",
    label: "do you play D&D?",
    lines: [
      "I play D&D and other tabletop RPGs. Forever player, usually the designated mage.",
      "My favourite character was a bard named Azzurro, after Shrek’s Prince Charming, Principe Azzurro in Italian.",
    ],
  },
  {
    cmd: "comics",
    label: "what do you read?",
    lines: ["Superhero comics have always been a must. I read a lot of Italian Bonelli, and for the last couple of years manhwa has been very present."],
  },
  {
    cmd: "music",
    label: "what’s on your headphones?",
    lines: [
      "Gemitaiz, Tha Supreme and Sfera Ebbasta have been my top three on Spotify for years.",
      "My Spotify is g4solio: https://open.spotify.com/user/g4solio",
    ],
  },
  {
    cmd: "modena",
    label: "where’s home?",
    lines: ["Modena is home, but my heart is in central Italy. I would defend almost any pasta dish, and anything with mascarpone is my baby."],
  },
  {
    cmd: "tools",
    label: "what do you code in?",
    lines: ["Visual Studio, always. These days most of my typing happens in Claude Code, with Zed and Sublime Text around it."],
  },
  { cmd: "cats", label: "any pets?", lines: ["Cats. Always cats."] },
  {
    cmd: "code",
    label: "favourite bug?",
    lines: [
      "The bug that lives in my head: an IEnumerable handed between actor steps was enumerated more than once, and every extra pass re-triggered work in a system that expected exactly one.",
      "LINQ is my favourite .NET feature, and I have a soft spot for message brokers.",
    ],
  },
  { cmd: "sport", label: "any sports?", lines: ["Sport: nothing much, honestly."] },
  {
    cmd: "work",
    label: "any work stories?",
    lines: [
      "Galactic Fighters, the space shooter I worked on in high school, is still on Steam.",
      "I started working in my fourth year of high school, because school had stopped being difficult.",
      "I spent six weeks in the United States with MSC, sharing knowledge in person.",
    ],
  },
];

export const factCount = facts.reduce((n, t) => n + t.lines.length, 0);

/**
 * The recruiter's turn after a move: the rule the first time, a short nudge that varies after, a last call
 * before the brief. `answered` counts the moves answered so far.
 */
export function askLine(name: string, answered: number): Said {
  const n = name ? `, ${name}` : "";
  if (answered <= 1) return { ask: "What do you want to know?", line: `Nice to meet you${n}. Now it’s your turn.` };
  if (answered >= moves.length) return { ask: `Anything else before we wrap up${n}?`, line: "" };
  return { ask: [`Your turn${n}.`, "Ask me something.", `Your pick${n}.`, "Curious about anything?", "Anything else?"][answered % 5], line: "" };
}
export const closingLine = (name: string) =>
  `That’s everything${name ? `, ${name}` : ""}, thanks. Type score to see how the role lines up with what I’m looking for, inventory to read the brief, or send to email it to me. look still has whatever you didn’t ask.`;
export const exhaustedLine = `You’ve heard all ${factCount}. Ask me the rest in person.`;
/** The desk's turn rule: the topics are the keys on the board. */
export const keysLine = "Take a key off the board, or skip to the next question.";
/** The desk's last words, above the fit and the job card. */
export const doneLine = (name: string): Said => ({
  ask: `Thanks${name ? `, ${name}` : ""}. That’s everything.`,
  line: "Here’s how the role lines up with what I’m looking for, and a brief you can email me. It only goes out if you send it.",
});
export const unknownLine = "I didn’t catch that. The commands are listed above.";
/** For cast, fireball and the like: the mage stays in character, once. */
export const mageLine = "The designated mage declines. Spell slots are for the table; here the commands are help, look and score.";
export const helpLines = [
  "help — this list",
  "look — one more fact about me, my pick",
  "scope — what I’m looking for",
  "score — the role against my scope",
  "inventory — the brief so far",
  "back — undo the last move",
  "send — mail me the brief",
  "copy — copy it as text",
  "cv — my one-page CV",
];

/** Move key → the command chosen, or the text typed ("" when an optional move was skipped). */
export type Answers = Record<string, string>;

export const choiceOf = (move: Move, answer: string | undefined) => move.choices?.find((c) => c.cmd === answer);

export function verdicts(answers: Answers): Record<CriterionKey, Verdict> {
  const v: Record<CriterionKey, Verdict> = { location: "unknown", seniority: "unknown", stack: "unknown", pay: "unknown", relocation: "unknown" };
  for (const move of moves) Object.assign(v, choiceOf(move, answers[move.key])?.verdicts);
  return v;
}

export const scoreOf = (answers: Answers) => Object.values(verdicts(answers)).filter((x) => x === "inside").length;

export function answerText(move: Move, answers: Answers): string {
  const a = answers[move.key];
  if (a === undefined || a === "") return "—";
  return move.typed ? a : (choiceOf(move, a)?.label ?? a);
}

export const verdictWord = (v: Verdict) => (v === "inside" ? "inside" : v === "outside" ? "outside my ideal scope" : "not confirmed");

export const scopeText = () => scope.map((s) => `${s.label}: ${s.line}`).join("\n");

export function scoreText(answers: Answers): string {
  const v = verdicts(answers);
  return [
    "Against my scope:",
    ...scope.map((s) => `${s.label}: ${verdictWord(v[s.key])}`),
    `Inside my scope on ${scoreOf(answers)} of ${scope.length} points.`,
  ].join("\n");
}

export function briefText(answers: Answers): string {
  return [
    "Role brief for Davide Gozzi",
    "",
    ...moves.map((m) => `${m.brief}: ${answerText(m, answers)}`),
    "",
    scoreText(answers),
    "",
    `Written at ${siteUrl}meet/`,
  ].join("\n");
}

export function mailtoHref(answers: Answers): string {
  const by = (key: string) => {
    const m = moves.find((x) => x.key === key);
    return m ? answerText(m, answers) : "—";
  };
  const subject = `Role brief for Davide Gozzi: ${by("role")} · ${by("company")}`;
  // mailto bodies want CRLF line breaks
  const body = encodeURIComponent(briefText(answers)).replace(/%0A/g, "%0D%0A");
  return `mailto:${meetEmail}?subject=${encodeURIComponent(subject)}&body=${body}`;
}
