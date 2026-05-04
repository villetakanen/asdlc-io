# Plan: `critic` Recipe — Adversarial Review Agent

**Goal:** Publish a reusable recipe article for the critic adversarial review pattern
that teams can adapt to their own project. The recipe teaches the pattern and ships a
portable SKILL.md template.

**Output file:** `src/content/recipes/critic.md`
**Status target:** `Experimental`

---

## Research summary

Source: `~/dev/research/critics/` — 14 files (README + 13 project inventories).

### The two critic families

The corpus shows two clearly distinct families of critic agent that share very little:

| Family | Projects | Core job |
|---|---|---|
| **Code critic** | asdlc-io, paper-cars, paper-cars-2, pelilauta-20, lys, myrrys-2025, roolipeli-info | Adversarial code review against specs and architectural contracts |
| **Content/voice critic** | laurilavanti, lavanti-2027, swipe (ux-critic), global (li-editor) | Validate against written voice/persona/style contract, produce numbered suggestions |

**Decision:** The recipe covers the **code critic** family only.
The content/voice critic pattern is a separate recipe (future work).

### Convergent invariants across all code critics

Every project in the code critic family, regardless of tech stack, converges on:

1. **Prime directive:** "Assume the code is broken until proven otherwise. Reject changes
   that violate contracts, even if they 'work.' Favor false positives over false negatives."
2. **Read-only constraint:** "Report; do not fix." Stated explicitly in every file.
3. **Argument scope flexibility:** empty (all uncommitted) | branch | commit range | file glob.
4. **Contract loading before diff reading:** Specs, AGENTS.md / CLAUDE.md,
   and architectural documents loaded *before* the diff is reviewed.
5. **Structured verdict output:** PASS / PASS WITH NOTES / FAIL with Violations / Notes / Gaps.

### Differentiating features worth mentioning in the recipe

These appear in subsets of projects and represent valid customisations:

- **Model authority** (pelilauta-20): Explicitly requiring a high-reasoning model.
  "This skill MUST be executed by a high-reasoning model... The adversarial lens requires
  deep contextual understanding of architectural trade-offs that lower-tier models may miss."
- **Issue-tracker integration** (myrrys-2025, roolipeli-info): $ARGUMENTS is a Linear
  issue ID; the critic fetches issue context first, then the diff.
- **Hard-constraint checklist** (lys): Project-specific binary checks before any review
  (e.g., zero runtime dependencies → detect any new `dependency` in `package.json`).
- **Reverse-spec pre-pass** (pelilauta-20): Running `reverse-spec` before `critic` to
  surface spec-vs-code drift before adversarial review.
- **Dual-tree mirroring** (paper-cars-2): Same critic in both `.agents/skills/` and
  `.claude/commands/` so it's reachable from both ASDLC tooling and Claude Code's slash picker.
- **Delegation pattern** (nordgrid-demo, futurice): Thin local wrapper that delegates to a
  `superpowers:requesting-code-review` plugin — shows that the critic can be a composition point.
- **Station + autonomy tags** (swipe): L2/L3 autonomy level and station tags baked into the skill.
- **UX/A11y critics** (swipe): Non-code critic variants in the same roster, but distinct skills.

### What the recipe template must remain silent on

The portable template should NOT prescribe:
- Specific file paths (`src/content/config.ts`, `pnpm check`)
- Which model to require (mention it as an option, not a default)
- Which issue tracker to integrate (mention as a customisation)

---

## Deliverables

| # | Deliverable | Path |
|---|---|---|
| 1 | Recipe article | `src/content/recipes/critic.md` |
| 2 | Inline skill template | Embedded code block in the recipe (no separate file) |

---

## Schema constraints (`recipeSchema`)

Frontmatter must satisfy `recipeSchema` in `src/content/config.ts`:

```
title            string, max 40 chars  → "Adversarial Code Review"
longTitle        string, max 120 chars → "The Critic Pattern: Adversarial Code Review Agent"
description      string, max 200 chars
difficulty       "Intermediate"
category         "Workflow"
estimatedMinutes 20
tools            ["Claude Code"]
tags             ["Adversarial Review", "Spec-Driven Development", "Code Quality", "Practices"]
status           "Experimental"
lastUpdated      2026-05-04
agentPrompt      ≤ 440 chars
relatedIds       string[] (slugs of related articles — verify before adding)
```

