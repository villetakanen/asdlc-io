import { describe, expect, it } from "vitest";
import { ContentService, parseFrontmatter } from "./content";

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
    const mockFiles: Record<string, string> = {
      "./src/content/concepts/c1.md": "---\ntitle: Concept 1\nstatus: Live\n---\nC1",
      "./src/content/concepts/c2.md": "---\ntitle: Concept 2\nstatus: Draft\n---\nC2",
      "./src/content/patterns/p1.md": "---\ntitle: Pattern 1\nstatus: Experimental\n---\nP1",
    };

    const mockReadDir = async (path: string) => {
      if (path.includes("concepts")) return ["c1.md", "c2.md"];
      if (path.includes("patterns")) return ["p1.md"];
      if (path.includes("practices")) return [];
      return [];
    };

    const mockReadFile = async (path: string) => {
      if (mockFiles[path]) return mockFiles[path];
      throw new Error("File not found");
    };

    const service = new ContentService("./src/content", mockReadFile, mockReadDir);

    it("should list only Live and Experimental articles", async () => {
      const articles = await service.listArticles();
      expect(articles).toHaveLength(2);
      expect(articles.map((a) => a.slug)).toContain("c1");
      expect(articles.map((a) => a.slug)).toContain("p1");
      expect(articles.map((a) => a.slug)).not.toContain("c2");
    });

    it("should get a single article by slug", async () => {
      const article = await service.getArticleBySlug("c1");
      expect(article).not.toBeNull();
      expect(article?.title).toBe("Concept 1");
      expect(article?.content.trim()).toBe("C1");
    });

    it("should return null for Draft articles", async () => {
      const article = await service.getArticleBySlug("c2");
      expect(article).toBeNull();
    });

    it("should search articles", async () => {
      const results = await service.searchArticles("Pattern");
      expect(results).toHaveLength(1);
      expect(results[0].slug).toBe("p1");
    });
  });
});
