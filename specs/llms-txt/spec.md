# Feature: llms.txt

## Blueprint

### Context

AI crawlers and LLM-powered agents need a concise, machine-readable summary of a site's purpose, content structure, and access policies. The `llms.txt` standard (proposed by Jeremy Howard / Answer.AI, 2024) provides this — a Markdown file at `/llms.txt` that gives LLMs the context they need without parsing the entire site.

For asdlc.io specifically, this serves three purposes:

1. **Discoverability** — Declares the MCP endpoint (`/mcp`) and downloadable skill so agents can self-connect to the knowledge base
2. **Attribution policy** — States the MIT license and how AI systems should cite content
3. **AEO signal** — Sites with `llms.txt` are increasingly prioritized by AI answer engines for citation

**Consumers:** AI crawlers (GPTBot, ClaudeBot, PerplexityBot), MCP-compatible agents, AI answer engines (Perplexity, SearchGPT, Gemini).

### Architecture

**File:** `public/llms.txt` — Static file served at `https://asdlc.io/llms.txt`

**Format:** Markdown, following the llms.txt spec (llmstxt.org). Sections in strict order:

1. **H1** — Site name (required)
2. **Blockquote** — One-line site description
3. **Body paragraphs** — License, attribution policy, MCP access
4. **H2 sections** — Linked resource lists (concepts, patterns, practices)
5. **H2 "Optional"** — Secondary resources that can be skipped for shorter context

**Content sources:**
- Site metadata: `astro.config.mjs` (`site: "https://asdlc.io"`)
- License: `/LICENSE` (MIT, Ville Takanen 2025)
- MCP endpoint: `/mcp` (see `specs/` or `plans/mcp-server/spec.md`)
- Article inventory: Content collections in `src/content/{concepts,patterns,practices}/`

**Relationship to existing infrastructure:**

| Mechanism | Purpose | Audience |
|:----------|:--------|:---------|
| `robots.txt` | Crawler directives (allow/disallow) | Search engine bots |
| `sitemap-index.xml` | Page inventory for indexing | Search engine bots |
| **`llms.txt`** | **Site summary + access policies for LLMs** | **AI crawlers & agents** |
| `/mcp` | Real-time programmatic KB access | MCP-compatible agents |
| Downloadable Skill | Offline static KB bundle | Air-gapped agents |

### Anti-Patterns

- **Auto-generating from sitemap:** Do not dynamically generate `llms.txt` from the sitemap or content collections. The file should be curated — it's a summary, not an index. A 500-line `llms.txt` defeats the purpose.
- **Duplicating robots.txt directives:** `llms.txt` is not about access control. It's about context. Don't add `Disallow` or crawl rules — that's `robots.txt`'s job.
- **Including Draft/Proposed content:** Only reference Live and Experimental articles, consistent with MCP and Skill filtering rules.
- **Hardcoding article lists that rot:** The curated sections should link to index pages (`/concepts/`, `/patterns/`, `/practices/`) and key foundational articles, not every individual article. This keeps maintenance low.

## Contract

### Definition of Done

- [x] `public/llms.txt` exists and is served at `https://asdlc.io/llms.txt`
- [x] H1 is "ASDLC.io" (matches site identity)
- [x] Blockquote contains a concise site description (1-2 sentences)
- [x] Body declares: MIT license, attribution policy, MCP endpoint URL
- [x] H2 sections link to collection index pages and key foundational articles
- [x] H2 "Optional" section exists with secondary resources
- [x] File follows llmstxt.org spec ordering (H1 → blockquote → body → H2 sections)
- [x] File is valid Markdown
- [x] `pnpm build` succeeds and file is present in `dist/llms.txt`

### Regression Guardrails

- `llms.txt` MUST remain a static file in `public/` — not generated, not dynamic
- The MCP endpoint URL (`https://asdlc.io/mcp`) MUST be present — this is the primary machine-actionable value
- License declaration MUST match `/LICENSE` (MIT)
- MUST NOT include Draft, Proposed, or Deprecated article URLs
- File MUST stay under 100 lines — it's a summary, not a knowledge base dump

