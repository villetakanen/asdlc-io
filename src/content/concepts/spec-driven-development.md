---
title: Spec-Driven Development
description: "Industry term for methodologies that define specifications before code—implemented in ASDLC through the Specs pattern."
tags:
  - Disambiguation
  - Methodology
  - Industry Term
relatedIds:
  - patterns/the-spec
  - practices/living-specs
  - concepts/vibe-coding
  - concepts/learning-loop
status: Live
lastUpdated: 2026-01-09
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
---

## Definition

**Spec-Driven Development (SDD)** is an umbrella term for methodologies that define specifications before implementation. The core inversion: instead of code serving as the source of documentation, the spec becomes the authority that code must fulfill.

> **Contrast:** For the anti-pattern SDD addresses, see [Vibe Coding](/concepts/vibe-coding).

## Industry Context

SDD emerged as a response to documentation decay in software projects. Traditional approaches treated specs as planning artifacts that diverged from reality post-implementation. Modern SDD treats specs as **living documents** co-located with code.

Kent Beck critiques SDD implementations that assume "you aren't going to learn anything during implementation." This is a valid concern—specs must evolve during implementation, not block it.

> [!WARNING]
> **The Figma Trap**
> A beautiful mockup is not a specification; it is a suggestion. Mockups typically demonstrate the "happy path" but hide the edge cases, error states, and data consistency strictures where production bugs live.
>
> **Never** treat a visual design as a complete technical requirement.

## ASDLC Implementation

ASDLC implements Spec-Driven Development through:

- **[The Specs Pattern](/patterns/the-spec)** — The structural blueprint defining what a spec contains (Blueprint + Contract) and how it relates to PBIs
- **[Living Specs Practice](/practices/living-specs)** — How to create, maintain, and evolve specs alongside code
- **[The Learning Loop](/concepts/learning-loop)** — The iterative cycle that addresses Beck's critique

For step-by-step guidance, see [Living Specs](/practices/living-specs).
