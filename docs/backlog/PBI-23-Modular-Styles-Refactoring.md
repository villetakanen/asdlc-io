# PBI-23: Modular Styles Refactoring

## Goal
Refactor the `src/styles/` directory to be a modular, modern collection of styles, specifically targeting the Avionics Design System. The goal is to establish a clear separation between the "Experience Model" (Design System) and the application-specific styles, enabling the "freezing" of the Design System to prevent drift.

## Requirements
- **Modular Structure**: Styles should be organized by domain (Design System vs. Application).
- **Phased Refactoring**: The change should be broken down into manageable chunks.
- **Drift Prevention**: A mechanism must be in place to prevent unauthorized changes to the Design System files.

## Implementation Plan

### Phase 1: Structure & Tokens
Create the new directory structure and move the foundational tokens.

- [ ] Create directory `src/styles/ds/`
- [ ] Create directory `src/styles/ds/components/`
- [ ] Create directory `src/styles/ds/layouts/`
- [ ] Move `src/styles/tokens.css` -> `src/styles/ds/tokens.css`

### Phase 2: Core Design System Migration
Move core global styles that define the "Avionics" look and feel.

- [ ] Create `src/styles/ds/pre-flight.css` (Modern reset / Tailwind-inspired).
- [ ] Move `src/styles/base.css` -> `src/styles/ds/base.css`
- [ ] Move `src/styles/typography.css` -> `src/styles/ds/typography.css`
- [ ] Move `src/styles/prose.css` -> `src/styles/ds/prose.css`

### Phase 3: Component & Layout Migration
Move component and layout styles into the DS structure.

- [ ] Move `src/styles/status.css` -> `src/styles/ds/components/status.css`
- [ ] Move `src/styles/site-header.css` -> `src/styles/ds/components/site-header.css`
- [ ] Move `src/styles/hamburger.css` -> `src/styles/ds/components/hamburger.css`
- [ ] Move `src/styles/components/*` -> `src/styles/ds/components/*`
- [ ] Move `src/styles/layouts/*` -> `src/styles/ds/layouts/*`

### Phase 4: Entrypoints
Create the main entry points to orchestrate the styles.

- [ ] Create `src/styles/ds/index.css` importing all DS files.
- [ ] Update `src/styles/index.css` (or `global.css`) to import `ds/index.css` and app-specific styles.

### Phase 5: Protection Mechanism (Context Gate)
Implement the "Context Gate" for the Design System.

- [ ] Create `scripts/verify-ds-freeze.js` to check for unauthorized changes in `src/styles/ds/`.
    - The script should fail if files in `src/styles/ds/` are modified without a specific commit message tag (e.g., `[EM]`).
- [ ] Add the script to `lefthook.yml` pre-commit hooks.

## Verification
- **Build Verification**: `pnpm build` must pass.
- **Visual Regression**: Verify `/resources/design-system` and key pages match the original design.
- **Protection Test**: Attempt to modify `src/styles/ds/` without the tag and verify the commit is rejected.
