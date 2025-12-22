# MCP Server - PBI Index

> Epic: MCP ASDLC Knowledge Base Server
> Spec: `/docs/specs/mcp-server/spec.md`
> Status: Ready

## Overview

This epic implements an MCP (Model Context Protocol) server that exposes ASDLC knowledge base content to AI agents. The server runs as a Netlify Edge Function at `asdlc.io/mcp`.

**Key Constraint:** Only articles with status `Live` or `Experimental` are exposed. Draft, Proposed, and Deprecated content is filtered out to ensure agents only receive recommended content.

## PBI List

### PBI-37: MCP Edge Function Entry Point
**Status:** Ready  
**Priority:** P0 (Foundational)  
**Effort:** Small  
**Dependencies:** None

Create the Netlify Edge Function that handles HTTP routing between SSE streams (GET) and JSON-RPC messages (POST).

**Deliverable:** `/netlify/edge-functions/mcp.ts`

---

### PBI-38: MCP Protocol Handler
**Status:** Ready  
**Priority:** P0 (Foundational)  
**Effort:** Medium  
**Dependencies:** None (can develop in parallel with PBI-37)

Implement JSON-RPC method routing for MCP protocol methods (`initialize`, `tools/list`, `tools/call`).

**Deliverable:** `/src/mcp/server.ts`

---

### PBI-39: Content Reading Utilities
**Status:** Ready  
**Priority:** P0 (Foundational)  
**Effort:** Medium  
**Dependencies:** None (can develop first)

Create utilities for reading markdown files, parsing frontmatter, and filtering by status.

**Deliverable:** `/src/mcp/content.ts`

---

### PBI-40: MCP Tool Implementations
**Status:** Ready  
**Priority:** P1  
**Effort:** Medium  
**Dependencies:** PBI-39 (needs content utilities)

Implement the three MCP tools: `list_articles`, `get_article`, `search_articles`.

**Deliverable:** `/src/mcp/tools.ts`

---

### PBI-41: Netlify Configuration
**Status:** Ready  
**Priority:** P2 (Final step)  
**Effort:** Small  
**Dependencies:** PBI-37, 38, 39, 40 (all code must exist)

Configure Netlify Edge Functions for deployment.

**Deliverable:** Updated `netlify.toml`

---

### PBI-42: Test Infrastructure Setup
**Status:** Ready  
**Priority:** P0 (Foundational)  
**Effort:** Small  
**Dependencies:** None

Set up Vitest testing infrastructure with test helpers and utilities.

**Deliverable:** `vitest.config.ts`, test scripts, `/src/mcp/test-helpers.ts`

---

## Implementation Order

### Phase 0: Test Infrastructure
0. **PBI-42** - Test Infrastructure Setup (must be first)

### Phase 1: Foundation (Parallel Development)
These can be developed simultaneously by different developers or in any order:

1. **PBI-39** - Content Reading Utilities (data layer, no dependencies)
2. **PBI-37** - Edge Function Entry Point (HTTP layer)
3. **PBI-38** - Protocol Handler (routing layer)

### Phase 2: Integration
4. **PBI-40** - Tool Implementations (requires PBI-39)

### Phase 3: Deployment
5. **PBI-41** - Netlify Configuration (requires all above)

## Dependency Graph

```
PBI-42 (Test Infra) ────┬───────────────────────┐
                        │                       │
                        ├─→ PBI-39 (Content) ───┤
                        │                       │
                        ├─→ PBI-37 (Entry) ─┐   ├─→ PBI-40 (Tools) ──┐
                        │                   │   │                     │
                        └─→ PBI-38 (Protocol)───┘                     ├─→ PBI-41 (Deploy)
                                                                      │
                                        ┌─────────────────────────────┘
                                        │
                                        └─→ MCP Server Live
```

## Definition of Done (Epic)

- [ ] All six PBIs completed and merged
- [ ] All tests passing (`pnpm test:run`)
- [ ] `GET https://asdlc.io/mcp` returns SSE stream
- [ ] `POST https://asdlc.io/mcp` accepts JSON-RPC
- [ ] `tools/list` returns three tool definitions
- [ ] `list_articles` returns Live and Experimental articles only
- [ ] `get_article` returns full content for valid slugs
- [ ] `search_articles` finds matching articles
- [ ] Draft, Proposed, Deprecated articles are never exposed
- [ ] Response times under 500ms
- [ ] Works with Claude Desktop MCP client

## Verification Scenarios

**Scenario: Agent Lists Available Content**
- Given: MCP client connects to `asdlc.io/mcp`
- When: Client calls `list_articles`
- Then: Server returns all Live and Experimental articles
- And: Draft, Proposed, Deprecated articles are NOT included

**Scenario: Agent Retrieves Specific Article**
- Given: Article "context-engineering" has status Live
- When: Client calls `get_article({ slug: "context-engineering" })`
- Then: Server returns full article with markdown content

**Scenario: Agent Searches Knowledge Base**
- Given: Multiple articles contain "autonomy" in title/tags/description
- When: Client calls `search_articles({ query: "autonomy" })`
- Then: Server returns matching articles, sorted by relevance

**Scenario: Agent Requests Draft Article**
- Given: Article "draft-concept" has status Draft
- When: Client calls `get_article({ slug: "draft-concept" })`
- Then: Server returns error "Article 'draft-concept' not found"

## Effort Estimate

| PBI | Effort | Hours (Est.) |
|-----|--------|--------------|
| PBI-42 | Small | 1-2 |
| PBI-37 | Small | 2-3 |
| PBI-38 | Medium | 3-4 |
| PBI-39 | Medium | 3-4 |
| PBI-40 | Medium | 2-3 |
| PBI-41 | Small | 1-2 |
| **Total** | | **12-18** |

## Notes

- **Runtime:** Netlify Edge Functions use Deno, not Node.js
- **No SDK:** Cannot use `@modelcontextprotocol/sdk` (Node.js only)
- **Status Filtering:** Critical requirement - must filter at data layer (PBI-39)
- **Caching:** 5-minute TTL, auto-invalidates on deploy
- **Testing:** Use `netlify dev` for local Edge Function testing

## Related Files

- Spec: `/docs/specs/mcp-server/spec.md`
- Content Schema: `/src/content/config.ts`
- Legend (status definitions): `/src/content/resources/legend.md`

## Resources

- [MCP Specification](https://modelcontextprotocol.io/specification)
- [MCP Remote Servers](https://modelcontextprotocol.io/docs/concepts/transports#http-with-sse)
- [Netlify Edge Functions](https://docs.netlify.com/edge-functions/overview/)
