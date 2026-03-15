# PBI-68: Create `SpecListItem` Design System Component

## 1. Directive
Design and implement a new `SpecListItem.astro` component for the Avionics Design System. This component will provide a dense, scannable list view for directory pages, resolving the scaling limitations of the existing `SpecCard` component when displaying long lists of items.

## 2. Scope
- Create `src/components/SpecListItem.astro`.
- Implement associated scoped or global styling (ensure it uses the existing CSS variables from `global.css` or `ds/tokens.css`).
- Add documentation and an example of the component to the Design System page (`src/pages/resources/design-system.astro`).

## 3. Dependencies
None.

## 4. Context
Read: `specs/design-system/spec-list-item/spec.md`
- Acts as the permanent architectural source of truth for this component's design and regression constraints.

## 5. Changes Required

### A. Implement `SpecListItem.astro`
- **Props:** The component should accept `title` (string), `url` (string), `meta` (string, optional - usually a date), `status` (string, optional), and `tags` (string array, optional) - mirroring the API of `SpecCard`.
- **Layout:** It must be a dense, horizontal row.
  - Display the `title` inline.
  - Display the `<StatusBadge>` next to the title if a status is provided.
  - Display the `meta` information aligned to the right, utilizing monospace text (`.mono`).
- **Styling constraints:**
  - Wrap the entire row in an `<a>` tag referencing `url`.
  - Use `border-bottom: 1px solid var(--c-border)` to separate items.
  - Provide a hover state (e.g., `background-color: var(--c-bg-surface)`) to indicate interactivity.
  - Strip outer formatting; it should seamlessly stack inside a standard CSS flex column or unordered list.

### B. Document in the Design System
- Open `src/pages/resources/design-system.astro`.
- Under the "Components" section, add a new subsection for "Spec Line Item".
- Provide an explanation of its use case (dense horizontal directory views compared to the featured `SpecCard`).
- Render a live example of the component using mock data (similar to the existing `SpecCard` demo).
- Include the ````html` code snippet showing how to invoke it.

## 6. Verification
- Run `pnpm dev` and navigate to `/resources/design-system` to visually verify the component matches the Avionics aesthetics.
- Ensure hover states work and contrast rules pass WCAG AA standards.
- Run `pnpm check` to verify TypeScript prop definitions.

## 7. Notes
This PBI blocks PBI-66. The `SpecListItem` is an execution mechanism required to fulfill the new Patterns Index layout specification without compromising the design system governance rule (Experience Modeling).

## 8. Blockers
None.
