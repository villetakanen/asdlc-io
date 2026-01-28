---
title: "The Learning Loop"
description: "The iterative cycle between exploratory implementation and spec refinement, balancing vibe coding velocity with captured learnings."
tags:
  - Core
  - Methodology
  - Learning
relatedIds:
  - concepts/ooda-loop
  - concepts/vibe-coding
  - concepts/spec-driven-development
  - patterns/context-gates
  - patterns/ralph-loop
  - practices/living-specs
status: Live
lastUpdated: 2026-01-26
references:
  - type: "website"
    title: "Martin Fowler Fragment: January 8, 2026"
    url: "https://martinfowler.com/fragments/2026-01-08.html"
    author: "Martin Fowler"
    published: 2026-01-08
    accessed: 2026-01-09
    annotation: "Commentary on the tension between specification and learning during implementation."
  - type: "website"
    title: "Kent Beck on Spec-Driven Development"
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7413956151144542208/"
    author: "Kent Beck"
    published: 2026-01-08
    accessed: 2026-01-09
    annotation: "Critique emphasizing that specifications must accommodate learning during implementation."
  - type: "paper"
    title: "How AI is Transforming Work at Anthropic"
    url: "https://www.anthropic.com/research/how-ai-is-transforming-work-at-anthropic"
    author: "Saffron Huang et al."
    published: 2025-12-02
    accessed: 2026-01-09
    annotation: "Internal study showing how engineers balance AI velocity with understanding."
  - type: "website"
    title: "\"You Had One Job\": Why Twenty Years of DevOps Has Failed to Do it"
    url: "https://www.honeycomb.io/blog/you-had-one-job-why-twenty-years-of-devops-has-failed-to-do-it"
    author: "Charity Majors"
    published: 2026-01-22
    accessed: 2026-01-26
    annotation: "Industry validation of the Learning Loop—proposes identical 'deploy → observe → validate → learn → iterate' cycle as the AI-enabled future of software development."
---

## Definition

The Learning Loop is the iterative cycle between exploratory implementation and constraint crystallization. It acknowledges that understanding emerges through building, while ensuring that understanding is captured for future agent sessions.

Kent Beck critiques spec-driven approaches that assume "you aren't going to learn anything during implementation." He's right—discovery is essential. But pure vibe coding loses those discoveries. The next agent session starts from zero, re-discovering (or missing) the same constraints.

The Learning Loop preserves discoveries as machine-readable context, enabling compounding understanding across sessions.

## The Cycle

1. **Explore** — Vibe code to discover edge cases, performance characteristics, or API behaviors
2. **Learn** — Identify constraints that weren't obvious from requirements
3. **Crystallize** — Update the Spec with discovered constraints
4. **Verify** — Gate future implementations against the updated Spec
5. **Repeat**

Each iteration builds on the last. The spec grows smarter, and agents inherit the learnings of every previous session.

## OODA Foundation

The Learning Loop is an application of the [OODA Loop](/concepts/ooda-loop) to software development:

| Learning Loop Phase | OODA Equivalent |
|---------------------|------------------|
| **Explore** | Observe + Act (gather information through building) |
| **Learn** | Orient (interpret what was discovered) |
| **Crystallize** | Decide (commit learnings to persistent format) |
| **Verify** | Observe (confirm crystallized constraints via gates) |

The key insight: in software development, **Orient and Observe are interleaved**. You often can't observe relevant constraints until you've built something that reveals them. The Learning Loop makes this explicit by treating Explore as a legitimate phase rather than a deviation from the plan.

## Key Characteristics

### Not Waterfall

The Learning Loop explicitly rejects the waterfall assumption that all constraints can be known upfront. Specs are scaffolding that evolve, not stone tablets.

### Not Pure Vibe Coding

The Learning Loop also rejects the vibe coding assumption that documentation is optional. Undocumented learnings are lost learnings—the next agent (or human) will repeat the same mistakes.

### Machine-Readable Capture

Learnings must be captured in formats agents can consume: schemas, constraints in YAML, acceptance criteria in markdown. Natural language is acceptable but structured data is preferred.

> "The real capability—our ability to respond to change—comes not from how fast we can produce code, but from how deeply we understand the system we are shaping."
> — Unmesh Joshi

## Automation: The Ralph Loop

The Learning Loop describes an iterative cycle that typically involves human judgment at each phase. The [Ralph Loop](/patterns/ralph-loop) automates this cycle for tasks with machine-verifiable completion criteria:

| Learning Loop Phase | Ralph Loop Implementation |
|---------------------|---------------------------|
| **Explore** | Agent implements based on PBI/Spec |
| **Learn** | Agent reads error logs, test failures, build output |
| **Crystallize** | Agent updates progress.txt; commits to Git |
| **Verify** | External tools (Jest, tsc, Docker) confirm success |

When verification fails, Ralph automatically re-enters Explore with the learned context. The loop continues until external verification passes or iteration limit is reached.

**Key difference:** The Learning Loop expects human judgment in the Learn and Crystallize phases. The Ralph Loop requires that "learning" be expressible as observable state (error logs, test results) and "crystallization" be automatic (Git commits, progress files).

Ralph Loops work best when success criteria are machine-verifiable (tests pass, builds complete). For tasks requiring human judgment—ambiguous requirements, architectural decisions, product direction—the Learning Loop remains the appropriate model.

## ASDLC Usage

In ASDLC, the Learning Loop connects several core concepts:

- **OODA Loop** — The foundational cognitive model the Learning Loop implements
- **Vibe Coding** is the Explore phase (valid for prototyping and discovery)
- **Living Specs** capture the Crystallize phase
- **Context Gates** enforce the Verify phase
- **Ralph Loop** — Automated implementation for machine-verifiable tasks
- **PBIs** trigger iteration through the loop

Applied in:
- [OODA Loop](/concepts/ooda-loop) — The cognitive model foundation
- [Spec-Driven Development](/concepts/spec-driven-development) — Iterative refinement of specs
- [Living Specs](/practices/living-specs) — Maintenance of captured learnings
- [Context Gates](/patterns/context-gates) — Verification checkpoints
- [Ralph Loop](/patterns/ralph-loop) — Automated terminal implementation

## Anti-Patterns

| Anti-Pattern | Description |
|--------------|-------------|
| **Waterfall Specs** | Writing exhaustive specs before any implementation, assuming no learning will occur |
| **Ephemeral Vibe Coding** | Generating code without ever crystallizing learnings into specs |
| **Spec-as-Paperwork** | Updating specs for compliance rather than genuine constraint capture |
| **Post-Hoc Documentation** | Writing specs after implementation is complete, losing the iterative benefit |
