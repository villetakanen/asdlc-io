# PBI-51: Integrate ArticleReferences into Article Layouts

## Description

Update article layouts to render the `<ArticleReferences>` component from frontmatter data at article end, positioned after content but before footer navigation.

## Spec Reference

`plans/article-references/spec.md` — Integration Points: Article Layouts section

## Acceptance Criteria

- [x] `[...slug].astro` (or equivalent layouts) import `ArticleReferences.astro`
- [x] Component rendered conditionally when `references.length > 0`
- [x] Positioned after article body content, before footer/navigation
- [x] Works for all content collections: concepts, patterns, practices
- [x] Visual placement doesn't clash with existing `relatedIds` in header

## Dependencies

- PBI-49 (Reference Schema)
- PBI-50 (ArticleReferences Component)

## Implementation Notes

**Status:** ✅ Complete (implemented in PBI-50)

**Changes Made:**

This PBI was completed as part of PBI-50 implementation. The following layouts were updated:

1. **`src/pages/concepts/[...slug].astro`**:
   - Added `import ArticleReferences from "../../components/ArticleReferences.astro"`
   - Added `<ArticleReferences references={concept.data.references} />` after content

2. **`src/pages/patterns/[...slug].astro`**:
   - Added `import ArticleReferences from "../../components/ArticleReferences.astro"`
   - Added `<ArticleReferences references={pattern.data.references} />` after content

3. **`src/pages/practices/[...slug].astro`**:
   - Added `import ArticleReferences from "../../components/ArticleReferences.astro"`
   - Added `<ArticleReferences references={practice.data.references} />` after content

**Integration Details:**

- Component automatically handles empty references (early return when `references.length === 0`)
- Positioned after `<div class="prose content-prose">` section
- Before closing `</article>` tag (no footer/navigation present in current layouts)
- No visual clash with `relatedIds` (those appear in SpecHeader, references appear at article end)

**Validation:**

- ✅ All three collection layouts integrated
- ✅ `pnpm check` passes with 0 errors
- ✅ `pnpm build` succeeds (42 pages built)
- ✅ Component renders only when references present
- ✅ Proper semantic placement in document flow

**Next Steps:**
- PBI-52: Update MCP server to include references in responses
- PBI-53: Migrate existing articles to use structured references
