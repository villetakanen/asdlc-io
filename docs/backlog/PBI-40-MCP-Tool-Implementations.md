# PBI-40: MCP Tool Implementations

> Status: Ready

## Goal
Implement the three MCP tools (`list_articles`, `get_article`, `search_articles`) that provide access to ASDLC knowledge base content.

## Context
These tools are the primary interface for MCP clients to access ASDLC content. They use the content reading utilities (PBI-39) and are invoked by the protocol handler (PBI-38) when clients call `tools/call`.

## Spec Reference
`/docs/specs/mcp-server/spec.md` - Sections: "MCP Tools", "Search Algorithm", "Scenarios"

## Requirements

### File Location
`/src/mcp/tools.ts`

### Tool Dispatcher
```typescript
import { listArticles, getArticle, searchArticles } from "./content.ts";

type ToolResult = {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
};

export async function executeTool(
  name: string,
  args: Record<string, unknown>
): Promise<ToolResult> {
  switch (name) {
    case "list_articles":
      return handleListArticles(args);
    case "get_article":
      return handleGetArticle(args);
    case "search_articles":
      return handleSearchArticles(args);
    default:
      return {
        content: [{ type: "text", text: `Unknown tool: ${name}` }],
        isError: true,
      };
  }
}
```

### Tool: list_articles
```typescript
async function handleListArticles(args: {
  category?: "concepts" | "patterns" | "practices";
  limit?: number;
}): Promise<ToolResult> {
  const articles = await listArticles({
    category: args.category,
    limit: args.limit ?? 50,
  });
  
  return {
    content: [{
      type: "text",
      text: JSON.stringify(articles, null, 2),
    }],
  };
}
```

**Response Format:**
```json
[
  {
    "slug": "context-engineering",
    "category": "concepts",
    "title": "Context Engineering",
    "description": "The discipline of designing...",
    "tags": ["Context", "Prompting"],
    "lastUpdated": "2025-01-15",
    "status": "Live"
  }
]
```

### Tool: get_article
```typescript
async function handleGetArticle(args: {
  slug: string;
}): Promise<ToolResult> {
  if (!args.slug) {
    return {
      content: [{ type: "text", text: "Missing required parameter: slug" }],
      isError: true,
    };
  }
  
  const article = await getArticle(args.slug);
  
  if (!article) {
    return {
      content: [{ type: "text", text: `Article '${args.slug}' not found` }],
      isError: true,
    };
  }
  
  return {
    content: [{
      type: "text",
      text: JSON.stringify(article, null, 2),
    }],
  };
}
```

**Response Format:**
```json
{
  "slug": "context-engineering",
  "category": "concepts",
  "title": "Context Engineering",
  "description": "The discipline of designing...",
  "tags": ["Context", "Prompting"],
  "lastUpdated": "2025-01-15",
  "status": "Live",
  "content": "## Definition\n\nContext Engineering is..."
}
```

### Tool: search_articles
```typescript
async function handleSearchArticles(args: {
  query: string;
  include_content?: boolean;
}): Promise<ToolResult> {
  if (!args.query) {
    return {
      content: [{ type: "text", text: "Missing required parameter: query" }],
      isError: true,
    };
  }
  
  const results = await searchArticles(
    args.query,
    args.include_content ?? false
  );
  
  return {
    content: [{
      type: "text",
      text: JSON.stringify(results, null, 2),
    }],
  };
}
```

### Search Algorithm Implementation
```typescript
function scoreMatch(article: ArticleMetadata, query: string): number {
  const q = query.toLowerCase();
  let score = 0;
  
  // Title match (weight: 3)
  if (article.title.toLowerCase().includes(q)) {
    score += 3;
  }
  
  // Tag match (weight: 2)
  if (article.tags.some(tag => tag.toLowerCase().includes(q))) {
    score += 2;
  }
  
  // Description match (weight: 1)
  if (article.description.toLowerCase().includes(q)) {
    score += 1;
  }
  
  return score;
}

function sortResults(results: ScoredArticle[]): ArticleMetadata[] {
  return results
    .filter(r => r.score > 0)
    .sort((a, b) => {
      // Primary: score descending
      if (b.score !== a.score) return b.score - a.score;
      // Secondary: lastUpdated descending
      return new Date(b.article.lastUpdated).getTime() - 
             new Date(a.article.lastUpdated).getTime();
    })
    .map(r => r.article);
}
```

### Error Responses
All errors return `isError: true` with descriptive message:
- Missing required parameter: `"Missing required parameter: {param}"`
- Article not found: `"Article '{slug}' not found"`
- Unknown tool: `"Unknown tool: {name}"`

## Acceptance Criteria
- [ ] File exists at `/src/mcp/tools.ts`
- [ ] `executeTool("list_articles", {})` returns all Live/Experimental articles
- [ ] `executeTool("list_articles", { category: "patterns" })` filters correctly
- [ ] `executeTool("list_articles", { limit: 5 })` limits results
- [ ] `executeTool("get_article", { slug: "valid" })` returns full article
- [ ] `executeTool("get_article", { slug: "invalid" })` returns error with `isError: true`
- [ ] `executeTool("get_article", {})` returns missing param error
- [ ] `executeTool("search_articles", { query: "context" })` finds matches
- [ ] Search results are sorted by score, then by date
- [ ] `include_content: true` includes markdown in search results
- [ ] All responses use MCP content format: `{ content: [{ type: "text", text: "..." }] }`

## Testing
**Integration Tests:**
```typescript
// Test list_articles
const list = await executeTool("list_articles", { limit: 3 });
expect(list.isError).toBeUndefined();
const articles = JSON.parse(list.content[0].text);
expect(articles.length).toBeLessThanOrEqual(3);

// Test get_article success
const article = await executeTool("get_article", { slug: "context-engineering" });
expect(article.isError).toBeUndefined();
const parsed = JSON.parse(article.content[0].text);
expect(parsed.content).toBeDefined();

// Test get_article not found
const missing = await executeTool("get_article", { slug: "nonexistent" });
expect(missing.isError).toBe(true);

// Test search
const search = await executeTool("search_articles", { query: "engineering" });
expect(search.isError).toBeUndefined();
const results = JSON.parse(search.content[0].text);
expect(results.length).toBeGreaterThan(0);
```

## Notes
- Response text is always JSON-serialized for consistency
- The `content` array format is required by MCP spec for tool results
- Articles with Draft/Proposed/Deprecated status are already filtered by content.ts
- JSON pretty-printing (`null, 2`) aids debugging; can be removed for production

## Dependencies
- PBI-38: MCP Protocol Handler (calls `executeTool`)
- PBI-39: Content Reading Utilities (provides `listArticles`, `getArticle`, `searchArticles`)

## Blocked By
- PBI-39: Content Reading Utilities (must exist first)

## Blocks
- None (final implementation layer)

## Related
- Spec: `/docs/specs/mcp-server/spec.md`
- MCP Tool Result Format: https://modelcontextprotocol.io/specification#tool-result
