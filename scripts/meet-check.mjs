// The one check for /meet/: the scoring, the brief, and the shape of the data. Run: node scripts/meet-check.mjs
// (Node strips the types from data/meet.ts itself; no build step.)
import assert from "node:assert/strict";

const { moves, scope, facts, factCount, verdicts, scoreOf, briefText, mailtoHref, splitLine, doneLine } = await import("../data/meet.ts");

const globalCommands = ["help", "look", "scope", "score", "inventory", "back", "send", "copy", "cv", "cast", "fireball", "magic missile", "skip"];

// Commands are unique within a move, every verdict names a scope line, every line can be typed.
assert.equal(moves.length, 13);
for (const m of moves) {
  const cmds = (m.choices ?? []).map((c) => c.cmd);
  assert.equal(new Set(cmds).size, cmds.length, `${m.key}: duplicate command`);
  for (const c of m.choices ?? []) {
    assert.ok(!globalCommands.includes(c.cmd), `${m.key}/${c.cmd}: shadows a global command`);
    for (const k of Object.keys(c.verdicts ?? {})) assert.ok(scope.some((s) => s.key === k), `${m.key}/${c.cmd}: unknown criterion ${k}`);
  }
  assert.ok(m.choices || m.typed, `${m.key}: neither choices nor typed`);
  assert.ok(m.line.length <= 300, `${m.key}: line too long to type (${m.line.length})`);
}

// The facts: topics with unique commands that shadow nothing, short lines, the Spotify link.
const topicCmds = facts.map((t) => t.cmd);
assert.equal(new Set(topicCmds).size, topicCmds.length, "duplicate topic command");
for (const t of facts) {
  assert.ok(!globalCommands.includes(t.cmd), `${t.cmd}: shadows a global command`);
  assert.ok(t.label && t.lines.length > 0, `${t.cmd}: empty topic`);
  for (const line of t.lines) assert.ok(line.length <= 200, `${t.cmd}: line too long (${line.length})`);
}
assert.ok(factCount >= 10, "fact pool filled");
assert.ok(facts.some((t) => t.lines.some((l) => l.includes("https://open.spotify.com/user/g4solio"))), "spotify link present");

const ideal = {
  name: "Marta",
  company: "Acme Robotics",
  role: "Senior backend engineer",
  location: "hybrid-modena",
  seniority: "senior",
  stack: "dotnet-backend",
  pay: "65-75",
  contract: "employee",
  note: "agents",
  process: "short",
  notes: "",
  "feedback-exchange": "",
  "feedback-profile": "",
};
assert.equal(scoreOf(ideal), 5);
assert.equal(scoreOf({ ...ideal, pay: "50-60" }), 4);
assert.equal(scoreOf({}), 0);
assert.deepEqual(verdicts({ ...ideal, location: "onsite" }), {
  location: "outside",
  seniority: "inside",
  stack: "inside",
  pay: "inside",
  relocation: "outside",
});
assert.deepEqual(verdicts({ ...ideal, location: "unknown", pay: "undisclosed" }), {
  location: "unknown",
  seniority: "inside",
  stack: "inside",
  pay: "unknown",
  relocation: "unknown",
});

const brief = briefText(ideal);
assert.match(brief, /^Role brief for Davide Gozzi/);
assert.match(brief, /From: Marta/);
assert.match(brief, /Company: Acme Robotics/);
assert.match(brief, /Closest engineering note: 03 · Shipping capabilities/);
assert.match(brief, /Notes: —/);
assert.match(brief, /Inside my scope on 5 of 5 points\./);
assert.match(briefText({}), /From: —/);
assert.match(briefText({}), /Location: not confirmed/);

// The longest possible brief still fits what mail clients accept as a mailto body.
const longest = Object.fromEntries(
  moves.map((m) => [m.key, m.typed ? "x".repeat(m.typed.max) : [...m.choices].sort((a, b) => b.label.length - a.label.length)[0].cmd]),
);
assert.ok(briefText(longest).length <= 1600, `brief too long: ${briefText(longest).length} chars`);
assert.ok(mailtoHref(longest).length <= 6000, `mailto too long: ${mailtoHref(longest).length} chars`);
assert.ok(mailtoHref(ideal).startsWith("mailto:david3gozz1@gmail.com?subject=Role%20brief%20for%20Davide%20Gozzi%3A%20Senior%20backend%20engineer%20%C2%B7%20Acme%20Robotics&body="));
assert.ok(mailtoHref(ideal).includes("%0D%0A"), "mailto body uses CRLF");

// The desk: every sheet has its own name that fits the title block, and every line splits into a question and the rest.
const tavole = moves.map((m) => m.tavola);
assert.equal(new Set(tavole).size, tavole.length, "duplicate sheet name");
for (const m of moves) {
  assert.ok(m.tavola && m.tavola.length <= 16, `${m.key}: sheet name missing or too long`);
  const { ask, say } = splitLine(m.line);
  assert.ok(ask.endsWith("?"), `${m.key}: no question to put on the wall`);
  assert.equal(ask.length + say.length + (say ? 1 : 0), m.line.length, `${m.key}: the split loses text`);
}
assert.deepEqual(splitLine(doneLine("Marta")), {
  ask: "That’s all thirteen, Marta.",
  say: "The job card is the brief. Send opens it in your own mail client, and copy takes it as text.",
});
// Top first: the seniority's top rung and the pay's top band lead the sheet.
const order = (key) => moves.find((m) => m.key === key).choices.slice(0, 5).map((c) => c.cmd);
assert.deepEqual(order("seniority"), ["principal", "lead", "senior", "mid", "junior"]);
assert.deepEqual(order("pay"), ["75-plus", "65-75", "60-65", "50-60", "under-50"]);

console.log(`meet-check: ok (${moves.length} moves, ${factCount} facts in ${facts.length} topics, longest brief ${briefText(longest).length} chars, mailto ${mailtoHref(longest).length} chars)`);
