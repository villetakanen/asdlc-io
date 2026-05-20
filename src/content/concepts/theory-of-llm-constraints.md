---
title: "Theory of LLM Constraints"
longTitle: "Theory of LLM Constraints: Why Coding-Side Acceleration Doesn't Deliver"
description: "Applying Goldratt's Theory of Constraints to AI delivery. Coding-side speed shifts bottlenecks downstream; the ASDLC answer is proportional verification from a minimal context-specific scaffold."
tags:
  - Theory
  - Productivity
  - Metrics
  - Bottlenecks
  - Industrialization
status: "Experimental"
publishedDate: 2026-05-18
lastUpdated: 2026-05-20
relatedIds:
  - concepts/agentic-sdlc
  - concepts/feedback-loop-compression
  - concepts/pr-slop
  - concepts/ai-amplification
  - patterns/context-gates
  - practices/adversarial-code-review
references:
  - type: "website"
    title: "Theory of LLM Constraints"
    author: "Mats Ljunggren"
    url: "https://www.linkedin.com/pulse/theory-llm-constraints-mats-ljunggren-qmzde/"
    published: 2026-05-12
    accessed: 2026-05-18
    annotation: "Applies Goldratt's Theory of Constraints to LLM-augmented delivery; synthesizes Faros, Thoughtworks, DORA, and METR telemetry into the bottleneck-shift thesis."
  - type: "website"
    title: "AI Productivity Paradox Report 2025"
    author: "Faros AI"
    url: "https://www.faros.ai/ai-productivity-paradox"
    published: 2025-12-01
    accessed: 2026-05-18
    annotation: "Telemetry across 10,000+ developers and 1,255 teams. 98% more PRs merged, 91% PR review time increase, 154% larger PRs, 9% more bugs."
  - type: "website"
    title: "How much faster can coding assistants really make software delivery?"
    author: "Thoughtworks"
    url: "https://www.thoughtworks.com/en-us/insights/blog/generative-ai/how-faster-coding-assistants-software-delivery"
    published: 2025-02-01
    accessed: 2026-05-18
    annotation: "Empirical decomposition: ~30% coding acceleration yields ~8% net delivery improvement because coding is roughly half of cycle time."
  - type: "website"
    title: "2025 DORA Report: State of AI-Assisted Software Development"
    author: "Google Cloud / DORA"
    url: "https://dora.dev/dora-report-2025/"
    published: 2025-10-01
    accessed: 2026-05-18
    annotation: "First official benchmarks for Deployment Rework Rate, the 5th DORA metric — the quality-leakage signal complementing PR Cycle Time."
  - type: "website"
    title: "Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity"
    author: "METR"
    url: "https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study"
    published: 2025-07-10
    accessed: 2026-05-18
    annotation: "RCT finding experienced open-source developers were 19% slower with AI tools while perceiving themselves as faster. Counter-evidence to perceived-acceleration claims."
---

## Definition

The **Theory of LLM Constraints** is the application of Eliyahu Goldratt's *Theory of Constraints* (TOC) to AI-assisted software delivery. Its central claim: because LLMs collapse the marginal cost of code generation, the system bottleneck structurally shifts from the **coding station** to **review, integration, and validation**. Local optimization at the coding station produces no net throughput improvement.

The thesis is empirically grounded. Thoughtworks reports ~30% coding-task acceleration yielding only ~8% net delivery improvement. Faros telemetry across 10,000+ developers reports 98% more PRs merged but a 91% increase in PR review time, with PRs 154% larger on average. METR's randomized controlled trial finds experienced open-source developers 19% slower with AI tools — while reporting they feel faster. The constraint moved. Most teams did not.

## The Diagnostic: Where the Constraint Moves

In a traditional SDLC, coding is one constraint among several. When LLMs accelerate it, three things happen at once:

- **Inventory build-up at review.** PR queues lengthen. Faros: 98% more PRs, 154% larger on average.
- **Quality leakage.** Faros: 9% more bugs per developer. DORA 2025 publishes the first official benchmarks for *Deployment Rework Rate* — the signal for work re-done after being declared complete.
- **Perceived velocity diverges from measured velocity.** METR's RCT finds experienced developers 19% *slower* with AI while reporting they feel faster. The dashboard and the timesheet disagree.

The constraint is no longer "how fast can the human type." It is "how fast can the system verify intent."

## Two System-Level Diagnostics

| Signal | What it measures | What it surfaces |
|---|---|---|
| **PR Cycle Time** | Throughput at the new constraint (review / integration) | Where inventory accumulates |
| **Deployment Rework Rate** (DORA 5th metric) | Quality leakage past gates | Where the constraint is being bypassed rather than respected |

