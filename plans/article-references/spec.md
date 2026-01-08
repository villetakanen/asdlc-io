# Feature: Structured Article References

## Blueprint

### Context

External references in ASDLC articles (concepts, patterns, practices) currently appear inline using Wikipedia-style markdown links. This approach creates several problems:

1. **No semantic structure** — References are plain links with no metadata (type, author, publication date)
2. **Inline noise** — External links break reading flow within article body
3. **No unified rendering** — Each article formats references differently
4. **Limited metadata** — Cannot query or aggregate references across articles

This spec defines a structured references system inspired by APA citation format, with richer explanatory context suited to a knowledge base.

### Goals

1. **Structured Data** — Store references in YAML frontmatter for type safety and queryability
2. **Design System Component** — `<ArticleReferences>` component renders references consistently
3. **Footnotes Pattern** — References appear at article end, not inline, as a "Further Reading" section
4. **Explanatory Context** — Each reference includes a brief annotation explaining relevance

---

## Architecture

### Frontmatter Schema

Add `references` array to all content collection schemas:

```yaml
---
title: "Article Title"
# ... existing fields ...
references:
  - type: "website"
    title: "OpenAI Best Practices for Prompt Engineering"
    url: "https://platform.openai.com/docs/guides/prompt-engineering"
    author: "OpenAI"
    published: 2024-01-15
    accessed: 2026-01-08
    annotation: "Foundational guidance on structuring prompts for LLMs."
    
  - type: "paper"
    title: "Constitutional AI: Harmlessness from AI Feedback"
    url: "https://arxiv.org/abs/2212.08073"
    authors: ["Yuntao Bai", "Saurav Kadavath", "et al."]
    published: 2022-12-15
    annotation: "Introduces the constitutional training methodology underpinning Claude's behavior."
    
  - type: "podcast"
    title: "Claude Code and the Future of AI-Assisted Development"
    url: "https://peterman.fm/boris-cherny"
    author: "Boris Cherny"
    publisher: "The Peterman Podcast"
    published: 2025-12-01
    annotation: "Primary source for Claude Code creator's perspective on disciplined AI development."
    
  - type: "book"
    title: "Domain-Driven Design"
    author: "Eric Evans"
    isbn: "978-0321125217"
    published: 2003-08-22
    annotation: "Seminal work on modeling complex domains in software."
    
  - type: "repository"
    title: "NeMo Guardrails"
    url: "https://github.com/NVIDIA/NeMo-Guardrails"
    author: "NVIDIA"
    annotation: "Example of industry approach that mixes deterministic and probabilistic controls."
---
```

### Reference Types

| Type | Required Fields | Optional Fields | Use Case |
|:-----|:----------------|:----------------|:---------|
| `website` | `title`, `url`, `accessed` | `author`, `published`, `publisher` | Blog posts, documentation, articles |
| `paper` | `title`, `url` | `authors`, `published`, `doi` | Academic papers, arXiv preprints |
| `book` | `title`, `author` | `isbn`, `published`, `publisher` | Books, textbooks |
| `podcast` | `title`, `url` | `author`, `publisher`, `published` | Podcast episodes, interviews |
| `video` | `title`, `url` | `author`, `publisher`, `published`, `duration` | YouTube videos, conferences |
| `repository` | `title`, `url` | `author`, `stars`, `language` | GitHub repos, code references |
| `standard` | `title` | `url`, `organization`, `version` | W3C, ISO, RFC standards |

**All types require:** `annotation` (explanatory text about relevance)

> **Note on `accessed`:** In APA style, the retrieval date is essential for web content that may change. Making `accessed` required for `type: 'website'` ensures future-proofing of citations.

### Author Format Convention

The schema allows both `author` (string) and `authors` (array). To simplify rendering and searching:

- **Internally normalize** to `authors` array during rendering
- Use `author` for single-author works (convenience)
- Use `authors` for multi-author works (academic papers)

### Zod Schema Extension

