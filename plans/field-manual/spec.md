# Feature: ASDLC Field Manual

## Blueprint

### Context

The **Field Manual** is a single-page, printable compilation of all ASDLC knowledge base content (concepts, patterns, and practices). It serves two primary audiences:

1. **Human Practitioners:** Engineers, architects, and team leads who need a portable, printable reference document for offline use or quick scanning
2. **LLM Agents:** AI systems that benefit from receiving the entire knowledge base as a single, structured context artifact for ingestion

Unlike the navigable website (`asdlc.io`), the Field Manual prioritizes **linear readability** and **information density** over interactivity. It is designed to be consumed in a single session or printed as a physical reference manual.

**Business Intent:**
- Reduce context-switching by consolidating all knowledge base articles into one document
- Enable offline/print consumption of the ASDLC knowledge base
- Provide a "snapshot" artifact that can be versioned and distributed
- Optimize for LLM context injection (single-file ingestion for agent training)

### Architecture

**Route:** `/fieldmanual`

**Data Sources:**
- Content Collection: `concepts` (from `src/content/concepts/`)
- Content Collection: `patterns` (from `src/content/patterns/`)
- Content Collection: `practices` (from `src/content/practices/`)

**Page Structure:**
1. **Cover Page:** Title, version (from `package.json`), generation date
2. **Table of Contents:** Navigable index of all chapters (screen-only, hidden on print)
3. **Part I: Patterns** - All pattern articles (actionable design patterns)
4. **Part II: Practices** - All practice articles (how-to guides and procedures)
5. **Appendix: Concepts** - All concept articles (theoretical foundation and reference corpus)

**Content Schema (from `src/content/config.ts`):**
```typescript
{
  title: string,
  description: string,        // Max 200 chars
  tags?: string[],
  lastUpdated: Date,
  status: "Draft" | "Proposed" | "Live" | "Deprecated" | "Experimental",
  maturity?: "Proposed" | "Standard" | "Deprecated" | "Experimental",
  supersededBy?: string[],
  relatedIds?: string[]
}
```

**Sorting Logic:**
- **Primary Sort:** Status label (Live → Draft → Experimental → Proposed → Deprecated)
- **Secondary Sort:** Alphabetical by title

**Status Priority Order:**
1. `Live` - Production-ready, battle-tested content
2. `Draft` - Work in progress, but usable
3. `Experimental` - Speculative, requires validation
4. `Proposed` - Under review, not yet approved
5. `Deprecated` - Superseded, kept for historical context

**Rendering:**
- Each article is rendered as a `<article class="chapter">` using Astro's `render()` API
- Markdown content is compiled to HTML via the Content Layer API
- Print styles ensure page breaks at chapter boundaries

**Dependencies:**
- `astro:content` (getCollection, render)
- `package.json` (version number)
- `src/styles/index.css` (global design tokens)
- `src/components/SEOMetadata.astro` (canonical URLs, Open Graph)

### Anti-Patterns

- **Do NOT paginate:** The Field Manual MUST be a single HTML file. Pagination defeats the purpose of unified context.
- **Do NOT use client-side JS for sorting:** All sorting must happen at build time (SSG). The page must work without JavaScript.
- **Do NOT embed external resources:** All styles must be inline or from versioned CSS. No CDN dependencies.
- **Do NOT link to relative routes in the main site:** Field Manual is self-contained. External links should open in new tabs or be marked as such.
- **Do NOT modify the schema to add Field Manual-specific fields:** The schema is shared across the site. Use existing fields creatively.
- **Do NOT render articles without their `description`:** The description provides essential context for scanning. If missing, default to empty string (already handled by schema).

## Contract

### Definition of Done

- [ ] All three content collections (concepts, patterns, practices) are included
- [ ] Articles are sorted by status (Live → Draft → Experimental → Proposed → Deprecated), then alphabetically within each status group
- [ ] Each article displays: Title, Description, Status, Last Updated, and rendered Markdown content
- [ ] Table of Contents includes all three sections and links directly to chapter anchors
- [ ] Cover page displays: Project title, version (from `package.json`), and generation date (ISO format)
- [ ] Print CSS hides navigation elements (ToC, header, footer) and enforces page breaks at chapter boundaries
- [ ] Page passes `pnpm check` (TypeScript validation)
- [ ] Page passes `pnpm lint` (Biome checks)
- [ ] SEO metadata includes: title, description, canonical URL

