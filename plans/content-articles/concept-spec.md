# Feature: Concept Article Template

## Blueprint

### Context

Concept articles are the **terminology authority** for ASDLC. They define and clarify the terms we use throughout patterns and practices, selecting canonical definitions from industry-standard usage.

**Primary Purpose:**
- **Terminology Selection** — Define what we mean when we use a term in ASDLC
- **Semantic Clarity** — Establish canonical definitions for terms used in patterns/practices
- **Disambiguation** — Resolve conflicting meanings, explain our choice
- **Knowledge Graph Foundation** — Provide definitional anchors for patterns and practices to reference

**Secondary Benefit:**
- **SEO Pillar Effect** — Using industry-standard terms creates natural search visibility

**What Concepts Define:**
- The **semantics** of terms used in ASDLC (what does "Context Gate" mean?)
- The **scope** of industry terms (what is "Context Engineering" and how do we use it?)
- The **distinctions** between overloaded terms (why "Guardrails" is deprecated)

**What Concepts Are NOT:**
- ASDLC-specific methodology (that belongs in Patterns/Practices)
- Implementation guides (use Practices)
- Step-by-step instructions (use Practices)

These articles are consumed by:
- **Search Engines** — Indexing authoritative definitions
- **Humans via Google** — Discovering ASDLC through concept searches
- **LLMs via MCP** — Understanding industry-standard terminology
- **Internal Content** — Patterns/Practices link to concepts for semantic grounding

### Architecture

**File Structure:**
```
src/content/concepts/
  ├── {slug}.md           # Markdown with YAML frontmatter
  └── {slug}.mdx          # MDX if interactive components needed
```

**Schema:** Defined in `src/content/config.ts` under `conceptsCollection`

**Rendering:**
- Index page: `/concepts` (card grid)
- Detail page: `/concepts/{slug}` (full article)
- Field Manual: Alphabetic compilation (if status: Live/Experimental)
- Article Compendium: Unfiltered alphabetic dump

**SEO Strategy (Secondary Benefit):**
- Title: Industry-standard term when possible (e.g., "Context Engineering")
- Description: Clear definition (happens to work well in search results)
- Tags: Broad keywords (improves discoverability)
- Content: Define semantics, explain ASDLC usage naturally

### Content Structure

Concept articles follow one of **two archetypes**:

---

#### **Archetype A: Industry Term Definition**

For concepts borrowed from industry-standard usage (e.g., "Context Engineering", "Event Modeling").

**Required Sections:**

1. **Frontmatter** (Required)
2. **Definition** (Required) — What does this term mean (industry-standard)?
3. **Key Characteristics** (Required) — Core attributes, components, or principles
4. **ASDLC Usage** (Required) — How we use/interpret this term in our framework
5. **Applications** (Optional) — Where is this used generally?
6. **Best Practices / Anti-Patterns** (Optional) — General guidance

---

#### **Archetype B: Disambiguation / Deprecation**

For concepts that clarify overloaded terms or redirect deprecated terminology (e.g., "Guardrails").

**Required Sections:**

1. **Frontmatter** (Required) — Must include `supersededBy` if deprecated
2. **The Ambiguity Problem** (Required) — Why is this term confusing?
3. **Standard Definitions** (Required) — What does the industry mean by this term?
4. **The ASDLC Interpretation** (Required) — How we resolve the ambiguity
5. **Superseding Concepts** (Required if Deprecated) — Links to preferred terms

---

### Detailed Section Specifications

#### 1. Frontmatter (Required for All)

```yaml
---
title: "Concept Name"                    # 3-10 words, Title Case, SEO-optimized
description: "One-sentence summary..."   # Max 200 chars, pure definition (no ASDLC branding)
tags: ["Tag1", "Tag2"]                   # 2-5 tags, broad industry keywords
relatedIds: ["concepts/foo", "patterns/bar"]  # Slash-prefixed IDs
lastUpdated: 2025-01-15                  # ISO 8601 date (YYYY-MM-DD)
status: "Live"                           # Live | Experimental | Draft | Proposed | Deprecated
maturity?: "Standard"                    # Optional: Proposed | Standard | Deprecated | Experimental
supersededBy?: ["concepts/new-id"]       # REQUIRED if status: Deprecated
references?: []                          # REQUIRED for external sources (see Article References spec)
---
```

