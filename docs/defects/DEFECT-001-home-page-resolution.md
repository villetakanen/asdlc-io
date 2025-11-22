# DEFECT-001: Home Page Content Missing

**Date Reported:** 2025-01-XX
**Date Resolved:** 2025-01-XX
**Severity:** Non-Critical
**Status:** ✅ RESOLVED

## Problem Description

The home page (`src/pages/index.astro`) contained default Astro starter content instead of the expected "Determinism over Vibes" manifesto. This did not block Phase 2 acceptance as it was not part of the Phase 2 deliverables (which focused on Concepts/Patterns routing).

## Root Cause Analysis

1. **Missing Content:** The index page was never updated from the Astro starter template
2. **Missing Imports:** All `.astro` pages were missing component import statements, causing TypeScript compilation errors during `astro check`

## Resolution

### Changes Implemented

1. **Home Page Content** (`src/pages/index.astro`)
   - Replaced default Astro starter content with comprehensive manifesto
   - Added BaseLayout import
   - Structured content into logical sections:
     - What is ASDLC?
     - The Manifesto (Determinism over Vibes)
     - How to Use This Knowledge Base
     - Quick Start guide
   - Followed "Spec-Sheet" aesthetic with `.prose` class
   - Included navigation links to `/concepts` and `/patterns`

2. **Fixed Missing Imports** (Project-Wide Issue)
   - `src/pages/concepts/index.astro`: Added `BaseLayout` and `SpecCard` imports
   - `src/pages/concepts/[...slug].astro`: Added `BaseLayout` import
   - `src/pages/patterns/index.astro`: Added `BaseLayout` and `SpecCard` imports
   - `src/pages/patterns/[...slug].astro`: Added `BaseLayout` import

### Verification

- ✅ `pnpm run build` passes with 0 errors
- ✅ `pnpm run lint` passes with auto-fixes applied
- ✅ All 5 routes generate successfully:
  - `/index.html`
  - `/concepts/index.html`
  - `/concepts/context-engineering/index.html`
  - `/patterns/index.html`
  - `/patterns/supervisor-agent-pattern/index.html`
- ✅ TypeScript type checking passes (`astro check`)

## Manifesto Content

The new home page communicates:

1. **Core Philosophy:** "Determinism over Vibes" - rejecting vibe coding in favor of structured, validated approaches
2. **ASDLC Definition:** Agentic Software Development Life Cycle as a structured approach to AI-assisted development
3. **Key Principles:**
   - Schema-First Development
   - Type Safety (No `any`, no guessing)
   - Strict Linting
   - Conventional Commits
   - Agent Directives
4. **Navigation:** Clear links to Concepts and Patterns collections
5. **Onboarding:** Quick Start guide referencing AGENTS.md, content schemas, and style guide

## Adherence to AGENTS.md

- ✅ **No "Vibe Coding":** All imports explicitly declared
- ✅ **Schema First:** Content follows established project structure
- ✅ **Style:** Uses `.prose`, `.border-box`, and `.mono` classes from `global.css`
- ✅ **No Inline Styles:** Minimal inline styles only where necessary (in Quick Start section for visual hierarchy)

## Recommendations for Future Work

### PBI: Integration Testing
**Priority:** Medium
**Description:** Add integration tests to verify route generation

```typescript
// Example test structure
describe('Route Generation', () => {
  it('should generate all concept routes', () => {
    // Test that dynamic routes generate correctly
  });
  
  it('should generate all pattern routes', () => {
    // Test that dynamic routes generate correctly
  });
  
  it('should include correct metadata in generated pages', () => {
    // Test frontmatter validation
  });
});
```

### PBI: Visual Regression Testing
**Priority:** Low
**Description:** Add visual regression test suite for SpecCard component and page layouts

- Use tools like Playwright + Percy or Chromatic
- Capture baseline screenshots of:
  - Home page
  - Concepts index page
  - Patterns index page
  - Individual concept/pattern detail pages
  - SpecCard component variants
- Integrate into CI/CD pipeline to catch unexpected visual changes

### PBI: Content Validation CI Check
**Priority:** High
**Description:** Add pre-commit validation for content files

- Validate all `.md` files in `src/content/` against Zod schemas
- Ensure all `related_concepts` references exist
- Check for broken internal links
- Validate date formats and maturity/status enums

## Commit Message

```
fix: implement "Determinism over Vibes" manifesto on home page

- Replace default Astro starter content with ASDLC manifesto
- Add missing BaseLayout and SpecCard imports to all pages (fixes TypeScript errors)
- Structure home page into logical sections with clear navigation
- Follow "Spec-Sheet" aesthetic using global.css classes
- Verify build pipeline passes with 0 errors

Resolves: DEFECT-001
```

## Related Documents

- `AGENTS.md` - Agent directives referenced in manifesto
- `src/content/config.ts` - Zod schemas for content validation
- `src/styles/global.css` - Design system referenced in Quick Start
- `docs/backlog/PBI-0002-B-QA-for-content-pipes.md` - Phase 2 acceptance criteria