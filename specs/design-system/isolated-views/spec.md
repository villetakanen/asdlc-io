# Feature: Isolated Design System Views

## Blueprint

### Context
The current Avionics Design System documentation lives entirely on a single, monolithic page (`src/pages/resources/design-system.astro`). As the design system grows with new components (like `SpecLineItem`, `SpecCard`, etc.), the page becomes overwhelming for both human browsing and agent context ingestion.

By isolating sections via dynamic routing (`[section].astro`), we allow agents and users to deep-link directly to the specific tokens, layouts, or components they need, adhering to the principles of Context Engineering (providing exactly the necessary context without overwhelming the window).

### Architecture
- **Routing:** Implement a new dynamic route, e.g., `src/pages/resources/design-system/[section].astro` (or moved to `src/pages/design-system/[section].astro` if replacing the monolithic page entirely).
- **Data Source:** To support `getStaticPaths()`, the design system sections must either be:
  1. Extracted into individual MD/MDX files under a `content/design-system/` collection.
  2. Maintained as discrete Astro components (e.g., `src/components/ds-docs/Typography.astro`) mapped to strict routes in a static array.
- **Layout:** The isolated view should share the same `BaseLayout` or a specialized DS layout containing a sidebar navigation menu to jump between other isolated sections.

### Anti-Patterns
- **Client-Side Filtering:** Do not render the entire monolithic page and rely on JavaScript or CSS `display: none` to hide sections. This breaks GEO (Generative Engine Optimization) because agents will still scrape the entire DOM tree, defeating the purpose of context isolation.
- **Copy Pasting Layouts:** Do not duplicate the wrapper code for every section. Utilize standard Astro layouts with slots for the dynamic content.

## Contract

### Definition of Done
- [ ] A dynamic route `.../design-system/[section].astro` exists.
- [ ] Accessing a specific section URL (e.g., `/design-system/typography`) returns ONLY the typography documentation in the DOM.
- [ ] A navigation mechanism exists to move between sections.
- [ ] The monolithic overview page is either refactored to act strictly as an index hub referencing the sections, or represents the default "Introduction" view.

### Regression Guardrails
- Build execution must pre-render all valid `[section]` paths (no SSR).
- Invalid sections must return a 404.
