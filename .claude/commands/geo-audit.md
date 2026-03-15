---
name: geo-audit
description: GEO+SEO audit of asdlc.io — analyzes the codebase for Generative Engine Optimization across AI citability, technical infrastructure, content quality, schema markup, and knowledge base discoverability. Produces a composite GEO Score (0-100) with prioritized action plan.
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
  - Agent
  - Write
  - WebFetch
  - mcp__asdlc__list_articles
  - mcp__asdlc__get_article
  - mcp__asdlc__search_knowledge_base
---

# GEO Audit — ASDLC.io

## Purpose

Perform a comprehensive Generative Engine Optimization (GEO) audit of the asdlc.io codebase. GEO is the practice of optimizing web content so that AI systems (ChatGPT, Claude, Perplexity, Gemini, etc.) can discover, understand, cite, and recommend it.

ASDLC.io is a **Publisher / Knowledge Base** site — a static Astro site documenting Agentic SDLC patterns. The audit focuses on how well the content, schema, and technical infrastructure support AI citation and recommendation.

**Site type:** Static Astro 5.x site deployed on Netlify
**Domain:** https://asdlc.io
**Content model:** Three collections (concepts, patterns, practices) with MCP server exposure

---

## Audit Workflow

### Phase 0: Live Site Reality Check

Before diving into source code, fetch the live site to validate what AI crawlers actually see. This catches build-time bugs where source looks correct but rendered output is broken.

**Step 1: Fetch Key Pages**

Use WebFetch to retrieve rendered HTML from `https://asdlc.io` for these pages:
1. Homepage (`/`)
2. One article from each collection (e.g., `/concepts/agentic-sdlc`, `/patterns/` first listed, `/practices/` first listed)
3. `/robots.txt`
4. `/sitemap-index.xml` (or `/sitemap.xml`)
5. `/llms.txt` (expect 404 — record absence)

Enforce a 30-second timeout per fetch. If the live site is unreachable, log the failure and continue with codebase-only analysis.

**Step 2: Rendered Output Validation**

For each fetched page, extract and record:
- **Actual `<title>` and `<meta name="description">`** — do they match what the source code intends?
- **JSON-LD blocks** — parse every `<script type="application/ld+json">` and validate the schema types and fields actually present in rendered HTML.
- **Open Graph tags** — extract `og:title`, `og:description`, `og:image`, `og:url`, `og:type`.
- **Canonical URL** — does `<link rel="canonical">` resolve correctly?
- **Heading structure** — is there exactly one `<h1>`? Does the heading hierarchy make sense?
- **Content accessibility** — is main content in semantic HTML (`<article>`, `<main>`, `<section>`) or buried in JS-rendered divs?
- **Response headers** — note `X-Robots-Tag`, `Cache-Control`, and any AI-relevant headers.

**Step 3: Source vs. Rendered Diff**

Flag any discrepancies between what the source code defines and what the rendered output contains. Common issues:
- Schema markup defined in a component but not rendered on a page (missing import, conditional logic)
- Meta descriptions in frontmatter that don't appear in rendered `<head>`
- Sitemap listing pages that 404, or missing pages that should be listed
- `robots.txt` directives that don't match Netlify headers config

Record all discrepancies for inclusion in the final report under a dedicated "Source vs. Rendered" section.

---

### Phase 1: Codebase Deep Analysis

Analyze the source code for everything that can't be seen from the rendered output — content quality, relationship density, MCP internals, schema completeness across all pages.

**Step 1: Content Inventory**

1. Use `mcp__asdlc__list_articles` to get the full article manifest.
2. Read `src/content/config.ts` to understand the schema and frontmatter fields.
3. Glob `src/content/**/*.{md,mdx}` to count total content files.
4. For each collection (concepts, patterns, practices), record:
   - Total article count and status distribution (Live, Experimental, Draft)
   - Word count sampling (read 3-5 articles per collection)
   - Frontmatter completeness (description, tags, relatedConcepts, etc.)

**Step 2: Technical Infrastructure Scan**

1. Read `public/robots.txt` — check AI crawler directives (GPTBot, ClaudeBot, PerplexityBot, etc.)
2. Check for `public/llms.txt` or `public/.well-known/llms.txt` presence.
3. Read `astro.config.mjs` — check sitemap integration, site URL, output config.
4. Read `src/layouts/BaseLayout.astro` — check meta tags, structured data injection points.
5. Read `src/components/SEOMetadata.astro` — audit Open Graph, Twitter Cards, canonical URLs.
6. Check for `src/pages/sitemap*.xml*` or sitemap integration in astro config.
7. Verify the MCP server setup: read `netlify/edge-functions/mcp.ts` or equivalent.

