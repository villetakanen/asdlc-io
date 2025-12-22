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
});
