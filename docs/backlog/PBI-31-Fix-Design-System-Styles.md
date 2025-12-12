# PBI-31: Fix Design System Page Styles

**Status:** Implemented
**Type:** Bug Fix / Styling
**Effort:** Small
**Persona:** @Designer

## Context
The Design System page (`src/pages/resources/design-system.astro`) attempts to display the Color Palette using a set of CSS classes (`.color-palette`, `.color-group`, `.color-swatches`) that currently have no definition in the codebase.

As a result, the Color Palette section displays as a vertical stack of elements rather than a structured grid or cohesive palette visualization.

## Problem Statement
1.  **Missing Styles:** The classes `.color-palette`, `.color-group`, and `.color-swatches` are used in the markup but are not defined in any CSS file.
2.  **Broken Layout:** The color swatches are not arranged in the intended grid/row layout.
3.  **Visual Consistency:** The Design System page itself should be the best example of the design system, but currently lacks proper styling for its own components.

## Objectives
1.  Create a new stylesheet for the Design System page specific elements (or specifically the Color Palette).
2.  Implement a responsive grid layout for the color palette.
3.  Ensure the "breakout" layout is respected.

## Scope of Work

### 1. Create Component Styles
-   Create a new file: `src/styles/ds/components/color-palette.css`.
-   Implement styles for:
    -   `.color-palette`: Container for the groups (likely a grid or flex container).
    -   `.color-group`: Container for a category of colors (e.g., Backgrounds, Text).
    -   `.color-swatches`: Container for the list of `ColorSwatch` components (likely a grid).

### 2. Integration
-   Import the new file in `src/styles/ds/index.css`.

### 3. Refinement
-   Ensure the layout works on mobile (swatches might need to stack).
-   Verify the `breakout` class on `.color-palette` works as expected with the new grid styles.

## Acceptance Criteria
-   [x] The Color Palette section on `/resources/design-system` is visually structured (e.g., groups side-by-side or swatches in a grid).
-   [x] New styles are defined in `src/styles/ds/components/color-palette.css`.
-   [x] The file is imported in `src/styles/ds/index.css`.
-   [x] No inline styles are used for these layout fixes.
