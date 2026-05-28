# GEO Audit Report: ASDLC.io

**Audit Date:** 2026-05-28
**Site:** https://asdlc.io
**Site Type:** Publisher / Knowledge Base (Static Astro 5.x on Netlify)
**Content Files Analyzed:** 72 (37 concepts, 18 patterns, 14 practices, 3 recipes)
**Collections:** Concepts, Patterns, Practices, Recipes

---

## Executive Summary

**Overall GEO Score: 81/100 (Good)**

ASDLC.io has a strong GEO foundation: explicit AI-crawler allowances, a well-formed `llms.txt`, an MCP server, an `Accept: text/markdown` content-negotiation layer, dense cross-referencing, and rich external citations on flagship articles. The biggest unrealized gains are structural — missing `BreadcrumbList`, no `FAQPage`/`HowTo` exposure of inherently Q&A/step-shaped content, generic `Organization` author instead of a named `Person`, no `lastmod` in the sitemap, and no RSS/Atom feed. Closing these gaps would push the site solidly into the 90+ range.

### Score Breakdown

| Category | Score | Weight | Weighted |
|---|---|---|---|
| AI Citability | 82/100 | 30% | 24.6 |
| Content E-E-A-T | 75/100 | 25% | 18.75 |
| Technical GEO | 88/100 | 15% | 13.2 |
| Schema & Structured Data | 70/100 | 15% | 10.5 |
| Knowledge Base & MCP | 90/100 | 15% | 13.5 |
| **Overall GEO Score** | | | **80.55 → 81** |

---

## Critical Issues (Fix Immediately)

None. No blockers detected — AI crawlers are allowed, every article emits valid JSON-LD, sitemap and `llms.txt` are present, and the MCP server is live.

---

## High Priority Issues

### H1. Author attribution is generic Organization, not a named Person
- **Where:** `src/components/StructuredData.astro:36-40`
- **Issue:** All `TechArticle`/`Article` JSON-LD uses `author: { "@type": "Organization", name: "ASDLC.io Contributors" }`. Schema.org and Google's E-E-A-T signals strongly favor a named `Person` author with `url`/`sameAs`. The author meta tag (`src/components/SEOMetadata.astro:25`) carries the same generic label.
- **Fix:** Add an `author` field to `articleSchema` (optional, defaulting to `Ville Takanen` for current content); map it to a `Person` with `sameAs: ["https://villetakanen.com", "https://github.com/villetakanen", ...]`. Keep `publisher` as the ASDLC.io Organization.

### H2. No `BreadcrumbList` schema on collection or article pages
- **Where:** Article slug pages and `src/pages/{concepts,patterns,practices}/index.astro`
- **Issue:** AI engines use breadcrumb signals to understand site hierarchy and surface contextual citations. ASDLC.io has a clear three-tier structure (Home → Collection → Article) but exposes no `BreadcrumbList` JSON-LD.
- **Fix:** Extend `StructuredData.astro` to accept `type: "BreadcrumbList"` and inject it on every article page from `Astro.url.pathname`.

### H3. Sitemap has no `<lastmod>` entries
- **Where:** `astro.config.mjs:10` (`sitemap()` integration uses defaults; 101 entries, zero `lastmod`)
- **Issue:** Crawlers (including AI ones that respect freshness) use `lastmod` to prioritize re-crawls. Every article already has a Zod-validated `lastUpdated` field — that data exists but isn't being plumbed through.
- **Fix:** Configure `@astrojs/sitemap` with a `serialize` function or `customPages` that pulls `lastUpdated` from each content entry and emits it as `lastmod`.

### H4. Practices content is shaped like `HowTo` but emits `TechArticle`
- **Where:** `src/content/practices/*.md`, `src/pages/practices/[...slug].astro`
- **Issue:** Articles like `practices/living-specs.md` and `practices/adr-authoring.md` are step-by-step procedural guides — the canonical `HowTo` schema shape. AI engines preferentially cite `HowTo` for procedural queries.
- **Fix:** Add a `HowTo` JSON-LD variant in `StructuredData.astro`. Either auto-emit it for the `practices` collection, or add an optional `schemaType: "HowTo"` field to `articleSchema` and populate `step` items by parsing numbered H3s from the body (or by adding a `steps` frontmatter field on procedural practices).

