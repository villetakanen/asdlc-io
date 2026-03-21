# PBI-73: Scripts/MCP — Include `longTitle` in Build Artifacts (Status: Open)

## 1. Directive
Update build scripts and the MCP tool layer to extract, store, and serve `longTitle` so that downstream consumers (LLM agents, offline skill) see the full SEO-optimized title.

## 2. Scope
- `scripts/generate-mcp-index.mjs` — MCP article manifest
- `scripts/build-skill.mjs` — Downloadable skill markdown
- `src/mcp/tools.ts` — MCP tool response formatting

## 3. Dependencies
- PBI-71 (schema must define `longTitle`).

## 4. Changes Required

**MCP Index Generation (`scripts/generate-mcp-index.mjs`):**
- [ ] Extract `longTitle` from frontmatter alongside `title` (around line 43).
- [ ] Include `longTitle` in the article manifest object written to `src/mcp/articles.json`.
- [ ] Fallback: `longTitle: data.longTitle || null` (keep it explicit; don't default to title in the manifest).

**Skill Build (`scripts/build-skill.mjs`):**
- [ ] Extract `longTitle` from frontmatter (around line 72).
- [ ] Use `longTitle ?? title` for markdown headings in the generated skill files.
- [ ] Index links can remain on short `title` for readability.

**MCP Tools (`src/mcp/tools.ts`):**
- [ ] `get_article` (line ~88): Use `article.longTitle ?? article.title` for the H1 heading in the response.
- [ ] `list_articles` (line ~65): Continue using `article.title` (short title is appropriate for list format).
- [ ] `search_knowledge_base` (line ~132): Continue using `article.title` for list format.

## 5. Verification
- [ ] Run `pnpm build:mcp-index` — `src/mcp/articles.json` includes `longTitle` field for articles that have it.
- [ ] Run `pnpm build:skill` — generated markdown files use longTitle in headings where present.
- [ ] MCP `get_article` response H1 uses longTitle when available.
- [ ] MCP `list_articles` and `search_knowledge_base` still show short titles.
- [ ] `pnpm build` succeeds end-to-end.

## 6. Notes
- The articles.json manifest is the bridge between build-time content and runtime MCP. Including `longTitle` as a separate field (rather than resolving it at build time) preserves flexibility for future MCP consumers to choose which title to display.

## 7. Blocks
- None (leaf PBI).
