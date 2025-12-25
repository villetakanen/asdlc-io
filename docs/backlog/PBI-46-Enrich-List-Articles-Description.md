# PBI-46: Enrich list_articles Tool Description

> Status: Ready

## Goal
Enrich the `list_articles` tool description with ASDLC expansion and use case guidance for consistency with other optimized tools.

## Context
While `list_articles` is less frequently used during natural conversation than `search_knowledge_base`, it should still receive semantic enrichment for consistency and to help LLMs understand when browsing/overview use cases are appropriate.

This completes the semantic routing optimization across all three MCP tools.

## Spec Reference
`/docs/specs/mcp-server/semantic-routing-optimization.md` - Section: "Tool 3: list_articles"

## Requirements

### File Location
`/src/mcp/tools.ts`

### Current State
```typescript
{
  name: "list_articles",
  description: "List all Live and Experimental articles in the ASDLC knowledge base.",
  inputSchema: {
    type: "object",
    properties: {}
  }
}
```

### Required State
```typescript
{
  name: "list_articles",
  description: "Lists all available articles in the ASDLC (Agentic Software Development Life Cycle) Knowledge Base with metadata (title, description, tags, status). Returns only Live and Experimental content. Use this to browse available topics or get an overview of the knowledge base structure.",
  inputSchema: {
    type: "object",
    properties: {}
  }
}
```

### Key Changes
1. **Tool Description:**
   - Add ASDLC acronym expansion: "(Agentic Software Development Life Cycle)"
   - Clarify returned fields: "metadata (title, description, tags, status)"
   - Emphasize filtering: "Returns only Live and Experimental content"
   - Add use case guidance: "browse available topics or get an overview"

## Acceptance Criteria
- [ ] Tool description includes "ASDLC (Agentic Software Development Life Cycle)" expansion
- [ ] Tool description clarifies metadata fields returned
- [ ] Tool description mentions Live and Experimental filtering
- [ ] Tool description includes use case guidance (browsing, overview)
- [ ] MCP Inspector displays enriched description
- [ ] All tests pass (`pnpm test:run`)

## Testing

**Unit Test (add to `/tests/mcp/mcp.edge.test.ts`):**

```typescript
describe('list_articles tool description enrichment', () => {
  it('includes ASDLC expansion and metadata clarification', async () => {
    const req = createJsonRpcRequest('tools/list');
    const res = await handler(req);
    const body = await parseJsonRpcResponse(res);
    
    assertJsonRpcSuccess(body);
    const listTool = body.result.tools.find((t: any) => t.name === 'list_articles');
    
    expect(listTool).toBeDefined();
    expect(listTool.description).toContain('ASDLC (Agentic Software Development Life Cycle)');
    expect(listTool.description).toContain('metadata');
    expect(listTool.description).toContain('Live and Experimental');
  });

  it('includes use case guidance', async () => {
    const req = createJsonRpcRequest('tools/list');
    const res = await handler(req);
    const body = await parseJsonRpcResponse(res);
    
    assertJsonRpcSuccess(body);
    const listTool = body.result.tools.find((t: any) => t.name === 'list_articles');
    
    expect(listTool.description).toContain('browse');
    expect(listTool.description).toContain('overview');
  });
});
```

**Manual Verification (MCP Inspector):**
1. Run `pnpm dev`
2. Run `npx @modelcontextprotocol/inspector`
3. Connect to `http://localhost:8888/mcp`
4. Navigate to "Tools" tab
5. Verify `list_articles` shows enriched description

## Notes
- This is **metadata-only** change - no handler logic affected
- No performance impact expected
- Completes the semantic routing optimization initiative
- Less critical than search/get tool optimizations but important for consistency

## Dependencies
- None (independent change)

## Blocks
- None

## Related
- Spec: `/docs/specs/mcp-server/semantic-routing-optimization.md`
- Original Proposal: Task C (Acronym Expansion)
- PBI-43: Rename search_articles to search_knowledge_base
- PBI-44: Enrich search_knowledge_base Description
- PBI-45: Add Usage Constraints to get_article
