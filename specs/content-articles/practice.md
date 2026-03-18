# Archetype: Practice Article

> Parent spec: [Content Articles](spec.md)

## Purpose

Practice articles describe **operational processes** — step-by-step instructions for executing specific tasks in agentic software development. Practices define *how* to do something, not the structural form of the solution.

The analogy: a Pattern is the **blueprint** (architectural plan), a Practice is the **construction manual** (how to build it).

## Required Sections

1. **Definition** — "What does this practice accomplish?" Verb-based definition ("X is the process of..."). State the outcome. 2–4 sentences.
2. **When to Use** — Trigger conditions where this practice applies. Include explicit exceptions ("Skip this when...").
3. **The Process** — Step-by-step instructions. Numbered or named steps, imperative voice, clear inputs/outputs, decision points marked explicitly.
4. **Related Patterns** — Link to the Pattern(s) this practice implements. Explain the relationship. Every Practice should implement at least one Pattern (or note "Implements: [Pattern Name] (TBD)").

**Recommended sections:**
- **Templates & Examples** — Copy-paste ready artifacts with documented placeholders.
- **Common Mistakes** — Named failure modes with problem/solution pairs.

## Frontmatter

Uses the shared `articleSchema`. No collection-specific extensions.

**Title:** Verb phrase or gerund, Title Case ("Living Specs", not "The Living Spec").

**Description:** Describes the process/outcome, not the structure.

## Tone & Voice

- **Instructional** — Guiding action, not describing structure.
- **Concrete** — Specific steps, not abstract concepts.
- **Practical** — Focused on execution.
- Verb-based definitions ("The process of..."). Imperative for instructions ("Create a file...", "Run the command..."). Second person acceptable ("You should...").

## Length

- Minimum: 400 words
- Sweet spot: 600–1500 words
- Maximum: 2500 words

## Anti-Patterns

- **The Pattern in Disguise** — Practice focuses on structure/anatomy instead of process. Extract structural content to a Pattern.
- **The Concept Creep** — Too much time explaining terminology. Link to Concepts for definitions, focus on execution.
- **The Wall of Text** — Process buried in prose without clear steps. Use numbered steps, headers, bulleted lists.
- **The Orphaned Practice** — No linked Pattern explaining the underlying structure.
- **The Template Dump** — Just templates with no process explanation. Templates support the process, they don't replace it.
