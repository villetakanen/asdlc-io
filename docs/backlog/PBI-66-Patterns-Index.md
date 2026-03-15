# PBI-66: Refactor Patterns Index Page

## 1. Directive
Refactor the Patterns Index page (`src/pages/patterns/index.astro`) to implement a structured, narrative-driven layout as defined in `specs/patterns-index/spec.md`. The goal is to improve UX, SEO, and Generative Engine Optimization (GEO) by grouping patterns and providing clear CTAs.

## 2. Scope
- Update `src/pages/patterns/index.astro` to add new structural sections (Welcome/Intro, Foundational, Directory, CTAs).
- Integrate the curated list of foundational patterns: `agentic-double-diamond`, `adversarial-code-review`, and `the-spec` (using `SpecCard` for high visibility).
- Group the remaining patterns dynamically by their frontmatter `status` (e.g. `Live` vs `Experimental`, `Draft`).
- Design and implement a new `SpecListItem.astro` component for a dense, scannable list view for the main directory.

## 3. Dependencies
- Spec: `specs/patterns-index/spec.md`
- Code: Depends on `SpecListItem` component from PBI-68.

## 4. Changes Required

### A. Adjust `src/pages/patterns/index.astro` Layout
- Redefine the page structure to drop the generic `CollectionIndex` description in favor of a richer Markdown-style format or structured HTML that follows the spec.
- **Section 1 (Intro):** Implement the "Blueprints of the Agentic Factory" paragraph. Consider if `components/definitions/patterns.md` should be subsumed by this or integrated.
- **Section 2 (Start Here):** Filter the pattern collection for the 3 foundational patterns and display them prominently using `SpecCard` inside a `.spec-grid`.
- **Section 3 (Directory):** Split the remaining patterns into two lists using a new dense `SpecListItem` component.
  - Live Patterns (Status: `Live`)
  - Experimental & Draft (Status: `Experimental` | `Draft`)
- **Section 4 (CTAs):** Add links at the bottom pointing to `/practices`, `/mcp`, and the Getting Started guide.

### B. Styling and Components
- Use `src/components/SpecListItem.astro` (built in PBI-68) for the directory lists.
- Maintain consistency with the design language observed in `src/styles/global.css`. 

## 5. Verification
- `pnpm check` and `pnpm lint` must pass.
- Verify visually by running `pnpm dev` and confirming the groups appear correctly and no content is duplicated between the foundational and directory lists.
- Check semantic HTML structure ensuring standard hierarchy (H1 -> H2 -> H3).

## 6. Notes
- The goal is to provide deterministic reading structures for LLMs (GEO) while delivering high-quality visual onboarding for human practitioners.

## 7. Blockers
Blocked by: PBI-68. Do not execute this PBI until `SpecListItem.astro` is present in the design system.
