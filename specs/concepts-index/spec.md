# Feature: Concepts Index Page

## Blueprint

### Context

The Concepts page (`/concepts`) is the entry point to the theoretical foundations of the Agentic SDLC. The patterns and practices index pages were refactored to a curated layout: a "Start Here" section with 3 foundational cards (`SpecCard`), followed by status-grouped lists (`SpecListItem`). The concepts page still uses the legacy `CollectionIndex` layout with `SpecCardList`, which renders every article as an equally-weighted card with no editorial hierarchy.

This spec aligns the concepts page to the same curated model established by the patterns and practices pages.

### Architecture

**Before (current):**
```
concepts/index.astro
  → CollectionIndex layout
    → slot "definition": concepts.md component
    → default slot: SpecCardList (flat grid, all items as cards, sorted by status+date)
```

**After (target):**
```
concepts/index.astro
  → BaseLayout (direct, like patterns/index.astro)
    → <article class="prose"> wrapper
      → h1 + intro paragraph
      → "Start Here" section: 3 SpecCards (foundational slugs)
      → "Live Concepts" section: SpecListItem list (remaining Live)
      → "Experimental & Draft" section: SpecListItem list
      → "Deprecated" section: SpecListItem list
      → "Next Steps" section: cross-links
```

**Foundational concepts (user-specified landmarks):**

| Slug | Title | Rationale |
|------|-------|-----------|
| `agentic-sdlc` | Agentic SDLC | The core concept — defines the entire domain |
| `spec-driven-development` | Spec-Driven Development | The methodology that governs how specs drive implementation |
| `levels-of-autonomy` | Levels of Autonomy | The taxonomy for agent capability — foundational to all patterns |

**Data flow:**
1. `getCollection("concepts")` — fetches all concepts
2. Filter foundational by slug array: `["agentic-sdlc", "spec-driven-development", "levels-of-autonomy"]`
3. Filter remaining Live (excluding foundational slugs), sort alphabetically
4. Filter Experimental + Draft + Proposed, sort alphabetically
5. Filter Deprecated, sort alphabetically
6. Render each group with appropriate component

**Components reused (no new components):**
- `SpecCard` — for foundational cards
- `SpecListItem` — for list items
- `BaseLayout` — direct layout (drops `CollectionIndex`)

**Imports required:**
- `getCollection` from `astro:content`
- `SpecCard` from `../../components/SpecCard.astro`
- `SpecListItem` from `../../components/SpecListItem.astro`
- `BaseLayout` from `../../layouts/BaseLayout.astro`

### Anti-Patterns

- **Do NOT keep the CollectionIndex layout.** The curated model requires direct control over sections — `CollectionIndex` wraps everything in a single `spec-grid`.
- **Do NOT keep the SpecCardList component.** It renders all items as cards with no hierarchy.
- **Do NOT keep the `concepts.md` definition import.** The intro paragraph is written inline (same as patterns and practices pages).
- **Do NOT hardcode article descriptions in the page.** All content comes from the collection's frontmatter (`data.title`, `data.description`, `data.status`).
- **Do NOT use SpecCard for directory sections.** Cards consume too much vertical space at scale; SpecListItem is correct for dense listings.
- **Do NOT create new components.** Reuse SpecCard and SpecListItem exactly as the patterns page does.

## Contract

### Definition of Done
- [x] Concepts page renders 3 foundational cards in a "Start Here" section
- [x] Foundational slugs are `agentic-sdlc`, `spec-driven-development`, `levels-of-autonomy` (ordered)
- [x] Remaining Live concepts render as SpecListItem below the cards
- [x] Experimental/Draft/Proposed concepts render in a separate list section
- [x] Deprecated concepts render in a separate "Deprecated" list section below Experimental & Draft
- [x] Unknown-status concepts (missing status) are excluded from all sections
- [x] Page title is "Concepts", h1 is "Defined Concepts"
- [x] Page has a `description` meta tag for SEO
- [x] "Next Steps" section links to /patterns, /getting-started, /resources
- [x] `pnpm check` passes with 0 errors
- [x] `pnpm build` succeeds
- [x] Visual structure matches patterns/index.astro and practices/index.astro

