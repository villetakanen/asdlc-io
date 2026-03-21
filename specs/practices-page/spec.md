# Feature: Practices Collection Page Update

## Blueprint

### Context

The patterns collection page (`src/pages/patterns/index.astro`) was updated to a curated layout: a "Start Here" section with 3 foundational cards (SpecCard), followed by "Live Patterns" and "Experimental & Draft" sections using compact list items (SpecListItem). This provides clear information hierarchy — guiding newcomers to essential reading while keeping the full catalog accessible.

The practices page (`src/pages/practices/index.astro`) still uses the flat `CollectionIndex` + `SpecCardList` layout — every article gets equal visual weight as a card, with no editorial hierarchy. This spec aligns the practices page to the same curated model.

**Key practices** (the user's "Start Here" selection):
| Slug | Title | Rationale |
|------|-------|-----------|
| `agents-md-spec` | AGENTS.md Specification | Defines the agent constitution — foundational to every workflow |
| `living-specs` | Living Specs | The practice behind The Spec pattern — how specs stay alive |
| `pbi-authoring` | PBI Authoring | The practice behind The PBI pattern — how work items are written |

All remaining practices appear in lists below, grouped by status.

### Architecture

**Before (current):**
```
practices/index.astro
  → CollectionIndex layout
    → slot "definition": practices.md component
    → default slot: SpecCardList (flat grid, all items as cards)
```

**After (target):**
```
practices/index.astro
  → BaseLayout (direct, like patterns/index.astro)
    → prose wrapper
      → h1 + intro paragraph
      → "Start Here" section: 3 SpecCards (foundational slugs)
      → "Live Practices" section: SpecListItem list (remaining Live)
      → "Experimental & Draft" section: SpecListItem list
      → "Next Steps" section: cross-links to /patterns, /getting-started, /resources
```

**Data flow:**
1. `getCollection("practices")` — fetches all practices
2. Filter foundational by slug array: `["agents-md-spec", "living-specs", "pbi-authoring"]`
3. Filter remaining Live (excluding foundational slugs), sort alphabetically
4. Filter Experimental + Draft + Proposed, sort alphabetically
5. Render each group with appropriate component

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

- **Do NOT keep the CollectionIndex layout.** The curated model requires direct control over sections — CollectionIndex wraps everything in a single `spec-grid`.
- **Do NOT hardcode article descriptions in the page.** All content comes from the collection's frontmatter (`data.title`, `data.description`, `data.status`).
- **Do NOT include Draft-status articles in the foundational section.** Only slugs explicitly listed above qualify.
- **Do NOT create new components.** Reuse SpecCard and SpecListItem exactly as the patterns page does.

## Contract

### Definition of Done
- [ ] Practices page renders 3 foundational cards in a "Start Here" section
- [ ] Foundational slugs are `agents-md-spec`, `living-specs`, `pbi-authoring` (ordered)
- [ ] Remaining Live practices render as SpecListItem below the cards
- [ ] Experimental/Draft/Proposed practices render in a separate list section
- [ ] Page title is "Practices", h1 is "Practices & Implementation Guides"
- [ ] Page has a `description` meta tag for SEO
- [ ] "Next Steps" section links to /patterns, /getting-started, /resources
- [ ] `pnpm check` passes with 0 errors
- [ ] `pnpm build` succeeds
- [ ] Visual structure matches patterns/index.astro (card grid + list sections)

### Regression Guardrails
- All existing practice articles must remain accessible (no articles dropped)
- URLs remain unchanged: `/practices/{slug}`
- No new components introduced
- No new CSS files — uses existing `spec-grid` and `spec-list` classes

### Scenarios

**Scenario: Visitor lands on /practices**
- Given: A visitor navigates to /practices
- When: The page renders
- Then: They see 3 highlighted cards (AGENTS.md Specification, Living Specs, PBI Authoring), followed by a list of remaining Live practices, then Experimental/Draft practices

**Scenario: New Live practice is added**
- Given: A new practice with `status: "Live"` is added to `src/content/practices/`
- When: The page rebuilds
- Then: The new practice appears alphabetically in the "Live Practices" list (not in Start Here, unless slug is added to the foundational array)

**Scenario: Foundational article status changes**
- Given: `living-specs` status changes from Experimental to Live
- When: The page rebuilds
- Then: It still appears in "Start Here" (foundational selection is by slug, not status)

## Implementation Notes

The canonical reference implementation is `src/pages/patterns/index.astro`. The practices page should follow the same structure with only these differences:

1. Different foundational slugs
2. Collection name: `"practices"` instead of `"patterns"`
3. URL prefix: `/practices/` instead of `/patterns/`
4. Page copy (h1, intro paragraph, section descriptions)

The `formatDate` helper can be defined inline (same as patterns page).

**Files to modify:**
- `src/pages/practices/index.astro` — rewrite to match patterns model

**Files NOT to modify:**
- `src/layouts/CollectionIndex.astro` — still used by concepts page
- `src/components/SpecCard.astro` — no changes needed
- `src/components/SpecListItem.astro` — no changes needed

## Resources

- Patterns page (reference implementation): `src/pages/patterns/index.astro`
- SpecCard component: `src/components/SpecCard.astro`
- SpecListItem component: `src/components/SpecListItem.astro`
