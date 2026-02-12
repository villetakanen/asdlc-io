/**
 * Content Reading Utilities (PBI-39, PBI-61)
 *
 * Provides functions to read, parse, and filter ASDLC knowledge base articles.
 * Compatible with both Node.js (test) and Deno (Netlify Edge).
 */

import Fuse from "fuse.js";

export interface Reference {
  type: "website" | "paper" | "book" | "podcast" | "video" | "repository" | "standard";
  title: string;
  url?: string;
  author?: string;
  authors?: string[];
  publisher?: string;
  published?: string;
  accessed?: string;
  isbn?: string;
  doi?: string;
  annotation: string;
}

export interface Article {
  slug: string;
  collection: "concepts" | "patterns" | "practices";
  title: string;
  description: string;
  status: "Draft" | "Proposed" | "Live" | "Deprecated" | "Experimental";
  content: string;
  tags?: string[];
  references?: Reference[];
}

/** Pre-built Fuse index type (extracted from constructor signature) */
type FusePrebuiltIndex = NonNullable<ConstructorParameters<typeof Fuse>[2]>;

const FUSE_OPTIONS = {
  keys: [
    { name: "title", weight: 1.0 },
    { name: "tags", weight: 0.8 },
    { name: "slug", weight: 0.6 },
    { name: "description", weight: 0.4 },
    { name: "content", weight: 0.2 },
  ],
  threshold: 0.4,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

/**
 * Simple Frontmatter parser (regex-based to avoid dependencies)
 */
export function parseFrontmatter(markdown: string): {
  data: Record<string, any>;
  content: string;
} {
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
  private fuse: Fuse<Article>;

  constructor(
    private articles: Article[],
    fuseIndex?: FusePrebuiltIndex,
  ) {
    this.fuse = fuseIndex
      ? (new Fuse(articles, FUSE_OPTIONS, fuseIndex) as Fuse<Article>)
      : new Fuse(articles, FUSE_OPTIONS);
  }

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
   * Fuzzy search across articles using Fuse.js (PBI-61)
   */
  async searchArticles(query: string): Promise<Omit<Article, "content">[]> {
    const results = this.fuse.search(query);
    return results.map(({ item: { content, ...rest } }) => rest);
  }
}
