---
title: Model-Driven Development
description: "An early 2000s software engineering paradigm that attempted 100% code generation from models, serving as a cautionary tale for modern spec-as-source AI hype."
tags:
  - Software Development
  - Methodologies
  - History
  - Anti-Patterns
relatedIds:
  - concepts/spec-driven-development
  - patterns/the-spec
status: Live
lastUpdated: 2026-03-03
references:
  - type: website
    title: "Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl"
    url: "https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html"
    author: "Birgitta Böckeler"
    published: 2025-01-21
    accessed: 2026-03-03
    annotation: "Highlights the risks of 'spec-as-source' by comparing it to the failed Model-Driven Development (MDD) paradigms."
---

## Definition

**Model-Driven Development (MDD)**—often associated with Model-Driven Architecture (MDA)—was a software engineering movement prominent in the early 2000s. Its core ambition was to elevate the level of abstraction in software engineering. 

In MDD, developers authored high-level visual models (such as UML diagrams) or textual Domain-Specific Languages (DSLs) instead of writing general-purpose code. Complex code generation tools were then tasked with translating these models into 100% of the underlying implementation code. The goal was to separate the functional business logic (the model) from the technical implementation details.

## Why MDD Failed

Despite enormous industry hype, MDD failed to achieve mainstream enterprise adoption for several structural reasons:

### 1. The Abstraction Trap
The promise of MDD was that models would be simpler than code. In practice, writing a model that was precise enough to generate edge-case-handling production code required the model itself to become just as complex as the code it was replacing. Instead of reducing complexity, MDD merely shifted it from a well-understood programming language into a proprietary, clunky modeling language.

### 2. Big Upfront Design (BUFD)
MDD entrenched a rigid, waterfall-style methodology. It required massive upfront investment in creating complete models before any executable software emerged. This fundamental inflexibility clashed directly with the rise of Agile methodologies, which prioritized rapid iteration, immediate feedback, and working software over comprehensive documentation.

### 3. Tooling Inadequacy
MDD relied entirely on code generation tools. These tools were often expensive, proprietary, and poorly integrated into developer workflows. Crucially, they lacked essential developer experience (DX) features. When a generated application had a bug, deciphering whether the flaw was in the model, the code generator, or the execution environment was nearly impossible because debugging at the "model level" was severely limited.

## The LLM Renaissance (and Risk)

The rise of Generative AI and Large Language Models (LLMs) has sparked a renewed interest in the core premise of MDD, often rebranded under terms like `spec-as-source`.

Because LLMs can parse natural language, they remove the need for rigid DSLs and complex, proprietary parsers. Developers can now write a natural language specification and ask an AI agent to generate the code. 

However, trading MDD for LLMs introduces a dangerous new variable: **non-determinism**.

While MDD failed because its determinism was too rigid, LLMs struggle because they are inherently probabilistic. If a human only edits a natural language spec and expects the LLM to cleanly regenerate the entire codebase 1:1 every time without drifting or introducing novel bugs, they are treating the LLM like a magical compiler. 

## The ASDLC Stance

ASDLC views the history of MDD as a critical cautionary tale. The desire to never look at implementation code again is an anti-pattern.

We learn from MDD's failures by adopting a `spec-anchored` philosophy:
1. **Specs are for Intent:** We write [Living Specs](/practices/living-specs) to define architectural boundaries, invariants, and accepted behavior.
2. **Code is for Logic:** We retain human oversight over the deterministic implementation code. 

**Code is not an implementation detail to be abstracted away; it is the only medium capable of expressing logic deterministically.** ASDLC uses agents to write code quickly guided by specs, not to hide the code entirely.

> **Read Next:** Learn how ASDLC navigates these pitfalls in [Spec-Driven Development](/concepts/spec-driven-development).
