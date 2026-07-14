# Davide Gozzi — Engineering Portfolio

A static, animation-led engineering portfolio built with Next.js, TypeScript and Anime.js.
It presents professional experience as the core narrative — six chapters with expandable
case studies and animated SVG schematics — and OSUS as a future-facing product lab.

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

- Experience chapters, case studies and OSUS projects: `data/portfolio.ts`
- Page copy and links: `components/PortfolioPage.tsx`
- Case-study schematics (inline SVG): `components/Schematic.tsx`
- Visual identity and responsive behaviour: `app/globals.css`
- Boot sequence: `components/BootSequence.tsx`
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
- **OSUS projects**: intentionally not linked to repositories; descriptions only.
- **Phone number**: deliberately not published anywhere on the site.
- Add real metrics or project imagery only when they can be defended in an interview and
  cleared for confidentiality.
