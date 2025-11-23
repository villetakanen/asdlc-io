# PBI-0003: Semantic SEO Foundation for Agentic SDLC Knowledge Base

**ID:** PBI-0003  
**Title:** Implement Semantic HTML, Structured Data, and SEO Metadata Foundation  
**Priority:** Medium  
**Effort:** Medium (5-8 hours)  
**Status:** Backlog  
**Phase:** Phase 3 - Infrastructure & Optimization  
**Tags:** #SEO, #AEO, #Semantic-HTML, #Astro, #Infrastructure, #Accessibility

---

## 1. Strategic Context

As we transition from Phase 2 (content pipeline) to Phase 3, we need a **semantic-first SEO foundation** that:

1. **Aligns with our "Spec-Sheet" aesthetic** - Clean, semantic HTML over bolt-on solutions
2. **Serves both humans and AI agents** - Structured data for LLM citation and traditional search
3. **Leverages existing schemas** - Our `concepts` and `patterns` collections are already well-structured
4. **Follows AGENTS.md principles** - No "vibe coding", explicit implementations, modern APIs only

### Target Audience

- **Primary:** AI agents (ChatGPT, Gemini, Perplexity, Claude) consuming knowledge base content
- **Secondary:** Human developers searching for "Agentic SDLC" concepts and patterns
- **Tertiary:** Search engines indexing our knowledge base

### Key Insight from UAT Phase 2

Our content collections already have rich, validated schemas (`src/content/config.ts`):
- **Concepts:** `title`, `definition` (max 200 chars), `tags`, `maturity`, `related_concepts`
- **Patterns:** `title`, `complexity`, `status`, `diagram_source`, `publishDate`

These map naturally to structured data without requiring content rewrites.

---

## 2. User Story

**As a** knowledge base maintainer,  
**I want** semantic HTML markup and structured data automatically generated from our existing content schemas,  
**So that** AI agents can cite our content accurately, search engines can index it effectively, and we maintain our clean "spec-sheet" aesthetic without manual SEO work.

---

## 3. Implementation Tasks

### A. Enhance `BaseLayout.astro` with Semantic SEO Metadata

**Goal:** Add comprehensive `<head>` metadata without compromising our minimal design.

**Tasks:**

1. **Canonical URLs**
   - Add `site: 'https://asdlc.io'` to `astro.config.mjs`
   - Generate `<link rel="canonical" href={Astro.url} />` dynamically
   - Ensure trailing slash consistency (Astro default behavior)

2. **Open Graph & Twitter Cards**
   - Extract metadata from `BaseLayout` props
   - Add `og:title`, `og:description`, `og:type`, `og:url`
   - Add `twitter:card`, `twitter:title`, `twitter:description`
   - Default social share image (create minimal spec-sheet branded image)

3. **Language & Document Metadata**
   - Add `lang="en"` to `<html>` tag (accessibility)
   - Add `<meta name="author" content="ASDLC.io Contributors">`
   - Add `<meta name="robots" content="index, follow">`

**Files Modified:**
- `astro.config.mjs`
- `src/layouts/BaseLayout.astro`

**Constraints:**
- NO inline styles or Tailwind classes (maintain spec-sheet aesthetic)
- NO external SEO libraries (keep bundle lean)
- All metadata must be derived from existing props or content schemas

---

### B. Implement JSON-LD Structured Data Component

**Goal:** Create reusable structured data component that transforms our Zod schemas into Schema.org markup.

**Tasks:**

1. **Create `src/components/StructuredData.astro`**
   - Accept `type`, `data`, and optional `context` props
   - Generate JSON-LD script tag
   - Support `Article`, `TechArticle`, and `FAQPage` types

2. **Add Structured Data to Concept Pages**
   - Map `concepts` collection schema to `TechArticle` schema
   - Use existing `definition` field for `description`
   - Use `tags` for `keywords`
   - Use `lastUpdated` for `dateModified`
   - Use `maturity` for custom property (experimental)

3. **Add Structured Data to Pattern Pages**
   - Map `patterns` collection schema to `TechArticle` schema
   - Use `complexity` and `status` for custom properties
   - Use `publishDate` for `datePublished`

**Schema.org Mappings:**

```typescript
// Concept → TechArticle
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": concept.title,
  "description": concept.definition,
  "keywords": concept.tags.join(", "),
  "dateModified": concept.lastUpdated,
  "author": { "@type": "Organization", "name": "ASDLC.io" },
  "publisher": { "@type": "Organization", "name": "ASDLC.io" }
}

// Pattern → TechArticle
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": pattern.title,
  "datePublished": pattern.publishDate,
  "complexity": pattern.complexity,
  "status": pattern.status
}
```

**Files Created:**
- `src/components/StructuredData.astro`

**Files Modified:**
- `src/pages/concepts/[...slug].astro`
- `src/pages/patterns/[...slug].astro`

