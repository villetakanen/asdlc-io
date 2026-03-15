# Feature: SpecLineItem Component

## Blueprint

### Context
The `SpecLineItem` component provides a dense, scannable list view for directory pages. As the number of patterns and concepts grows, the default `SpecCard` component consumes too much vertical space. This component solves the scaling limitation while retaining essential metadata (status, tags, last updated date) and interactivity required by the Avionics Design System.

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

### Anti-Patterns
- **Inline Colors/Tailwind:** Do not use Tailwind or arbitrary hex colors. All colors must be CSS variables.
- **Outer Constraints:** Do not bake complex outer margins into the component. It must remain a semantic link (`<a>`) that safely stacks inside standard CSS flex columns or grids without forcing spacing on its container.

## Contract

### Definition of Done
- [ ] Ensure the component renders as a dense row in directory lists without breaking spacing.
- [ ] Ensure hover and focus states provide visual feedback (e.g., `background-color: var(--c-bg-surface)`).
- [ ] Component is documented in ``/resources/design-system/components/spec-line-item`` with an active example and code snippet.

### Regression Guardrails
- Must always consume standard design tokens for borders and backgrounds.
- Contrast ratios on meta text and tags must pass WCAG AA standards.
