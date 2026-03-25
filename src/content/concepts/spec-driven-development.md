---
title: Spec-Driven Development
description: "Methodology that defines specifications before implementation, treating specs as living authorities that code must fulfill."
tags:
  - Software Development
  - Documentation
  - Specifications
  - Living Documentation
relatedIds:
  - patterns/the-spec
  - practices/living-specs
  - concepts/vibe-coding
  - concepts/learning-loop
  - practices/workflow-as-code
  - concepts/model-driven-development
  - concepts/triple-debt-model
status: Live
lastUpdated: 2026-01-18
references:
  - type: "website"
    title: "Martin Fowler Fragment: January 8, 2026"
    url: "https://martinfowler.com/fragments/2026-01-08.html"
    author: "Martin Fowler"
    published: 2026-01-08
    accessed: 2026-01-09
    annotation: "Commentary on Anthropic research and Kent Beck's critique of spec-driven approaches."
  - type: "website"
    title: "Kent Beck on Spec-Driven Development"
    url: "https://www.linkedin.com/feed/update/urn:li:activity:7413956151144542208/"
    author: "Kent Beck"
    published: 2026-01-08
    accessed: 2026-01-09
    annotation: "Critique emphasizing that specifications must accommodate learning during implementation."
  - type: "website"
    title: "Dev Workflows as Code"
    url: "https://medium.com/nick-tune-tech-strategy-blog/dev-workflows-as-code-fab70d44b6ab"
    author: "Nick Tune"
    published: 2026-01-16
    accessed: 2026-01-18
    annotation: "Validates the core thesis: use real code for deterministic logic and LLMs only for tasks requiring intelligence."
  - type: "website"
    title: "Using spec-driven development with Claude Code"
    url: "https://heeki.medium.com/using-spec-driven-development-with-claude-code-4a1ebe5d9f29"
    author: "Heeki Park"
    published: 2026-03-01
    accessed: 2026-03-03
    annotation: "Practitioner case study demonstrating spec-driven development workflows and modular task breakdowns."
  - type: "website"
    title: "Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl"
    url: "https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html"
    author: "Birgitta Böckeler"
    published: 2025-01-21
    accessed: 2026-03-03
    annotation: "Defines the maturity levels of SDD (spec-first, spec-anchored, spec-as-source) and highlights MDD regression risks."
  - type: "website"
    title: "Spec-Driven Development"
    url: "https://dylanivanbrown.github.io/blog/2026/02/27/spec-driven-development/"
    author: "Dylan Brown"
    published: 2026-02-27
    accessed: 2026-03-09
    annotation: "Validates the dangers of the `spec-as-source` anti-pattern by highlighting how distancing engineers from detail causes 'Context Rot'."
---

## Definition

**Spec-Driven Development (SDD)** is an umbrella term for methodologies that define specifications before implementation. The core inversion: instead of code serving as the source of documentation, the spec becomes the authority that code must fulfill.

SDD emerged as a response to documentation decay in software projects. Traditional approaches treated specs as planning artifacts that diverged from reality post-implementation. Modern SDD treats specs as **living documents** co-located with code.

> **Contrast:** For the anti-pattern SDD addresses, see [Vibe Coding](/concepts/vibe-coding).

## Key Characteristics

### Living Documentation
Specs are not "fire and forget" planning artifacts. They reside in the repository alongside code and evolve with every change to the feature. This addresses the classic problem of documentation decay.

### Iterative Refinement
Kent Beck critiques SDD implementations that assume "you aren't going to learn anything during implementation." This is a valid concern—specs must evolve during implementation, not block it. The spec captures learnings so future sessions can act on them.

### Determinism Over Vibes
Nick Tune argues that orchestration logic should be "mechanical based on simple rules" (code) rather than probabilistic (LLMs). Specs define the rigid boundaries; code enforces the workflow; LLMs handle only the implementation tasks where flexibility is required.

### Visual Designs Are Not Specs

> [!WARNING]
> **The Figma Trap**
> A beautiful mockup is not a specification; it is a suggestion. Mockups typically demonstrate the "happy path" but hide the edge cases, error states, and data consistency rules where production bugs live.
>
> **Never** treat a visual design as a complete technical requirement.

### Levels of SDD Adoption

Industry usage of the term SDD varies in maturity. The following levels describe how deeply a team relies on the specification:

1.  **`spec-first`**: A specification is written upfront and used to generate the initial code. Afterward, the spec is abandoned, and developers return to editing code directly.
2.  **`spec-anchored`**: The spec is maintained throughout the feature's lifecycle inside the repository. It remains the source of truth for architectural intent and functional contracts (*This is the ASDLC target*).
3.  **`spec-as-source`**: Only the spec is ever edited by humans. The codebase is 100% generated by LLMs acting as compilers. 

## Anti-Patterns

### Spec-as-Source

While treating the specification as the *only* source code (`spec-as-source`) sounds appealing, ASDLC regards it as a dangerous anti-pattern. 

It is a regression to the failed paradigms of [Model-Driven Development (MDD)](/concepts/model-driven-development). MDD failed because models became as complex as code, yet remained inflexible. Replacing strict MDD code generators with LLMs introduces **non-determinism**. If you generate an entire system from a natural language spec, tiny changes in the spec (or an update to the underlying LLM) can cause widespread, unpredictable changes in the generated logic.

To maintain control, we must remain `spec-anchored`. We use specs to define intent and boundaries, but we retain **deterministic code** as the ultimate truth for logical execution.

## ASDLC Usage

ASDLC implements Spec-Driven Development through:

- **[The Specs Pattern](/patterns/the-spec)** — The structural blueprint defining what a spec contains (Blueprint + Contract) and how it relates to PBIs
- **[Living Specs Practice](/practices/living-specs)** — How to create, maintain, and evolve specs alongside code
- **[The Learning Loop](/concepts/learning-loop)** — The iterative cycle that addresses Beck's critique
- **[Workflow as Code](/practices/workflow-as-code)** — Deterministic orchestration that enforces spec contracts programmatically

See also:
- [Vibe Coding](/concepts/vibe-coding) — The anti-pattern SDD addresses
- [Context Engineering](/concepts/context-engineering) — Structuring specs for agent consumption
