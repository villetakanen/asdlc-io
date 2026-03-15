# Feature: SpecLineItem Component

## Blueprint

### Context
The `SpecLineItem` component provides a dense, scannable list view for directory pages (concepts, patterns, practices indexes). As the number of patterns and concepts grows, the default `SpecCard` component consumes too much vertical space. This component solves the scaling limitation while retaining essential metadata (status, tags, last updated date) and interactivity required by the Avionics Design System.

**Scope:** This component is strictly for directory listing pages. It must not be used as section headings or navigation elements in the design system documentation — those use `DsSectionHeader` and `DsComponentHeader` respectively.

### Architecture
- **Component File:** `src/components/SpecLineItem.astro`
- **Props Interface:**
  - `title` (string)
  - `url` (string)
  - `meta` (string, optional - usually a date)
  - `status` (string, optional)
  - `tags` (string array, optional)
- **Styling:** Uses scoped CSS inside the `.astro` file, strictly mapped to existing CSS variables from `src/styles/ds/tokens.css` (`--c-border`, `--c-bg-surface`, `--c-text-secondary`, etc.).
- **Layout Requirements:** It must be a dense, horizontal row displaying the `title` inline, the `<StatusBadge>` next to the title, and the `meta`/`tags` information aligned to the right. Wrap deeply in an `<a>` tag referencing `url`.
- **Usage Context:** The component renders as a bare `<a>` tag and is context-unaware. Callers must place each `SpecLineItem` inside a `<li>` within a `<ul class="spec-line-list">` for correct list semantics. The `spec-line-list` class (defined in `src/styles/ds/components/spec-line-list.css`) resets list styling.

### Anti-Patterns
- **Inline Colors/Tailwind:** Do not use Tailwind or arbitrary hex colors. All colors must be CSS variables.
- **Outer Constraints:** Do not bake complex outer margins into the component. It must remain a semantic link (`<a>`) that safely stacks inside standard CSS flex columns or grids without forcing spacing on its container.
- **Bare stacking without list markup:** Do not render SpecLineItems as siblings without `<ul>` / `<li>` wrapping. Screen readers need list semantics to announce item count and enable list navigation.

## Contract

### Definition of Done
- [ ] Ensure the component renders as a dense row in directory lists without breaking spacing.
- [ ] Ensure hover and focus states provide visual feedback (e.g., `background-color: var(--c-bg-surface)`).
- [ ] Component is documented in `/resources/design-system/components/spec-line-item` with an active example and code snippet.

### Regression Guardrails
- Must always consume standard design tokens for borders and backgrounds.
- Contrast ratios on meta text and tags must pass WCAG AA standards.
- The root element must be a semantic `<a>` tag — not a `<div>` with an onclick handler.
- Must not introduce outer margins that break stacking in flex/grid containers.

### Scenarios

```gherkin
Feature: SpecLineItem Component

  Scenario: Renders as a dense row with all metadata
    Given a SpecLineItem with title "Context Gates", status "Live", and tags ["Architecture"]
    When it is rendered in a directory list
    Then the title "Context Gates" should be visible as a link
    And a StatusBadge showing "Live" should appear next to the title
    And the tag "Architecture" should be displayed
    And the entire row should be a single clickable link

  Scenario: Hover state provides visual feedback
    Given a SpecLineItem is rendered
    When the user hovers over it
    Then the background color should change to var(--c-bg-surface)

  Scenario: Focus state is keyboard-accessible
    Given a SpecLineItem is rendered
    When the user tabs to it with the keyboard
    Then a visible focus indicator should appear
    And pressing Enter should navigate to the linked URL

  Scenario: Stacks without spacing conflicts
    Given multiple SpecLineItems are rendered in a flex column
    Then they should stack densely without unexpected gaps
    And no outer margin from the component should disrupt the container layout

  Scenario: Renders gracefully with optional props omitted
    Given a SpecLineItem with only title and url provided
    When it is rendered
    Then the title should be visible as a link
    And no StatusBadge or tags should be rendered
    And the layout should not break or show empty space
```
