# Spec: Structured Article References

## Context

External references in ASDLC articles (concepts, patterns, practices) originally appeared inline using Wikipedia-style markdown links. This created several problems: no semantic structure (plain links with no metadata), inline noise breaking reading flow, inconsistent formatting across articles, and no ability to query or aggregate references.

The structured references system stores citations as typed YAML frontmatter, rendered by a dedicated component at article end. The format is inspired by APA citation style but includes explanatory annotations suited to a knowledge base. This separates external attribution (`references`) from internal cross-linking (`relatedIds`), each with distinct rendering locations and purposes.

## Architecture

- **Schema** — `referenceSchema` in `src/content/config.ts` defines a discriminated union over seven reference types (`website`, `paper`, `book`, `podcast`, `video`, `repository`, `standard`). All types require `title`, `type`, and `annotation`. Type-specific required fields vary (e.g., `accessed` is required for `website`).
- **Frontmatter Field** — `references: z.array(referenceSchema).optional().default([])` on all content collection schemas.
- **ArticleReferences** (`src/components/ArticleReferences.astro`) — Renders the references array as an ordered list of APA-inspired citations with annotations. Uses semantic HTML (`<section>`, `<cite>`, `<ol>`).
- **Layout Integration** — Article layouts render `<ArticleReferences>` after body content, before footer navigation. The markdown `## References` heading is no longer used in article bodies.
- **Schema.org** — Article structured data includes `citation` entries derived from the `references` array.
- **MCP** — The `get_article` tool includes structured references in its response payload.
- **Design System Docs** — Isolated view at `/resources/design-system/components/article-references` via `src/components/ds-docs/docs/ArticleReferencesDocs.astro`.
- **Styling** — Global styles in `src/styles/ds/components/article-references.css`. All values derive from Avionics Design System tokens.

### Reference Types

| Type | Required Fields | Optional Fields | Use Case |
|:-----|:----------------|:----------------|:---------|
| `website` | `title`, `url`, `accessed` | `author`, `published`, `publisher` | Blog posts, documentation, articles |
| `paper` | `title`, `url` | `authors`, `published`, `doi` | Academic papers, arXiv preprints |
| `book` | `title`, `author` | `isbn`, `published`, `publisher` | Books, textbooks |
| `podcast` | `title`, `url` | `author`, `publisher`, `published` | Podcast episodes, interviews |
| `video` | `title`, `url` | `author`, `publisher`, `published`, `duration` | YouTube videos, conferences |
| `repository` | `title`, `url` | `author`, `stars`, `language` | GitHub repos, code references |
| `standard` | `title` | `url`, `organization`, `version` | W3C, ISO, RFC standards |

### Author Format Convention

The schema allows both `author` (string) and `authors` (array). Single-author works use `author` for convenience; multi-author works (academic papers) use `authors`. The component normalizes to an array during rendering.

### Relationship to `relatedIds`

| Field | Purpose | Rendered By | Location |
|:------|:--------|:------------|:---------|
| `relatedIds` | Internal ASDLC cross-references | `SpecHeader.astro` | Article header |
| `references` | External sources, citations | `ArticleReferences.astro` | Article end |

A link appears in either `relatedIds` or `references`, never both.

## Anti-Patterns

- **Inline-Only Citations** — Embedding external source links in article body without structured frontmatter, losing metadata and queryability.
- **Untyped References** — Storing references as plain URL strings without type discrimination, preventing format-appropriate rendering.
- **Duplicate Attribution** — Listing the same resource in both `relatedIds` and `references`, conflating internal cross-links with external citations.
- **Missing Annotations** — Adding references without explanatory context, making the reference list opaque to readers and LLMs.
- **Body-Rendered References** — Using a markdown `## References` section instead of the component, bypassing structured data and consistent styling.

## Contract

### Definition of Done

- The `referenceSchema` validates all seven reference types with appropriate required/optional field constraints.
- All content collection schemas (`concepts`, `patterns`, `practices`) include the `references` field.
- `ArticleReferences` renders APA-inspired citations with annotations using semantic HTML.
- Article layouts render the component after body content; no markdown `## References` sections remain in article bodies.
- The MCP `get_article` tool includes structured references in its response.
- Schema.org structured data includes `citation` entries derived from references.
- The component degrades gracefully when optional fields are missing.

### Regression Guardrails

- All color and spacing values in reference styling must use CSS custom properties, never literals.
- The `annotation` field must remain required on all reference types — it is the primary value-add over plain links.
- The `accessed` date must remain required for `website` type references (APA compliance).
- The `references` field must remain optional with an empty-array default — articles without references must not break.
- External links in references must include `rel="external noopener"`.

### Scenarios

**Scenario: Render structured references**
- Given an article with a `references` array in frontmatter
- When the article page renders
- Then references appear as a numbered list below article content
- And each reference displays citation metadata and annotation

**Scenario: Website reference formatting**
- Given a reference with `type: "website"`, author, date, and URL
- When the component renders
- Then output follows APA format: Author (Year). *Title*. Accessed Date.

**Scenario: Missing optional fields**
- Given a reference with only required fields for its type
- When the component renders
- Then missing fields are gracefully omitted with no broken formatting

**Scenario: MCP returns references**
- Given an article with structured references
- When an LLM calls `get_article` via MCP
- Then the response includes the typed references array

**Scenario: Empty references array**
- Given an article with no references defined
- When the article page renders
- Then no references section appears in the output
