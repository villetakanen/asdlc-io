# PBI-35: Field Manual Display Article Descriptions

> Status: Done

## Goal
Display the `description` field from article frontmatter in Field Manual chapter headers, providing readers with immediate context about each article's purpose before diving into the full content.

## Context
The Field Manual currently renders article titles and basic metadata (ID, status), but omits the `description` field that exists in every article's schema. This description (max 200 characters) serves as a concise summary and is already displayed on the main website's collection pages.

Adding descriptions to the Field Manual improves scannability—readers can quickly assess relevance without reading the full article. This is especially valuable for printed copies where navigation is linear.

## Spec Reference
`/docs/specs/field-manual.md` - Section: "What Needs to Change" → "Display Description and Enhanced Metadata"

## Requirements

### Display Location
- Position: Below the chapter title, above the metadata line
- Style: Distinct from body text (italic, secondary color)
- Max-width: 80 characters per line for readability
- Conditional: Only render if `description` is non-empty (schema defaults to empty string)

### Styling
- Font size: Slightly larger than body text (~1.1rem)
- Color: `var(--c-text-secondary)`
- Font style: Italic
- Margin: 1rem bottom spacing before metadata

### Apply To
- All Patterns chapters
- All Practices chapters
- All Concepts chapters

## Acceptance Criteria
- [ ] Add `.chapter-description` CSS class to existing styles
- [ ] Render description paragraph in all chapter templates
- [ ] Description appears between title and metadata for all collections
- [ ] Empty descriptions gracefully omitted (no blank paragraphs)
- [ ] Styling matches design system (uses CSS variables, no hardcoded colors)
- [ ] Print output includes descriptions with appropriate styling
- [ ] Page builds successfully: `pnpm check` passes
- [ ] Linting passes: `pnpm lint` passes

## Implementation Guidance

### CSS Addition
```css
.chapter-description {
    font-size: 1.1rem;
    color: var(--c-text-secondary);
    font-style: italic;
    margin-bottom: 1rem;
    max-width: 80ch;
    line-height: 1.5;
}

@media print {
    .chapter-description {
        color: #666 !important; /* Ensure readability in print */
    }
}
```

### Chapter Template Update
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

### Key Points
- Use conditional rendering: `{entry.data.description && (...)}`
- Apply to all three section renders (Patterns, Practices, Concepts)
- Ensure consistent indentation and spacing

## Testing

**Manual Verification:**
1. Build: `pnpm build`
2. Preview: `pnpm preview`
3. Navigate to `/fieldmanual`
4. For each section (Patterns, Practices, Concepts):
   - Verify description appears below title
   - Verify italic styling and secondary color
   - Verify proper spacing before metadata line
5. Test print preview (Cmd+P / Ctrl+P):
   - Verify descriptions are visible in print output
   - Verify text remains readable (not too light)

**Sample Articles to Check:**
- Pattern: "The Spec" - _"A living document pattern that serves as the permanent source of truth for features..."_
- Practice: "Agent Personas" - _"A guide on how to add multiple personas to an AGENTS.md file, with examples."_
- Concept: "Context Engineering" - _"Context Engineering is the practice of structuring information to optimize LLM comprehension..."_

**Edge Case Testing:**
1. Check an article with empty description (if any exist)
2. Verify no blank `<p>` tags are rendered
3. Check an article with a 200-character description (max length)
4. Verify text wraps properly without overflow

## Notes
- The `description` field is mandatory in the schema but defaults to empty string
- All existing articles should have descriptions populated (verify during testing)
- If descriptions are missing, that's a content issue (not a code issue), but the build should still succeed
- Description display is separate from metadata standardization (PBI-36), though both affect the chapter header
- The `max-width: 80ch` ensures readability even on wide screens

## Completion Notes

**Completed:** 2025-12-16

**Implementation Summary:**
- Added `.chapter-description` CSS class with appropriate styling (1.1rem, italic, secondary color)
- Added print-specific CSS to ensure descriptions remain readable in print output
- Updated all three chapter templates (Patterns, Practices, Concepts) to render descriptions
- Conditional rendering ensures empty descriptions don't create blank paragraphs
- Applied max-width (80ch) for optimal readability

**Verification:**
- ✅ `pnpm check` passes (0 errors, 0 warnings)
- ✅ `pnpm build` succeeds
- ✅ Descriptions appear below titles in all sections (Patterns, Practices, Concepts)
- ✅ Styling matches design system (uses CSS variables)
- ✅ Print CSS applies appropriate color (#666 for readability)
- ✅ Empty descriptions gracefully omitted (no blank paragraphs)

**Sample Descriptions Verified:**
- Pattern: "The Spec" - "A living document pattern that serves as the permanent source of truth for features..."
- Practice: "Agent Personas" - "A guide on how to add multiple personas to an AGENTS.md file, with examples."
- Concept: (descriptions visible for all 8 concept articles)

**Files Modified:**
- `src/pages/fieldmanual.astro` - Added CSS and description rendering to all chapter templates

## Related
- Spec: `/docs/specs/field-manual.md`
- File: `src/pages/fieldmanual.astro`
- Schema: `src/content/config.ts` (defines description field)
- Related to: PBI-36 (metadata standardization)
- Dependency: None (can be implemented independently)