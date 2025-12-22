/**
 * Content Reading Utilities (PBI-39)
 *
 * Provides functions to read, parse, and filter ASDLC knowledge base articles.
 * Compatible with both Node.js (test) and Deno (Netlify Edge).
 */

export interface Article {
  slug: string;
  collection: "concepts" | "patterns" | "practices";
  title: string;
  description: string;
  status: "Draft" | "Proposed" | "Live" | "Deprecated" | "Experimental";
  content: string;
  tags?: string[];
}

/**
 * Simple Frontmatter parser (regex-based to avoid dependencies)
 */
export function parseFrontmatter(markdown: string): { data: Record<string, any>; content: string } {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: markdown };
  }

  const yamlBlock = match[1];
  const content = match[2];
  const data: Record<string, any> = {};

  const lines = yamlBlock.split("\n");
  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();

      // Basic type conversion
      if (value.startsWith("[") && value.endsWith("]")) {
        // Simple array [a, b, c]
        data[key] = value
          .slice(1, -1)
          .split(",")
          .map((s) =>
            s
              .trim()
              .replace(/^"(.*)"$/, "$1")
              .replace(/^'(.*)'$/, "$1"),
          );
      } else if (value.startsWith('"') && value.endsWith('"')) {
        data[key] = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        data[key] = value.slice(1, -1);
      } else {
        data[key] = value;
      }
    }
  }

  return { data, content };
}

export class ContentService {
  constructor(private articles: Article[]) {}

  /**
   * List all articles (filtering is already done in generate-mcp-index.mjs)
   */
  async listArticles(): Promise<Omit<Article, "content">[]> {
    return this.articles.map(({ content, ...rest }) => rest);
  }

  /**
   * Get a single article by slug.
   */
  async getArticleBySlug(slug: string): Promise<Article | null> {
    return this.articles.find((a) => a.slug === slug) || null;
  }

  /**
   * Simple keyword search across articles
   */
  async searchArticles(query: string): Promise<Omit<Article, "content">[]> {
    const lowerQuery = query.toLowerCase();

    return this.articles
      .filter(
        (article) =>
          article.title?.toLowerCase().includes(lowerQuery) ||
          article.description?.toLowerCase().includes(lowerQuery) ||
          article.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
          article.slug?.toLowerCase().includes(lowerQuery),
      )
      .map(({ content, ...rest }) => rest);
  }
}
