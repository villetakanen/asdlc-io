# PBI-0008: Fix Navigation Regressions

**ID:** PBI-0008
**Priority:** High
**Effort:** 2 Hours
**Phase:** Phase 3 (Semantic SEO & Optimization) - *Remediation*
**Context Reviewed:** `src/layouts/BaseLayout.astro`, `src/styles/global.css`, `PBI-0005`, `PBI-0006`, `PBI-0007`

> [!IMPORTANT]
> **REMEDIATION:** This PBI fixes regressions where PBI-0005 requirements were lost or conflicted with PBI-0006/0007 changes.

## 1. Strategic Context
Recent design system overrides (Typography & Colors) have caused regressions in the Navigation Wrapper (PBI-0005). Specifically, the "System Status" banner is missing, header/footer borders are incorrect, and hover states do not match the "inverted" requirement.

## 2. User Story
As a **User**, I want **the navigation and status indicators to be visible and correct**, so that **I can navigate the site and know the system status without visual confusion.**

## 3. Architecture Alignment
*   **Design System:** Adapts PBI-0005 requirements to PBI-0007 colors (e.g., "Black" becomes "Ink", "White" becomes "Paper" or pure white for contrast).
*   **Components:** Updates `BaseLayout.astro` and `global.css`.

## 4. Implementation Tasks

### 4.1. Global Styles (`src/styles/global.css`)
*   [ ] **Add `.btn` class:**
    *   `border: 1px solid var(--c-border)`
    *   `font-family: var(--f-mono)`
    *   `background: var(--c-bg-surface)`
    *   Hover: `background: var(--c-text-primary)`, `color: var(--c-bg-page)` (Inverted Ink/Paper)
*   [ ] **Add Navigation Styles:**
    *   Specific classes for Header/Footer to avoid generic `border-box` issues.

### 4.2. Base Layout (`src/layouts/BaseLayout.astro`)
*   [ ] **Implement System Status Banner:**
    *   Show ONLY on Homepage (`/`).
    *   Style: `background: #ffffff` (Sticker effect), `border-top/bottom: 1px dashed var(--c-text-primary)`.
    *   Font: `var(--f-mono)`, Uppercase, Small.
    *   Text: `ALPHA RELEASE: SHIPPING LIVE. ZERO WARRANTY.`
*   [ ] **Update Header:**
    *   Remove `border-box`. Use `border-bottom: 1px solid var(--c-border)`.
    *   Logo: `font-family: var(--f-mono)`.
    *   Links: Add class for "inverted hover" (Ink bg, Paper text).
*   [ ] **Update Footer:**
    *   Remove `border-box`. Use `border-top: 1px solid var(--c-border)`.

## 5. Out of Scope
*   New components (keep it inline in Layout for now as per current state, unless complexity demands extraction).

## 6. Acceptance Criteria
*   [ ] System Status banner appears on Home page with dashed border.
*   [ ] Header has bottom border only.
*   [ ] Footer has top border only.
*   [ ] Nav links invert on hover (Ink bg, Paper text).
*   [ ] `.btn` class exists and works.

## 7. Quality Gates
*   [ ] `pnpm build` succeeds.
*   [ ] Visual inspection.

## 8. Definition of Done
1. [ ] `src/layouts/BaseLayout.astro` updated.
2. [ ] `src/styles/global.css` updated.
3. [ ] Verified locally.
