# GEO Audit Report: ASDLC.io

**Audit Date:** 2026-03-14
**Site:** https://asdlc.io
**Site Type:** Publisher / Knowledge Base (Static Astro 5.x on Netlify)
**Content Files Analyzed:** 61 markdown files (52 Live/Experimental exposed via MCP)
**Collections:** Concepts (26), Patterns (20), Practices (15)

---

## Executive Summary

**Overall GEO Score: 66/100 (Fair)**

ASDLC.io has a strong content foundation and a unique competitive advantage in its MCP server — a machine-readable knowledge base API that most sites lack entirely. Content is fresh (92% updated in 2026), well-structured with clear definitions, and supported by 120+ external references. However, **three critical gaps** suppress the score: (1) no structured data on the homepage or collection indexes, (2) no individual author attribution anywhere, and (3) no `llms.txt` file for AI crawler guidance. Fixing schema markup alone would lift the score by ~15 points.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 74/100 | 30% | 22.2 |
| Content E-E-A-T | 68/100 | 25% | 17.0 |
| Technical GEO | 65/100 | 15% | 9.75 |
| Schema & Structured Data | 34/100 | 15% | 5.1 |
| Knowledge Base & MCP | 78/100 | 15% | 11.7 |
| **Overall GEO Score** | | | **65.75 ~ 66/100** |

---

## Critical Issues (Fix Immediately)

### 1. Homepage has zero structured data
**Severity:** Critical
**Files:** `src/pages/index.astro`
**Issue:** No WebSite or Organization JSON-LD schema on the homepage. This is the single most important page for Google Knowledge Panel eligibility and AI entity recognition.
**Fix:** Import `StructuredData` component and add both WebSite (with SearchAction if search exists) and Organization schemas.

### 2. No `llms.txt` file
**Severity:** Critical
**Files:** `public/llms.txt` (create)
**Issue:** 404 on live site. This emerging standard (adopted by OpenAI/Anthropic ecosystem) declares LLM training data preferences and API endpoints. Its absence means AI crawlers must guess whether content is available for training/citation.
**Fix:** Create `public/llms.txt` declaring attribution policy, content license, and MCP endpoint URL.

### 3. Missing `datePublished` in TechArticle schema
**Severity:** Critical
**Files:** `src/pages/concepts/[...slug].astro`, `src/pages/practices/[...slug].astro`
**Issue:** Concepts and practices pass `dateModified` but not `datePublished` to the StructuredData component. Search engines infer publish date from crawl time when this field is missing, degrading freshness signals.
**Fix:** Add `datePublished: data.lastUpdated.toISOString()` to structuredDataProps (or add a dedicated `datePublished` field to the schema).

---

## High Priority Issues

### 4. No individual author attribution
**Severity:** High
**Files:** `src/content/config.ts`, `src/components/StructuredData.astro`, `src/components/SpecHeader.astro`
**Issue:** All 52 articles are attributed to "ASDLC.io Contributors" — an anonymous collective. The content schema has no `author` field. Google and AI systems strongly reward named subject-matter experts with verifiable credentials.
**Fix:** Add `author: z.string().optional()` to articleSchema, update StructuredData to emit `Person` type when author is present, display byline in SpecHeader.

### 5. No About/Team page
**Severity:** High
**Files:** `src/pages/about.astro` (create)
**Issue:** No page establishes organizational credibility. The only named person on the site is Ville Takanen (homepage blockquote). AI systems and Google E-E-A-T evaluators cannot assess who maintains this knowledge base.
**Fix:** Create `/about` with team bios, organizational background, and contact info.

### 6. Patterns hardcode descriptions in schema
**Severity:** High
**File:** `src/pages/patterns/[...slug].astro:30`
**Issue:** Pattern pages pass `description: "Architectural pattern: ${pattern.data.title}"` to StructuredData instead of the actual article description. This wastes the rich description metadata in frontmatter.
**Fix:** Change to `description: pattern.data.description`.

