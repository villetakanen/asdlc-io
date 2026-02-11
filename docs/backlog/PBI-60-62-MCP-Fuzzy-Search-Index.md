# PBI-60-62: MCP Fuzzy Search with Fuse.js

> Epic: MCP Fuzzy Search
> Spec: `plans/mcp-server/mcp-search.md`
> Status: Done

## Overview

Replace naive substring matching in `search_knowledge_base` with Fuse.js fuzzy search. Build-time index compilation, runtime lookup via pre-built index. The external MCP tool API (name, input schema, response format) is unchanged — this is an internal search quality improvement.

**Problem:** Current search (`src/mcp/content.ts:101-113`) uses case-insensitive `includes()` across title, description, tags, and slug. No fuzzy matching, no relevance ranking, no content body search.

**Solution:** Fuse.js with weighted fields and a pre-compiled index generated at build time.

## PBI List

| PBI | Title | Effort | Dependencies |
|:----|:------|:-------|:-------------|
| PBI-60 | Build-Time Fuse.js Index Generation | Small | None |
| PBI-61 | Fuse.js Fuzzy Search in ContentService | Medium | PBI-60 |
| PBI-62 | Wire Pre-built Index in Edge Function | Small | PBI-60, PBI-61 |

## Implementation Order

**Must be executed in sequence:**

1. **PBI-60** — Foundation: add dependency, extend build script, gitignore
2. **PBI-61** — Core value: replace search logic in ContentService, expand tests
3. **PBI-62** — Integration: connect pre-built index in edge function

## Dependency Graph

```
PBI-60 (Dependency + Build Script)
  │
  └─→ PBI-61 (ContentService + Tests)
        │
        └─→ PBI-62 (Edge Function Wiring)
              │
              └─→ Fuzzy Search Live
```

## Definition of Done (Epic)

- [ ] All three PBIs completed
- [ ] `pnpm test:run` — all tests pass (existing + new fuzzy search tests)
- [ ] `pnpm check` — zero type errors
- [ ] `pnpm lint` — clean
- [ ] `pnpm build` — succeeds (prebuild generates both `articles.json` and `fuse-index.json`)
- [ ] Fuzzy query "contxt" returns "Context Engineering"
- [ ] Exact query "Context Engineering" returns it as top result
- [ ] Title match outranks body-only match
- [ ] `search_knowledge_base` tool name and input schema unchanged
- [ ] `list_articles` and `get_article` unaffected

## Regression Guardrails

- The `search_knowledge_base` MCP tool name and input schema MUST NOT change
- `list_articles` and `get_article` MUST NOT be affected
- Articles with status Draft, Proposed, or Deprecated MUST NOT appear in results
- The `prebuild` script MUST still complete successfully
- Existing substring matches MUST still return results (fuzzy is a superset)

## Related

- Spec: `plans/mcp-server/mcp-search.md`
- Prior MCP work: PBI-37-41 (MCP Server MVP), PBI-43-46 (Semantic Routing)
- Current implementation: `src/mcp/content.ts:101-113`
