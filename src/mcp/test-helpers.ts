/**
 * Test utilities for MCP server testing
 */

/**
 * Creates a mock Request object for testing Edge Functions
 */
export function createMockRequest(
  method: string,
  url: string,
  body?: unknown,
  headers?: Record<string, string>,
): Request {
  const init: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    init.body = JSON.stringify(body);
  }

  return new Request(url, init);
}

/**
 * Parse JSON-RPC response from Response object
 */
export async function parseJsonRpcResponse(response: Response): Promise<unknown> {
  const text = await response.text();
  return JSON.parse(text);
}

/**
 * Create a JSON-RPC request object
 */
export function createJsonRpcRequest(
  method: string,
  params?: Record<string, unknown>,
  id: number | string = 1,
) {
  return {
    jsonrpc: "2.0" as const,
    id,
    method,
    params,
  };
}

/**
 * Assert that a response is a valid JSON-RPC success response
 */
export function assertJsonRpcSuccess(response: unknown): asserts response is {
  jsonrpc: "2.0";
  id: number | string;
  result: unknown;
} {
  if (
    !response ||
    typeof response !== "object" ||
    !("jsonrpc" in response) ||
    response.jsonrpc !== "2.0" ||
    !("id" in response) ||
    !("result" in response)
  ) {
    throw new Error("Invalid JSON-RPC success response");
  }
}

/**
 * Assert that a response is a valid JSON-RPC error response
 */
export function assertJsonRpcError(response: unknown): asserts response is {
  jsonrpc: "2.0";
  id: number | string;
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
} {
  if (
    !response ||
    typeof response !== "object" ||
    !("jsonrpc" in response) ||
    response.jsonrpc !== "2.0" ||
    !("id" in response) ||
    !("error" in response)
  ) {
    throw new Error("Invalid JSON-RPC error response");
  }
}
