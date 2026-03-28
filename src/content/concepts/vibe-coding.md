---
title: "Vibe Coding"
description: "Natural language code generation without formal specs—powerful for prototyping, problematic for production systems."
tags: ["Disambiguation", "AI", "Code Quality", "Anti-Pattern"]
status: "Live"
relatedIds: ["concepts/spec-driven-development", "patterns/context-gates", "concepts/levels-of-autonomy", "concepts/triple-debt-model"]
publishedDate: 2025-01-05
lastUpdated: 2026-03-28
references:
  - type: "website"
    title: "Humans and Agents in Software Engineering Loops"
    url: "https://martinfowler.com/articles/exploring-gen-ai/humans-and-agents.html"
    author: "Kief Morris"
    published: 2026-03-04
    accessed: 2026-03-18
    annotation: "Morris's 'Humans Outside the Loop' critique validates the ASDLC position that unstructured agent delegation creates technical debt. Published on martinfowler.com."
  - type: "podcast"
    title: "Claude Code and the Future of AI-Assisted Development"
    url: "https://peterman.fm/boris-cherny"
    author: "Boris Cherny"
    publisher: "The Peterman Podcast"
    published: 2025-12-01
    annotation: "Claude Code creator's framework for disciplined AI-assisted development, discussing the balance between automation and rigor."
  - type: "website"
    title: "Forrester Research on AI-Generated Code Technical Debt"
    author: "Forrester Research"
    published: 2024-01-01
    accessed: 2026-01-08
    annotation: "Technical debt predictions and analysis for AI-generated code in production systems."
  - type: "website"
    title: "Google's AI-Generated Code Adoption Metrics"
    author: "Google"
    published: 2024-01-01
    accessed: 2026-01-08
    annotation: "Industry data on Google's 30% AI-generated code adoption rate and analysis of copy-paste versus refactor patterns."
  - type: "paper"
    title: "How AI is Transforming Work at Anthropic"
    url: "https://www.anthropic.com/research/how-ai-is-transforming-work-at-anthropic"
    author: "Saffron Huang et al."
    published: 2025-12-02
    accessed: 2026-01-09
    annotation: "Research showing engineers vibe code themselves into corners, with cleanup overhead exceeding initial velocity."
  - type: "website"
    title: "The Mythical LLM: Why Rumors of the Death of Software are Premature"
    author: "Dan Cripe"
    published: 2026-01-20
    url: "https://www.dancripe.com/ai-coding-enterprise-saas-reality-check/"
    accessed: 2026-01-24
    annotation: "Enterprise architect's critique of vibe coding for production systems. Documents spending 100M tokens on architectural drift fixes and argues the quality gap is 'fundamental to how current LLMs work.'"
  - type: "website"
    title: "Calm Coding: The Workflow That Makes Vibecoding Survivable"
    url: "https://oc2sf.com/blog/calm-coding-vibecoding-survivable.html"
    author: "Jan (OC2SF)"
    published: 2026-02-01
    accessed: 2026-02-04
    annotation: "Governance framework positioning 'Calm Coding' as the disciplined counterpart to vibecoding. Introduces 'The Hype-Man Problem' — LLMs enabling bad decisions with high conviction. Key quote: 'Velocity without direction isn't speed. It's drift.'"
  - type: "website"
    title: "Software Craftsmanship in the AI Era"
    author: "Codurance"
    url: "https://www.codurance.com/publications/software-craftsmanship-in-the-ai-era"
    published: 2024-05-23
    accessed: 2026-02-12
    annotation: "Analysis of how speed without discipline creates 'legacy code in record time,' and why AI increases rather than decreases the need for TDD and solid design principles."
  - type: "paper"
    title: "From Technical Debt to Cognitive and Intent Debt: Rethinking Software Health in the Age of AI"
    url: "https://arxiv.org/abs/2603.22106"
    author: "Margaret-Anne Storey"
    published: 2026-03-23
    accessed: 2026-03-25
    annotation: "Defines the Triple Debt Model — Technical, Cognitive, and Intent Debt — positioning vibe coding as the primary generator of all three debt types."
  - type: "paper"
    title: "Thinking-Fast, Slow, and Artificial: How AI is Reshaping Human Reasoning and the Rise of Cognitive Surrender"
    url: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6097646"
    author: "Shaw, S. D. and Nave, G."
    published: 2026-01-01
    accessed: 2026-03-25
    annotation: "Defines Cognitive Surrender — adopting AI outputs with minimal scrutiny, bypassing both intuition and deliberate reasoning. The psychological mechanism behind vibe coding's failure modes."
---

## Definition

Vibe Coding is the practice of generating code directly from natural language prompts without formal specifications, schemas, or contracts. Coined by Andrej Karpathy, the term describes an AI-assisted development mode where engineers describe desired functionality conversationally ("make this faster," "add a login button"), and the LLM produces implementation code.

This approach inverts traditional software engineering rigor: the specification emerges *after* the code, if at all. Developers describe intent and trust the model to infer the details.

## Key Characteristics

