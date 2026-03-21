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

**Dependencies:**
| Import | Source | Role |
|--------|--------|------|
| `AccessKnowledgeBase` | `../components/definitions/access-knowledge-base.md` | MCP endpoint + Skill download section (markdown content component) |
| `StructuredData` | `../components/StructuredData.astro` | Organization + WebSite JSON-LD |
| `BaseLayout` | `../layouts/BaseLayout.astro` | Shell: head, header, main, footer |

**Page structure:**
```
BaseLayout (title, description, image)
├── StructuredData type="Organization"
├── StructuredData type="WebSite"
└── article.prose
    ├── h1 — Descriptive: what the site is and what you can do
    ├── section — "Connect Your Agent" (MCP endpoint + skill download)
    ├── blockquote — Pull quote + attribution
    ├── section — Manifesto intro (craft → industrial)
    ├── section — "The Problem: Two Misguided Narratives"
    │   ├── h3 — "The Faster Horse Fallacy"
    │   └── h3 — "The Replacement Fantasy"
    ├── section — "The Solution: The Agentic Factory"
    │   ├── ul — Three pillars overview
    │   ├── h4 — "I. Factory Architecture"
    │   ├── h4 — "II. Standardized Parts"
    │   └── h4 — "III. Quality Control"
    ├── section — "The Knowledge Base" (links to /patterns, /practices, /concepts)
    └── section.border-box — "Quick Start" (contributor onboarding)
```

**Delta from reverse-spec (2026-03-21):** Three UX changes to improve first-impression quality and conversion:

| Change | Before | After | Rationale |
|--------|--------|-------|-----------|
| **MCP section position** | Section 7 of 8 ("Access the Knowledge Base") | Section 2, immediately after H1 ("Connect Your Agent") | MCP is the most differentiated distribution channel; burying it after 5 manifesto sections loses agent-focused visitors |
| **Banner removed** | `.banner-warning` (orange, uppercase, "RELEASE EARLY, RELEASE OFTEN") on homepage | Version moved to site footer (`Footer.astro`) | Orange warning banner reads as error/downtime; version is metadata, belongs in footer on all pages |
| **H1 clarity** | "The Industrialization of Software: A Framework for Agentic SDLC" | "Agentic Software Development Lifecycle" | Manifesto-style H1 doesn't communicate utility; the site name IS the title |

**SEO signals:**
- `<title>`: "ASDLC.io | The Agentic Software Development Life Cycle Framework"
- `<meta description>`: "The playbook for industrializing software engineering..."
- JSON-LD: Organization + WebSite (see `specs/homepage-structured-data/spec.md`)

**Styling:** Uses `.prose` wrapper (global), `.border-box` (design system class). No scoped CSS.

### Content Sections

| # | Section | Purpose | Audience |
|---|---------|---------|----------|
| 1 | H1 | Identify the site and its value | All |
| 2 | Connect Your Agent | MCP endpoint + skill download | Agents, power users |
| 3 | Quote + manifesto intro | Frame the philosophy | Human visitors |
| 4 | Two Narratives | Differentiate from copilots/replacement | Human visitors |
| 5 | Agentic Factory | Core framework (3 pillars) | Human visitors |
| 6 | Knowledge Base | Navigate to collections | All |
| 7 | Quick Start | Contributor onboarding | Contributors |

### Anti-Patterns

- **Do NOT move structured data into BaseLayout.** Organization/WebSite JSON-LD belongs on the homepage only (see `specs/homepage-structured-data/spec.md` guardrails).
- **Do NOT hardcode `https://asdlc.io`.** Derive from `Astro.site` for environment portability.
- **Do NOT add scoped CSS.** The homepage uses global `.prose` layout and design system classes. Per project rules, prefer global CSS.
- **Do NOT duplicate the AccessKnowledgeBase content inline.** It's a shared markdown component used by the homepage and potentially other pages.
- **Do NOT put version info on the homepage.** Version lives in the site footer (`specs/site-footer/spec.md`).

## Contract

### Definition of Done

- [x] Page renders at `/` with correct `<title>` and `<meta description>`
- [x] Organization and WebSite JSON-LD blocks present in `<head>`
- [x] H1 is descriptive — communicates what the site is
- [x] MCP endpoint and skill download appear in the first 2 sections (before manifesto content)
- [x] No version banner on homepage (version is in site footer)
- [x] Knowledge base navigation links to `/patterns`, `/practices`, `/concepts`
- [x] Quick Start section with contributor onboarding steps
- [x] `pnpm check` passes with 0 errors
- [x] `pnpm build` succeeds

### Regression Guardrails

- The `StructuredData` component MUST NOT be modified from this page's spec — it has its own spec
- The `BaseLayout` MUST NOT be modified — homepage is a consumer, not an owner
- Organization `name` MUST be `"ASDLC.io"` (consistent with `og:site_name`)
- The MCP endpoint URL in `access-knowledge-base.md` MUST be `https://asdlc.io/mcp`
- The skill download link MUST point to `/asdlc-skill.zip`
- All existing content sections MUST be preserved — reorder, don't delete

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

## Implementation Notes

Single file: `src/pages/index.astro`. The `AccessKnowledgeBase` content component lives at `src/components/definitions/access-knowledge-base.md` — changes to MCP instructions should be made there, not inlined in the homepage.

Version display has been moved to the site footer (`src/components/Footer.astro`). See `specs/site-footer/spec.md`.

## Resources

- `specs/homepage-structured-data/spec.md` — Structured data sub-spec (completed)
- `specs/structured-data/spec.md` — Article-level structured data spec
- `specs/llms-txt/spec.md` — Related: `llms.txt` for agent discovery
