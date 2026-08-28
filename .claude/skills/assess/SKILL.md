---
name: assess
description: "Assess source material against the ASDLC Knowledge Base and produce an evidence-calibrated Content Review Report."
argument-hint: "[URL, text snippet, or prompt to assess]"
version: 1.1.0
---

# Assess — content engineering review

Assess source material against the ASDLC Knowledge Base and produce a traceable recommendation to amend, synthesize, create, reference, or reject content.

## Prime directive

> **Burden of proof.** The Knowledge Base is the incumbent baseline. New content must show that it is more accurate or useful; do not accept a challenger merely because it is new.

## Boundaries

- **In scope:** assessing source material, producing the canonical report, and appending its canonical ledger entry after human review.
- **Out of scope:** writing the article (`dev` after a decision), code review (`critic`), and traffic-driven refresh triage (`curator`).

## Review routing and ownership

Classify the initial risk during intake, state the rationale, and escalate whenever the evidence or scope warrants it.

| Risk class | Typical change | Minimum route |
|---|---|---|
| `Low` | Copy edit, citation repair, clarification without thesis change | One assessor or editor; deterministic gates; HITL stop |
| `Moderate` | New empirical claim, material boundary change, source synthesis | Primary assessment plus an independent challenge; HITL stop |
| `High` | Core-thesis reversal, taxonomy node, deprecation, governance or safety claim, mutable evaluator | At least two independent assessments and explicit HITL adjudication |

Escalate regardless of the starting class if sources conflict materially, confidence is `Low` or `Insufficient` while proposed wording is authoritative, the change affects high-centrality nodes, incumbent guidance may be superseded, or evaluator criteria would change.

For multiple assessments, each reviewer writes only its working draft at:

```text
docs/assessments/drafts/{assessment-id}/{reviewer-id}.md
```

Drafts are gitignored and reviewers do not read one another's conclusions before their initial extraction. Record the reviewer profile: harnesses used, roles that were distinct or collapsed, and shared inputs loaded. Only the designated canonical adjudicator may create `docs/assessments/{YYYY-MM-DD}-{slug}.md` or append its ledger entry.

## Phase 1 — Frame and load context

1. Identify the source, target article or proposed node, editorial question, claim types, constraints, and initial `risk_class` with rationale.
2. Search `src/content/` for related articles; read the matches, `concepts/agentic-sdlc`, `patterns/agentic-double-diamond`, and `AGENTS.md`.
3. Load `specs/content-articles/spec.md` and the relevant archetype. Read `docs/assessments/lessons.md` and scan ledger pivots/lessons for recurring corrections.
4. For empirical, consensus, or time-sensitive claims, create a search and selection record: question/date, sources searched, queries/limits, inclusion/exclusion criteria, included/excluded sources, inaccessible sources, and limitations.

## Phase 2 — Extract and appraise independently

1. Extract incumbent and challenger claims separately before classifying the delta.
2. Check regression, duplicate, conflict, context fit, boundary conditions, semantic precision, and falsifiability.
3. For every material claim added, changed, or bounded, record a claim–evidence row with claim ID, type, supporting or conflicting evidence, appraisal, confidence, and editorial operation.
4. Appraise evidence for the claim it supports. At Moderate risk, at least record method fit, directness, and precision; at High risk, also record provenance, bias, consistency, reproducibility, and currency when applicable.
5. Use only `High`, `Moderate`, `Low`, or `Insufficient` for confidence, with a rationale. Do not treat assessor agreement as correctness.

## Phase 3 — Synthesize and preserve disagreement

Choose a per-claim operation: retain, corroborate, bound, revise, supersede, split, or reject. Keep assessment verdict (`accepted`, `rejected`, `synthesized`, `disputed`), editorial strategy (`integrate`, `expand`, `combine`, `archive`, `log`), and evidence confidence as separate fields.

When assessors disagree, preserve each position, its supporting evidence, and the adjudication rationale. Do not resolve a material disagreement by vote count; route unresolved cases to the human reviewer.

## Phase 4 — Human in the loop

**STOP unconditionally before finalizing, publishing, or committing.** Present the verdict, strategy, graph impact, risk, uncertainty, disagreements, and action plan to the human reviewer. Incorporate the decision or override with its rationale. Risk determines the depth of review, never whether this stop occurs.

## Phase 5 — Canonical report and ledger

The canonical adjudicator writes `docs/assessments/{YYYY-MM-DD}-{slug}.md` using `docs/assessments/TEMPLATE.md`, outputs its result in chat, and then appends one JSON line to `docs/assessments/ledger.jsonl`.

New ledger entries must include `risk_class`, `confidence`, and `reviewer_profile`, alongside the established decision and execution fields. The ledger is append-only: never rewrite historical entries and never let independent reviewers append competing lines.

After writing the entry, propose a human-gated update to `docs/assessments/lessons.md` only for a generalizable or recurring lesson.

## Verification

Before handing off an assessment, verify source metadata, claim-to-citation accuracy, graph links and `relatedIds`, and run `pnpm check`. Run `pnpm diagrams`, `pnpm build`, `pnpm test:run`, or `/critic` when the approved change requires them.

## Task

$ARGUMENTS
