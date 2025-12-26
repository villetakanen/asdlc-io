import { describe, it, expect } from 'vitest';
import { createMockRequest, assertJsonRpcError } from '../../src/mcp/test-helpers.ts';
import handler from '../../netlify/edge-functions/mcp.ts';

describe('MCP Edge Function', () => {
  describe('HTTP Method Routing', () => {
    it('handles GET requests for SSE', async () => {
      const req = createMockRequest('GET', 'http://localhost/mcp');
      const res = await handler(req);

      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toBe('text/event-stream');
      expect(res.headers.get('Cache-Control')).toBe('no-cache');
      expect(res.headers.get('Connection')).toBe('keep-alive');
    });

    it('handles POST requests for JSON-RPC', async () => {
      const body = { jsonrpc: '2.0', id: 1, method: 'initialize' };
      const req = createMockRequest('POST', 'http://localhost/mcp', body);
      const res = await handler(req);

      expect(res.status).toBe(200);
      expect(res.headers.get('Content-Type')).toBe('application/json');
    });

    it('handles OPTIONS requests for CORS', async () => {
      const req = createMockRequest('OPTIONS', 'http://localhost/mcp');
      const res = await handler(req);

      expect(res.status).toBe(204);
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(res.headers.get('Access-Control-Allow-Methods')).toContain('POST');
      expect(res.headers.get('Access-Control-Allow-Methods')).toContain('GET');
    });

    it('rejects unsupported methods', async () => {
      const req = createMockRequest('PUT', 'http://localhost/mcp');
      const res = await handler(req);

      expect(res.status).toBe(405);
      const text = await res.text();
      expect(text).toBe('Method Not Allowed');
    });
  });

  describe('SSE Stream', () => {
    it('sends endpoint event with POST URL', async () => {
      const req = createMockRequest('GET', 'http://localhost:8888/mcp');
      const res = await handler(req);

      expect(res.body).toBeDefined();

      // Read the stream
      const reader = res.body!.getReader();
      const { value } = await reader.read();
      const text = new TextDecoder().decode(value);

      expect(text).toContain('event: endpoint');
      expect(text).toContain('http://localhost:8888/mcp');

      reader.cancel();
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
      expect(json.error.message).toBe('Parse error');
    });

    it('returns invalid request for missing jsonrpc field', async () => {
      const body = { id: 1, method: 'test' }; // Missing jsonrpc
      const req = createMockRequest('POST', 'http://localhost/mcp', body);
      const res = await handler(req);
      const json = await res.json();

      assertJsonRpcError(json);
      expect(json.error.code).toBe(-32600);
      expect(json.error.message).toBe('Invalid Request');
    });

    it('returns invalid request for wrong jsonrpc version', async () => {
      const body = { jsonrpc: '1.0', id: 1, method: 'test' };
      const req = createMockRequest('POST', 'http://localhost/mcp', body);
      const res = await handler(req);
      const json = await res.json();

      assertJsonRpcError(json);
      expect(json.error.code).toBe(-32600);
    });

    it('returns invalid request for missing method', async () => {
      const body = { jsonrpc: '2.0', id: 1 }; // Missing method
      const req = createMockRequest('POST', 'http://localhost/mcp', body);
      const res = await handler(req);
      const json = await res.json();

      assertJsonRpcError(json);
      expect(json.error.code).toBe(-32600);
    });

    it('returns method not found for unknown method', async () => {
      const body = { jsonrpc: '2.0', id: 1, method: 'unknown/method' };
      const req = createMockRequest('POST', 'http://localhost/mcp', body);
      const res = await handler(req);
      const json = await res.json();

      assertJsonRpcError(json);
      expect(json.error.code).toBe(-32601);
      expect(json.error.message).toContain('unknown/method');
    });
  });

  describe('CORS Headers', () => {
    it('includes CORS headers in GET responses', async () => {
      const req = createMockRequest('GET', 'http://localhost/mcp');
      const res = await handler(req);

      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });

    it('includes CORS headers in POST responses', async () => {
      const body = { jsonrpc: '2.0', id: 1, method: 'test' };
      const req = createMockRequest('POST', 'http://localhost/mcp', body);
      const res = await handler(req);

      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });

    it('includes CORS headers in error responses', async () => {
      const req = createMockRequest('PUT', 'http://localhost/mcp');
      const res = await handler(req);

      expect(res.headers.get('Access-Control-Allow-Origin')).toBe('*');
    });
  });

  describe('search_knowledge_base tool description enrichment', () => {
    it('includes ASDLC expansion and domain keywords', async () => {
      const body = { jsonrpc: '2.0', id: 2, method: 'tools/list' };
      const req = createMockRequest('POST', 'http://localhost/mcp', body);
      const res = await handler(req);
      const json = await res.json();
      
      const searchTool = json.result.tools.find((t: any) => t.name === 'search_knowledge_base');
      
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
      const body = { jsonrpc: '2.0', id: 3, method: 'tools/list' };
      const req = createMockRequest('POST', 'http://localhost/mcp', body);
      const res = await handler(req);
      const json = await res.json();
      
      const searchTool = json.result.tools.find((t: any) => t.name === 'search_knowledge_base');
      const queryParam = searchTool.inputSchema.properties.query;
      
      expect(queryParam.description).toContain('Vibe Coding');
      expect(queryParam.description).toContain('Agent Directives');
      expect(queryParam.description).toContain('Zod Schemas');
      expect(queryParam.description).toContain('Context Engineering');
    });
  });

  describe('get_article tool constraint enforcement', () => {
    it('includes search-first constraint in description', async () => {
      const body = { jsonrpc: '2.0', id: 4, method: 'tools/list' };
      const req = createMockRequest('POST', 'http://localhost/mcp', body);
      const res = await handler(req);
      const json = await res.json();
      
      const getTool = json.result.tools.find((t: any) => t.name === 'get_article');
      
      expect(getTool).toBeDefined();
      expect(getTool.description).toContain('ONLY after');
      expect(getTool.description).toContain('search_knowledge_base');
      expect(getTool.description).toContain('Do not attempt to guess slug names');
    });

    it('includes slug format examples and warnings', async () => {
      const body = { jsonrpc: '2.0', id: 5, method: 'tools/list' };
      const req = createMockRequest('POST', 'http://localhost/mcp', body);
      const res = await handler(req);
      const json = await res.json();
      
      const getTool = json.result.tools.find((t: any) => t.name === 'get_article');
      const slugParam = getTool.inputSchema.properties.slug;
      
      expect(slugParam.description).toContain('exact slug value');
      expect(slugParam.description).toContain('Do not construct or guess');
      expect(slugParam.description).toMatch(/context-engineering|agent-directives/);
    });
  });

  describe('list_articles tool description enrichment', () => {
    it('includes ASDLC expansion and metadata clarification', async () => {
      const body = { jsonrpc: '2.0', id: 6, method: 'tools/list' };
      const req = createMockRequest('POST', 'http://localhost/mcp', body);
      const res = await handler(req);
      const json = await res.json();
      
      const listTool = json.result.tools.find((t: any) => t.name === 'list_articles');
      
      expect(listTool).toBeDefined();
      expect(listTool.description).toContain('ASDLC (Agentic Software Development Life Cycle)');
      expect(listTool.description).toContain('metadata');
      expect(listTool.description).toContain('Live and Experimental');
    });

    it('includes use case guidance', async () => {
      const body = { jsonrpc: '2.0', id: 7, method: 'tools/list' };
      const req = createMockRequest('POST', 'http://localhost/mcp', body);
      const res = await handler(req);
      const json = await res.json();
      
      const listTool = json.result.tools.find((t: any) => t.name === 'list_articles');
      
      expect(listTool.description).toContain('browse');
      expect(listTool.description).toContain('overview');
    });
  });
});
