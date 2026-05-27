import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getLatestSnapshot, joinPageToArticle, loadSnapshot } from "./index";
import { gscRowSchema } from "./schema";

const validRow = {
  snapshotDate: "2026-05-27",
  date: "2026-05-20",
  page: "https://asdlc.io/patterns/typed-handoffs",
  query: "typed handoffs",
  clicks: 12,
  impressions: 340,
  ctr: 0.035,
  position: 8.4,
};

describe("gscRowSchema", () => {
  it("accepts a well-formed row", () => {
    expect(() => gscRowSchema.parse(validRow)).not.toThrow();
  });

  it("rejects ctr above 1", () => {
    expect(() => gscRowSchema.parse({ ...validRow, ctr: 1.5 })).toThrow();
  });

  it("rejects non-ISO dates", () => {
    expect(() => gscRowSchema.parse({ ...validRow, date: "20 May 2026" })).toThrow();
  });

  it("rejects negative clicks", () => {
    expect(() => gscRowSchema.parse({ ...validRow, clicks: -1 })).toThrow();
  });
});

describe("snapshot helpers", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), "gsc-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("getLatestSnapshot returns the newest dated file", () => {
    writeFileSync(path.join(dir, "2026-05-20.jsonl"), "");
    writeFileSync(path.join(dir, "2026-05-27.jsonl"), "");
    writeFileSync(path.join(dir, "ignore.txt"), "");
    const latest = getLatestSnapshot(dir);
    expect(latest.date).toBe("2026-05-27");
    expect(latest.path).toBe(path.join(dir, "2026-05-27.jsonl"));
  });

  it("getLatestSnapshot throws when no snapshot exists", () => {
    expect(() => getLatestSnapshot(dir)).toThrow(/No GSC snapshot/);
  });

  it("loadSnapshot parses and validates every line, skipping blanks", () => {
    const file = path.join(dir, "2026-05-27.jsonl");
    writeFileSync(
      file,
      `${JSON.stringify(validRow)}\n\n${JSON.stringify({ ...validRow, clicks: 5 })}\n`,
    );
    const rows = loadSnapshot(file);
    expect(rows).toHaveLength(2);
    expect(rows[1].clicks).toBe(5);
  });

  it("loadSnapshot throws on invalid JSON with the line number", () => {
    const file = path.join(dir, "2026-05-27.jsonl");
    writeFileSync(file, `${JSON.stringify(validRow)}\nnot-json\n`);
    expect(() => loadSnapshot(file)).toThrow(/:2 is not valid JSON/);
  });

  it("loadSnapshot rejects a row that fails the schema", () => {
    const file = path.join(dir, "2026-05-27.jsonl");
    writeFileSync(file, JSON.stringify({ ...validRow, ctr: 9 }));
    expect(() => loadSnapshot(file)).toThrow();
  });
});

describe("joinPageToArticle", () => {
  let root: string;

  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), "content-"));
    mkdirSync(path.join(root, "patterns"), { recursive: true });
    writeFileSync(path.join(root, "patterns", "typed-handoffs.md"), "## x");
  });

  afterEach(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it("resolves a content article", () => {
    expect(joinPageToArticle("https://asdlc.io/patterns/typed-handoffs", root)).toBe(
      path.join(root, "patterns", "typed-handoffs.md"),
    );
  });

  it("returns null for an unknown URL", () => {
    expect(joinPageToArticle("https://asdlc.io/about", root)).toBeNull();
  });

  it("returns null for a single-segment path", () => {
    expect(joinPageToArticle("https://asdlc.io/patterns", root)).toBeNull();
  });

  it("returns null for a non-URL string", () => {
    expect(joinPageToArticle("not a url", root)).toBeNull();
  });
});
