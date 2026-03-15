# Avionics Design System

## Blueprint

### Context
The Avionics Design System ensures that the ASDLC knowledge base retains a consistent, "Industrial" aesthetic that scales for both human readers and AI agents. It relies on fundamental tokens and unstyled semantic HTML enhanced by global CSS variables rather than utility classes.

### Architecture
- **Design Tokens:** Located in `src/styles/ds/tokens.css`
- **Global Styles:** Located in `src/styles/global.css`
- **Routing/Structure:** [Isolated Design System Views](./isolated-views/spec.md)
- **Live Documentation:** `src/pages/resources/design-system/[...section].astro` (dynamic route)

### Page Structure

The design system page uses a catch-all dynamic route (`[...section].astro`) with three distinct zones:

1. **Design Philosophy Section** (`<section class="prose content">`)
   - Visible only on the overview route (`/resources/design-system`, where `currentId` is undefined).
   - Contains the `<h1>` ("Avionics Design System"), an `<h2>` subtitle ("Design Philosophy"), and two introductory paragraphs describing the Timeless Industrial vision and Avionics aesthetic.
   - Hidden on all isolated section/component views to keep context focused.

2. **Navigation Bar** (`<nav class="ds-nav">`)
   - Standalone element between the philosophy section and the content area.
   - Always visible on all routes (overview, section, and component views).
   - Styled with dashed borders top and bottom (`border-top/bottom: 1px dashed var(--c-border)`).
   - Links to Overview + all 8 sections. Active state highlighted with `--c-brand` color.

3. **Content Area** (`<div class="prose content-prose">`)
   - On overview: renders all 8 sections sequentially with `<hr>` separators.
   - On section routes (e.g., `/resources/design-system/colors`): renders only that section's component.
   - On component routes (e.g., `/resources/design-system/components/border-box`): renders the Components section filtered to the specific component.

### Components
- **[SpecLineItem](./spec-line-item/spec.md)** - Dense index directory list item.
- *(Other components to be documented here as specs are created)*

### Anti-Patterns
- **Spec-sheet styling on non-article pages:** The design system page is a resource, not a content collection article. Do not use `border-box` or `spec-header` classes on its outer structure — those are reserved for the `SpecHeader` component on article detail pages.
- **Client-Side Filtering:** Do not render the entire page and hide sections with JS/CSS. Each route must render only its content in the DOM. See [Isolated Views spec](./isolated-views/spec.md).

## Contract

### Definition of Done
- [ ] Components must adhere to the design tokens. No hardcoded colors or sizing values.
- [ ] Components must be documented in the design system at `/resources/design-system/components/{name}`.
- [ ] Components must pass `pnpm check` and `pnpm lint`.
- [ ] The overview page shows the Design Philosophy section; isolated views do not.
- [ ] The navigation bar is visible on all routes with correct active state.
