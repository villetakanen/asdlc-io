# PBI-51: Integrate ArticleReferences into Article Layouts

## Description

Update article layouts to render the `<ArticleReferences>` component from frontmatter data at article end, positioned after content but before footer navigation.

## Spec Reference

`plans/article-references/spec.md` — Integration Points: Article Layouts section

## Acceptance Criteria

- [ ] `[...slug].astro` (or equivalent layouts) import `ArticleReferences.astro`
- [ ] Component rendered conditionally when `references.length > 0`
- [ ] Positioned after article body content, before footer/navigation
- [ ] Works for all content collections: concepts, patterns, practices
- [ ] Visual placement doesn't clash with existing `relatedIds` in header

## Dependencies

- PBI-49 (Reference Schema)
- PBI-50 (ArticleReferences Component)
