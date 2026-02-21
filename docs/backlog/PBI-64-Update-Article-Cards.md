# PBI-64: Update Article Cards Visual Hierarchy

> Status: Ready

## Directive

Improve the context and visual hierarchy of article "cards" on the patterns, practices, and concepts index pages. This is a Priority 1, high-ROI update to immediately improve the user experience before building any complex search logic.

**Scope:**
- Modify the article card component(s) used on the index pages (Patterns, Practices, Concepts).
- Update the relevant design system styling (e.g., in `src/app.css` or component styles).
- Update `src/pages/resources/design-system.astro` to showcase the updated design.
- Add/update tests in `tests/` to verify visual hierarchy and content.

## Dependencies
- Blocked by: None
- Must merge before: None

## Context

Currently, a user has to guess what a pattern does based solely on its title. To solve this fundamental problem, we need to balance the development effort with the immediate impact on the user's experience.

This requires zero backend changes or complex JavaScript logic—just layout adjustments and writing a bit of copy—but it instantly transforms the page from a vague index into a readable library.

## Changes Required

**1. Add a 1–2 Sentence Summary (The "Problem Statement")**
This is the single most critical change. 
- Underneath the title (e.g., "Ralph Loop"), explain what the item actually does. 
- Users shouldn't have to click into an article just to figure out if it's relevant to their current architecture problem.

**2. Deprioritize the Date & Enhance Badges**
- **Date:** Use CSS to push the dates to the background by making the text smaller and lighter.
- **Badges:** Ensure the "Live" or "Experimental" statuses stand out as colored badges.

**3. Design System Alignment**
- Ensure all styling changes use the existing design system tokens (colors, spacing, typography).
- Update the relevant Svelte components (e.g., `ArticleCard.svelte` or the respective index page iterators) rather than inline styles.
- Update `src/pages/resources/design-system.astro` to include the newest iteration of the article card so it is documented correctly.

**4. Testing**
- Add or update Component tests (if applicable) to verify the summary and badges render correctly based on props.
- Add or update E2E tests (Playwright) to ensure the visual hierarchy on the index pages is maintained and accessible.

## Verification
- [ ] Article cards on all index pages display a 1-2 sentence summary.
- [ ] Dates on the article cards are visually deprioritized (smaller, lighter text).
- [ ] Status badges ("Live", "Experimental") are prominent and colored.
- [ ] Styling changes adhere strictly to the design system (no inconsistent inline styles or ad-hoc classes).
- [ ] `src/pages/resources/design-system.astro` successfully reflects the updated article card.
- [ ] E2E/Component tests successfully pass and specifically cover the presence of descriptions and badges.
