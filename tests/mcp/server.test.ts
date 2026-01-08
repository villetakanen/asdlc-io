import { describe, expect, it } from "vitest";
import { ContentService } from "../../src/mcp/content.ts";
import { McpServer } from "../../src/mcp/server.ts";

describe("McpServer", () => {
  const mockArticles: any[] = [
    {
      slug: "c1",
      collection: "concepts",
      title: "Concept 1",
      status: "Live",
      content: "C1",
    },
    {
      slug: "p1",
      collection: "patterns",
      title: "Pattern 1",
      status: "Experimental",
      content: "P1",
    },
    {
      slug: "c2",
      collection: "concepts",
      title: "Concept with References",
      status: "Live",
      content: "Article content here",
      references: [
        {
          type: "website",
          title: "Example Website",
          url: "https://example.com",
          author: "Test Author",
          published: "2024-01-15",
          accessed: "2026-01-08",
          annotation: "Example annotation for testing",
        },
        {
          type: "book",
          title: "Example Book",
          author: "Book Author",
          isbn: "978-0123456789",
          annotation: "Book reference for testing",
        },
      ],
    },
  ];

  const contentService = new ContentService(mockArticles);
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
    expect(response.result.tools.map((t: any) => t.name)).toContain(
      "list_articles",
    );
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

  it("should include references in get_article response", async () => {
    const response = await server.handleRequest({
      jsonrpc: "2.0",
      id: 6,
      method: "tools/call",
      params: {
        name: "get_article",
        arguments: { slug: "c2" },
      },
    });

    const text = response.result.content[0].text;
    expect(text).toContain("# Concept with References");
    expect(text).toContain("Article content here");
    expect(text).toContain("## References");
    expect(text).toContain("Example Website");
    expect(text).toContain("Author: Test Author");
    expect(text).toContain("URL: https://example.com");
    expect(text).toContain("Example annotation for testing");
    expect(text).toContain("Example Book");
    expect(text).toContain("ISBN: 978-0123456789");
    expect(text).toContain("Type: website");
    expect(text).toContain("Type: book");
  });

  it("should handle article without references", async () => {
    const response = await server.handleRequest({
      jsonrpc: "2.0",
      id: 7,
      method: "tools/call",
      params: {
        name: "get_article",
        arguments: { slug: "c1" },
      },
    });

    const text = response.result.content[0].text;
    expect(text).toContain("# Concept 1");
    expect(text).not.toContain("## References");
  });

  it("should call search_knowledge_base tool", async () => {
    const response = await server.handleRequest({
      jsonrpc: "2.0",
      id: 6,
      method: "tools/call",
      params: {
        name: "search_knowledge_base",
        arguments: { query: "Pattern" },
      },
    });

    expect(response.result.content[0].text).toContain("Pattern 1");
  });

  it("should return error for old tool name search_articles", async () => {
    const response = await server.handleRequest({
      jsonrpc: "2.0",
      id: 6.1,
      method: "tools/call",
      params: {
        name: "search_articles",
        arguments: { query: "Pattern" },
      },
    });

    expect(response.error).toBeDefined();
    expect(response.error?.code).toBe(-32603); // handleToolCall throws, causing -32603 in server.ts
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
