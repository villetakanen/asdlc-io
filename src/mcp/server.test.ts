import { describe, expect, it } from "vitest";
import { ContentService } from "./content";
import { McpServer } from "./server";

describe("McpServer", () => {
  const mockFiles: Record<string, string> = {
    "./src/content/concepts/c1.md": "---\ntitle: Concept 1\nstatus: Live\n---\nC1",
    "./src/content/patterns/p1.md": "---\ntitle: Pattern 1\nstatus: Experimental\n---\nP1",
  };

  const mockReadDir = async (path: string) => {
    if (path.includes("concepts")) return ["c1.md"];
    if (path.includes("patterns")) return ["p1.md"];
    return [];
  };

  const mockReadFile = async (path: string) => {
    if (mockFiles[path]) return mockFiles[path];
    throw new Error("File not found");
  };

  const contentService = new ContentService("./src/content", mockReadFile, mockReadDir);
  const server = new McpServer(contentService);

  it("should handle initialize request", async () => {
    const response = await server.handleRequest({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2024-11-05" },
    });

    expect(response.result).toBeDefined();
    expect(response.result.serverInfo.name).toBe("asdlc-knowledge-base");
    expect(response.result.capabilities.tools).toBeDefined();
  });

  it("should list tools", async () => {
    const response = await server.handleRequest({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
    });

    expect(response.result.tools).toHaveLength(3);
    expect(response.result.tools.map((t: any) => t.name)).toContain("list_articles");
  });

  it("should call list_articles tool", async () => {
    const response = await server.handleRequest({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "list_articles",
        arguments: {},
      },
    });

    expect(response.result.content[0].text).toContain("Concept 1");
    expect(response.result.content[0].text).toContain("Pattern 1");
  });

  it("should call get_article tool", async () => {
    const response = await server.handleRequest({
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: {
        name: "get_article",
        arguments: { slug: "c1" },
      },
    });

    expect(response.result.content[0].text).toContain("# Concept 1");
    expect(response.result.content[0].text).toContain("C1");
  });

  it("should handle missing article in get_article", async () => {
    const response = await server.handleRequest({
      jsonrpc: "2.0",
      id: 5,
      method: "tools/call",
      params: {
        name: "get_article",
        arguments: { slug: "unknown" },
      },
    });

    expect(response.result.isError).toBe(true);
    expect(response.result.content[0].text).toContain("not found");
  });

  it("should call search_articles tool", async () => {
    const response = await server.handleRequest({
      jsonrpc: "2.0",
      id: 6,
      method: "tools/call",
      params: {
        name: "search_articles",
        arguments: { query: "Pattern" },
      },
    });

    expect(response.result.content[0].text).toContain("Pattern 1");
  });

  it("should return error for unknown method", async () => {
    const response = await server.handleRequest({
      jsonrpc: "2.0",
      id: 7,
      method: "unknown/method",
    });

    expect(response.error).toBeDefined();
    expect(response.error?.code).toBe(-32601);
  });
});