**Reference:**
- [Schema.org TechArticle](https://schema.org/TechArticle)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

---

### C. Install and Configure Astro Sitemap Integration

**Goal:** Auto-generate XML sitemap for search engine crawlers.

**Tasks:**

1. **Install Official Integration**
   ```bash
   npx astro add sitemap
   ```

2. **Configure `astro.config.mjs`**
   - Ensure `site: 'https://asdlc.io'` is set (from Task A)
   - Integration should auto-detect all routes
   - No custom filtering needed (all content is public)

3. **Verify Generation**
   - Run `pnpm build`
   - Confirm `dist/sitemap-index.xml` exists
   - Verify all 5+ routes are included

**Files Modified:**
- `astro.config.mjs`
- `package.json` (via Astro CLI)

**Acceptance:**
- `https://asdlc.io/sitemap-index.xml` returns valid XML
- All concept and pattern pages included
- Home, `/concepts`, `/patterns` index pages included

---

### D. Create `robots.txt` and Social Share Image

**Goal:** Complete basic SEO infrastructure.

**Tasks:**

1. **Create `public/robots.txt`**
   ```
   User-agent: *
   Allow: /
   
   Sitemap: https://asdlc.io/sitemap-index.xml
   ```

2. **Create Social Share Image**
   - Minimal design: "ASDLC.io" text on spec-sheet grid background
   - Size: 1200x630px (Open Graph standard)
   - Format: PNG or JPEG
   - Save as `public/og-default.png`
   - Reference in `BaseLayout.astro` Open Graph tags

**Files Created:**
- `public/robots.txt`
- `public/og-default.png`

**Note:** If design bandwidth is limited, use simple text-only PNG generated via code.

---

### E. Enhance Semantic HTML in Detail Pages

**Goal:** Improve semantic structure for better LLM parsing and accessibility.

**Tasks:**

1. **Concept Detail Pages (`concepts/[...slug].astro`)**
   - Wrap definition in `<p class="lead">` or similar semantic marker
   - Use `<dl>` (definition list) for metadata display:
     - `<dt>Maturity</dt><dd>{maturity}</dd>`
     - `<dt>Tags</dt><dd>{tags.join(", ")}</dd>`
   - Use `<time datetime={lastUpdated}>` for date display
   - Use `<article>` wrapper for main content

2. **Pattern Detail Pages (`patterns/[...slug].astro`)**
   - Similar structure as concepts
   - Use `<figure>` for diagrams (if `diagram_source` present)
   - Use semantic tags for complexity/status badges

3. **Index Pages**
   - Use `<section>` for grouped content
   - Use `<h2>` for collection headings
   - Maintain ARIA landmarks (`<main>`, `<nav>`, `<article>`)

**Files Modified:**
- `src/pages/concepts/[...slug].astro`
- `src/pages/patterns/[...slug].astro`
- `src/pages/concepts/index.astro`
- `src/pages/patterns/index.astro`

**CSS Updates (if needed):**
- Add styles for `<dl>`, `<dt>`, `<dd>` to `src/styles/global.css`
- Maintain spec-sheet aesthetic (monospace fonts, borders, grid alignment)

---

## 4. Out of Scope (Future PBIs)

The following items from the naive SEO agent PBI are **explicitly out of scope** for this implementation:

- ❌ **Google Search Console integration** - Premature (site not in production)
- ❌ **Analytics tools** (Plausible/Fathom/GA4) - Not needed for development phase
- ❌ **Core Web Vitals optimization** - Already excellent (using Astro SSG, minimal JS)
- ❌ **Lighthouse 100 score requirement** - Unnecessary perfectionism at this stage
- ❌ **FAQ schema** - No FAQ content exists yet
- ❌ **Manual "direct answer" content blocks** - Our `definition` field already serves this purpose

These may become separate PBIs when the site moves to production.

---

## 5. Acceptance Criteria

### Functional Requirements

- [ ] **Sitemap Generated:** `pnpm build` produces `dist/sitemap-index.xml` containing all routes
- [ ] **Canonical URLs:** Every page has `<link rel="canonical">` tag with correct URL
- [ ] **Open Graph Tags:** All pages have `og:title`, `og:description`, `og:type`, `og:url`, `og:image`
- [ ] **Twitter Card Tags:** All pages have `twitter:card`, `twitter:title`, `twitter:description`
- [ ] **Structured Data:** Concept and pattern detail pages include valid JSON-LD `TechArticle` schema
- [ ] **Robots.txt:** `public/robots.txt` exists with sitemap reference
- [ ] **Semantic HTML:** Detail pages use `<article>`, `<time>`, `<dl>`, and proper heading hierarchy

### Quality Gates

- [ ] **Build:** `pnpm build` completes successfully with 0 errors
- [ ] **Type Safety:** `pnpm check` returns 0 errors, 0 warnings
- [ ] **Linting:** `pnpm lint` passes all checks
- [ ] **Validation:** JSON-LD passes [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] **Validation:** Sitemap passes [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

### Documentation

- [ ] **AGENTS.md Compliance:** All changes follow "Schema First" and "Style" directives
- [ ] **Commit Messages:** Follow Conventional Commits (`feat:`, `arch:`, `docs:`)
- [ ] **Code Comments:** Structured data generation includes inline comments explaining Schema.org mappings

---

## 6. Technical Design Notes

### Why Semantic-First, Not Tool-First

The naive SEO agent suggested installing multiple tools and libraries. Our approach:

1. **Leverage Existing Schemas:** Our Zod content schemas are already rich metadata sources
2. **Manual Structured Data Component:** 50 lines of Astro code > 500kb SEO library
3. **Native HTML Semantics:** `<article>`, `<time>`, `<dl>` are free and accessible
4. **Astro Built-ins:** Official sitemap integration is all we need

### Schema.org Strategy

We're targeting `TechArticle` (not generic `Article`) because:
- Our content is technical documentation
- `TechArticle` supports `proficiencyLevel` and other tech-specific properties
- Better semantic match for LLM training data

### AEO (Answer Engine Optimization) Philosophy

Our existing `definition` field (max 200 chars) already serves as "direct answer" content. No need to:
- Restructure existing content
- Add redundant FAQ sections
- Create separate "snippet" blocks

AI agents can parse our structured, semantic HTML naturally.

---

## 7. Definition of Done

- [ ] All acceptance criteria met
- [ ] Code merged to `main` branch
- [ ] All quality gates passing (lint, check, build)
- [ ] Manual validation:
  - [ ] Sitemap XML is valid and includes all routes
  - [ ] JSON-LD passes Google Rich Results Test
  - [ ] Open Graph tags render correctly in [OpenGraph.xyz](https://www.opengraph.xyz/)
  - [ ] Semantic HTML validates via [W3C Validator](https://validator.w3.org/)
- [ ] Documentation updated (if new patterns introduced)
- [ ] Commit history follows Conventional Commits

---

## 8. Estimated Effort Breakdown

| Task | Effort | Notes |
|:-----|:-------|:------|
| A. BaseLayout Metadata | 1.5 hours | Straightforward prop spreading |
| B. StructuredData Component | 2 hours | Schema.org mapping logic |
| C. Sitemap Integration | 0.5 hours | Official Astro integration (1 command) |
| D. Robots.txt & OG Image | 1 hour | Simple text file + minimal image |
| E. Semantic HTML Enhancement | 2 hours | Refactor detail pages with `<dl>`, `<time>` |
| Testing & Validation | 1 hour | Rich results test, XML validation |

**Total:** 8 hours (1 sprint day)

---

## 9. Dependencies

- **Upstream:** PBI-0002 (Content Pipeline) - ✅ COMPLETE
- **Blocking:** None
- **Parallel:** Can be developed alongside content authoring

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|:-----|:-------|:-----------|
| Schema.org changes | Low | We use stable `TechArticle` schema |
| Astro sitemap breaking changes | Low | Official integration is stable |
| OG image design bottleneck | Medium | Use text-only PNG fallback |
| Structured data validation failures | Medium | Test early with Google Rich Results Test |

---

## 11. Success Metrics (Post-Implementation)

These can be measured after deployment (not part of this PBI):

- **Crawlability:** Google Search Console shows all pages indexed (future PBI)
- **Rich Results:** Concept/pattern pages eligible for rich snippets (validate manually)
- **AI Citations:** Track mentions in ChatGPT/Perplexity (manual monitoring, future PBI)
- **Accessibility:** W3C validation passes with 0 errors

---

## 12. Related Documents

- **Content Schemas:** `src/content/config.ts` (defines metadata structure)
- **Design System:** `src/styles/global.css` (spec-sheet aesthetic)
- **Architecture Rules:** `AGENTS.md` (directives for implementation)
- **Phase 2 UAT Report:** `docs/backlog/PBI-0002-C-UAT-Completion-Report.md`

---

## 13. Implementation Notes for Agents

If an AI agent (Copilot, Gemini, Claude) implements this PBI:

1. **Read `src/content/config.ts` first** - This defines the source data structure
2. **Maintain spec-sheet aesthetic** - Use existing CSS classes, no inline styles
3. **Test JSON-LD output** - Paste into Google Rich Results Test before committing
4. **Follow Astro 5 patterns** - Use `getCollection()`, `render()`, explicit imports
5. **Validate against AGENTS.md** - Especially "Schema First" and "Explicit Imports" sections

---

**Created:** 2025-01-XX  
**Author:** Lead Developer (Human + AI Collaboration Review)  
**Status:** Ready for Sprint Planning  
**Estimated Sprint:** Phase 3, Sprint 1