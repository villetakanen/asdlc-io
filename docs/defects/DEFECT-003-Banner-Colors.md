# DEFECT-003: Banner Colors

**ID:** DEFECT-003
**Priority:** High
**Status:** Open
**Context:** Design Director Feedback

## Description
The "Alpha Release" banner currently uses `--c-brand` (Safety Orange). The Design Director specified that warnings must use the dedicated warning palette.

## Expected Behavior
The banner should use:
*   **Color:** `--c-warning` (`#946800`)
*   **Background:** `--c-warning-bg` (`#FFF5CC`)
*   **Border:** `--c-warning` (to match text)

## Implementation Plan
1.  **Update** `src/pages/index.astro`.
2.  **Change Styles:**
    *   `border: 1px dashed var(--c-warning)`
    *   `color: var(--c-warning)`
    *   `background: var(--c-warning-bg)`

## Styles
- Border: `1px dashed var(--c-warning)`
- Color: `var(--c-warning)`
- Background: `var(--c-warning-bg)`
