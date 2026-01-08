# Feature: Practice Article Template

## Blueprint

### Context

Practice articles describe **operational processes**—step-by-step instructions for executing specific tasks in agentic software development. Practices define *how* to do something, not the structural form of the solution.

**Primary Purpose:**
- **Operational Guide** — Define the steps/process for execution
- **Implementation Instructions** — Concrete, actionable guidance
- **Repeatability** — Can be followed to achieve consistent results

**What Practices Define:**
- The **steps** of execution (workflow, sequence, process)
- The **inputs and outputs** (what you start with, what you end with)
- The **tools and templates** (concrete artifacts, configuration)
- The **decision points** (when to do what, branching logic)

**What Practices Are NOT:**
- Structural definitions (that's a Pattern)
- Conceptual explanations (that's a Concept)
- Terminology clarification (that's a Concept)
- Problem/solution framing (that's a Pattern)

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
src/content/practices/
  ├── {slug}.md           # Markdown with YAML frontmatter
  └── {slug}.mdx          # MDX if interactive components needed
```

**Schema:** Defined in `src/content/config.ts` under `practicesCollection`

**Rendering:**
- Index page: `/practices` (card grid)
- Detail page: `/practices/{slug}` (full article)
- Field Manual: Compiled with other collections

### Content Structure

Every practice article SHOULD follow this structure:

#### 1. Frontmatter (Required)

```yaml
---
title: "Practice Name"                   # Verb phrase or gerund, Title Case
description: "One-sentence summary..."   # Max 200 chars, describes the process
tags: ["Tag1", "Tag2"]                   # 2-5 tags
relatedIds: ["patterns/foo", "practices/bar"]  # Related patterns AND practices
lastUpdated: 2025-01-15                  # ISO 8601 date
status: "Live"                           # Live | Experimental | Draft | Proposed | Deprecated
references?: []                          # External sources (see Article References spec)
---
```

#### 2. Definition (Required)

**Opening paragraph** that answers: "What does this practice accomplish?"

**Format:**
```markdown
## Definition

[Verb-based definition: "X is the process of..." or "X defines how to..."]

[What outcome does following this practice produce?]
```

**Requirements:**
- Lead with a verb or process description
- State the outcome/goal clearly
- One paragraph, 2-4 sentences

**Example (Good):**
```markdown
## Definition

**Living Specs** is the practice of maintaining specs as executable, version-controlled documents that evolve alongside the codebase.

Instead of static documentation that drifts from reality, living specs are continuously validated through CI/CD pipelines and updated as part of the development workflow.
```

**Example (Bad - reads like a pattern):**
```markdown
## Definition

A Living Spec is a document structure consisting of a Blueprint section, Contract section, and Implementation Notes...
```

#### 3. When to Use (Required)

**Section** explaining when this practice applies.

**Format:**
```markdown
## When to Use

[Trigger conditions or contexts where this practice applies]

**Use this practice when:**
- [Condition 1]
- [Condition 2]

**Skip this practice when:**
- [Exception 1]
- [Exception 2]
```

**Requirements:**
- Clear trigger conditions
- Explicit exceptions/exclusions
- Contextual guidance

#### 4. The Process (Required)

**Section** providing step-by-step instructions.

**Format:**
```markdown
## Process

### Step 1: [Action Name]

[What to do]

[Why this step matters]

### Step 2: [Action Name]

[What to do]

[Decision points, if any]

### Step 3: [Action Name]

[What to do]

[Expected output]
```

**Requirements:**
- Numbered or named steps
- Imperative voice ("Do this," "Create that")
- Clear inputs and outputs per step
- Decision points marked explicitly

#### 5. Templates & Examples (Recommended)

**Section** providing concrete artifacts.

**Format:**
```markdown
## Templates

### [Template Name]

```[language]
[Template content with placeholders]
```

**Placeholders:**
- `{placeholder}` — Description of what goes here
```

**Requirements:**
- Usable templates (copy-paste ready)
- Clear placeholder documentation
- Example instantiations where helpful

#### 6. Common Mistakes (Recommended)

**Section** highlighting failure modes.

**Format:**
```markdown
## Common Mistakes

### [Mistake Name]

**Problem:** [What goes wrong]

**Solution:** [How to avoid or fix]
```

**Requirements:**
- Named, recognizable mistakes
- Clear problem-solution pairs
- Based on real experience

#### 7. Related Patterns (Required)

**Section** connecting practice to implementing patterns.

**Format:**
```markdown
## Related Patterns

This practice implements:

- **[Pattern Name]** — [How this practice implements that pattern]

See also:

- **[Practice Name]** — [Related process]
```

**Requirements:**
- Link to the Pattern(s) this practice implements
- Explain the relationship
- Link to related practices

### Content Guidelines

**Tone:**
- **Instructional** — Guiding action, not describing structure
- **Concrete** — Specific steps, not abstract concepts
- **Practical** — Focused on execution

**Voice:**
- Verb-based definitions ("The process of...", "How to...")
- Imperative for instructions ("Create a file...", "Run the command...")
- Second person acceptable ("You should...", "Your next step...")

**What to Include:**
- Step-by-step process
- Templates and examples
- Configuration snippets
- Decision trees/flowcharts
- Common mistakes and fixes

**What to Exclude:**
- Structural definitions (→ Pattern)
- Conceptual explanations (→ Concept)
- "What is X?" sections (→ Pattern or Concept)
- Problem/solution framing (→ Pattern)

**Length:**
- Minimum: 400 words
- Maximum: 2500 words
- Sweet spot: 600-1500 words

### Anti-Patterns

**The Pattern in Disguise**
- **Problem:** Practice article focuses on structure/anatomy instead of process
- **Solution:** Extract structural content to a Pattern article, keep steps in Practice

**The Concept Creep**
- **Problem:** Practice spends too much time explaining terminology
- **Solution:** Link to Concept articles for definitions, focus on execution

**The Wall of Text**
- **Problem:** Process buried in prose without clear steps
- **Solution:** Use numbered steps, headers, and bulleted lists for scannability

**The Orphaned Practice**
- **Problem:** No linked Pattern explaining the underlying structure
- **Solution:** Every Practice should implement at least one Pattern (or note "Pattern: TBD")

**The Template Dump**
- **Problem:** Practice is just templates with no process explanation
- **Solution:** Templates support the process, they don't replace it

---

## Contract

### Definition of Done

**Content Quality:**
- [ ] Title is verb-based or gerund (action-oriented)
- [ ] Definition answers "How do I do this?" not "What is this?"
- [ ] When to Use section clearly states trigger conditions
- [ ] Process section has numbered/named steps
- [ ] Steps use imperative voice
- [ ] Templates are copy-paste ready with documented placeholders
- [ ] Related Patterns links to the pattern(s) this implements
- [ ] No structural definitions in the article (those belong in Patterns)
- [ ] Length: 400-2500 words

**Technical Quality:**
- [ ] `pnpm check` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm build` succeeds
- [ ] Article appears in `/practices` index

**Structural Quality:**
- [ ] Linked Pattern exists or is noted as "TBD"
- [ ] Templates are syntactically valid

### Regression Guardrails

- Practice articles MUST describe process, not structure
- Practice titles SHOULD be verb-based or gerunds
- Practice articles MUST link to implemented Pattern(s)
- If a practice has no Pattern, note "Implements: [Pattern Name] (TBD)"

### Scenarios

**Scenario: Create new practice**
- Given: A repeatable process needs documentation
- When: Author creates practice article
- Then: Article describes steps/process, links to underlying pattern

**Scenario: Practice has structural content**
- Given: Practice article contains anatomy/structure descriptions
- When: Reviewing for compliance
- Then: Extract structure to a Pattern article, link from Practice

**Scenario: Distinguish practice from pattern**
- Given: Unclear whether content is pattern or practice
- When: Applying decision tree
- Then: "How do I do it?" → Practice, "What is the structure?" → Pattern

---

## Implementation Notes

### Schema Reference

From `src/content/config.ts`:

```typescript
const practicesCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/practices' }),
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

Every Practice should implement a corresponding Pattern:

| Practice | Implements Pattern |
|----------|-------------------|
| Living Specs | The Spec |
| PBI Authoring | The PBI |
| AGENTS.md Specification | Agent Constitution |
| Agent Personas | Model Routing |
| Adversarial Code Review | Quality Gates (TBD) |

---

## Resources

- Practice: [Living Specs](/practices/living-specs) — Example of well-structured practice
- Pattern: [The Spec](/patterns/the-spec) — Example of underlying pattern
- Concept: [Spec-Driven Development](/concepts/spec-driven-development) — Conceptual foundation
- Spec: [Pattern Article Template](/docs/specs/content/pattern-article-spec.md) — Companion spec for patterns
