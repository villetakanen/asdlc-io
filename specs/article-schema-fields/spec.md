---
title: "TechArticle context fields (mainEntityOfPage, inLanguage, articleSection)"
status: "approved"
owner: "Ville Takanen"
linear: "AL-60"
archetype: "feature"
created: "2026-06-15"
tags: []
---

# Feature: TechArticle context fields (mainEntityOfPage, inLanguage, articleSection)

## Blueprint

### Context

Every article page (concepts, patterns, practices, recipes) emits a `TechArticle` JSON-LD block via `StructuredData.astro`. That block currently carries `headline`, `description`, `author`, `publisher`, `datePublished`, `dateModified`, `keywords`, and `url` — but omits three standard Schema.org fields that AI engines and search crawlers use to disambiguate and contextualize a page:

- **`mainEntityOfPage`** — declares the canonical page this article *is the main entity of*, removing ambiguity when the same content is syndicated or quoted elsewhere.
- **`inLanguage`** — declares content language (`"en"`), a freshness/locale signal for multilingual indexing.
- **`articleSection`** — names the section/collection (`"Concepts" | "Patterns" | "Practices" | "Recipes"`), helping engines group and route the article topically.

This is item **M3** in `docs/reports/GEO-AUDIT-REPORT.md` and a sub-task of the GEO Optimization Pass epic (AL-55). It is the third additive extension to `StructuredData.astro` after `BreadcrumbList` (AL-58) and `HowTo` (AL-59), and lifts the **Schema & Structured Data** category further.

### Architecture

**Two of three fields are derivable; one is per-route.**

