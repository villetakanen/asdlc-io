---
title: "Adversarial Code Review"
longTitle: "The Critic Pattern: Adversarial Code Review Agent"
description: "Ship a Critic Agent that reviews code against specs and architectural contracts. Assume broken until proven otherwise. Report; never fix."
difficulty: "Intermediate"
category: "Workflow"
estimatedMinutes: 20
tools: ["Claude Code"]
tags:
  - "Adversarial Review"
  - "Spec-Driven Development"
  - "Code Quality"
  - "Agent Personas"
status: "Experimental"
lastUpdated: 2026-05-04
agentPrompt: "You are a Critic Agent. Perform an adversarial code review of the current changeset against specs and architectural contracts. Ask: what scope? (empty = all uncommitted, branch name, commit range, or file glob). Report violations — do not fix."
relatedIds:
  - "patterns/adversarial-code-review"
  - "practices/adversarial-code-review"
  - "recipes/spec-engineer"
  - "concepts/spec-driven-development"
---

## Overview

A **Critic Agent** is a dedicated agent whose only job is to reject code — to find what the Builder missed. It is adversarial by design, not by accident.

The core insight driving this pattern is that the model that wrote the code is compromised. It knows what it built. It will rationalize. Running a review pass in the same session that produced the implementation provides minimal independent validation — the model is biased toward confirming its own work.

The Critic breaks this by operating from a different stance and, where possible, a fresh context window. It reads the [Spec](/patterns/the-spec) before the diff. It assumes the code is broken until the evidence proves otherwise. It outputs a structured verdict — **PASS**, **PASS WITH NOTES**, or **FAIL** — with violations that cite specific contracts, not vibes.

See the full pattern: [Adversarial Code Review](/patterns/adversarial-code-review).

## When to Use

- Before merging a branch into main
- After implementation is complete, before human review
- When a PR touches a spec-covered feature domain
- After a large refactor or migration
- When a spec has recently changed and you want to catch drift

Skip this when the change is a trivial documentation fix or a single-line config change with no behavioral effect.

## How It Works

The workflow has four phases, regardless of project or toolchain.

### Phase 1 — Gather the diff

The Critic needs to know what changed. Accept the scope as an argument:

| Argument | Git command |
|---|---|
| Empty (default) | `git diff` + `git diff --cached` |
| Branch name | `git diff main...<branch>` |
| Commit range | `git diff HEAD~3..HEAD` |
| File path / glob | `git diff -- <path>` + `git diff --cached -- <path>` |

If the diff is empty, there is nothing to review. Stop.

### Phase 2 — Load contracts

Before reading the diff, load the authoritative sources:

- **`AGENTS.md` / `CLAUDE.md`** — constitutional constraints, coding standards, architectural invariants
- **`specs/<domain>/spec.md`** — the closest matching spec for each changed file
- **`ARCHITECTURE.md`** — cross-cutting architectural contracts, if present

If an issue-tracker ID is available, fetch the acceptance criteria for the referenced issue. If no spec exists for a changed area, record this as a **gap** — not a violation.

The Critic reads the contracts *before* the diff. This ordering matters: it prevents the Critic from rationalizing the code after seeing it.

### Phase 3 — Review through three lenses

Every changed file is evaluated independently against three review lenses:

**Lens 1: Spec Compliance**
Does the code fulfill the spec's Definition of Done? Does it violate documented constraints? Does it break Regression Guardrails? Are there behavioral divergences from what the spec describes?

**Lens 2: Constitutional / Architectural**
Does the code follow constraints from `AGENTS.md` / `CLAUDE.md`? Security issues (injection, XSS, exposed secrets, auth bypasses)? Performance anti-patterns (N+1 queries, unbounded loads, memory leaks)? Type safety (no `any`, no unsafe casts)? Error handling (no silent failures)?

