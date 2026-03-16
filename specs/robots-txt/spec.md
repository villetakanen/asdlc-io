# Feature: robots.txt AI Crawler Directives

## Blueprint

### Context

The current `public/robots.txt` uses a single generic `User-agent: *` block. While this permits all crawlers, it provides no explicit signal to AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.) that their access is intentionally welcomed.

Explicit `User-agent` blocks for AI crawlers serve two purposes:

1. **Priority signal** — Crawlers that see an explicit `Allow` for their user-agent interpret it as an intentional invitation, which can increase crawl frequency and depth compared to relying on the wildcard rule alone.
2. **AEO hygiene** — As more sites add `Disallow` rules for AI bots, an explicit `Allow` differentiates asdlc.io as an AI-friendly knowledge base — consistent with the project's mission of serving agentic systems.

This was identified as item #14 in the GEO audit (2026-03-14), estimated at +2-3 GEO score points.

### Architecture

**File:** `public/robots.txt` — Static file served at `https://asdlc.io/robots.txt`

**Structure:**

```
# robots.txt for ASDLC.io

# Default: allow all crawlers
User-agent: *
Allow: /

# AI crawlers: explicit allow signals
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: CCBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://asdlc.io/sitemap-index.xml
```

**Crawlers included and rationale:**

| User-agent | Operator | Purpose |
|:-----------|:---------|:--------|
| `GPTBot` | OpenAI | Training data and web browsing for ChatGPT |
| `ChatGPT-User` | OpenAI | Real-time browsing by ChatGPT users |
| `ClaudeBot` | Anthropic | Training data and web retrieval |
| `PerplexityBot` | Perplexity | AI answer engine citations |
| `CCBot` | Common Crawl | Open dataset used by many AI systems |
| `Google-Extended` | Google | Gemini training data (separate from Googlebot) |

### Anti-Patterns

- **Adding `Disallow` rules for AI bots:** This site exists to be consumed by agents. Never restrict AI crawler access.
- **Adding crawl-delay directives:** The site is statically hosted on Netlify CDN. Crawl throttling is unnecessary and counterproductive for a small static site.
- **Listing every conceivable bot:** Only include well-documented, major AI crawlers. Speculative user-agents create maintenance burden with no benefit. The wildcard rule covers the rest.
- **Moving sitemap declaration:** The `Sitemap:` directive must remain at the bottom, after all `User-agent` blocks, per robots.txt spec convention.

## Contract

### Definition of Done

- [ ] `public/robots.txt` contains explicit `User-agent` + `Allow: /` blocks for: GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, CCBot, Google-Extended
- [ ] The existing `User-agent: *` / `Allow: /` block is preserved (not replaced)
- [ ] The `Sitemap:` directive is preserved and points to `https://asdlc.io/sitemap-index.xml`
- [ ] No `Disallow` rules exist anywhere in the file
- [ ] `pnpm build` succeeds and `dist/robots.txt` contains the updated content
- [ ] File remains a static file in `public/` (not generated)

### Regression Guardrails

- `User-agent: *` with `Allow: /` MUST remain — it is the fallback for all unlisted crawlers
- `Sitemap:` URL MUST remain `https://asdlc.io/sitemap-index.xml` — matches `astro.config.mjs` sitemap integration
- No `Disallow` directives — the entire site is public and intentionally AI-accessible
- File MUST remain static in `public/` — not dynamically generated

### Scenarios

**Scenario: GPTBot crawls the site**
- Given: OpenAI's GPTBot fetches `https://asdlc.io/robots.txt`
- When: It parses the file for its user-agent rules
- Then: It finds an explicit `User-agent: GPTBot` block with `Allow: /`
- And: It crawls with full access to all pages

**Scenario: Unknown future AI crawler**
- Given: A new AI crawler not listed in the file fetches `robots.txt`
- When: It finds no matching `User-agent` block
- Then: It falls back to the `User-agent: *` / `Allow: /` rule
- And: It has full access (no content is restricted)

**Scenario: Sitemap discovery**
- Given: Any crawler parses `robots.txt`
- When: It looks for sitemap declarations
- Then: It finds `Sitemap: https://asdlc.io/sitemap-index.xml`

## Implementation Notes

Single-file change to `public/robots.txt`. Add six `User-agent` / `Allow` blocks between the existing wildcard rule and the `Sitemap` directive.

The file should remain simple and readable — no comments needed per-block beyond the section headers.

## Resources

- [Google: robots.txt specification](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt) — Canonical spec
- [OpenAI: GPTBot](https://platform.openai.com/docs/bots) — GPTBot and ChatGPT-User documentation
- [Anthropic: ClaudeBot](https://docs.anthropic.com/en/docs/claude-ai-web-crawling) — ClaudeBot user-agent
- `specs/llms-txt/spec.md` — Sibling AEO feature (llms.txt for AI context)
- `docs/reports/GEO-AUDIT-REPORT.md` — Source audit (item #14)
