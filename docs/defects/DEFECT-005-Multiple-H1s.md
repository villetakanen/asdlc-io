# DEFECT-005: Multiple H1s

**ID:** DEFECT-005
**Priority:** Medium
**Status:** Open
**Context:** UAT Feedback

## Description
The page `http://localhost:4321/concepts/guardrails` displays multiple Level 1 headings (`<h1>`). Accessibility standards and SEO best practices dictate a single `<h1>` per page, which should be the page title.

## Expected Behavior
*   The page title ("Guardrails") should be the only `<h1>`.
*   All headings within the content body should start at Level 2 (`<h2>`) or lower.

## Implementation Plan
1.  **Inspect** `src/content/concepts/guardrails.md`.
2.  **Identify** any usage of single hash `#` headings.
3.  **Downgrade** these headings to `##` (H2) or appropriate lower levels.
