// /meet/ — the transcript game for recruiters: the scope, the thirteen moves in Davide's voice,
// the facts about him the recruiter asks for between moves, and the brief they mail back.
// Facts only (PRODUCT.md, content truth rules): every line here was confirmed by Davide on 2026-11-07.
// Imports carry the .ts extension so `node scripts/meet-check.mjs` can load this file directly.
import { chapters } from "./portfolio.ts";

export const meetEmail = "david3gozz1@gmail.com";
export const meetTitle = "Let’s get to know each other";
export const meetDescription =
  "An arcade cabinet for recruiters: thirteen moves about the role as its screens, a fact about me of your choice after each one, three of them as short games, and a role brief you can send me at the end.";
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

export type Move = {
  key: string;
  /** Status-line topic. */
  topic: string;
  /** The cabinet screen this move plays as: the arcade's name for the question. */
  screen: string;
  /** Davide's line: his side of the exchange, ending in the question. */
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
    screen: "NAME ENTRY",
    line:
      "Let’s get to know each other: thirteen moves about the role, the last three optional, and after each one you get to ask me something. At the end there’s a brief you can send me. I’m Davide; who am I talking to? A first name is plenty, or skip.",
    typed: { hint: "your first name, or skip", max: 40, optional: true },
    brief: "From",
  },
  {
    key: "company",
    topic: "Company",
    screen: "INSERT COIN",
    line: "Who is hiring? “Confidential” is a fine answer for now.",
    typed: { hint: "company name, or confidential", max: 80 },
    brief: "Company",
  },
  {
    key: "role",
    topic: "Role",
    screen: "PLAYER 1",
    line:
      "I’m after software that has to keep working: distributed services, legacy platforms, systems connected to real machines, with backend at the centre. What is the title of the role?",
    typed: { hint: "role title", max: 80 },
    brief: "Role",
  },
  {
    key: "location",
    topic: "Location",
    screen: "STAGE SELECT",
    line:
      "I’m based in Modena. Remote with a team on European hours works for me, and so does hybrid up to two days a week within reach. Where would this role sit?",
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
    screen: "DIFFICULTY",
    line:
      "Seven professional years; the senior title dates from MSC, 2021 to 2023, and I’m looking at senior and above. What seniority does the role carry?",
    choices: [
      { cmd: "senior", label: "senior", verdicts: inside(["seniority"]) },
      { cmd: "lead", label: "lead or staff", verdicts: inside(["seniority"]) },
      { cmd: "principal", label: "principal, or head of", verdicts: inside(["seniority"]) },
      { cmd: "mid", label: "mid-level", verdicts: { seniority: "outside" } },
      { cmd: "junior", label: "junior", verdicts: { seniority: "outside" } },
      { cmd: "unknown", label: "not defined yet" },
    ],
    brief: "Seniority",
  },
  {
    key: "stack",
    topic: "Stack",
    screen: "LOADOUT",
    line:
      "My core is .NET and C# on the backend: Redis, RabbitMQ, SQL, the protocols machines speak. Full-stack .NET is fine too. These days AI agents do most of my typing; architecture, review and the CI that enforces them stay mine. What is the main stack?",
    choices: [
      { cmd: "dotnet-backend", label: ".NET, backend at the centre", verdicts: inside(["stack"]) },
      { cmd: "dotnet-fullstack", label: ".NET, full-stack", verdicts: inside(["stack"]) },
      { cmd: "dotnet-frontend", label: ".NET shop, mostly frontend", verdicts: { stack: "outside" } },
      { cmd: "other-backend", label: "another language, backend", verdicts: { stack: "outside" } },
      { cmd: "other", label: "another language, another role", verdicts: { stack: "outside" } },
      { cmd: "unknown", label: "not sure" },
    ],
    brief: "Stack",
  },
  {
    key: "pay",
    topic: "Compensation",
    screen: "CREDITS",
    line: "My floor is a RAL of €60k, and I aim for €65k and above. Which band is the role in?",
    choices: [
      { cmd: "under-50", label: "under €50k", verdicts: { pay: "outside" } },
      { cmd: "50-60", label: "€50k to €60k", verdicts: { pay: "outside" } },
      { cmd: "60-65", label: "€60k to €65k", verdicts: inside(["pay"]) },
      { cmd: "65-75", label: "€65k to €75k", verdicts: inside(["pay"]) },
      { cmd: "75-plus", label: "€75k and above", verdicts: inside(["pay"]) },
      { cmd: "consulting", label: "a consulting rate; the figure goes in the notes" },
      { cmd: "undisclosed", label: "not disclosed" },
    ],
    brief: "Compensation",
  },
  {
    key: "contract",
    topic: "Contract",
    screen: "SELECT MODE",
    line:
      "Contracts next. My notice period is a month, and I like to add another to recharge and arrive at my best, so count on about two months from a signed offer. Which one is on the table?",
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
    screen: "BOSS SELECT",
    line: "Four engineering notes are on my portfolio, one per decision. Which one is closest to this role?",
    choices: [
      ...chapters.flatMap((c) => (c.decision ? [{ cmd: c.decision.schematic, label: `${c.decision.number} · ${c.decision.title}` }] : [])),
      { cmd: "none", label: "none of them" },
    ],
    brief: "Closest engineering note",
  },
  {
    key: "process",
    topic: "Process",
    screen: "ROUNDS",
    line:
      "How does the hiring process look? What works for me: meeting the engineering lead in the first or second round, a real problem from your codebase over a puzzle, a take-home only if it fits in two hours, and a decision within three weeks.",
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
    screen: "FREE PLAY",
    line:
      "Anything the moves missed? The job description link goes here, and the team size and why the position is open if you know them. “skip” works.",
    typed: { hint: "notes or a link, or skip", max: 200, optional: true },
    brief: "Notes",
  },
  {
    key: "feedback-exchange",
    topic: "Feedback",
    screen: "RATE THIS GAME",
    line: "Two more, both optional and both for me. What would have made this exchange better?",
    typed: { hint: "feedback, or skip", max: 200, optional: true },
    brief: "Feedback on the exchange",
  },
  {
    key: "feedback-profile",
    topic: "Feedback",
    screen: "CONTINUE?",
    line: "Last one. What is missing from my profile for this role?",
    typed: { hint: "feedback, or skip", max: 200, optional: true },
    brief: "What my profile is missing",
  },
];

