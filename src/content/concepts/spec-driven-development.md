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

## ASDLC Usage

ASDLC implements Spec-Driven Development through:

- **[The Specs Pattern](/patterns/the-spec)** — The structural blueprint defining what a spec contains (Blueprint + Contract) and how it relates to PBIs
- **[Living Specs Practice](/practices/living-specs)** — How to create, maintain, and evolve specs alongside code
- **[The Learning Loop](/concepts/learning-loop)** — The iterative cycle that addresses Beck's critique
- **[Workflow as Code](/practices/workflow-as-code)** — Deterministic orchestration that enforces spec contracts programmatically

See also:
- [Vibe Coding](/concepts/vibe-coding) — The anti-pattern SDD addresses
- [Context Engineering](/concepts/context-engineering) — Structuring specs for agent consumption
