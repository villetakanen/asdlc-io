# GEO Audit Report: ASDLC.io

**Audit Date:** 2026-03-27
**Site:** https://asdlc.io
**Site Type:** Publisher / Knowledge Base (Static Astro 5.x on Netlify)
**Content Files Analyzed:** 63 (53 Live/Experimental exposed via MCP)
**Collections:** Concepts (32), Patterns (16), Practices (15)
**Total Words:** 55,668 (avg 883/article)

---

## Executive Summary

**Overall GEO Score: 76/100 (Good)**

ASDLC.io has a strong GEO foundation: SSG rendering, explicit AI crawler whitelisting, a live MCP server, comprehensive SEO metadata, and high-quality original content with 84% citation coverage. The three biggest gaps are: (1) missing BreadcrumbList and index-page schema markup, (2) relatedIds not exposed via MCP (breaking knowledge graph navigation), and (3) no individual author attribution (weakening E-E-A-T). Fixing these three would push the score to 85+.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 82/100 | 30% | 24.6 |
| Content E-E-A-T | 72/100 | 25% | 18.0 |
| Technical GEO | 84/100 | 15% | 12.6 |
| Schema & Structured Data | 62/100 | 15% | 9.3 |
| Knowledge Base & MCP | 78/100 | 15% | 11.7 |
| **Overall GEO Score** | | | **76.2/100** |

---

## Critical Issues (Fix Immediately)

### 1. Collection Index Pages Have Zero Structured Data
**Files:** `src/pages/concepts/index.astro`, `src/pages/patterns/index.astro`, `src/pages/practices/index.astro`
**Impact:** Three high-traffic hub pages have no JSON-LD. Search engines cannot parse collection structure.
**Fix:** Inject `ItemList` schema listing all articles with position, name, url, and description.

### 2. relatedIds Not Exposed in MCP articles.json
**File:** `scripts/generate-mcp-index.mjs` (line ~48)
**Impact:** MCP tools cannot expose the knowledge graph. Agents see disconnected articles instead of a curated network. 61/63 articles have relatedIds in frontmatter, but the index generation script drops them.
**Fix:** Add `relatedIds: data.relatedIds || []` to the article push in generate-mcp-index.mjs.

### 3. No BreadcrumbList Schema on Article Pages
**Files:** `src/pages/concepts/[...slug].astro`, `src/pages/patterns/[...slug].astro`, `src/pages/practices/[...slug].astro`
**Impact:** Missing breadcrumb rich snippets in search results. Hierarchy (Home > Collection > Article) not machine-readable.
**Fix:** Add BreadcrumbList JSON-LD to article pages or create a Breadcrumb component.

---

## High Priority Issues

### 4. No Individual Author Attribution
**File:** `src/components/StructuredData.astro` (line 38)
**Impact:** All articles attribute author as "ASDLC.io Contributors" — an opaque collective. E-E-A-T requires identifiable expertise. No about page, team page, or contributor bios exist.
**Fix:** Create an about/team page. Add author field to `articleSchema` in `src/content/config.ts`. At minimum, list Ville Takanen as primary author with credentials.

### 5. llms.txt Content-Type Header Missing
**File:** `netlify.toml` (no headers section for llms.txt)
**Impact:** `public/llms.txt` exists and builds to `dist/llms.txt`, but live fetch returned homepage content instead of the file — likely a Content-Type or redirect issue.
**Fix:** Add to `netlify.toml`:
```toml
[[headers]]
  for = "/llms.txt"
  [headers.values]
    Content-Type = "text/plain; charset=utf-8"
```

### 6. 9 Core Articles Have Zero External References
**Articles:** agentic-sdlc, experience-modeling, spec-reversing, the-pbi, adversarial-code-review (pattern), adversarial-requirement-review, constitutional-review-implementation, context-mapping, context-offloading
**Impact:** Foundational articles (especially agentic-sdlc, the framework definition) lack citations, reducing credibility.
**Fix:** Add 3-5 references per article. Priority: agentic-sdlc and the-pbi as core framework articles.

### 7. No FAQ Sections in Content
**Impact:** Zero articles have explicit FAQ/Q&A blocks. This misses FAQ rich snippet opportunities and reduces AI answer extraction quality.
**Fix:** Add 3-5 FAQ items to high-value articles: agentic-sdlc, context-engineering, vibe-coding, agents-md-spec, levels-of-autonomy.

