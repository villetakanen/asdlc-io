import { describe, expect, it } from "vitest";
import {
  assertSizeCap,
  buildFrontmatter,
  MAX_CHARS,
  type MarkdownVariantEntry,
  PUBLISHED_STATUSES,
} from "../../lib/markdown-variant";

function statusFilter(entry: MarkdownVariantEntry): boolean {
  return PUBLISHED_STATUSES.has(entry.data.status);
}

const liveEntry: MarkdownVariantEntry = {
  id: "agentic-sdlc",
  body: "## Definition\n\nSome content here.",
  data: {
    title: "Agentic SDLC",
    description: "Framework definition.",
    status: "Live",
    lastUpdated: new Date("2026-05-20"),
    tags: ["Core", "SDLC"],
  },
};

const experimentalEntry: MarkdownVariantEntry = {
  id: "new-pattern",
  body: "## Overview\n\nExperimental content.",
  data: {
    title: "New Pattern",
    description: "An experimental pattern.",
    status: "Experimental",
    lastUpdated: new Date("2026-05-01"),
    tags: [],
  },
};

const draftEntry: MarkdownVariantEntry = {
  id: "wip-concept",
  body: "## Draft\n\nNot ready.",
  data: {
    title: "WIP Concept",
    description: "Work in progress.",
    status: "Draft",
    lastUpdated: new Date("2026-04-01"),
  },
};

const proposedEntry: MarkdownVariantEntry = {
  ...draftEntry,
  id: "proposed-concept",
  data: { ...draftEntry.data, status: "Proposed" },
};

const deprecatedEntry: MarkdownVariantEntry = {
  ...draftEntry,
  id: "old-concept",
  data: { ...draftEntry.data, status: "Deprecated" },
};

describe("markdown-variants: status filter", () => {
  it("includes Live entries", () => {
    expect(statusFilter(liveEntry)).toBe(true);
  });

  it("includes Experimental entries", () => {
    expect(statusFilter(experimentalEntry)).toBe(true);
  });

  it("excludes Draft entries", () => {
    expect(statusFilter(draftEntry)).toBe(false);
  });

  it("excludes Proposed entries", () => {
    expect(statusFilter(proposedEntry)).toBe(false);
  });

  it("excludes Deprecated entries", () => {
    expect(statusFilter(deprecatedEntry)).toBe(false);
  });
});

describe("markdown-variants: frontmatter shape", () => {
  it("emits all required fields", () => {
    const fm = buildFrontmatter(liveEntry, "concepts");
    expect(fm).toContain('title: "Agentic SDLC"');
    expect(fm).toContain('description: "Framework definition."');
    expect(fm).toContain('status: "Live"');
    expect(fm).toContain('lastUpdated: "2026-05-20"');
    expect(fm).toContain('tags: ["Core","SDLC"]');
    expect(fm).toContain('canonical: "https://asdlc.io/concepts/agentic-sdlc/"');
  });

  it("wraps content in YAML fences", () => {
    const fm = buildFrontmatter(liveEntry, "concepts");
    expect(fm.startsWith("---\n")).toBe(true);
    expect(fm.endsWith("\n---")).toBe(true);
  });

  it("excludes relatedIds and other internal fields", () => {
    const fm = buildFrontmatter(liveEntry, "concepts");
    expect(fm).not.toContain("relatedIds");
    expect(fm).not.toContain("references");
    expect(fm).not.toContain("supersededBy");
  });

  it("defaults tags to empty array when undefined", () => {
    const entry: MarkdownVariantEntry = {
      ...draftEntry,
      body: "## Draft\n\nNot ready.",
      data: { ...draftEntry.data, tags: undefined },
    };
    const fm = buildFrontmatter(entry, "concepts");
    expect(fm).toContain("tags: []");
  });

  it("builds correct canonical for patterns collection", () => {
    const fm = buildFrontmatter(experimentalEntry, "patterns");
    expect(fm).toContain('canonical: "https://asdlc.io/patterns/new-pattern/"');
  });
});

describe("markdown-variants: body-length cap", () => {
  it("returns payload for entry within cap", () => {
    const result = assertSizeCap(liveEntry, "concepts");
    expect(result.length).toBeLessThanOrEqual(MAX_CHARS);
  });

  it("throws for entry exceeding cap", () => {
    const oversized: MarkdownVariantEntry = {
      id: "huge-article",
      body: "x".repeat(MAX_CHARS),
      data: liveEntry.data,
    };
    expect(() => assertSizeCap(oversized, "concepts")).toThrow(
      /md payload for concepts\/huge-article is .* chars \(>50000\)/,
    );
  });

  it("counts frontmatter + body combined toward the cap", () => {
    // body alone fits, but frontmatter pushes it over — verifies combined counting
    const nearLimit: MarkdownVariantEntry = {
      id: "near-limit",
      body: "x".repeat(MAX_CHARS - 100),
      data: liveEntry.data,
    };
    expect(() => assertSizeCap(nearLimit, "concepts")).toThrow();
  });

  it("throws when entry body is empty", () => {
    const noBody: MarkdownVariantEntry = {
      id: "empty-body",
      body: undefined,
      data: liveEntry.data,
    };
    expect(() => assertSizeCap(noBody, "concepts")).toThrow(
      "md payload for concepts/empty-body has empty body",
    );
  });
});
