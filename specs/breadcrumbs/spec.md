---
title: "BreadcrumbList structured data"
status: "approved"
owner: "Ville Takanen"
linear: "AL-58"
archetype: "feature"
created: "2026-06-11"
tags: []
---

# Feature: BreadcrumbList structured data

## Blueprint

### Context

asdlc.io has a clear three-tier information hierarchy — **Home → Collection → Article** — but emits no `BreadcrumbList` JSON-LD. Search and AI engines use breadcrumb structured data to understand a site's hierarchy, render breadcrumb rich results, and surface more contextual citations (e.g. "from the Concepts section of asdlc.io").

This is item **H2** in `docs/reports/GEO-AUDIT-REPORT.md` and a sub-task of the GEO Optimization Pass epic (AL-55). It extends the existing `StructuredData.astro` component, which already emits `TechArticle`, `Article`, `WebSite`, and `Organization` JSON-LD.

### Architecture

**Component extension.** `src/components/StructuredData.astro` gains a fourth value on its `type` union: `"BreadcrumbList"`. When invoked with that type, it reads `data.itemListElement` (or a simpler `data.items`) and emits a Schema.org `BreadcrumbList` JSON-LD `<script>` block — one more block alongside the page's existing `TechArticle` block. Multiple JSON-LD blocks per page are valid and standard; no `@graph` merge is required.

**The breadcrumb shape.** Each page passes an ordered list of crumbs as `{ name, item }` pairs (human-readable name + absolute URL). The component maps them to `ListItem` entries with 1-based `position`:

```jsonc
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home",     "item": "https://asdlc.io/" },
    { "@type": "ListItem", "position": 2, "name": "Concepts",  "item": "https://asdlc.io/concepts/" },
    { "@type": "ListItem", "position": 3, "name": "Levels of Autonomy", "item": "https://asdlc.io/concepts/levels-of-autonomy/" }
  ]
}
```

**Where the crumbs come from.** The leaf name (article title) is NOT in the URL path, so each page must supply it. To avoid duplicating the segment→label mapping across eight route files, a single shared helper builds the crumb list from `(collection, leafName, leafUrl)`:

```
src/pages/{collection}/[...slug].astro   (article: 3 crumbs — Home → Collection → {title})
src/pages/recipes/[id].astro             (article: 3 crumbs — Home → Recipes → {title})
src/pages/{collection}/index.astro       (collection index: 2 crumbs — Home → Collection)
        │  call shared helper with the route's collection + (optional) leaf
        ▼
  buildBreadcrumbs(...) → [{name, item}, ...]   (absolute URLs via Astro.site)
        ▼
  <StructuredData type="BreadcrumbList" data={{ itemListElement: crumbs }} />
```

**Canonical collection labels** (the single source of truth for segment→label):

| Route segment | Breadcrumb label | Collection-index URL |
|---|---|---|
| `concepts` | `Concepts` | `https://asdlc.io/concepts/` |
| `patterns` | `Patterns` | `https://asdlc.io/patterns/` |
| `practices` | `Practices` | `https://asdlc.io/practices/` |
| `recipes` | `Recipes` | `https://asdlc.io/recipes/` |

**Root crumb:** always `{ name: "Home", item: "https://asdlc.io/" }` (position 1).

**Absolute URLs.** All `item` URLs are absolute, built from `Astro.site` + pathname (matching the existing `canonicalURL` pattern in the article routes). Trailing-slash form must match the site's canonical/sitemap form (`/concepts/foo/`).

**In scope:** the four content collections' article routes and their four index pages. **Out of scope:** `resources/*`, `fieldmanual`, `getting-started`, and the homepage itself (the homepage is the breadcrumb root — it does not need its own breadcrumb).

### Anti-Patterns

- **Do NOT fabricate intermediate crumbs for URL segments with no real page.** A nested article id (e.g. `nested/bar` → `/concepts/nested/bar/`) stays a 3-crumb trail (Home → Concepts → {leaf}); there is no page at `/concepts/nested/`, so no crumb for it.
- **Do NOT use the slug/id as the leaf crumb name.** The leaf name must be the human article title (`data.longTitle ?? data.title`), not the URL slug.
- **Do NOT duplicate the segment→label map** across the eight route files. One shared helper owns it (see Implementation Notes). Divergence is a maintenance trap.
- **Do NOT emit relative `item` URLs.** Google requires absolute URLs in `BreadcrumbList` items.
- **Do NOT merge breadcrumb data into the `TechArticle` block.** Emit a separate `BreadcrumbList` `<script>` — the component already renders one block per invocation.
- **Do NOT add a breadcrumb to the homepage** or to pages outside the four collections.

## Contract

### Definition of Done

- [ ] `StructuredData.astro` accepts `type: "BreadcrumbList"` and emits a valid `BreadcrumbList` JSON-LD block from an ordered crumb list (typed; no `any`).
- [ ] Every article page (`/concepts/*`, `/patterns/*`, `/practices/*`, `/recipes/*`) emits a 3-crumb `BreadcrumbList`: Home → Collection → Article-title.
- [ ] Every collection index page (`/concepts/`, `/patterns/`, `/practices/`, `/recipes/`) emits a 2-crumb `BreadcrumbList`: Home → Collection.
- [ ] Each `ListItem` has a 1-based `position`, a human-readable `name`, and an absolute `item` URL.
- [ ] The leaf crumb name equals `data.longTitle ?? data.title`, never the slug.
- [ ] The segment→label mapping lives in exactly one place (shared helper), not copied per route.
- [ ] `pnpm check`, `pnpm lint`, and `pnpm build` pass.
- [ ] Emitted JSON-LD validates as a Schema.org `BreadcrumbList` (Google Rich Results / `schema-dts` shape).