---

## Medium Priority Issues

### 8. Missing mainEntityOfPage, isPartOf, inLanguage in TechArticle Schema
**File:** `src/components/StructuredData.astro`
**Impact:** TechArticle schema has 11/20 recommended fields (55% completeness). Missing properties reduce knowledge graph connectivity.
**Fix:** Add `mainEntityOfPage: { "@id": data.url }`, `isPartOf: { "@type": "WebSite", name: "ASDLC.io" }`, `inLanguage: "en"`.

### 9. No HowTo Schema for Practice Articles
**File:** `src/pages/practices/[...slug].astro`
**Impact:** Practice articles are procedural (step-by-step processes) but lack HowTo schema. Missed rich snippet opportunity.
**Fix:** Add HowTo JSON-LD to practice pages, mapping article steps to HowTo schema structure.

### 10. Schema References Undefined Fields
**Files:** `src/components/StructuredData.astro` (lines 55-59), `src/content/config.ts`
**Impact:** StructuredData references `proficiencyLevel` and `complexity` which don't exist in articleSchema. Values silently resolve to undefined.
**Fix:** Either add these fields to articleSchema or remove the dead code from StructuredData.

### 11. No RSS/Atom Feed
**Impact:** No syndication mechanism for content updates. Lower priority given MCP-first approach, but RSS helps traditional aggregators and some AI training pipelines.
**Fix:** Add `@astrojs/rss` integration.

### 12. Only 11% of Articles Use longTitle
**Impact:** 6/53 articles have longTitle (the SEO-optimized H1). Most articles use the 40-char `title` as both card label and page heading.
**Fix:** Add longTitle to remaining articles for better search result titles.

---

## Low Priority Issues

### 13. Missing Explicit Cache Headers
**File:** `netlify.toml`
**Impact:** Using Netlify defaults. Explicit cache headers would improve crawler efficiency.

### 14. No Organization sameAs Links
**File:** `src/components/StructuredData.astro`
**Impact:** Organization schema lacks social profile links (GitHub, etc.).

### 15. Vibe Coding Article Failure Modes Not Numbered
**File:** `src/content/concepts/vibe-coding.md` (lines 87-138)
**Impact:** Dense paragraph format reduces AI extractability. Numbered list would improve citability.

### 16. No Bidirectionality Validation Script
**Impact:** relatedIds should be bidirectional (if A links B, B links A). No automated check exists.

---

## Source vs. Rendered Discrepancies

| Check | Source | Rendered | Status |
|---|---|---|---|
| Homepage JSON-LD (Organization + WebSite) | `src/pages/index.astro` | Both blocks present | OK |
| Article TechArticle JSON-LD | `src/pages/concepts/[...slug].astro` | Present with correct fields | OK |
| OG Tags | `src/components/SEOMetadata.astro` | Present (confirmed via rendered HTML) | OK |
| Canonical URLs | SEOMetadata generates dynamically | Confirmed on `/patterns/the-spec/` | OK |
| `llms.txt` | `public/llms.txt` (41 lines) | **Returned homepage content, not file** | DISCREPANCY |
| Sitemap | `@astrojs/sitemap` configured | `sitemap-index.xml` present, points to `sitemap-0.xml` | OK |
| `robots.txt` | `public/robots.txt` (27 lines) | All AI crawlers explicitly allowed | OK |
| Semantic HTML `<main>` | `BaseLayout.astro` line 32 | Present | OK |
| Semantic HTML `<article>` | Article pages use `<article>` tag | Confirmed on `/patterns/the-spec/` | OK |

**Key Discrepancy:** `llms.txt` exists in source and builds correctly, but live site may not serve it as `text/plain`. Needs Netlify headers fix.

---

## Category Deep Dives

### AI Citability (82/100)

**Strengths:**
- Clear definition blocks at the top of most articles (88% start with explicit definitions)
- Strong use of comparison tables (State vs Delta in The Spec, L1-L5 in Levels of Autonomy, Constitution vs Spec)
- Rich blockquotes with attribution (Martin Fowler, Linus Torvalds, Boris Cherny, Anthropic research)
- Statistics-rich content (Anthropic 80-90%, Google 30%, Forrester 75% predictions)
- Structured H2/H3 hierarchy navigable by AI

