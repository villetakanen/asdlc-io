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
5. **Relationships** — Links to related patterns (composition, alternatives) and implementing practices.

## Frontmatter

Uses the shared `articleSchema`. No collection-specific extensions.

**Title:** Noun phrase, Title Case. Not an action ("The Spec", not "Writing Specs").

**Description:** Describes the solution structure, not the process.

## Tone & Voice

- **Architectural** — Describing structure, not process.
- **Abstract** — Transferable across software-development contexts.
- **Definitive** — This is the canonical form.
- Noun-based definitions ("The X is a Y"). Present tense for structure ("The pattern consists of..."). Avoid imperative ("Do this...") — save that for practices.

## Scope

ASDLC's corpus is for software development. Pattern articles describe structural solutions in that context. Where a pattern generalizes beyond software (to service design, project management, operations, and so on), that observation is noted in a blockquoted sidenote — not in the formal payload of Definition, The Problem, The Solution, or Anatomy. Cross-domain applicability is flavor, not substance.

## Length

Length follows the subject's substance. Most patterns fit comfortably in 800–1500 words. Substantive patterns — those with significant prior art, multiple structural variants, or deep cluster connections — may extend to 1500–2500 words when the additional space is earned by what's needed to articulate the structure clearly.

Concision is the default. Extension is justified by structural depth, not by ambition to rank, position, or compete. If an article exceeds 2500 words, consider whether the pattern is actually multiple patterns being conflated.

## Constraints

Pattern articles satisfy the following constraints. Each constraint is a property of the finished article — a positive condition that must hold true.

### Structure

- The article describes the *shape* of a solution. Step-by-step operational instructions live in the linked Practice.
- The article includes at least one concrete structural example that grounds the abstraction.
- Templates and reusable artifacts live in the linked Practice. Examples within the Pattern article illustrate structural points, not implementation templates.
- Linking to an implementing Practice is a guideline rather than a hard requirement. When implementation has been documented, the Pattern links to it. When implementation has not yet been documented, the Pattern stands on its own — the Relationships section does not name a placeholder Practice.

### Scope discipline

- Cross-domain observations (where the pattern applies beyond software development) appear as blockquoted sidenotes. The formal sections describe the pattern in software-development terms.

### Graph hygiene

- Each `relatedIds` entry reflects a connection the body genuinely engages with. Each entry is a graph edge; treat them as scarce.
- Five strong edges are stronger than fifteen incidental ones. Concepts and patterns mentioned only in passing are linked inline and omitted from `relatedIds`.

### Editorial purpose

- Pattern articles teach the structural design. Competitive framing ("how ASDLC's pattern differs from X") belongs in strategy notes or positioning content, not in the architectural layer.
- Length is earned by structural substance. Articles do not extend to chase rankings, compete on word count, or pad authority signals.
