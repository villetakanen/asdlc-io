---
title: "Homepage Structured Data"
status: "shipped"
owner: "Ville Takanen"
archetype: "feature"
created: "2026-03-16"
tags: []
shipped: "2026-03-16"
---

# Feature: Homepage Structured Data

## Blueprint

### Context

The homepage (`src/pages/index.astro`) is the only top-level page without Schema.org JSON-LD structured data. Article pages already emit `TechArticle` markup via `StructuredData.astro`, but the homepage — the site's canonical entry point — emits zero structured data.

Adding `Organization` and `WebSite` ld+json blocks to the homepage serves two purposes:

1. **Google Knowledge Panel eligibility** — Organization markup enables brand-level rich results and establishes entity identity across Google's knowledge graph.
2. **Sitelinks Search Box** — WebSite markup with a `SearchAction` signals to Google that the site has searchable content (future: MCP-powered search).

These are site-wide identity signals. The homepage is the correct canonical location per Schema.org and Google's structured data guidelines.

### Architecture

**Data Flow:**

```
src/pages/index.astro
    │
    ├──► StructuredData type="Organization"
    │      • name: "ASDLC.io"
    │      • url: "https://asdlc.io"
    │      • logo: "https://asdlc.io/asdlc.svg"
    │      • description: (from BaseLayout description prop)
    │      • sameAs: [] (social profiles — empty initially)
    │
    ├──► StructuredData type="WebSite"
    │      • name: "ASDLC.io"
    │      • url: "https://asdlc.io"
    │      • description: (from BaseLayout description prop)
    │
    └──► BaseLayout (unchanged — already passes title + description)
```

**Affected Files:**

| File | Role |
|:-----|:-----|
| `src/pages/index.astro` | **Change target.** Import `StructuredData`, add two instances. |
| `src/components/StructuredData.astro` | **Consumer.** Already supports `Organization` and `WebSite` types. No changes needed. |
| `src/layouts/BaseLayout.astro` | Pass-through. No changes needed. |

**Component Reuse:** The `StructuredData.astro` component already handles `Organization` and `WebSite` types (lines 62-78). The homepage simply needs to import and invoke it with the correct props.

### Anti-Patterns

- **Duplicating structured data in BaseLayout:** Organization/WebSite markup belongs on the homepage only, not on every page. Placing it in `BaseLayout` would emit redundant ld+json on all 87+ pages.
- **Hardcoding the site URL:** Use `Astro.site` (configured in `astro.config.mjs` as `https://asdlc.io`) to derive the canonical URL. Never hardcode `"https://asdlc.io"` in the page file.
- **Adding SearchAction prematurely:** Do not add `potentialAction: SearchAction` until the site has a functional search endpoint. The component supports it, but the homepage should omit it for now.

## Contract

### Definition of Done

- [x] `src/pages/index.astro` imports `StructuredData` from `../components/StructuredData.astro`
- [x] Homepage emits a `<script type="application/ld+json">` block with `@type: Organization`
- [x] Homepage emits a `<script type="application/ld+json">` block with `@type: WebSite`
- [x] Organization block includes: `name`, `url`, `logo`, `description`
- [x] WebSite block includes: `name`, `url`, `description`
- [x] URLs are derived from `Astro.site`, not hardcoded strings
- [x] `pnpm check` passes with 0 errors
- [x] `pnpm build` succeeds
- [x] View-source on built `index.html` confirms both ld+json blocks are present and valid

### Regression Guardrails

- The `StructuredData.astro` component MUST NOT be modified for this feature — it already supports both types
- The `BaseLayout` MUST NOT be modified — structured data injection happens at the page level, not the layout level
- Organization `name` and WebSite `name` MUST both be `"ASDLC.io"` — consistent with `og:site_name` in `SEOMetadata.astro`
- The `logo` value MUST point to `/asdlc.svg` (same asset used for `<link rel="icon">` in `BaseLayout`)

### Scenarios

**Scenario: Homepage emits Organization structured data**
- Given: The homepage is built
- When: The output HTML is inspected
- Then: A `<script type="application/ld+json">` block exists with `"@type": "Organization"`
- And: It contains `"name": "ASDLC.io"` and `"url": "https://asdlc.io"`
- And: It contains `"logo": "https://asdlc.io/asdlc.svg"`

**Scenario: Homepage emits WebSite structured data**
- Given: The homepage is built
- When: The output HTML is inspected
- Then: A `<script type="application/ld+json">` block exists with `"@type": "WebSite"`
- And: It contains `"name": "ASDLC.io"` and `"url": "https://asdlc.io"`

**Scenario: No SearchAction yet**
- Given: The homepage is built
- When: The WebSite ld+json block is inspected
- Then: No `potentialAction` property is present

**Scenario: Article pages are unaffected**
- Given: Any article page (e.g., `/patterns/the-spec`) is built
- When: The output HTML is inspected
- Then: It still contains only a `TechArticle` ld+json block
- And: No `Organization` or `WebSite` block is present

## Implementation Notes

The change is limited to `src/pages/index.astro`:

1. **Import:** Add `import StructuredData from "../components/StructuredData.astro";` to frontmatter
2. **Derive site URL:** Add `const siteURL = Astro.site?.toString() ?? "https://asdlc.io";` in frontmatter
3. **Add components** before the `<BaseLayout>` tag (same pattern as article routes):

```astro
<StructuredData type="Organization" data={{
  name: "ASDLC.io",
  url: siteURL,
  logo: `${siteURL}asdlc.svg`,
  description: "The playbook for industrializing software engineering. Patterns, practices, and standards for building the software factory.",
}} />

<StructuredData type="WebSite" data={{
  name: "ASDLC.io",
  url: siteURL,
  description: "The playbook for industrializing software engineering. Patterns, practices, and standards for building the software factory.",
}} />
```

The `description` value matches the existing `BaseLayout description=` prop on the homepage to maintain a single source of truth.

**Trailing slash on siteURL:** `Astro.site` returns a `URL` object; `.toString()` includes the trailing slash (`https://asdlc.io/`). The logo path `${siteURL}asdlc.svg` resolves correctly to `https://asdlc.io/asdlc.svg`.

## Resources

- [Schema.org Organization](https://schema.org/Organization) — Organization type reference
- [Schema.org WebSite](https://schema.org/WebSite) — WebSite type reference
- [Google: Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization) — Google's implementation guide
- `specs/structured-data/spec.md` — Related spec for article-level structured data
