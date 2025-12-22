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
  constructor(
    private baseDir: string = "./src/content",
    private readFile: (path: string) => Promise<string>,
    private readDir: (path: string) => Promise<string[]>,
  ) {}

  /**
   * List all articles with status 'Live' or 'Experimental'
   */
  async listArticles(): Promise<Omit<Article, "content">[]> {
    const collections = ["concepts", "patterns", "practices"] as const;
    const articles: Omit<Article, "content">[] = [];

    for (const collection of collections) {
      try {
        const fullPath = `${this.baseDir}/${collection}`;
        const files = await this.readDir(fullPath);

        for (const file of files) {
          if (!file.endsWith(".md")) continue;

          const slug = file.replace(/\.md$/, "");
          const filePath = `${fullPath}/${file}`;
          const rawContent = await this.readFile(filePath);
          const { data } = parseFrontmatter(rawContent);

          // Filtering: Only 'Live' or 'Experimental'
          if (data.status === "Live" || data.status === "Experimental") {
            articles.push({
              slug,
              collection,
              title: data.title || slug,
              description: data.description || "",
              status: data.status,
              tags: data.tags || [],
            });
          }
        }
      } catch (e) {
        // Collection might not exist or be empty, skip it
        console.warn(`Warning: Could not read collection ${collection}:`, e);
      }
    }

    return articles;
  }

  /**
   * Get a single article by slug, across all collections.
   * Returns null if not found or not Live/Experimental.
   */
  async getArticleBySlug(slug: string): Promise<Article | null> {
    const collections = ["concepts", "patterns", "practices"] as const;

    for (const collection of collections) {
      const filePath = `${this.baseDir}/${collection}/${slug}.md`;
      try {
        const rawContent = await this.readFile(filePath);
        const { data, content } = parseFrontmatter(rawContent);

        if (data.status === "Live" || data.status === "Experimental") {
          return {
            slug,
            collection,
            title: data.title || slug,
            description: data.description || "",
            status: data.status,
            content,
            tags: data.tags || [],
          };
        }
      } catch {
        // Not in this collection, continue to next
      }
    }

    return null;
  }

  /**
   * Simple keyword search across articles
   */
  async searchArticles(query: string): Promise<Omit<Article, "content">[]> {
    const all = await this.listArticles();
    const lowerQuery = query.toLowerCase();

    return all.filter(
      (article) =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.description.toLowerCase().includes(lowerQuery) ||
        article.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
        article.slug.toLowerCase().includes(lowerQuery),
    );
  }
}
