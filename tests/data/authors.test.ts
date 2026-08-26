import { describe, expect, it } from "vitest";
import { DEFAULT_AUTHOR_SLUG, authors, resolveAuthors } from "../../src/data/authors";

describe("authors registry", () => {
  it("contains ville-takanen with required schema fields", () => {
    expect(DEFAULT_AUTHOR_SLUG).toBe("ville-takanen");
    const author = authors[DEFAULT_AUTHOR_SLUG];
    expect(author).toBeDefined();
    expect(author.name).toBe("Ville Takanen");
    expect(author.url).toBe("https://villetakanen.com");
    expect(author.sameAs).toContain("https://github.com/villetakanen");
  });

  it("contains mats-ljunggren with affiliation", () => {
    const author = authors["mats-ljunggren"];
    expect(author).toBeDefined();
    expect(author.name).toBe("Mats Ljunggren");
    expect(author.url).toBe("https://github.com/ljunggren");
    expect(author.affiliation).toBe("Concord Design");
  });

  it("resolves default author (ville-takanen) when slugs is undefined or empty", () => {
    const defaultFromUndefined = resolveAuthors(undefined);
    expect(defaultFromUndefined).toHaveLength(1);
    expect(defaultFromUndefined[0].name).toBe("Ville Takanen");

    const defaultFromEmpty = resolveAuthors([]);
    expect(defaultFromEmpty).toHaveLength(1);
    expect(defaultFromEmpty[0].name).toBe("Ville Takanen");
  });

  it("resolves specific author slugs", () => {
    const resolved = resolveAuthors(["mats-ljunggren"]);
    expect(resolved).toHaveLength(1);
    expect(resolved[0].name).toBe("Mats Ljunggren");
  });

  it("resolves multiple authors", () => {
    const resolved = resolveAuthors(["ville-takanen", "mats-ljunggren"]);
    expect(resolved).toHaveLength(2);
    expect(resolved[0].name).toBe("Ville Takanen");
    expect(resolved[1].name).toBe("Mats Ljunggren");
  });

  it("throws for unknown author slug", () => {
    expect(() => resolveAuthors(["unknown-author"])).toThrow(/Unknown author slug: "unknown-author"/);
  });
});
