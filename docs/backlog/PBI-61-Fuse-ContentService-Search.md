# PBI-61: Fuse.js Fuzzy Search in ContentService

> Status: Ready

## Directive

Replace the naive substring search in `ContentService.searchArticles()` with Fuse.js fuzzy search. Accept an optional pre-built index in the constructor for the production path, with a fallback that builds the index at runtime for tests.

**Scope:**
- `src/mcp/content.ts` (modify)
- `tests/mcp/content.test.ts` (expand)

## Dependencies
- Blocked by: PBI-60 (needs `fuse.js` installed)
- Must merge before: PBI-62

## Context
Ref: `plans/mcp-server/mcp-search.md` — Sections: "ContentService Changes", "Fuse.js Configuration", "Testing Strategy"

Current search (`content.ts:101-113`) is case-insensitive substring matching using `String.includes()` across title, description, tags, and slug. It returns unranked results and does not search content bodies.

## Changes Required

**1. `src/mcp/content.ts`:**

Add import at top of file:
```typescript
import Fuse from "fuse.js";
```

Add constant after the `Article` interface (before the class):
```typescript
const FUSE_OPTIONS = {
  keys: [
    { name: "title", weight: 1.0 },
    { name: "tags", weight: 0.8 },
    { name: "slug", weight: 0.6 },
    { name: "description", weight: 0.4 },
    { name: "content", weight: 0.2 },
  ],
  threshold: 0.4,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
};
```

Change constructor signature and body:
```typescript
export class ContentService {
  private fuse: Fuse<Article>;

  constructor(private articles: Article[], fuseIndex?: Fuse.FuseIndex<Article>) {
    this.fuse = fuseIndex
      ? new Fuse(articles, FUSE_OPTIONS, fuseIndex)
      : new Fuse(articles, FUSE_OPTIONS);
  }
```

Replace `searchArticles()` method body (lines 101-113):
```typescript
async searchArticles(query: string): Promise<Omit<Article, "content">[]> {
  const results = this.fuse.search(query);
  return results.map(({ item: { content, ...rest } }) => rest);
}
```

Leave `listArticles()` and `getArticleBySlug()` completely unchanged.

**2. `tests/mcp/content.test.ts`:**

Expand the `mockArticles` fixture (currently 2 items at line 29) to support meaningful fuzzy search tests. Add articles with varied content so ranking and fuzzy matching can be verified:

```typescript
const mockArticles: any[] = [
  { slug: "c1", collection: "concepts", title: "Concept 1", description: "", status: "Live", content: "C1", tags: ["Architecture"] },
  { slug: "p1", collection: "patterns", title: "Pattern 1", description: "", status: "Experimental", content: "P1", tags: ["Design"] },
  { slug: "context-engineering", collection: "concepts", title: "Context Engineering", description: "Delivering the right context at the right time", status: "Live", content: "Context Engineering is a practice for structuring information delivery.", tags: ["Architecture", "AI", "Context"] },
  { slug: "schema-first", collection: "patterns", title: "Schema-First Development", description: "Define schemas before implementation", status: "Live", content: "This pattern ensures type safety through Zod schemas and contracts.", tags: ["Type Safety", "Zod"] },
  { slug: "body-only-schemas", collection: "practices", title: "Living Specifications", description: "Specs that evolve with the codebase", status: "Live", content: "Use schemas to validate all data boundaries.", tags: ["Documentation"] },
];
```

Add new test cases inside the existing `ContentService` describe block:

- **Fuzzy match (typo tolerance):** Query `"contxt"` should return an article with "Context" in the title
- **Relevance order (title vs body):** Query `"schemas"` should return "Schema-First Development" (title match) ranked above "Living Specifications" (body-only match of "schemas")
- **Tag match:** Query `"Zod"` should return "Schema-First Development"
- **No results:** Query `"xyzzy_nonexistent_topic"` should return empty array
- **Existing test preserved:** The existing test querying `"Pattern"` returning `p1` must still pass

## Verification
- [ ] `ContentService` constructor accepts an optional second parameter `Fuse.FuseIndex<Article>`
- [ ] `searchArticles("contxt")` returns article titled "Context Engineering" (fuzzy match works)
- [ ] `searchArticles("schemas")` returns "Schema-First Development" ranked above "Living Specifications" (title outranks body)
- [ ] `searchArticles("Zod")` returns "Schema-First Development" (tag match)
- [ ] `searchArticles("xyzzy_nonexistent_topic")` returns empty array
- [ ] Existing test `searchArticles("Pattern")` still returns `p1`
- [ ] `listArticles()` returns same results as before (unchanged)
- [ ] `getArticleBySlug()` returns same results as before (unchanged)
- [ ] `pnpm test:run` — all tests pass
- [ ] `pnpm check` — zero type errors

## Notes
- Tests MUST construct ContentService WITHOUT a pre-built index (omit the second parameter). Fuse will build the index from the fixture at runtime. This avoids needing a fixture index file and tests the same search logic.
- The `FUSE_OPTIONS.keys` array MUST match the `fuseKeys` used in `generate-mcp-index.mjs` (PBI-60). If they diverge, build-time and runtime scoring will differ.
- Do NOT change the `searchArticles()` return type (`Promise<Omit<Article, "content">[]>`)
- Do NOT change the `search_knowledge_base` tool definition in `tools.ts` — the tool API is unchanged
- The `parseFrontmatter` function and its tests are unaffected — do not modify them

## Blocks
- PBI-62 (needs the updated ContentService constructor signature)

## Related
- Spec: `plans/mcp-server/mcp-search.md`
- Current implementation: `src/mcp/content.ts:101-113`
- Current tests: `tests/mcp/content.test.ts:28-55`
