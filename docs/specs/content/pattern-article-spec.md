# Feature: Pattern Article Template

## Blueprint

### Context

Pattern articles describe **architectural solutions**—reusable structural designs that solve recurring problems in agentic software development. Patterns define the *shape* of a solution, not the step-by-step execution.

**Primary Purpose:**
- **Architectural Blueprint** — Define the structure/form of a solution
- **Reusable Design** — Can be instantiated across different contexts
- **Problem-Solution Pairing** — Clear problem statement with structural response

**What Patterns Define:**
- The **shape** of a solution (anatomy, components, relationships)
- The **problem** it solves (context, forces, constraints)
- The **why** behind the structure (rationale, trade-offs)
- The **relationships** to other patterns (composition, alternatives)

**What Patterns Are NOT:**
- Step-by-step instructions (that's a Practice)
- Implementation guides (that's a Practice)
- Tool configuration (that's a Practice)
- Operational workflows (that's a Practice)

**The Analogy:**
- **Pattern** = Blueprint (the architectural plan for a house)
- **Practice** = Construction Manual (how to build the house)

### Pattern vs Practice Decision Tree

**Ask yourself:**

1. **Does this describe a structure/form that can be reused?**
   - YES → Pattern
   - NO → Practice

2. **Is this answering "What is the solution?" vs "How do I do it?"**
   - "What" → Pattern
   - "How" → Practice

3. **Could this be instantiated in different contexts without changing the core idea?**
   - YES → Pattern
   - NO → Practice

4. **Is this primarily about anatomy/components vs steps/process?**
   - Anatomy → Pattern
   - Steps → Practice

### Architecture

**File Structure:**
```
src/content/patterns/
  ├── {slug}.md           # Markdown with YAML frontmatter
  └── {slug}.mdx          # MDX if interactive components needed
```

**Schema:** Defined in `src/content/config.ts` under `patternsCollection`

**Rendering:**
- Index page: `/patterns` (card grid)
- Detail page: `/patterns/{slug}` (full article)
- Field Manual: Compiled with other collections

### Content Structure

Every pattern article SHOULD follow this structure:

#### 1. Frontmatter (Required)

```yaml
---
title: "Pattern Name"                    # Noun phrase, Title Case
description: "One-sentence summary..."   # Max 200 chars, describes the solution
tags: ["Tag1", "Tag2"]                   # 2-5 tags
relatedIds: ["patterns/foo", "practices/bar"]  # Related patterns AND practices
lastUpdated: 2025-01-15                  # ISO 8601 date
status: "Live"                           # Live | Experimental | Draft | Proposed | Deprecated
---
```

#### 2. Definition (Required)

**Opening paragraph** that answers: "What is this pattern?"

**Format:**
```markdown
## Definition

[Noun-based definition: "The X is a Y that..."]

[What problem does it solve? What is the core insight?]
```

**Requirements:**
- Lead with a noun definition, not an action
- State the problem/context clearly
- One paragraph, 2-4 sentences

**Example (Good):**
```markdown
## Definition

A **Spec** is the permanent source of truth for a feature. It defines *how* the system works (Design) and *how* we know it works (Quality).

Unlike traditional tech specs that are "fire and forget," specs are **living documents** that reside in the repository alongside the code.
```

**Example (Bad - reads like a practice):**
```markdown
## Definition

To create a spec, first identify the feature domain, then create a markdown file...
```

#### 3. The Problem (Required)

**Section** explaining what fails without this pattern.

**Format:**
```markdown
## The Problem: [Problem Name]

[What goes wrong without this pattern?]

[Why do existing approaches fail?]
```

**Requirements:**
- Name the problem clearly
- Explain the forces/constraints that create the problem
- Show why naive solutions fail

#### 4. The Solution (Required)

**Section** describing the pattern's structural response.

**Format:**
```markdown
## The Solution: [Solution Name]

[High-level description of the structural solution]

[Key insight or inversion that makes this work]
```

**Requirements:**
- Describe the structure, not the steps
- Explain the key insight
- Keep it conceptual

#### 5. Anatomy / Structure (Required)

**Section** breaking down the pattern's components.

**Format:**
```markdown
## Anatomy

[Overview of components/parts]

### Component 1
[Description of this part and its role]

### Component 2
[Description of this part and its role]
```

**Optional Elements:**
- Diagrams (Mermaid or static images)
- Tables comparing components
- Code examples showing structure (not process)

#### 6. Relationships (Required)

**Section** connecting pattern to other patterns and practices.

**Format:**
```markdown
## Relationship to Other Patterns

**[Pattern Name]** — [How this pattern relates]

**[Practice Name]** — [The practice that implements this pattern]
```

**Requirements:**
- Link to related patterns (composition, alternatives)
- Link to the practice(s) that implement this pattern
- Explain the nature of the relationship

#### 7. References (Optional)

**Section** linking to external sources.

**Format:**
```markdown
## References

- [Source Name](https://example.com) — Brief annotation
```

### Content Guidelines

**Tone:**
- **Architectural** — Describing structure, not process
- **Abstract** — Transferable across contexts
- **Definitive** — This is the canonical form

**Voice:**
- Noun-based definitions ("The X is a Y")
- Present tense for structure ("The pattern consists of...")
- Avoid imperative ("Do this...") — save that for practices

**What to Include:**
- Problem/context description
- Structural solution
- Component breakdown
- Relationships to other patterns
- Diagrams where helpful

**What to Exclude:**
- Step-by-step instructions (→ Practice)
- Templates with blanks to fill (→ Practice)
- Configuration examples (→ Practice)
- "How to" sections (→ Practice)

**Length:**
- Minimum: 600 words
- Maximum: 2000 words
- Sweet spot: 800-1200 words

### Anti-Patterns

**The Practice in Disguise**
- **Problem:** Pattern article is full of "how to" instructions
- **Solution:** Extract step-by-step content to a linked Practice article

**The Template Dump**
- **Problem:** Pattern is mostly templates/examples, not structural explanation
- **Solution:** Move templates to Practice, keep conceptual structure in Pattern

**The Orphaned Pattern**
- **Problem:** No linked Practice explaining implementation
- **Solution:** Every Pattern should link to at least one Practice (or note "Implementation guidance: TBD")

**The Vague Abstraction**
- **Problem:** Pattern is so abstract it provides no actionable insight
- **Solution:** Include concrete structural examples while keeping conceptual focus

---

## Contract

### Definition of Done

**Content Quality:**
- [ ] Title is a noun phrase (not an action)
- [ ] Definition answers "What is this?" not "How do I?"
- [ ] Problem section clearly states what fails without this pattern
- [ ] Solution section describes structure, not steps
- [ ] Anatomy section breaks down components
- [ ] Relationships link to related patterns AND implementing practices
- [ ] No "how to" instructions in the article (those belong in Practices)
- [ ] Length: 600-2000 words

**Technical Quality:**
- [ ] `pnpm check` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm build` succeeds
- [ ] Article appears in `/patterns` index

**Structural Quality:**
- [ ] Linked Practice exists or is noted as "TBD"
- [ ] Mermaid diagrams generated if used

### Regression Guardrails

- Pattern articles MUST describe structure, not process
- Pattern titles MUST be noun phrases
- Pattern articles MUST link to implementing Practice(s)
- If a pattern has no Practice, note "Implementation: See [Practice Name] (TBD)"

### Scenarios

**Scenario: Create new pattern**
- Given: A reusable structural solution needs documentation
- When: Author creates pattern article
- Then: Article describes anatomy/structure, links to implementing practice

**Scenario: Pattern has step-by-step content**
- Given: Pattern article contains "how to" instructions
- When: Reviewing for compliance
- Then: Extract instructions to a Practice article, link from Pattern

**Scenario: Distinguish pattern from practice**
- Given: Unclear whether content is pattern or practice
- When: Applying decision tree
- Then: "What is the structure?" → Pattern, "How do I do it?" → Practice

---

## Implementation Notes

### Schema Reference

From `src/content/config.ts`:

```typescript
const patternsCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/patterns' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    tags: z.array(z.string()).optional().default([]),
    relatedIds: z.array(z.string()).optional().default([]),
    lastUpdated: z.coerce.date(),
    status: z.enum(['Draft', 'Proposed', 'Live', 'Experimental', 'Deprecated']),
  }),
});
```

### Pattern-Practice Pairing

Every Pattern should have a corresponding Practice:

| Pattern | Implementing Practice |
|---------|----------------------|
| The Spec | Living Specs |
| The PBI | PBI Authoring |
| Agent Constitution | AGENTS.md Specification |
| Model Routing | Agent Personas |
| Experience Modeling | Design System Governance (TBD) |

---

## Resources

- Pattern: [Specs](/patterns/the-spec) — Example of well-structured pattern
- Practice: [Living Specs](/practices/living-specs) — Example of implementing practice
- Concept: [Spec-Driven Development](/concepts/spec-driven-development) — Conceptual foundation
- Reference: [A Pattern Language (Christopher Alexander)](https://en.wikipedia.org/wiki/A_Pattern_Language) — Origin of pattern thinking
- Reference: [Design Patterns (GoF)](https://en.wikipedia.org/wiki/Design_Patterns) — Software patterns foundation
