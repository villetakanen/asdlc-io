# PBI-0009: "Avionics" Industrial Design System

**Status**: Ready for Dev
**Priority**: High
**Epic**: Brand Identity & UI Overhaul
**Tags**: UI/UX, CSS, Design System, Branding

## 1. User Story
As a reader of the ASDLC.io documentation,
I want a visual interface that evokes "high-precision engineering" (reminiscent of Braun, Kodak, or Aerospace manuals),
So that the content feels authoritative, timeless, and distinct from generic "startup" documentation.

## 2. Context & Design Direction
The previous design (Inter/JetBrains Mono, Pure White) was functional but generic. We are pivoting to an "Industrial Specification" aesthetic.
**The Vibe**: Heavy industry, cockpit instrumentation, printed technical manuals.
**The Metaphor**: The website is not a "blog"; it is a Flight Manual for Agentic AI.

## 3. Technical Specifications

### A. Typography (The "Avionics" Set)
-   **Primary Font (Headers/Body)**: Archivo (Google Fonts)
    -   Settings: Variable width axis (`wdth`) set to `110` for headers.
-   **Monospace Font (Code/UI)**: B612 Mono (Google Fonts)
    -   Context: Used for code blocks, metadata, and data tables.
-   **Import URL**:
    ```css
    @import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,100..900&family=B612+Mono:ital,wght@0,400;0,700;1,400&display=swap');
    ```

### B. Color Palette ("International Safety")
| Role | Variable | Hex Code | Description |
| :--- | :--- | :--- | :--- |
| Paper | `--c-bg-page` | `#F4F4F0` | Warm, off-white concrete/paper. |
| Surface | `--c-bg-surface` | `#EBEBE6` | Slightly darker, for cards or headers. |
| Ink | `--c-text-primary` | `#111111` | Soft black, like high-quality toner. |
| Brand | `--c-brand` | `#F04E30` | Safety Orange. High visibility. |
| Success | `--c-success` | `#00703C` | DIN Standard Green. |
| Warning | `--c-warning` | `#946800` | Industrial Amber. |
| Error | `--c-error` | `#CC0000` | Switch Red. |

### C. Layout & Component Changes
1.  **The "Safety Strip"**: Body/main container must feature a prominent top border (6px - 8px) in Safety Orange (`--c-brand`).
2.  **Metadata Grid (The "Spec Block")**: Replace bullet lists for metadata with a Grid Layout. 1px solid borders (`#D1D1C7`). Keys/Values in B612 Mono.
3.  **Industrial Tables**: Uppercase headers, heavy bottom border (2px), monospace cells, rigid grid lines.

## 4. Acceptance Criteria
- [ ] Typography Check: All headers (h1-h3) render in Archivo with `font-variation-settings: "wdth" 110`.
- [ ] Typography Check: All code blocks, tables, and metadata render in B612 Mono.
- [ ] Contrast Check: Background is `#F4F4F0`. Text is `#111111`.
- [ ] Visual Regression: The "Safety Orange" top border is visible on all pages.
- [ ] Component: "Deprecated" status badges mimic an ink stamp.
- [ ] Responsiveness: The Metadata Grid collapses gracefully to a single column on mobile.
