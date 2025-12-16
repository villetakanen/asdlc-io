# PBI-33: Field Manual Section Order Restructure

> Status: Open

## Goal
Reorder the Field Manual sections to prioritize actionable content (Patterns, Practices) over theoretical reference material (Concepts), treating Concepts as an appendix.

## Context
The current Field Manual structure presents Concepts first, followed by Patterns. This mirrors academic convention (theory before practice) but does not serve practitioners who need actionable guidance immediately.

By restructuring to **Patterns → Practices → Concepts**, we align with field manual conventions where procedures and patterns come first, and theoretical foundations serve as reference appendices.

## Spec Reference
`/docs/specs/field-manual.md` - Section: "What Needs to Change" → "Update Table of Contents and Section Order"

## Requirements

### New Section Order
1. **Part I: Patterns** - Actionable design patterns
2. **Part II: Practices** - How-to guides and procedures
3. **Appendix: Concepts** - Theoretical foundation and reference corpus

### Changes Required
- Reorder the rendering of sections in the page body
- Update section headers (`<h1 class="section-header">`)
- Update Table of Contents to reflect new order
- Maintain all existing styling and print behavior

## Acceptance Criteria
- [ ] Page structure renders in order: Patterns, Practices, Concepts
- [ ] Section headers updated:
  - "Part I: Patterns" (not "Part I: Concepts")
  - "Part II: Practices" (not "Part II: Patterns")
  - "Appendix: Concepts" (not "Part I: Concepts")
- [ ] Table of Contents lists sections in new order
- [ ] All chapter links in ToC remain functional
- [ ] Print output shows correct section order
- [ ] Page builds successfully: `pnpm check` passes
- [ ] Linting passes: `pnpm lint` passes

## Implementation Guidance

### Before (Current Structure)
```astro
<!-- Part I: Concepts -->
<h1 class="section-header">Part I: Concepts</h1>
{sortedConcepts.map(...)}

<!-- Part II: Patterns -->
<h1 class="section-header">Part II: Patterns</h1>
{sortedPatterns.map(...)}
```

### After (Target Structure)
```astro
<!-- Part I: Patterns -->
<h1 class="section-header">Part I: Patterns</h1>
{sortedPatterns.map(...)}

<!-- Part II: Practices -->
<h1 class="section-header">Part II: Practices</h1>
{sortedPractices.map(...)}

<!-- Appendix: Concepts -->
<h1 class="section-header">Appendix: Concepts</h1>
{sortedConcepts.map(...)}
```

### Table of Contents Update
```astro
<div class="toc no-print">
    <h2>Table of Contents</h2>
    <h3>Part I: Patterns</h3>
    <ul>{sortedPatterns.map(...)}</ul>
    
    <h3>Part II: Practices</h3>
    <ul>{sortedPractices.map(...)}</ul>
    
    <h3>Appendix: Concepts</h3>
    <ul>{sortedConcepts.map(...)}</ul>
</div>
```

## Testing
**Manual Verification:**
1. Build: `pnpm build`
2. Preview: `pnpm preview`
3. Navigate to `/fieldmanual`
4. Verify visual order: Patterns, then Practices, then Concepts
5. Click ToC links to verify anchor navigation works
6. Test print preview (Cmd+P / Ctrl+P):
   - Patterns appear in pages 1-N
   - Practices appear after Patterns
   - Concepts appear last (appendix)

## Notes
- **Dependency**: This PBI assumes PBI-32 (status sorting) is complete
- **Dependency**: This PBI can be done in parallel with PBI-34 (adding Practices), but both should reference the same section order
- The term "Appendix" signals to readers that Concepts are reference material, not primary content
- No changes to CSS or styling are required—only HTML structure reordering

## Related
- Spec: `/docs/specs/field-manual.md`
- File: `src/pages/fieldmanual.astro`
- Depends on: PBI-32 (sorting)
- Related to: PBI-34 (practices collection)