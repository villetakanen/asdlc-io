# Spec: Article Cards (SpecCard)

## Context

The Article Card is a rich, high-visibility component for surfacing articles on collection index pages. It displays title, status badge, description, date, and tags — giving readers enough context to judge relevance without clicking through.

On the Patterns index, Article Cards serve as **call-to-action highlights** for foundational patterns ("Start Here"), while the bulk of the directory uses the denser `SpecListItem` component. On Concepts and Practices indexes, Article Cards currently render all items, though the expectation is these pages will follow the Patterns index model as content grows.

## Architecture

- **SpecCard** (`src/components/SpecCard.astro`) — Renders a single article as a clickable card. Accepts `title`, `url`, `meta`, and optional `description`, `status`, `tags`.
- **SpecCardList** (`src/components/SpecCardList.astro`) — Iterates a typed `CollectionEntry[]` and maps frontmatter fields to SpecCard props. Handles date formatting.
- **StatusBadge** (`src/components/StatusBadge.astro`) — Sub-component rendering lifecycle status as a color-coded badge.
- **Data Source:** `description`, `status`, `tags`, `lastUpdated` from the `articleSchema` in `src/content/config.ts`.
- **Styling:** Scoped CSS in `SpecCard.astro` for layout; global token overrides in `src/styles/ds/components/spec-card.css`. All values derive from Avionics Design System tokens.
- **Design System Docs:** Isolated view at `/resources/design-system/components/spec-card` via `src/components/ds-docs/docs/SpecCardDocs.astro`.

## Known Defects

- **Naming mismatch:** The component is named `SpecCard` (after the design system's "spec-sheet" visual language) rather than `ArticleCard` (its domain function). The folder, design system docs, and PBI history all use "Article Card" as the feature name. The component and its CSS class (`.spec-card`) should be renamed to `ArticleCard` / `.article-card` to align the domain model with the implementation. This rename should also cover `SpecCardList` → `ArticleCardList` and the DS docs references.

## Anti-Patterns

- **Mystery Meat Navigation** — Displaying only titles on index pages, forcing users to click to understand relevance.
- **Flat Visual Hierarchy** — Giving metadata (dates) the same visual weight as the description or title.
- **Rogue Styling** — Using inline styles or hardcoded colors instead of design tokens (`--c-text-secondary`, `--c-dim`, etc.).
- **Prop Omission** — Passing articles to SpecCardList without ensuring `description` is populated in frontmatter.

## Contract

### Definition of Done

- Article Cards render with title and StatusBadge in the top row at equal visual prominence.
- Description, when present, renders below the title row at secondary text weight.
- Date metadata is visually subordinate (smaller font, muted color).
- Tags render as a distinct row below the metadata.
- Cards without a description degrade gracefully — layout does not collapse.
- The component is documented with a live example in the design system isolated view.

### Regression Guardrails

- All color values must reference CSS custom properties, never hex literals.
- Date text contrast must meet WCAG 2.1 AA against the card background (both default and hover states).
- Hover state inverts the card; all child text must remain legible by inheriting color.
- The `description` prop must remain optional — the component must render correctly without it.

### Scenarios

**Scenario: Article card with full metadata**
- Given an article with title, status, description, date, and tags
- When rendered as an Article Card
- Then the title and status badge appear in the top row
- And the description appears below the title
- And the date appears in muted, smaller text
- And tags render as a distinct group

**Scenario: Article card without description**
- Given an article without a description in frontmatter
- When rendered as an Article Card
- Then the card layout remains intact
- And the title, status, date, and tags display correctly

**Scenario: Hover state accessibility**
- Given an Article Card in its default state
- When the user hovers over the card
- Then the background and text colors invert
- And all text (including description and date) remains legible

**Scenario: CTA usage on structured index pages**
- Given an index page with foundational and directory sections
- When Article Cards are used in the "Start Here" section
- Then they visually distinguish the highlighted items from the denser SpecListItem directory below
