# Feature: Homepage

## Blueprint

### Context

The homepage (`src/pages/index.astro`) is the canonical entry point for asdlc.io. It serves three audiences:

1. **Human visitors** — Engineers, team leads, and architects evaluating the ASDLC framework
2. **AI agents** — Crawlers and agents discovering the MCP endpoint or downloadable skill
3. **Search engines** — Google, Bing, and generative engines indexing the site's identity

The page must communicate what ASDLC is, what you can do with it, and how to connect — within the first viewport.

### Architecture

**File:** `src/pages/index.astro`

**Content-Component Pattern (AL-14):**
The homepage uses a **content-component** architecture: each prose section is extracted into a standalone `.md` file under `src/components/definitions/`, then imported as an Astro `Content` component. This separates content authoring from page structure.

| # | Section | Content Component | Purpose |
|---|---------|-------------------|---------|
| 1 | H1 + manifesto intro | `homepage-manifesto-intro.md` | Identify the site, frame the philosophy |
| 2 | Connect Your Agent (full-width band) | `access-knowledge-base.md` (existing) | MCP endpoint + skill download |
| 3 | Two Narratives | `homepage-two-narratives.md` | Differentiate from copilots/replacement |
| 4 | Agentic Factory | `homepage-agentic-factory.md` | Core framework (3 pillars) |
| 5 | Knowledge Base | `homepage-knowledge-base.md` | Navigate to collections |
| 6 | Quick Start | `homepage-quick-start.md` | Contributor onboarding |

**Target `index.astro` structure** — after extraction, the page contains zero inline prose. Only structural markup, component imports, and SEO metadata:

```
BaseLayout (title, description, image)
+-- StructuredData type="Organization"
+-- StructuredData type="WebSite"
+-- article.prose
    +-- section -> <ManifestoIntro />
    +-- div.full.border-t.border-b.my-1.py-1
    |   +-- section.breakout -> <AccessKnowledgeBase />
    +-- section -> <TwoNarratives />
    +-- section -> <AgenticFactory />
    +-- section -> <KnowledgeBase />
    +-- section.border-box -> <QuickStart />
```

**Dependencies:**

| Import | Source | Role |
|--------|--------|------|
| `ManifestoIntro` | `../components/definitions/homepage-manifesto-intro.md` | H1 + opening manifesto |
| `AccessKnowledgeBase` | `../components/definitions/access-knowledge-base.md` | MCP endpoint + Skill download (shared component) |
| `TwoNarratives` | `../components/definitions/homepage-two-narratives.md` | Problem framing section |
| `AgenticFactory` | `../components/definitions/homepage-agentic-factory.md` | Solution + three pillars |
| `KnowledgeBase` | `../components/definitions/homepage-knowledge-base.md` | Collection navigation links |
| `QuickStart` | `../components/definitions/homepage-quick-start.md` | Contributor onboarding |
| `StructuredData` | `../components/StructuredData.astro` | Organization + WebSite JSON-LD |
| `BaseLayout` | `../layouts/BaseLayout.astro` | Shell: head, header, main, footer |

**SEO signals:**
- `<title>`: "ASDLC.io | The Agentic Software Development Life Cycle Framework"
- `<meta description>`: "The playbook for industrializing software engineering..."
- JSON-LD: Organization + WebSite (see `specs/homepage-structured-data/spec.md`)

**Styling:** Uses `.prose` wrapper (global), `.border-box` (design system class), grid utilities (`.full`, `.breakout`, `.border-t`, `.border-b`, `.my-1`, `.py-1`). No scoped CSS.

### Content Component Conventions

Each `.md` content component follows these rules:

- **No frontmatter required** — These are not content collection entries; they are imported via Astro's `Content` component pattern
- **Start with the appropriate heading level** — Must match the document outline position (e.g., manifesto starts with `<h1>`, sections under `<article>` start with `<h2>`)
- **No layout wrapping** — The parent `index.astro` provides all structural markup (`<section>`, class names, grid wrappers)
- **Plain markdown** — Avoid MDX features unless necessary; keep components simple for content editing
- **File naming:** `homepage-{section-name}.md` — kebab-case, prefixed with `homepage-` for discoverability

### Anti-Patterns

- **Do NOT mix inline HTML and content components.** After AL-14, all prose lives in `.md` files. The `index.astro` file contains only structural markup.
- **Do NOT move structured data into BaseLayout.** Organization/WebSite JSON-LD belongs on the homepage only (see `specs/homepage-structured-data/spec.md` guardrails).
- **Do NOT hardcode `https://asdlc.io`.** Derive from `Astro.site` for environment portability.
- **Do NOT add scoped CSS.** The homepage uses global `.prose` layout and design system classes. Per project rules, prefer global CSS.
- **Do NOT duplicate the AccessKnowledgeBase content inline.** It's a shared markdown component used by the homepage and potentially other pages.
- **Do NOT put version info on the homepage.** Version lives in the site footer (`specs/site-footer/spec.md`).
- **Do NOT add frontmatter to homepage content components.** They are structural fragments, not collection entries.

