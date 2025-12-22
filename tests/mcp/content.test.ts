import { describe, expect, it } from "vitest";
import { ContentService, parseFrontmatter } from "../../src/mcp/content.ts";

describe("Content Reading Utilities", () => {
  describe("parseFrontmatter", () => {
    it("should parse standard frontmatter", () => {
      const markdown = `---
title: "Test Title"
status: Live
tags: [tag1, tag2]
---
# Content Here`;
      const { data, content } = parseFrontmatter(markdown);
      expect(data.title).toBe("Test Title");
      expect(data.status).toBe("Live");
      expect(data.tags).toEqual(["tag1", "tag2"]);
      expect(content.trim()).toBe("# Content Here");
    });

    it("should handle missing frontmatter", () => {
      const markdown = "# Just content";
      const { data, content } = parseFrontmatter(markdown);
      expect(data).toEqual({});
      expect(content).toBe(markdown);
    });
  });

  describe("ContentService", () => {
    const mockArticles: any[] = [
      { slug: "c1", collection: "concepts", title: "Concept 1", status: "Live", content: "C1" },
      { slug: "p1", collection: "patterns", title: "Pattern 1", status: "Experimental", content: "P1" },
    ];

    const contentService = new ContentService(mockArticles);

    it("should list articles", async () => {
      const articles = await contentService.listArticles();
      expect(articles).toHaveLength(2);
      expect(articles.map((a) => a.slug)).toContain("c1");
      expect(articles.map((a) => a.slug)).toContain("p1");
    });

    it("should get a single article by slug", async () => {
      const article = await contentService.getArticleBySlug("c1");
      expect(article).not.toBeNull();
      expect(article?.title).toBe("Concept 1");
      expect(article?.content.trim()).toBe("C1");
    });

    it("should search articles", async () => {
      const results = await contentService.searchArticles("Pattern");
      expect(results).toHaveLength(1);
      expect(results[0].slug).toBe("p1");
    });
  });
});