---

## Medium Priority Issues

### M1. FAQ-shaped content lacks `FAQPage` schema
- **Where:** Articles that open with a "Definition" H2 followed by Q&A-style H2s (e.g., `concepts/agentic-sdlc.md`, `concepts/spec-driven-development.md`, `concepts/levels-of-autonomy.md`).
- **Fix:** Add an optional `faq: [{q, a}]` frontmatter field; when present, emit a `FAQPage` JSON-LD block alongside the existing `TechArticle`. Start with the 5-10 most-trafficked concept articles.

### M2. No RSS/Atom feed
- **Where:** `src/pages/` (no `rss.xml.ts` or `feed.xml.ts`)
- **Issue:** Feeds remain a meaningful discovery channel for AI content aggregators and Perplexity-style trackers, and they signal active publishing cadence.
- **Fix:** Add `@astrojs/rss` and emit `/rss.xml` listing all `Live` and `Experimental` articles, ordered by `lastUpdated` desc. Link it from `<head>` in `BaseLayout.astro` via `<link rel="alternate" type="application/rss+xml">`.

### M3. `TechArticle` schema omits `mainEntityOfPage` and `inLanguage`
- **Where:** `src/components/StructuredData.astro:31-51`
- **Fix:** Add `mainEntityOfPage: { "@type": "WebPage", "@id": data.url }` and `inLanguage: "en"`. Small payload, measurable AI citation lift.

### M4. `WebSite` schema is missing `potentialAction` (SearchAction)
- **Where:** `src/pages/index.astro:23-27`
- **Issue:** Google and AI engines use `SearchAction` to surface sitelinks search boxes and to understand that the KB is queryable.
- **Fix:** Either point at the MCP search endpoint or add a `/search?q={search_term_string}` route and emit the `SearchAction`. Even pointing at an internal Fuse-backed search page improves the signal.

### M5. Schema generator references stale schema fields
- **Where:** `src/components/StructuredData.astro:35` (`data.definition`), `:55-57` (`proficiencyLevel`, `maturity`, `complexity`)
- **Issue:** These fields don't exist in the current `articleSchema` (`src/content/config.ts:28-42`) — they are dead branches. Not harmful, but they make the schema generator misleading and they prevent the team from noticing missing fields.
- **Fix:** Remove dead branches; if `maturity`/`complexity` would be valuable, add them to `articleSchema` and surface them in the JSON-LD intentionally.

### M6. `event-modeling.md` is missing `relatedIds`
- **Where:** `src/content/concepts/event-modeling.md`
- **Issue:** Only article in the KB without cross-references — breaks the bidirectional-link invariant called out in `CLAUDE.md`.
- **Fix:** Add `relatedIds` linking to at least `concepts/behavior-driven-development`, `concepts/spec-driven-development`, `patterns/the-spec`.

### M7. `status` field has inconsistent YAML quoting
- **Where:** Across `src/content/**/*.md` — 33 `status: "Live"`, 8 `status: Live`; 21 `"Experimental"`, 2 unquoted; 4 `"Draft"`, 1 unquoted.
- **Issue:** Cosmetic (Zod parses both), but it suggests the linter isn't enforcing a single style, which makes spec-driven authoring harder for agents.
- **Fix:** Run `pnpm lint:specs` (or extend it) to normalize all `status:` values to the quoted form, then add a lint rule.

---

## Low Priority Issues

### L1. Homepage `description` differs from default in `SEOMetadata`
- `src/pages/index.astro:13` says "The playbook for industrializing software engineering…" while `src/components/SEOMetadata.astro:13` default is "Agentic Software Development Life Cycle - A knowledge base…". Pick one canonical phrasing.

### L2. `og:image` is the SVG logo, not a per-article card
- `src/components/SEOMetadata.astro:15` — every article shares `/asdlc.png`. A per-article OG card (even a templated SVG with the title) materially improves social and AI surfacing.

