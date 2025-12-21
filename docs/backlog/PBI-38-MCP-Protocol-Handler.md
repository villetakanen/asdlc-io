# PBI-38: MCP Protocol Handler

> Status: Ready

## Goal
Implement the MCP JSON-RPC protocol handler that routes method calls to appropriate handlers and manages the MCP session lifecycle.

## Context
The MCP specification defines a set of standard methods that clients use to discover capabilities and invoke tools. This handler sits between the HTTP layer (PBI-37) and the tool implementations (PBI-40), providing protocol-level routing and validation.

## Spec Reference
`/docs/specs/mcp-server/spec.md` - Sections: "MCP JSON-RPC Format", "Error Codes"

## Requirements

### File Location
`/src/mcp/server.ts`

### Supported Methods

| Method | Description | Handler |
|--------|-------------|---------|
| `initialize` | Client handshake, returns server info | Built-in |
| `notifications/initialized` | Client confirms initialization | Built-in (no response) |
| `tools/list` | List available tools | Built-in |
| `tools/call` | Execute a tool | Delegates to tools.ts |

### Server Info Response
```typescript
const serverInfo = {
  name: "asdlc-knowledge-base",
  version: "1.0.0", // Read from package.json if possible
  protocolVersion: "2024-11-05",
  capabilities: {
    tools: {},
  },
};
```

### Method Router
```typescript
type JsonRpcRequest = {
  jsonrpc: "2.0";
  id?: string | number;
  method: string;
  params?: Record<string, unknown>;
};

type JsonRpcResponse = {
  jsonrpc: "2.0";
  id: string | number;
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
};

export async function handleMethod(request: JsonRpcRequest): Promise<JsonRpcResponse | null> {
  // Notifications (no id) return null
  // Methods return JsonRpcResponse
}
```

### Tool Definitions
```typescript
const tools = [
  {
    name: "list_articles",
    description: "List all ASDLC knowledge base articles (Live and Experimental only)",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: ["concepts", "patterns", "practices"],
          description: "Filter by content category",
        },
        limit: {
          type: "number",
          description: "Maximum number of articles to return",
        },
      },
    },
  },
  {
    name: "get_article",
    description: "Get the full content of a specific article by slug",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "Article slug (filename without extension)",
        },
      },
      required: ["slug"],
    },
  },
  {
    name: "search_articles",
    description: "Search articles by keyword in title, tags, or description",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query",
        },
        include_content: {
          type: "boolean",
          description: "Include full markdown content in results",
          default: false,
        },
      },
      required: ["query"],
    },
  },
];
```

### Error Handling
- Unknown method: Return `-32601` Method not found
- Invalid params: Return `-32602` Invalid params
- Tool execution error: Return `-32603` Internal error with descriptive message

## Acceptance Criteria
- [ ] File exists at `/src/mcp/server.ts`
- [ ] `initialize` method returns server info with capabilities
- [ ] `tools/list` returns all three tool definitions
- [ ] `tools/call` routes to tool implementations (from PBI-40)
- [ ] Unknown methods return `-32601` error
- [ ] Notifications (requests without `id`) return `null` (no response)
- [ ] All responses include `jsonrpc: "2.0"` and matching `id`
- [ ] No Node.js-specific APIs used

## Testing
**Unit Tests:**
```typescript
// Test initialize
const result = await handleMethod({
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: { clientInfo: { name: "test" } },
});
expect(result.result.name).toBe("asdlc-knowledge-base");

// Test unknown method
const error = await handleMethod({
  jsonrpc: "2.0",
  id: 2,
  method: "unknown/method",
});
expect(error.error.code).toBe(-32601);
```

## Notes
- The protocol handler is stateless; each request is independent
- Tool execution is delegated to `/src/mcp/tools.ts` (PBI-40)
- Version should ideally be read from package.json, but may need to be hardcoded for Edge Functions bundling
- Protocol version `2024-11-05` is the current MCP spec version

## Dependencies
- PBI-37: MCP Edge Function Entry Point (calls this handler)

## Blocked By
- None (can be developed in parallel with PBI-37)

## Blocks
- PBI-40: MCP Tool Implementations (this handler routes to tools)

## Related
- Spec: `/docs/specs/mcp-server/spec.md`
- MCP Specification: https://modelcontextprotocol.io/specification
