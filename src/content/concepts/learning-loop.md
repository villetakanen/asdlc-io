---
title: "The Learning Loop"
description: "The iterative cycle between exploratory implementation and spec refinement, balancing vibe coding velocity with captured learnings."
tags:
  - Core
  - Methodology
  - Learning
relatedIds:
  - concepts/vibe-coding
  - concepts/spec-driven-development
  - patterns/context-gates
  - practices/living-specs
status: Experimental
lastUpdated: 2026-01-09
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

## Key Characteristics

### Not Waterfall

The Learning Loop explicitly rejects the waterfall assumption that all constraints can be known upfront. Specs are scaffolding that evolve, not stone tablets.

### Not Pure Vibe Coding

The Learning Loop also rejects the vibe coding assumption that documentation is optional. Undocumented learnings are lost learnings—the next agent (or human) will repeat the same mistakes.

### Machine-Readable Capture

Learnings must be captured in formats agents can consume: schemas, constraints in YAML, acceptance criteria in markdown. Natural language is acceptable but structured data is preferred.

> "The real capability—our ability to respond to change—comes not from how fast we can produce code, but from how deeply we understand the system we are shaping."
> — Unmesh Joshi

## ASDLC Usage

In ASDLC, the Learning Loop connects several core concepts:

- **Vibe Coding** is the Explore phase (valid for prototyping and discovery)
- **Living Specs** capture the Crystallize phase
- **Context Gates** enforce the Verify phase
- **PBIs** trigger iteration through the loop

Applied in:
- [Spec-Driven Development](/concepts/spec-driven-development) — Iterative refinement of specs
- [Living Specs](/practices/living-specs) — Maintenance of captured learnings
- [Context Gates](/patterns/context-gates) — Verification checkpoints

## Anti-Patterns

| Anti-Pattern | Description |
|--------------|-------------|
| **Waterfall Specs** | Writing exhaustive specs before any implementation, assuming no learning will occur |
| **Ephemeral Vibe Coding** | Generating code without ever crystallizing learnings into specs |
| **Spec-as-Paperwork** | Updating specs for compliance rather than genuine constraint capture |
| **Post-Hoc Documentation** | Writing specs after implementation is complete, losing the iterative benefit |
