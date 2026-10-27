import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { findContentIntegrityErrors, lintContent } from "../scripts/lint-content.mjs";

const fixtureRoot = (name: string) => resolve(import.meta.dirname, "fixtures/lint-content", name);
const temporaryRoots: string[] = [];

function workspace(documents: Record<string, string[]>, baseline: string[] = []) {
  const root = mkdtempSync(resolve(tmpdir(), "asdlc-content-test-"));
  temporaryRoots.push(root);
  for (const [id, relatedIds] of Object.entries(documents)) {
    const file = resolve(root, "src/content", `${id}.md`);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, `---\nrelatedIds: ${JSON.stringify(relatedIds)}\n---\n`);
  }
  const baselinePath = resolve(root, "baseline.json");
  writeFileSync(baselinePath, JSON.stringify(baseline));
  return { root, baselinePath };
}

function headingWorkspace(body: string) {
  const options = workspace({ "patterns/example": [] });
  writeFileSync(resolve(options.root, "src/content/patterns/example.md"),
    `---\nrelatedIds: []\n---\n${body}`);
  return options;
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of temporaryRoots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("article H2 integrity", () => {
  it("reports duplicate headings with original source line numbers and fails lint", async () => {
    const options = headingWorkspace("## Relationship\n\n## Relationship\n");
    await expect(findContentIntegrityErrors(options)).resolves.toEqual([
      'src/content/patterns/example.md:6: duplicate H2 "Relationship" (first at line 4)',
    ]);
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(lintContent(options)).resolves.toBe(false);
  });

  it("accepts unique, case-distinct H2s and repeated H3s", async () => {
    const options = headingWorkspace("## Alpha\n## alpha\n## Beta\n### Repeated\n### Repeated\n");
    await expect(lintContent(options)).resolves.toBe(true);
  });

  it("normalizes whitespace and optional closing markers", async () => {
    const options = headingWorkspace("  ##  Relationship  ###\n## Relationship\n");
    await expect(findContentIntegrityErrors(options)).resolves.toHaveLength(1);
  });

  it("handles empty H2 headings", async () => {
    const options = headingWorkspace("##\n## ###\n");
    await expect(findContentIntegrityErrors(options)).resolves.toHaveLength(1);
  });

  it.each(["concepts", "patterns", "practices", "recipes"])(
    "checks %s without comparing headings across articles", async (collection) => {
      const options = headingWorkspace("## Shared\n");
      const file = resolve(options.root, `src/content/${collection}/other.md`);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, "---\nrelatedIds: []\n---\n## Shared\n");
      await expect(lintContent(options)).resolves.toBe(true);
      writeFileSync(file, "---\nrelatedIds: []\n---\n## Shared\n## Shared\n");
      await expect(findContentIntegrityErrors(options)).resolves.toHaveLength(1);
    },
  );

  it("ignores frontmatter examples", async () => {
    const options = headingWorkspace("");
    writeFileSync(resolve(options.root, "src/content/patterns/example.md"),
      '---\nexample: |\n  ## Shared\n  ## Shared\nrelatedIds: []\n---\n## Shared\n');
    await expect(lintContent(options)).resolves.toBe(true);
  });

  it.each(["`", "~"])("ignores %s fences and requires a matching, long-enough closer", async (marker) => {
    const fence = marker.repeat(4);
    const other = marker === "`" ? "~~~" : "```";
    const options = headingWorkspace([
      "## Shared", `${fence}markdown`, "## Shared", marker.repeat(3),
      "## Shared", other, "## Shared", `${fence}not-a-closer`,
      "## Shared", marker.repeat(5), "## Unique",
    ].join("\n"));
    await expect(lintContent(options)).resolves.toBe(true);
  });

  it.each(["```", "~~~"])("resumes checks after a %s fenced example", async (fence) => {
    const options = headingWorkspace([
      "## Shared", `${fence}markdown`, "## Shared", fence, "## Shared",
    ].join("\n"));
    await expect(findContentIntegrityErrors(options)).resolves.toEqual([
      'src/content/patterns/example.md:8: duplicate H2 "Shared" (first at line 4)',
    ]);
  });

  it("ignores indented code and preserves heading line numbers without frontmatter", async () => {
    const options = headingWorkspace("");
    writeFileSync(resolve(options.root, "src/content/patterns/example.md"),
      "    ## Shared\n    ## Shared\n## Shared\n## Shared\n");
    await expect(findContentIntegrityErrors(options)).resolves.toEqual([
      'src/content/patterns/example.md:4: duplicate H2 "Shared" (first at line 3)',
    ]);
  });
});

