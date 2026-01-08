# PBI-50: Create ArticleReferences Component

## Description

Create the `<ArticleReferences>` Astro component that renders structured references in APA-inspired format with annotations.

## Spec Reference

`plans/article-references/spec.md` — Component Design and CSS Styling sections

## Acceptance Criteria

- [ ] Component created at `src/components/ArticleReferences.astro`
- [ ] Props interface: `{ references: Reference[] }`
- [ ] Renders semantic HTML: `<section>`, `<ol>`, `<li>`, `<cite>`, `<time>`
- [ ] APA-inspired format: Author (Year). *Title*. Accessed Date.
- [ ] Annotation displayed below each citation
- [ ] Uses Avionics Palette tokens (`--c-border`, `--c-text-secondary`, `--s-grid`)
- [ ] Gracefully handles missing optional fields
- [ ] Accessible: proper heading hierarchy, link attributes (`rel="external noopener"`)

## Technical Notes

See spec for exact CSS using `calc(var(--s-grid) * N)` pattern.

Component should normalize `author` to `authors` array internally for consistent rendering.
