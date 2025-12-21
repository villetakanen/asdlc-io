# Feature: MCP ASDLC Knowledge Base Server

## Blueprint

### Context

AI agents (Claude Code, Gemini CLI, Cursor, etc.) need programmatic access to ASDLC knowledge base content for context when assisting with agentic development tasks — referencing concepts, applying patterns, or following practices. The Model Context Protocol (MCP) provides a standardized way to expose this content across different AI tooling.

This server runs as a Netlify Edge Function at `asdlc.io/mcp`, built from the same source repository as the main Astro site.

### Architecture

**Transport:** HTTP with Server-Sent Events (SSE) per MCP remote server spec

**Endpoint:** `https://asdlc.io/mcp`
- `POST /mcp` — JSON-RPC message handling
- `GET /mcp` — SSE stream for server-to-client messages

**Content Source:** `./src/content/{concepts,patterns,practices}/*.md` (shared with Astro build)

**Dependencies:**
- Reads from: Astro content directory (markdown files with frontmatter)
- Consumed by: MCP-compatible clients (Claude Desktop, Cursor, Gemini, etc.)

**Data Flow:**
```
┌─────────────────┐     HTTP/SSE      ┌──────────────────────┐
│   MCP Client    │ ◄───────────────► │  Netlify Edge Func   │
│ (Claude, etc.)  │    JSON-RPC       │   asdlc.io/mcp       │
└─────────────────┘                   └──────────┬───────────┘
                                                 │ fs read
                                      ┌──────────▼───────────┐
                                      │  ./src/content/      │
                                      │  {concepts,patterns, │
                                      │   practices}/*.md    │
                                      └──────────────────────┘
```

**MCP Tools:**

| Tool | Description | Input |
|:-----|:------------|:------|
| `list_articles` | List all articles with metadata (no content) | `{ category?: "concepts" \| "patterns" \| "practices", limit?: number }` |
| `get_article` | Get full content of a specific article | `{ slug: string }` |
| `search_articles` | Search by keyword in title/tags/description | `{ query: string, include_content?: boolean }` |

**Article Schema:**

```typescript
interface Article {
  slug: string;           // Filename without extension
  category: "concepts" | "patterns" | "practices";
  title: string;
  description: string;    // Max 200 chars
  tags: string[];
  lastUpdated: string;    // ISO 8601
  status: "Live" | "Experimental";  // Only these statuses exposed
  maturity?: "Proposed" | "Standard" | "Deprecated" | "Experimental";
  relatedIds?: string[];
  content?: string;       // Markdown body, only in get_article responses
}
```

**Frontmatter Format** (existing, do not change):

```yaml
title: "Article Title"
description: "Short description (max 200 chars)"
tags: ["tag1", "tag2", "tag3"]
lastUpdated: 2025-01-15
status: "Live"  # Draft | Proposed | Live | Deprecated | Experimental
maturity: "Standard"  # Optional: Proposed | Standard | Deprecated | Experimental
supersededBy: ["new-article-id"]  # Optional
relatedIds: ["related-id-1", "related-id-2"]  # Optional
```

**Content Filtering (Critical):**

Only articles with these statuses are exposed via MCP:
- `Live` — Production-ready, ratified standards
- `Experimental` — Emerging patterns, clearly marked as high-risk

Articles with these statuses are **NOT exposed**:
- `Draft` — Internal only, subject to major rewrites
- `Proposed` — Consensus pending, not yet approved
- `Deprecated` — No longer recommended, replaced by newer patterns

This filtering ensures agents only receive content that is recommended for use.

### Anti-Patterns

- **Do not** bundle the MCP server into the Astro build — keep builds separate
- **Do not** use `@modelcontextprotocol/sdk` server utilities that assume Node.js runtime — Edge Functions use Deno/Web APIs
- **Do not** cache aggressively — content should reflect latest deployed state
- **Do not** expose Draft, Proposed, or Deprecated content — these are not recommended for agent consumption
- **Do not** include `node_modules` or build tooling in the edge function bundle

## Contract

### Definition of Done

- [ ] `GET https://asdlc.io/mcp` returns SSE stream with MCP `endpoint` event
- [ ] `POST https://asdlc.io/mcp` accepts JSON-RPC and responds per MCP spec
- [ ] `tools/list` returns the three defined tools with correct schemas
- [ ] `list_articles` returns all published articles (Live + Experimental only) sorted by date descending
- [ ] `list_articles` supports optional `category` filter for concepts/patterns/practices
- [ ] `get_article` returns full markdown content for valid slugs, error for invalid
- [ ] `search_articles` finds articles matching query in title, tags, or description
- [ ] Server identifies as `asdlc-knowledge-base` with version matching `package.json`
- [ ] Works with Claude Desktop MCP client configuration
- [ ] Deployed via Netlify Edge Functions

### Regression Guardrails

- MCP endpoints MUST NOT break the main site build or deployment
- Response times MUST stay under 500ms for `list_articles` and `get_article`
- Server MUST handle malformed JSON-RPC gracefully with proper error responses
- Draft, Proposed, and Deprecated articles MUST NOT appear in any tool responses

### Scenarios

**Scenario: Client discovers available tools**
- Given: MCP client connects to `asdlc.io/mcp`
- When: Client sends `tools/list` request
- Then: Server responds with `list_articles`, `get_article`, `search_articles` tool definitions

**Scenario: Client lists all articles**
- Given: Knowledge base has articles across concepts, patterns, and practices
- When: Client calls `list_articles` with `{}`
- Then: Server returns all Live and Experimental articles with metadata, no content bodies
- And: Draft, Proposed, and Deprecated articles are NOT included

