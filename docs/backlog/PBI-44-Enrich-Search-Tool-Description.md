# PBI-44: Enrich search_knowledge_base Tool Description

> Status: Ready

## Goal
Enrich the `search_knowledge_base` tool description with domain-specific keywords and semantic anchors to improve LLM routing accuracy for ASDLC-related queries.

## Context
The current generic description fails to trigger tool usage when users ask domain-specific questions like "What is vibe coding?" or "How do I use Agent Directives?". By stuffing the description with ASDLC-specific keywords, we enable the LLM to semantically match user questions with the knowledge base tool.

This addresses the core problem in the PBI proposal: **40-60% improvement in knowledge base hit rate** for domain queries.

## Spec Reference
`/docs/specs/mcp-server/semantic-routing-optimization.md` - Section: "Tool 1: search_knowledge_base"

## Requirements

### File Location
`/src/mcp/tools.ts`

### Current State
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

### Required State
```typescript
{
  name: "search_knowledge_base",
  description: "The primary search tool for the ASDLC (Agentic Software Development Life Cycle) Knowledge Base. Use this tool whenever the user asks about AI collaboration, Agent Directives, Schema-First Development, Determinism over Vibes, Type Safety, Conventional Commits, or configuring LLM workflows. This tool searches across all 'Concepts' and 'Patterns' in the knowledge base.",
  inputSchema: {
    type: "object",
    properties: {
      query: { 
        type: "string", 
        description: "A specific development topic or keyword (e.g., 'Vibe Coding', 'Agent Directives', 'Zod Schemas', 'Context Engineering')." 
      }
    },
    required: ["query"]
  }
}
```

### Key Changes
1. **Tool Description:**
   - Add ASDLC acronym expansion: "(Agentic Software Development Life Cycle)"
   - Add semantic anchors: "AI collaboration", "Agent Directives", "Schema-First Development", "Determinism over Vibes", "Type Safety", "Conventional Commits", "configuring LLM workflows"
   - Clarify collection scope: "Concepts" and "Patterns"
   - Emphasize primary tool status

2. **Query Parameter Description:**
   - Replace generic "search query string" with specific guidance
   - Add concrete examples: "Vibe Coding", "Agent Directives", "Zod Schemas", "Context Engineering"

## Acceptance Criteria
- [ ] Tool description includes "ASDLC (Agentic Software Development Life Cycle)" expansion
- [ ] Tool description includes all required semantic anchors:
  - [ ] AI collaboration
  - [ ] Agent Directives
  - [ ] Schema-First Development
  - [ ] Determinism over Vibes
  - [ ] Type Safety
  - [ ] Conventional Commits
  - [ ] configuring LLM workflows
- [ ] Tool description mentions "Concepts" and "Patterns" collections
- [ ] Query parameter description includes concrete examples
- [ ] MCP Inspector displays enriched description when connected to dev server
- [ ] All tests pass (`pnpm test:run`)

## Testing

**Unit Test (add to `/tests/mcp/mcp.edge.test.ts`):**

```typescript
describe('search_knowledge_base tool description enrichment', () => {
  it('includes ASDLC expansion and domain keywords', async () => {
    const req = createJsonRpcRequest('tools/list');
    const res = await handler(req);
    const body = await parseJsonRpcResponse(res);
    
    assertJsonRpcSuccess(body);
    const searchTool = body.result.tools.find((t: any) => t.name === 'search_knowledge_base');
    
    expect(searchTool).toBeDefined();
    expect(searchTool.description).toContain('ASDLC (Agentic Software Development Life Cycle)');
    expect(searchTool.description).toContain('Agent Directives');
    expect(searchTool.description).toContain('Determinism over Vibes');
    expect(searchTool.description).toContain('Schema-First Development');
    expect(searchTool.description).toContain('Type Safety');
    expect(searchTool.description).toContain('Conventional Commits');
    expect(searchTool.description).toContain('AI collaboration');
    expect(searchTool.description).toContain('Concepts');
    expect(searchTool.description).toContain('Patterns');
  });

  it('includes concrete examples in query parameter', async () => {
    const req = createJsonRpcRequest('tools/list');
    const res = await handler(req);
    const body = await parseJsonRpcResponse(res);
    
    assertJsonRpcSuccess(body);
    const searchTool = body.result.tools.find((t: any) => t.name === 'search_knowledge_base');
    const queryParam = searchTool.inputSchema.properties.query;
    
    expect(queryParam.description).toContain('Vibe Coding');
    expect(queryParam.description).toContain('Agent Directives');
    expect(queryParam.description).toContain('Zod Schemas');
    expect(queryParam.description).toContain('Context Engineering');
  });
});
```

**Manual Verification (MCP Inspector):**
1. Run `pnpm dev`
2. Run `npx @modelcontextprotocol/inspector`
3. Connect to `http://localhost:8888/mcp`
4. Navigate to "Tools" tab
5. Verify `search_knowledge_base` shows enriched description with all keywords

**User Acceptance Test (Claude Desktop):**
1. Configure Claude Desktop with dev server
2. Ask: "What is vibe coding?"
3. Expected: Tool call to `search_knowledge_base` (check logs)
4. Ask: "How do I use Agent Directives?"
5. Expected: Tool call to `search_knowledge_base`
6. Ask: "What is the weather?" (negative test)
7. Expected: No tool call (answers from training data)

## Notes
- This is **metadata-only** change - no handler logic affected
- No performance impact expected (descriptions are static strings)
- This PBI delivers the core business value: improved routing accuracy

## Dependencies
- PBI-43: Rename search_articles to search_knowledge_base (must complete first)

## Blocks
- None

## Related
- Spec: `/docs/specs/mcp-server/semantic-routing-optimization.md`
- Original Proposal: Acceptance Criteria #3 (Positive Test - Specific)
- Original Proposal: Acceptance Criteria #4 (Positive Test - Acronym)
