import type { ContentService } from "./content.ts";

export interface McpTool {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
  };
}

export const TOOLS: McpTool[] = [
  {
    name: "list_articles",
    description: "List all Live and Experimental articles in the ASDLC knowledge base.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_article",
    description: "Get the full content of a specific article by its slug.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "The unique identifier (slug) of the article." },
      },
      required: ["slug"],
    },
  },
  {
    name: "search_articles",
    description: "Search for articles in the knowledge base using a keyword query.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "The search query string." },
      },
      required: ["query"],
    },
  },
];

export async function handleToolCall(
  name: string,
  params: any,
  contentService: ContentService,
): Promise<{ content: { type: "text"; text: string }[]; isError?: boolean }> {
  switch (name) {
    case "list_articles": {
      const articles = await contentService.listArticles();
      const text = articles.map((a) => `- [${a.slug}] ${a.title}: ${a.description}`).join("\n");
      return {
        content: [{ type: "text", text: text || "No articles found." }],
      };
    }

    case "get_article": {
      const { slug } = params;
      if (!slug) throw new Error("Missing parameter: slug");
      const article = await contentService.getArticleBySlug(slug);
      if (!article) {
        return {
          content: [{ type: "text", text: `Article '${slug}' not found or not available.` }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text", text: `# ${article.title}\n\n${article.content}` }],
      };
    }

    case "search_articles": {
      const { query } = params;
      if (!query) throw new Error("Missing parameter: query");
      const articles = await contentService.searchArticles(query);
      const text = articles.map((a) => `- [${a.slug}] ${a.title}: ${a.description}`).join("\n");
      return {
        content: [{ type: "text", text: text || `No articles found matching '${query}'.` }],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
