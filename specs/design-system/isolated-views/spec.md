# Feature: Isolated Design System Views

## Blueprint

### Context
The Avionics Design System documentation uses dynamic routing to allow agents and users to deep-link directly to the specific tokens, layouts, or components they need. This adheres to Context Engineering principles — providing exactly the necessary context without overwhelming the window.

### Architecture
- **Routing:** Catch-all dynamic route at `src/pages/resources/design-system/[...section].astro`.
- **Data Source:** Design system sections are discrete Astro components in `src/components/ds-docs/` mapped to routes via a static array in `getStaticPaths()`.
- **Layout:** Uses `BaseLayout` with a standalone `<nav>` element for section navigation.

### Route Structure

| Route | `currentId` | `subId` | Renders |
|---|---|---|---|
| `/resources/design-system` | `undefined` | `undefined` | Philosophy intro + nav + all 8 sections |
| `/resources/design-system/colors` | `"colors"` | `undefined` | Nav + ColorPalette only |
| `/resources/design-system/components` | `"components"` | `undefined` | Nav + all component docs |
| `/resources/design-system/components/border-box` | `"components"` | `"border-box"` | Nav + BorderBox docs only |

### Sections (8 total)
1. `colors` → `ColorPalette.astro`
2. `typography` → `Typography.astro`
3. `layout` → `LayoutSystem.astro`
4. `components` → `Components.astro` (with sub-routes for individual components)
5. `accessibility` → `Accessibility.astro`
6. `best-practices` → `BestPractices.astro`
7. `diagrams` → `Diagrams.astro`
8. `file-references` → `FileReferences.astro`

### Component Sub-Routes (7 total)
`border-box`, `status-badge`, `spec-card`, `spec-line-item`, `spec-header`, `warning-banner`, `article-references`

Each component doc lives in `src/components/ds-docs/docs/{ComponentName}Docs.astro`.

### Anti-Patterns
- **Client-Side Filtering:** Do not render the entire monolithic page and rely on JavaScript or CSS `display: none` to hide sections. This breaks GEO because agents will still scrape the entire DOM tree, defeating the purpose of context isolation.
- **Copy Pasting Layouts:** Do not duplicate the wrapper code for every section. The single `[...section].astro` route handles all paths.

## Contract

### Definition of Done
- [x] A dynamic route `.../design-system/[...section].astro` exists.
- [x] Accessing a specific section URL (e.g., `/resources/design-system/typography`) returns ONLY the typography documentation in the DOM.
- [x] A navigation mechanism exists to move between sections.
- [x] The overview page acts as an index hub with the Design Philosophy intro, showing all sections.
- [x] Individual component views are accessible via `/resources/design-system/components/{name}`.

### Regression Guardrails
- Build execution must pre-render all valid `[section]` paths (no SSR).
- Invalid sections must return a 404.
- The `<h1>` and philosophy paragraphs must NOT appear on isolated section/component views.
