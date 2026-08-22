---
name: ship
description: "Lint, build, test, verify specs, commit, and push — one micro-commit to remote. Validates the working tree, verifies spec alignment, and creates an atomic save point."
argument-hint: "[commit message or leave blank for auto-generated]"
version: 1.0.0
---

# Ship — validate, commit, and push micro-commits

Validate the working tree, verify spec alignment, create a micro-commit, and push it to the remote — a single atomic "save point."

## Trigger

When a small, bounded unit of work is completed and needs to be shipped safely.

## Goal

Ensure the codebase is green (lint, build, test, typecheck), verify that changed code stays aligned with its specs, create a well-formed micro-commit, and push to the current remote branch.

## Boundaries

- **In scope:** running quality gates, verifying spec compliance, updating assessment retrospective, creating and pushing atomic commits.
- **Out of scope:** fixing lint/type/test failures (`dev`), authoring or amending specs (`spec`), creating Linear issues (`lead`).

## Pipeline

Execute these steps in order. **Stop immediately on any failure** — do not skip steps or push broken code.

### Step 1 — Inventory

Run in parallel:

- `git status` — identify changed files
- `git diff --staged` and `git diff` — understand the actual changes
- `git log --oneline -5` — read recent commit style

If there are no changes (clean working tree), stop and tell the user.

### Step 2 — Quality Gates

Run in parallel:

- `pnpm lint`
- `pnpm build`
- `pnpm test:run`
- `pnpm check`

All four must pass. On failure: report which gate failed with the error output and stop. Do not attempt to fix — that is the developer's job.

### Step 3 — Spec Verification

For every changed file, check whether a related spec exists under `specs/`. Use the file path and component name to locate relevant specs.

For each relevant spec found:
1. Read the spec's **Regression Guardrails** and **Definition of Done** sections.
2. Verify that the changes do not violate any guardrail.
3. Verify that the changes do not regress any Definition of Done item that was previously satisfied.
4. If the change **modifies behavior** covered by a spec, verify the spec was updated in the same changeset (same-commit rule).

**If a spec violation or missing spec update is found:** report it and stop. Do not commit.

**If no spec exists for the changed files:** that's fine — not all files have specs. Note it and proceed.

### Step 3.5 — Assessor Retrospective (Double-Loop Learning)

For all changed files identified in Step 1, check if there are any related assessments in `docs/assessments/ledger.jsonl` with `execution_status: "pending"`. An assessment is related if its slug, target files, or challenger title overlap with the files being committed.

If matching pending assessments are found:
1. **Prompt for Retro Feedback:** Ask the user if the implementation of the assessment succeeded, and ask for any unforeseen difficulties or lessons.
2. **Update the Ledger:** Update the corresponding JSON line in `docs/assessments/ledger.jsonl`:
   - `"execution_status"`: `"success"` (or `"failed"`)
   - `"execution_retro"`: A brief summary of the implementation results (e.g. build results, user feedback)
   - `"lessons_learned"`: Any specific lessons or guidelines surfaced.
3. **Consolidate Lessons:** Update `docs/assessments/lessons.md` with the new heuristics under `## Heuristics & Lessons`.
4. **Stage Retro Files:** Stage the updated `docs/assessments/ledger.jsonl` and `docs/assessments/lessons.md` so they are automatically included in the commit.

### Step 4 — Stage & Commit

1. Stage all relevant changed files with `git add` (specific files, not `-A`).
2. Draft a commit message:
   - Use conventional commit format: `type(scope): description`
   - Keep the subject line under 72 characters
   - Match the style of recent commits from Step 1
   - If the user provided a message via `$ARGUMENTS`, use it as the basis
3. Create the commit.

### Step 5 — Push

1. Check if the current branch tracks a remote. If not, push with `-u origin HEAD`.
2. Push to the remote.
3. Report success: branch name, commit hash (short), and commit message.

## Principles

- **Atomic save points** — Each `/ship` is one micro-commit. Small, reversible, traceable.
- **Green before push** — Never push code that fails any quality gate.
- **Specs are law** — Changed behavior must have a matching spec update. No silent drift.
- **No fixes in flight** — If something fails, stop and report. The developer fixes; then runs `/ship` again.
- **No force push** — Always a regular push. If the remote has diverged, stop and tell the user.

## Instructions

$ARGUMENTS
