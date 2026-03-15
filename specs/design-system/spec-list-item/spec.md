# Feature: SpecListItem Component

## Blueprint

### Context
The `SpecListItem` component provides a dense, scannable list view for directory pages (concepts, patterns, practices indexes). Items are grouped by status under section headings, so the component does not display status — that context is provided by the parent list. The component focuses on title, link, and an optional description for disambiguation.

**Scope:** This component is strictly for directory listing pages. It must not be used as section headings or navigation elements in the design system documentation — those use `DsSectionHeader` and `DsComponentHeader` respectively.

### Architecture
- **Component File:** `src/components/SpecListItem.astro`
- **Props Interface:**
  - `title` (string, required) — the article name
  - `url` (string, required) — link target
  - `description` (string, optional) — short description for disambiguation (≤200 chars, matching the schema constraint)
- **Styling:** Uses scoped CSS inside the `.astro` file, strictly mapped to existing CSS variables from `src/styles/ds/tokens.css` (`--c-border`, `--c-bg-surface`, `--c-text-secondary`, etc.).
- **Layout Requirements:** A single-line manifest row with title and description on the same baseline. Description is mono, truncated with ellipsis. No borders between items — the list is visually tight. The entire row is wrapped in an `<a>` tag referencing `url`.
- **Usage Context:** The component renders as a bare `<a>` tag and is context-unaware. Callers must place each `SpecListItem` inside a `<li>` within a `<ul class="spec-list">` for correct list semantics. The `spec-list` class (defined in `src/styles/ds/components/spec-list.css`) resets list styling.

### Anti-Patterns
- **Inline Colors/Tailwind:** Do not use Tailwind or arbitrary hex colors. All colors must be CSS variables.
- **Outer Constraints:** Do not bake complex outer margins into the component. It must remain a semantic link (`<a>`) that safely stacks inside standard CSS flex columns or grids without forcing spacing on its container.
- **Bare stacking without list markup:** Do not render SpecListItems as siblings without `<ul>` / `<li>` wrapping. Screen readers need list semantics to announce item count and enable list navigation.
- **Redundant metadata:** Do not add status badges, tags, or dates to this component. Status is communicated by the parent grouping; tags and dates belong on the detail page.

## Contract

### Definition of Done
- [ ] Ensure the component renders as a dense row in directory lists without breaking spacing.
- [ ] Ensure hover and focus states provide visual feedback (e.g., `background-color: var(--c-bg-surface)`).
- [ ] Component is documented in `/resources/design-system/components/spec-list-item` with an active example and code snippet.

### Regression Guardrails
- Must always consume standard design tokens for colors and spacing.
- The root element must be a semantic `<a>` tag — not a `<div>` with an onclick handler.
- Must not introduce outer margins or borders that break dense stacking.
- Props interface must contain only `title`, `url`, and optional `description`. No status, tags, meta, or headingLevel props.
- Hover state must use `--c-brand` color, not background change — keeps the manifest feel tight.

### Scenarios

```gherkin
Feature: SpecListItem Component

  Scenario: Renders with title and description
    Given a SpecListItem with title "Context Gates" and description "Input filtering and output validation"
    When it is rendered in a directory list
    Then the title "Context Gates" should be visible as a link
    And the description should be visible below the title
    And the entire row should be a single clickable link

  Scenario: Renders with title only
    Given a SpecListItem with only title "Context Gates" and url
    When it is rendered
    Then the title should be visible as a link
    And no description text should be rendered
    And the layout should not break or show empty space

  Scenario: Hover state provides visual feedback
    Given a SpecListItem is rendered
    When the user hovers over it
    Then the text color should change to var(--c-brand)

  Scenario: Focus state is keyboard-accessible
    Given a SpecListItem is rendered
    When the user tabs to it with the keyboard
    Then a visible focus indicator should appear
    And pressing Enter should navigate to the linked URL

  Scenario: Stacks without spacing conflicts
    Given multiple SpecListItems are rendered in a spec-list
    Then they should stack densely without unexpected gaps
    And no outer margin from the component should disrupt the container layout
```
