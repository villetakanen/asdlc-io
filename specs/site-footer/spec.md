---
title: "Site Footer"
status: "approved"
owner: "Ville Takanen"
archetype: "feature"
created: "2026-03-21"
tags: []
---

# Feature: Site Footer

## Blueprint

### Context

The site footer provides universal identity, logical navigation groups, release tag info, and essential legal references on every page. To support the growing resource ecosystem (GitHub, Discord, Recipes, Blog, and the MIT License), the footer utilizes a premium, responsive multi-column Swiss-style monospace design matching the core design system tokens.

### Architecture

- **API & Data Contracts:**
  - Dynamic release metadata is retrieved by importing `version` directly from `package.json`.
  - The dynamic copyright timestamp is derived in real-time from `new Date().getFullYear()`.
- **File System Structure:**
  - Component implementation: `src/components/Footer.astro`
  - Global stylesheet: `src/styles/ds/components/footer.css`
  - Rendered within layouts: `src/layouts/BaseLayout.astro` and `src/layouts/RecipeLayout.astro`
- **Dependencies:**
  - Depended on by: `src/layouts/BaseLayout.astro` (rendered as a core shell element immediately after `<main>`)
  - Consumer of: `package.json` (version string)
- **Constraints:**
  - **Styling isolation:** All site footer styling must live exclusively within `src/styles/ds/components/footer.css`. The use of inline styles, scoped components, or Tailwind utility-first overrides is prohibited.
  - **Variable encapsulation:** The release tag and copyright year must be generated dynamically from `package.json` and system runtime respectively. Hardcoded versions or years are prohibited.
  - **Link destinations:** The Discord invite link must point exactly to the canonical address `https://discord.gg/qaTsZSedC`.
  - **Structural navigation:** Navigation links are grouped into titled, clean vertical monospace sections utilizing CSS Grid layouts. Brand identity and analytics attribution belong in the brand column.
  - **Design token integration:** Sizing, spacing, border styles, container constraints, color tones, and hover transitions must utilize only the standard design system CSS variables (`var(--f-mono)`, `var(--c-bg-surface)`, `var(--c-border)`, and `var(--c-brand)`).

## Contract

### Definition of Done

- [ ] A linked Simple Analytics image badge appears beneath the brand description on standard and recipe pages, including with JavaScript disabled.
- [ ] The badge forces the light variant regardless of OS theme, with visitor counts disabled, attributes referrals to asdlc.io, and links to Simple Analytics in a new tab with opener isolation. Token-based vertical padding separates it from surrounding content while preserving left alignment.
- [ ] Image requests are anonymous and referrer-free, load lazily, and reserve intrinsic dimensions. Alt text identifies the provider; keyboard focus is visible.
- [ ] Badge fits at 320px and desktop widths without clipping or changing existing navigation, copyright, or release information.

- [ ] Implements a responsive, multi-column grid layout (1 column on mobile, 3 columns on desktop `min-width: 600px`).
- [ ] Incorporates the following active external links configured with `target="_blank" rel="noopener"`:
  - GitHub (`https://github.com/villetakanen/asdlc-io`)
  - Discord Server (`https://discord.gg/qaTsZSedC`)
  - MIT License (`https://github.com/villetakanen/asdlc-io/blob/main/LICENSE`)
- [ ] Incorporates the following active internal navigation links:
  - Recipes cookbook index (`/recipes`)
  - Blog / Writeups placeholder (`/blog`)
- [ ] Displays the `// ASDLC.io` brand logomark, dynamic copyright year, and the dynamic release tag `v{version}` from `package.json`.
- [ ] Conforms strictly to the design system palette (using elevation background, monospace uppercase typography, thin border separators, and brand orange transitions).
- [ ] Passes all linting, formatting, and type check gates (`pnpm check`).

### Regression Guardrails

- The site footer renders through both `BaseLayout.astro` and `RecipeLayout.astro`.
- The badge remains HTML-only, independent of analytics scripts and public dashboard access; account visibility and billing settings remain unchanged.
- Version rendering must always import from `package.json`.
- Link destinations must match their specified canonical URLs exactly.
- Link hover states must transition smoothly over `0.2s ease` to Safety Orange (`var(--c-brand)`).

### Scenarios

```gherkin
Scenario: Layout collapses on small screen viewports
  Given a visitor is viewing the site on a viewport narrower than 600px
  When they render the site footer
  Then the columns display in a single vertical column
  And the layout fits the viewport width

Scenario: Layout expands to three columns on desktop viewports
  Given a visitor is viewing the site on a viewport equal to or wider than 600px
  When they render the site footer
  Then the layout displays in a three-column horizontal grid of proportion "1.5fr 1fr 1fr"
  And the brand section resides in the first column

Scenario: Monospace hover link transitions are smooth
  Given a visitor is on any page of the site
  When they hover over any link in the site footer
  Then the link color transitions smoothly using "0.2s ease"
  And the active color shifts from "--c-text-secondary" to the safety orange brand indicator "--c-brand"
```

```gherkin
Scenario: Attribution is available without JavaScript
  Given JavaScript is disabled
  When a visitor opens the homepage, a KB article, or a recipe detail
  Then the shared footer contains one linked light analytics badge without a visitor count

Scenario: Badge image is unavailable
  Given the badge image request fails
  When a visitor reaches the footer
  Then descriptive alternative text and the provider link remain available
  And footer navigation and release information remain usable
```

## Resources

- [AL-105](https://linear.app/asdlc/issue/AL-105) — Badge implementation
- [Simple Analytics badge builder](https://www.simpleanalytics.com/badges#builder) — Provider requirements
- `src/components/Footer.astro` — Badge markup and provider URLs
- `src/components/ds-docs/docs/FooterDocs.astro` — Design-system documentation

- `src/layouts/BaseLayout.astro` — Layout shell
- `src/styles/ds/components/footer.css` — Global component styling
- `package.json` — Product metadata


