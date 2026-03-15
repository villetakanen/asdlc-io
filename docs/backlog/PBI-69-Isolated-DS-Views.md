# PBI-69: Isolated Design System Views (Status: Completed)

## 1. Directive
Refactor the Avionics Design System documentation from a single monolithic page into an isolated, section-by-section dynamic structure using Astro routing.

## 2. Scope
- Move/refactor `src/pages/resources/design-system.astro` logic.
- Create dynamic routing logic (`[section].astro`) for the design system.
- Extract monolithic content into manageable sub-components or content collections (whichever architectural approach best satisfies the Spec).
- Add internal navigation to bridge the isolated views.

## 3. Dependencies
None.

## 4. Context
Read: `specs/design-system/isolated-views/spec.md`
- Acts as the permanent architectural source of truth for the dynamic routing structure, ensuring context isolation for both humans and agents.

## 5. Changes Required
- [x] Extract 8 main Design System sections into isolated `.astro` components in `src/components/ds-docs/`.
- [x] Refactor `src/components/ds-docs/Components.astro` into modular docs for sub-components in `src/components/ds-docs/docs/`.
- [x] Implement catch-all dynamic routing in `src/pages/resources/design-system/[...section].astro`.
- [x] Update `SpecLineItem` to handle isolation URL logic.
- [x] Delete monolithic `src/pages/resources/design-system.astro`.
- [x] Standardize code escaping using template literals to resolve JSX parsing conflicts.

## 6. Verification
- `pnpm dev` serves individual sections cleanly without loading the entire design system's DOM.
- `pnpm build` successfully generates static HTML for all valid section paths.
- Invalid paths return a 404.

## 7. Notes
This implements the foundation for Context Engineering applied to our own design system documentation.

## 8. Blockers
None.
