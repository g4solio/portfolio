# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recruiters and hiring managers screening Davide Gozzi for full-time senior
engineering roles. They arrive mid-pipeline (from a CV, LinkedIn, or a referral),
have limited time, and are deciding whether he advances.

Secondary readers exist — consulting clients and fellow engineers — but the site is
not optimized for them.

## Product Purpose

A personal engineering portfolio for Davide Gozzi, senior software engineer in
Modena, Italy. It presents seven professional years (2019–today), and the two
before them (2016–2018), as six first-person chapters with four engineering decisions expanded into concise case studies, an
account of his AI-assisted development practice, and OSUS, his independent product
lab.

Success (user-confirmed): the reader downloads the one-page CV and takes it into
their hiring process. Email is the contact channel; inbound mail is welcome but the
CV download is the conversion that matters.

## Positioning

"Software that has to keep working": distributed services, legacy platforms,
document systems, and applications connected to real machines. The differentiator
is judgment shown as evidence — real decisions with problem, constraint, decision,
and lesson — rather than a feature or technology list. A neighboring portfolio
could not truthfully copy the specific employers, decisions, and diagrams.

Secondary position (restated 2026-11-04): an honest AI-assisted development
stance — backend depth is core; AI agents now do most of the typing, on
interfaces first and then on everything else, while the product spec, the domain
glossary, the architecture decisions, the coding standards, the review and the
CI that enforces them remain his responsibility. This site was the first
demonstration; CollectionVault, a private personal catalog, is the latest and is
named on the site with its real figures.

## Operating Context

- Read by screeners on desktop and phones, often in a single short visit.
- Static export (`output: "export"`) deployed to GitHub Pages via GitHub Actions;
  `basePath`/`assetPrefix` derived from `GITHUB_REPOSITORY`. Links to in-repo
  assets (CV) must stay basePath-relative.
- No backend, no runtime secrets, no external font or analytics requests.
- The portable artifacts are `public/Davide_Gozzi_CV.pdf` (one page) and the
  EF SET certificate link.

## Capabilities and Constraints

- Six chapters: StarworkGC (2016–2017), Melazeta (2017), Amaris · Credemtel
  (2019–2021), iSolutions (2021), MSC (2021–2023), GIAMMAR · System Ceramics
  (2024–today). Melazeta is dated 2017–2018, matching the CV and LinkedIn (two
  placements: May–June 2017 and February 2018). Data lives in `data/portfolio.ts`.
- Four engineering notes with reconstructed SVG schematics: collision prediction,
  configuration-driven document schemas, distributed agent compatibility,
  tile-defect quality data.
- Content truth rules (binding):
  - No invented metrics, testimonials, or exaggerated ownership. State absences
    rather than fabricate.
  - Client and product names appear only where cleared for public presentation;
    the names currently on the site are cleared.
  - Diagrams are reconstructions; they must never expose client source code,
    confidential infrastructure, credentials, or internal data.
  - EF SET credential is described precisely as C2 English **comprehension**
    (EF SET 84/100 — reading 78, listening 90); the certificate covers reading
    and listening only.
  - Education is IIS F. Corni, Modena (perito informatico) only; add nothing
    else.
- OSUS standing rule (user-confirmed 2026-07-24): RosettAI is linked and embedded
  live (rosettai.osus.it); the other projects (FCHForge, OSUS Ecosystem, Sounds)
  remain unlinked names. Do not add links for them without a new decision.
- Boot sequence contract: runs once per browser session, immediately skippable,
  never gates content; the full page stays readable without JavaScript.
