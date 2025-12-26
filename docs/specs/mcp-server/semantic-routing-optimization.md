# Specification: MCP Tool Semantic Routing Optimization

## Blueprint

### Context

The current MCP server implementation provides three tools (`list_articles`, `get_article`, `search_articles`) to expose ASDLC knowledge base content to AI agents. However, the tool descriptions are **semantically impoverished**, leading to poor routing decisions by LLMs.

**Problem Statement:**

When a user asks domain-specific questions like:
- "What is vibe coding?"
- "How do I use Agent Directives?"
- "What is the ASDLC approach to type safety?"

The LLM **fails to semantically associate** these terms with "articles in the knowledge base" and therefore does not trigger the `search_articles` tool. Instead, it hallucinates generic responses from its training data, bypassing our authoritative content.

**Root Cause:**

Current tool description:
> "Search for articles in the knowledge base using a keyword query."

This description is:
- Too generic (doesn't mention what topics are covered)
- Missing semantic anchors (no reference to ASDLC, AI collaboration, specific concepts)
- Lacks context about when to use it vs. answering from training data

**Business Impact:**

- **Accuracy Loss:** Users receive generic AI responses instead of our specific ASDLC methodologies
- **Discoverability Gap:** High-value content (Concepts, Patterns, Practices) remains hidden
- **Trust Erosion:** When the LLM provides generic advice contradicting our documentation, users lose confidence in the system

**Estimated Improvement:** 40-60% increase in knowledge base "hit rate" for domain-specific queries

### Solution: Prompt Engineering for Tool Descriptions

Apply **semantic routing optimization** to MCP tool JSON schemas by enriching descriptions with:

1. **Domain Keywords:** Specific terms users are likely to ask about (Agent Directives, Schema-First Development, Determinism over Vibes)
2. **Acronym Expansion:** Spell out "ASDLC" as "Agentic Software Development Life Cycle"
3. **Use Case Guidance:** Explicit instructions on when to use each tool
4. **Constraint Documentation:** Prevent common misuse patterns (e.g., guessing slugs)

**Key Principle:** We are not changing tool logic, only their metadata/advertisements to improve LLM semantic matching.

### Architecture

**Affected Component:** `/src/mcp/tools.ts` - `TOOLS` constant

**Unchanged Components:**
- Tool handler logic (`handleToolCall` function)
- Content service (`/src/mcp/content.ts`)
- Protocol handler (`/src/mcp/server.ts`)
- Edge function entry point (`/netlify/edge-functions/mcp.ts`)

**Change Scope:**
- Rename `search_articles` → `search_knowledge_base` (better semantic signal)
- Enrich tool descriptions with domain-specific keywords
- Add explicit usage constraints to `get_article`
- Update parameter descriptions to guide LLM input selection

### Specification

#### Tool 1: `search_knowledge_base` (renamed from `search_articles`)

**Rationale:** The name "search_knowledge_base" is more semantically distinct than "search_articles" and better signals the tool's authoritative domain coverage.

**Current State:**
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

**Required State:**
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

**Key Changes:**
- Name: `search_articles` → `search_knowledge_base`
- Description: Added ASDLC expansion, domain keywords, and collection scope
- Query param: Added concrete examples to guide LLM input construction

#### Tool 2: `get_article`

**Rationale:** LLMs frequently attempt to guess slugs without searching first, causing 404 errors. We must explicitly constrain usage to post-search scenarios.

**Current State:**
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

**Required State:**
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

**Key Changes:**
- Description: Added explicit usage constraint ("ONLY after search")
- Description: Added "Do not attempt to guess slug names"
- Slug param: Added warning against constructing/guessing slugs

#### Tool 3: `list_articles`

**Rationale:** This tool is less frequently used by LLMs during natural conversation, but should still receive semantic enrichment for consistency.

**Current State:**
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

**Required State:**
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

**Key Changes:**
- Description: Added ASDLC expansion
- Description: Clarified content filtering (Live/Experimental only)
- Description: Added use case guidance (browsing, overview)

### Handler Implementation Changes

The tool handlers must be updated to recognize the renamed tool:

**Current:**
```typescript
case "search_articles": {
  const { query } = params;
  if (!query) throw new Error("Missing parameter: query");
  const articles = await contentService.searchArticles(query);
  // ... rest of handler
}
```

**Required:**
```typescript
case "search_knowledge_base": {
  const { query } = params;
  if (!query) throw new Error("Missing parameter: query");
  const articles = await contentService.searchArticles(query);
  // ... rest of handler
}
```

**Note:** Only the case label changes. The underlying `contentService.searchArticles()` implementation remains unchanged.

### Anti-Patterns

**Do Not:**
- Add new tools or change tool logic
- Modify the content service filtering logic
- Change the JSON-RPC protocol handling
- Alter response formats or error codes
- Add runtime validation beyond existing parameter checks

**Do:**
- Only change tool metadata (name, description, parameter descriptions)
- Preserve exact handler logic (only update case label for renamed tool)
- Maintain backward compatibility for other tools (list_articles, get_article)
- Keep descriptions concise but semantically rich

## Contract

### Definition of Done

- [ ] Tool `search_knowledge_base` (renamed from `search_articles`) exists in `TOOLS` array
- [ ] Tool `search_knowledge_base` description includes:
  - [ ] "ASDLC (Agentic Software Development Life Cycle)" expansion
  - [ ] Domain keywords: Agent Directives, Schema-First Development, Determinism over Vibes, Type Safety, Conventional Commits
  - [ ] Collection scope: "Concepts" and "Patterns"
- [ ] Tool `search_knowledge_base` query parameter description includes concrete examples
- [ ] Tool `get_article` description includes "ONLY after search" constraint
- [ ] Tool `get_article` description includes "Do not attempt to guess slug names"
- [ ] Tool `get_article` slug parameter description warns against constructing slugs
- [ ] Tool `list_articles` description includes ASDLC expansion and use case guidance
- [ ] Handler function case label updated: `case "search_knowledge_base"`
- [ ] All existing tests pass with updated tool name
- [ ] MCP Inspector shows new tool descriptions when connected to dev server

### Regression Guardrails

**MUST NOT Regress:**
- Existing tool functionality (list_articles, get_article)
- Content filtering (Draft/Proposed/Deprecated exclusion)
- Error handling for missing parameters
- JSON-RPC protocol compliance
- Response format (MCP content array structure)

**Performance:**
- Tool execution time must remain < 500ms (no change expected, metadata-only)

**Compatibility:**
- Clients using old tool name `search_articles` will receive "Unknown tool" error (expected breaking change)
- Document this in release notes

### Scenarios

#### Scenario 1: LLM Routes Vibe Coding Question to Search Tool

**Given:** User asks "How do I stop vibe coding?"

**When:** LLM evaluates available tools

**Then:** 
- LLM matches "vibe coding" with "Determinism over Vibes" in `search_knowledge_base` description
- LLM calls `search_knowledge_base` with `{ query: "vibe coding" }`
- Knowledge base returns relevant articles (e.g., "Determinism over Vibes" concept)

**Verification:** Test with MCP Inspector + Claude Desktop

#### Scenario 2: LLM Routes Agent Directives Question to Search Tool

**Given:** User asks "What are Agent Directives in ASDLC?"

**When:** LLM evaluates available tools

**Then:**
- LLM matches "Agent Directives" and "ASDLC" keywords
- LLM calls `search_knowledge_base` with `{ query: "Agent Directives" }`
- Knowledge base returns Agent Directives documentation

**Verification:** Test with MCP Inspector + Claude Desktop

#### Scenario 3: LLM Avoids Slug Guessing

**Given:** User asks "Show me the context engineering article"

**When:** LLM evaluates available tools

**Then:**
- LLM does NOT call `get_article` with guessed slug `{ slug: "context-engineering" }`
- LLM first calls `search_knowledge_base` with `{ query: "context engineering" }`
- LLM uses slug from search results to call `get_article`

**Verification:** Monitor tool call sequence in MCP session logs

#### Scenario 4: LLM Ignores Non-Domain Questions

**Given:** User asks "What is the weather today?"

**When:** LLM evaluates available tools

**Then:**
- LLM does NOT call `search_knowledge_base` (no semantic match)
- LLM responds from training data or indicates lack of weather capability

**Verification:** Negative test with MCP Inspector

#### Scenario 5: Backward Incompatibility Handling

**Given:** Legacy client calls `search_articles` (old tool name)

**When:** Tool dispatcher receives unknown tool name

**Then:**
- Handler returns error: `{ content: [{ type: "text", text: "Unknown tool: search_articles" }], isError: true }`

**Verification:** Integration test with old tool name

## Implementation Notes

### Change Checklist

**File: `/src/mcp/tools.ts`**

1. Update TOOLS array:
   - Rename tool from `search_articles` to `search_knowledge_base`
   - Replace tool descriptions per specification
   - Update parameter descriptions with examples/constraints

2. Update handleToolCall function:
   - Change case label: `case "search_articles"` → `case "search_knowledge_base"`
   - Leave handler logic unchanged

3. Test file updates:
   - Update test imports to reference new tool name
   - Update test assertions to expect new descriptions
   - Add new test for backward incompatibility (old tool name returns error)

### Testing Requirements

**Unit Tests (extend existing `/tests/mcp/mcp.edge.test.ts`):**

```typescript
describe('MCP Tool Semantic Routing Optimization', () => {
  it('search_knowledge_base tool includes domain keywords', async () => {
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
  });

  it('get_article tool constrains usage to post-search scenarios', async () => {
    const req = createJsonRpcRequest('tools/list');
    const res = await handler(req);
    const body = await parseJsonRpcResponse(res);
    
    assertJsonRpcSuccess(body);
    const getTool = body.result.tools.find((t: any) => t.name === 'get_article');
    
    expect(getTool.description).toContain('ONLY after');
    expect(getTool.description).toContain('Do not attempt to guess slug names');
  });

  it('old tool name search_articles returns unknown tool error', async () => {
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
});
```

**Manual Verification (MCP Inspector):**

1. Run: `pnpm dev` (start local server)
2. Run: `npx @modelcontextprotocol/inspector`
3. Connect to: `http://localhost:8888/mcp`
4. Navigate to "Tools" tab
5. Verify new tool descriptions are displayed
6. Test tool calls:
   - `search_knowledge_base` with `{ query: "Agent Directives" }`
   - `search_articles` with `{ query: "test" }` (expect error)

**User Acceptance Testing (Claude Desktop):**

1. Configure Claude Desktop with local MCP server
2. Ask: "What is vibe coding in ASDLC?"
3. Observe: Tool call to `search_knowledge_base` in logs
4. Verify: Response includes content from knowledge base
5. Ask: "What is the weather?" (negative test)
6. Verify: No tool call triggered

### Performance Considerations

**No Performance Impact Expected:**
- Changes are metadata-only (tool descriptions)
- Handler logic unchanged
- Content service unchanged
- No new dependencies

**Verification:**
- Run performance tests pre/post change
- Confirm all tool calls remain < 500ms

### Rollout Strategy

**Phase 1: Development**
- Implement changes in feature branch
- Run unit tests
- Verify with MCP Inspector locally

**Phase 2: Staging**
- Deploy to Netlify preview deployment
- Test with Claude Desktop connected to preview URL
- Collect 5+ test queries to verify routing improvement

**Phase 3: Production**
- Merge to main branch
- Deploy via Netlify
- Monitor error rates for "Unknown tool" (expected for legacy clients)
- Document breaking change in release notes

**Rollback Plan:**
- If routing accuracy degrades, revert commit
- If performance regresses, investigate handler logic (should be unchanged)

### Documentation Updates

**Required:**
- Update `/docs/specs/mcp-server/spec.md`:
  - Replace `search_articles` with `search_knowledge_base` in MCP Tools table
  - Add note about tool renaming in changelog section
- Update README (if MCP tools are documented there)
- Add release note: "Breaking change: `search_articles` renamed to `search_knowledge_base` for improved semantic routing"

**Optional:**
- Create blog post explaining semantic routing optimization technique
- Add to ASDLC patterns as case study in prompt engineering

## Resources

- [MCP Specification - Tool Schema](https://modelcontextprotocol.io/specification#tools)
- [Anthropic Guide: Optimizing Tool Descriptions](https://docs.anthropic.com/en/docs/build-with-claude/tool-use#best-practices-for-tool-definitions)
- [Semantic Routing in LLM Applications](https://www.anthropic.com/research/semantic-routing)
- Current Implementation: `/src/mcp/tools.ts`
- Parent Spec: `/docs/specs/mcp-server/spec.md`
