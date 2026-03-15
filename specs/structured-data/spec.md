# Feature: Article Structured Data & Meta Tags

## Blueprint

### Context

Every article page (concepts, patterns, practices) emits two layers of machine-readable metadata:

1. **Schema.org JSON-LD** — via `StructuredData.astro` component (consumed by Google, Bing, AI crawlers)
2. **HTML meta tags** — via `SEOMetadata.astro` through `BaseLayout` (consumed by social platforms, search engines)

Both layers must faithfully reflect the article's frontmatter. A GEO audit revealed that the **patterns collection** has degraded structured data: hardcoded descriptions and missing keywords. This spec defines the contract that all three collection routes must fulfill.

### Architecture

**Data Flow:**

```
src/content/{collection}/*.md  (frontmatter: title, description, tags)
        │
        ▼
src/pages/{collection}/[...slug].astro  (builds structuredDataProps)
        │
        ├──► StructuredData.astro  →  <script type="application/ld+json">
        │      • description → Schema.org `description`
        │      • tags        → Schema.org `keywords`
        │
        └──► BaseLayout  →  SEOMetadata.astro
               • description → <meta name="description">
               • description → <meta property="og:description">
```

**Affected Files:**

| File | Role |
|:-----|:-----|
| `src/pages/patterns/[...slug].astro` | **Bug source.** Hardcodes description, omits keywords. |
| `src/pages/concepts/[...slug].astro` | **Reference implementation.** Correct behavior. |
| `src/pages/practices/[...slug].astro` | **Reference implementation.** Correct behavior. |
| `src/components/StructuredData.astro` | Consumer — renders JSON-LD from props. No changes needed. |
| `src/components/SEOMetadata.astro` | Consumer — renders meta tags from `BaseLayout` props. No changes needed. |
| `src/layouts/BaseLayout.astro` | Pass-through for `title` and `description`. No changes needed. |

### Current Bug (patterns/[...slug].astro)

**Line 30 — Hardcoded description:**
```typescript
// BUG: Ignores frontmatter description
description: `Architectural pattern: ${pattern.data.title}`,
```

**Missing keywords:** No `keywords` property in `structuredDataProps` (concepts and practices both include it).

**Line 40 — Hardcoded BaseLayout description:**
```html
<!-- BUG: Same hardcoded string passed to meta tags -->
<BaseLayout title={pattern.data.title} description={`Architectural pattern: ${pattern.data.title}`}>
```

**Impact:** All 16 pattern pages have:
- JSON-LD `description` = "Architectural pattern: {title}" instead of the curated frontmatter description
- No `keywords` in JSON-LD (tags array is discarded)
- `<meta name="description">` = same hardcoded string
- `<meta property="og:description">` = same hardcoded string

### Anti-Patterns

- **Synthetic descriptions:** Do not generate descriptions from titles or other fields. The frontmatter `description` field exists specifically because it was authored to be concise and accurate (max 200 chars, enforced by Zod schema).
- **Collection-specific prefixes:** Do not prefix descriptions with "Concept:", "Pattern:", or "Practice:". The Schema.org `@type: TechArticle` already communicates the content type. Prefixes waste the 200-char budget and add no semantic value.
- **Inconsistent prop shapes:** All three collection routes must pass the same shape to `StructuredData`. Divergence creates maintenance debt and makes bugs harder to spot.

## Contract

### Definition of Done

- [x] `patterns/[...slug].astro` passes `pattern.data.description` (not a hardcoded string) to both `structuredDataProps.description` and `BaseLayout description=`
- [x] `patterns/[...slug].astro` passes `pattern.data.tags?.join(", ")` as `structuredDataProps.keywords`
- [x] All three `[...slug].astro` routes produce identical `structuredDataProps` shapes (same keys, same source fields)
- [ ] `pnpm build` succeeds (validates all 87 pages render without error)
- [ ] Spot-check: view-source on a built pattern page confirms JSON-LD `description` matches frontmatter and `keywords` field is present
- [x] `pnpm check` passes with 0 errors

### Regression Guardrails

- The `description` field in `structuredDataProps` MUST always originate from `{entry}.data.description` — never from string interpolation or concatenation
- The `keywords` field MUST always originate from `{entry}.data.tags` — never hardcoded
- `BaseLayout` `description` prop MUST match the value passed to `structuredDataProps.description` — a single source of truth, no divergence
- `StructuredData.astro` and `SEOMetadata.astro` are consumers only — fixes go in the page routes, not the components

### Scenarios

**Scenario: Pattern page renders correct structured data**
- Given: Pattern "The Spec" has frontmatter `description: "Living documents that serve as the permanent source of truth..."`
- When: The page `/patterns/the-spec` is built
- Then: JSON-LD contains `"description": "Living documents that serve as the permanent source of truth..."`
- And: JSON-LD contains `"keywords": "Documentation, Living Documentation, Spec-Driven Development, Context Engineering"`

**Scenario: Pattern page renders correct meta tags**
- Given: Pattern "The Spec" has frontmatter `description: "Living documents that serve as the permanent source of truth..."`
- When: The page `/patterns/the-spec` is built
- Then: `<meta name="description">` contains the frontmatter description
- And: `<meta property="og:description">` contains the frontmatter description

**Scenario: Pattern with no tags**
- Given: A pattern has `tags: undefined` in frontmatter
- When: The page is built
- Then: JSON-LD omits the `keywords` field entirely (no empty string)
- And: No build error occurs

**Scenario: All collections are consistent**
- Given: Concepts, patterns, and practices routes exist
- When: All three are compared
- Then: The `structuredDataProps` object uses the same keys and same data sources in all three

## Implementation Notes

The fix is a 3-line change in `src/pages/patterns/[...slug].astro`:

1. **Line 30:** Change `description` value from template literal to `pattern.data.description`
2. **Add line:** Add `keywords: pattern.data.tags?.join(", ")` to `structuredDataProps`
3. **Line 40:** Change `BaseLayout description=` from template literal to `{pattern.data.description}`

Reference the concepts route (`src/pages/concepts/[...slug].astro:28-34`) as the canonical example — the fix makes patterns match concepts exactly.

Also note: the patterns route includes `datePublished` (line 31) while concepts and practices only include `dateModified`. Since both map to `lastUpdated`, consider aligning to `dateModified` only for consistency — but this is a separate concern from the bug fix.

## Resources

- [Schema.org TechArticle](https://schema.org/TechArticle) — The structured data type used
- `specs/patterns-index/spec.md` — Related spec for the patterns collection