`agentPrompt` activation strategy: **ask for scope**, since empty-scope defaults to
all uncommitted changes and should be explicit. Keep under 440 chars.

---

## Article structure

Content must start with `##` (h2). The layout injects the h1.

```
## Overview
  What the pattern is, why adversarial review matters, when to invoke it.
  Introduce the prime directive ("assume broken until proven otherwise").
  Link to: Spec-Driven Development, Determinism over Vibes (if slugs exist).

## When to Use
  - Before merging a branch
  - After a large refactor, before a sprint review
  - When a PR touches a spec-covered domain
  - When another agent (e.g., @Dev) has just completed implementation

## How It Works
  The four-phase pipeline (conceptual, not mechanical):
    Phase 1 – Gather the diff (scope arguments)
    Phase 2 – Load contracts (AGENTS.md / CLAUDE.md, specs, architecture docs)
    Phase 3 – Review through three lenses
      Lens 1: Spec Compliance (DoD, scenarios, regression guardrails)
      Lens 2: Constitutional / Architectural (security, type safety, performance)
      Lens 3: Correctness & Edge Cases (logic bugs, dead code, regressions)
    Phase 4 – Produce the verdict (PASS / PASS WITH NOTES / FAIL)
  Keep this conceptual; the template handles mechanics.

## Skill Template
  Fenced ``` ```md ``` block with the full portable SKILL.md template.
  See "Skill template content" section below for what goes in it.

## Customising for Your Project
  Short prose + table of common customisations:
    - Spec directory: replace `specs/` with your path
    - Quality gate: replace `[YOUR_QUALITY_GATE_COMMAND]` with your CI/check command
    - File-path → spec-domain mapping table (the most project-specific part)
    - Model authority: optionally require a high-reasoning model (per pelilauta-20 pattern)
    - Issue-tracker integration: pass a Linear/GitHub issue ID as $ARGUMENTS (per myrrys pattern)
    - Hard-constraint checklist: add binary checks before review (per lys pattern)
    - Dual-tree mirroring: ship copies under both .agents/skills/ and .claude/commands/

## Principles
  Distilled from the corpus:
    - Bias toward false positives over false negatives
    - Cite the contract, not the vibe — every violation must reference a specific rule
    - Read-only: do not modify files, do not commit
    - Scope matters: review only what's in the diff, not pre-existing code
    - Contracts first, code second: load specs before reading the diff
    - Specificity over vagueness: "Line 42 uses `any`" not "types could be better"

## Boundaries
  Does: run git diff, read specs, read AGENTS.md, produce structured reports
  Does not: modify source files, commit, fix issues, provide code replacements

## Related
  Cross-links to related articles (verify slugs exist first).
```

---

## Skill template content (what goes in the code block)

The embedded SKILL.md template must be portable and self-contained:

```markdown
---
name: critic
description: "Perform an adversarial code review of the current changeset against specs
  and architectural contracts. Skeptical by design — assume broken until proven otherwise."
---

# Critic Agent (@Critic)

**Prime Directive:**
> Assume the code is broken until proven otherwise.
> Reject changes that violate contracts, even if they "work."
> Favor false positives over false negatives.
> **Do NOT fix issues. Report them.**

## Arguments

$ARGUMENTS — scope of the review:
- Empty → all staged and unstaged changes (default)
- Branch name → diff against main (e.g. `feat/auth`)
- Commit range → that range (e.g. `HEAD~3..HEAD`)
- File path / glob → only matching files

## Phase 1 — Gather the Diff

[Switch on $ARGUMENTS and run appropriate git command.]
If the diff is empty, tell the user there is nothing to review and stop.

## Phase 2 — Load Contracts

For each file in the diff, find and load:
- `AGENTS.md` or `CLAUDE.md` — constitutional constraints and coding standards
- `specs/[domain]/spec.md` — the closest matching spec (note gap if none exists)
- Any `ARCHITECTURE.md` — cross-cutting architectural contracts

If using an issue tracker, fetch the referenced issue for acceptance criteria.

## Phase 3 — Review Through Three Lenses

