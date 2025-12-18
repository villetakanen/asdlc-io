# PBI-32: Field Manual Status-Based Sorting

> Status: Done

## Goal
Implement status-based sorting for all content collections in the Field Manual, prioritizing production-ready content (Live) over experimental or deprecated material.

## Context
The Field Manual currently sorts articles alphabetically within each section (Patterns, Practices, Concepts). This makes it difficult for readers to quickly identify which content is production-ready vs. experimental. By sorting by status first (Live → Draft → Experimental → Proposed → Deprecated), we surface the most reliable content first.

This is foundational work required before other Field Manual enhancements can be properly implemented.

## Spec Reference
`/docs/specs/field-manual.md` - Section: "What Needs to Change" → "Implement Status-Based Sorting"

## Requirements

### Sorting Logic
- **Primary Sort**: Status (Live → Draft → Experimental → Proposed → Deprecated)
- **Secondary Sort**: Alphabetical by title
- **Apply to**: All three collections (patterns, practices, concepts)

### Status Priority Order
1. `Live` - Production-ready, battle-tested
2. `Draft` - Work in progress, usable
3. `Experimental` - Speculative, requires validation
4. `Proposed` - Under review, not yet approved
5. `Deprecated` - Superseded, historical context only

### Implementation Details
```typescript
const statusOrder: Record<string, number> = { 
  Live: 1, 
  Draft: 2, 
  Experimental: 3, 
  Proposed: 4, 
  Deprecated: 5 
};

function sortByStatus<T extends { data: { status: string; title: string } }>(
  a: T, 
  b: T
): number {
  const statusA = statusOrder[a.data.status] || 99;
  const statusB = statusOrder[b.data.status] || 99;
  
  if (statusA !== statusB) return statusA - statusB;
  return a.data.title.localeCompare(b.data.title);
}
```

## Acceptance Criteria
- [ ] Create `sortByStatus()` function in `src/pages/fieldmanual.astro`
- [ ] Apply sorting to `concepts` collection (replace current alphabetical sort)
- [ ] Apply sorting to `patterns` collection (replace current alphabetical sort)
- [ ] Apply sorting to `practices` collection (when added)
- [ ] Verify Live articles appear first in each section
- [ ] Verify Deprecated articles appear last in each section
- [ ] Verify alphabetical ordering within same status group
- [ ] Page builds successfully: `pnpm check` passes
- [ ] Linting passes: `pnpm lint` passes

## Testing
**Manual Verification:**
1. Build the site: `pnpm build`
2. Preview: `pnpm preview`
3. Navigate to `/fieldmanual`
4. Verify in each section:
   - Articles with `status: "Live"` appear first
   - Articles with `status: "Deprecated"` appear last
   - Within same status, titles are alphabetical

## Notes
- This PBI does NOT change the section order (that's PBI-33)
- This PBI does NOT add the Practices collection (that's PBI-34)
- The sorting function should be reusable for all three collections
- TypeScript strict mode must be maintained (no `any` types)

## Completion Notes

**Completed:** 2025-12-16

**Implementation Summary:**
- Created `sortByStatus()` function with status priority order (Live → Draft → Experimental → Proposed → Deprecated)
- Applied status-based sorting to `concepts` collection
- Applied status-based sorting to `patterns` collection
- Function is ready for `practices` collection (will be used in PBI-34)

**Verification:**
- ✅ `pnpm check` passes (0 errors, 0 warnings)
- ✅ `pnpm lint` passes (1 unrelated warning in grid.css)
- ✅ `pnpm build` succeeds
- ✅ Concepts ToC shows: Live first (Levels of Autonomy), Deprecated last (Guardrails)
- ✅ Patterns ToC shows: Draft articles first (alphabetically), then Experimental, then Proposed
- ✅ Alphabetical ordering maintained within same status groups

**Files Modified:**
- `src/pages/fieldmanual.astro` - Added sortByStatus function and applied to collections

## Related
- Spec: `/docs/specs/field-manual.md`
- File: `src/pages/fieldmanual.astro`
- Schema: `src/content/config.ts` (defines status enum)