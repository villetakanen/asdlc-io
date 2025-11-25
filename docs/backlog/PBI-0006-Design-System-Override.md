# PBI-0006: Design System Override (Typography & Branding)

**ID:** PBI-0006
**Priority:** High
**Effort:** 2 Hours
**Phase:** Phase 3 (Semantic SEO & Optimization) - *Design Override*
**Context Reviewed:** `src/styles/global.css`, `AGENTS.md`

> [!IMPORTANT]
> **DESIGN OVERRIDE:** This PBI represents a mandatory design override from the Design Director. It supersedes previous branding guidelines.

## 1. Strategic Context
To align with the "Agentic SDLC" vision, we are adopting a "Pro" industrial aesthetic. The combination of **B612 Mono** (Airbus cockpit font) and **Archivo** (Archival/Industrial font) conveys reliability, engineering precision, and a "Spec-Sheet" feel.

## 2. User Story
As a **User**, I want **a premium, industrial-grade interface**, so that **I feel I am using a professional engineering tool rather than a generic website.**

## 3. Architecture Alignment
*   **Overrides:** `src/styles/global.css` root variables.
*   **Updates:** `AGENTS.md` design directives.
*   **No Frameworks:** Continues to use Vanilla CSS (no Tailwind), adhering to `AGENTS.md`.

## 4. Implementation Tasks

### 4.1. Global Styles (`src/styles/global.css`)
*   [ ] **Import Fonts:** Add Google Fonts import for Archivo and B612 Mono.
*   [ ] **Update Variables:**
    *   `--font-sans`: 'Archivo', sans-serif
    *   `--font-mono`: 'B612 Mono', monospace
    *   Update typography scale (`--text-base`, `--text-lg`, etc.)
*   [ ] **Update Body Styles:**
    *   Background: `#f4f4f0` ("Paper" white)
    *   Color: `#1a1a1a` ("Ink" black)
    *   Letter-spacing: `-0.01em`
*   [ ] **Update Headings:**
    *   Font weight: `600`
    *   `font-variation-settings: "wdth" 110`
    *   Letter-spacing: `-0.03em`
    *   Text-transform: `uppercase`

### 4.2. Documentation (`AGENTS.md`)
*   [ ] **Update:** "Style" directive in Section 1 to reference new fonts and "Industrial/Spec-Sheet" aesthetic.
*   [ ] **Update:** "Design System" references in Section 8.

## 5. Out of Scope
*   Refactoring existing layout components (unless broken by font changes).
*   Dark mode implementation (this PBI focuses on the "Paper" light mode first).

## 6. Acceptance Criteria
*   [ ] Fonts (Archivo, B612 Mono) load correctly from Google Fonts.
*   [ ] Headings use the "wide" variation (`wdth` 110).
*   [ ] Background is `#f4f4f0`, text is `#1a1a1a`.
*   [ ] Code blocks use B612 Mono.
*   [ ] No visual regressions in layout due to font size changes.

## 7. Quality Gates
*   [ ] `pnpm build` succeeds.
*   [ ] Visual inspection of Home, Concepts, and Patterns pages.

## 8. Definition of Done
1. [ ] `src/styles/global.css` updated.
2. [ ] `AGENTS.md` updated.
3. [ ] Changes verified in local preview.