### L3. No `article:published_time` / `article:modified_time` OG tags
- Article pages don't emit these properties when `type="article"`. Trivial addition; helps Facebook, LinkedIn, and some AI summarizers detect freshness.

### L4. MCP `articles.json` may drift from content if `pnpm build:mcp-index` isn't a build prerequisite
- Verify `pnpm build` re-runs `build:mcp-index` (it appears to be a separate command in `package.json`). If not, drift between the KB and MCP responses is possible.

### L5. `recipes` collection isn't in `llms.txt`
- `public/llms.txt` enumerates Concepts/Patterns/Practices but not Recipes. Add a Recipes line so AI clients discover them.

### L6. Mermaid diagrams missing `alt` text beyond "Mermaid Diagram"
- E.g., `patterns/the-spec.md:184` — `<img … alt="Mermaid Diagram" />`. Replace with descriptive alt (e.g., "Spec → multiple PBIs → Feature Assembly → Gate → Migration").

### L7. No `X-Robots-Tag` header to reinforce `index, follow`
- Optional Netlify header to belt-and-braces the `robots` meta tag.

---

## Source vs. Rendered Discrepancies

**No discrepancies detected.** Live curl spot-checks confirm:

- `GET https://asdlc.io/concepts/agentic-sdlc/` → `<script type="application/ld+json">` with `"@type": "TechArticle"` present (matches `src/pages/concepts/[...slug].astro:42`).
- `GET https://asdlc.io/` → two JSON-LD blocks: `Organization` and `WebSite` (matches `src/pages/index.astro:16-27`).
- `GET https://asdlc.io/robots.txt` → matches `public/robots.txt` verbatim.
- `GET https://asdlc.io/sitemap-index.xml` → references `/sitemap-0.xml` (101 URLs).
- `GET https://asdlc.io/llms.txt` → matches `public/llms.txt`.

Note: the initial `WebFetch` pass reported "NO JSON-LD FOUND" on article pages. This was a `WebFetch` summarization artifact, not a real absence — `curl` confirmed JSON-LD is rendered. Trust raw HTTP fetches over LLM-summarized WebFetch results when validating schema markup.

---

## Category Deep Dives

### AI Citability (82/100)

**Strengths**
- Articles open with a `## Definition` H2 — a direct answer block AI can extract whole.
- Comparison tables (e.g., `patterns/the-spec.md` State vs Delta table) and Gherkin code blocks give AI well-bounded, quotable units.
- Cross-references are dense and bidirectional. An AI following one link rarely hits a dead end.
- `Accept: text/markdown` content negotiation on `/concepts/:slug` etc. delivers clean markdown to agents (`netlify.toml`) — outstanding GEO move.

**Gaps**
- Several articles repeat their `## Relationship to Other Patterns` section twice (e.g., `patterns/the-spec.md:210` and `:240`) — duplicate H2s confuse extractive AI.
- No explicit Q&A sections. Even one `## Common Questions` H2 with H3 questions on flagship articles would significantly improve quote-pull rates.
- Several articles end with `## ASDLC Usage` that lists links without context — these read as link dumps to AI.

**Sample passage check** — `concepts/agentic-sdlc.md` Definition (lines 27-33): self-contained, ~80 words, quotes Ville Takanen, defines the core term. Near-ideal AI citation block.

### Content E-E-A-T (75/100)

**Strengths**
- Average article ~1,200-2,000 words — well above the GEO-relevant depth threshold.
- Reference density is excellent on flagship articles: `patterns/the-spec.md` cites 8 external sources (Martraire book, Anthropic paper, Martin Fowler, Kent Beck, Birgitta Böckeler, etc.), each with `annotation`, `accessed`, and `published` dates.
- `lastUpdated` is required by the schema and populated everywhere; `publishedDate` exists on ~60% of articles.
- Original framing (the industrial / cybernetic / triple-debt models) is novel synthesis, not aggregation.

