---
name: critic
description: "Perform an adversarial review of the current uncommitted changeset, validating it against project contracts and architectural intent."
version: 1.0.0
---

# Critic — adversarial review of the changeset

Review the current uncommitted changeset against project contracts and architectural intent.

## Stance

Be skeptical. Reject changes that violate contracts, introduce regressions, or drift from architectural intent — even when they "work." Favor false positives over false negatives.

## Boundaries

- **In scope:** the uncommitted diff, the contracts it must satisfy, and the deterministic checks.
- **Out of scope:** fixing what you find (`dev`), committing (`ship`), assessing knowledge-base content quality (`assess`).

## Phase 1 — Load context

1. **Gather the changeset** — run `git diff` (staged + unstaged) to capture all pending changes.
2. **Identify affected systems** — from the diff, list the files, components, and layers touched.
3. **Load the relevant contracts:**
   - `CLAUDE.md` / `AGENTS.md` — operational boundaries and coding standards
   - `src/content/config.ts` — content schemas (if content files changed)
   - `src/styles/ds/` — design tokens and layout system (if styles changed)
   - `specs/` — any spec covering the changed domain
4. **Load the design system reference** — for UI or style changes, read `src/components/ds-docs/` for documented patterns.

## Phase 2 — Adversarial review

Evaluate every change against the loaded contracts. Check each dimension independently.

### A. Spec compliance
- Do the changes fulfill documented requirements, or drift from them?
- Any spec violations — missing requirements, violated constraints?
- Any work beyond scope (gold-plating, undocumented features)?

### B. Architectural integrity
- **No Tailwind** — any utility class names that smell like Tailwind but aren't defined in project CSS?
- **Type safety** — any `any` types, untyped parameters, or schema violations?
- **Component imports** — is every component used in `.astro` files explicitly imported?
- **Design tokens** — hardcoded colors, fonts, or spacing instead of CSS variables?
- **Content layer** — using the modern `glob()` loader, not legacy `type: 'content'`?

### C. Grid and layout
- Elements using `.breakout` or `.full` — are they in a context where the grid columns are available?
- Any `display: contents` side effects (DOM vs. visual tree selector mismatches)?
- Is subgrid usage correct?

### D. Content quality (if `.md`/`.mdx` changed)
- Does frontmatter match the schema in `config.ts`?
- Does the body start with `##` (h2), not `#` (h1)?
- Are cross-references bidirectional?
- Do mermaid blocks have matching `<figure>` elements?

### E. Regression risk
- Do the changes break patterns established elsewhere in the codebase?
- Any silent behavior changes (works, but wrong)?
- CSS specificity conflicts with existing rules?

### F. Security
- Any raw user input rendered without escaping?
- Are external URLs validated?
- Any secrets or credentials in the diff?

## Phase 3 — Verification

Run the project's deterministic checks:

1. `pnpm check` — type validation (0 errors required)
2. `pnpm lint` — Biome checks

Report the results. If either fails, include the errors in the review.

## Phase 4 — Verdict

Present findings as a structured review:

```
## Adversarial Review: [date]

### Verdict: PASS | PASS WITH NOTES | FAIL

### Changeset Summary
- Files changed: N
- Lines added/removed: +N / -N
- Systems touched: [list]

### Violations (if any)
For each violation:
1. **File:Line** — Description
   - **Contract:** Which rule or spec is violated
   - **Impact:** Why this matters
   - **Fix:** Specific remediation

### Observations (non-blocking)
Items that aren't violations but warrant attention.

### Checks
- Type check: PASS/FAIL
- Lint: PASS/FAIL
```

Verdict rules:

- **FAIL** — any ALWAYS rule or hard constraint from `CLAUDE.md` is violated, or `pnpm check` / `pnpm lint` fails.
- **PASS WITH NOTES** — only observations, or an ASK FIRST boundary was crossed without confirmation.
- **PASS** — the changeset is clean against all contracts.