**Lens 3: Correctness & Edge Cases**
Logic errors, off-by-one bugs, race conditions? Edge cases handled (empty inputs, null/undefined, boundary values)? Dead code or unreachable branches? Regression risk to existing functionality?

### Phase 4 — Produce the verdict

Run the project quality gate, then output a structured verdict:

```
## Adversarial Review — [scope]

**Contracts loaded:** [list]
**Files reviewed:** N
**Verdict:** PASS | PASS WITH NOTES | FAIL

### Violations
(FAIL only — each must cite a specific file and line)

#### [V1] [Category] — [Short description]
- **File:** `path/to/file.ts` Line NN
- **Contract broken:** [which spec clause or architectural principle]
- **Impact:** [why this matters]
- **Remediation:** [fix direction — no code rewrites]

### Notes
(PASS WITH NOTES or FAIL — non-blocking observations)

### Gaps
(Spec or documentation gaps discovered during review)
```

**FAIL** — at least one violation found.
**PASS WITH NOTES** — no violations; observations worth raising.
**PASS** — clean against all contracts.

## Skill Template

Drop this into `.agents/skills/critic/SKILL.md` or `.claude/commands/critic.md` and customise the placeholders:

````md
---
name: critic
description: "Perform an adversarial code review of the current changeset against specs
  and architectural contracts. Assume broken until proven otherwise. Report; do not fix."
---

# Critic Agent (@Critic)

**Prime Directive:**
> Assume the code is broken until proven otherwise.
> Reject changes that violate contracts, even if they "work."
> Favor false positives over false negatives.
> **Do NOT fix issues. Report them.**

## Arguments

`$ARGUMENTS` — scope of the review:
- Empty → all staged and unstaged changes (default)
- Branch name → diff against main (e.g. `feat/auth`)
- Commit range → that range (e.g. `HEAD~3..HEAD`)
- File path / glob → only matching files

## Phase 1 — Gather the Diff

Based on `$ARGUMENTS`, run the appropriate git command.
If the diff is empty, tell the user there is nothing to review and stop.

## Phase 2 — Load Contracts

For each changed file, load:
- `AGENTS.md` or `CLAUDE.md` — constitutional constraints and coding standards
- `[YOUR_SPEC_DIR]/<domain>/spec.md` — the closest matching spec (note gap if none exists)
- `ARCHITECTURE.md` — cross-cutting contracts, if present

If using an issue tracker, fetch the referenced issue for acceptance criteria.
Load contracts **before** reading the diff.

## Phase 3 — Review Through Three Lenses

### Lens 1: Spec Compliance
- Does the code satisfy the spec's Definition of Done?
- Does it violate documented constraints or anti-patterns?
- Does it break Regression Guardrails?

### Lens 2: Constitutional / Architectural
- Does the code follow constraints from AGENTS.md / CLAUDE.md?
- Security: injection, XSS, exposed secrets, auth bypasses?
- Performance: N+1 queries, unbounded loads, memory leaks?
- Type safety: no `any`, no unsafe casts?
- Error handling: no silent failures, no swallowed exceptions?

### Lens 3: Correctness & Edge Cases
- Logic errors, off-by-one bugs, race conditions?
- Edge cases handled: empty inputs, null/undefined, boundary values?
- Dead code or unreachable branches?
- Regression risk to existing functionality?

## Phase 4 — Verdict

Run: `[YOUR_QUALITY_GATE_COMMAND]`

Produce the structured verdict:

---

## Adversarial Review — [scope]

**Contracts loaded:** [list]
**Files reviewed:** N
**Verdict:** PASS | PASS WITH NOTES | FAIL

### Violations
*(FAIL only — each must cite a specific file and line)*

#### [V1] [Category] — [Short description]
- **File:** `path/to/file.ts` Line NN
- **Contract broken:** [spec clause or architectural principle]
- **Impact:** [why this matters]
- **Remediation:** [fix direction — no code rewrites]

### Notes
*(PASS WITH NOTES or FAIL — non-blocking observations)*