**Gaps**
- No named author. Schema lists `ASDLC.io Contributors` (Organization). For a single-voice publication owned by Ville Takanen, this under-claims authorship.
- No `/about` or `/authors` page surfacing credentials (Futurice tenure, prior publications, conference talks). Owner is currently invisible to AI.
- No `sameAs` profile linkage (LinkedIn, GitHub, personal blog, X/Twitter, ORCID).
- Citation depth is uneven — flagship articles have 8 references, but roughly half of practices and concepts have zero `references`.

### Technical GEO (88/100)

**Strengths**
- `robots.txt` explicitly allows `GPTBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, `CCBot`, `Google-Extended` — best-practice white-listing.
- `llms.txt` exists, follows the emerging spec (`# Site` → `>` description → `## Section` blocks with linked items), and is curated rather than dumped.
- Astro static SSG — no JS-only rendering. Everything an AI crawler needs is in the initial HTML.
- MCP edge function at `/mcp` exposes `list_articles`, `get_article`, `search_knowledge_base` — direct agent consumption channel.
- `Accept: text/markdown` redirects (`netlify.toml`) serve raw markdown to agents — rare and high-value.
- Downloadable skill bundle (`/asdlc-skill.zip`) for air-gapped agents.

**Gaps**
- No `lastmod` in sitemap (see H3).
- No RSS/Atom (see M2).
- No favicon variants beyond `/asdlc.svg`.
- `og:image` is logo-only, not per-article (L2).

### Schema & Structured Data (70/100)

**Catalog (rendered, confirmed via curl):**
- Homepage: `Organization`, `WebSite` ✅
- `/concepts/:slug`, `/patterns/:slug`, `/practices/:slug`: `TechArticle` ✅
- `/recipes/:id`: `TechArticle` (via the same component)

**Field completeness on `TechArticle`:**
- `headline` ✅, `description` ✅, `author` (Organization) ⚠️, `publisher` ✅, `datePublished` ✅, `dateModified` ✅, `keywords` ✅, `url` ✅
- Missing: `image`, `mainEntityOfPage`, `inLanguage`, `articleSection` (could map to collection name), `wordCount`

**Missing schema opportunities:**
- `BreadcrumbList` everywhere (H2)
- `HowTo` for practices (H4)
- `FAQPage` for definition-led concepts (M1)
- `Person` author (H1)
- `SearchAction` in `WebSite` (M4)

**Dead branches in `StructuredData.astro`** referencing nonexistent fields — see M5.

### Knowledge Base & MCP (90/100)

**Strengths**
- MCP server is live at `/mcp` with the three canonical tools.
- `articles.json` + `fuse-index.json` provide both deterministic listing and fuzzy search.
- `relatedIds` populated on 71/72 articles — relationship graph is denser than most KB sites.
- Downloadable skill bundle is a distinctive distribution channel; few KBs do this.
- The `.md` URL convention (`/patterns/the-spec.md`) gives agents a stable, canonical retrieval path that matches `llms.txt` links.

**Gaps**
- Recipes not enumerated in `llms.txt` (L5).
- No machine-readable graph export (e.g., `/graph.json` with nodes + edges) — would let agents reason about the KB topology without crawling.
- Verify that `pnpm build` always rebuilds the MCP index (L4).

---

## Quick Wins (Implement This Week)

1. **Add `lastmod` to sitemap** — configure `@astrojs/sitemap` with a `serialize` that reads `lastUpdated` from each content entry. Touches `astro.config.mjs`. (H3)
2. **Add `Person` author** — extend `articleSchema` with optional `author` (default `"Ville Takanen"`), update `StructuredData.astro` to emit `Person` with `sameAs` links. Update `SEOMetadata.astro` `<meta name="author">` accordingly. (H1)
3. **Add `BreadcrumbList`** — extend `StructuredData.astro` with a `BreadcrumbList` variant; render it from `src/pages/{concepts,patterns,practices}/[...slug].astro` using `Astro.url.pathname`. (H2)
4. **Add `mainEntityOfPage` + `inLanguage` to `TechArticle`** — 3-line change in `src/components/StructuredData.astro:31-51`. (M3)
5. **Remove dead schema branches** referencing `data.definition`, `data.proficiencyLevel`, `data.maturity`, `data.complexity` in `src/components/StructuredData.astro:35,55-57`. (M5)
6. **Add `recipes` to `llms.txt`** — one-line addition under `## Core Content` in `public/llms.txt`. (L5)
7. **Fix `event-modeling.md` `relatedIds`** — restore bidirectional links. (M6)

