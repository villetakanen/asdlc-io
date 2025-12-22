# PBI-37: MCP Edge Function Entry Point

> Status: Ready

## Goal
Create the Netlify Edge Function entry point that handles HTTP requests for the MCP server, routing between SSE streams (GET) and JSON-RPC messages (POST).

## Context
The MCP server needs an HTTP endpoint at `/mcp` that supports two transport modes per the MCP specification:
- **GET /mcp** — Establishes Server-Sent Events stream for server-to-client messages
- **POST /mcp** — Accepts JSON-RPC requests and returns responses

This entry point is the foundation for the MCP server. It must run in Netlify's Edge Functions environment (Deno runtime), not Node.js.

## Spec Reference
`/docs/specs/mcp-server/spec.md` - Section: "Implementation Notes" → "Directory Structure"

## Requirements

### File Location
`/netlify/edge-functions/mcp.ts`

### HTTP Routing
```typescript
export default async function handler(request: Request): Promise<Response> {
  const method = request.method;
  
  if (method === "GET") {
    return handleSSE(request);
  }
  
  if (method === "POST") {
    return handleJsonRpc(request);
  }
  
  return new Response("Method Not Allowed", { status: 405 });
}

export const config = {
  path: "/mcp",
};
```

### SSE Stream (GET)
- Return `Content-Type: text/event-stream`
- Send initial `endpoint` event with POST URL
- Keep connection alive with periodic heartbeats
- Handle connection cleanup on client disconnect

### JSON-RPC Handler (POST)
- Parse JSON body
- Validate JSON-RPC 2.0 format
- Route to appropriate method handler (delegated to PBI-38)
- Return JSON-RPC response with proper `Content-Type: application/json`

### Error Handling
- Invalid JSON: Return `-32700` Parse error
- Invalid JSON-RPC structure: Return `-32600` Invalid Request
- Uncaught exceptions: Return `-32000` Internal error (no stack traces in production)

### CORS Headers
```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
```

## Acceptance Criteria
- [ ] File exists at `/netlify/edge-functions/mcp.ts`
- [ ] GET requests return SSE stream with correct headers
- [ ] POST requests accept JSON and return JSON
- [ ] OPTIONS requests return CORS headers (preflight support)
- [ ] Invalid methods return 405 status
- [ ] Invalid JSON returns `-32700` error
- [ ] Edge function config exports `path: "/mcp"`
- [ ] No Node.js-specific APIs used (Deno-compatible only)
- [ ] Unit tests exist at `/netlify/edge-functions/mcp.test.ts`
- [ ] All tests pass (`pnpm test:run`)

## Testing
**Unit Tests:**
Create `/netlify/edge-functions/mcp.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { createMockRequest, assertJsonRpcError } from '../../src/mcp/test-helpers';
import handler from './mcp';

describe('MCP Edge Function', () => {
  describe('HTTP Method Routing', () => {
    it('handles GET requests for SSE', async () => {
      const req = createMockRequest('GET', 'http://localhost/mcp');
      const res = await handler(req);
      
      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toBe('text/event-stream');
    });

    it('handles POST requests for JSON-RPC', async () => {
      const body = { jsonrpc: '2.0', id: 1, method: 'initialize' };
      const req = createMockRequest('POST', 'http://localhost/mcp', body);
      const res = await handler(req);
      
      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toContain('application/json');
    });

    it('handles OPTIONS requests for CORS', async () => {
      const req = createMockRequest('OPTIONS', 'http://localhost/mcp');
      const res = await handler(req);
      
      expect(res.status).toBe(204);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(res.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    });

    it('rejects unsupported methods', async () => {
      const req = createMockRequest('PUT', 'http://localhost/mcp');
      const res = await handler(req);
      
      expect(res.status).toBe(405);
    });
  });

  describe('Error Handling', () => {
    it('returns parse error for invalid JSON', async () => {
      const req = new Request('http://localhost/mcp', {
        method: 'POST',
        body: 'invalid json',
        headers: { 'Content-Type': 'application/json' },
      });
      const res = await handler(req);
      const json = await res.json();
      
      assertJsonRpcError(json);
      expect(json.error.code).toBe(-32700);
    });

    it('returns invalid request for malformed JSON-RPC', async () => {
      const body = { method: 'test' }; // Missing jsonrpc and id
      const req = createMockRequest('POST', 'http://localhost/mcp', body);
      const res = await handler(req);
      const json = await res.json();
      
      assertJsonRpcError(json);
      expect(json.error.code).toBe(-32600);
    });
  });

  describe('CORS Headers', () => {
    it('includes CORS headers in all responses', async () => {
      const req = createMockRequest('POST', 'http://localhost/mcp', {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
      });
      const res = await handler(req);
      
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });
  });
});
```

**Manual Verification:**
**Manual Verification:**
```bash
# Test SSE stream
curl -N https://mcp.asdlc.io/mcp

# Test JSON-RPC (after PBI-38 is complete)
curl -X POST https://mcp.asdlc.io/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

# Test CORS preflight
curl -X OPTIONS https://mcp.asdlc.io/mcp -v
```

## Notes
- This PBI creates the HTTP layer only; JSON-RPC method routing is in PBI-38
- Use Web Streams API for SSE (not Node.js streams)
- Edge Functions have a 30-second execution limit; SSE streams may need reconnection handling on client side
- Do not import from `@modelcontextprotocol/sdk` — it assumes Node.js runtime

## Dependencies
- PBI-42: Test Infrastructure Setup (provides test helpers)

## Blocked By
- PBI-42 (needs test utilities)

## Blocks
- PBI-38: MCP Protocol Handler (needs entry point to route to)
- PBI-40: MCP Tool Implementations (needs protocol handler)

## Related
- Spec: `/docs/specs/mcp-server/spec.md`
- MCP Transport Spec: https://modelcontextprotocol.io/docs/concepts/transports#http-with-sse
- Netlify Edge Functions: https://docs.netlify.com/edge-functions/overview/
