---
title: "Getting Started (Onboarding Page)"
status: "approved"
owner: "Ville Takanen"
archetype: "feature"
created: "2026-07-07"
tags: ["onboarding", "content-page", "cross-linking"]
linear: "AL-91"
---

# Feature: Getting Started (Onboarding Page)

> This spec was written in reverse/update mode against the shipped page
> (`src/pages/getting-started.md`) while triaging AL-91. The page predates any
> spec; AL-91 is the delta that exposed the missing state document. Bug fixes do
> not normally get specs — this one captures the *page contract* (structure +
> link integrity), not the one-off fix.

## Blueprint

### Context

`/getting-started` is the primary onboarding surface and the #2 page sitewide
(~542 views/mo). It is the first structured entry point for someone deciding
whether ASDLC applies to them. Its job is orientation, not depth: state what
ASDLC is, give a five-minute mental model, then route the reader into the
collections (concepts, patterns, practices) via curated learning paths.

Consumers: first-time human visitors and agents fetching the page for a
methodology overview.

### Architecture

A single Markdown page at `src/pages/getting-started.md` rendered through
`ProseLayout` (see the layout for the reserved h1). Content-first: prose,
tables, and cross-links only — no client JS.

The page is a **hub**, so its value is proportional to the reliability of its
outbound links. Every internal reference points to the *canonical collection
route* for the target article. The canonical route is determined by the
collection directory the article's source file lives in — e.g. Context Gates is
`src/content/patterns/context-gates.md`, so its canonical URL is
`/patterns/context-gates`. When the same article is reachable from more than one
path, all references use the collection-directory route and any alternate is a
redirect defined in `netlify.toml`, not a second link target.

Diagrams follow the project-wide dual-representation convention: a source
```mermaid``` block (source of truth) plus exactly one pre-rendered
`<figure class="mermaid-diagram">` referencing the SVG under `/mermaid/`. See
`specs/markdown-variants/spec.md` and the `pnpm diagrams` step in `CLAUDE.md`.

### Constraints

- Internal links are root-relative (`/collection/slug`). Published content
  carries no dev-server or absolute-host URLs (`http://localhost:*`,
  `https://asdlc.io/*`).
- Each mermaid diagram is represented by its source block plus a single
  rendered `<figure>`.
- Cross-references are bidirectional: an article the page routes to as a
  foundational next step should link back where the collection convention
  expects it.

## Contract

### Definition of Done
- [ ] Every internal link on the rendered page resolves 200 to a canonical
      collection URL (verified against the live page, not the source file).
- [ ] No link target contains stray brackets, percent-encoding artifacts, or an
      absolute/dev-server host.
- [ ] Each diagram appears exactly once; no raw mermaid source is visible to the
      reader.
- [ ] Copy is free of spelling errors ("ASDLC", "Context Gates" spelled
      correctly throughout); a full proofread pass finds no further typos.
- [ ] `pnpm check` passes.

### Regression Guardrails
- The three learning paths (A: philosophy, B: ship today, C: design the system)
  and the "Five-Minute Version" remain present — they are the page's routing
  contract.
- All references to a given article resolve to one canonical collection route;
  duplicate routes are redirects, never divergent link targets.
- Every mermaid diagram renders exactly once.
- Learning-path targets stay in sync with the collections: a path never links to
  an article that no longer exists at that route.

### Scenarios

**Scenario: All internal links resolve to canonical routes**
- Given: the rendered `/getting-started` page
- When: every internal link is followed
- Then: each returns 200 at its canonical collection URL, with no stray
  brackets, encoding artifacts, or absolute/dev-server hosts

**Scenario: A diagram renders once**
- Given: a section containing a mermaid diagram
- When: the page renders
- Then: the diagram appears exactly once and no raw mermaid source is visible

**Scenario: An article moves collections**
- Given: an article referenced by a learning path is moved to a different
  collection directory
- When: the page is next reconciled
- Then: every reference to it is updated to the new canonical route (and an
  `astro.config.mjs` redirect covers the old one if external links depend on it)

## Implementation Notes

- Page source: `src/pages/getting-started.md`.
- Canonical-route lookup: an article's route is its collection directory under
  `src/content/` + its slug. There is no `concepts/context-gates.md`; the file
  lives under `patterns/`, so `/patterns/context-gates` is canonical.
- Redirects (when an alternate path must keep resolving) live in `netlify.toml`.
  `/concepts/context-gates` → `/patterns/context-gates/` is already defined
  there, so the non-canonical form still resolves for external inbound links.
- Regenerate diagram SVGs with `pnpm diagrams` after editing any mermaid block.

## Resources

- Sibling page specs: `specs/practices-page/spec.md`, `specs/homepage/spec.md`.
- `specs/markdown-variants/spec.md` — content-page / diagram conventions.
- Linear AL-91 — the bug that triaged into this spec.
