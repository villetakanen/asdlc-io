# Feature: MCP Fuzzy Search with Fuse.js

## Blueprint

### Context

The current `search_knowledge_base` tool uses naive case-insensitive substring matching across title, description, tags, and slug. This approach has clear limitations:

- No fuzzy matching ("contxt" won't find "context")
- No relevance scoring (results are unranked, returned in array order)
- No field weighting (title match = slug match)
- No content body search (only metadata fields are searched)

We will replace this with **Fuse.js**, a lightweight fuzzy-search library that supports pre-built indexes, field weighting, and relevance scoring. The index will be **compiled at build time** and loaded at runtime, keeping the edge function fast.

### Architecture

**Build Time** (`generate-mcp-index.mjs`):

```
src/content/**/*.md
        │
        ▼
  ┌─────────────────┐
  │ generate-mcp-   │
  │ index.mjs       │
  │                 │
  │ 1. Parse articles│
  │ 2. Write articles│
  │    .json        │
  │ 3. Build Fuse   │
  │    index        │
  │ 4. Write fuse-  │
  │    index.json   │
  └────────┬────────┘
           │
     ┌─────┴──────┐
     ▼            ▼
articles.json  fuse-index.json
```

**Runtime** (Netlify Edge Function):

```
┌───────────────┐   search query   ┌───────────────────────┐
│  MCP Client   │ ───────────────► │  Edge Function        │
│               │                  │                       │
│               │ ◄─────────────── │  Fuse instance        │
│               │  ranked results  │  (pre-built index)    │
└───────────────┘                  └───────────────────────┘
                                     ▲           ▲
                                     │           │
                              articles.json  fuse-index.json
                              (imported)     (imported)
```

### Design Decisions

**Why Fuse.js:**
- ~25 KB minified — trivial for the 20 MB edge function limit
- `Fuse.createIndex()` supports serialization for pre-built indexes
- `Fuse.parseIndex()` restores the index at runtime without re-indexing
- Zero runtime dependencies (pure JS, works in Deno/Edge)
- Well-maintained, widely adopted

**Search Fields & Weights:**

| Field | Weight | Rationale |
|:------|:-------|:----------|
| `title` | 1.0 | Primary identifier; exact or near-exact matches should dominate |
| `tags` | 0.8 | Curated keywords; high signal |
| `slug` | 0.6 | URL-friendly identifier; useful for direct lookups |
| `description` | 0.4 | Short summary; relevant but less precise |
| `content` | 0.2 | Full body text; broadest recall, lowest precision |

**Fuse.js Configuration:**

```typescript
{
  keys: [
    { name: "title", weight: 1.0 },
    { name: "tags", weight: 0.8 },
    { name: "slug", weight: 0.6 },
    { name: "description", weight: 0.4 },
    { name: "content", weight: 0.2 },
  ],
  threshold: 0.4,       // 0 = exact, 1 = match anything
  includeScore: true,    // Return relevance scores
  ignoreLocation: true,  // Don't penalize matches later in the string
  minMatchCharLength: 2, // Ignore single-char matches
}
```

**Threshold rationale:** 0.4 is a balanced default for agent queries — tight enough to avoid noise, loose enough to handle typos and partial matches. Can be tuned later based on usage.

### Dependency

**New dependency:** `fuse.js`

- npm package: `fuse.js`
- Size: ~25 KB minified, ~6 KB gzipped
- License: Apache-2.0
- Category: `dependencies` (needed at both build time and runtime in edge function)

### Anti-Patterns

- **Do not** build the Fuse index at runtime — it must be pre-compiled at build time
- **Do not** store the content field in the Fuse index results — use the index for scoring only, then look up full article data from `articles.json`
- **Do not** remove the existing `articles.json` — it's still needed by `list_articles` and `get_article`
- **Do not** change the `search_knowledge_base` tool name or input schema — the change is internal only

## Contract

### Definition of Done

- [ ] `fuse.js` is added to `dependencies` in `package.json`
- [ ] `generate-mcp-index.mjs` creates both `articles.json` and `fuse-index.json` in `src/mcp/`
- [ ] `fuse-index.json` is generated using `Fuse.createIndex()` and serialized
- [ ] `ContentService` constructor initializes Fuse with the pre-built index via `Fuse.parseIndex()`
- [ ] `searchArticles()` delegates to `fuse.search()` and returns results sorted by relevance
- [ ] Search covers all five fields: title, tags, slug, description, content
- [ ] Fuzzy matching works (e.g., "contxt" finds "context engineering")
- [ ] Results are ranked by relevance score (best match first)
- [ ] `list_articles` and `get_article` remain unchanged
- [ ] `search_knowledge_base` tool definition (name, description, input schema) remains unchanged
- [ ] All existing MCP tests pass
- [ ] New tests cover fuzzy matching, relevance ordering, and no-results case
- [ ] `pnpm check` and `pnpm lint` pass
- [ ] Edge function stays well under 50ms CPU time for search queries

### Regression Guardrails

- The `search_knowledge_base` MCP tool name and input schema MUST NOT change (clients depend on it)
- `list_articles` and `get_article` MUST NOT be affected
- Articles with status Draft, Proposed, or Deprecated MUST NOT appear in search results
- The `prebuild` script MUST still complete successfully and generate both index files
- Existing substring matches MUST still return results (fuzzy should be a superset)

### Scenarios

**Scenario: Exact keyword match**
- Given: An article titled "Context Engineering" exists with status Live
- When: Client calls `search_knowledge_base` with `{ query: "Context Engineering" }`
- Then: "Context Engineering" appears as the top result

**Scenario: Fuzzy match (typo tolerance)**
- Given: An article titled "Context Engineering" exists
- When: Client calls `search_knowledge_base` with `{ query: "contxt engneering" }`
- Then: "Context Engineering" still appears in results

**Scenario: Partial keyword match**
- Given: Articles "Agent Directives" and "Agent Constitution" exist
- When: Client calls `search_knowledge_base` with `{ query: "agent" }`
- Then: Both articles appear in results

**Scenario: Content body match**
- Given: An article body contains "Just-in-Time context delivery" but the title/tags/description do not
- When: Client calls `search_knowledge_base` with `{ query: "just-in-time" }`
- Then: The article appears in results (lower ranked than a title match would be)

**Scenario: Title match outranks body match**
- Given: Article A has "schemas" in its title; Article B mentions "schemas" only in the body
- When: Client calls `search_knowledge_base` with `{ query: "schemas" }`
- Then: Article A ranks higher than Article B

**Scenario: No results**
- Given: No article matches "xyzzy_nonexistent_topic"
- When: Client calls `search_knowledge_base` with `{ query: "xyzzy_nonexistent_topic" }`
- Then: Tool returns "No articles found matching 'xyzzy_nonexistent_topic'."

**Scenario: Draft articles excluded**
- Given: A Draft article contains the word "factory" and a Live article also contains "factory"
- When: Client calls `search_knowledge_base` with `{ query: "factory" }`
- Then: Only the Live article appears (Draft was filtered at index build time)

## Implementation Notes

### Files to Modify

| File | Change |
|:-----|:-------|
| `package.json` | Add `fuse.js` to `dependencies` |
| `scripts/generate-mcp-index.mjs` | Import Fuse, create and serialize index alongside `articles.json` |
| `src/mcp/content.ts` | Import Fuse, accept pre-built index in constructor, replace `searchArticles()` |
| `netlify/edge-functions/mcp.ts` | Import `fuse-index.json`, pass to `ContentService` |
| `tests/mcp/content.test.ts` | Add fuzzy matching, ranking, and edge case tests |

### New File

| File | Purpose |
|:-----|:-------|
| `src/mcp/fuse-index.json` | Pre-built Fuse.js search index (generated, gitignored) |

### Build Script Changes (`generate-mcp-index.mjs`)

After writing `articles.json`, add:

```javascript
import Fuse from "fuse.js";

// ... existing article generation ...

// Build Fuse index
const fuseOptions = {
  keys: [
    { name: "title", weight: 1.0 },
    { name: "tags", weight: 0.8 },
    { name: "slug", weight: 0.6 },
    { name: "description", weight: 0.4 },
    { name: "content", weight: 0.2 },
  ],
};

const index = Fuse.createIndex(fuseOptions.keys, articles);
writeFileSync(
  resolve("src/mcp/fuse-index.json"),
  JSON.stringify(index.toJSON())
);
```

### ContentService Changes (`content.ts`)

```typescript
import Fuse from "fuse.js";

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

export class ContentService {
  private fuse: Fuse<Article>;

  constructor(articles: Article[], fuseIndex?: Fuse.FuseIndex<Article>) {
    this.articles = articles;
    this.fuse = fuseIndex
      ? new Fuse(articles, FUSE_OPTIONS, fuseIndex)
      : new Fuse(articles, FUSE_OPTIONS); // Fallback for tests
  }

  async searchArticles(query: string): Promise<Omit<Article, "content">[]> {
    const results = this.fuse.search(query);
    return results.map(({ item: { content, ...rest } }) => rest);
  }
}
```

The constructor accepts an optional pre-built index. In production, the edge function passes the parsed index. In tests, Fuse builds the index on the fly from the articles array (acceptable for small test fixtures).

### Edge Function Changes (`mcp.ts`)

```typescript
import fuseIndexData from "../../src/mcp/fuse-index.json" with { type: "json" };
import Fuse from "fuse.js";

// ... existing code ...

const fuseIndex = Fuse.parseIndex<Article>(fuseIndexData);
const contentService = new ContentService(articles, fuseIndex);
```

### Git Ignore

Add to `.gitignore`:

```
src/mcp/fuse-index.json
```

This file is generated, like `articles.json` (check if `articles.json` is already gitignored — if so, follow the same pattern).

### Performance Budget

| Metric | Target | Rationale |
|:-------|:-------|:----------|
| Index file size | < 500 KB | ~30-50 articles with content; Fuse indexes are compact |
| Search latency (edge) | < 20ms CPU | Fuse with pre-built index is O(n) scan with scoring |
| Build time increase | < 2s | Index creation is fast for small corpora |

### Testing Strategy

**Unit tests** (`tests/mcp/content.test.ts`):

1. **Fuzzy match**: Query "contxt" returns article titled "Context Engineering"
2. **Relevance order**: Title match ranks above body-only match
3. **Multi-field**: Tag match returns expected article
4. **No results**: Gibberish query returns empty array
5. **Existing tests**: All current `searchArticles` tests still pass (fuzzy is a superset of substring)

Tests should construct `ContentService` without a pre-built index (let Fuse build it from the test fixture). This avoids needing a fixture index file and tests the same search logic.

## Resources

- [Fuse.js Documentation](https://www.fusejs.io/)
- [Fuse.js `createIndex`](https://www.fusejs.io/api/indexing.html)
- [Existing MCP Server Spec](./spec.md)
- [Netlify Edge Functions Limits](https://docs.netlify.com/build/edge-functions/limits/)
