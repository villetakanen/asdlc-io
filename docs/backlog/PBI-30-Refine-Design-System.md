# PBI-30: Refine Design System Page and CSS Architecture

**Status:** Proposed
**Type:** Refactor / Documentation
**Effort:** Medium

## Context
The Avionics Design System page (`src/pages/resources/design-system.astro`) serves as the source of truth for the project's visual language. However, an analysis of the codebase reveals discrepancies between the documentation and the actual implementation, as well as opportunities to improve CSS modularity.

## Problem Statement
1.  **Documentation Drift:** The "File References" section in the DS page is incomplete (missing `typography.css`, `layouts/grid.css`, `pre-flight.css`).
2.  **Local Styles:** Key layouts like `CollectionIndex.astro` define grid styles (`.spec-grid`) locally instead of using the Design System.
3.  **Undocumented Utilities:** The `content-prose` class is used in layouts but not documented in the DS page.
4.  **Inline Styles:** The Front Page uses inline styles for the "Alpha Release" warning, which should be tokenized or componentized.
5.  **Missing Components:** Reusable components like `ColorSwatch` are used within the DS page but not exposed or documented for wider use.

## Objectives
1.  **Align Documentation:** Update the Design System page to accurately reflect the current CSS architecture and file structure.
2.  **Refactor CSS:** Move local layout styles to the Design System (`src/styles/ds`) to promote reuse and consistency.
3.  **Tokenize UI:** Replace inline styles with Design System tokens and utility classes.

## Scope of Work

### 1. Update Design System Page
-   **File References:** Update the list to include:
    -   `ds/typography.css`
    -   `ds/layouts/grid.css`
    -   `ds/pre-flight.css`
-   **Prose Documentation:** Add a section explaining the difference between `.prose` (generic) and `.content-prose` (article specific).
-   **Grid Documentation:** Document the `spec-grid` layout (once refactored).
-   **Component Documentation:** Add `ColorSwatch` to the components section if it is intended for reuse.

### 2. Refactor CSS
-   **Spec Grid:** Extract the `.spec-grid` styles from `src/layouts/CollectionIndex.astro` to a new file `src/styles/ds/layouts/spec-grid.css` (or add to `grid.css` if appropriate) and import it in `ds/index.css`.
-   **Alpha Warning:** Create a utility class (e.g., `.banner-warning`) or a reusable component for the "Alpha Release" warning on the Front Page, using `var(--c-warning)` and `var(--c-text-primary)`.

### 3. Verify Layouts
-   Ensure `src/pages/index.astro`, `src/layouts/CollectionIndex.astro`, and `src/pages/concepts/[...slug].astro` import and use the refactored styles correctly.

## Acceptance Criteria
-   [ ] `src/pages/resources/design-system.astro` accurately lists all active Design System CSS files.
-   [ ] `.spec-grid` is defined in `src/styles/ds` and used in `CollectionIndex.astro` without local overrides.
-   [ ] The Front Page "Alpha Release" warning uses a CSS class or component, not inline styles.
-   [ ] `.content-prose` is documented in the Design System page.