### 7. Patterns missing keywords in schema
**Severity:** High
**File:** `src/pages/patterns/[...slug].astro`
**Issue:** Concepts and practices pass `keywords` (from tags) to TechArticle schema, but patterns do not.
**Fix:** Add `keywords: pattern.data.tags?.join(", ")` to structuredDataProps.

### 8. No BreadcrumbList schema anywhere
**Severity:** High
**Files:** All `[...slug].astro` pages, `src/layouts/CollectionIndex.astro`
**Issue:** BreadcrumbList is one of the highest-impact schema types for SERP CTR. Zero breadcrumb markup exists on any page.
**Fix:** Create a `BreadcrumbSchema.astro` component and render on all article and index pages (Home > Collection > Article).

### 9. No RSS/Atom feed
**Severity:** High
**Issue:** No feed infrastructure exists. LLM knowledge crawlers prefer structured feeds to repetitive HTML crawling for detecting content updates.
**Fix:** Add `@astrojs/rss` integration or generate feed via post-build script.

### 10. Practices collection severely under-cited
**Severity:** High
**Files:** `src/content/practices/*.md`
**Issue:** Practices average 0.92 references per article vs. 2.5+ for concepts/patterns. Most practices have zero external citations, weakening their authority.
**Fix:** Add 2-3 references to each practice article citing the patterns/concepts they implement and external validation sources.

---

## Medium Priority Issues

### 11. No FAQ sections in content
**Files:** All content articles
**Issue:** Zero articles use explicit FAQ or Q&A blocks. AI systems extract question-answer pairs for featured snippets and citation. "Common Mistakes" sections exist but use Problem/Solution format instead of Q/A.
**Fix:** Add FAQ sections to high-traffic articles (context-engineering, spec-driven-development, agents-md-spec).

### 12. Collection index pages have no schema
**Files:** `src/pages/concepts/index.astro`, `src/pages/patterns/index.astro`, `src/pages/practices/index.astro`
**Issue:** No CollectionPage or ItemList schema on index pages. These are high-authority aggregation pages that could signal content hierarchy to search engines.
**Fix:** Add CollectionPage + ItemList schema to `src/layouts/CollectionIndex.astro`.

### 13. Content relationships not bidirectional
**Files:** `src/content/**/*.md`, `scripts/generate-mcp-index.mjs`
**Issue:** If article A links to B via `relatedIds`, B doesn't automatically link back to A. 6 articles have no `relatedIds` at all. Practices cluster in isolation from each other.
**Fix:** Implement bidirectional link resolution in the MCP index generation script. Audit all relatedIds for completeness.

### 14. robots.txt has no AI-specific directives
**File:** `public/robots.txt`
**Issue:** Generic `User-agent: *` only. No explicit directives for GPTBot, ClaudeBot, PerplexityBot, CCBot. Explicit allow signals increase crawler priority.
**Fix:** Add User-agent blocks for major AI crawlers with explicit Allow directives and the `/mcp` endpoint.

### 15. No custom response headers
**File:** `netlify.toml`
**Issue:** No custom headers for AI optimization or security. Missing `X-Robots-Tag`, `X-Content-Type-Options`, and cache control policies.
**Fix:** Add `[[headers]]` section to netlify.toml with appropriate directives.

### 16. Missing Open Graph `article:` meta tags
**File:** `src/components/SEOMetadata.astro`
**Issue:** No `article:published_time`, `article:modified_time`, or `article:section` meta tags for article-type pages.
**Fix:** Accept `lastUpdated` and `collection` props and render article-specific OG tags when `type === "article"`.

---

## Low Priority Issues

### 17. Practices lack worked examples
**Files:** `src/content/practices/pbi-authoring.md`, `src/content/practices/living-specs.md`
**Issue:** Practices describe processes but don't show concrete before/after examples or git diffs demonstrating the practice in action.