/** Between moves it is the recruiter's turn: one topic, one true line, first person. */
export type FactTopic = { cmd: string; label: string; lines: string[] };

export const facts: FactTopic[] = [
  {
    cmd: "games",
    label: "what I play",
    lines: [
      "I love video games. My top three: Portal 2, Psychonauts, Baldur’s Gate 3.",
      "Big League of Legends player. Right now it is a lot of Enshrouded with my squad.",
      "My first computer was more than twenty years ago. Back then it was a lot of Team Fortress 2.",
    ],
  },
  {
    cmd: "tabletop",
    label: "the D&D table",
    lines: [
      "I play D&D and other tabletop RPGs. Forever player, usually the designated mage.",
      "My favourite character was a bard named Azzurro, after Shrek’s Prince Charming, Principe Azzurro in Italian.",
    ],
  },
  {
    cmd: "comics",
    label: "what I read",
    lines: ["Superhero comics have always been a must. I read a lot of Italian Bonelli, and for the last couple of years manhwa has been very present."],
  },
  {
    cmd: "music",
    label: "what I listen to",
    lines: [
      "Gemitaiz, Tha Supreme and Sfera Ebbasta have been my top three on Spotify for years.",
      "My Spotify is g4solio: https://open.spotify.com/user/g4solio",
    ],
  },
  {
    cmd: "modena",
    label: "home, and food",
    lines: ["Modena is home, but my heart is in central Italy. I would defend almost any pasta dish, and anything with mascarpone is my baby."],
  },
  {
    cmd: "tools",
    label: "what I type in",
    lines: ["Visual Studio, always. These days most of my typing happens in Claude Code, with Zed and Sublime Text around it."],
  },
  { cmd: "cats", label: "pets", lines: ["Cats. Always cats."] },
  {
    cmd: "code",
    label: "a favourite feature, a bug",
    lines: [
      "The bug that lives in my head: an IEnumerable handed between actor steps was enumerated more than once, and every extra pass re-triggered work in a system that expected exactly one.",
      "LINQ is my favourite .NET feature, and I have a soft spot for message brokers.",
    ],
  },
  { cmd: "sport", label: "the honest answer", lines: ["Sport: nothing much, honestly."] },
  {
    cmd: "work",
    label: "three from the casebook",
    lines: [
      "Galactic Fighters, the space shooter I worked on in high school, is still on Steam.",
      "I started working in my fourth year of high school, because school had stopped being difficult.",
      "I spent six weeks in the United States with MSC, sharing knowledge in person.",
    ],
  },
];

export const factCount = facts.reduce((n, t) => n + t.lines.length, 0);

export const askLine = (name: string) => `Your turn${name ? `, ${name}` : ""}. Ask me one, or skip to the next question.`;
export const closingLine = (name: string) =>
  `That’s all thirteen${name ? `, ${name}` : ""}. look still has whatever you didn’t ask. score shows the role against my scope, inventory the brief, and send mails it to me.`;
export const exhaustedLine = `You’ve heard all ${factCount}. Ask me the rest in person.`;
/** The cabinet's last screen, above the brief. */
export const gameOverLine = (name: string) =>
  `That’s all thirteen${name ? `, ${name}` : ""}. Below is the brief: SUBMIT opens it in your own mail client, COPY copies it as text, MANUAL is my one-page CV.`;
/** Topics whose first fact arrives as a round of its own game: the runner for the bug, the shooter for Galactic Fighters, the pounce for the cats. */
export const rounds: Record<string, "runner" | "shooter" | "pounce"> = { code: "runner", work: "shooter", cats: "pounce" };
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
