# PBI-0007: Design System Colors (Paper & Ink)

**ID:** PBI-0007
**Priority:** High
**Effort:** 2 Hours
**Phase:** Phase 3 (Semantic SEO & Optimization) - *Design Override*
**Context Reviewed:** `src/styles/global.css`, `AGENTS.md`

> [!IMPORTANT]
> **DESIGN OVERRIDE:** This PBI implements the "Paper & Ink" color system and "Safety Orange" branding, superseding previous color guidelines.

## 1. Strategic Context
Since we are documenting **Agentic SDLC** (a new, somewhat chaotic field), grounding it in the stability of this design system provides authority. The warm grey background (`#F4F4F0`) reduces eye strain for reading long specs, and the **International Safety Orange** (`#F04E30`) creates a beautiful contrast with the "Avionics" font set (Archivo + B612 Mono).

## 2. User Story
As a **User**, I want **a high-contrast, low-strain reading experience**, so that **I can comfortably read complex technical specifications while feeling the authority of the content.**

## 3. Architecture Alignment
*   **Overrides:** `src/styles/global.css` root variables.
*   **Alignment:** Complements PBI-0006 (Typography).
*   **No Frameworks:** Pure CSS variables.

## 4. Implementation Tasks

### 4.1. Global Styles (`src/styles/global.css`)
*   [ ] **Update Variables:**
    *   `--c-bg-page`: `#F4F4F0` (Warm paper)
    *   `--c-bg-surface`: `#EBEBE6` (Card/Code bg)
    *   `--c-border`: `#D6D6D1` (Heavy grid border)
    *   `--c-text-primary`: `#111111` (Ink)
    *   `--c-text-secondary`: `#585855` (Specs)
    *   `--c-brand`: `#F04E30` (Safety Orange)
    *   `--c-brand-hover`: `#D13A1E`
    *   `--c-success`: `#00703C`
    *   `--c-success-bg`: `#E1F0E5`
    *   `--c-warning`: `#946800`
    *   `--c-warning-bg`: `#FFF5CC`
    *   `--c-error`: `#CC0000`
    *   `--c-error-bg`: `#FFEBEB`
    *   `--c-code-bg`: `#EBEBE6`
    *   `--c-code-text`: `#2A2A2A`
*   [ ] **Update Component Styles:**
    *   `body`: Use `--c-bg-page` and `--c-text-primary`.
    *   `pre`: Use `--c-code-bg`, `--c-code-text`, and left border with `--c-brand`.
    *   `.spec-card`: Add utility class with brutalist shadow (`4px 4px 0px rgba(0,0,0,0.05)`).

## 5. Out of Scope
*   Dark mode (this PBI focuses on the "Paper" light mode).
*   Component refactoring (unless style breaking).

## 6. Acceptance Criteria
*   [ ] Background is warm grey (`#F4F4F0`).
*   [ ] Primary text is `#111111`.
*   [ ] Code blocks have a left orange border.
*   [ ] "Safety Orange" is used for branding/accents.
*   [ ] `.spec-card` class is available and matches design.

## 7. Quality Gates
*   [ ] `pnpm build` succeeds.
*   [ ] Visual inspection of Home, Concepts, and Patterns pages.

## 8. Definition of Done
1. [ ] `src/styles/global.css` updated.
2. [ ] Changes verified in local preview.
