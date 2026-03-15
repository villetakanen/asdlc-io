# Avionics Design System

## Blueprint

### Context
The Avionics Design System ensures that the ASDLC knowledge base retains a consistent, "Industrial" aesthetic that scales for both human readers and AI agents. It relies on fundamental tokens and unstyled semantic HTML enhanced by global CSS variables rather than utility classes.

### Architecture
- **Design Tokens:** Located in `src/styles/ds/tokens.css`
- **Global Styles:** Located in `src/styles/global.css`
- **Routing/Structure:** [Isolated Design System Views](./isolated-views/spec.md)
- **Live Documentation:** `src/pages/resources/design-system.astro` (Index hub)

### Components
- **[SpecLineItem](./spec-line-item/spec.md)** - Dense index directory list item.
- *(Other components to be documented here as specs are created)*

## Contract

### Definition of Done
- [ ] Components must adhere to the design tokens. No hardcoded colors or sizing values.
- [ ] Components must be documented in `src/pages/resources/design-system.astro`.
- [ ] Components must pass `pnpm check` and `pnpm lint`.