### 18. Mermaid diagrams sparse
**Issue:** Only 7 of 61 articles include mermaid diagrams. Visual content aids AI comprehension of complex patterns.

### 19. No "Getting Started for Agents" guide
**Issue:** Agents encountering ASDLC via MCP have no onboarding path. A dedicated resource would improve cold-start experience.

### 20. OG default image is SVG
**File:** `public/og-default.svg`
**Issue:** Some social platforms and AI crawlers don't render SVG for Open Graph previews. A PNG/JPG fallback would be safer.

### 21. MCP search lacks collection filtering
**File:** `src/mcp/content.ts`
**Issue:** `search_knowledge_base` cannot filter by collection or status. Agents searching for "only patterns" must filter results client-side.

---

## Source vs. Rendered Discrepancies

**URLs checked:** Homepage, `/concepts/agentic-sdlc`, `/practices/living-specs`, `/sitemap-index.xml`, `/llms.txt`

| Check | Source Intent | Rendered Reality | Discrepancy? |
|---|---|---|---|
| Homepage title | `ASDLC.io \| The Agentic...` | WebFetch couldn't extract `<title>` (content processing limitation) | Unable to verify |
| Article meta descriptions | From frontmatter `description` field | Confirmed: "Framework for industrializing..." renders correctly on `/concepts/agentic-sdlc` | No |
| TechArticle JSON-LD | Defined in `[...slug].astro` via StructuredData component | Confirmed: renders with headline, description, author, publisher, dateModified, keywords, url | No |
| Homepage JSON-LD | Not defined (no StructuredData import in `index.astro`) | Confirmed: zero JSON-LD on homepage | Expected (this is the bug) |
| OG tags | Defined in SEOMetadata.astro | WebFetch couldn't extract OG meta tags (content processing limitation) | Unable to verify |
| Sitemap | `@astrojs/sitemap` in astro.config.mjs | Confirmed: 72 URLs in sitemap-0.xml, properly indexed | No |
| llms.txt | Not created | Confirmed: 404 | Expected (missing file) |
| Semantic HTML | `<main>`, `<article>`, `<section>` in source | WebFetch reported "No `<article>`, `<main>`, or `<section>` tags visible" on homepage | **Possible discrepancy** — source uses `<article class="prose">` and `<section>` tags; WebFetch may have missed them due to content extraction |

**Note:** WebFetch processes content through an intermediate model that strips HTML structure. The source code confirms semantic HTML is present (`<main class="grid-layout">` in BaseLayout, `<article>` and `<section>` on homepage and article pages). No real source-vs-rendered discrepancies detected.

---

## Category Deep Dives

### AI Citability (74/100)

