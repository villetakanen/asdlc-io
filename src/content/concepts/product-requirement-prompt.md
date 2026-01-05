---
title: "Product Requirement Prompt (PRP)"
description: "A structured methodology combining PRD, codebase context, and agent runbook—the minimum spec for production-ready AI code."
tags: ["Industry Term", "Spec-Driven Development", "Context Engineering"]
status: "Experimental"
relatedIds: ["concepts/spec-driven-development", "patterns/the-spec", "patterns/the-pbi", "concepts/context-engineering"]
lastUpdated: 2025-01-05
---

## Definition

A **Product Requirement Prompt (PRP)** is a structured methodology that answers the question: *"What's the minimum viable specification an AI coding agent needs to plausibly ship production-ready code in one pass?"*

As creator Rasmus Widing defines it: **"A PRP is PRD + curated codebase intelligence + agent runbook."**

Unlike traditional PRDs (which exclude implementation details) or simple prompts (which lack structure), PRPs occupy the middle ground—a complete context packet that gives an agent everything it needs to execute autonomously within bounded scope.

The methodology emerged from practical engineering work in 2024 and has since become the foundation for agentic engineering training.

## Key Characteristics

PRPs are built on three core principles:

1. **Plan before you prompt** — Structure thinking before invoking AI
2. **Context is everything** — Comprehensive documentation enables quality output
3. **Scope to what the model can reliably do in one pass** — Bounded execution units

A complete PRP includes six components:

| Component | Purpose |
|-----------|---------|
| **Goal** | What needs building |
| **Why** | Business value and impact justification |
| **Success Criteria** | Measurable checkpoints |
| **All Needed Context** | Documentation references, file paths, code snippets |
| **Implementation Blueprint** | Task breakdown and pseudocode |
| **Validation Loop** | Multi-level testing (syntax, unit, integration) |

### Key Differentiators from Traditional PRDs

- **Precise context:** Specific file paths, library versions, code examples
- **Documentation integration:** Links to relevant library docs and architectural patterns
- **Known gotchas:** Critical warnings about potential pitfalls
- **Validation frameworks:** Executable tests the AI can run and fix iteratively

## ASDLC Usage

PRP components map directly to ASDLC concepts—a case of convergent evolution in agentic development practices.

| PRP Component | ASDLC Equivalent |
|---------------|------------------|
| Goal | [The Spec](/patterns/the-spec) — Blueprint |
| Why | [Product Thinking](/concepts/product-thinking) |
| Success Criteria | [Context Gates](/concepts/context-gates) |
| All Needed Context | [Context Engineering](/concepts/context-engineering) |
| Implementation Blueprint | [The PBI](/patterns/the-pbi) |
| Validation Loop | [Context Gates](/concepts/context-gates) — Quality Gates |

In ASDLC terms, a PRP is equivalent to **The Spec + The PBI + curated Context Engineering**—bundled into a single artifact optimized for agent consumption.

ASDLC separates these concerns for reuse: multiple PBIs reference the same Spec, and context is curated per-task rather than duplicated. For simpler projects or rapid prototyping, the PRP's unified format may be more practical. The methodologies are complementary—PRPs can be thought of as "collapsed ASDLC artifacts" for single-pass execution.

Applied in:
- [Spec-Driven Development](/concepts/spec-driven-development) — The philosophy PRPs implement
- [The Spec](/patterns/the-spec) — ASDLC's permanent specification pattern
- [The PBI](/patterns/the-pbi) — ASDLC's transient execution unit

## References

- [PRPs: Agentic Engineering (GitHub)](https://github.com/Wirasm/PRPs-agentic-eng) — Original methodology and templates
- [Rasmus Widing (LinkedIn)](https://www.linkedin.com/in/rasmuswiding/) — Creator of PRP methodology
- [Industry Alignment](/resources/industry-alignment) — Convergent frameworks in agentic development

See also:
- [Spec-Driven Development](/concepts/spec-driven-development) — ASDLC's foundational methodology
- [The Spec](/patterns/the-spec) — ASDLC's specification pattern
- [Vibe Coding](/concepts/vibe-coding) — The anti-pattern both PRP and SDD address
