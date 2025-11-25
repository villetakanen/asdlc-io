# DEFECT-001: Banner Placement

**ID:** DEFECT-001
**Priority:** High
**Status:** Open
**Context:** UAT Feedback

## Description
The "Alpha Release" banner is currently positioned above the top navigation in `BaseLayout.astro`. This breaks the flow of the page. The user requested it to be "part of the content block".

## Expected Behavior
The banner should appear within the main content area of the Home page, likely at the top of the prose content, below the header.

## Implementation Plan
1.  **Remove** the conditional banner logic from `src/layouts/BaseLayout.astro`.
2.  **Add** the banner markup (with the new "sticker" styling) to `src/pages/index.astro`, inside the `<article class="prose">` block, at the top.

## Styles
Reuse the existing styles:
- Background: `#ffffff`
- Border: `1px dashed var(--c-text-primary)` (Top/Bottom)
- Font: `var(--f-mono)`, Uppercase, Small (`0.75rem`)
- Alignment: Center