### Regression Guardrails

- **Must survive empty collections:** If a collection has zero entries, the section should still render with a "No content available" message (or gracefully omit the section)
- **Must handle missing `description`:** If an article lacks a description, default to empty string (schema already enforces this)
- **Must render without JS:** All sorting, rendering, and layout must work with JavaScript disabled (SSG requirement)
- **Must not break on long titles:** Titles exceeding 100 characters should wrap gracefully without breaking layout
- **Must preserve markdown formatting:** Code blocks, blockquotes, lists, and tables must render correctly in both screen and print views
- **Print output must not exceed 200 pages:** At current content volume (~20 articles), print output should be ~50-80 pages. If volume grows beyond 200 pages, consider splitting into multiple manuals

### Scenarios

**Scenario: First-Time User Wants Offline Reference**
- Given: User navigates to `/fieldmanual` in a browser
- When: User triggers the browser's Print dialog (Cmd+P / Ctrl+P)
- Then: The print preview shows a clean, paginated document with no navigation chrome
- And: Patterns and Practices (actionable content) appear first
- And: Concepts (reference material) appear in the appendix
- And: Each chapter starts on a new page
- And: The Table of Contents is excluded from the print output

**Scenario: LLM Agent Ingests Knowledge Base**
- Given: An LLM agent needs context about ASDLC patterns
- When: The agent fetches `/fieldmanual` as raw HTML
- Then: All patterns, practices, and concepts are present in a single response
- And: Actionable content (patterns, practices) appears before theoretical content (concepts)
- And: Content is ordered by status (Live articles first) within each section
- And: Each article includes metadata (status, lastUpdated) for context relevance

**Scenario: New Content is Published**
- Given: A new pattern article is added to `src/content/patterns/` with `status: "Live"`
- When: The site is rebuilt (`pnpm build`)
- Then: The new pattern appears in the Field Manual under "Part I: Patterns"
- And: The pattern is sorted into the "Live" group at the top of the section
- And: The Table of Contents is automatically updated with a link to the new chapter

**Scenario: Deprecated Content is Marked**
- Given: An existing concept has `status: "Deprecated"` and `supersededBy: ["new-concept-id"]`
- When: The Field Manual is generated
- Then: The deprecated concept appears last in the "Appendix: Concepts" section (after all other statuses)
- And: The chapter metadata displays "Status: Deprecated"
- And: The article content (rendered from Markdown) includes any deprecation warnings or links to superseding content (if the author included them in the `.md` file)

**Scenario: Practices Collection is Empty**
- Given: No articles exist in `src/content/practices/`
- When: The Field Manual page is built
- Then: The page builds successfully without errors
- And: "Part II: Practices" section is rendered with a fallback message: "No practices documented yet."
- Or: The "Part II" section is omitted entirely from the output (implementation choice)

**Scenario: User Wants to Find a Specific Topic**
- Given: User is viewing the Field Manual on screen
- When: User clicks on "Context Engineering" in the Table of Contents
- Then: The browser scrolls directly to the "Context Engineering" chapter
- And: The chapter is highlighted or visually distinguished (optional enhancement)

## Current State Analysis

### What Exists (As of Current Implementation)

**File:** `src/pages/fieldmanual.astro`

**Working Features:**
- Cover page with project title, version, and generation date
- Table of Contents with links to chapters
- Two-part structure: Concepts first, then Patterns
- Print-optimized CSS (page breaks, ink-saving, hidden navigation)
- Alphabetical sorting within each section
- Chapter metadata displays: ID, and (for patterns only) Status

**Missing Features:**
1. **Practices Collection:** Not included in the output
2. **Description Display:** The `description` field from the schema is not rendered in the chapter metadata or as a subtitle
3. **Status-Based Sorting:** Articles are sorted alphabetically, not by status priority
4. **Inconsistent Metadata:** Concepts show only `ID`, patterns show `ID // Status`, but neither shows `description` or `lastUpdated`
5. **Incorrect Section Order:** Currently shows Concepts → Patterns, should be Patterns → Practices → Concepts (appendix)

