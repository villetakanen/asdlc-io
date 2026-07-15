import { describe, expect, it } from "vitest";
import {
  acceptsMarkdown,
  estimateMarkdownTokens,
  mapArticlePathToMarkdown,
} from "../markdown-negotiation";

describe("markdown-negotiation: acceptsMarkdown", () => {
  it("matches an exact text/markdown header", () => {
    expect(acceptsMarkdown("text/markdown")).toBe(true);
  });

  it("matches a multi-value header with a quality param", () => {
    expect(acceptsMarkdown("text/markdown, */*;q=0.8")).toBe(true);
  });

  it("matches when text/markdown appears after other entries", () => {
    expect(acceptsMarkdown("text/html, application/xhtml+xml, text/markdown;q=0.9")).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(acceptsMarkdown("TEXT/MARKDOWN")).toBe(true);
  });

  it("does not match a bare */* wildcard", () => {
    expect(acceptsMarkdown("*/*")).toBe(false);
  });

  it("does not match a browser's typical Accept header", () => {
    expect(acceptsMarkdown("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")).toBe(
      false,
    );
  });

  it("does not match text/* wildcard alone", () => {
    expect(acceptsMarkdown("text/*")).toBe(false);
  });

  it("does not match text/markdown;q=0 (explicitly not acceptable per RFC 7231)", () => {
    expect(acceptsMarkdown("text/markdown;q=0")).toBe(false);
    expect(acceptsMarkdown("text/markdown;q=0.0, */*;q=0.8")).toBe(false);
  });

  it("does not match a malformed q value", () => {
    expect(acceptsMarkdown("text/markdown;q=abc")).toBe(false);
  });

  it("matches when q is positive", () => {
    expect(acceptsMarkdown("text/markdown;q=0.5")).toBe(true);
  });

  it("matches when a non-q parameter is present", () => {
    expect(acceptsMarkdown("text/markdown;charset=utf-8")).toBe(true);
  });

  it("returns false for a missing header", () => {
    expect(acceptsMarkdown(null)).toBe(false);
    expect(acceptsMarkdown(undefined)).toBe(false);
  });

  it("returns false for an empty header", () => {
    expect(acceptsMarkdown("")).toBe(false);
  });
});

describe("markdown-negotiation: mapArticlePathToMarkdown", () => {
  it("maps a canonical path with a trailing slash", () => {
    expect(mapArticlePathToMarkdown("/concepts/agentic-sdlc/")).toEqual({
      collection: "concepts",
      slug: "agentic-sdlc",
      mdPath: "/concepts/agentic-sdlc.md",
    });
  });

  it("maps a canonical path without a trailing slash", () => {
    expect(mapArticlePathToMarkdown("/patterns/context-gates")).toEqual({
      collection: "patterns",
      slug: "context-gates",
      mdPath: "/patterns/context-gates.md",
    });
  });

  it("works for the practices collection", () => {
    expect(mapArticlePathToMarkdown("/practices/tdd/")).toEqual({
      collection: "practices",
      slug: "tdd",
      mdPath: "/practices/tdd.md",
    });
  });

  it("rejects index pages", () => {
    expect(mapArticlePathToMarkdown("/concepts/")).toBeNull();
    expect(mapArticlePathToMarkdown("/concepts")).toBeNull();
  });

  it("rejects paths already ending in .md", () => {
    expect(mapArticlePathToMarkdown("/concepts/agentic-sdlc.md")).toBeNull();
  });

  it("rejects nested paths", () => {
    expect(mapArticlePathToMarkdown("/concepts/foo/bar")).toBeNull();
    expect(mapArticlePathToMarkdown("/concepts/foo/bar/")).toBeNull();
  });

  it("rejects non-article collections", () => {
    expect(mapArticlePathToMarkdown("/resources/some-page/")).toBeNull();
    expect(mapArticlePathToMarkdown("/fieldmanual/")).toBeNull();
  });

  it("rejects the root path", () => {
    expect(mapArticlePathToMarkdown("/")).toBeNull();
  });
});

describe("markdown-negotiation: estimateMarkdownTokens", () => {
  it("rounds up payload length / 4", () => {
    expect(estimateMarkdownTokens("x".repeat(4))).toBe(1);
    expect(estimateMarkdownTokens("x".repeat(5))).toBe(2);
    expect(estimateMarkdownTokens("x".repeat(400))).toBe(100);
  });

  it("returns 0 for an empty payload", () => {
    expect(estimateMarkdownTokens("")).toBe(0);
  });
});
