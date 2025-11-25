# Project State Summary
**Date:** 2025-11-24
**Audience:** Content Strategy & Design Teams
**Source of Truth:** Repository `asdlc-io`

## 1. Executive Summary
The project is currently in a **Post-Phase 2** state, having successfully established the core infrastructure, content pipelines, and initial design system. We are transitioning into Phase 3 (Semantic SEO & Optimization). The repository is the single source of truth for all documentation and code.

**Current Status:** Active Development / Post-UAT (Phase 2)

## 2. Content Strategy & Architecture
The content layer is built on **Astro Content Collections** with strict schema validation. This ensures consistency across all documentation.

### 2.1. Content Models
We currently support two primary content types. All content is written in Markdown/MDX.

#### **Concepts** (`src/content/concepts/*.md`)
Used for defining core terminology and abstract ideas.
*   **Required Fields:**
    *   `title`: (String) Name of the concept.
    *   `definition`: (String) Max 200 characters. Concise summary for quick scanning.
    *   `tags`: (Array of Strings) Taxonomy tags.
    *   `maturity`: (Enum) `Theoretical` | `Experimental` | `Standard` | `Deprecated`.
    *   `lastUpdated`: (Date)
*   **Optional Fields:**
    *   `related_concepts`: (Array of Strings) Links to other concepts.

#### **Patterns** (`src/content/patterns/*.md`)
Used for documenting reusable solutions and design patterns.
*   **Required Fields:**
    *   `title`: (String) Name of the pattern.
    *   `complexity`: (Enum) `Low` | `Medium` | `High`.
    *   `status`: (Enum) `Draft` | `Review` | `Approved` | `Experimental`.
    *   `publishDate`: (Date)
*   **Optional Fields:**
    *   `diagram_source`: (String) Path to diagram source file.

### 2.2. Content Directives
*   **Schema First:** All content must adhere strictly to the Zod schemas defined in `src/content/config.ts`.
*   **Explicit Metadata:** Frontmatter is not optional; it drives the UI and navigation.

## 3. Design System & Brand Guidance
The project employs a **"Spec-Sheet" / Technical Manual** aesthetic. It is a minimalist, high-contrast design intended to convey precision and authority.

### 3.1. Visual Language
*   **Vibe:** Technical, Brutalist, Clean, "Blueprint".
*   **Typography:**
    *   **Headings/Body:** `Inter` (System Sans) - Clean, readable.
    *   **Code/Technical Data:** `JetBrains Mono` - Monospace, precise.
*   **Color Palette:**
    *   **Background:** White (`#ffffff`)
    *   **Foreground:** Black (`#050505`)
    *   **Dimmed Text:** Grey (`#666666`)
    *   **Borders:** Black (`#000000`) - Used heavily for "border-box" layouts.
    *   **Accent:** Pure Blue (`#0000ff`) - Used sparingly for links and active states.

### 3.2. Technical Implementation
*   **CSS:** Pure Vanilla CSS. **No Tailwind.**
*   **Layout:** Grid-based (`--s-grid: 24px`).
*   **Global Styles:** Defined in `src/styles/global.css`.

## 4. Technical Context for Non-Developers
*   **Platform:** Astro 5+ (Static Site Generator).
*   **Performance:** High. The site compiles to static HTML/CSS.
*   **Directives:** We enforce strict quality gates. "Vibe coding" (guessing) is prohibited. All changes must be deliberate and schema-compliant.

## 5. Content State Assessment
The content repository is currently in a **Seed / Prototype** state. The pipelines are fully functional, but the library is minimal.

### 5.1. Current Inventory
*   **Concepts:** 1 Item
    *   `Context Engineering` (Experimental): Fully defined with metadata and cross-references.
*   **Patterns:** 1 Item
    *   `Supervisor Agent Pattern` (Experimental): Detailed structure with problem/solution/implementation sections.

### 5.2. Content Quality
*   **Structure:** High. Both existing items strictly follow the schema.
*   **Depth:** High. The seed content provides a strong template for future additions.
*   **Completeness:** Low. Significant effort is needed to populate the library with core domain concepts.

## 6. Design System State: "The Spec-Sheet"
The design system is implemented as a **minimalist, functional technical manual**. It prioritizes readability and structure over decoration.

### 6.1. Core Principles (Implemented)
*   **High Contrast:** Black on White default. Hover states often invert colors (White on Black) for dramatic, mechanical feedback.
*   **Visible Structure:** Borders are used explicitly to define content areas (`.border-box`), mimicking technical blueprints.
*   **Typography as UI:**
    *   `Inter` handles the narrative.
    *   `JetBrains Mono` is used for all metadata, tags, and technical specs, reinforcing the "engineering-first" vibe.

### 6.2. Component Status
*   **Global Styles:** (`src/styles/global.css`) - **Complete**. Defines all CSS variables for colors, spacing, and typography.
*   **UI Components:** **In Progress**.
    *   `SpecCard.astro`: **Production Ready**. Demonstrates the core interaction pattern (border-box layout, mono-spaced meta, inverted hover state).
    *   *Gap Analysis:* Missing standard UI elements (Buttons, Form Inputs, Navigation Bars, Footers).

## 7. Next Steps
*   **Content Team:**
    *   **Immediate:** Populate `concepts` with at least 10 core terms to test the taxonomy.
    *   **Strategic:** Audit existing content against the `maturity` and `status` fields.
*   **Design Team:**
    *   **Immediate:** Design and implement a "Back to Home" navigation component using the Spec-Sheet aesthetic.
    *   **Strategic:** Review the "Spec-Sheet" implementation in `global.css` and propose refinements for the upcoming Phase 3 UI components.
