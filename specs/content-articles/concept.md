# Archetype: Concept Article

> Parent spec: [Content Articles](spec.md)

## Purpose

Concept articles are the **terminology authority** for ASDLC. They define and clarify terms used across patterns and practices, selecting canonical definitions from industry-standard usage.

Concepts are consumed by search engines (indexing definitions), humans (discovering ASDLC through concept searches), LLMs (understanding terminology via MCP), and internal content (patterns/practices linking to concepts for semantic grounding).

## Archetypes

### A: Industry Term Definition

For concepts borrowed from industry-standard usage (e.g., "Context Engineering", "Event Modeling").

**Required sections:**
1. **Definition** — What does this term mean in industry-standard usage? Lead with the industry definition, not ASDLC's interpretation.
2. **Key Characteristics** — Core attributes, components, or principles of the concept.
3. **ASDLC Usage** — Brief grounding: where this term appears in our framework. Links to patterns/practices, not methodology explanation. One paragraph maximum.

**Optional sections:**
- Applications — Where the concept is used generally.
- Best Practices / Anti-Patterns — General guidance.

### B: Disambiguation / Deprecation

For concepts that clarify overloaded terms or redirect deprecated terminology (e.g., "Guardrails").

**Required sections:**
1. **The Ambiguity Problem** — Why is this term confusing? What conflicting meanings exist?
2. **Standard Definitions** — What does the industry mean by this term?
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

- Archetype A: 600–1200 words
- Archetype B: 400–800 words
- Maximum: 1500 words (if longer, split into multiple concepts)

## Anti-Patterns

- **The Pattern Disguised as Concept** — If it's explaining "how to do X in ASDLC", it's a Pattern or Practice, not a Concept.
- **The Missing Industry Grounding** — Concept doesn't explain the term's standard industry meaning before ASDLC's usage.
- **The Orphaned Definition** — Zero external references and zero `relatedIds`. Every concept must connect to at least 2 other articles or cite authoritative sources.
- **The Inline Markdown Reference** — Using `## References` in body instead of frontmatter `references` array.