## Contract

### Definition of Done

- [x] Page renders at `/` with correct `<title>` and `<meta description>`
- [x] Organization and WebSite JSON-LD blocks present in `<head>`
- [x] H1 is descriptive — communicates what the site is
- [x] MCP endpoint and skill download appear in the first 2 sections (before manifesto content)
- [x] No version banner on homepage (version is in site footer)
- [x] Knowledge base navigation links to `/patterns`, `/practices`, `/concepts`
- [x] Quick Start section with contributor onboarding steps
- [x] **AL-14:** All inline HTML prose extracted into `.md` content components
- [x] **AL-14:** `index.astro` contains zero inline prose — only structural markup, imports, and SEO metadata
- [x] **AL-14:** All 5 new content components created under `src/components/definitions/`
- [x] **AL-14:** Content is identical to current inline HTML (no copy changes during extraction)
- [x] `pnpm check` passes with 0 errors
- [x] `pnpm build` succeeds

### Regression Guardrails

- The `StructuredData` component MUST NOT be modified from this page's spec — it has its own spec
- The `BaseLayout` MUST NOT be modified — homepage is a consumer, not an owner
- Organization `name` MUST be `"ASDLC.io"` (consistent with `og:site_name`)
- The MCP endpoint URL in `access-knowledge-base.md` MUST be `https://asdlc.io/mcp`
- The skill download link MUST point to `/asdlc-skill.zip`
- Content sections MUST NOT be removed without explicit approval — reorder or restructure, don't silently delete
- Extraction MUST be content-preserving — no copy edits, rewording, or section reordering during the refactor

### Scenarios

**Scenario: First-time visitor lands on homepage**
- Given: A visitor navigates to `https://asdlc.io`
- When: The page renders
- Then: The H1 tells them what this site is (a knowledge base for agentic development)
- And: They do not encounter a warning-colored banner

**Scenario: Agent-focused visitor finds MCP quickly**
- Given: A developer wants to connect their agent to ASDLC
- When: They land on the homepage
- Then: The MCP endpoint and connection instructions are visible within the first 3 sections — no need to scroll past the manifesto

**Scenario: Agent discovers MCP endpoint**
- Given: An AI agent or crawler visits the homepage
- When: The page is parsed
- Then: The MCP endpoint (`https://asdlc.io/mcp`) is discoverable in the page content

**Scenario: Search engine indexes the homepage**
- Given: A search engine crawls `/`
- When: The HTML is parsed
- Then: Organization and WebSite JSON-LD blocks are present with correct entity data

**Scenario: Version is not on the homepage**
- Given: A visitor loads the homepage
- When: The page renders
- Then: No version banner or version text appears in the page content (version is in the site footer)

**Scenario: Content component extraction preserves output (AL-14)**
- Given: All inline HTML has been extracted into `.md` content components
- When: The homepage is built and rendered
- Then: The rendered HTML output is identical to the pre-extraction version
- And: No content has been added, removed, or reworded

## Implementation Notes

**Current state (pre-AL-14):** `index.astro` contains all prose inline as raw HTML. Only `AccessKnowledgeBase` is already extracted.

**Target state (post-AL-14):** `index.astro` imports 6 content components (1 existing + 5 new). The page file is purely structural.

**Extraction checklist:**
1. Create each `.md` file with the prose content from the corresponding `<section>`
2. Import each as `{ Content as ComponentName }` in frontmatter
3. Replace inline HTML with `<ComponentName />`
4. Preserve all wrapper elements (`<section>`, `<div>` with classes) in `index.astro`
5. Verify with `pnpm build` that output is unchanged

**Heading level note:** The manifesto section currently uses `<h1>` inline. When extracted to markdown, use `# Agentic Software Development Lifecycle` which renders as `<h1>`. All other sections use `<h2>` (`##` in markdown).

## Resources

- `specs/homepage-structured-data/spec.md` — Structured data sub-spec (completed)
- `specs/structured-data/spec.md` — Article-level structured data spec
- `specs/llms-txt/spec.md` — Related: `llms.txt` for agent discovery
- [AL-14](https://linear.app/pelilauta/issue/AL-14) — Extract inline HTML blocks into .md subcomponents
- [AL-15](https://linear.app/pelilauta/issue/AL-15) — Resources page: related refactor (same pattern)