- `inLanguage` is a **constant** (`"en"`) — emitted unconditionally in the `TechArticle`/`Article` branch. No prop needed.
- `mainEntityOfPage` is **derived from the existing `data.url`** that all four routes already pass — `{ "@type": "WebPage", "@id": data.url }`. Emitted only when `data.url` is present (it always is on article routes; the guard preserves the component's no-empty-fields convention).
- `articleSection` is the **one new value the route must supply**, because the collection name is known statically per route, not derivable inside the component. Each route adds a literal to its `structuredDataProps`.

**Data flow:**

```
src/pages/{collection}/[...slug].astro   (structuredDataProps gains: articleSection: "Concepts" | "Patterns" | "Practices" | "Recipes")
        │  url: canonicalURL.toString()   ← already present, feeds mainEntityOfPage
        ▼
src/components/StructuredData.astro  →  TechArticle JSON-LD (additive):
          inLanguage: "en"                                    (always)
          mainEntityOfPage: { "@type": "WebPage", "@id": url } (iff data.url)
          articleSection: <collection name>                   (iff data.articleSection)
```

**Affected files:**

| File | Change |
|:-----|:-------|
| `src/components/StructuredData.astro` | Add the three fields to the `TechArticle`/`Article` branch (lines 38–58). `inLanguage` unconditional; `mainEntityOfPage` gated on `data.url`; `articleSection` gated on `data.articleSection`. |
| `src/pages/concepts/[...slug].astro` | Add `articleSection: "Concepts"` to `structuredDataProps`. |
| `src/pages/patterns/[...slug].astro` | Add `articleSection: "Patterns"` to `structuredDataProps`. |
| `src/pages/practices/[...slug].astro` | Add `articleSection: "Practices"` to `structuredDataProps`. |
| `src/pages/recipes/[id].astro` | Add `articleSection: "Recipes"` to `structuredDataProps`. |

No schema (`src/content/config.ts`) change is required — `articleSection` is a build-time literal per route, not authored frontmatter.

### Anti-Patterns

- **Do NOT add `articleSection` to `articleSchema`.** It is a fixed property of the route/collection, not content an author writes. Deriving it from a frontmatter field would invite drift and an empty-string failure mode.
- **Do NOT hardcode the URL inside the component.** `mainEntityOfPage.@id` MUST reuse the `data.url` (canonical URL) the route already computes — a single source of truth with the existing `url` field.
- **Do NOT emit empty/placeholder fields.** Follow the component's established convention: gate optional fields on presence (`...(data.x && { x })`), never emit `articleSection: ""` or `mainEntityOfPage` with a null `@id`.
- **Do NOT diverge route prop shapes.** All four article routes must add `articleSection` the same way, keeping `structuredDataProps` consistent across collections.
- **Do NOT touch concepts/patterns/practices `HowTo`/`BreadcrumbList` output.** This change is purely additive to the `TechArticle` branch; other JSON-LD blocks MUST be byte-identical.

## Contract

### Definition of Done

- [ ] The `TechArticle`/`Article` branch of `StructuredData.astro` emits `inLanguage: "en"` on every article page.
- [ ] The same branch emits `mainEntityOfPage: { "@type": "WebPage", "@id": <canonical url> }` whenever `data.url` is present, with `@id` equal to the page's existing `url` field.
- [ ] Each of the four article routes passes a correct `articleSection` literal (`"Concepts"`, `"Patterns"`, `"Practices"`, `"Recipes"`), and it renders in the TechArticle JSON-LD.
- [ ] All three fields render on **every** article page's JSON-LD (concepts, patterns, practices, recipes).
- [ ] No new field is added to `articleSchema` in `src/content/config.ts`.
- [ ] Collection index pages and non-article JSON-LD (`WebSite`, `Organization`, `BreadcrumbList`, `HowTo`) are unchanged.
- [ ] `pnpm check`, `pnpm lint`, and `pnpm build` pass with 0 errors.

### Regression Guardrails

- The existing `TechArticle` fields (`headline`, `description`, `author`, `publisher`, `datePublished`, `dateModified`, `keywords`, `url`, `image`) MUST remain behavior-identical — this is purely additive.
- `mainEntityOfPage.@id` MUST equal the value of the article's `url` field (the canonical URL) — never a separately computed or hardcoded URL.
- The `BreadcrumbList`, `HowTo`, `WebSite`, and `Organization` branches MUST remain byte-unchanged.
- Emission MUST be presence-gated for `mainEntityOfPage` and `articleSection` (no empty `@id`, no `articleSection: ""`); `inLanguage` is the only unconditional addition.
- `StructuredData.astro` stays the sole consumer — `articleSection` is supplied by the page routes, not synthesized in the component.

### Scenarios

**Scenario: Concept page emits all three context fields**
- Given: `/concepts/agentic-sdlc` with canonical URL `https://asdlc.io/concepts/agentic-sdlc/`
- When: the page is built
- Then: its `TechArticle` JSON-LD contains `"inLanguage": "en"`, `"articleSection": "Concepts"`, and `"mainEntityOfPage": { "@type": "WebPage", "@id": "https://asdlc.io/concepts/agentic-sdlc/" }`
- And: `@id` equals the block's existing `"url"` value
- And: the existing `headline`/`description`/`author`/`datePublished` fields are unchanged

**Scenario: articleSection matches the route's collection**
- Given: a pattern page, a practice page, and a recipe page
- When: each is built
- Then: their `articleSection` values are `"Patterns"`, `"Practices"`, and `"Recipes"` respectively

**Scenario: HowTo and BreadcrumbList unaffected**
- Given: a practice page that emits `TechArticle` + `BreadcrumbList` + `HowTo`
- When: it is built
- Then: the `BreadcrumbList` and `HowTo` blocks are byte-identical to before this change
- And: only the `TechArticle` block gains the three new fields

**Scenario: No schema drift**
- Given: the change is complete
- When: `articleSchema` in `src/content/config.ts` is inspected
- Then: no `articleSection` (or other) field was added — the value lives only in the route literals

### Verification

```bash
pnpm build
# Every article page carries inLanguage (expect ~72, one per article):
grep -rl '"inLanguage": "en"' dist/concepts dist/patterns dist/practices dist/recipes | wc -l
# articleSection present per collection:
grep -l '"articleSection": "Concepts"' dist/concepts/*/index.html | wc -l
# mainEntityOfPage @id matches the url field on a sample page:
grep -A2 'mainEntityOfPage' dist/concepts/agentic-sdlc/index.html
# Non-article blocks unchanged — index pages emit no articleSection:
grep -c 'articleSection' dist/concepts/index.html   # expect 0
```

## Implementation Notes

The component change sits in the shared `TechArticle`/`Article` branch (`src/components/StructuredData.astro:38–58`), alongside the existing spread of optional fields:

```astro
inLanguage: "en",
...(data.url && { mainEntityOfPage: { "@type": "WebPage", "@id": data.url } }),
...(data.articleSection && { articleSection: data.articleSection }),
```

Each route adds one line to `structuredDataProps` (e.g. `src/pages/concepts/[...slug].astro:43`), mirroring the `url: canonicalURL.toString()` line already present. The `recipes/[id].astro` route uses the same `structuredDataProps` shape as the `[...slug].astro` routes despite the different filename — treat it identically.

This is a sibling extension to the dead-branch cleanup in **AL-61** (which removes the unused `proficiencyLevel`/`maturity`/`complexity`/`definition` branches in the same component). The two touch the same file and are natural to land together; if AL-61 ships first, rebase the field additions onto the cleaned branch.

## Resources

- [Schema.org `mainEntityOfPage`](https://schema.org/mainEntityOfPage), [`inLanguage`](https://schema.org/inLanguage), [`articleSection`](https://schema.org/articleSection) — field definitions
- `specs/structured-data/spec.md` — parent spec; the `TechArticle` prop contract these fields extend
- `specs/howto-schema/spec.md` — sibling spec; same additive-extension pattern for `HowTo`
- `specs/breadcrumbs/spec.md` — sibling spec; same additive-extension pattern for `BreadcrumbList`
- `docs/reports/GEO-AUDIT-REPORT.md` — source audit (item M3)