**Step 3: Schema & Structured Data Scan**

1. Grep for `application/ld+json` across all `.astro` files — catalog all JSON-LD blocks.
2. Grep for schema.org types: Article, TechArticle, WebSite, Organization, BreadcrumbList, FAQPage, HowTo.
3. Read any schema generation components or utilities.
4. Check if schema is present on article pages, index pages, and the homepage.

---

### Phase 2: Parallel Analysis (Use Agent tool for subagents)

Delegate to 5 parallel subagents. Each analyzes collected data and returns a category score (0-100) plus findings.

**Subagent 1: AI Citability Analysis**

Analyze content files for AI quotability:
- Are content blocks self-contained? (Can an AI extract a useful answer without surrounding context?)
- Do articles contain clear definition blocks, numbered steps, comparison tables, or statistical claims?
- Are key terms defined explicitly near their first use?
- Do articles have strong opening paragraphs that summarize the core concept?
- Is content structured with clear H2/H3 hierarchy that AI can navigate?
- Are there FAQ-style sections or explicit Q&A blocks?
- Sample 5-8 articles across collections and score passage quality.

Score 0-100 based on: passage self-containment, answer block density, definition clarity, structural navigability.

**Subagent 2: Technical GEO Infrastructure**

Analyze technical setup for AI discoverability:
- `robots.txt`: Are AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Googlebot, Bingbot) allowed or blocked?
- `llms.txt`: Does it exist? Is it well-structured per the llms.txt spec?
- Sitemap: Is it configured and does it include all live content?
- Meta tags: Are canonical URLs, Open Graph, Twitter Cards properly configured?
- Rendering: Is the site SSG (good) or client-rendered (bad for AI crawlers)?
- MCP server: Is the knowledge base exposed via MCP for direct agent consumption?
- RSS/Atom feed: Is there a feed for content syndication?
- Response headers: Check for any AI-relevant headers in Netlify config.

Score 0-100 based on: crawler access, discoverability signals, rendering approach, MCP exposure.

**Subagent 3: Content E-E-A-T Quality**

Evaluate Experience, Expertise, Authoritativeness, Trustworthiness:
- Author attribution: Are articles attributed to named authors with credentials?
- Source citations: Do articles cite external research, standards, or authoritative sources?
- Content depth: Average word count, use of examples, code samples, diagrams.
- Content freshness: Are dates present? Are articles updated regularly?
- About/team page: Does the site establish organizational credibility?
- Cross-referencing: Do articles link to related content within the knowledge base?
- Original research: Does the site present novel frameworks or just aggregate existing knowledge?

Score 0-100 based on: attribution quality, citation density, content depth, freshness, authority signals.

**Subagent 4: Schema & Structured Data**

Validate all structured data:
- Catalog every JSON-LD block and its schema.org type.
- Check for GEO-critical types: Article/TechArticle, Organization, WebSite, BreadcrumbList, FAQPage, HowTo.
- Validate schema completeness (are required fields populated?).
- Check if article pages have Article schema with: headline, description, datePublished, dateModified, author, publisher.
- Check if the homepage has Organization + WebSite schema.
- Identify missing schema opportunities (e.g., FAQ content without FAQPage schema).
- Check for breadcrumb navigation and BreadcrumbList schema.

Score 0-100 based on: schema coverage, type diversity, field completeness, validation correctness.

**Subagent 5: Knowledge Base & MCP Optimization**

Evaluate the MCP server and knowledge base discoverability:
- Is the MCP server properly configured and exposing all live content?
- Is `articles.json` manifest complete and well-structured?
- Are article slugs, titles, and descriptions optimized for search/discovery?
- Is there a search index (Fuse.js) for keyword matching?
- Are content relationships (relatedConcepts, relatedPatterns) well-connected?
- Is the downloadable skill (`dist/skill/`) well-structured for offline agent consumption?
- Are there entry points that help AI agents navigate the knowledge base?

Score 0-100 based on: MCP completeness, manifest quality, relationship density, agent navigability.

---

### Phase 3: Score Aggregation and Report

#### Composite GEO Score Calculation

Weights are adjusted for a **Publisher / Knowledge Base** site type:

| Category | Weight | What It Measures |
|---|---|---|
| **AI Citability** | 30% | How quotable/extractable content is for AI systems |
| **Content E-E-A-T** | 25% | Experience, Expertise, Authoritativeness, Trustworthiness |
| **Technical GEO** | 15% | AI crawler access, llms.txt, sitemap, meta tags, rendering |
| **Schema & Structured Data** | 15% | Schema.org markup quality and completeness |
| **Knowledge Base & MCP** | 15% | MCP server quality, agent navigability, relationship density |

