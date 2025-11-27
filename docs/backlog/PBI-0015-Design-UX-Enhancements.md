# PBI-0015: Design & UX Enhancements

**ID:** PBI-0015
**Priority:** Medium
**Effort:** Medium
**Phase:** Iteration 5
**Context:** From Manifesto to Field Manual

## 1. Overview
This PBI addresses specific design and user experience improvements to support the transition to a "Field Manual" and improve usability on mobile devices.

## 2. User Story
As a **Reader**, I want **a responsive and clearly structured interface**, so that **I can easily navigate the content on any device.**

## 3. Implementation Tasks

### 3.1. Mobile Navigation
*   [x] **Feature:** Implement a hamburger menu for mobile devices.
    *   **Issue:** Top navigation is currently broken or unusable on small screens.
    *   **Goal:** Functional navigation on mobile.

### 3.2. H2 Styling
*   [ ] **Style:** Update `.prose` H2 headers.
    *   **Pattern:** `[chapter number]. // [Title]`
    *   **Details:** Chapter number in brand color, `//` in muted color.
    *   **Goal:** Enhance the "Spec-Sheet" aesthetic.

### 3.3. Field Manual Rebranding
*   [ ] **Refactor:** Rename `/manuscript` route to `/fieldmanual`.
*   [ ] **Content:** Update all UI references from "Manuscript" to "Field Manual".
    *   **Goal:** Align terminology with the new theme.

## 4. Acceptance Criteria
*   [ ] Mobile navigation works on standard mobile viewports.
*   [ ] H2 headers match the new design specification.
*   [ ] URL structure uses `/fieldmanual`.
*   [ ] "Manuscript" term is replaced in the UI.
