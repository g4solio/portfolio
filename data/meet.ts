// /meet/ — the arcade cabinet for recruiters: the scope, the thirteen moves in Davide's voice,
// the facts about him the recruiter asks for between moves, and the brief they mail back.
// Facts only (PRODUCT.md, content truth rules): every line here was confirmed by Davide on 2026-11-07.
// Imports carry the .ts extension so `node scripts/meet-check.mjs` can load this file directly.
import { chapters } from "./portfolio.ts";

export const meetEmail = "david3gozz1@gmail.com";
export const meetTitle = "Let’s get to know each other";
export const meetDescription =
  "A small arcade game for recruiters: describe the role in thirteen questions, ask me something after each one, and leave with a brief that shows how the role fits what I’m looking for.";
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
  /** What a laid-out screen prints for this choice: a stage tile's "MODE · WHERE", the counter's readout, an aside button. */
  short?: string;
};

/**
 * The layouts that replace a move's menu, and how many of its choices each holds; the choices after
 * those sit aside, as buttons below. Data order is screen order, top to bottom and left to right, so the
 * arrows keep their meaning on every screen.
 */
export const layoutSlots = { stages: 6, ladder: 5, counter: 5, bosses: 4 } as const;
/**
 * How the cabinet lays a move's screen out: a slot layout above, art beside a plain menu, or one that
 * dresses a typed field. No layout: the plain menu or field.
 */
export type Layout = keyof typeof layoutSlots | "kit" | "loading" | "tower" | "countdown" | "players" | "coin" | "class" | "open";
export const menuLayouts: Layout[] = ["kit", "loading", "tower"];
export const typedLayouts: Layout[] = ["countdown", "players", "coin", "class", "open"];

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
  layout?: Layout;
  /** What the art beside the menu prints, all from the line: LOADOUT's kit; SELECT MODE's bar segments, then its caption. */
  art?: string[];
};

const inside = (keys: CriterionKey[]) => Object.fromEntries(keys.map((k) => [k, "inside"])) as Partial<Record<CriterionKey, Verdict>>;

