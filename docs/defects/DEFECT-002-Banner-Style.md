# DEFECT-002: Banner Style

**ID:** DEFECT-002
**Priority:** High
**Status:** Open
**Context:** UAT Feedback

## Description
The "Alpha Release" banner currently uses black dashed borders (top/bottom only) and black text.
1.  It does not use **brand colors** (`--c-brand`) for the info/warning.
2.  It lacks **side borders**, making it look like a separator rather than a contained "sticker" or "card".

## Expected Behavior
The banner should:
*   Have a **full** dashed border (top, bottom, left, right).
*   Use the **brand color** (`--c-brand`) for the border and text to align with the "Safety Orange" aesthetic for warnings/info.

## Implementation Plan
1.  **Update** `src/pages/index.astro`.
2.  **Change Styles:**
    *   `border: 1px dashed var(--c-brand)` (Full border)
    *   `color: var(--c-brand)`
    *   `background: #ffffff` (Keep white for contrast against the warm page bg)

## Styles
- Border: `1px dashed var(--c-brand)`
- Color: `var(--c-brand)`
- Background: `#ffffff`
- Font: `var(--f-mono)`
- Text Transform: `uppercase`
