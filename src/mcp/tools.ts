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
    description:
      "Lists all available articles in the ASDLC (Agentic Software Development Life Cycle) Knowledge Base with metadata (title, description, tags, status). Returns only Live and Experimental content. Use this to browse available topics or get an overview of the knowledge base structure.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_article",
    description:
      "Retrieves the full markdown content of a specific concept or pattern. Use this ONLY after you have performed a search using 'search_knowledge_base' and have a valid 'slug' from the search results. Do not attempt to guess slug names.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description:
            "The exact slug value from a search result (e.g., 'context-engineering', 'agent-directives'). Do not construct or guess slug values.",
        },
      },
      required: ["slug"],
    },
  },
  {
    name: "search_knowledge_base",
    description:
      "The primary search tool for the ASDLC (Agentic Software Development Life Cycle) Knowledge Base. Use this tool whenever the user asks about AI collaboration, Agent Directives, Schema-First Development, Determinism over Vibes, Type Safety, Conventional Commits, or configuring LLM workflows. This tool searches across all 'Concepts' and 'Patterns' in the knowledge base.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "A specific development topic or keyword (e.g., 'Vibe Coding', 'Agent Directives', 'Zod Schemas', 'Context Engineering').",
        },
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

    case "search_knowledge_base": {
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
