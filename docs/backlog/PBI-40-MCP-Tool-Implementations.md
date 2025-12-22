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
- [ ] Unit tests exist at `/src/mcp/tools.test.ts`
- [ ] All tests pass (`pnpm test:run`)

## Testing
**Unit Tests:**
Create `/src/mcp/tools.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { executeTool } from './tools';

describe('MCP Tool Implementations', () => {
  describe('list_articles tool', () => {
    it('returns all articles without filters', async () => {
      const result = await executeTool('list_articles', {});
      
      expect(result.isError).toBeUndefined();
      expect(result.content).toHaveLength(1);
      expect(result.content[0].type).toBe('text');
      
      const articles = JSON.parse(result.content[0].text);
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBeGreaterThan(0);
    });

    it('filters by category', async () => {
      const result = await executeTool('list_articles', { category: 'patterns' });
      
      expect(result.isError).toBeUndefined();
      const articles = JSON.parse(result.content[0].text);
      expect(articles.every((a: any) => a.category === 'patterns')).toBe(true);
    });

    it('limits results', async () => {
      const result = await executeTool('list_articles', { limit: 3 });
      
      expect(result.isError).toBeUndefined();
      const articles = JSON.parse(result.content[0].text);
      expect(articles.length).toBeLessThanOrEqual(3);
    });

    it('returns only Live and Experimental articles', async () => {
      const result = await executeTool('list_articles', {});
      
      const articles = JSON.parse(result.content[0].text);
      const statuses = articles.map((a: any) => a.status);
      expect(statuses).not.toContain('Draft');
      expect(statuses).not.toContain('Proposed');
      expect(statuses).not.toContain('Deprecated');
    });
  });

  describe('get_article tool', () => {
    it('returns article with full content for valid slug', async () => {
      // First get a valid slug
      const listResult = await executeTool('list_articles', { limit: 1 });
      const articles = JSON.parse(listResult.content[0].text);
      const slug = articles[0].slug;
      
      const result = await executeTool('get_article', { slug });
      
      expect(result.isError).toBeUndefined();
      const article = JSON.parse(result.content[0].text);
      expect(article.slug).toBe(slug);
      expect(article.content).toBeDefined();
      expect(article.content.length).toBeGreaterThan(0);
    });

    it('returns error for non-existent article', async () => {
      const result = await executeTool('get_article', { slug: 'nonexistent-123' });
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('not found');
    });

    it('returns error for missing slug parameter', async () => {
      const result = await executeTool('get_article', {});
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Missing required parameter: slug');
    });
  });

  describe('search_articles tool', () => {
    it('finds articles by search query', async () => {
      const result = await executeTool('search_articles', { query: 'engineering' });
      
      expect(result.isError).toBeUndefined();
      const articles = JSON.parse(result.content[0].text);
      expect(Array.isArray(articles)).toBe(true);
    });

    it('returns metadata only by default', async () => {
      const result = await executeTool('search_articles', { query: 'the' });
      
      const articles = JSON.parse(result.content[0].text);
      if (articles.length > 0) {
        expect(articles[0]).not.toHaveProperty('content');
      }
    });

    it('includes content when requested', async () => {
      const result = await executeTool('search_articles', {
        query: 'engineering',
        include_content: true,
      });
      
      const articles = JSON.parse(result.content[0].text);
      if (articles.length > 0) {
        expect(articles[0]).toHaveProperty('content');
      }
    });

    it('returns error for missing query parameter', async () => {
      const result = await executeTool('search_articles', {});
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Missing required parameter: query');
    });

    it('only returns Live and Experimental articles', async () => {
      const result = await executeTool('search_articles', { query: '' });
      
      const articles = JSON.parse(result.content[0].text);
      const statuses = articles.map((a: any) => a.status);
      expect(statuses).not.toContain('Draft');
      expect(statuses).not.toContain('Proposed');
      expect(statuses).not.toContain('Deprecated');
    });
  });

  describe('Error Handling', () => {
    it('returns error for unknown tool', async () => {
      const result = await executeTool('unknown_tool', {});
      
      expect(result.isError).toBe(true);
      expect(result.content[0].text).toContain('Unknown tool');
    });
  });

  describe('Response Format', () => {
    it('uses MCP content format for all responses', async () => {
      const result = await executeTool('list_articles', {});
      
      expect(result).toHaveProperty('content');
      expect(Array.isArray(result.content)).toBe(true);
      expect(result.content[0]).toHaveProperty('type', 'text');
      expect(result.content[0]).toHaveProperty('text');
    });

    it('serializes responses as JSON', async () => {
      const result = await executeTool('list_articles', { limit: 1 });
      
      expect(() => JSON.parse(result.content[0].text)).not.toThrow();
    });
  });
});
```

## Notes
- Response text is always JSON-serialized for consistency
- The `content` array format is required by MCP spec for tool results
- Articles with Draft/Proposed/Deprecated status are already filtered by content.ts
- JSON pretty-printing (`null, 2`) aids debugging; can be removed for production

## Dependencies
- PBI-38: MCP Protocol Handler (calls `executeTool`)
- PBI-39: Content Reading Utilities (provides `listArticles`, `getArticle`, `searchArticles`)
- PBI-42: Test Infrastructure Setup (provides test helpers)

## Blocked By
- PBI-39 (must exist first)
- PBI-42 (needs test utilities)

## Blocks
- None (final implementation layer)

## Related
- Spec: `/docs/specs/mcp-server/spec.md`
- MCP Tool Result Format: https://modelcontextprotocol.io/specification#tool-result
