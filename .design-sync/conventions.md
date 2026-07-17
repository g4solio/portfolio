# Building with this design system

This is the design system of davidegozzi.com — an industrial-editorial, ink-on-paper portfolio. Everything is styled by **semantic CSS classes + CSS custom properties** defined in `_ds_bundle.css` (reachable via `styles.css`). There is no utility-class system and no theme provider — do not invent Tailwind-style class names; use the tokens and classes below, or plain inline styles built from the tokens.

## Setup

No provider or wrapper is required. Base typography applies through element selectors (`body`, `h1`–`h4`, `a`) as soon as `styles.css` is loaded. One gate to know about: `BootSequence` is `display: none` unless `<html>` has the class `js` — add `document.documentElement.classList.add("js")` only if you actually use the boot flow. `BootSequence` is a dark CRT POST check (typed lines, blinking cursor): it dismisses on any key/click/wheel or ~7.2 s after mount, fades 450 ms, then calls `onComplete`; `PortfolioPage` already orchestrates that internally.

## Tokens (define the look — use these, not hardcoded values)

- Surfaces: `--paper` #f7f5f1 (page), `--paper-band` #efece3 (full-bleed band), `--rule` #dad6cb (hairlines: `border: 1px solid var(--rule)`)
- Ink: `--ink` (text), `--ink-soft` (secondary), `--ink-faint` (labels/meta), `--accent` #2b5bc7 (links, highlights — the only strong color)
- OSUS status tones: `--tone-blue`, `--tone-green`, `--tone-amber`, `--tone-red` (muted print tones, used via `.tone-blue|green|amber|red` on a container + `.osus-status`)
- Type: `--display` (Space Grotesk — headings), `--sans` (Inter — body), `--mono` (JetBrains Mono — labels, captions, metadata), `--pixel` (Silkscreen — numerals ONLY, tiny doses: `9+`, chapter numbers, counts; ~1px smaller than surrounding text, never headings or body copy)
- CRT boot: `--crt` #0b0d0b (boot background); phosphor text/highlight come from `--phos`/`--phos-hi` set by `BootSequence`'s `phosphor` prop (green default, amber, white)
- Layout: `--canvas` 1080px, `--prose` 640px; the section pattern is `width: min(var(--canvas), 100% - 48px); margin-inline: auto;`

## Class vocabulary (all defined in `_ds_bundle.css`)

- Page frame: `.site-shell`, `.site-header`, `.wordmark`, `.site-footer`, `.skip-link`
- Sections: `.hero`, `.hero-grid`, `.hero-statement`, `.hero-links`, `.hero-facts`, `.section-intro`, `.ai-grid`, `.contact-links`
- Work chapters: `.chapter` (quiet variant: `.chapter--interlude`; column wrappers: `.chapter-side`, `.chapter-wide`, `.chapter-cont`), `.chapter-rail`, `.chapter-number`, `.chapter-years`, `.chapter-head`, `.chapter-role`, `.chapter-body`, `.chapter-aside`, `.chapter-note`, `.chapter-stack`
- Engineering notes: `.decision` (a `<details>`), `.decision-label`, `.decision-cta`, `.decision-body`
- Figures: `.fig` (bordered diagram + mono `figcaption`), `.schematic`
- OSUS band: `.osus`, `.osus-inner`, `.osus-feature`, `.osus-index`, `.osus-item`, `.osus-status`, `.osus-artifact`
- Boot (CRT POST check): `.boot`, `.boot-scan` (scanlines), `.boot-lines`, `.boot-line` (typewriter reveal via `--tw` + `steps(N)`), `.boot-hi` (phosphor highlight), `.boot-last`, `.boot-cursor` (blinking block)
- Gaming winks: `.h1-cursor` (blinking ink block after the H1), `.pix` (pixel numerals), `.status-dot` (7px tone-green dot); nav/hero/contact links get `[ bracket ]` hovers via CSS pseudo-elements — no extra markup needed

The idiom for small labels/metadata everywhere: `font-family: var(--mono); font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-faint)`.

## Components

`PortfolioPage` (the entire site, self-contained), `Chapters` (six-chapter work history, data baked in), `Schematic` (`id: "collision" | "schema" | "agents" | "tiles"` — ink-line SVG diagrams), `BootSequence` (`onComplete` callback; `phosphor?: "green" | "amber" | "white"`, `scanlines?: boolean`). `Chapters`/`PortfolioPage` render fixed portfolio content — use them to reproduce or extend the site, and the tokens/classes above for new layouts. Per-component API: `components/general/<Name>/<Name>.d.ts` and `.prompt.md`.

## Example — a new section in this system's voice

```tsx
import { Schematic } from "davide-gozzi-portfolio";

<main>
  <section className="work" style={{ width: "min(var(--canvas), 100% - 48px)", marginInline: "auto" }}>
    <h2>Case study</h2>
    <p className="section-intro">One paragraph of quiet context, ink-soft, max 58ch.</p>
    <figure className="fig" style={{ maxWidth: 440 }}>
      <Schematic id="tiles" />
      <figcaption>fig. 04 — defect map and largest usable area</figcaption>
    </figure>
  </section>
</main>
```