### Regression Guardrails
- All existing concept articles must remain accessible (no articles dropped from navigation)
- URLs remain unchanged: `/concepts/{slug}`
- No new components introduced
- No new CSS files — uses existing `spec-grid` and `spec-list` classes
- No inline styles or Tailwind classes
- The page must use `BaseLayout` directly, not `CollectionIndex`
- Foundational concept slugs must be maintained as a curated list, not derived from status
- Categorization logic must handle absence of concepts in any status without breaking

### Scenarios

```gherkin
Feature: Concepts Index Page

  Scenario: Visitor lands on /concepts
    Given a visitor navigates to /concepts
    When the page renders
    Then they see 3 highlighted cards (Agentic SDLC, Spec-Driven Development, Levels of Autonomy)
    And below the cards, a list of remaining Live concepts sorted alphabetically
    And below that, Experimental/Draft concepts sorted alphabetically

  Scenario: New concept published as Draft
    Given a new concept is added to src/content/concepts with status "Draft"
    When the concepts index page is built
    Then the concept appears under the "Experimental & Draft" section
    And it does not appear under "Live Concepts" or "Start Here"

  Scenario: Concept promoted to Live
    Given an existing concept has its status changed to "Live"
    When the concepts index page is built
    Then the concept appears under "Live Concepts"
    And it is removed from "Experimental & Draft"

  Scenario: Empty status group is hidden
    Given no concepts have status "Experimental", "Draft", or "Proposed"
    When the concepts index page is built
    Then the "Experimental & Draft" section is not in the DOM

  Scenario: Foundational article status changes
    Given "levels-of-autonomy" status changes from Live to Experimental
    When the concepts index page is built
    Then it still appears in "Start Here" (foundational selection is by slug, not status)

  Scenario: Deprecated concept appears in its own section
    Given a concept has status "Deprecated"
    When the concepts index page is built
    Then it appears under the "Deprecated" section
    And it does not appear under "Live Concepts" or "Experimental & Draft"
```

## Implementation Notes

The canonical reference implementation is `src/pages/patterns/index.astro`. The concepts page should follow the same structure with only these differences:

1. Foundational slugs: `["agentic-sdlc", "spec-driven-development", "levels-of-autonomy"]`
2. Collection name: `"concepts"` instead of `"patterns"`
3. URL prefix: `/concepts/` instead of `/patterns/`
4. Page copy (h1, intro paragraph, Next Steps links)
5. Deprecated concepts get their own section (patterns/practices pages don't have this case yet)
6. Unknown-status concepts are excluded

The `formatDate` helper can be defined inline (same as patterns page).

**Page copy:**
- **H1:** "Defined Concepts"
- **Intro:** Concepts are the theoretical foundations — immutable ideas, taxonomies, and definitions that underpin the Agentic SDLC. They describe the "physics" of agent-driven software development.
- **Start Here subhead:** "Three landmark concepts that define the domain."
- **Next Steps:** Links to /patterns ("See how concepts become architectural designs"), /getting-started, /resources

**Files to modify:**
- `src/pages/concepts/index.astro` — rewrite to match patterns/practices model

**Files NOT to modify:**
- `src/layouts/CollectionIndex.astro` — may still be used elsewhere; do not delete
- `src/components/SpecCard.astro` — no changes needed
- `src/components/SpecListItem.astro` — no changes needed
- `src/components/SpecCardList.astro` — no changes needed (may be used elsewhere)

**Potential cleanup (separate task):**
After this refactor, `CollectionIndex.astro`, `SpecCardList.astro`, and `components/definitions/concepts.md` may become orphaned. Verify usage before removing.

## Resources

- Patterns index spec (reference): `specs/patterns-index/spec.md`
- Practices page spec (reference): `specs/practices-page/spec.md`
- Patterns page (reference implementation): `src/pages/patterns/index.astro`
- Practices page (reference implementation): `src/pages/practices/index.astro`