- **Natural language as input.** Functionality is described conversationally, not constrained by schemas or typed interfaces.
- **Immediate feedback loop.** Describe the behavior, see the code, run it, iterate. Code appears almost as fast as you can articulate what you want.
- **Probabilistic output.** The LLM infers implementation details — error handling strategies, validation rules, concurrency models — from training data, not from project-specific contracts.
- **Extreme velocity.** Engineers report 2-10x faster feature delivery for greenfield work. At Anthropic, 80-90% of Claude Code's codebase is written by Claude Code itself, with a 70% productivity increase per engineer. At Google, approximately 30% of code committed in 2024 was AI-generated.

When a feature that previously took three days can be scaffolded in thirty minutes, the economic pressure to adopt vibe coding becomes overwhelming. For throwaway scripts, MVPs, and rapid exploration, this workflow is transformative.

## Known Caveats

The velocity advantage collapses when code must be maintained, extended, or integrated into production systems. Storey (2026) frames vibe coding as the primary generator of all three debt types in the [Triple Debt Model](/concepts/triple-debt-model) — Technical Debt in code, Cognitive Debt in people, and Intent Debt in artifacts.

### Debt Accumulation

Forrester Research predicts that by 2026, 75% of technology leaders will face moderate-to-severe technical debt directly attributable to AI-generated code. Code generated from vague prompts encodes vague assumptions. Future maintainers inherit code without contracts and must reverse-engineer intent from implementation.

2024 marked the first year in industry history where copy-pasted code exceeded refactored code — a direct symptom of vibe coding. When generating fresh code is faster than understanding existing code, engineers default to regeneration over refactoring. The result, as Codurance notes, is "legacy code in record time": systemic duplication across fifteen slightly different implementations, none validated against a shared contract.

> [!NOTE]
> **The 100 Million Token Lesson**
>
> Dan Cripe, a 25-year enterprise software veteran, documented spending 100 million tokens on a frontier model attempting to fix its own architectural mistakes — not syntax errors, but fundamental design pattern violations. His diagnosis: "LLMs are pattern matchers, not architects."

### Silent Drift

LLMs make undocumented assumptions about error handling, validation, and concurrency. The code passes tests (if tests exist), but violates implicit architectural contracts. Over time, the system drifts toward inconsistency — different modules make different assumptions about the same concepts. Without deterministic constraints, LLMs trend toward generic solutions that lack the domain-specific optimizations and architectural decisions that distinguish production systems from prototypes.

> **"Speed is seductive. Maintainability is survival."**
> — Boris Cherny, *The Peterman Podcast* (December 2025)

### Cognitive Surrender

Shaw & Nave (2026) identify the psychological mechanism behind these failure modes: **Cognitive Surrender** — adopting AI outputs with minimal scrutiny, bypassing both intuition and deliberate reasoning entirely.

This is distinct from healthy [Cognitive Offloading](/practices/context-offloading), where a developer strategically delegates rote tasks to free mental capacity for higher-level reasoning. In Cognitive Surrender, the cost of evaluation appears to exceed the cost of acceptance, and the developer adopts generated code without understanding its implications.

The resulting debt is invisible: the developer's mental model of the system erodes with each surrendered decision. Over time, they lose the ability to reason about architectural trade-offs, diagnose subtle failures, or externalize the constraints that should govern future changes. Cognitive Surrender is the mechanism that accelerates all three debt types simultaneously.

### The Debt Spiral

Anthropic's internal research found that engineers who spend *more* time on Claude-assisted tasks often do so because they "vibe code themselves into a corner" — generating code without specs until debugging and cleanup overhead exceeds the initial velocity gains. Vibe coding is fast until it isn't, and by then the context needed to fix issues was never documented.

## Applications

Vibe coding is effective in bounded contexts where maintainability is not a constraint:

- **Rapid Prototyping** — Validating product hypotheses where speed of iteration outweighs code quality.
- **Throwaway Scripts** — One-off data migrations, analysis scripts, and temporary tooling with no maintenance burden.
- **Learning and Exploration** — Experimenting with new APIs, frameworks, or architectural patterns for immediate feedback.
- **Greenfield MVPs** — Early-stage products prioritizing speed-to-market, with planned transition to deterministic development.

## ASDLC Usage

In ASDLC, vibe coding is a legitimate operational mode for bounded contexts (exploration, prototyping, throwaway code). For production systems, ASDLC mandates a transition to deterministic development:

- Vibe coding is **steering** (probabilistic guidance via prompts)
- Production requires **determinism** (schemas, tests, typed interfaces)
- Both are necessary: prompts steer the agent; schemas enforce correctness

Related:
- [Spec-Driven Development](/concepts/spec-driven-development) — The production-grade alternative to vibe coding
- [Triple Debt Model](/concepts/triple-debt-model) — Diagnostic framework for the debt vibe coding generates
- [Context Gates](/patterns/context-gates) — Deterministic enforcement layer
- [Levels of Autonomy](/concepts/levels-of-autonomy) — Human oversight model (L3: "Hands Off, Eyes On")
- [Industry Alignment](/resources/further-reading) — External voices converging on ASDLC principles
