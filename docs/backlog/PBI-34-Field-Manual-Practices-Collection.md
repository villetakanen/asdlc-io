# PBI-34: Field Manual Add Practices Collection

> Status: Open

## Goal
Add the Practices collection to the Field Manual, ensuring all three knowledge base collections (Patterns, Practices, Concepts) are represented in the unified document.

## Context
The Field Manual currently only includes Concepts and Patterns collections. The Practices collection exists in the content layer (`src/content/practices/`) and is rendered on the website, but is not included in the Field Manual output.

Practices contain actionable how-to guides and procedural documentation (e.g., "Agent Personas", "AGENTS.md Spec") that are essential for practitioners consuming the Field Manual.

## Spec Reference
`/docs/specs/field-manual.md` - Section: "What Needs to Change" → "Add Practices Collection"

## Requirements

### Data Fetching
- Fetch `practices` collection using `getCollection("practices")`
- Apply status-based sorting (same logic as Patterns and Concepts)
- Handle empty collection gracefully (no build errors if zero entries)

### Page Structure
- Add "Part II: Practices" section between Patterns and Concepts
- Render each practice as a `<article class="chapter">`
- Use same chapter structure as other collections (title, description, metadata, content)

### Table of Contents
- Add "Part II: Practices" heading to ToC
- List all practice articles as navigable links
- Maintain alphabetical order within status groups

## Acceptance Criteria
- [ ] Fetch `practices` collection in frontmatter
- [ ] Apply `sortByStatus()` to practices (from PBI-32)
- [ ] Add "Part II: Practices" section to page body (after Patterns, before Concepts)
- [ ] Add "Part II: Practices" to Table of Contents with links to all practice chapters
- [ ] Each practice chapter displays: title, description, status, lastUpdated, rendered content
- [ ] Print CSS applies to Practices section (page breaks, styling)
- [ ] Build succeeds with empty practices collection (graceful degradation)
- [ ] Page builds successfully: `pnpm check` passes
- [ ] Linting passes: `pnpm lint` passes

## Implementation Guidance

### Fetch Collection
```typescript
const practices = await getCollection("practices");
const sortedPractices = practices.sort(sortByStatus);
```

### Render Section
```astro
<!-- Part II: Practices -->
<h1 class="section-header">Part II: Practices</h1>
{sortedPractices.map(async (entry) => {
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
```

### Table of Contents Entry
```astro
<h3>Part II: Practices</h3>
<ul>
    {sortedPractices.map(entry => (
        <li><a href={`#${entry.id}`}>{entry.data.title}</a></li>
    ))}
</ul>
```

## Testing
**Manual Verification:**
1. Verify current practices exist:
   - `src/content/practices/agent-personas.md`
   - `src/content/practices/agents-md-spec.md`
2. Build: `pnpm build`
3. Preview: `pnpm preview`
4. Navigate to `/fieldmanual`
5. Verify "Part II: Practices" section appears after Patterns, before Concepts
6. Verify both practice articles are rendered with full metadata
7. Click ToC links for practices to verify anchor navigation
8. Test print preview to ensure practices render correctly

**Edge Case Testing:**
1. Temporarily move all `.md` files out of `src/content/practices/`
2. Run `pnpm build`
3. Verify build succeeds without errors
4. Verify Field Manual either omits "Part II: Practices" or shows graceful fallback message
5. Restore practice files

## Notes
- **Dependency**: This PBI requires PBI-32 (status sorting) to be complete
- **Dependency**: This PBI should align with PBI-33 (section order) for consistent structure
- Current practice articles as of this PBI:
  - `agent-personas.md` (Status: Live)
  - `agents-md-spec.md` (Status: not verified)
- The Practices collection uses the same `articleSchema` as Patterns and Concepts, so no schema changes are needed
- Description and metadata display should match the format used for Patterns (to be standardized in PBI-35)

## Related
- Spec: `/docs/specs/field-manual.md`
- File: `src/pages/fieldmanual.astro`
- Schema: `src/content/config.ts`
- Depends on: PBI-32 (sorting function)
- Related to: PBI-33 (section order), PBI-35 (metadata standardization)