### Scenarios

**Scenario: AI crawler discovers site capabilities**
- Given: An AI crawler fetches `https://asdlc.io/llms.txt`
- When: It parses the Markdown content
- Then: It finds the site name, description, license, and MCP endpoint URL
- And: It can programmatically connect to `/mcp` for deeper access

**Scenario: AI answer engine cites content**
- Given: An AI answer engine references an ASDLC article
- When: It checks `llms.txt` for attribution policy
- Then: It finds the MIT license and attribution guidance
- And: It can construct a proper citation

**Scenario: Agent with limited context window**
- Given: An agent fetches `llms.txt` with a short context budget
- When: It encounters the "Optional" H2 section
- Then: It skips that section per the llms.txt spec
- And: It still has the essential site summary, license, and MCP URL

**Scenario: New collection article is published**
- Given: A new Live pattern is added to the knowledge base
- When: The developer considers updating `llms.txt`
- Then: No update is needed because `llms.txt` links to index pages, not individual articles

## Implementation Notes

The file is a single static Markdown file at `public/llms.txt`. Suggested structure:

```markdown
# ASDLC.io

> The definitive knowledge base for the Agentic Software Development Life Cycle — patterns, practices, and concepts for AI-augmented software engineering.

## About

ASDLC.io documents the transition from craft-based software development to industrial-scale agentic systems. Content is organized into three collections: Concepts (terminology), Patterns (architectural solutions), and Practices (operational processes).

## License & Attribution

All content is released under the [MIT License](https://github.com/villetakanen/asdlc-io/blob/main/LICENSE) (c) 2025 Ville Takanen.

When citing ASDLC content, attribute as: "Source: ASDLC.io — [Article Title]" with a link to the canonical URL.

## Machine Access

- [MCP Server](https://asdlc.io/mcp): Model Context Protocol endpoint for programmatic access. Supports `list_articles`, `get_article`, and `search_knowledge_base` tools.
- [Downloadable Skill](https://asdlc.io/asdlc-skill.zip): Static markdown bundle for offline/air-gapped agents.
- [Sitemap](https://asdlc.io/sitemap-index.xml): Full page index.

## Core Content

- [Concepts](https://asdlc.io/concepts/): Terminology definitions (e.g., Context Engineering, Spec-Driven Development)
- [Patterns](https://asdlc.io/patterns/): Architectural solutions (e.g., The Spec, Agent Constitution, Adversarial Code Review)
- [Practices](https://asdlc.io/practices/): Operational processes (e.g., Living Specs, PBI Authoring, Micro-Commits)

## Foundational Reading

- [Agentic SDLC](https://asdlc.io/concepts/agentic-sdlc/): The framework definition
- [Spec-Driven Development](https://asdlc.io/concepts/spec-driven-development/): Core methodology
- [The Spec](https://asdlc.io/patterns/the-spec/): Living specification pattern
- [Context Engineering](https://asdlc.io/concepts/context-engineering/): Structuring information for agent consumption
- [Field Manual](https://asdlc.io/fieldmanual/): Collated single-page edition

## Optional

- [Getting Started](https://asdlc.io/getting-started/): Onboarding guide
- [Design System](https://asdlc.io/resources/design-system/): Component documentation
- [Compendium](https://asdlc.io/resources/compendium/): Full alphabetical article index
- [Legend](https://asdlc.io/resources/legend/): Status and maturity definitions
```

This is a suggested starting point — the actual content should be reviewed editorially before committing. The key constraint is that the structure follows the llms.txt spec ordering.

## Resources

- [llmstxt.org](https://llmstxt.org/) — The llms.txt specification
- [llms.txt State in 2026](https://www.aeo.press/ai/the-state-of-llms-txt-in-2026) — Adoption trends
- `specs/structured-data/spec.md` — Related: Schema.org JSON-LD (another AEO layer)
- `plans/mcp-server/spec.md` — Related: MCP server architecture
