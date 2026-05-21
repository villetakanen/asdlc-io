# Archetype: Concept Article

> Parent spec: [Content Articles](spec.md)

## Purpose

Concept articles are the **terminology authority** for ASDLC. They define and clarify terms used across patterns and practices, selecting canonical definitions from industry-standard usage.

Concepts are consumed by search engines (indexing definitions), humans (discovering ASDLC through concept searches), LLMs (understanding terminology via MCP), and internal content (patterns/practices linking to concepts for semantic grounding).

## Archetypes

### A: Industry Term Definition

For concepts borrowed from industry-standard usage (e.g., "Context Engineering", "Event Modeling").

**Required sections:**

1. **Definition** — Industry-standard usage. Snippet-optimized opening. Industry definition leads; ASDLC framing follows.
2. **Key Characteristics** — Core attributes, components, or principles of the concept.
3. **ASDLC Usage** — Brief grounding: where this term appears in our framework. Links to patterns/practices, not methodology explanation. One paragraph maximum.

**Optional sections:**

- **Applications** — Where the concept is used generally.
- **Best Practices** — General guidance distilled from industry usage.
- **Open Questions** — Substantive gaps, conflations, or unverified claims in industry treatment of the term. Concept-centric: describes what's under-discussed about the concept itself, not how ASDLC compares. Used only when the subject genuinely warrants it.

### B: Disambiguation / Deprecation

For concepts that clarify overloaded terms or redirect deprecated terminology (e.g., "Guardrails").

**Required sections:**

1. **The Ambiguity Problem** — Why the term is confusing; what conflicting meanings exist.
2. **Standard Definitions** — What the industry means by this term, across its variants.
3. **The ASDLC Interpretation** — How we resolve the ambiguity, mapping to preferred terms.
4. **Superseding Concepts** — Links to preferred terms. Required if status is Deprecated.

## Frontmatter

Extends the shared schema with:

```yaml
maturity: "Standard"                    # Optional: Proposed | Standard | Deprecated | Experimental
supersededBy: ["concepts/new-term"]     # Required if status: Deprecated
```

**Title:** Industry-standard term, Title Case. Use the term people search for, not ASDLC-specific phrasing.

**Description:** Pure semantic definition — no ASDLC branding. This appears in search results.

## Tone & Voice

- **Authoritative** — This is the canonical definition we've selected.
- **Neutral** — Avoid ASDLC evangelism in the main content. Third-person until the ASDLC Usage section.
- **Precise** — Every word carries semantic weight. No marketing language.
- Present tense for definitions. Active voice preferred.

## Length

Length follows the subject's substance. Most concepts fit comfortably in 600–1500 words. Substantive concepts — those with significant prior art, multiple distinct interpretations across industry, or unverified headline claims worth examining — may extend to 2000–3000 words when the additional space is earned by what's needed to teach the subject clearly.

Concision is the default. Extension is justified by educational substance, not by ambition to rank, position, or compete. If an article exceeds 3000 words, consider whether the subject should split into multiple concepts.

## Constraints

Concept articles satisfy the following constraints. Each constraint is a property of the finished article — a positive condition that must hold true.

### Structure

- The article addresses what a term means and what it refers to. Application instructions ("how to do X") live in Patterns or Practices.
- The first body section presents the industry-standard definition before any ASDLC-specific framing.
- Every concept article connects to at least 2 other articles via `relatedIds`, or cites at least 1 authoritative external source.
- References live in the frontmatter `references` array. The body contains no `## References` section.

### ASDLC Usage discipline

- The ASDLC Usage section is one paragraph, no more. Tight surface selects the most essential connection over enumerating incidental ones.
- Each ASDLC concept named in ASDLC Usage is connectable in one sentence: the body states what about the connection matters, not merely that it exists.
- Connections to ASDLC vocabulary state what specifically links the concept to ASDLC's framing — substance over labels.

### Graph hygiene

- Each `relatedIds` entry reflects a connection the body genuinely engages with. Each entry is a graph edge; treat them as scarce.
- Five strong edges are stronger than fifteen incidental ones. Concepts mentioned only in passing are linked inline and omitted from `relatedIds`.

### Editorial purpose

- Concept articles teach the term. Competitive framing ("how ASDLC differs from X") belongs in strategy notes or positioning content, not in the textbook layer.
- Length is earned by educational substance. Articles do not extend to chase rankings, compete on word count, or pad authority signals.
- Where industry treatment of a term is conflated, under-specified, or carries unverified claims, the article articulates these as properties *of the concept's industry treatment* — not as ASDLC's positioning against alternatives.
