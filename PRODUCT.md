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

A personal engineering portfolio for Davide Gozzi, software engineer in Modena,
Italy. It presents nine years of experience (2016–today) as six first-person
chapters with four engineering decisions expanded into concise case studies, an
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

Secondary position: an honest AI-assisted development stance — backend depth is
core; AI extends him into interface work while architecture, verification, and
trade-offs remain his responsibility. This site is itself the demonstration.

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
  (2024–today). Data lives in `data/portfolio.ts`.
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
  - Education is IIS F. Corni, Modena (perito informatico) only. University of
    Bologna is deliberately omitted and must not be added.
- OSUS standing rule (user-confirmed 2026-07-24): RosettAI is linked and embedded
  live (rosettai.osus.it); the other projects (FCHForge, OSUS Ecosystem, Sounds)
  remain unlinked names. Do not add links for them without a new decision.
- Boot sequence contract: runs once per browser session, immediately skippable,
  never gates content; the full page stays readable without JavaScript.

## Brand Commitments

- Name and wordmark: "Davide Gozzi". Persona line: "Your friendly neighborhood
  .NET developer."
- Voice: first-person, factual, understated; lessons stated plainly. No slogans.
- Pop-culture references are rationed: at most three across the site (currently
  the spider-sense boot line, the neighborhood line, and the 404 quote).
- Direction the user has made binding: industrial-editorial "engineering
  casebook", built by subtraction. The control-room/terminal-dashboard look was
  explicitly rejected (July 2026) as AI-generated-feeling; do not reintroduce it.
- Visual specifics (palette, type, layout) belong to the design record, not here.

## Evidence on Hand

- `public/Davide_Gozzi_CV.pdf` — one-page CV, the conversion artifact.
- EF SET certificate: https://cert.efset.org/fRRHgz (verifiable).
- Live product: https://rosettai.osus.it/ (RosettAI, active build).
- `public/og.png` — generated social preview (`npm run og`).
- Real employer history and shipped work (e.g. Winx dress-up app on Google Play).
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