---

## 30-Day Action Plan

### Week 1: Schema & Freshness Foundation
- [ ] (H3) Configure `@astrojs/sitemap` to emit `lastmod` from `lastUpdated` — `astro.config.mjs`
- [ ] (H1) Add `Person` author to `articleSchema` and `StructuredData.astro` — `src/content/config.ts`, `src/components/StructuredData.astro`, `src/components/SEOMetadata.astro`
- [ ] (H2) Implement `BreadcrumbList` JSON-LD on all article and collection index pages
- [ ] (M3) Add `mainEntityOfPage`, `inLanguage`, `articleSection` to `TechArticle` output
- [ ] (M5) Remove dead schema branches; verify with `pnpm check`

### Week 2: HowTo & FAQ Schema
- [ ] (H4) Add `HowTo` variant to `StructuredData.astro`; either auto-emit for `practices/*` or gate on `schemaType` frontmatter field. Parse numbered H3s or accept `steps` array.
- [ ] (M1) Add optional `faq: [{q, a}]` frontmatter; pilot on 5 flagship concept articles (`agentic-sdlc`, `spec-driven-development`, `context-engineering`, `levels-of-autonomy`, `model-context-protocol`)
- [ ] (M4) Add `SearchAction` to `WebSite` schema in `src/pages/index.astro`
- [ ] (L3) Add `article:published_time` / `article:modified_time` OG tags when `type="article"`

### Week 3: Discovery & Distribution
- [ ] (M2) Install `@astrojs/rss`, emit `/rss.xml`, link from `BaseLayout.astro`
- [ ] (L5) Add Recipes section to `public/llms.txt`
- [ ] (L4) Wire `pnpm build:mcp-index` into `pnpm build` if not already; add CI assertion that the index matches content
- [ ] (L2) Add per-article OG image generator (templated SVG or Satori) at `/og/[slug].png`
- [ ] (M6) Add `relatedIds` to `concepts/event-modeling.md`

### Week 4: E-E-A-T & Content Polish
- [ ] Create `/about` page with named-author bio, credentials, `sameAs` profile links
- [ ] (M7) Normalize `status:` YAML quoting across all content; add `pnpm lint:specs` rule
- [ ] (L6) Audit all `alt="Mermaid Diagram"` instances; replace with descriptive alt text
- [ ] (L1) Reconcile homepage description and `SEOMetadata` default to a single canonical phrasing
- [ ] Backfill `references` on concept and practice articles with citation count < 3
- [ ] Audit and deduplicate the repeated `## Relationship to Other Patterns` H2s (e.g., `patterns/the-spec.md`)

---

## Appendix: Content Analyzed

| Collection | Count | Status Mix | Notes |
|---|---|---|---|
| concepts | 37 | Live + Experimental dominant | `event-modeling` missing `relatedIds` (M6) |
| patterns | 18 | Live + Experimental | `the-spec` has duplicate `## Relationship` H2 |
| practices | 14 | Live-heavy | Best candidates for `HowTo` schema (H4) |
| recipes | 3 | Live | Not enumerated in `llms.txt` (L5) |

**Status distribution (all collections):** 41 Live, 23 Experimental, 5 Draft, 1 Proposed, 1 Deprecated.

**Word counts (sampled):**
- `concepts/spec-driven-development.md`: 888
- `concepts/context-engineering.md`: 1,546
- `concepts/levels-of-autonomy.md`: 1,697
- `patterns/the-spec.md`: 1,824
- `patterns/adversarial-code-review.md`: 2,085
- `patterns/context-gates.md`: 1,486