**Weaknesses:**
- Zero FAQ/Q&A sections across all articles
- Some failure mode lists use paragraph format instead of numbered lists (vibe-coding)
- Definitions occasionally run 3-4 sentences when 1-2 would be more extractable
- No "One-Liner" answer blocks for quick AI extraction

**Top citability articles:** agents-md-spec (89), context-engineering (88), levels-of-autonomy (87), the-spec (87)
**Lowest citability:** vibe-coding (79), ralph-loop (83)

### Content E-E-A-T (72/100)

**Strengths:**
- 84% of articles cite external sources (53/63)
- Original frameworks: Triple Debt Model (arxiv paper with Kent Beck review), Agentic Double Diamond
- Active maintenance: 80%+ articles updated March 2026
- 97% cross-referencing (61/63 have relatedIds)
- Clear governance: status taxonomy (Live/Experimental/Draft/Proposed/Deprecated)

**Weaknesses:**
- No individual author attribution (all "ASDLC.io Contributors")
- No about/team page with credentials
- No institutional backing or third-party endorsements
- 72% of references are websites/blogs; only 19% peer-reviewed papers
- AI contribution transparency unclear

### Technical GEO (84/100)

**Strengths:**
- SSG rendering (optimal for crawlers) — 10/10
- All AI crawlers explicitly whitelisted in robots.txt — 9/10
- MCP server exposed at /mcp with 3 tools — 10/10
- Comprehensive meta tags (OG, Twitter Cards, canonical, robots) — 10/10
- Sitemap properly configured — 8/10

**Weaknesses:**
- llms.txt serving issue (Content-Type header needed) — 6/10
- No RSS/Atom feed — 0/10
- No explicit cache headers in netlify.toml — 5/10

### Schema & Structured Data (62/100)

**Strengths:**
- TechArticle JSON-LD on all 63 article pages
- Organization + WebSite schema on homepage
- OG tags and Twitter Cards on all pages
- Canonical URLs implemented

**Weaknesses:**
- No BreadcrumbList schema (0% breadcrumb coverage)
- No FAQPage or HowTo schema
- No ItemList on collection index pages (3 hub pages with zero schema)
- TechArticle missing mainEntityOfPage, isPartOf, inLanguage (55% field completeness)
- Dead code references undefined schema fields (proficiencyLevel, complexity)

### Knowledge Base & MCP (78/100)

**Strengths:**
- MCP server production-ready with 3 well-defined tools — 92/100
- Content service with Fuse.js fuzzy search — 88/100
- llms.txt well-structured with machine access section — 90/100
- 100% valid kebab-case slugs, avg 16.5 chars — 89/100
- Downloadable skill bundle with manifest — 85/100

**Weaknesses:**
- relatedIds dropped from articles.json (CRITICAL) — 28/100 relationship density
- 9 articles with zero references — 79/100 reference coverage
- No MCP tool for relationship discovery
- Search results don't expose relevance scores

---

## Quick Wins (Implement This Week)

1. **Add `relatedIds` to MCP index** — `scripts/generate-mcp-index.mjs` line ~48. Add `relatedIds: data.relatedIds || []`. Rebuild with `pnpm build:mcp-index`. (30 min, +10 MCP score)

2. **Fix llms.txt serving** — Add `[[headers]]` block to `netlify.toml` for `/llms.txt` with `Content-Type: text/plain; charset=utf-8`. (5 min, +4 Technical score)

3. **Add BreadcrumbList schema** — Create `BreadcrumbList.astro` component, inject in article pages. Three-level: Home > Collection > Article. (1 hour, +8 Schema score)

4. **Add ItemList schema to index pages** — Inject in `src/pages/concepts/index.astro`, `patterns/index.astro`, `practices/index.astro`. (1 hour, +5 Schema score)

5. **Add mainEntityOfPage + isPartOf + inLanguage** to StructuredData.astro TechArticle block. (15 min, +3 Schema score)

## 30-Day Action Plan

### Week 1: Schema & Infrastructure Fixes
- [ ] Add BreadcrumbList schema component (`src/components/BreadcrumbList.astro`)
- [ ] Add ItemList schema to collection index pages
- [ ] Add mainEntityOfPage, isPartOf, inLanguage to TechArticle
- [ ] Fix llms.txt Content-Type header in `netlify.toml`
- [ ] Add relatedIds to MCP index generation script
- [ ] Remove dead proficiencyLevel/complexity references from StructuredData.astro