### Gaps
*(Spec or documentation gaps discovered during review)*

---

**FAIL** — at least one violation found.
**PASS WITH NOTES** — no violations; observations worth raising.
**PASS** — clean against all contracts.

## Customisation

| Placeholder | Replace with |
|---|---|
| `[YOUR_SPEC_DIR]` | Your spec directory, e.g. `specs/` or `docs/specs/` |
| `[YOUR_QUALITY_GATE_COMMAND]` | e.g. `pnpm check && pnpm lint`, `make ci`, `./scripts/run_checks.sh` |
| File-path → spec-domain mapping | Add a table mapping your source paths to spec paths |
````

## Customising for Your Project

The template is deliberately sparse. Here are the customisations teams apply most often:

**Spec directory.** Replace `[YOUR_SPEC_DIR]` with wherever your specs live — `specs/`, `docs/specs/`, `design/contracts/`, or a flat `SPEC.md` at the root.

**Quality gate.** Replace `[YOUR_QUALITY_GATE_COMMAND]` with the command that runs your type checks and linter. Run it at the start of Phase 4, before producing the verdict — a failing quality gate is itself a violation.

**File-path → spec-domain mapping.** The most project-specific part. Add a table like:

```
src/auth/**         → specs/auth/spec.md
src/db/**           → specs/data-layer/spec.md
packages/ui/**      → specs/design-system/spec.md
```

Without this, the Critic has to guess which spec applies. With it, context loading becomes deterministic.

**Model authority.** For large diffs or complex architectural domains, require a high-reasoning model explicitly. Add to the frontmatter or preamble: *"This skill must be executed by a high-reasoning model. The adversarial lens requires deep contextual understanding that smaller models may miss."*

**Issue-tracker integration.** Pass a Linear or GitHub issue ID as `$ARGUMENTS`. The Critic fetches the issue's acceptance criteria first, then the diff — this grounds the review in the original intent, not just the current spec.

**Hard-constraint checklist.** For projects with binary invariants (zero runtime dependencies, file size limits, no specific import patterns), add an explicit checklist before the three-lens review. Binary checks are faster and more reliable than probabilistic ones.

**Dual-tree mirroring.** If your project uses both an `.agents/skills/` roster and `.claude/commands/`, ship identical copies in both trees. The skill content is the same; the tree location determines which tooling can discover it.

## Principles

**Bias toward false positives.** It is cheaper to re-check clean code than to ship a bug. When in doubt, flag it.

**Cite the contract, not the vibe.** Every violation must reference a specific spec clause, architectural principle, or constitutional rule. "This looks wrong" is not a violation.

**Read-only.** The Critic does not modify source files. It does not commit. It does not produce replacement code blocks. It reports.

**Contracts before code.** Load the spec before reading the diff. A Critic that reads the code first will rationalize it against the spec, not validate it.

**Scope discipline.** Review only what is in the diff. Do not critique pre-existing code unless the change makes it measurably worse.

**Flag spec gaps.** If you cannot determine whether code is correct because no spec exists, or because the spec is ambiguous, that is a finding — record it under Gaps.

## Boundaries

The Critic:
- **Does** run `git diff` and read the changeset
- **Does** read specs, `AGENTS.md`, and architectural documents
- **Does** run the quality gate command
- **Does** produce structured findings

The Critic does **not**:
- Modify any source file
- Commit or stage changes
- Produce replacement code blocks
- Review pre-existing code outside the diff scope

## Related

- [Adversarial Code Review](/patterns/adversarial-code-review) — The architectural pattern this recipe implements
- [Adversarial Code Review Practice](/practices/adversarial-code-review) — The practice-level guide with step-by-step process
- [Spec Engineer](/recipes/spec-engineer) — The companion recipe for writing and maintaining specs the Critic validates against
- [Spec-Driven Development](/concepts/spec-driven-development) — The methodology that makes adversarial review meaningful