### Regression Guardrails

- The existing `TechArticle` / `Article` / `WebSite` / `Organization` branches of `StructuredData.astro` MUST remain unchanged in behavior — this is purely additive.
- Breadcrumb `item` URLs MUST stay in sync with the canonical/sitemap URL form (`/{collection}/{id}/`, trailing slash). They share the route hierarchy with `specs/sitemap/spec.md`.
- Root crumb MUST be `https://asdlc.io/` and collection-index URLs MUST match the labels table above.
- The leaf name MUST come from article frontmatter title fields — never synthesized from the slug or hardcoded.
- The feature is additive markup only: no change to page content, layout, or the visible DOM is required or permitted by this spec.

### Scenarios

**Scenario: Concept article emits a full breadcrumb trail**
- Given: the article `concepts/levels-of-autonomy` with title "Levels of Autonomy"
- When: `/concepts/levels-of-autonomy/` is built
- Then: the page contains a `BreadcrumbList` JSON-LD block with three `ListItem`s:
  - position 1 → name "Home", item `https://asdlc.io/`
  - position 2 → name "Concepts", item `https://asdlc.io/concepts/`
  - position 3 → name "Levels of Autonomy", item `https://asdlc.io/concepts/levels-of-autonomy/`

**Scenario: Collection index emits a two-crumb trail**
- Given: the patterns index page
- When: `/patterns/` is built
- Then: it contains a `BreadcrumbList` with exactly two `ListItem`s: Home (pos 1) → Patterns (pos 2)
- And: no third (leaf) crumb is present

**Scenario: Recipe article uses the Recipes label**
- Given: a recipe with title "Critic Agent"
- When: `/recipes/critic-agent/` is built
- Then: position 2 is name "Recipes", item `https://asdlc.io/recipes/`
- And: position 3 is name "Critic Agent"

**Scenario: Article with a longTitle uses it as the leaf name**
- Given: an article with `title: "Specs"` and `longTitle: "The Spec: Living Specifications..."`
- When: its page is built
- Then: the leaf crumb name is the `longTitle` value (matching the `TechArticle` `headline` source: `longTitle ?? title`)

**Scenario: Breadcrumb does not break the existing TechArticle block**
- Given: any article page
- When: it is built
- Then: BOTH a `TechArticle` JSON-LD block AND a `BreadcrumbList` JSON-LD block are present and independently valid

### Verification

```bash
pnpm build
# A built concept article carries a BreadcrumbList:
grep -l 'BreadcrumbList' dist/concepts/levels-of-autonomy/index.html
# Spot-check the trail and absolute URLs:
grep -A30 'BreadcrumbList' dist/concepts/levels-of-autonomy/index.html
# A collection index carries a 2-crumb list:
grep -c 'BreadcrumbList' dist/patterns/index.html   # expect 1 block
```

## Implementation Notes

- **Component:** add a `type === "BreadcrumbList"` branch to `src/components/StructuredData.astro`. Accept `data.itemListElement` as an array of `{ name, item }` and emit `ListItem`s with computed `position`. Extend the `Props["type"]` union. Keep `JsonLdObject` typing — no `any`.
- **Shared helper:** put the segment→label map and crumb-builder in one module (e.g. `src/lib/breadcrumbs.ts`), exporting something like `articleBreadcrumbs(collection, leafName, leafUrl)` and `collectionBreadcrumbs(collection)`. Both return `{ name, item }[]` with absolute URLs. The eight route files import it; none re-declare the label map.
- **Wiring per route:** in each `[...slug].astro` / `[id].astro`, build the leaf URL from the existing `canonicalURL` and the leaf name from `data.longTitle ?? data.title`, then render `<StructuredData type="BreadcrumbList" data={{ itemListElement: crumbs }} />` next to the existing `<StructuredData type="TechArticle" ... />`. In each `index.astro`, render the 2-crumb variant. Remember: `.astro` requires explicit imports for `StructuredData` (already imported in article routes; index pages will need to add it).
- **Canonical references:** `src/components/StructuredData.astro` (component), `src/pages/concepts/[...slug].astro` (canonical article-route pattern, including `canonicalURL`), `src/content/config.ts` (title/longTitle fields).
- Routes share the `/{collection}/{id}/` URL rule with `specs/sitemap/spec.md` — keep them consistent.

## Resources

- [Schema.org BreadcrumbList](https://schema.org/BreadcrumbList) — the type emitted
- [Google — Breadcrumb structured data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) — `ListItem`/`position`/`item` requirements, absolute-URL rule
- `specs/structured-data/spec.md` — sibling spec; the `StructuredData.astro` component this feature extends
- `specs/sitemap/spec.md` — shares the `/{collection}/{id}/` route hierarchy and absolute-URL form
- `docs/reports/GEO-AUDIT-REPORT.md` — source audit (item H2)