- Meet (`/meet/`, user-confirmed 2026-11-07, rebuilt as the cabinet 2026-11-08): the
  page for recruiters who message Davide on LinkedIn. An arcade cabinet of his own:
  plywood sides with the designated Mage stencilled on them, a black front covered in
  stickers from the fact pool (the cat, the d20, Azzurro's lute, the MO plate, LINQ,
  the "enumerated twice" warning, the dinosaur, the gamepad, g4solio), a cat asleep on
  the hood, a cotto floor, a plaster wall that is the page. The cabinet is rendered
  once (`scripts/cabinet/render.html`, three.js in headless Chrome, run by
  `node scripts/cabinet.mjs`) into two stills, the hero at 30° and the play view
  face-on; the page maps a live screen onto the tube with a matrix3d from the still's
  projected corners. A key or a tap inserts the coin; phones stand at the cabinet from
  the start. Thirteen moves as cabinet screens (NAME ENTRY, INSERT COIN, PLAYER 1,
  STAGE SELECT, DIFFICULTY, LOADOUT, CREDITS, SELECT MODE, BOSS SELECT, ROUNDS, FREE
  PLAY, RATE THIS GAME, CONTINUE?), in his voice, the last three optional. Each screen
  reads as what it is named (picked from rendered candidates 2026-11-08, issue #6):
  NAME ENTRY seats the recruiter as 2P beside Davide as 1P; INSERT COIN has the
  cabinet's coin door, CREDIT turning 1 once a name is typed; PLAYER 1 writes the role
  as the designated Mage's class; STAGE SELECT a 3 × 2 stage grid, mode by row, with
  the Ghirlandina behind the stages within reach of Modena; DIFFICULTY a ladder with a
  rank insignia per rung; LOADOUT the kit from his line above the menu; CREDITS a
  credit counter where up is a band up and no band is coloured by fit; SELECT MODE a
  loading bar, the notice and a month to recharge; BOSS SELECT the four engineering
  notes as portraits rasterized at runtime from their own schematics; ROUNDS a tower
  of the process under the cursor up to OFFER; FREE PLAY an open field; CONTINUE? a
  countdown stopped at 1 with the hood's cat asleep on it. RATE THIS GAME keeps the
  plain field: decorative stars were rejected as a button that isn't one. The layouts,
  the choices they hold, the short labels and the art live in `data/meet.ts`, where
  data order is screen order. After every answer it is the recruiter's BONUS STAGE: a
  board of the cabinet's stickers, one per topic from the pool of seventeen facts, or
  skip. A fact whose line has a shape gets a format (the games and music top threes as
  charts, the tools at the text mode's prompt, comics in a speech bubble); every other
  fact sits under its topic's sticker. The first fact of three topics is a twenty-second one-button round whose
  fact arrives whatever the score: the runner where every obstacle is enumerated twice
  (code), the sweep-and-fire shooter for Galactic Fighters (work), the pounce (cats).
  The HUD shows KNOWN and MOVE only; the fit against the scope and the brief appear at
  GAME OVER: one dot-leader row per criterion and a plain sum, never a score count-up,
  the brief printed as a torn ticket, then SUBMIT (`mailto:` from the recruiter's own
  client), COPY, MANUAL (the CV) and PLAY AGAIN. Arrows move (by rows on the two-column
  screens), Enter is A, digits pick, Backspace undoes a move;
  the button on the still is a hotspot. Sound is opt-in, off by default. Text mode
  (`#text`) is the earlier transcript game, kept whole; without JavaScript the scope,
  the moves and the facts print as a document. Nothing is stored; nothing blocks
  anyone: a miss reads "outside my ideal scope", an unanswered criterion "not
  confirmed". Data, screens and the brief live in `data/meet.ts`;
  `node scripts/meet-check.mjs` checks the data, the scoring, the screens and the
  brief. Facts that name games, comics or a film are biography, not references, and do
  not count against the pop-culture budget; the rounds borrow mechanics, never names.
  Linked once, from the Contact section; not in the header navigation.

## Brand Commitments

- Name and wordmark: "Davide Gozzi". Persona line: "Your friendly neighborhood
  .NET developer."
- Role fact and page title: "Senior software engineer" (user-confirmed
  2026-11-04). The seniority rests on the Senior .NET Developer title held at
  MSC, 2021–2023. The hero also carries a "Workflow" fact stating the AI stance
  in one line; it is a fact, not a slogan, and the coined-word route ("prompteer")
  was considered and rejected on 2026-11-04.
- Voice: first-person, factual, understated; lessons stated plainly. No slogans.
- Pop-culture references are rationed: at most three across the site (currently
  the spider-sense boot line, the neighborhood line, and the 404 quote).
- Direction the user has made binding: industrial-editorial "engineering
  casebook", built by subtraction. The control-room/terminal-dashboard look was
  explicitly rejected (July 2026) as AI-generated-feeling; do not reintroduce it.
- Casebook v2 (user-confirmed 2026-11-04): the direction is evolved, not
  replaced. One identity across the site, the CV, GitHub and LinkedIn, recorded
  in the "Casebook" design system and in `brand/tokens.json`. The mark is the D
  drawn as a casebook figure. A dark (Ink) variant exists for GitHub assets
  only; the site and the CV stay paper.
- Motion direction (user-confirmed 2026-11-04): "drafting". Nothing fades in;
  things are drawn, pencilled then inked. The boot runs under 2.5 seconds in
  casebook tint and collapses onto the header rule; the wordmark is traced from
  the font's outlines; the statement is typed; hairlines, chapter numbers and
  schematics draw as they enter; titles wait in pencil and are inked on entry.
  Still binding: no scroll hijacking, nothing gated behind animation, reduced
  motion makes everything instant, the page reads in full without JavaScript.
  Decision titles and OSUS product names stay plain ink to keep the dose small.
- Meet is the one scoped exception to the single idiom (user-confirmed 2026-11-07;
  the garage world chosen from rendered alternatives 2026-11-08): a concept Davide
  names is a world, built whole. Colour beyond the casebook palette, a place the
  cabinet stands in, decals drawn from his real facts, pixel art as code grids in the
  tube's CRT colours, sound opt-in and off by default. No logos or characters that
  belong to someone else, no human portrait, no Zork quotes. The pop-culture budget
  stays at three; the rounds borrow mechanics, not names. The transcript game stays
  as text mode, in the mono face on paper.
- Visual specifics (palette, type, layout) belong to the design record, not here.

## Evidence on Hand

- `public/Davide_Gozzi_CV.pdf` — one-page CV, the conversion artifact. Rendered from
  `scripts/cv/Davide_Gozzi_CV.html` with WeasyPrint (`npm run cv`), so the PDF and
  the site are edited from the same facts.
- EF SET certificate: https://cert.efset.org/fRRHgz (verifiable).
- Live product: https://rosettai.osus.it/ (RosettAI, active build).
- `public/og.png` and `public/brand/` — generated from `brand/tokens.json` by
  `npm run brand`: the social preview, the LinkedIn banner, the X header, the
  GitHub banners in Paper and Ink, the repository previews and the avatars.
- Real employer history and shipped work (e.g. Winx dress-up app on Google Play).
- CollectionVault figures, from the private repo g4solio/CollectionVault: scope
  confirmed 2026-10-16, in everyday use since 2026-10-29, 357 commits and 77 pull
  requests on main between 2026-10-16 and 2026-11-03, and a CI step that fails
  the build if the catalog core reads a clock, a file or the network. Re-verify
  before changing any of these numbers. The operating model behind it is public at
  github.com/g4solio/CollectionVault_Peek (2026-11-04); the product repo stays private.
- Absences that must not be fabricated: no testimonials, no client quotes, no
  usage metrics, no press.

## Product Principles

1. Every claim is verifiable or absent — the portfolio's credibility is the
   product.
2. Judgment over inventory: decisions with constraints and lessons outrank
   technology lists.
3. The CV is the conversion: the site earns the download; the PDF travels.
4. Confidentiality outranks impressiveness: reconstructed diagrams, cleared
   names only.
5. Honest range: backend is the core claim; AI-extended interface work is
   disclosed, not hidden.

## Accessibility & Inclusion

Standing commitments (from README, treated as requirements): semantic HTML with
a skip link, native disclosure elements, full keyboard navigation,
`prefers-reduced-motion` support, no content gated behind animation, and a fully
readable page without JavaScript. WCAG 2.1 AA is the working target; the
2026-07-24 audit flagged the `--ink-faint` contrast token as the open gap.