**SEO Optimization:**
- `title`: Use industry-standard term, not ASDLC-specific phrasing
- `description`: Pure semantic definition (this appears in search results)
- `tags`: Broad keywords people actually search for

**Example (Good):**
```yaml
title: "Context Engineering"
description: "The practice of structuring information to optimize LLM comprehension and output quality."
tags: ["AI", "LLM", "Prompt Engineering", "Context Engineering"]
```

**Example (Bad - Too ASDLC-specific):**
```yaml
title: "ASDLC Context Engineering Pattern"
description: "How we use context engineering in the Agentic SDLC framework."
tags: ["ASDLC", "Framework"]
```

---

#### 2. Definition (Required for Archetype A)

**Opening paragraph** that answers: "What does this term mean in industry-standard usage?"

**Format:**
```markdown
## Definition

[Precise 1-3 sentence definition based on industry usage]

[Contextual expansion: Why does this exist? What domain does it come from?]
```

**Requirements:**
- **Industry-Grounded** — Start with how the industry defines this term
- **Authoritative Tone** — This is the canonical definition we've selected
- **Clear Scope** — What does this term cover?
- **No Marketing Language** — Avoid "revolutionary", "game-changing", etc.

**Example (Good - Context Engineering):**
```markdown
## Definition

Context Engineering is the systematic approach to designing and structuring the input context provided to Large Language Models (LLMs) to maximize their effectiveness, accuracy, and reliability in generating outputs.

While applicable across domains, Context Engineering manifests differently in each:
* **In Design:** Design system tokens and Figma layer naming conventions fed to UI agents
* **In Law:** Briefs that restrict paralegal agents to specific case law precedents  
* **In ASDLC:** The `AGENTS.md` file that steers the agent towards implementation patterns
```

---

#### 3. The Ambiguity Problem (Required for Archetype B)

**Section** explaining why the term is confusing or deprecated.

**Format:**
```markdown
## The Ambiguity Problem

[What does the industry/community mean by this term?]

[Why do different contexts use it differently?]

[What problems does this ambiguity create?]
```

**Example (Guardrails):**
```markdown
## The Industry Conflict

Standard definitions of "Guardrails" conflate two opposing engineering concepts: architectural firewalls (deterministic) and prompt engineering (probabilistic). This ambiguity leads to agents that are "safe" but functionally paralyzed.
```

---

#### 4. Key Characteristics / Components (Archetype A)

**Section** breaking down the concept's core attributes.

**Format:**
```markdown
## Key Characteristics

1. **Characteristic 1**: [Description]
2. **Characteristic 2**: [Description]

## Key Components

### Component 1
[Description]

### Component 2
[Description]
```

**Optional Elements:**
- Tables for comparison
- Mermaid diagrams (pre-generated in `/public/mermaid/`)
- Code examples (if universally applicable, not ASDLC-specific)

---

#### 5. ASDLC Usage (Required for Archetype A)

**Brief section** showing where this term appears in ASDLC framework.

**Format:**
```markdown
## ASDLC Usage

See: [Pattern/Practice Name](/path/slug)
```

**Or, if multiple references:**
```markdown
## ASDLC Usage

Applied in:
- [Pattern Name](/patterns/slug)
- [Practice Name](/practices/slug)
```

**Requirements:**
- **Grounding Only** — Just show where this concept is used, don't explain methodology
- **Links Only** — Point to patterns/practices, don't duplicate their content
- **Brief** — 1 paragraph maximum, often just a list of links
- **Optional Clarification** — Add one sentence only if we use the term differently than industry standard

**Example (Context Engineering):**
```markdown
## ASDLC Usage

Applied in: [AGENTS.md Specification](/practices/agents-md-spec), [Context Gates](/concepts/context-gates)
```

**Example with clarification (if needed):**
```markdown
## ASDLC Usage

In ASDLC, we treat context as version-controlled code, not ephemeral prompts.

Applied in: [AGENTS.md Specification](/practices/agents-md-spec), [Specs](/patterns/the-spec), [Context Gates](/concepts/context-gates)
```

---

#### 6. The ASDLC Interpretation (Required for Archetype B)

**Section** explaining how ASDLC resolves the ambiguity.

