# PBI-0012: Printable Manuscript

**Status**: Draft
**Priority**: Medium
**Epic**: Content Delivery
**Tags**: Feature, Print, LLM Context

## 1. User Story
As a Product Manager or LLM User,
I want a single, printable page that aggregates all documentation articles into a structured "book" format,
So that I can print the entire manuscript for offline reading or feed it into an LLM as a single context window.

## 2. Requirements

### A. Structure ("The Book")
-   **Sections**: Top-level navigation items (Concepts, Patterns) act as "Book Sections".
-   **Chapters**: Individual articles within each section act as "Chapters".
-   **Order**:
    1.  Cover Page (Title, Version, Date)
    2.  Table of Contents (Auto-generated)
    3.  Section: Concepts
    4.  Section: Patterns

### B. Design System Integration
-   Must use the "Avionics" Design System (PBI-0009).
-   **Print Styles**:
    -   Hide navigation (Header/Footer).
    -   Ensure page breaks occur logically (e.g., `break-before: page` for new chapters).
    -   Remove interactive elements that don't make sense in print (e.g., "Copy Code" buttons, if any).
    -   Ensure high contrast for text.

### C. Technical Implementation
-   **Route**: `/manuscript`
-   **Data Fetching**:
    -   Fetch all content collections (`concepts`, `patterns`).
    -   Sort them logically (e.g., alphabetical or by manual order if defined).
-   **Rendering**:
    -   Render full content of each markdown file.
    -   Preserve formatting (tables, code blocks, blockquotes).

## 3. Acceptance Criteria
-   [ ] Route `/manuscript` exists and renders all content.
-   [ ] Content is grouped by collection (Concepts, Patterns).
-   [ ] "Print" view (Ctrl+P) hides the site header/footer.
-   [ ] Page breaks are applied correctly between chapters.
-   [ ] The page uses the "Avionics" design system (fonts, colors).
