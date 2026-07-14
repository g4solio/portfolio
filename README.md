# Davide Gozzi — Engineering Portfolio

A static engineering portfolio built with Next.js, TypeScript and Anime.js, designed as an
industrial-editorial casebook: paper ground, ink typography, one drawing-blue accent, hairline
rules instead of cards. Professional experience reads as six first-person chapters with four
expandable case studies and ink-line SVG diagrams; OSUS closes the page as a small project
index.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build
```

Next.js writes the static site to `out/`. No server, no secrets, no backend dependency.

## Deploy on GitHub Pages

1. Create a repository named `g4solio.github.io` for a user site, or use any repository name for a project site.
2. Push this project to the `main` branch.
3. Open **Settings → Pages → Build and deployment** and select **GitHub Actions** as the source.
4. The included workflow (`.github/workflows/deploy-pages.yml`) builds and deploys automatically.

`next.config.ts` detects project repositories and adds the required base path. A repository
ending in `.github.io` is served from the domain root.

## Main editing points

- Chapter copy, case studies and OSUS projects: `data/portfolio.ts`
- Page structure and section copy: `components/PortfolioPage.tsx`
- Chapter rendering: `components/Chapters.tsx`
- Case-study diagrams (inline SVG): `components/Schematic.tsx`
- Visual system (paper/ink tokens): `app/globals.css`
- Boot sequence (~1.3s, morphs into the header wordmark): `components/BootSequence.tsx`
- Social preview image: `npm run og` regenerates `public/og.png` from `scripts/og.mjs`

## Fonts

Space Grotesk, Inter and JetBrains Mono are self-hosted as variable woff2 files in
`app/fonts/` (originally from the `@fontsource-variable` packages, SIL Open Font License)
and loaded through `next/font/local`. No external font requests at runtime.

## Motion and accessibility

- The boot intro runs once per browser session, is skippable, and hands off into the hero.
- `prefers-reduced-motion` disables all animation; content is never gated behind motion.
- Without JavaScript the full page renders and the boot overlay never appears
  (`html.js` gating in `globals.css`).
- Case studies are native `<details>/<summary>` elements — keyboard accessible, and the
  open/draw animations are progressive enhancement on top.
- No scroll hijacking; scrolling is always native.

## Assumptions and open TODOs

- **Site URL**: metadata assumes `https://g4solio.github.io` (`app/layout.tsx`). Update
  `siteUrl` if the repository or username differs.
- **CV download**: not included yet; add a link in the contact section when a final
  one-page CV exists.
- **Client naming**: Credemtel and System Ceramics are named with the owner's approval
  (July 2026).
- **EF SET**: presented strictly as English *comprehension* (Reading 78 / Listening 90);
  do not reword it as a writing/speaking certification.
- **OSUS projects**: intentionally not linked to repositories; descriptions only. The index
  is typographic for now — real screenshots/artifacts slot in when available (see the TODO
  in `components/PortfolioPage.tsx`).
- **Pop-culture budget**: exactly three references (hero line, boot spider-sense, 404 page).
  Do not add more.
- **Phone number**: deliberately not published anywhere on the site.
- Add real metrics or project imagery only when they can be defended in an interview and
  cleared for confidentiality.
