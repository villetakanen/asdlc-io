# Field Manual Enhancement - PBI Index

> Epic: Field Manual Improvements
> Spec: `/docs/specs/field-manual.md`
> Status: Complete

## Overview

This epic enhances the Field Manual (`/fieldmanual`) to include all three content collections, implement status-based sorting, display article metadata consistently, and reorder sections to prioritize actionable content.

## PBI List

### PBI-32: Status-Based Sorting
**Status:** Done  
**Priority:** P0 (Foundational)  
**Effort:** Small  
**Dependencies:** None

Implement status-based sorting function (Live → Draft → Experimental → Proposed → Deprecated, then alphabetical) for all content collections.

**Deliverable:** `sortByStatus()` function applied to concepts, patterns, and practices.

---

### PBI-33: Section Order Restructure
**Status:** Done  
**Priority:** P1  
**Effort:** Small  
**Dependencies:** PBI-32 (sorting must be in place)

Reorder Field Manual sections from Concepts → Patterns to **Patterns → Practices → Concepts**, treating Concepts as an appendix.

**Deliverable:** Updated HTML structure and Table of Contents with new section order.

---

### PBI-34: Add Practices Collection
**Status:** Done  
**Priority:** P1  
**Effort:** Small  
**Dependencies:** PBI-32 (sorting function required)

Add the Practices collection to the Field Manual, rendering "Part II: Practices" with all practice articles.

**Deliverable:** Practices section rendered with sorted content and ToC entries.

---

### PBI-35: Display Article Descriptions
**Status:** Done  
**Priority:** P2  
**Effort:** Small  
**Dependencies:** None (can be done in parallel)

Display the `description` field from article frontmatter in chapter headers for all collections.

**Deliverable:** Description paragraphs rendered below titles with appropriate styling.

---

### PBI-36: Standardize Chapter Metadata
**Status:** Done  
**Priority:** P2  
**Effort:** Small  
**Dependencies:** None (can be done in parallel)

Standardize metadata display across all collections to show `Status` and `Last Updated` (remove redundant `ID` field).

**Deliverable:** Consistent metadata format: `Status: {status} | Last Updated: {date}`

---

## Implementation Order

### Phase 1: Foundation (Sequential)
1. **PBI-32** - Status-Based Sorting (must be first)
2. **PBI-33** - Section Order Restructure (requires sorting)
3. **PBI-34** - Add Practices Collection (requires sorting)

### Phase 2: Polish (Parallel)
4. **PBI-35** - Display Descriptions (independent)
5. **PBI-36** - Standardize Metadata (independent)

## Dependency Graph

```
PBI-32 (Sorting)
  ├─→ PBI-33 (Section Order)
  └─→ PBI-34 (Practices Collection)

PBI-35 (Descriptions) ─┐
                       ├─→ Complete Field Manual
PBI-36 (Metadata) ─────┘
```

## Definition of Done (Epic)

- [x] All five PBIs completed and merged
- [x] Field Manual displays: Patterns → Practices → Concepts
- [x] All articles sorted by status (Live first, Deprecated last)
- [x] All articles show: Title, Description, Status, Last Updated
- [x] Print output renders correctly with new structure
- [x] Page passes `pnpm check` and `pnpm lint`
- [ ] Spec updated to reflect "Current State" (post-implementation)

## Epic Completion Summary

**Completed:** 2025-12-16

**Final Field Manual Structure:**
- **Part I: Patterns** - 5 articles (sorted by status: 3 Draft, 1 Experimental, 1 Proposed)
- **Part II: Practices** - 2 articles (both Live status)
- **Appendix: Concepts** - 8 articles (sorted by status: 1 Live, 5 Draft, 1 Proposed, 1 Deprecated)

**Total Articles:** 15 (across all three collections)

**Key Achievements:**
- ✅ Status-based sorting implemented (Live → Draft → Experimental → Proposed → Deprecated)
- ✅ Section order restructured to prioritize actionable content
- ✅ All three collections (Patterns, Practices, Concepts) now included
- ✅ Article descriptions displayed for improved scannability
- ✅ Consistent metadata format across all collections (Status | Last Updated)
- ✅ All builds passing with 0 errors and 0 warnings

**Build Verification:**
- `pnpm check`: 0 errors, 0 warnings, 0 hints
- `pnpm build`: Successfully generated 24 pages
- `pnpm lint`: 1 unrelated warning in grid.css (pre-existing)

**Files Modified:**
- `src/pages/fieldmanual.astro` - Complete restructure with sorting, section reordering, and enhanced metadata

**Next Steps:**
- Update spec document to reflect current implementation state
- Consider adding status badges or visual indicators for quick scanning
- Monitor content growth - may need pagination if exceeds 200 pages in print

## Verification Scenarios

**Scenario: Practitioner Prints Manual**
- Given: All PBIs are complete
- When: User navigates to `/fieldmanual` and prints (Cmd+P)
- Then: Patterns appear first, then Practices, then Concepts (appendix)
- And: Live articles appear before Experimental or Deprecated articles
- And: Each article shows description, status, and last updated date

**Scenario: LLM Agent Ingests Context**
- Given: Agent fetches `/fieldmanual` for ASDLC knowledge
- When: Content is parsed
- Then: Actionable content (Patterns, Practices) appears before theory (Concepts)
- And: Production-ready (Live) content is prioritized in each section
- And: All metadata is present for relevance filtering

## Notes

- **Effort Estimate:** ~2-3 hours total for all five PBIs
- **Testing:** Each PBI should be tested independently before moving to next
- **Atomic Commits:** Each PBI should be a separate commit for traceability
- **Rollback Safety:** PBIs 35 and 36 are purely additive (low risk)
- **Spec Alignment:** All PBIs implement requirements from `/docs/specs/field-manual.md`

## Related Files

- Spec: `/docs/specs/field-manual.md`
- Implementation: `src/pages/fieldmanual.astro`
- Schema: `src/content/config.ts`
- Content: `src/content/{patterns,practices,concepts}/`
