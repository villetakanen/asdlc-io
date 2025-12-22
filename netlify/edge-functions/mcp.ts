/**
 * MCP (Model Context Protocol) Server - Edge Function Entry Point
 *
 * Handles HTTP requests for the MCP server:
 * - GET: Server-Sent Events (SSE) stream
 * - POST: JSON-RPC 2.0 messages
 * - OPTIONS: CORS preflight
 */

// @ts-ignore: External Netlify Edge types
import type { Config } from 'https://edge.netlify.com';
import { ContentService } from '../../src/mcp/content.ts';
import { McpServer } from '../../src/mcp/server.ts';
// CORS headers for all responses
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// @ts-ignore: JSON import
import articles from '../../src/mcp/articles.json' with { type: 'json' };

// Global instances (lazy-loaded to allow testing in Node)
let contentService: ContentService;
let mcpServer: McpServer;

function getMcpServer() {
  if (!mcpServer) {
    contentService = new ContentService(articles as any);
    mcpServer = new McpServer(contentService);
  }
  return mcpServer;
}

/**
 * Handle SSE stream for server-to-client messages
 */
function handleSSE(request: Request): Response {
  const url = new URL(request.url);
  const postUrl = `${url.protocol}//${url.host}${url.pathname}`;

  // Create SSE stream
  const stream = new ReadableStream({
    start(controller) {
      // Send initial endpoint event
      const event = `event: endpoint\ndata: ${JSON.stringify({ url: postUrl })}\n\n`;
      controller.enqueue(new TextEncoder().encode(event));

      // Keep connection alive with periodic heartbeats
      const heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(new TextEncoder().encode(': heartbeat\n\n'));
        } catch {
          // @ts-ignore: Timer type mismatch between Node and Deno
          clearInterval(heartbeatInterval);
        }
      }, 15000); // Every 15 seconds

      // Cleanup on close
      const cleanup = () => {
        // @ts-ignore: Timer type mismatch between Node and Deno
        clearInterval(heartbeatInterval);
        try {
          controller.close();
        } catch {
          // Already closed
        }
      };

      // Handle client disconnect
      request.signal.addEventListener('abort', cleanup);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      ...CORS_HEADERS,
    },
  });
}

/**
 * Create JSON-RPC error response
 */
function createJsonRpcError(
  code: number,
  message: string,
  id: number | string | null = null,
  data?: unknown
) {
  return {
    jsonrpc: '2.0' as const,
    id,
    error: {
      code,
      message,
      ...(data ? { data } : {}),
    },
  };
}

/**
 * Handle JSON-RPC 2.0 messages
 */
async function handleJsonRpc(request: Request): Promise<Response> {
  let body: unknown;
  let requestData: unknown;

  // Parse JSON body
  try {
    const text = await request.text();
    body = JSON.parse(text);
  } catch {
    return new Response(
      JSON.stringify(createJsonRpcError(-32700, 'Parse error')),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      }
    );
  }

  // Validate JSON-RPC structure
  if (
    !body ||
    typeof body !== 'object' ||
    !('jsonrpc' in body) ||
    body.jsonrpc !== '2.0' ||
    !('method' in body) ||
    typeof body.method !== 'string'
  ) {
    const id = (body && typeof body === 'object' && 'id' in body)
      ? (body.id as number | string)
      : null;
    return new Response(
      JSON.stringify(createJsonRpcError(-32600, 'Invalid Request', id)),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
        },
      }
    );
  }

  requestData = body as {
    jsonrpc: '2.0';
    id?: number | string;
    method: string;
    params?: Record<string, unknown>;
  };

  // Route to protocol handler (PBI-38)
  const response = await getMcpServer().handleRequest(requestData as any);

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

/**
 * Handle CORS preflight requests
 */
function handleOptions(): Response {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

/**
 * Main Edge Function handler
 */
export default async function handler(request: Request): Promise<Response> {
  const method = request.method;

  // Route based on HTTP method
  switch (method) {
    case 'GET':
      return handleSSE(request);
    case 'POST':
      return handleJsonRpc(request);
    case 'OPTIONS':
      return handleOptions();
    default:
      return new Response('Method Not Allowed', {
        status: 405,
        headers: CORS_HEADERS,
      });
  }
}

// Edge Function configuration
export const config: Config = {
  path: '/mcp',
};