```typescript
// src/content/config.ts

const baseReferenceSchema = z.object({
  type: z.enum(['website', 'paper', 'book', 'podcast', 'video', 'repository', 'standard']),
  title: z.string(),
  url: z.string().url().optional(),
  author: z.string().optional(),
  authors: z.array(z.string()).optional(),
  publisher: z.string().optional(),
  published: z.coerce.date().optional(),
  accessed: z.coerce.date().optional(),
  isbn: z.string().optional(),
  doi: z.string().optional(),
  annotation: z.string(), // Always required
});

// Refinement: accessed is required for website type
const referenceSchema = baseReferenceSchema.refine(
  (data) => data.type !== 'website' || data.accessed !== undefined,
  { message: 'Website references require an accessed date', path: ['accessed'] }
);

// Add to all content collections:
references: z.array(referenceSchema).optional().default([]),
```

---

## Component Design

### `<ArticleReferences>` Component

**Location:** `src/components/ArticleReferences.astro`

**Props:**
```typescript
interface Props {
  references: Reference[];
}
```

**Rendering Logic:**

1. **Group by type** (optional, can be flat list)
2. **APA-inspired format** with explanatory annotation
3. **Semantic HTML** for accessibility
4. **Consistent styling** via design system tokens

**Example Output:**

```html
<section class="article-references">
  <h2>References</h2>
  <ol class="reference-list">
    <li class="reference reference--website">
      <cite class="reference-citation">
        <span class="reference-author">OpenAI</span>
        (<time datetime="2024-01-15">2024</time>).
        <a href="https://..." class="reference-title" rel="external noopener">
          OpenAI Best Practices for Prompt Engineering
        </a>.
        <span class="reference-accessed">Accessed January 8, 2026.</span>
      </cite>
      <p class="reference-annotation">
        Foundational guidance on structuring prompts for LLMs.
      </p>
    </li>
    <!-- ... -->
  </ol>
</section>
```

### CSS Styling

Uses the project's Avionics Palette from `tokens.css`. Since the design system defines `--s-grid: 24px` and `--s-gap: 1.5rem` but not t-shirt sized spacing tokens, we use `calc()` expressions:

```css
/* Uses Avionics Palette from tokens.css */
.article-references {
  /* Spacing: 2 grid units (48px) top margin, 1.5 grid units (36px) top padding */
  margin-block: calc(var(--s-grid) * 2);
  padding-block-start: var(--s-gap);
  border-block-start: 1px solid var(--c-border);
}

.reference-list {
  list-style: decimal;
  padding-inline-start: var(--s-grid);
}

.reference {
  margin-block-end: var(--s-grid);
}

.reference-citation {
  font-style: normal;
  display: block;
}

.reference-author {
  /* 700 weight used in typography.css for strong/headings */
  font-weight: 700;
}

.reference-title {
  font-style: italic;
}

.reference-annotation {
  color: var(--c-text-secondary);
  /* 0.875rem matches typical small text in typography.css */
  font-size: 0.875rem;
  margin-block-start: calc(var(--s-grid) * 0.5);
}
```

---

## Content Migration

### Current Pattern (Wikipedia-style)

```markdown
## References

- **[NeMo Guardrails](https://github.com/NVIDIA/NeMo-Guardrails)** – An example of the industry approach.
- **Boris Cherny**, *The Peterman Podcast* (December 2025) — Claude Code creator's framework.
```

### New Pattern (Structured)

```yaml
references:
  - type: "repository"
    title: "NeMo Guardrails"
    url: "https://github.com/NVIDIA/NeMo-Guardrails"
    author: "NVIDIA"
    annotation: "An example of the industry approach that mixes deterministic and probabilistic controls."
    
  - type: "podcast"
    title: "Claude Code and the Future of AI-Assisted Development"
    url: "https://peterman.fm/boris-cherny"
    author: "Boris Cherny"
    publisher: "The Peterman Podcast"
    published: 2025-12-01
    annotation: "Claude Code creator's framework for disciplined AI-assisted development."
```

### Migration Scope

Articles with `## References` sections requiring migration:

| Article | Reference Count |
|:--------|:----------------|
| `concepts/guardrails.md` | 1 |
| `concepts/context-engineering.md` | 2 |
| `concepts/vibe-coding.md` | 3+ |
| *others TBD via grep* | — |

---

## Integration Points

### Article Layouts

All content layouts must:
1. **NOT render** the markdown `## References` section from body (via meta-component logic)
2. **Render** `<ArticleReferences>` component from frontmatter data at article end
3. Position references **after** article content but **before** footer navigation

### MCP Server

The MCP `get_article` tool should include structured references in its response for LLM consumption.

### Article Links in Body

Inline references **remain allowed** for:
- Internal links to other ASDLC articles (`[Context Gates](/patterns/context-gates)`)
- Brief parenthetical citations that don't warrant full references

External sources requiring attribution should move to frontmatter `references`.

> **Linting Recommendation:** Consider adding a future linting rule (e.g., via `remark-lint` or custom script) to flag external markdown links in article body that are not present in the `references` array. This ensures consistent attribution without being overly prescriptive.

### Relationship to `relatedIds`

The existing `relatedIds` frontmatter field serves a **different purpose**:

| Field | Purpose | Rendered By |
|:------|:--------|:------------|
| `relatedIds` | Internal ASDLC article cross-references (concepts, patterns, practices) | `SpecHeader.astro` ("Related" row in header metadata) |
| `references` | External sources, academic citations, documentation links | `ArticleReferences.astro` ("References" section at article end) |

**No duplication:** A link should appear in either `relatedIds` OR `references`, never both. Internal articles use `relatedIds`; external sources use `references`.

**Visual placement:**
- `relatedIds` → Displayed in **article header** (via `SpecHeader.astro`)
- `references` → Displayed at **article end** (via `ArticleReferences.astro`)

### Schema.org Integration

The `[...slug].astro` layout should ingest `references` into Schema.org structured data:

```typescript
// In structuredDataProps or schema generation
if (references && references.length > 0) {
  schemaData.citation = references.map(ref => ({
    '@type': ref.type === 'paper' ? 'ScholarlyArticle' : 'CreativeWork',
    name: ref.title,
    url: ref.url,
    author: ref.author || ref.authors?.join(', '),
    datePublished: ref.published?.toISOString().split('T')[0],
  }));
}
```

---

## Contract

### Definition of Done

**Schema:**
- [ ] `referenceSchema` added to `src/content/config.ts`
- [ ] All content collection schemas include `references` field
- [ ] Schema validates all reference types correctly

**Component:**
- [ ] `ArticleReferences.astro` component created
- [ ] Renders APA-inspired citations with annotations
- [ ] Accessible semantic HTML structure
- [ ] Styled per design system tokens

**Integration:**
- [ ] Article layouts render `<ArticleReferences>` at article end
- [ ] Markdown `## References` sections removed from body rendering
- [ ] MCP `get_article` includes structured references

**Migration:**
- [ ] All existing articles migrated to frontmatter references
- [ ] No remaining `## References` markdown sections

### Scenarios

**Scenario: Render structured references**
- Given: Article has `references` array in frontmatter
- When: Article page renders
- Then: References appear as styled footnotes below content

**Scenario: Website reference formatting**
- Given: Reference with `type: "website"`, author, date, URL
- When: Component renders
- Then: Output follows APA format: `Author (Year). Title. Retrieved Date.`

**Scenario: Missing optional fields**
- Given: Reference with only required fields (title, type, annotation)
- When: Component renders
- Then: Gracefully omits missing fields, no broken formatting

**Scenario: MCP returns references**
- Given: Article with structured references
- When: LLM calls `get_article` via MCP
- Then: Response includes typed references array

---

## Resources

- [APA Style 7th Edition](https://apastyle.apa.org/) — Citation format inspiration
- [concept-article-spec.md](file:///Users/ville.takanen/dev/asdlc-io/docs/specs/content/concept-article-spec.md) — Existing content spec
- [src/content/config.ts](file:///Users/ville.takanen/dev/asdlc-io/src/content/config.ts) — Schema definitions