export const moves: Move[] = [
  {
    key: "name",
    topic: "Hello",
    screen: "NAME ENTRY",
    line:
      "I’m Davide, player 1. You describe the role in thirteen questions, and after each one you get to ask me something. At the end there’s a brief to mail me. Who’s player 2? A first name is plenty.",
    typed: { hint: "your first name, or skip", max: 40, optional: true },
    brief: "From",
    layout: "players",
  },
  {
    key: "company",
    topic: "Company",
    screen: "INSERT COIN",
    line: "Who’s putting the coin in? The company’s name, or “confidential” if you can’t say yet.",
    typed: { hint: "company name, or confidential", max: 80 },
    brief: "Company",
    layout: "coin",
  },
  {
    key: "role",
    topic: "Role",
    screen: "PLAYER 1",
    line:
      "Give player 1 a class: what’s the role called? I’m at my best on the backend of software that has to keep working: distributed services, legacy platforms, systems wired to real machines.",
    typed: { hint: "the role’s title", max: 80 },
    brief: "Role",
    layout: "class",
  },
  {
    key: "location",
    topic: "Location",
    screen: "STAGE SELECT",
    line:
      "Pick the stage. Home base is Modena: remote works if the team keeps European hours, hybrid if the office is within reach and wants me in two days a week at most.",
    choices: [
      // A 3 × 2 stage grid: one row per mode, the stage within reach of Modena first.
      { cmd: "remote-eu", label: "fully remote, team on European hours", verdicts: inside(["location", "relocation"]), short: "REMOTE · EU HOURS" },
      { cmd: "remote", label: "fully remote, team elsewhere", verdicts: { location: "outside", relocation: "inside" }, short: "REMOTE · TEAM ELSEWHERE" },
      { cmd: "hybrid-modena", label: "hybrid, within reach of Modena", verdicts: inside(["location", "relocation"]), short: "HYBRID · NEAR MODENA" },
      { cmd: "hybrid", label: "hybrid, elsewhere in Italy", verdicts: { location: "outside", relocation: "outside" }, short: "HYBRID · REST OF ITALY" },
      { cmd: "onsite-modena", label: "on site, within reach of Modena", verdicts: { location: "outside", relocation: "inside" }, short: "ON SITE · NEAR MODENA" },
      { cmd: "onsite", label: "on site, elsewhere", verdicts: { location: "outside", relocation: "outside" }, short: "ON SITE · ELSEWHERE" },
      { cmd: "unknown", label: "not decided yet" },
    ],
    brief: "Location",
    layout: "stages",
  },
  {
    key: "seniority",
    topic: "Seniority",
    screen: "DIFFICULTY",
    line:
      "Difficulty here means seniority. Seven professional years; the senior title came with MSC in 2021. I play on senior or harder. What’s this role set to?",
    choices: [
      // The ladder, top rung first.
      { cmd: "principal", label: "principal, or head of", verdicts: inside(["seniority"]) },
      { cmd: "lead", label: "lead or staff", verdicts: inside(["seniority"]) },
      { cmd: "senior", label: "senior", verdicts: inside(["seniority"]) },
      { cmd: "mid", label: "mid-level", verdicts: { seniority: "outside" } },
      { cmd: "junior", label: "junior", verdicts: { seniority: "outside" } },
      { cmd: "unknown", label: "not defined yet" },
    ],
    brief: "Seniority",
    layout: "ladder",
  },
  {
    key: "stack",
    topic: "Stack",
    screen: "LOADOUT",
    line:
      "My loadout: C# and .NET on the backend, with Redis, RabbitMQ, SQL and the protocols machines speak; full-stack .NET works too. AI agents do most of my typing; architecture, review and CI stay mine. What does the role run on?",
    choices: [
      { cmd: "dotnet-backend", label: ".NET, backend at the centre", verdicts: inside(["stack"]) },
      { cmd: "dotnet-fullstack", label: ".NET, full-stack", verdicts: inside(["stack"]) },
      { cmd: "dotnet-frontend", label: ".NET shop, mostly frontend", verdicts: { stack: "outside" } },
      { cmd: "other-backend", label: "another language, backend", verdicts: { stack: "outside" } },
      { cmd: "other", label: "another language, not backend", verdicts: { stack: "outside" } },
      { cmd: "unknown", label: "not sure" },
    ],
    brief: "Stack",
    layout: "kit",
    art: ["C#", ".NET", "Redis", "RabbitMQ", "SQL", "protocols", "AI agents"],
  },
  {
    key: "pay",
    topic: "Compensation",
    screen: "CREDITS",
    line: "Credits here means the RAL. My floor is €60k, and I’m aiming for €65k and up. Which band is this role in?",
    choices: [
      // The credit counter, top band first, so up is a band up.
      { cmd: "75-plus", label: "€75k and above", verdicts: inside(["pay"]), short: "€75K +" },
      { cmd: "65-75", label: "€65k to €75k", verdicts: inside(["pay"]), short: "€65–75K" },
      { cmd: "60-65", label: "€60k to €65k", verdicts: inside(["pay"]), short: "€60–65K" },
      { cmd: "50-60", label: "€50k to €60k", verdicts: { pay: "outside" }, short: "€50–60K" },
      { cmd: "under-50", label: "under €50k", verdicts: { pay: "outside" }, short: "< €50K" },
      { cmd: "consulting", label: "a consulting rate; the figure goes in the notes", short: "consulting rate" },
      { cmd: "undisclosed", label: "not disclosed" },
    ],
    brief: "Compensation",
    layout: "counter",
  },
  {
    key: "contract",
    topic: "Contract",
    screen: "SELECT MODE",
    line:
      "Mode means the contract. Whichever it is, I start about two months from a signed offer: one month of notice, one to recharge and arrive at my best. What’s on the table?",
    choices: [
      { cmd: "employee", label: "permanent employee" },
      { cmd: "fixed-term", label: "fixed-term employee" },
      { cmd: "consulting", label: "consulting, through my own company" },
      { cmd: "agency", label: "through an agency" },
      { cmd: "unknown", label: "not decided yet" },
    ],
    brief: "Contract",
    layout: "loading",
    art: ["notice · 1 month", "recharge · 1 month", "about two months from a signed offer"],
  },
  {
    key: "note",
    topic: "Engineering note",
    screen: "BOSS SELECT",
    line: "Four bosses, each an engineering note from my portfolio: a real decision, its constraints and what I learned. Which fight looks most like this role?",
    choices: [
      ...chapters.flatMap((c) => (c.decision ? [{ cmd: c.decision.schematic, label: `${c.decision.number} · ${c.decision.title}` }] : [])),
      { cmd: "none", label: "none of them" },
    ],
    brief: "Closest engineering note",
    layout: "bosses",
  },
  {
    key: "process",
    topic: "Process",
    screen: "ROUNDS",
    line:
      "How many floors up to the offer? I do best when I meet the engineering lead by round two, get a real problem from your codebase rather than a puzzle, a take-home only if it fits in two hours, and a decision within three weeks.",
    choices: [
      // The tower prints the rounds of the choice under the cursor, bottom floor first.
      { cmd: "short", label: "up to three rounds, no take-home", short: "ROUND 1 · ROUND 2 · ROUND 3" },
      { cmd: "take-home", label: "includes a take-home", short: "ROUND 1 · TAKE-HOME · …" },
      { cmd: "long", label: "four rounds or more", short: "ROUND 1 · ROUND 2 · ROUND 3 · ROUND 4 +" },
      { cmd: "unknown", label: "not defined yet", short: "?" },
    ],
    brief: "Process",
    layout: "tower",
  },
  {
    key: "notes",
    topic: "Notes",
    screen: "FREE PLAY",
    line:
      "Free play: anything my questions missed. The job ad link helps most; so do the team’s size and why the seat is open.",
    typed: { hint: "job ad link, notes, or skip", max: 200, optional: true },
    brief: "Notes",
    layout: "open",
  },
  {
    key: "feedback-exchange",
    topic: "Feedback",
    screen: "RATE THIS GAME",
    line: "Two more, both optional, both for me. What would have made this better for you?",
    typed: { hint: "what to change, or skip", max: 200, optional: true },
    brief: "Feedback on the exchange",
  },
  {
    key: "feedback-profile",
    topic: "Feedback",
    screen: "CONTINUE?",
    line: "Last one, and the one I learn most from: what’s missing from my profile for this role?",
    typed: { hint: "what’s missing, or skip", max: 200, optional: true },
    brief: "What my profile is missing",
    layout: "countdown",
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
    label: "best bug, favourite feature?",
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
export function askLine(name: string, answered: number): string {
  const n = name ? `, ${name}` : "";
  if (answered <= 1) return `Nice to meet you${n}. After every answer it’s your turn: pick one and I’ll tell you about it. Three of them start a twenty-second game.`;
  if (answered >= moves.length) return `One last question before the brief${n}?`;
  return [`Your turn${n}.`, "Ask me one, or skip ahead.", `Your pick${n}.`, "Another one?", "Ask away, or keep going."][answered % 5];
}
export const closingLine = (name: string) =>
  `That’s all thirteen${name ? `, ${name}` : ""}. score shows how the role fits what I’m after, inventory prints the brief, send mails it to me. look still has whatever you didn’t ask.`;
export const exhaustedLine = `You’ve heard all ${factCount}. Ask me the rest in person.`;
/** The cabinet's last screen, above the brief. */
export const gameOverLine = (name: string) =>
  `That’s all thirteen${name ? `, ${name}` : ""}. Below: how the role fits what I’m after, and the brief to send me. Nothing leaves this page until you press send in your own mail.`;
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
