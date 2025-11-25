# DEFECT-004: Heading Letter Spacing

**ID:** DEFECT-004
**Priority:** Medium
**Status:** Open
**Context:** UAT Feedback

## Description
Headings (`h1`, `h2`, `h3`) are currently set to `text-transform: uppercase` but inherit a negative `letter-spacing: -0.03em` from the previous design override. Uppercase text generally requires positive letter spacing (tracking) for legibility.

## Expected Behavior
Headings should have sensible, positive letter spacing appropriate for their size. Smaller uppercase text typically needs more spacing than larger text.

## Implementation Plan
1.  **Update** `src/styles/global.css`.
2.  **Define Spacing:**
    *   `h1` (Large): `0.02em`
    *   `h2` (Medium): `0.04em`
    *   `h3` (Small): `0.06em`

## Styles
- Remove generic `letter-spacing: -0.03em` from the shared `h1, h2, h3` block.
- Apply specific spacing to each heading level.