Tracking only the first invites the Faster Horse: throughput goes up while rework hides the cost. Tracking both keeps the dialectic honest.

## The Dialectic: Classical TOC vs. ASDLC

Goldratt's Five Focusing Steps prescribe: **identify the constraint, exploit it, subordinate everything else, elevate it, repeat when it moves.** Applied naively to PR queue saturation, "elevate" means *add reviewer capacity, parallelize review, accelerate human approval*.

This is the [Faster Horse Fallacy](/concepts/agentic-sdlc). It optimizes the broken station rather than redesigning the line. The ASDLC accepts Goldratt's *diagnostic* and rejects his *classical cure*:

| Step | Classical TOC remediation | ASDLC structural remediation |
|---|---|---|
| Identify | Coding is no longer the constraint; review is. | Same. |
| Exploit | Squeeze every drop from existing reviewers. | Reduce review surface via [Micro-Commits](/practices/micro-commits) and [Specs](/patterns/the-spec). |
| Subordinate | Cap upstream PR generation to match review capacity. | Cap *unverified* generation; let verified generation run. |
| **Elevate** | **Add reviewers, parallelize review, AI-assist review.** | **Replace peer review with inspection stations** — [Adversarial Code Review](/practices/adversarial-code-review), [Context Gates](/patterns/context-gates), [Constitutional Review](/practices/constitutional-review-implementation). |
| Repeat | When review is no longer the constraint, find the next one. | Same — production observability via [Feedback Loop Compression](/concepts/feedback-loop-compression). |

The substitution at *Elevate* is the entire point. Adding reviewers is linear; structural verification is multiplicative. This is the same position [PR Slop](/concepts/pr-slop) takes from a different angle: "PR slop cannot be solved by reviewing harder."

## Minimal Scaffolding: Proportional Gates

A common prescriptive response to the constraint shift is **Scaffolding-First Development**: pre-building the validation surface (tests, NFRs, CI/CD) before generating feature code. This invokes Deming's "build quality in, don't inspect it in" at agent speed.

The ASDLC adopts a refined stance: **Minimal Scaffolding-First**.

For any given context (e.g., a TypeScript web application), there is a sensible, minimal scaffold that should always be used from the outset. This baseline includes essential constraints like compilation checks, type-checking, and basic syntactical linting.

However, beyond this minimal baseline, we must **avoid overtly adding scaffolding**. The ASDLC is opinionated on having the *minimal, and only the minimal*, scaffold to start. Additional gates should not be added as a ritual playbook; they must **earn their place by protecting against a specific, identified risk**.

A gate that does not sit on the constraint or protect against a named risk represents overproduction of validation inventory (unsubordinated capacity).

- **Minimal Baseline (Start here):** Context-specific, low-cost guards (e.g., type-checkers, basic compiler checks).
- **Proportional Additions (Earn their place):** Additional gates (e.g., visual regression tests, performance-budget checkers, custom security policies) are built only when a concrete failure mode is identified.

- A linter is a no-brainer: the cost is near-zero and the failure modes it catches (syntax errors, dead code, style drift) are broadly identified across all code.
- A type-checker is a no-brainer in a typed language for the same reason.
- A unit test suite for a payment-handling module earns its place the moment the module exists, because the risk surface is concrete and named.
- A design-system drift check earns its place once the design system is load-bearing and the divergence risk is concrete and named — not as default infrastructure.
- A performance-regression gate earns its place once the system has a named performance contract and an identified path to breaching it.

This is not anti-discipline. It is the recognition that **a gate that does not sit on the constraint costs more than it saves**, and that the constraint moves. Building gates is itself a form of work; the work is subject to the same proportionality TOC and Lean prescribe for any other process step. The discipline is in the analysis that identifies the risk, not in the ritual of building every gate the playbook names.

## ASDLC Usage

This concept gives the ASDLC's bottleneck-shift thesis a theoretical name (Goldratt's TOC) and an empirical anchor (Faros / Thoughtworks / DORA 2025 / METR). It positions the ASDLC's verification architecture as *the structural answer* to the constraint shift, distinguishing it from two regressive defaults the industry will otherwise reach for:

1. **Classical TOC elevation** — adding reviewer capacity. Optimizes the broken station.
2. **Strong Scaffolding-First** — pre-built canonical gates. Overproduces verification inventory.

The ASDLC answer is proportional structural verification starting from a context-specific minimal scaffold, introducing additional gates only as they earn their place.

See also: [Feedback Loop Compression](/concepts/feedback-loop-compression) (the OODA-framed view of the same shift), [PR Slop](/concepts/pr-slop) (the quality-leakage manifestation), [AI Amplification](/concepts/ai-amplification) (why bad processes amplify under AI), [Context Gates](/patterns/context-gates) (how proportional gates are layered in practice).