**Scenario: Client lists articles by category**
- Given: Knowledge base has multiple patterns with status Live
- When: Client calls `list_articles` with `{ category: "patterns" }`
- Then: Server returns only pattern articles (Live + Experimental)

**Scenario: Client retrieves specific article**
- Given: Article with slug `context-engineering` exists with status Live
- When: Client calls `get_article` with `{ slug: "context-engineering" }`
- Then: Server returns full article including markdown content

**Scenario: Client requests Draft article**
- Given: Article with slug `draft-concept` exists with status Draft
- When: Client calls `get_article` with `{ slug: "draft-concept" }`
- Then: Server returns MCP error response: "Article 'draft-concept' not found"

**Scenario: Client searches articles**
- Given: Articles exist with tag "Context Engineering"
- When: Client calls `search_articles` with `{ query: "context" }`
- Then: Server returns all Live/Experimental articles matching "context" in title, tags, or description

**Scenario: Client requests non-existent article**
- Given: No article with slug `does-not-exist`
- When: Client calls `get_article` with `{ slug: "does-not-exist" }`
- Then: Server returns MCP error response with clear message

## Implementation Notes

### Directory Structure

```
/netlify
  /edge-functions
    mcp.ts              # Edge function entry point
/src
  /mcp
    server.ts           # MCP protocol handling
    tools.ts            # Tool implementations
    content.ts          # Article content reading utilities
```

### Build Configuration

Add to `netlify.toml`:

```toml
[[edge_functions]]
  path = "/mcp"
  function = "mcp"
```

### Dependencies

**Runtime:** Netlify Edge Functions (Deno Deploy runtime)

**File System Access:**
- Edge Functions have read-only access to bundled files at deploy time
- Use `import.meta.url` with relative paths to read content
- Example: `new URL('../../src/content/', import.meta.url)`

**Frontmatter Parsing:**
- Use `https://deno.land/std/yaml/parse.ts` for YAML frontmatter
- Manual regex parsing: `/^---\n([\s\S]*?)\n---\n([\s\S]*)$/`
- Gracefully handle malformed frontmatter with JSON-RPC error responses

**Content Filtering Logic:**

```typescript
const ALLOWED_STATUSES = ["Live", "Experimental"] as const;

function isExposed(article: ArticleData): boolean {
  return ALLOWED_STATUSES.includes(article.status);
}
```

**Validation:**
- Use native TypeScript type checking or simple validation functions
- Avoid npm packages like Zod unless confirmed to work in Deno Edge runtime

### Search Algorithm

**`search_articles` implementation:**

1. **Pre-filter:** Only search within Live and Experimental articles

2. **Matching Logic:**
   - Case-insensitive substring search
   - Searches in: title, tags array, description
   - Match if query appears in ANY of these fields

3. **Scoring/Ranking:**
   - Title match: weight 3
   - Tag match: weight 2
   - Description match: weight 1
   - Multiple matches accumulate weight

4. **Sorting:**
   - Primary: Total weight (descending)
   - Secondary: lastUpdated (descending - newest first)

5. **Content Inclusion:**
   - If `include_content: false` (default): Return metadata only
   - If `include_content: true`: Include full markdown content in results

### MCP JSON-RPC Format

**Success Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      { "type": "text", "text": "{ ... serialized Article ... }" }
    ]
  }
}
```

**Error Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32602,
    "message": "Article 'invalid-slug' not found",
    "data": { "slug": "invalid-slug" }
  }
}
```

**Error Codes:**

| Code | Scenario | Message Template |
|------|----------|------------------|
| `-32700` | Invalid JSON | "Parse error" |
| `-32600` | Invalid JSON-RPC | "Invalid Request" |
| `-32601` | Method not found | "Method '{method}' not found" |
| `-32602` | Invalid params / Not found | "Article '{slug}' not found" |
| `-32603` | Internal error / Parse failure | "Failed to parse article metadata" |
| `-32000` | Filesystem/Server error | "Internal server error" |

### Performance Considerations

**Caching Strategy:**
- In-memory cache for parsed articles with 5-minute TTL
- Cache invalidation on deploy (automatic with Edge Function restarts)
- Cache key: file path + last modified time

**Performance Targets:**
- `list_articles`: < 200ms (local), < 500ms (production)
- `get_article`: < 300ms (local), < 500ms (production)
- `search_articles`: < 400ms (local), < 600ms (production)

**Optimization:**
- Lazy-load content: Only parse markdown body when needed
- Reuse parsed frontmatter across requests
- Limit `list_articles` default to 50 articles (configurable via `limit` param)

### Testing Requirements

**Unit Tests:**
- Frontmatter parsing (valid, invalid, missing fields)
- Status filtering (verify Draft/Proposed/Deprecated are excluded)
- Search algorithm (scoring, sorting, edge cases)
- Error handling for each tool

**Integration Tests:**
- Full JSON-RPC request/response cycle
- SSE stream initialization
- Tool discovery via `tools/list`

**Performance Tests:**
- Measure response times under load
- Test with 30+ articles
- Verify cache effectiveness

### Claude Desktop Configuration

Users add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "asdlc-knowledge-base": {
      "url": "https://asdlc.io/mcp"
    }
  }
}
```

## Resources

- [MCP Specification](https://modelcontextprotocol.io/specification)
- [MCP Remote Servers (HTTP+SSE)](https://modelcontextprotocol.io/docs/concepts/transports#http-with-sse)
- [Netlify Edge Functions](https://docs.netlify.com/edge-functions/overview/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [ASDLC Legend & Taxonomy](/resources/legend) — Status and maturity definitions