describe("content integrity linter", () => {
  it("accepts reciprocal relationships", async () => {
    await expect(findContentIntegrityErrors({ root: fixtureRoot("valid") })).resolves.toEqual([]);
  });

  it("reports nonexistent and asymmetric relationships", async () => {
    await expect(findContentIntegrityErrors({ root: fixtureRoot("invalid") })).resolves.toEqual([
      'src/content/concepts/alpha.md: relatedIds references nonexistent document "patterns/missing"',
      'src/content/patterns/beta.md: relatedIds relationship with "concepts/alpha" is not reciprocal',
    ]);
  });

  it("accepts one-way recipe links to all KB collections", async () => {
    const options = workspace({
      "recipes/example": ["concepts/alpha", "patterns/beta", "practices/gamma"],
      "concepts/alpha": [],
      "patterns/beta": [],
      "practices/gamma": [],
    });
    await expect(lintContent(options)).resolves.toBe(true);
  });

  it("still requires recipe targets to exist and other links to be reciprocal", async () => {
    const options = workspace({
      "recipes/example": ["concepts/missing", "recipes/other"],
      "recipes/other": [],
      "concepts/alpha": ["recipes/example"],
    });
    await expect(findContentIntegrityErrors(options)).resolves.toEqual([
      'src/content/concepts/alpha.md: relatedIds relationship with "recipes/example" is not reciprocal',
      'src/content/recipes/example.md: relatedIds references nonexistent document "concepts/missing"',
      'src/content/recipes/example.md: relatedIds relationship with "recipes/other" is not reciprocal',
    ]);
  });

  it("allows only baseline defects and counts them separately from new defects", async () => {
    const legacy = 'src/content/concepts/alpha.md: relatedIds references nonexistent document "patterns/old"';
    const options = workspace({ "concepts/alpha": ["patterns/old"] }, [legacy]);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(lintContent(options)).resolves.toBe(true);
    writeFileSync(resolve(options.root, "src/content/concepts/alpha.md"),
      '---\nrelatedIds: ["patterns/old", "patterns/new"]\n---\n');
    await expect(lintContent(options)).resolves.toBe(false);
    expect(warn).toHaveBeenLastCalledWith("! 1 documented legacy relationship defects remain");
  });

  it("requires retiring resolved exemptions and rejects a reintroduced defect", async () => {
    const legacy = 'src/content/concepts/alpha.md: relatedIds relationship with "patterns/beta" is not reciprocal';
    const options = workspace({
      "concepts/alpha": ["patterns/beta"],
      "patterns/beta": ["concepts/alpha"],
    }, [legacy]);
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(lintContent(options)).resolves.toBe(false);
    expect(error).toHaveBeenCalledWith(expect.stringContaining("Remove 1 resolved exemptions"));
    writeFileSync(options.baselinePath, "[]");
    await expect(lintContent(options)).resolves.toBe(true);
    writeFileSync(resolve(options.root, "src/content/patterns/beta.md"), '---\nrelatedIds: []\n---\n');
    await expect(lintContent(options)).resolves.toBe(false);
  });

  it("does not label a new defect as legacy debt", async () => {
    const options = workspace({ "concepts/alpha": ["patterns/missing"] });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(lintContent(options)).resolves.toBe(false);
    expect(warn).not.toHaveBeenCalled();
  });
});