### Week 2: Content Credibility
- [ ] Create about/team page with author credentials
- [ ] Add author field to articleSchema in `src/content/config.ts`
- [ ] Add references to 9 orphaned articles (priority: agentic-sdlc, the-pbi)
- [ ] Add longTitle to 10 highest-traffic articles

### Week 3: AI Citability Boost
- [ ] Add FAQ sections to 5 key articles (agentic-sdlc, context-engineering, vibe-coding, agents-md-spec, levels-of-autonomy)
- [ ] Add FAQPage schema for articles with FAQ sections
- [ ] Number failure mode lists in vibe-coding, ralph-loop
- [ ] Add HowTo schema variant for practice articles

### Week 4: Polish & Validation
- [ ] Implement RSS/Atom feed (`@astrojs/rss`)
- [ ] Add bidirectionality validation script for relatedIds
- [ ] Add explicit cache headers to netlify.toml
- [ ] Add Organization sameAs links (GitHub)
- [ ] Run full GEO re-audit to measure improvement

---

## Appendix: Content Analyzed (Live + Experimental)

| Collection | Article | Status | GEO Issues |
|---|---|---|---|
| concepts | 4d-framework | Live | 0 |
| concepts | agentic-sdlc | Live | 2 (no references, no FAQ) |
| concepts | ai-software-factory | Experimental | 0 |
| concepts | architecture-decision-record | Live | 0 |
| concepts | behavior-driven-development | Live | 0 |
| concepts | context-anchoring | Live | 0 |
| concepts | context-engineering | Live | 1 (no FAQ) |
| concepts | digital-twins | Experimental | 0 |
| concepts | event-modeling | Experimental | 0 |
| concepts | extreme-programming | Live | 0 |
| concepts | feedback-loop-compression | Experimental | 0 |
| concepts | gherkin | Live | 0 |
| concepts | learning-loop | Live | 0 |
| concepts | levels-of-autonomy | Live | 1 (no FAQ) |
| concepts | mermaid | Live | 0 |
| concepts | model-driven-development | Live | 0 |
| concepts | ooda-loop | Live | 0 |
| concepts | product-requirement-prompt | Experimental | 0 |
| concepts | product-thinking | Experimental | 0 |
| concepts | production-readiness-gap | Experimental | 0 |
| concepts | provenance | Experimental | 0 |
| concepts | request-for-comments | Live | 0 |
| concepts | spec-driven-development | Live | 1 (no FAQ) |
| concepts | triple-debt-model | Experimental | 0 |
| concepts | vibe-coding | Experimental | 2 (no FAQ, unnumbered failure modes) |
| concepts | yaml | Live | 0 |
| patterns | adversarial-code-review | Live | 1 (no references) |
| patterns | agent-constitution | Live | 1 (no FAQ) |
| patterns | agent-optimization-loop | Experimental | 0 |
| patterns | agentic-double-diamond | Experimental | 0 |
| patterns | constitutional-review | Live | 0 |
| patterns | context-gates | Experimental | 0 |
| patterns | context-map | Experimental | 0 |
| patterns | experience-modeling | Live | 1 (no references) |
| patterns | model-routing | Live | 0 |
| patterns | product-vision | Live | 0 |
| patterns | ralph-loop | Live | 1 (dense sections) |
| patterns | spec-reversing | Experimental | 1 (no references) |
| patterns | the-adr | Live | 0 |
| patterns | the-pbi | Live | 1 (no references) |
| patterns | the-spec | Live | 0 |
| practices | adr-authoring | Live | 0 |
| practices | adversarial-code-review | Live | 1 (no references) |
| practices | adversarial-requirement-review | Experimental | 1 (no references) |
| practices | agent-personas | Live | 0 |
| practices | agents-md-spec | Live | 0 |
| practices | constitutional-review-implementation | Experimental | 1 (no references) |
| practices | context-mapping | Experimental | 1 (no references) |
| practices | context-offloading | Experimental | 1 (no references) |
| practices | living-specs | Experimental | 0 |
| practices | micro-commits | Live | 0 |
| practices | pbi-authoring | Live | 0 |
| practices | workflow-as-code | Experimental | 0 |
