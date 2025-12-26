# PBI-45: Add Usage Constraints to get_article Tool

> Status: Done

## Goal
Add explicit usage constraints to the `get_article` tool description to prevent LLMs from guessing slug values, which causes 404 errors and poor user experience.

## Context
LLMs frequently attempt to construct or guess slug values (e.g., `get_article('agents')`, `get_article('context-engineering')`) without first searching for valid slugs. This results in "Article not found" errors.

By explicitly constraining the tool description to require prior search, we guide the LLM to the correct two-step flow:
1. Search for relevant articles using `search_knowledge_base`
2. Use the returned slug to fetch full content via `get_article`

This addresses **Acceptance Criterion #5** from the original proposal: "The LLM no longer attempts to call `get_article` without searching first."

## Spec Reference
`/docs/specs/mcp-server/semantic-routing-optimization.md` - Section: "Tool 2: get_article"

## Requirements

### File Location
`/src/mcp/tools.ts`

### Current State
```typescript
{
  name: "get_article",
  description: "Get the full content of a specific article by its slug.",
  inputSchema: {
    type: "object",
    properties: {
      slug: { type: "string", description: "The unique identifier (slug) of the article." }
    },
    required: ["slug"]
  }
}
```

### Required State
```typescript
{
  name: "get_article",
  description: "Retrieves the full markdown content of a specific concept or pattern. Use this ONLY after you have performed a search using 'search_knowledge_base' and have a valid 'slug' from the search results. Do not attempt to guess slug names.",
  inputSchema: {
    type: "object",
    properties: {
      slug: { 
        type: "string", 
        description: "The exact slug value from a search result (e.g., 'context-engineering', 'agent-directives'). Do not construct or guess slug values." 
      }
    },
    required: ["slug"]
  }
}
```

### Key Changes
1. **Tool Description:**
   - Add constraint: "Use this ONLY after you have performed a search using 'search_knowledge_base'"
   - Add explicit warning: "Do not attempt to guess slug names"
   - Clarify content type: "markdown content of a specific concept or pattern"

2. **Slug Parameter Description:**
   - Replace generic description with specific guidance
   - Add examples of valid slug format
   - Add warning: "Do not construct or guess slug values"

## Acceptance Criteria
- [ ] Tool description includes "ONLY after you have performed a search" constraint
- [ ] Tool description includes "Do not attempt to guess slug names" warning
- [ ] Tool description references `search_knowledge_base` tool by name
- [ ] Slug parameter description includes examples ('context-engineering', 'agent-directives')
- [ ] Slug parameter description includes warning against guessing
- [ ] MCP Inspector displays updated description
- [ ] All tests pass (`pnpm test:run`)

## Testing

**Unit Test (add to `/tests/mcp/mcp.edge.test.ts`):**

```typescript
describe('get_article tool constraint enforcement', () => {
  it('includes search-first constraint in description', async () => {
    const req = createJsonRpcRequest('tools/list');
    const res = await handler(req);
    const body = await parseJsonRpcResponse(res);
    
    assertJsonRpcSuccess(body);
    const getTool = body.result.tools.find((t: any) => t.name === 'get_article');
    
    expect(getTool).toBeDefined();
    expect(getTool.description).toContain('ONLY after');
    expect(getTool.description).toContain('search_knowledge_base');
    expect(getTool.description).toContain('Do not attempt to guess slug names');
  });

  it('includes slug format examples and warnings', async () => {
    const req = createJsonRpcRequest('tools/list');
    const res = await handler(req);
    const body = await parseJsonRpcResponse(res);
    
    assertJsonRpcSuccess(body);
    const getTool = body.result.tools.find((t: any) => t.name === 'get_article');
    const slugParam = getTool.inputSchema.properties.slug;
    
    expect(slugParam.description).toContain('exact slug value');
    expect(slugParam.description).toContain('Do not construct or guess');
    expect(slugParam.description).toMatch(/context-engineering|agent-directives/);
  });
});
```

**Manual Verification (MCP Inspector):**
1. Run `pnpm dev`
2. Run `npx @modelcontextprotocol/inspector`
3. Connect to `http://localhost:8888/mcp`
4. Navigate to "Tools" tab
5. Verify `get_article` shows constraints and warnings

**User Acceptance Test (Claude Desktop):**
1. Configure Claude Desktop with dev server
2. Ask: "Show me the context engineering article"
3. Expected behavior:
   - Step 1: LLM calls `search_knowledge_base` with query "context engineering"
   - Step 2: LLM calls `get_article` with slug from search results
   - No direct `get_article` call with guessed slug
4. Monitor tool call sequence in session logs

## Notes
- This is **metadata-only** change - no handler logic affected
- No performance impact expected
- The constraint is advisory (soft constraint) - the tool will still work if called directly, but LLMs should avoid it
- This PBI prevents a common anti-pattern observed in MCP usage

## Dependencies
- None (independent change to get_article tool)

## Blocks
- None

## Related
- Spec: `/docs/specs/mcp-server/semantic-routing-optimization.md`
- Original Proposal: Task B (Constrain get_article)
- Original Proposal: Acceptance Criterion #5 (Error Handling)
