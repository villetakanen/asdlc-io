---
title: "Test-Driven Development"
description: "A software development discipline where tests are written before production code, using a Red-Green-Refactor cycle to drive design and ensure correctness."
tags:
  - Testing
  - Methodology
  - XP
  - Specification
relatedIds:
  - concepts/extreme-programming
  - concepts/behavior-driven-development
  - patterns/the-spec
  - patterns/context-gates
  - concepts/vibe-coding
  - concepts/ai-amplification
lastUpdated: 2026-07-06
status: "Live"
references:
  - type: "book"
    title: "Test Driven Development: By Example"
    author: "Kent Beck"
    publisher: "Addison-Wesley"
    published: 2002-11-01
    isbn: "978-0321146533"
    annotation: "The canonical formulation of TDD by its creator, introducing the Red-Green-Refactor cycle."
---

## Definition

Test-Driven Development (TDD) is a software development discipline in which automated tests are written before production code. The developer first writes a failing test that specifies desired behavior (Red), then writes the minimum code to make it pass (Green), then refactors to improve structure without changing behavior (Refactor).

Originally formalized by Kent Beck as a core practice of [Extreme Programming](/concepts/extreme-programming), TDD serves a dual purpose: it produces a regression safety net and, crucially, exerts design pressure — code that is hard to test is often poorly designed.

## Key Characteristics

### The Red-Green-Refactor Cycle

| Phase | Action | Purpose |
|-------|--------|---------|
| **Red** | Write a failing test | Define expected behavior before implementation |
| **Green** | Write minimum code to pass | Force focus on the specific behavior being specified |
| **Refactor** | Improve structure | Eliminate duplication without regressing |

The cycle is intentionally short — typically minutes. Long cycles indicate the scope of each step is too large.

### Test-First as Design Tool

TDD's primary value is not the test suite it produces — it is the design pressure it applies. Writing a test first forces the developer to consider the interface before the implementation, often revealing awkward dependencies and coupling early.

### The Iron Law

Classical TDD holds that no production code may be written without a failing test first. If existing tests pass, you must write a new failing test before making any change. This constraint is absolute in the traditional formulation.

## TDD in Agentic Systems

When an AI agent is the implementer rather than a human developer, TDD's mechanics change in a non-obvious way.

### The Self-Authored Test Problem

The Iron Law assumes the test author and the implementer are the same entity — a human who understands both what to test and what to build. When an agent applies TDD autonomously, it typically writes its own RED-phase test before fixing a bug. This creates two failure modes:

- **False confidence:** The agent writes a test that confirms its own (possibly incorrect) interpretation of the fix. The test passes, but the actual oracle test suite still fails.
- **Context displacement:** Writing a custom test consumes context and turns that could have been spent on diagnosis and the fix itself.

### The Agentic Fast Path

**Scope: bug fixes only, and only when a test already fails on the affected behavior.** New-feature work, and bug fixes with no existing coverage, are unaffected by this section — see [The Self-Authored Test Problem, Still Unsolved](#the-self-authored-test-problem-still-unsolved) below.

A single harness benchmark run (n=27 cases, 2026-06-29)[^1] tested a practical adaptation for this narrow case: **when existing tests already fail on the affected behavior, those tests are the RED phase — no new test is needed.** The agent skips test authorship and moves directly to fixing production code.

The argument for why this respects rather than weakens TDD: the RED phase exists to specify behavior, and an existing failing test already does that. Agents in this setting are implementers working against a pre-specified contract, not the authors of that contract — so writing a redundant self-authored test adds risk (false confidence, context spent on the wrong thing) without adding specification value. This reasoning holds most cleanly when the existing test is an oracle test written to the intended fix, as in the benchmark; it is a weaker guarantee against partial or incidental test coverage in an arbitrary legacy codebase.

The evidence for it is preliminary. In the one run so far, Haiku improved +14.8 pp over baseline with the fast path (95% CI: [0.0%, +33.3%]) — a CI whose lower bound touches zero, so this does not clear a conventional significance bar. Sonnet showed 0.0 pp — the fast path removed a prior regression but produced no net gain for the stronger model. Treat this as a working hypothesis motivated by one unreplicated experiment, not an established result.

[^1]: Internal benchmark run `native-harness-tdd-softened-2026-06-29`, Mats Ljunggren — 27 cases × 2 models (Haiku, Sonnet) on `native-harness-workflow`. Results not yet publicly published; available on request.

### The Self-Authored Test Problem, Still Unsolved

The fast path only removes risk from the one branch where it was never present: if an existing test already fails, no new test gets written, so there was nothing to self-confirm. Two situations remain fully exposed to the Self-Authored Test Problem described above:

- **Bug fixes with no existing coverage.** The agent must still write a new failing test — TDD's Iron Law applies in full — and it is the same agent that formed the (possibly wrong) diagnosis. The fast path does not touch this case.
- **All new-feature work.** By definition there is no existing failing test to reuse, so every new feature built with an agent hits the Self-Authored Test Problem on every cycle.

The reasoning behind the fast path — the RED phase is more trustworthy when it doesn't come from the implementer itself — points to a stronger fix for these two cases: have a different actor, one that has not seen the implementer's diagnosis or proposed fix, author the test from the bug report or spec alone. This decorrelates the test from the implementation, the same way pair/ping-pong TDD and BDD acceptance criteria authored by someone other than the coder do. In an agentic pipeline with a separate diagnosis/reproduction role, the natural handoff is for that role's reproduction artifact to become the RED-phase test, handed to the implementer as a fixed target rather than something it authors itself.

This is an open hypothesis, not a benchmarked result. Nothing in the fast-path experiment above varied who authors the test in these branches — it only tested skipping authorship when a test already existed. Whether a separate-actor RED phase actually improves outcomes for uncovered bug fixes or new-feature TDD is untested until it is run as its own experiment.

## ASDLC Usage

In the [Extreme Programming](/concepts/extreme-programming) mapping to ASDLC, TDD corresponds to two artifacts:

- **[The Spec](/patterns/the-spec)** — The spec's Contract section plays the role of the RED phase: it defines expected behavior before any implementation begins.
- **[Context Gates](/patterns/context-gates)** — Gate verification runs the test suite as the GREEN phase confirmation, providing a deterministic boundary that constrains probabilistic agent output.

TDD is not optional in an agentic factory — it is the mechanism by which human-defined specifications become machine-verifiable constraints. As noted in [AI Amplification](/concepts/ai-amplification), disciplined practices like TDD are amplified by AI: teams with strong test coverage move faster with agents; teams without it accumulate failures at machine speed.

**See also:**
- [Behavior-Driven Development](/concepts/behavior-driven-development) — extends TDD from unit behavior to system-level acceptance scenarios
- [Vibe Coding](/concepts/vibe-coding) — TDD is a primary defense against the structural debt that vibe coding accumulates