### What Needs to Change

#### 1. Add Practices Collection
```typescript
const practices = await getCollection("practices");
const sortedPractices = practices.sort(/* by status, then title */);
```

#### 2. Implement Status-Based Sorting
```typescript
const statusOrder = { Live: 1, Draft: 2, Experimental: 3, Proposed: 4, Deprecated: 5 };

function sortByStatus(a, b) {
  const statusA = statusOrder[a.data.status] || 99;
  const statusB = statusOrder[b.data.status] || 99;
  
  if (statusA !== statusB) return statusA - statusB;
  return a.data.title.localeCompare(b.data.title);
}
```

#### 3. Display Description and Enhanced Metadata
```astro
<article class="chapter" id={entry.id}>
  <h2 class="chapter-title">{entry.data.title}</h2>
  {entry.data.description && (
    <p class="chapter-description">{entry.data.description}</p>
  )}
  <span class="chapter-meta">
    Status: {entry.data.status} | 
    Last Updated: {entry.data.lastUpdated.toISOString().split('T')[0]}
  </span>
  <div class="prose">
    <Content />
  </div>
</article>
```

#### 4. Update Table of Contents and Section Order
```astro
<h3>Part I: Patterns</h3>
<ul>
  {sortedPatterns.map(entry => (
    <li><a href={`#${entry.id}`}>{entry.data.title}</a></li>
  ))}
</ul>

<h3>Part II: Practices</h3>
<ul>
  {sortedPractices.map(entry => (
    <li><a href={`#${entry.id}`}>{entry.data.title}</a></li>
  ))}
</ul>

<h3>Appendix: Concepts</h3>
<ul>
  {sortedConcepts.map(entry => (
    <li><a href={`#${entry.id}`}>{entry.data.title}</a></li>
  ))}
</ul>
```

#### 5. Add CSS for Description
```css
.chapter-description {
  font-size: 1.1rem;
  color: var(--c-text-secondary);
  font-style: italic;
  margin-bottom: 1rem;
  max-width: 80ch;
}
```

## Implementation Checklist

- [ ] Fetch `practices` collection alongside `concepts` and `patterns`
- [ ] Implement `sortByStatus()` function with status priority order
- [ ] Apply status-based sorting to all three collections
- [ ] **Reorder sections:** Part I: Patterns → Part II: Practices → Appendix: Concepts
- [ ] Add "Part II: Practices" section to the page structure
- [ ] Update Table of Contents to reflect new order (Patterns, Practices, Concepts)
- [ ] Display `description` field in chapter header (below title)
- [ ] Standardize chapter metadata to show: `Status: {status} | Last Updated: {date}` (for all collections, not just patterns)
- [ ] Add CSS styles for `.chapter-description`
- [ ] Update section headers: "Part I: Patterns", "Part II: Practices", "Appendix: Concepts"
- [ ] Test print output to ensure new sections render correctly in the new order
- [ ] Verify page builds with `pnpm check`
- [ ] Verify linting passes with `pnpm lint`

## Notes

- **Content Hierarchy Rationale:** Patterns and Practices are actionable, hands-on content that practitioners need immediately. Concepts provide theoretical foundation and are positioned as an appendix for reference lookups. This mirrors field manual conventions where procedures come first, theory comes last.
- **Version Tracking:** The version number comes from `package.json`. If the knowledge base evolves significantly, consider documenting major changes in a `CHANGELOG.md` or embedding a "What's New" section in the Field Manual itself.
- **Future Enhancement:** Consider adding a "Generated by" watermark in the print footer with the canonical URL (`https://asdlc.io/fieldmanual`) for traceability.
- **LLM Optimization:** The single-page format is already optimal for LLM ingestion. The ordering (Patterns → Practices → Concepts) front-loads actionable content, which may improve agent comprehension when context windows are limited.
- **Related Patterns:** This feature implements [The Spec](/patterns/the-spec) by serving as a living document that evolves with the content collections.

## References

- [The Spec Pattern](/patterns/the-spec) - Meta-example of this documentation style
- [Context Engineering](/concepts/context-engineering) - Why single-file artifacts matter for agents
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) - Official docs for Content Layer API