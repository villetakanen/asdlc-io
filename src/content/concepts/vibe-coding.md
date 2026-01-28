---
title: "Vibe Coding"
description: "Natural language code generation without formal specs—powerful for prototyping, problematic for production systems."
tags: ["Disambiguation", "AI", "Code Quality", "Anti-Pattern"]
status: "Experimental"
relatedIds: ["concepts/spec-driven-development", "patterns/context-gates", "concepts/levels-of-autonomy"]
lastUpdated: 2025-01-05
references:
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
---

## Definition

Vibe Coding is the practice of generating code directly from natural language prompts without formal specifications, schemas, or contracts. Coined by Andrej Karpathy, the term describes an AI-assisted development mode where engineers describe desired functionality conversationally ("make this faster," "add a login button"), and the LLM produces implementation code.

This approach represents a fundamental shift: instead of writing specifications that constrain implementation, developers describe intent and trust the model to infer the details. The result is rapid iteration—code appears almost as fast as you can articulate what you want.

While vibe coding accelerates prototyping and exploration, it inverts traditional software engineering rigor: the specification emerges *after* the code, if at all.

## The Seduction of Speed

The productivity gains from vibe coding are undeniable:

* **At Anthropic:** 80-90% of Claude Code's codebase is now written by Claude Code itself, with a 70% productivity increase per engineer since adoption.
* **At Google:** Approximately 30% of code committed in 2024 was AI-generated.
* **Industry-wide:** Engineers report 2-10x faster feature delivery for greenfield projects and prototypes.

This velocity is seductive. When a feature that previously took three days can be scaffolded in thirty minutes, the economic pressure to adopt vibe coding becomes overwhelming.

The feedback loop is immediate: describe the behavior, see the code, run it, iterate. For throwaway scripts, MVPs, and rapid exploration, this workflow is transformative.

## The Failure Modes

The velocity advantage of vibe coding collapses when code must be maintained, extended, or integrated into production systems:

### Technical Debt Accumulation

**Forrester Research predicts that by 2026, 75% of technology leaders will face moderate-to-severe technical debt** directly attributable to AI-generated code. The mechanism is straightforward: code generated from vague prompts encodes vague assumptions.

When specifications exist only in the prompt history (or the engineer's head), future maintainers inherit code without contracts. They must reverse-engineer intent from implementation—the exact problem formal specifications solve.

### Copy-Paste Culture

2024 marked the first year in industry history where **copy-pasted code exceeded refactored code**. This is a direct symptom of vibe coding: when generating fresh code is faster than understanding existing code, engineers default to regeneration over refactoring.

The result is systemic duplication. The same logic appears in fifteen places with fifteen slightly different implementations, none validated against a shared contract.

### Silent Drift

LLMs are probabilistic. When generating code from vibes, they make assumptions:
- Error handling strategies (fail silently? throw? log?)
- Data validation rules (what's a valid email?)
- Concurrency models (locks? optimistic? eventual consistency?)

These assumptions are *never documented*. The code passes tests (if tests exist), but violates implicit architectural contracts. Over time, the system drifts toward inconsistency—different modules make different assumptions about the same concepts.

Boris Cherny (Principal Engineer, Anthropic; creator of Claude Code) warns: **"You want maintainable code sometimes. You want to be very thoughtful about every line sometimes."**

> **"Speed is seductive. Maintainability is survival."**  
> — Boris Cherny, *The Peterman Podcast* (December 2025)

> [!NOTE]
> **The 100 Million Token Lesson**
> 
> Dan Cripe, a 25-year enterprise software veteran, documented spending 100 million tokens on a frontier model attempting to fix its own architectural mistakes—not syntax errors, but fundamental design pattern violations. His diagnosis: "LLMs are pattern matchers, not architects. They generate code that looks like the code they were trained on: code written to solve an immediate problem, not code designed to be maintainable as part of a larger system."

### Vibe Coded Into a Corner

Anthropic's internal research found that engineers who spend *more* time on Claude-assisted tasks often do so because they "vibe code themselves into a corner"—generating code without specs until debugging and cleanup overhead exceeds the initial velocity gains.

> "When producing output is so easy and fast, it gets harder and harder to actually take the time to learn something."
> — Anthropic engineer

This creates a debt spiral: vibe coding is fast until it isn't, and by then the context needed to fix issues was never documented.

### Regression to the Mean

Without deterministic constraints, LLMs trend toward generic solutions. Vibe coding produces code that works but lacks the specific optimizations, domain constraints, and architectural decisions that distinguish production systems from prototypes.

The model doesn't know that "user IDs must never be logged" or "this cache must invalidate within 100ms." These constraints exist in specifications, not prompts.

## Applications

Vibe coding is particularly effective in specific contexts:

**Rapid Prototyping:** When validating product hypotheses, speed of iteration outweighs code quality. Vibe coding enables designers and product managers to generate functional prototypes without deep programming knowledge.

**Throwaway Scripts:** One-off data migrations, analysis scripts, and temporary tooling benefit from vibe coding's velocity. Since the code has no maintenance burden, formal specifications are unnecessary overhead.

**Learning and Exploration:** When experimenting with new APIs, frameworks, or architectural patterns, vibe coding provides immediate feedback. The goal is understanding, not production-ready code.

**Greenfield MVPs:** Early-stage startups building minimum viable products often prioritize speed-to-market over maintainability. Vibe coding accelerates this phase, though technical debt must be managed during the transition to production.

## ASDLC Usage

In ASDLC, vibe coding is recognized as a legitimate operational mode for bounded contexts (exploration, prototyping, throwaway code). However, for production systems, ASDLC mandates a transition to deterministic development.

**The ASDLC position:**
- Vibe coding is **steering** (probabilistic guidance via prompts)
- Production requires **determinism** (schemas, tests, typed interfaces)
- Both are necessary: prompts steer the agent; schemas enforce correctness

Applied in:
- [Spec-Driven Development](/concepts/spec-driven-development) — The production-grade alternative to vibe coding
- [Context Gates](/patterns/context-gates) — Deterministic enforcement layer
- [Levels of Autonomy](/concepts/levels-of-autonomy) — Human oversight model (L3: "Hands Off, Eyes On")

See also:
- [Industry Alignment](/resources/industry-alignment) — External voices converging on ASDLC principles
- [Spec-Driven Development](/concepts/spec-driven-development) — ASDLC's production-grade methodology
- [Context Gates](/patterns/context-gates) — Deterministic enforcement layer