### Lens 1: Spec Compliance
- Does the code satisfy the spec's Definition of Done?
- Does it violate documented constraints or anti-patterns?
- Does it break Regression Guardrails?

### Lens 2: Constitutional / Architectural
- Does the code follow constraints from AGENTS.md / CLAUDE.md?
- Security issues: injection, XSS, exposed secrets, auth bypasses?
- Performance anti-patterns: N+1 queries, unbounded loads, memory leaks?
- Type safety: no `any`, no unsafe casts?
- Error handling: no silent failures, no swallowed exceptions?

### Lens 3: Correctness & Edge Cases
- Logic errors, off-by-one bugs, race conditions?
- Edge cases handled: empty inputs, null/undefined, boundary values?
- Dead code or unreachable branches?
- Regression risk to existing functionality?

## Phase 4 — Verdict

Run the project quality gate: `[YOUR_QUALITY_GATE_COMMAND]`

Produce a structured review:

---

## Adversarial Review — [scope]

**Contracts loaded:** [list]
**Files reviewed:** N
**Verdict:** PASS | PASS WITH NOTES | FAIL

### Violations
*(FAIL only — each must reference a specific file and line)*

#### [V1] [Category] — [Short description]
- **File:** `path/to/file.ts` Line NN
- **Contract broken:** [spec clause or architectural principle]
- **Impact:** [Why this matters]
- **Remediation:** [Fix direction — no code rewrites]

### Notes
*(PASS WITH NOTES or FAIL — non-blocking observations)*

### Gaps
*(Spec or documentation gaps discovered during review)*

---

**FAIL** — at least one violation found.
**PASS WITH NOTES** — no violations; observations worth raising.
**PASS** — clean against all contracts.

## Customisation

Replace these placeholders with project-specific values:

| Placeholder | What to replace with |
|---|---|
| `specs/[domain]/` | Your spec directory |
| `[YOUR_QUALITY_GATE_COMMAND]` | e.g. `pnpm check && pnpm lint` |
| File-path → spec-domain mapping | Your source layout |
```

---

## Cross-reference requirements

Per AGENTS.md: cross-references must be bidirectional.

| This article should link to | Verify slug exists | Back-link action |
|---|---|---|
| `concepts/spec-driven-development` | `ls src/content/concepts/` | Add `critic` to `relatedIds` |
| `concepts/determinism-over-vibes` | same | Add `critic` to `relatedIds` |
| `recipes/spec-engineer` | already confirmed ✓ | Add `critic` to `relatedIds` |

If a slug doesn't exist, omit the link rather than creating a dead reference.

---

## Implementation steps (for @Dev)

1. **[ ] Verify related slugs** — `ls src/content/concepts/` and check exact filenames.

2. **[ ] Draft `src/content/recipes/critic.md`** following the article structure above.
   - Frontmatter first, validate field constraints mentally before writing content.
   - Embed the portable SKILL.md template in a fenced ` ```md ` block.
   - `agentPrompt` ≤ 440 chars; ask for scope rather than auto-starting.

3. **[ ] Add back-links** to confirmed related articles (edit `relatedIds` in their frontmatter).

4. **[ ] Run quality gates:**
   ```
   pnpm check
   pnpm lint
   pnpm build
   ```

5. **[ ] /ship** once gates are green.

---

## What this recipe is NOT

- Not the project-local critic skill (`.agents/skills/critic/SKILL.md`). That file stays.
- Not coverage for content/voice critics (laurilavanti, lavanti-2027 patterns) — separate recipe.
- Not a tutorial on manual code review technique.
- Does not require new Astro components, routes, or schema changes.

---

## Open questions

1. **Content/voice critic recipe** — The research reveals a distinct second family (persona-fit,
   SEO/AEO, voice contract critics). Worth a separate recipe. Capture as a future PBI?

2. **`recipeTool` enum** — Currently only `"Claude Code"`. The lys, paper-cars, and myrrys
   critics work in any ASDLC-compliant agent environment. If we want to signal that, the enum
   needs extending — ask before touching `config.ts`.

3. **UX/A11y critic** — swipe shows `ux-critic` and `a11y-auditor` as distinct critic
   stations. These could be a third recipe variant ("non-code critic"). Defer?