**Strengths:**
- Excellent self-contained definition blocks. Every article opens with a clear `## Definition` or `## Overview` that AI can extract as a standalone answer. Example from Context Engineering: *"Context Engineering is the systematic approach to designing and structuring the input context provided to Large Language Models..."*
- Strong anti-pattern taxonomy. 16+ articles include explicit "Anti-Patterns" sections with named patterns and consequences — highly quotable by AI systems.
- Rich statistical claims in concept articles. Vibe Coding cites Forrester, Google (30% AI-generated code), Anthropic (80-90% of Claude Code's codebase written by itself).

**Weaknesses:**
- Zero FAQ/Q&A blocks across all 52 articles. "Common Mistakes" sections exist but use Problem/Solution format, not Question/Answer — less extractable for AI featured snippets.
- Patterns lack "Quick Reference" after definitions. After the definition, articles dive into philosophy before concrete examples. AI must read 500+ words to find actionable content.
- Practices lack statistical validation. Living Specs has zero citations supporting its claims. Compared to concepts (avg 2.5 refs), practices (avg 0.92 refs) are authority-weak.

**Recommendations:**
1. Add FAQ sections to top 10 articles with 3-5 Q&A pairs each
2. Add "Quick Reference" summary blocks immediately after definitions in patterns
3. Strengthen practices with research citations and measurable outcomes

### Content E-E-A-T (68/100)

**Strengths:**
- Content freshness is excellent: 92% of articles updated in 2026, with active curation visible in git history
- External citations are strong in concepts (avg 2.5 refs with Anthropic research, IEEE papers, Martin Fowler, Kent Beck)
- Novel framework synthesis: ASDLC presents original models (Context Engineering as discipline, spec-anchored maturity levels, Ralph Loop) that go beyond aggregation
- Cross-referencing via `relatedIds` averages 5 links per article

**Weaknesses:**
- No individual author attribution (25/100 sub-score). All content credited to anonymous "ASDLC.io Contributors"
- No About/Team page (20/100 sub-score). Only credibility signal is a blockquote attribution to Ville Takanen on the homepage
- Practices severely under-cited. 11 of 14 practice articles have 0-1 references
- No internal case studies. ASDLC documents patterns but doesn't show them applied to a real production system

**Recommendations:**
1. Add `author` field to content schema and populate for all Live articles
2. Create `/about` page with team bios, credentials, organizational background
3. Add 2-3 references to every practice article
4. Publish 1 internal case study ("How ASDLC.io was built using ASDLC")

### Technical GEO (65/100)

**Strengths:**
- Static Site Generation via Astro — pre-rendered HTML, zero JS dependency for content, instant crawlability
- Complete OG + Twitter Card meta tags with canonical URLs on every page
- MCP server at `/mcp` — a unique machine-readable API that most knowledge bases lack
- Sitemap properly configured with 72 URLs auto-generated at build time

**Weaknesses:**
- No `llms.txt` (highest-impact missing file for AI GEO)
- Generic `robots.txt` with no AI-crawler-specific directives
- No RSS/Atom feed for content syndication
- No custom Netlify response headers for cache control or AI optimization
- No `.well-known/` directory configuration

**Recommendations:**
1. Create `public/llms.txt` declaring content license, attribution requirements, and MCP endpoint
2. Add AI crawler directives to `robots.txt` (GPTBot, ClaudeBot, PerplexityBot)
3. Add `@astrojs/rss` for feed generation
4. Add `[[headers]]` to `netlify.toml` with security and cache headers

### Schema & Structured Data (34/100)

**Strengths:**
- Well-architected StructuredData component supporting TechArticle, Article, WebSite, Organization types
- All article detail pages correctly emit TechArticle JSON-LD (confirmed on live site)
- Schema includes headline, description, author, publisher, dateModified, keywords, url

**Weaknesses:**
- Homepage has zero schema (no WebSite, no Organization) — the single biggest gap
- Collection index pages have zero schema (no CollectionPage, no ItemList)
- No BreadcrumbList anywhere on site (massive SERP CTR signal missed)
- `datePublished` missing on concepts and practices (only patterns pass it)
- Patterns hardcode description as "Architectural pattern: {title}" instead of using real description
- Patterns don't pass keywords to schema
- No FAQPage or HowTo schema despite applicable content

**Recommendations (prioritized by impact):**
1. Add WebSite + Organization schema to homepage (+15-20 points)
2. Add BreadcrumbList to all article and index pages (+10-15 points)
3. Fix datePublished, description, and keywords inconsistencies across collections (+5-10 points)
4. Add CollectionPage + ItemList schema to index pages (+5-8 points)

### Knowledge Base & MCP (78/100)

**Strengths:**
- MCP server well-implemented: proper JSON-RPC 2.0, SSE transport, CORS, error handling, heartbeat
- Full article content included in `articles.json` manifest (697 KB) — not just metadata
- Fuse.js search with weighted fields (title > tags > slug > description > content)
- Downloadable static skill with link rewriting, status filtering, and ZIP packaging
- Strong agent navigation: Field Manual, Compendium, Legend, collection indexes

**Weaknesses:**
- Content relationships not bidirectional. `relatedIds` are one-directional; no reverse link resolution
- Practices under-referenced (avg 0.92 refs vs 2.5+ for concepts)
- No "Getting Started for Agents" guide for MCP cold-start
- Search lacks collection/status filtering
- No build-time validation of broken `relatedIds` references
- Field Manual not exposed via MCP (HTML-only)

**Recommendations:**
1. Implement bidirectional relationship resolution in `generate-mcp-index.mjs`
2. Add `get_tags()` MCP tool for guided faceted discovery
3. Create agent onboarding guide at `/resources/getting-started-for-agents`
4. Add `pnpm check:relationships` build validation
5. Expose Field Manual content via MCP

---

## Quick Wins (Implement This Week)

1. **Create `public/llms.txt`** — 30 minutes. Declare content license, MCP endpoint, attribution policy. Estimated score impact: +5-8 points.

2. **Fix patterns schema** (`src/pages/patterns/[...slug].astro`) — 10 minutes. Use `pattern.data.description` instead of hardcoded string. Add `keywords` field. Estimated score impact: +2-3 points.

3. **Add `datePublished` to concepts and practices** (`src/pages/concepts/[...slug].astro`, `src/pages/practices/[...slug].astro`) — 10 minutes. Set to `lastUpdated.toISOString()`. Estimated score impact: +2-3 points.

4. **Add WebSite + Organization schema to homepage** (`src/pages/index.astro`) — 30 minutes. Import StructuredData, add two JSON-LD blocks. Estimated score impact: +5-7 points.

5. **Add AI crawler directives to `robots.txt`** (`public/robots.txt`) — 10 minutes. Add explicit User-agent blocks for GPTBot, ClaudeBot, PerplexityBot with Allow directives. Estimated score impact: +2-3 points.

**Total Quick Wins Impact: +16-24 points (66 → 82-90 range)**

## 30-Day Action Plan

### Week 1: Schema & Technical Foundation
- [ ] Create `public/llms.txt` with content policy and MCP endpoint
- [ ] Fix patterns schema: real description + keywords (`src/pages/patterns/[...slug].astro`)
- [ ] Add `datePublished` to concepts and practices schema output
- [ ] Add WebSite + Organization JSON-LD to homepage (`src/pages/index.astro`)
- [ ] Update `robots.txt` with AI-specific crawler directives
- [ ] Add `[[headers]]` to `netlify.toml` (security + cache headers)

### Week 2: BreadcrumbList & Collection Schema
- [ ] Create `BreadcrumbSchema.astro` component (Home > Collection > Article)
- [ ] Add BreadcrumbList to all `[...slug].astro` article pages
- [ ] Add CollectionPage + ItemList + BreadcrumbList to `CollectionIndex.astro`
- [ ] Add `article:published_time` and `article:modified_time` OG tags to SEOMetadata
- [ ] Add `@astrojs/rss` integration for feed generation

### Week 3: Author Attribution & E-E-A-T
- [ ] Add `author: z.string().optional()` to articleSchema in `src/content/config.ts`
- [ ] Update StructuredData.astro to emit Person author when field is present
- [ ] Add author byline display to SpecHeader.astro
- [ ] Populate `author` frontmatter for all Live/Experimental articles
- [ ] Create `/pages/about.astro` with team bios and organizational background

### Week 4: Content Quality & MCP Enhancement
- [ ] Add FAQ sections to top 5 articles (context-engineering, spec-driven-development, agents-md-spec, the-spec, vibe-coding)
- [ ] Add 2-3 references to every practice article with zero citations
- [ ] Implement bidirectional relatedIds resolution in `generate-mcp-index.mjs`
- [ ] Add `pnpm check:relationships` build validation script
- [ ] Create `/resources/getting-started-for-agents.astro`

---

## Appendix: Content Analyzed

| Collection | Article | Status | GEO Issues |
|---|---|---|---|
| concepts | 4D Framework | Live | No datePublished in schema |
| concepts | Agentic SDLC | Live | No datePublished, 0 references |
| concepts | AI Software Factory | Experimental | No datePublished |
| concepts | Architecture Decision Record | Live | No datePublished |
| concepts | Behavior-Driven Development | Live | No datePublished |
| concepts | Context Anchoring | Live | No datePublished |
| concepts | Context Engineering | Live | No datePublished |
| concepts | Coverage Metric | Experimental | No datePublished |
| concepts | Digital Twins | Live | No datePublished |
| concepts | Event Modeling | Experimental | No datePublished |
| concepts | Extreme Programming | Live | No datePublished |
| concepts | Feedback Loop Compression | Live | No datePublished |
| concepts | Gherkin | Live | No datePublished |
| concepts | Guardrails | Experimental | No datePublished |
| concepts | Learning Loop | Live | No datePublished |
| concepts | Levels of Autonomy | Live | No datePublished |
| concepts | Mermaid | Live | No datePublished |
| concepts | Model Context Protocol | Live | No datePublished |
| concepts | Model-Driven Development | Live | No datePublished |
| concepts | OODA Loop | Live | No datePublished |
| concepts | Product Requirement Prompt | Live | No datePublished |
| concepts | Product Thinking | Live | No datePublished |
| concepts | Production Readiness Gap | Live | No datePublished |
| concepts | Provenance | Live | No datePublished |
| concepts | Request for Comments | Live | No datePublished |
| concepts | Spec-Driven Development | Live | No datePublished |
| concepts | Vibe Coding | Live | No datePublished |
| concepts | YAML | Live | No datePublished |
| patterns | Adversarial Code Review | Live | Hardcoded description, no keywords |
| patterns | Agent Constitution | Live | Hardcoded description, no keywords |
| patterns | Agent Optimization Loop | Live | Hardcoded description, no keywords |
| patterns | Agentic Double Diamond | Live | Hardcoded description, no keywords |
| patterns | Constitutional Review | Live | Hardcoded description, no keywords |
| patterns | Context Gates | Live | Hardcoded description, no keywords |
| patterns | Context Map | Live | Hardcoded description, no keywords |
| patterns | Experience Modeling | Live | Hardcoded description, no keywords |
| patterns | External Attention | Experimental | Hardcoded description, no keywords |
| patterns | Model Routing | Live | Hardcoded description, no keywords |
| patterns | Product Vision | Live | Hardcoded description, no keywords |
| patterns | Ralph Loop | Live | Hardcoded description, no keywords |
| patterns | Spec Reversing | Live | Hardcoded description, no keywords |
| patterns | The ADR | Live | Hardcoded description, no keywords |
| patterns | The PBI | Live | Hardcoded description, no keywords, 0 references |
| patterns | The Spec | Live | Hardcoded description, no keywords |
| practices | ADR Authoring | Live | No datePublished, 0-1 references |
| practices | Adversarial Code Review | Live | No datePublished, 0 references |
| practices | Adversarial Requirement Review | Live | No datePublished |
| practices | Agent Personas | Live | No datePublished |
| practices | AGENTS.md Specification | Live | No datePublished |
| practices | Constitutional Review Implementation | Live | No datePublished |
| practices | Context Mapping | Live | No datePublished |
| practices | Context Offloading | Live | No datePublished |
| practices | Feature Assembly | Experimental | No datePublished, no relatedIds |
| practices | Living Specs | Live | No datePublished, 1 reference |
| practices | Micro-Commits | Live | No datePublished |
| practices | PBI Authoring | Live | No datePublished, 1 reference |
| practices | Product Vision Authoring | Experimental | No datePublished, no relatedIds |
| practices | Workflow as Code | Live | No datePublished |
