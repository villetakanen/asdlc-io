# PBI-0005: Navigation Wrapper & Visual Remediation

**ID:** PBI-0005
**Priority:** Medium
**Effort:** 6 Hours
**Phase:** Phase 3 (Semantic SEO & Optimization)
**Context Reviewed:** `src/styles/global.css`, `docs/reports/project_state_summary.md`, `PBI-0004`

## 1. Strategic Context
As we transition to Phase 3 and populate the content library (PBI-0004), the current "static file viewer" interface is insufficient. We need a "vessel" to hold this content—a navigable website structure. Additionally, UAT-Log-001 identified a visual deviation (yellow banner) that violates the strict "Spec-Sheet" design system.

## 2. User Story
As a **User**, I want **consistent navigation and a clear visual hierarchy**, so that **I can explore the documentation without getting lost or distracted by off-brand visual noise.**

## 3. Architecture Alignment
*   **Design System:** Enforces the "Spec-Sheet" aesthetic (Monochrome, Borders, JetBrains Mono) defined in `global.css`.
*   **Astro Layouts:** Utilizes Astro's layout system for global elements (Header/Footer).
*   **Vanilla CSS:** Adheres to the "No Tailwind" directive.

## 4. Implementation Tasks

### 4.1. Visual Remediation (The Banner)
*   [ ] **Refactor:** Remove existing yellow warning banner.
*   [ ] **Implement:** New "System Status" banner.
    *   *Location:* Top of viewport, Index page ONLY.
    *   *Style:* White bg, 1px dashed black border (top/bottom), JetBrains Mono, Uppercase, Small.
    *   *Content:* `ALPHA RELEASE: SHIPPING LIVE. ZERO WARRANTY.` (Text must remain unchanged per Content Team)

### 4.2. Global Navigation (The Header)
*   [ ] **Create Component:** `src/components/Header.astro` (or inline in Layout).
*   [ ] **Style:**
    *   Heavy bottom border (`1px solid var(--c-border)`).
    *   Logo/Site Name in `var(--f-mono)`.
    *   Links: Home (`/`), Concepts (`/concepts`), Patterns (`/patterns`).
*   [ ] **Interaction:** Links must use the "inverted hover" state (Black bg, White text).

### 4.3. Global Footer
*   [ ] **Create Component:** `src/components/Footer.astro` (or inline in Layout).
*   [ ] **Style:**
    *   Top border (`1px solid var(--c-border)`).
    *   Text color: `var(--c-dim)`.
*   [ ] **Content:** Copyright, Version (v0.3.0-alpha), Status (System: Operational).

### 4.4. UI Components
*   [ ] **Update:** `src/styles/global.css`.
*   [ ] **Add:** `.btn` utility class.
    *   *Specs:* Sharp edges, 1px solid black border, `var(--f-mono)`, inverted hover state.
    *   *Active:* Pure Blue border (`var(--c-accent)`).

## 5. Out of Scope
*   Mobile menu (Hamburger) - Basic responsive stacking is sufficient for now.
*   Dark mode (Strictly Black/White for this phase).
*   Search functionality (Future PBI).

## 6. Acceptance Criteria
*   [ ] Yellow banner is completely removed.
*   [ ] "System Status" banner appears ONLY on the home page (`/`).
*   [ ] Header and Footer appear on ALL pages.
*   [ ] Navigation links function correctly.
*   [ ] All new UI elements use `var(--c-border)`, `var(--f-mono)`, and `var(--f-sans)` correctly.
*   [ ] No new CSS frameworks or libraries installed.

## 7. Quality Gates
*   [ ] `pnpm lint` passes.
*   [ ] `pnpm check` passes.
*   [ ] `pnpm build` succeeds.
*   [ ] Visual verification in `pnpm preview`.

## 8. Definition of Done
1. [ ] Code implemented and committed.
2. [ ] Visual regression check passed (no "Warning Colors").
3. [ ] Merged to `dev`.
