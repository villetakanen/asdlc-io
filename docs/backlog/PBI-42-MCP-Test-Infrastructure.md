# PBI-42: MCP Test Infrastructure Setup

> Status: Ready

## Goal
Set up Vitest testing infrastructure to enable unit and integration testing of the MCP server components.

## Context
The MCP server runs in Netlify Edge Functions (Deno runtime), but we need to test the logic locally. Vitest provides a fast, TypeScript-native testing framework that can work with both Node.js and Deno-compatible code.

This PBI establishes the testing foundation that PBIs 37-40 will use for their implementation tests.

## Spec Reference
`/docs/specs/mcp-server/spec.md` - Section: "Testing Requirements"

## Requirements

### Install Dependencies
```bash
pnpm add -D vitest @vitest/ui
```

### Create vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'netlify/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/mcp/**/*.ts', 'netlify/edge-functions/**/*.ts'],
      exclude: ['**/*.test.ts', '**/*.d.ts'],
    },
  },
});
```

### Add Test Scripts to package.json
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

### Create Test Utilities
Create `/src/mcp/test-helpers.ts` with utilities for testing:

```typescript
/**
 * Creates a mock Request object for testing Edge Functions
 */
export function createMockRequest(
  method: string,
  url: string,
  body?: unknown,
  headers?: Record<string, string>
): Request {
  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
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
  id: number | string = 1
) {
  return {
    jsonrpc: '2.0' as const,
    id,
    method,
    params,
  };
}

/**
 * Assert that a response is a valid JSON-RPC success response
 */
export function assertJsonRpcSuccess(response: unknown): asserts response is {
  jsonrpc: '2.0';
  id: number | string;
  result: unknown;
} {
  if (
    !response ||
    typeof response !== 'object' ||
    !('jsonrpc' in response) ||
    response.jsonrpc !== '2.0' ||
    !('id' in response) ||
    !('result' in response)
  ) {
    throw new Error('Invalid JSON-RPC success response');
  }
}

/**
 * Assert that a response is a valid JSON-RPC error response
 */
export function assertJsonRpcError(response: unknown): asserts response is {
  jsonrpc: '2.0';
  id: number | string;
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
} {
  if (
    !response ||
    typeof response !== 'object' ||
    !('jsonrpc' in response) ||
    response.jsonrpc !== '2.0' ||
    !('id' in response) ||
    !('error' in response)
  ) {
    throw new Error('Invalid JSON-RPC error response');
  }
}
```

### Create Sample Test
Create `/src/mcp/test-helpers.test.ts` to verify the test infrastructure works:

```typescript
import { describe, it, expect } from 'vitest';
import {
  createMockRequest,
  createJsonRpcRequest,
  assertJsonRpcSuccess,
  assertJsonRpcError,
} from './test-helpers';

describe('Test Helpers', () => {
  describe('createMockRequest', () => {
    it('creates a GET request', () => {
      const req = createMockRequest('GET', 'http://localhost/mcp');
      expect(req.method).toBe('GET');
      expect(req.url).toBe('http://localhost/mcp');
    });

    it('creates a POST request with body', async () => {
      const body = { test: 'data' };
      const req = createMockRequest('POST', 'http://localhost/mcp', body);
      expect(req.method).toBe('POST');
      const parsed = await req.json();
      expect(parsed).toEqual(body);
    });
  });

  describe('createJsonRpcRequest', () => {
    it('creates a valid JSON-RPC request', () => {
      const req = createJsonRpcRequest('test/method', { param: 'value' });
      expect(req).toEqual({
        jsonrpc: '2.0',
        id: 1,
        method: 'test/method',
        params: { param: 'value' },
      });
    });
  });

  describe('assertJsonRpcSuccess', () => {
    it('passes for valid success response', () => {
      const response = {
        jsonrpc: '2.0',
        id: 1,
        result: { data: 'test' },
      };
      expect(() => assertJsonRpcSuccess(response)).not.toThrow();
    });

    it('throws for error response', () => {
      const response = {
        jsonrpc: '2.0',
        id: 1,
        error: { code: -32600, message: 'Invalid' },
      };
      expect(() => assertJsonRpcSuccess(response)).toThrow();
    });
  });

  describe('assertJsonRpcError', () => {
    it('passes for valid error response', () => {
      const response = {
        jsonrpc: '2.0',
        id: 1,
        error: { code: -32600, message: 'Invalid' },
      };
      expect(() => assertJsonRpcError(response)).not.toThrow();
    });

    it('throws for success response', () => {
      const response = {
        jsonrpc: '2.0',
        id: 1,
        result: { data: 'test' },
      };
      expect(() => assertJsonRpcError(response)).toThrow();
    });
  });
});
```

## Acceptance Criteria
- [ ] Vitest and @vitest/ui installed as dev dependencies
- [ ] `vitest.config.ts` created with correct test paths and coverage config
- [ ] Test scripts added to `package.json`: `test`, `test:ui`, `test:run`, `test:coverage`
- [ ] Test helpers file created at `/src/mcp/test-helpers.ts`
- [ ] Sample test file created at `/src/mcp/test-helpers.test.ts`
- [ ] `pnpm test:run` executes successfully (sample test passes)
- [ ] `pnpm test:ui` launches Vitest UI
- [ ] Test coverage report generates in `coverage/` directory

## Testing
**Verify Installation:**
```bash
# Run tests
pnpm test:run

# Should output:
# ✓ src/mcp/test-helpers.test.ts (6 tests) ...
# Test Files  1 passed (1)
#      Tests  6 passed (6)

# Launch UI
pnpm test:ui
# Should open browser with Vitest UI

# Generate coverage
pnpm test:coverage
# Should create coverage/ directory with HTML report
```

## Notes
- Vitest uses the same assertion syntax as Jest (expect)
- `globals: true` allows using `describe`, `it`, `expect` without imports
- Coverage is optional but recommended for tracking test completeness
- Test helpers will be reused across all MCP implementation tests (PBI 37-40)

## Dependencies
- None (foundational infrastructure)

## Blocked By
- None

## Blocks
- PBI-37, 38, 39, 40 tests (provides test utilities)

## Related
- Spec: `/docs/specs/mcp-server/spec.md`
- Vitest: https://vitest.dev/
- Netlify Edge Functions Testing: https://docs.netlify.com/edge-functions/test/
