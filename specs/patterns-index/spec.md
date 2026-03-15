# Feature: Patterns Index Page

## Blueprint

### Context
The Patterns page (`/patterns`) provides a structured entry point into the ASDLC pattern library. It balances UX onboarding (guiding newcomers to foundational patterns), SEO (semantic heading hierarchy), and GEO (deterministic structure for AI parsing).

### Architecture
- **Route:** `src/pages/patterns/index.astro`
- **Data Source:** Content Collections (`src/content/patterns`) via `getCollection("patterns")`
- **Layout:** `BaseLayout` with `<article class="prose">` wrapper
- **Components:**
  - `SpecCard` — Featured cards for the 3 foundational patterns in a `.spec-grid`
  - `SpecListItem` — Dense manifest rows for Live and Experimental/Draft patterns in `<ul class="spec-list">`

### Content Structure

#### 1. Header & Introduction
- **H1:** "Architectural Patterns"
- **Intro paragraph:** Defines what patterns are and their role in the agentic factory.

#### 2. Start Here (Foundational Patterns)
- **H2:** "Start Here"
- Three curated patterns displayed as `SpecCard` components: `agentic-double-diamond`, `adversarial-code-review`, `the-spec`.
- These are hardcoded slugs — the curation is intentional, not dynamic.

#### 3. Live Patterns
- **H2:** "Live Patterns"
- All patterns with status `Live` (excluding foundational), sorted alphabetically.
- Rendered as `SpecListItem` rows inside `<ul class="spec-list">`.
- Section omitted entirely if no live patterns exist beyond the foundational set.

#### 4. Experimental & Draft
- **H2:** "Experimental & Draft"
- All patterns with status `Experimental`, `Draft`, or `Proposed`, sorted alphabetically.
- Same `SpecListItem` rendering.
- Section omitted if empty.

#### 5. Next Steps
- **H2:** "Next Steps"
- Links to `/practices`, `/getting-started`, `/resources`.

### Anti-Patterns
- **Flat unsorted lists:** Do not render all patterns in a single undifferentiated list. Status grouping is required for scannability.
- **SpecCard for everything:** Do not use SpecCard for the directory sections. Cards consume too much vertical space at scale; SpecListItem is the correct component for dense listings.

## Contract

### Definition of Done
- [x] `src/pages/patterns/index.astro` uses the defined structural layout.
- [x] Foundational section uses `SpecCard` in a `.spec-grid`.
- [x] Directory sections filter patterns by status and use `SpecListItem` in `<ul class="spec-list">`.
- [x] Empty status groups are omitted from the DOM.
- [x] `pnpm check` and `pnpm lint` pass with 0 errors.

### Regression Guardrails
- No inline styles or Tailwind classes. All layout uses design system tokens or scoped CSS.
- Categorization logic must handle absence of patterns in any status without breaking.
- Foundational pattern slugs must be maintained as a curated list, not derived from status.
- The page must use `BaseLayout` directly, not the generic `CollectionIndex` layout.

### Scenarios

```gherkin
Feature: Patterns Index Page

  Scenario: New pattern published as Draft
    Given a new pattern is added to src/content/patterns with status "Draft"
    When the patterns index page is built
    Then the pattern appears under the "Experimental & Draft" section
    And it does not appear under "Live Patterns" or "Start Here"

  Scenario: Pattern promoted to Live
    Given an existing pattern has its status changed to "Live"
    When the patterns index page is built
    Then the pattern appears under "Live Patterns"
    And it is removed from "Experimental & Draft"

  Scenario: Empty status group is hidden
    Given no patterns have status "Experimental" or "Draft"
    When the patterns index page is built
    Then the "Experimental & Draft" section is not in the DOM

  Scenario: LLM reads the page structure
    Given an LLM requests /patterns
    When it reads the DOM
    Then semantic H1 > H2 hierarchy clearly signals foundational vs directory sections
    And foundational patterns are identifiable as curated recommendations
```