**Format:**
```markdown
## The ASDLC Definition

To resolve this, ASDLC maps "[deprecated term]" to:
- [New Concept 1](/concepts/slug) — [Purpose]
- [New Concept 2](/concepts/slug) — [Purpose]

[Brief explanation of the mapping]
```

---

#### 7. Superseding Concepts (Required for Archetype B if Deprecated)

**Section** redirecting to preferred terminology.

**Format:**
```markdown
## Superseding Concepts

This concept has been superseded by:
- [New Concept](/concepts/slug) — [Why this is better]

See also:
- [Related Pattern](/patterns/slug)
- [Related Practice](/practices/slug)
```

---



### Content Guidelines

**Tone:**
- **Authoritative** — This is the industry definition
- **Neutral** — Avoid ASDLC evangelism in the main content
- **Precise** — Every word carries semantic weight

**Voice:**
- Active voice preferred
- Present tense for definitions
- Third-person perspective (avoid "we" until ASDLC backlink section)

**Formatting:**
- One H1 per page (handled by layout, start content with ##)
- H2 for major sections
- H3 for subsections
- Bold for emphasis sparingly
- Blockquotes for critical insights or warnings
- Code fences with language tags (only if domain-agnostic)

**Length:**
- Archetype A (Industry Term): 600-1200 words
- Archetype B (Disambiguation): 400-800 words
- Maximum: 1500 words (if longer, split into multiple concepts)

**SEO Optimization:**
- Use the canonical term in title and first paragraph
- Include related keywords naturally in content
- Link to authoritative external sources
- Keep meta description under 200 chars and compelling

---

### Anti-Patterns

**The Pattern Disguised as Concept**
- **Problem:** Concept is actually describing ASDLC methodology, not terminology
- **Solution:** If it's explaining "how to do X in ASDLC", it's a Pattern or Practice, not a Concept

**The Missing Industry Grounding**
- **Problem:** Concept doesn't explain the term's standard industry meaning
- **Solution:** Start with industry definition, then explain ASDLC's usage/interpretation

**The Marketing Pitch**
- **Problem:** Concept oversells with hyperbolic language
- **Solution:** State facts, let semantic clarity speak for itself

**The Orphaned Definition**
- **Problem:** Concept has zero external references or relatedIds
- **Solution:** Every concept must connect to at least 2 other articles OR cite authoritative sources

**The Wall of Text**
- **Problem:** No structure, just prose
- **Solution:** Use headings, lists, tables to chunk information

**The Stale Reference**
- **Problem:** External links to 404s or outdated sources
- **Solution:** Verify all external links during creation and quarterly reviews

**The Inline Markdown Reference**
- **Problem:** Usage of `## References` section in markdown body
- **Solution:** Move all external references to frontmatter `references` array

---

## Contract

### Definition of Done

**Content Quality:**
- [ ] Archetype clearly identified (Industry Term or Disambiguation)
- [ ] All required sections for archetype present
- [ ] Frontmatter complete and valid against schema
- [ ] Description under 200 characters and clear
- [ ] 2-5 tags assigned (industry keywords that improve discoverability)
- [ ] Title uses industry-standard terminology when possible
- [ ] No H1 tags in markdown body (only H2 and below)
- [ ] Length appropriate for archetype (600-1200 for A, 400-800 for B, max 1500)
- [ ] Industry definition established before ASDLC usage (Archetype A)
- [ ] ASDLC Usage section present and explains our interpretation (Archetype A)

**Technical Quality:**
- [ ] `pnpm check` passes (type safety)
- [ ] `pnpm lint` passes (code quality)
- [ ] `pnpm build` succeeds
- [ ] Article appears in `/concepts` index
- [ ] Article appears in Field Manual (if status: Live/Experimental)
- [ ] MCP `get_article` returns content (if status: Live/Experimental)

**Discoverability (Secondary Benefit):**
- [ ] Title uses term people search for (when applicable)
- [ ] Description clear and accurate (happens to work well in search results)
- [ ] External references to authoritative sources
- [ ] Internal backlinks from patterns/practices
- [ ] Tags match industry keywords (improves discoverability)

**Editorial Quality:**
- [ ] Peer review completed
- [ ] External references verified (no 404s)
- [ ] Mermaid diagrams generated if used (`pnpm diagrams`)
- [ ] Deprecated concepts include `supersededBy` in frontmatter
- [ ] No `## References` section in markdown body (use frontmatter)

### Regression Guardrails

- Concept articles MUST define terminology used in ASDLC, not methodology (use Patterns/Practices for methodology)
- Concept titles SHOULD use industry-standard terminology when applicable
- Archetype A concepts MUST include "ASDLC Usage" section explaining our interpretation
- Concept status changes MUST update related articles' frontmatter
- Deprecated concepts MUST specify `supersededBy` field
- All internal links MUST use collection-prefixed format: `/concepts/{slug}`

### Scenarios

**Scenario: Create industry term concept**
- Given: ASDLC uses industry term "Context Engineering"
- When: Content engineer creates `context-engineering.md` using Archetype A
- Then: Article defines industry-standard meaning, then explains ASDLC usage/interpretation

**Scenario: Create disambiguation concept**
- Given: Term "Guardrails" has conflicting meanings
- When: Content engineer creates `guardrails.md` using Archetype B
- Then: Article clarifies ambiguity, maps to ASDLC's preferred terms

**Scenario: Deprecate outdated concept**
- Given: Concept "Guardrails" is superseded by "Context Gates"
- When: Status changed to "Deprecated" and `supersededBy: ["concepts/context-gates"]` added
- Then: Article removed from Field Manual, warning banner shown on detail page

**Scenario: Discoverability validation**
- Given: Concept article created
- When: Reviewing for discoverability
- Then: Title uses term people search for (when applicable), description clear and under 200 chars, tags are industry keywords

---

## Implementation Notes

### Schema Reference

From `src/content/config.ts`:

```typescript
const conceptsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/concepts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    tags: z.array(z.string()).optional().default([]),
    relatedIds: z.array(z.string()).optional().default([]),
    lastUpdated: z.coerce.date(),
    status: z.enum(['Draft', 'Proposed', 'Live', 'Experimental', 'Deprecated']),
    maturity: z.enum(['Proposed', 'Standard', 'Deprecated', 'Experimental']).optional(),
    supersededBy: z.array(z.string()).optional(),
  }),
});
```

### Archetype Decision Tree

**When creating a concept article, ask:**

1. **Is this defining a term we use in ASDLC?**
   - YES → Continue to next question
   - NO → This shouldn't be a Concept at all

2. **Is this term ambiguous or do we deprecate it?**
   - YES → Use Archetype B (Disambiguation/Deprecation)
   - NO → Use Archetype A (Industry Term Definition)

3. **Does this term have industry-standard meaning?**
   - YES → Start with industry definition, then explain ASDLC usage
   - NO → If it's ASDLC-only terminology, it's probably a Pattern, not a Concept

4. **Is this explaining how to DO something?**
   - YES → This is a Practice, not a Concept
   - NO → This is terminology definition, proceed as Concept

### SEO Best Practices

**Title Optimization:**
- Use the term people actually search for
- Avoid ASDLC-specific prefixes ("ASDLC Context Engineering" → "Context Engineering")
- Match industry-standard capitalization

**Description Optimization:**
- First sentence should be a complete, standalone definition
- Include primary keyword naturally
- Under 200 characters (appears in search results)

**Content Optimization:**
- Use primary keyword in first paragraph
- Include related keywords naturally throughout
- Link to authoritative external sources (increases trust signals)
- Internal links from patterns/practices (backlink strength)

### Mermaid Diagrams

If using Mermaid diagrams:

1. Write diagram in markdown code fence with `mermaid` language tag
2. Run `pnpm diagrams` to generate SVG
3. Replace code fence with static image reference:

```markdown
<figure class="mermaid-diagram">
  <img src="/mermaid/{slug}-fig-1.svg" alt="Diagram description" />
  <figcaption>Caption text</figcaption>
</figure>
```

---

## Resources

- Pattern: [Specs](/patterns/the-spec) — This document follows the Spec pattern
- Practice: [Living Specs](/practices/living-specs) — Maintenance guidance
- File: `src/content/config.ts` — Schema definition
- File: `src/styles/global.css` — Design tokens for custom styling
- Related: `/docs/specs/content/pattern-article-spec.md` (Future PBI)
- Related: `/docs/specs/content/practice-article-spec.md` (Future PBI)
- Resource: [Legend & Taxonomy](/resources/legend) — Status and maturity definitions
