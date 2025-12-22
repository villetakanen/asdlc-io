import { describe, expect, it } from "vitest";
import {
  assertJsonRpcError,
  assertJsonRpcSuccess,
  createJsonRpcRequest,
  createMockRequest,
} from "../../src/mcp/test-helpers";

describe("Test Helpers", () => {
  describe("createMockRequest", () => {
    it("creates a GET request", () => {
      const req = createMockRequest("GET", "http://localhost/mcp");
      expect(req.method).toBe("GET");
      expect(req.url).toBe("http://localhost/mcp");
    });

    it("creates a POST request with body", async () => {
      const body = { test: "data" };
      const req = createMockRequest("POST", "http://localhost/mcp", body);
      expect(req.method).toBe("POST");
      const parsed = await req.json();
      expect(parsed).toEqual(body);
    });
  });

  describe("createJsonRpcRequest", () => {
    it("creates a valid JSON-RPC request", () => {
      const req = createJsonRpcRequest("test/method", { param: "value" });
      expect(req).toEqual({
        jsonrpc: "2.0",
        id: 1,
        method: "test/method",
        params: { param: "value" },
      });
    });
  });

  describe("assertJsonRpcSuccess", () => {
    it("passes for valid success response", () => {
      const response = {
        jsonrpc: "2.0",
        id: 1,
        result: { data: "test" },
      };
      expect(() => assertJsonRpcSuccess(response)).not.toThrow();
    });

    it("throws for error response", () => {
      const response = {
        jsonrpc: "2.0",
        id: 1,
        error: { code: -32600, message: "Invalid" },
      };
      expect(() => assertJsonRpcSuccess(response)).toThrow();
    });
  });

  describe("assertJsonRpcError", () => {
    it("passes for valid error response", () => {
      const response = {
        jsonrpc: "2.0",
        id: 1,
        error: { code: -32600, message: "Invalid" },
      };
      expect(() => assertJsonRpcError(response)).not.toThrow();
    });

    it("throws for success response", () => {
      const response = {
        jsonrpc: "2.0",
        id: 1,
        result: { data: "test" },
      };
      expect(() => assertJsonRpcError(response)).toThrow();
    });
  });
});
