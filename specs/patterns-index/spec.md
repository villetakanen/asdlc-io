# Feature: Patterns Index Page

## Blueprint

### Context
The Patterns page (`/patterns`) currently presents a flat list of patterns sorted by status and date via the `SpecCardList` component. While functional, it lacks a conceptual onboarding structure, making it difficult for newcomers to know where to begin and sub-optimal for Generative Engine Optimization (GEO).

This spec defines a structured layout that balances User Experience (UX), Search Engine Optimization (SEO), and GEO. By categorizing patterns into "Foundational", "Live", and "Experimental & Draft" and providing clear Calls To Action (CTAs), we enhance both human readability and deterministic AI parsing.

### Architecture
- **Route:** `src/pages/patterns/index.astro`
- **Data Source:** Content Collections (`src/content/patterns`)
- **Metadata Source:** `src/components/definitions/patterns.md` (Currently imported as `<Definition />`, should be integrated into or replaced by the new intro structure).

### Content Structure

#### 1. Header & Introduction
- **H1:** `Patterns: The Blueprints of the Agentic Factory`
- **Intro Text:** Patterns are reusable architectural designs and structural solutions to common problems. If agentic architecture is the conveyor belt for knowledge work, patterns are the factory blueprints. They describe the topology and relationships between agents, systems, and human operators. A software factory cannot run on ambiguous "vibes"—it requires these deterministic, established patterns to ensure agents fulfill contracts reliably and scale autonomy safely.

#### 2. Start Here: Foundational Patterns
A curated list for newcomers prioritizing the core architectural designs. We should explicitly highlight:
- **Agentic Double Diamond**
- **Adversarial Code Review**
- **Specs**

#### 3. The Pattern Directory
A categorized list of patterns fetched dynamically from the collections. Because this list can grow long, these should be presented as dense row items (e.g., a new `SpecLineItem` component) rather than large grid cards.
- **H3:** `Live Patterns` (Ready for production implementation)
- **H3:** `Experimental & Draft Patterns` (Currently in testing or early formulation)

#### 4. Next Steps
Direct links (CTAs) to connect workflows and further actions:
- **Practices:** Link to `/practices` to see patterns in action.
- **MCP Server Endpoint:** Link to `/mcp` or relevant documentation to give agents context.
- **Getting Started Guide:** Link to `/getting-started` or the root page for deployment.

---

## Contract

### Definition of Done
- [ ] `src/pages/patterns/index.astro` is refactored to use the defined structural layout.
- [ ] The "Foundational" section relies heavily on curated layout grids or featured lists.
- [ ] The general directory filters patterns correctly by status (`Live` vs `Draft/Experimental`).
- [ ] Page maintains strict type safety, utilizing the existing standard components (e.g., `SpecCardList`, or specialized `Card` layout if needed).
- [ ] `pnpm check` and `pnpm lint` pass with 0 errors.

### Regression Guardrails
- **DO NOT** introduce arbitrary inline styles or Tailwind classes. All layout must use ASDLC design system global CSS tokens or scoped CSS matching the brand aesthetic.
- The categorization logic must be robust enough to handle the absence of patterns in a specific state without breaking the layout.

---

## Scenarios

**Scenario: A new pattern is published as Draft**
- Given: A new pattern is added to `src/content/patterns`.
- When: The pattern's status is "Draft".
- Then: It automatically appears under the "Experimental & Draft Patterns" section on the index page.

**Scenario: Reading the page via an LLM tool**
- Given: An LLM requests `/patterns` to provide an answer to a user.
- When: It reads the DOM.
- Then: The HTML semantic tags (`H1`, `H2`, `H3`) and declarative structure clearly signal what the foundational patterns are versus experimental ideas, maximizing GEO performance.
