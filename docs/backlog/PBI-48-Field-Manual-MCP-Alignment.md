# PBI-48: Field Manual MCP Alignment & Article Compendium

> Status: Proposed

## Goal
Refine the Field Manual to contain only the same content as the MCP releases, and create a new "Article Compendium" resource page that collates all articles (concepts, patterns, practices) in a single alphabetically-sorted page optimized for download/scraping.

## Context
The Field Manual currently includes all three content collections (Concepts, Patterns, Practices), but the MCP server only exposes a subset of articles through `src/mcp/articles.json`. This creates inconsistency between what the Field Manual presents and what AI agents can actually access via MCP.

Additionally, there's a need for a comprehensive "dump" of all articles in a simple, alphabetically-sorted format that's optimized for bulk download or scraping, distinct from the Field Manual which is designed to be readable and well-organized.

## Requirements

### 1. Field Manual Refinement
**Objective:** Align Field Manual content with MCP releases.

- **Filter Logic:** Only include articles that exist in `src/mcp/articles.json`
- **Maintain Structure:** Keep the three-part structure (Patterns, Practices, Concepts/Appendix)
- **Status Sorting:** Preserve existing status-based sorting within each section
- **Version Tracking:** Update version metadata to reflect content changes

### 2. Article Compendium Resource
**Objective:** Create `/resources/compendium` page for bulk article access.

- **Route:** `/resources/compendium` (new page: `src/pages/resources/compendium.astro`)
- **Content:** All articles from all collections (concepts, patterns, practices)
- **Sorting:** Alphabetical by title within each collection
- **No Status Filtering:** Include all articles regardless of status
- **Preamble:** Explanatory text clarifying purpose and non-readability intent

**Preamble Content:**
```
This is an alphabetically-sorted compilation of all ASDLC articles 
(Concepts, Patterns, Practices) in a single page. This resource is 
optimized for bulk download, scraping, or feeding to LLMs for 
comprehensive analysis.

Unlike the Field Manual, which is organized for readability and 
follows a curated structure, this compendium is intentionally 
unstructured—a raw alphabetic listing for programmatic consumption.
```

### 3. Resources Index Update
**Objective:** Add link to new compendium page.

- Update `/resources/index.astro` with new entry
- Clarify distinction between Field Manual and Compendium

## Acceptance Criteria

### Field Manual (`src/pages/fieldmanual.astro`)
- [ ] Only articles present in `src/mcp/articles.json` are rendered
- [ ] Articles not in MCP are excluded from all three sections
- [ ] TOC reflects filtered content
- [ ] Status-based sorting preserved
- [ ] Cover page version matches `package.json`
- [ ] Build succeeds: `pnpm build` passes
- [ ] No broken internal links

### Article Compendium (`src/pages/resources/compendium.astro`)
- [ ] New page created at correct route
- [ ] Preamble text explaining purpose and non-readability
- [ ] All concepts, patterns, and practices included (no filtering)
- [ ] Alphabetical sorting by title within each collection
- [ ] Same styling/structure as Field Manual (cover page, TOC, chapters)
- [ ] Page renders correctly: `pnpm dev` → navigate to `/resources/compendium`
- [ ] Print-friendly CSS applied
- [ ] SEO metadata present

### Resources Index (`src/pages/resources/index.astro`)
- [ ] New entry added for "Article Compendium"
- [ ] Description differentiates from Field Manual
- [ ] Link points to `/resources/compendium`

### Quality Gates
- [ ] `pnpm check` passes (type safety)
- [ ] `pnpm lint` passes (code quality)
- [ ] `pnpm build` succeeds (production build)
- [ ] Manual verification: Field Manual content matches MCP articles
- [ ] Manual verification: Compendium includes all articles

## Implementation Guidance

### 1. Field Manual Filtering

**Approach:** Load MCP articles JSON and use as filter.

```typescript
import mcpArticles from "../mcp/articles.json";

// Create lookup set of MCP article slugs
const mcpSlugs = new Set(mcpArticles.map(a => a.slug));

// Filter collections
const concepts = await getCollection("concepts");
const patterns = await getCollection("patterns");
const practices = await getCollection("practices");

const filteredConcepts = concepts.filter(entry => mcpSlugs.has(entry.id));
const filteredPatterns = patterns.filter(entry => mcpSlugs.has(entry.id));
const filteredPractices = practices.filter(entry => mcpSlugs.has(entry.id));

// Continue with existing sort logic
const sortedConcepts = filteredConcepts.sort(sortByStatus);
// ...
```

### 2. Compendium Page Structure

**File:** `src/pages/resources/compendium.astro`

