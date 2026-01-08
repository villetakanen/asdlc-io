# PBI-50: Create ArticleReferences Component

## Description

Create the `<ArticleReferences>` Astro component that renders structured references in APA-inspired format with annotations.

## Spec Reference

`plans/article-references/spec.md` — Component Design and CSS Styling sections

## Acceptance Criteria

- [x] Component created at `src/components/ArticleReferences.astro`
- [x] Props interface: `{ references: Reference[] }`
- [x] Renders semantic HTML: `<section>`, `<ol>`, `<li>`, `<cite>`, `<time>`
- [x] APA-inspired format: Author (Year). *Title*. Accessed Date.
- [x] Annotation displayed below each citation
- [x] Uses Avionics Palette tokens (`--c-border`, `--c-text-secondary`, `--s-grid`)
- [x] Gracefully handles missing optional fields
- [x] Accessible: proper heading hierarchy, link attributes (`rel="external noopener"`)

## Technical Notes

See spec for exact CSS using `calc(var(--s-grid) * N)` pattern.

Component should normalize `author` to `authors` array internally for consistent rendering.

## Implementation Notes

**Status:** ✅ Complete

**Changes Made:**

1. **Created `ArticleReferences.astro` component** (`src/components/ArticleReferences.astro`):
   - Props interface: `{ references: Reference[] }`
   - Returns early if no references (clean no-render behavior)
   - Helper functions for consistent formatting:
     - `getAuthors()`: Normalizes `author`/`authors` to array
     - `formatAuthorList()`: APA-style author formatting (First, Second, & Last)
     - `formatDate()`: Converts Date to readable format
     - `formatYear()`: Extracts year for citation

2. **APA-Inspired Citation Format**:
   - Author (Year). *Title*. Publisher. ISBN/DOI. Accessed Date.
   - Authors displayed in bold (`font-weight: 700`)
   - Title in italics with brand color if linked
   - Optional fields gracefully omitted when missing
   - All metadata (publisher, ISBN, DOI, accessed) in secondary color

3. **Semantic HTML Structure**:
   - `<section class="article-references">` wrapper
   - `<h2>References</h2>` heading
   - `<ol class="reference-list">` ordered list
   - `<li class="reference reference--{type}">` with type modifier
   - `<cite class="reference-citation">` for citation
   - `<p class="reference-annotation">` for explanatory text

4. **Avionics Palette Styling**:
   - Uses design tokens: `--c-border`, `--c-text-secondary`, `--c-text-primary`, `--c-brand`, `--c-brand-hover`
   - Spacing via `--s-grid` and `--s-gap` with `calc()` expressions
   - Typography: `--f-sans` for headings
   - Border-top separator: `1px solid var(--c-border)`

5. **Accessibility Features**:
   - Proper heading hierarchy (h2 for References section)
   - External links: `rel="external noopener"` attribute
   - Semantic `<cite>` for citations
   - Ordered list for numbered references
   - Clear visual hierarchy with secondary text for metadata

6. **Layout Integration**:
   - Added to `src/pages/concepts/[...slug].astro`
   - Added to `src/pages/patterns/[...slug].astro`
   - Added to `src/pages/practices/[...slug].astro`
   - Positioned after article content, before footer
   - Automatically hidden when `references` array is empty

**Validation:**

- ✅ `pnpm check` passes with 0 errors
- ✅ `pnpm build` succeeds (42 pages built)
- ✅ Created test article with all 7 reference types - rendered correctly
- ✅ Component gracefully handles missing optional fields
- ✅ Early return prevents rendering when no references present
- ✅ All three collection layouts (concepts, patterns, practices) integrated

**CSS Details:**

```css
.article-references {
  margin-block: calc(var(--s-grid) * 2);  /* 48px top/bottom margin */
  padding-block-start: var(--s-gap);       /* 1.5rem top padding */
  border-block-start: 1px solid var(--c-border);
}

.reference-list {
  list-style: decimal;
  padding-inline-start: var(--s-grid);     /* 24px indent */
}

.reference {
  margin-block-end: var(--s-grid);         /* 24px spacing between items */
}

.reference-annotation {
  color: var(--c-text-secondary);
  font-size: 0.875rem;                     /* Matches design system small text */
  margin-block-start: calc(var(--s-grid) * 0.5);  /* 12px top margin */
}
```

**Next Steps:**
- PBI-51: Already complete (layout integration done in this PBI)
- PBI-52: Update MCP server to include references in responses
- PBI-53: Migrate existing articles to use structured references
