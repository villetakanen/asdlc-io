import { describe, expect, it } from "vitest";
import type { Article } from "../../src/mcp/content.ts";
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
    const mockArticles: Article[] = [
      { slug: "c1", collection: "concepts", title: "Concept 1", description: "", status: "Live", content: "C1", tags: ["Architecture"] },
      { slug: "p1", collection: "patterns", title: "Pattern 1", description: "", status: "Experimental", content: "P1", tags: ["Design"] },
      { slug: "context-engineering", collection: "concepts", title: "Context Engineering", description: "Delivering the right context at the right time", status: "Live", content: "Context Engineering is a practice for structuring information delivery.", tags: ["Architecture", "AI", "Context"] },
      { slug: "schema-first", collection: "patterns", title: "Schema-First Development", description: "Define schemas before implementation", status: "Live", content: "This pattern ensures type safety through Zod schemas and contracts.", tags: ["Type Safety", "Zod"] },
      { slug: "living-specs", collection: "practices", title: "Living Specifications", description: "Specs that evolve with the codebase", status: "Live", content: "Use schemas to validate all data boundaries.", tags: ["Documentation"] },
    ];

    const contentService = new ContentService(mockArticles);

    it("should list articles", async () => {
      const articles = await contentService.listArticles();
      expect(articles).toHaveLength(5);
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
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].slug).toBe("p1");
    });

    it("should fuzzy match with typos", async () => {
      const results = await contentService.searchArticles("contxt");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.title === "Context Engineering")).toBe(true);
    });

    it("should rank title matches above body-only matches", async () => {
      const results = await contentService.searchArticles("schemas");
      expect(results.length).toBeGreaterThanOrEqual(2);
      const schemaFirstIdx = results.findIndex((r) => r.slug === "schema-first");
      const bodyOnlyIdx = results.findIndex((r) => r.slug === "living-specs");
      expect(schemaFirstIdx).toBeLessThan(bodyOnlyIdx);
    });

    it("should find articles by tag", async () => {
      const results = await contentService.searchArticles("Zod");
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((r) => r.slug === "schema-first")).toBe(true);
    });

    it("should return empty array for no matches", async () => {
      const results = await contentService.searchArticles("xyzzy_nonexistent_topic");
      expect(results).toHaveLength(0);
    });
  });
});
