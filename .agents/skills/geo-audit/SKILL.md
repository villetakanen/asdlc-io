---
name: geo-audit
description: "GEO+SEO audit of asdlc.io — analyzes the codebase for Generative Engine Optimization across AI citability, technical infrastructure, content quality, schema markup, and knowledge base discoverability. Produces a composite GEO Score (0-100) with prioritized action plan."
version: 1.0.0
---

# GEO Audit — Generative Engine Optimization audit

## Purpose

Perform a comprehensive Generative Engine Optimization (GEO) audit of the asdlc.io codebase. GEO is the practice of optimizing web content so that AI systems (ChatGPT, Claude, Perplexity, Gemini, etc.) can discover, understand, cite, and recommend it.

ASDLC.io is a **Publisher / Knowledge Base** site — a static Astro site documenting Agentic SDLC patterns. The audit focuses on how well the content, schema, and technical infrastructure support AI citation and recommendation.

**Site type:** Static Astro 5.x site deployed on Netlify  
**Domain:** https://asdlc.io  
**Content model:** Three collections (concepts, patterns, practices) with MCP server exposure

## Boundaries

- **In scope:** auditing AI citability, technical GEO infrastructure, E-E-A-T, schema/structured data, and MCP optimization; generating `docs/reports/GEO-AUDIT-REPORT.md`.
- **Out of scope:** implementing code or content changes (`dev`), modifying specs (`spec`), publishing or pushing (`ship`).

---

## Audit Workflow

### Phase 0: Live Site Reality Check

Before diving into source code, fetch the live site to validate what AI crawlers actually see. This catches build-time bugs where source looks correct but rendered output is broken.

**Step 1: Fetch Key Pages**

Use WebFetch / HTTP retrieval to inspect rendered HTML from `https://asdlc.io` for these pages:
1. Homepage (`/`)
2. One article from each collection (e.g., `/concepts/agentic-sdlc`, `/patterns/` first listed, `/practices/` first listed)
3. `/robots.txt`
4. `/sitemap-index.xml` (or `/sitemap.xml`)
5. `/llms.txt`

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

Flag any discrepancies between what the source code defines and what the rendered output contains:
- Schema markup defined in a component but not rendered on a page
- Meta descriptions in frontmatter that do not appear in rendered `<head>`
- Sitemap listing pages that 404, or missing pages that should be listed
- `robots.txt` directives that do not match headers config

Record all discrepancies for inclusion in the final report under a dedicated "Source vs. Rendered" section.

---

### Phase 1: Codebase Deep Analysis

Analyze the source code for everything that cannot be seen from the rendered output — content quality, relationship density, MCP internals, schema completeness across all pages.

**Step 1: Content Inventory**

1. Use `list_articles` to get the full article manifest.
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
6. Check for sitemap integration in astro config.
7. Verify the MCP server setup: read `netlify/edge-functions/mcp.ts` or equivalent.

**Step 3: Schema & Structured Data Scan**

1. Grep for `application/ld+json` across all `.astro` files — catalog all JSON-LD blocks.
2. Grep for schema.org types: Article, TechArticle, WebSite, Organization, BreadcrumbList, FAQPage, HowTo.
3. Read any schema generation components or utilities.
4. Check if schema is present on article pages, index pages, and the homepage.

---

### Phase 2: Parallel Analysis

Analyze collected data across the 5 core categories and calculate scores (0-100) plus findings:

1. **AI Citability Analysis (Weight: 30%)** — passage self-containment, answer block density, definition clarity, structural navigability.
2. **Content E-E-A-T Quality (Weight: 25%)** — attribution quality, citation density, content depth, freshness, authority signals.
3. **Technical GEO Infrastructure (Weight: 15%)** — crawler access, discoverability signals, rendering approach, MCP exposure.
4. **Schema & Structured Data (Weight: 15%)** — schema coverage, type diversity, field completeness, validation correctness.
5. **Knowledge Base & MCP Optimization (Weight: 15%)** — MCP completeness, manifest quality, relationship density, agent navigability.

---

### Phase 3: Score Aggregation and Report

Calculate the Composite GEO Score:
```
GEO_Score = (Citability * 0.30) + (EEAT * 0.25) + (Technical * 0.15) + (Schema * 0.15) + (MCP * 0.15)
```

Generate `docs/reports/GEO-AUDIT-REPORT.md` following the established standard report template.

$ARGUMENTS
