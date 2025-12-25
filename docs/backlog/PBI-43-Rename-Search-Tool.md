# PBI-43: Rename search_articles to search_knowledge_base

> Status: Done

## Goal
Rename the `search_articles` MCP tool to `search_knowledge_base` to provide better semantic signals to LLMs about the tool's authoritative domain coverage.

## Context
The current tool name "search_articles" is semantically weak. The name "search_knowledge_base" better signals the tool's role as the authoritative source for ASDLC domain knowledge, improving LLM routing decisions.

This is part of the MCP Tool Semantic Routing Optimization initiative (see `/docs/specs/mcp-server/semantic-routing-optimization.md`).

## Spec Reference
`/docs/specs/mcp-server/semantic-routing-optimization.md` - Section: "Tool 1: search_knowledge_base"

## Requirements

### File Location
`/src/mcp/tools.ts`

### Changes Required

**1. Update TOOLS array:**

Change tool definition from:
```typescript
{
  name: "search_articles",
  description: "Search for articles in the knowledge base using a keyword query.",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "The search query string." }
    },
    required: ["query"]
  }
}
```

To:
```typescript
{
  name: "search_knowledge_base",
  description: "Search for articles in the knowledge base using a keyword query.",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "The search query string." }
    },
    required: ["query"]
  }
}
```

**Note:** Description remains unchanged in this PBI (will be enriched in PBI-44).

**2. Update handleToolCall function:**

Change case label from:
```typescript
case "search_articles": {
```

To:
```typescript
case "search_knowledge_base": {
```

**Note:** Handler logic remains completely unchanged.

## Acceptance Criteria
- [ ] Tool name changed from `search_articles` to `search_knowledge_base` in TOOLS array
- [ ] Case label updated in handleToolCall function
- [ ] Calling old tool name `search_articles` returns unknown tool error
- [ ] Calling new tool name `search_knowledge_base` returns search results
- [ ] All existing unit tests updated to use new tool name
- [ ] All tests pass (`pnpm test:run`)

## Testing

**Update existing tests:**

In `/tests/mcp/mcp.edge.test.ts`, replace all references to `search_articles` with `search_knowledge_base`:

```typescript
// Example test update
it('calls search_knowledge_base tool successfully', async () => {
  const req = createJsonRpcRequest('tools/call', {
    name: 'search_knowledge_base',
    arguments: { query: 'context' }
  });
  const res = await handler(req);
  const body = await parseJsonRpcResponse(res);
  
  assertJsonRpcSuccess(body);
  expect(body.result.content).toBeDefined();
});
```

**Add backward incompatibility test:**

```typescript
it('returns error for old tool name search_articles', async () => {
  const req = createJsonRpcRequest('tools/call', {
    name: 'search_articles',
    arguments: { query: 'test' }
  });
  const res = await handler(req);
  const body = await parseJsonRpcResponse(res);
  
  assertJsonRpcSuccess(body);
  expect(body.result.isError).toBe(true);
  expect(body.result.content[0].text).toContain('Unknown tool');
});
```

## Notes
- This is a **breaking change** for existing MCP clients using the old tool name
- The tool name change alone provides improved semantic routing even before description enrichment
- This PBI is intentionally scoped to just the rename; description enrichment is in PBI-44

## Dependencies
- None (independent change)

## Blocks
- PBI-44 (description enrichment builds on this renamed tool)

## Related
- Spec: `/docs/specs/mcp-server/semantic-routing-optimization.md`
- PBI-44: Enrich search_knowledge_base Description
- PBI-45: Add Usage Constraints to get_article
- PBI-46: Enrich list_articles Description
