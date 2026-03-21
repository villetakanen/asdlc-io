# PBI-72: Views — Wire `longTitle` to SEO/H1 Consumers (Status: Done)

## 1. Directive
Update all view-layer consumers that render page titles for SEO, social sharing, or document headings to use `longTitle ?? title` instead of `title` alone. Card/list views continue using `title` (no changes needed).

## 2. Scope
- Components: SpecHeader, SEOMetadata, StructuredData
- Page routes: `[...slug].astro` for all 3 collections
- Compilation pages: fieldmanual.astro, compendium.astro (chapter headings only; TOC/sort stays on `title`)

## 3. Dependencies
- PBI-71 (schema must define `longTitle` before views can access it).

## 4. Changes Required

**Components (use `longTitle ?? title` for display):**
- [ ] `src/components/SpecHeader.astro` — Change H1 from `{title}` to `{data.longTitle ?? data.title}` (currently line 47). Destructuring at line 12 should extract `longTitle` alongside `title`.
- [ ] `src/components/SEOMetadata.astro` — Accept optional `longTitle` prop. Compute `pageTitle` from `longTitle ?? title`. Affects `<title>`, `og:title`, `twitter:title`.
- [ ] `src/components/StructuredData.astro` — Use `data.longTitle ?? data.title` for Schema.org `headline` (currently line 34).

**Page routes (pass `longTitle` through to layout/components):**
- [ ] `src/pages/concepts/[...slug].astro` — Pass `longTitle` to BaseLayout title prop and structuredDataProps: `title: concept.data.longTitle ?? concept.data.title`
- [ ] `src/pages/patterns/[...slug].astro` — Same pattern.
- [ ] `src/pages/practices/[...slug].astro` — Same pattern.

**Compilation pages (chapter headings use longTitle, TOC/sort use title):**
- [ ] `src/pages/fieldmanual.astro` — Chapter `<h2>` headings (lines ~245, 266, 287): use `entry.data.longTitle ?? entry.data.title`. TOC links and sort keys remain on `entry.data.title`.
- [ ] `src/pages/resources/compendium.astro` — Same pattern as fieldmanual. Chapter `<h2>` headings use longTitle; TOC and sort use title.

**No changes needed (already correct per spec):**
- `src/components/SpecCard.astro` — Receives and displays `title` prop (short title for cards).
- `src/components/SpecListItem.astro` — Receives and displays `title` prop (short title for lists).
- `src/components/SpecCardList.astro` — Passes `item.data.title` to SpecCard.

## 5. Verification
- [ ] `pnpm check` passes.
- [ ] `pnpm build` succeeds.
- [ ] For an article with `longTitle` set: page H1, `<title>`, og:title, twitter:title, Schema.org headline all render the longTitle value.
- [ ] For the same article: SpecCard and SpecListItem render the short `title`.
- [ ] For an article WITHOUT `longTitle`: all surfaces render `title` (backward compat).
- [ ] Fieldmanual/compendium chapter headings show longTitle; TOC links show short title.

## 6. Notes
- The SEOMetadata component currently receives `title` as a prop from BaseLayout. The cleanest approach: have slug pages pass `longTitle ?? title` as the `title` prop to BaseLayout, and have SpecHeader read `longTitle` directly from the `data` object it already receives.
- Alternatively, add a `longTitle` prop to BaseLayout/SEOMetadata for explicit plumbing. Choose whichever is simpler.

## 7. Blocks
- None (leaf PBI).