**Formula:**
```
GEO_Score = (Citability * 0.30) + (EEAT * 0.25) + (Technical * 0.15) + (Schema * 0.15) + (MCP * 0.15)
```

#### Score Interpretation

| Score Range | Rating | Interpretation |
|---|---|---|
| 90-100 | Excellent | Top-tier GEO; site is highly likely to be cited by AI |
| 75-89 | Good | Strong GEO foundation with room for improvement |
| 60-74 | Fair | Moderate GEO presence; significant opportunities exist |
| 40-59 | Poor | Weak GEO signals; AI systems may struggle to cite |
| 0-39 | Critical | Minimal GEO optimization; largely invisible to AI |

---

## Issue Severity Classification

### Critical (Fix Immediately)
- AI crawlers blocked in robots.txt
- No structured data on any page
- Missing sitemap
- Broken MCP server
- No meta descriptions on content pages

### High (Fix Within 1 Week)
- No llms.txt file
- Missing Article/TechArticle schema on content pages
- No author attribution on articles
- MCP manifest out of sync with content
- Zero FAQ or definition blocks in content

### Medium (Fix Within 1 Month)
- Incomplete schema fields (missing dateModified, author, etc.)
- Thin content (articles under 500 words)
- Missing cross-references between related articles
- No BreadcrumbList schema
- Incomplete Open Graph tags

### Low (Optimize When Possible)
- Minor schema validation issues
- Missing alt text on diagrams
- Content freshness gaps on non-critical pages
- Suboptimal heading hierarchy
- Missing RSS/Atom feed

---

## Output Format

Generate a file called `docs/reports/GEO-AUDIT-REPORT.md` with the following structure:

```markdown
# GEO Audit Report: ASDLC.io

**Audit Date:** [Date]
**Site:** https://asdlc.io
**Site Type:** Publisher / Knowledge Base (Static Astro 5.x on Netlify)
**Content Files Analyzed:** [Count]
**Collections:** Concepts, Patterns, Practices

---

## Executive Summary

**Overall GEO Score: [X]/100 ([Rating])**

[2-3 sentence summary of GEO health, biggest strengths, and most critical gaps.]

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | [X]/100 | 30% | [X] |
| Content E-E-A-T | [X]/100 | 25% | [X] |
| Technical GEO | [X]/100 | 15% | [X] |
| Schema & Structured Data | [X]/100 | 15% | [X] |
| Knowledge Base & MCP | [X]/100 | 15% | [X] |
| **Overall GEO Score** | | | **[X]/100** |

---

## Critical Issues (Fix Immediately)

[List each critical issue with specific file paths and recommended fix]

## High Priority Issues

[List each high-priority issue with details and file paths]

## Medium Priority Issues

[List each medium-priority issue]

## Low Priority Issues

[List each low-priority issue]

---

## Source vs. Rendered Discrepancies

[List any differences between what the source code defines and what the live site actually renders. If no discrepancies found, state "No discrepancies detected." Include the specific URLs checked and what was compared.]

---

## Category Deep Dives

### AI Citability ([X]/100)
[Detailed findings with specific article examples, passage quality analysis, rewrite suggestions]

### Content E-E-A-T ([X]/100)
[Author attribution, citations, depth, freshness, authority signals]

### Technical GEO ([X]/100)
[Crawler access, llms.txt, sitemap, meta tags, rendering, MCP endpoint]

### Schema & Structured Data ([X]/100)
[Schema types found, validation results, missing opportunities with file paths]

### Knowledge Base & MCP ([X]/100)
[MCP server quality, manifest completeness, relationship density, agent navigability]

---

## Quick Wins (Implement This Week)

1. [Specific actionable item with file path and expected impact]
2. ...
3. ...
4. ...
5. ...

## 30-Day Action Plan

### Week 1: [Theme]
- [ ] Action item with file path
- [ ] ...

### Week 2: [Theme]
- [ ] ...

### Week 3: [Theme]
- [ ] ...

### Week 4: [Theme]
- [ ] ...

---

## Appendix: Content Analyzed

| Collection | Article | Status | GEO Issues |
|---|---|---|---|
| [collection] | [title] | [status] | [issue count] |
```

---

## Quality Gates

- Analyze ALL content files, not just a sample (the site is small enough).
- Every finding must reference a specific file path in the codebase.
- Quick wins must be implementable by a @Dev agent from the description alone.
- The report must be actionable — no vague recommendations like "improve content quality."
- Run `mcp__asdlc__list_articles` to ensure the MCP index is current before auditing.

**Task:** $ARGUMENTS
