import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { findCodeTranscription, lintSpecs } from "../scripts/lint-specs.mjs";

const roots: string[] = [];
const fence = (code: string, language = "ts", delimiter = "```") =>
  `${delimiter}${language}\n${code}\n${delimiter}`;
const implementation = 'import { handler } from "./handler";\nexport const GET = handler;';
const frontmatter = '---\ntitle: Example\nstatus: draft\nowner: Test\ncreated: 2026-01-01\n---\n# Feature: Example\n\n';

function workspace(body: string) {
  const root = mkdtempSync(resolve(tmpdir(), "asdlc-spec-test-"));
  roots.push(root);
  mkdirSync(resolve(root, "specs/example"), { recursive: true });
  writeFileSync(resolve(root, "specs/example/spec.md"), frontmatter + body);
  return root;
}

afterEach(() => {
  vi.restoreAllMocks();
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("spec transcription heuristic", () => {
  it("flags a copied endpoint with its body line and reason", () => {
    expect(findCodeTranscription(`Intro\n\n${fence(implementation)}`)).toEqual([
      { line: 3, reasons: ["fenced code contains import/require statements"] },
    ]);
  });

  it.each([
    'import "./setup";',
    'import("./handler");',
    'const handler = require("./handler");',
    'export const handler = require ("./handler");',
  ])("detects module loading: %s", (code) => {
    expect(findCodeTranscription(fence(code))).toHaveLength(1);
  });

  it("allows short illustrative pseudocode and file references outside fences", () => {
    expect(findCodeTranscription(`See src/pages/example.ts.\n${fence("filter published articles\nbuild payload\nassert size limit", "")}\nUse import statements in implementation only.`)).toEqual([]);
  });

  it("checks the 25-line boundary", () => {
    expect(findCodeTranscription(fence(Array(25).fill("step").join("\n")))).toEqual([]);
    expect(findCodeTranscription(fence(Array(26).fill("step").join("\n")))[0].reasons).toEqual([
      "fenced code has 26 lines (maximum 25)",
    ]);
  });

  it.each(["gherkin", "json", "yaml", "mermaid", "markdown", "text"])(
    "preserves declarative %s contracts", (language) => {
      expect(findCodeTranscription(fence(Array(30).fill("contract").join("\n"), language))).toEqual([]);
    },
  );

  it("supports tilde fences, longer delimiters, indentation and CRLF", () => {
    const body = `  ~~~~ts\n${implementation}\n~~~\n  ~~~~~\n`.replaceAll("\n", "\r\n");
    expect(findCodeTranscription(body)).toHaveLength(1);
  });

  it("does not parse nested fences inside a longer Markdown example", () => {
    expect(findCodeTranscription(fence(fence(implementation), "markdown", "````"))).toEqual([]);
  });

  it("exempts only the immediately following block, allowing blank lines", () => {
    expect(findCodeTranscription(`<!-- lint:allow-code -->\n\n${fence(implementation)}\n${fence(implementation)}`)).toHaveLength(1);
    expect(findCodeTranscription(`<!-- lint:allow-code -->\nUnrelated prose\n${fence(implementation)}`)).toHaveLength(1);
  });

  it("does not accept an escape hatch inside the block", () => {
    expect(findCodeTranscription(fence(`<!-- lint:allow-code -->\n${implementation}`))).toHaveLength(1);
  });

  it("checks an unclosed fence through end of file", () => {
    expect(findCodeTranscription(`~~~ts\n${implementation}`)).toHaveLength(1);
  });
});

describe("spec linter integration", () => {
  it("warns by default, fails in strict mode, and never rewrites files", async () => {
    const root = workspace(fence(implementation));
    const path = resolve(root, "specs/example/spec.md");
    const original = readFileSync(path, "utf8");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
    await expect(lintSpecs({ root })).resolves.toBe(true);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("specs/example/spec.md: body line"));
    await expect(lintSpecs({ root, strictTranscription: true })).resolves.toBe(false);
    expect(readFileSync(path, "utf8")).toBe(original);
  });

  it("passes explicit exceptions in strict mode", async () => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    const root = workspace(`<!-- lint:allow-code -->\n${fence(implementation)}`);
    await expect(lintSpecs({ root, strictTranscription: true })).resolves.toBe(true);
  });

  it("retains schema failures even in warning mode and excludes archetype templates", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
    const root = workspace("A valid spec.");
    mkdirSync(resolve(root, "specs/content-articles"));
    writeFileSync(resolve(root, "specs/content-articles/spec.md"), "Not a spec");
    await expect(lintSpecs({ root, strictTranscription: true })).resolves.toBe(true);
    writeFileSync(resolve(root, "specs/example/spec.md"), "No frontmatter");
    await expect(lintSpecs({ root })).resolves.toBe(false);
  });

});