```astro
---
import { getCollection, render } from "astro:content";
import "../../styles/index.css";
import SEOMetadata from "../../components/SEOMetadata.astro";

// Fetch all collections
const concepts = await getCollection("concepts");
const patterns = await getCollection("patterns");
const practices = await getCollection("practices");

// Alphabetical sort
const sortAlpha = (a, b) => a.data.title.localeCompare(b.data.title);

const sortedConcepts = concepts.sort(sortAlpha);
const sortedPatterns = patterns.sort(sortAlpha);
const sortedPractices = practices.sort(sortAlpha);

const today = new Date().toISOString().split("T")[0];
---

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <SEOMetadata
      title="Article Compendium"
      description="Alphabetically-sorted compilation of all ASDLC articles for bulk download and scraping."
      type="article"
    />
    <!-- Reuse Field Manual styles -->
</head>
<body>
    <div class="cover-page">
        <h1 class="cover-title">ASDLC.io<br> Article Compendium</h1>
        <p class="cover-subtitle">Alphabetic Listing for Programmatic Access</p>
        <div class="cover-meta">
            <p>Generated: {today}</p>
        </div>
    </div>

    <div class="preamble">
        <p>
            This is an alphabetically-sorted compilation of all ASDLC articles 
            (Concepts, Patterns, Practices) in a single page. This resource is 
            optimized for bulk download, scraping, or feeding to LLMs for 
            comprehensive analysis.
        </p>
        <p>
            Unlike the <a href="/fieldmanual">Field Manual</a>, which is organized 
            for readability and follows a curated structure, this compendium is 
            intentionally unstructured—a raw alphabetic listing for programmatic 
            consumption.
        </p>
    </div>

    <!-- Render all collections alphabetically -->
    <h1 class="section-header">Concepts (A-Z)</h1>
    {sortedConcepts.map(async (entry) => {
        const { Content } = await render(entry);
        return (
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
        );
    })}

    <!-- Repeat for Patterns and Practices -->
</body>
</html>
```

### 3. Resources Index Update

**File:** `src/pages/resources/index.astro`

Add after Field Manual entry:

```astro
<li>
  <a href="/resources/compendium">Article Compendium</a>
  - Alphabetically-sorted compilation of all ASDLC articles in a single page, 
  optimized for bulk download, scraping, or LLM ingestion (unstructured format).
</li>
```

## Testing

### Manual Verification Steps

**Field Manual Filtering:**
1. Build: `pnpm build`
2. Preview: `pnpm preview`
3. Navigate to `/fieldmanual`
4. For each section, verify articles match `src/mcp/articles.json`:
   - Concepts: Should include "Event Modeling", "Levels of Autonomy", "Spec-Driven Development"
   - Patterns: Should include "Agent Constitution", "Model Routing", "Specs"
   - Practices: Should include "Agent Personas", "AGENTS.md Specification", "Living Specs", "Micro-Commits"
5. Check TOC: Ensure unlisted articles don't appear

**Article Compendium:**
1. Navigate to `/resources/compendium`
2. Verify preamble text is present
3. Verify all articles appear (more than Field Manual)
4. Verify alphabetical ordering within each section
5. Test print preview (Cmd+P / Ctrl+P)

**Resources Index:**
1. Navigate to `/resources`
2. Verify new "Article Compendium" link exists
3. Verify description differentiates from Field Manual
4. Click link → should navigate to `/resources/compendium`

### Automated Verification

```bash
# Type checking
pnpm check

# Linting
pnpm lint

# Production build
pnpm build

# Verify Field Manual filtering (example test)
# Count articles in fieldmanual.astro vs mcp/articles.json
# (This would require a test script - manual for now)
```

## Edge Cases

1. **Article exists in MCP but not in collections** → Build should fail (integrity check)
2. **Article exists in collections but not in MCP** → Excluded from Field Manual, included in Compendium
3. **Empty collections** → Both pages should handle gracefully (no crashes)
4. **Duplicate titles** → Alphabetical sort should be stable

## Notes

### Why Two Resources?

**Field Manual:**
- **Audience:** Humans and agents reading for comprehension
- **Structure:** Curated, status-sorted, organized by importance
- **Use Case:** Reference guide, study material, print documentation

**Article Compendium:**
- **Audience:** Scripts, scrapers, LLMs for bulk analysis
- **Structure:** Alphabetical, unfiltered, raw dump
- **Use Case:** Programmatic access, comprehensive ingestion, archival

### MCP Alignment Rationale

The Field Manual represents "canonical ASDLC content"—what we actively publish via MCP. The Compendium is the "complete archive," including experimental or deprecated content not yet promoted to MCP.

This separation ensures:
- MCP consumers get a consistent, curated experience
- Developers have access to all content for research/reference
- Clear boundaries between "published" and "archived" content

### Future Considerations

- **PBI-49 (Potential):** Auto-generate `mcp/articles.json` from content collections with status filters
- **PBI-50 (Potential):** Add API endpoint (`/api/articles.json`) for programmatic access
- **PBI-51 (Potential):** Generate PDF versions of both resources

## Related

- Pattern: [Specs](/patterns/the-spec) — Field Manual is a living spec of ASDLC itself
- Practice: [Living Specs](/practices/living-specs) — Applied to documentation structure
- File: `src/pages/fieldmanual.astro` — Primary file to modify
- File: `src/mcp/articles.json` — Source of truth for MCP releases
- File: `src/pages/resources/index.astro` — Resources navigation
- Related PBIs: PBI-32-36 (Field Manual improvements)
