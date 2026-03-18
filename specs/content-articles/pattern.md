# Archetype: Pattern Article

> Parent spec: [Content Articles](spec.md)

## Purpose

Pattern articles describe **architectural solutions** — reusable structural designs that solve recurring problems in agentic software development. Patterns define the *shape* of a solution, not the step-by-step execution.

The analogy: a Pattern is the **blueprint** (architectural plan), a Practice is the **construction manual** (how to build it).

Patterns are methodology payload — comprehensive documentation of ASDLC's architectural solutions. They should be well-studied, practitioner-focused, and validated through convergent evolution or research backing.

## Required Sections

1. **Definition** — "What is this pattern?" Noun-based definition ("The X is a Y that..."). State the problem/context. 2–4 sentences.
2. **The Problem** — What fails without this pattern? Name the problem, explain the forces/constraints, show why naive solutions fail.
3. **The Solution** — The pattern's structural response. Describe the structure, not the steps. Explain the key insight.
4. **Anatomy / Structure** — Component breakdown. Overview of parts, their roles, and relationships. Diagrams where helpful.
5. **Relationships** — Links to related patterns (composition, alternatives) and implementing practices. Every pattern should link to at least one practice (or note "Implementation: See [Practice Name] (TBD)").

## Frontmatter

Uses the shared `articleSchema`. No collection-specific extensions.

**Title:** Noun phrase, Title Case. Not an action ("The Spec", not "Writing Specs").

**Description:** Describes the solution structure, not the process.

## Tone & Voice

- **Architectural** — Describing structure, not process.
- **Abstract** — Transferable across contexts.
- **Definitive** — This is the canonical form.
- Noun-based definitions ("The X is a Y"). Present tense for structure ("The pattern consists of..."). Avoid imperative ("Do this...") — save that for practices.

## Length

- Minimum: 600 words
- Sweet spot: 800–1500 words
- Maximum: 2000 words

## Anti-Patterns

- **The Practice in Disguise** — Pattern article full of "how to" instructions. Extract step-by-step content to a linked Practice.
- **The Template Dump** — Mostly templates/examples, not structural explanation. Move templates to Practice.
- **The Orphaned Pattern** — No linked Practice explaining implementation. Every Pattern should link to at least one Practice.
- **The Vague Abstraction** — So abstract it provides no actionable insight. Include concrete structural examples while keeping conceptual focus.
