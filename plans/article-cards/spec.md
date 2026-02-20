# Blueprint: Article Cards (SpecCard)

## Context
The "Article Card" (implemented as `SpecCard.astro`) is the primary navigational unit on the index pages (Patterns, Concepts, Practices). PBI-64 identifies that users currently lack immediate context for articles, relying solely on titles. The goal is to improve visual hierarchy by introducing a 1-2 sentence summary, deprioritizing metadata (dates), and ensuring status badges are prominent, thereby transforming index pages into easily scannable libraries.

## Architecture
- **Component**: `src/components/SpecCard.astro`
- **Data Source**: Astro content collections (`description` field in frontmatter).
- **Styling**: Scoped plain CSS within `.astro` files, leveraging Avionics Design System tokens (e.g., `--c-text-secondary`, `--s-gap`).

## Anti-Patterns
- **Mystery Meat Navigation**: Forcing users to click into an article just to figure out if it's relevant.
- **Flat Visual Hierarchy**: Giving metadata (dates) the same visual weight as the primary summary.
- **Rogue Styling**: Using inline styles or hardcoded colors instead of design tokens.

## Contract

### Definition of Done
- [ ] `SpecCard.astro` accepts an optional `description` string prop.
- [ ] The description renders beneath the title/status row.
- [ ] The date (`meta` prop) is visually deprioritized (smaller text, `--c-text-secondary` color).
- [ ] Status badges ("Live", "Experimental") remain prominent.
- [ ] All index pages (`patterns`, `concepts`, `practices`) pass the `description` prop to `SpecCard`.
- [ ] `src/pages/resources/design-system.astro` showcases the updated card design.
- [ ] Tests verify the presence and correct styling of the description and visual hierarchy layout.

### Regression Guardrails
- **Graceful Degradation**: If an article lacks a description, the card layout must not collapse or look broken.
- **Accessibility**: Text contrast for the deprioritized date must still meet WCAG AA standards.
- **Schema Compliance**: The `description` prop must align with the existing `articleSchema`.

### Gherkin Scenarios

**Scenario: Rendering a comprehensive Article Card**
- **Given** an article with a title, status, date, tags, and a summary description
- **When** the `SpecCard` component is rendered
- **Then** the title and status badge are prominent
- **And** the description is readable below the title
- **And** the date is visually deprioritized but legible

**Scenario: Rendering an Article Card without a description**
- **Given** an older article without a summary description
- **When** the `SpecCard` component is rendered
- **Then** the component layout does not break
- **And** the title, status, and metadata are correctly aligned

## Implementation Files
- `src/components/SpecCard.astro` (Component updates)
- `src/pages/patterns/index.astro` (Passing description prop)
- `src/pages/concepts/index.astro` (Passing description prop)
- `src/pages/practices/index.astro` (Passing description prop)
- `src/pages/resources/design-system.astro` (Design system documentation)
- `tests/(e2e or components)/...` (Test updates)

## Decision Log
- **Component Naming**: Opted to keep the `SpecCard.astro` filename to avoid unnecessary refactoring churn, while referring to the feature logically as "Article Cards" as per PBI-64.
