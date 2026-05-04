import type { ContentService } from "./content.ts";

export interface JsonSchemaProperty {
  type: string;
  description?: string;
  enum?: string[];
  default?: string;
}

export interface McpTool {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, JsonSchemaProperty>;
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
      "Retrieves the full markdown content of a specific concept or pattern, including structured references (citations, papers, books, etc.) when available. Use this ONLY after you have performed a search using 'search_knowledge_base' and have a valid 'slug' from the search results. Do not attempt to guess slug names.",
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
      "The primary search tool for the ASDLC (Agentic Software Development Life Cycle) Knowledge Base. Use this tool whenever the user asks about AI collaboration, Agent Directives, Schema-First Development, Determinism over Vibes, Type Safety, Conventional Commits, or configuring LLM workflows. This tool searches across all Concepts, Patterns, Practices, and Recipes in the knowledge base.",
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
  params: Record<string, string>,
  contentService: ContentService,
): Promise<{ content: { type: "text"; text: string }[]; isError?: boolean }> {
  switch (name) {
    case "list_articles": {
      const articles = await contentService.listArticles();
      const text = articles
        .map((a) => `- [${a.collection}/${a.slug}] ${a.title}: ${a.description}`)
        .join("\n");
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
          content: [
            {
              type: "text",
              text: `Article '${slug}' not found or not available.`,
            },
          ],
          isError: true,
        };
      }

      // Build article response with content and references
      let response: string;
      if (article.collection === "recipes") {
        const prereqs =
          article.prerequisites && article.prerequisites.length > 0
            ? article.prerequisites.join(", ")
            : "None";
        const metaBlock = [
          `## Recipe Metadata`,
          `- Difficulty: ${article.difficulty ?? ""}`,
          `- Category: ${article.category ?? ""}`,
          `- Tools: ${article.tools?.join(", ") ?? ""}`,
          `- Estimated time: ${article.estimatedMinutes ?? ""} min`,
          `- Prerequisites: ${prereqs}`,
        ].join("\n");

        const agentBlock = article.agentPrompt ? `## Usage Hint\n${article.agentPrompt}\n\n` : "";

        response = `${agentBlock}${metaBlock}\n\n# ${article.title}\n\n${article.content}`;
      } else {
        response = `# ${article.longTitle ?? article.title}\n\n${article.content}`;
      }

      // Append structured references if present
      if (article.references && article.references.length > 0) {
        response += "\n\n## References\n\n";
        article.references.forEach((ref, index) => {
          response += `${index + 1}. **${ref.title}**\n`;
          if (ref.authors && ref.authors.length > 0) {
            response += `   Authors: ${ref.authors.join(", ")}\n`;
          } else if (ref.author) {
            response += `   Author: ${ref.author}\n`;
          }
          if (ref.published) {
            response += `   Published: ${ref.published}\n`;
          }
          if (ref.url) {
            response += `   URL: ${ref.url}\n`;
          }
          if (ref.publisher) {
            response += `   Publisher: ${ref.publisher}\n`;
          }
          if (ref.isbn) {
            response += `   ISBN: ${ref.isbn}\n`;
          }
          if (ref.doi) {
            response += `   DOI: ${ref.doi}\n`;
          }
          if (ref.accessed) {
            response += `   Accessed: ${ref.accessed}\n`;
          }
          response += `   Type: ${ref.type}\n`;
          response += `   ${ref.annotation}\n\n`;
        });
      }

      return {
        content: [{ type: "text", text: response }],
      };
    }

    case "search_knowledge_base": {
      const { query } = params;
      if (!query) throw new Error("Missing parameter: query");
      const articles = await contentService.searchArticles(query);
      const text = articles.map((a) => `- [${a.slug}] ${a.title}: ${a.description}`).join("\n");
      return {
        content: [
          {
            type: "text",
            text: text || `No articles found matching '${query}'.`,
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
