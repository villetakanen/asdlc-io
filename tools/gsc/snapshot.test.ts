import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadSnapshot } from "./index.ts";
import {
  fetchAllRows,
  type QueryPage,
  resolveConfig,
  runSnapshot,
  type SearchAnalyticsRow,
  snapshotWindow,
  toGscRows,
  writeSnapshotAtomic,
} from "./snapshot.ts";

function row(date: string, page: string, query: string): SearchAnalyticsRow {
  return { keys: [date, page, query], clicks: 3, impressions: 50, ctr: 0.06, position: 4.2 };
}

describe("snapshotWindow", () => {
  it("spans the trailing N days inclusive of today", () => {
    expect(snapshotWindow(new Date("2026-05-27T00:00:00Z"), 120)).toEqual({
      startDate: "2026-01-28",
      endDate: "2026-05-27",
    });
  });
});

describe("resolveConfig", () => {
  it("returns site url and quota project", () => {
    expect(resolveConfig({ GSC_SITE_URL: "sc-domain:asdlc.io", GSC_QUOTA_PROJECT: "p" })).toEqual({
      siteUrl: "sc-domain:asdlc.io",
      quotaProject: "p",
    });
  });

  it("defaults quota project to null", () => {
    expect(resolveConfig({ GSC_SITE_URL: "sc-domain:asdlc.io" }).quotaProject).toBeNull();
  });

  it("throws naming GSC_SITE_URL when missing", () => {
    expect(() => resolveConfig({})).toThrow(/GSC_SITE_URL/);
  });
});

describe("fetchAllRows", () => {
  it("paginates across multiple pages until a short page", async () => {
    const pages: SearchAnalyticsRow[][] = [
      [row("2026-05-01", "https://asdlc.io/a", "x"), row("2026-05-01", "https://asdlc.io/b", "y")],
      [row("2026-05-02", "https://asdlc.io/c", "z")],
    ];
    const queryPage = vi.fn(async ({ startRow }: { startRow: number }) =>
      startRow === 0 ? pages[0] : pages[1],
    );
    const all = await fetchAllRows(
      queryPage,
      { startDate: "2026-05-01", endDate: "2026-05-02" },
      2,
    );
    expect(all).toHaveLength(3);
    expect(queryPage).toHaveBeenCalledTimes(2);
    expect(queryPage.mock.calls[0][0]).toMatchObject({ startRow: 0, rowLimit: 2 });
    expect(queryPage.mock.calls[1][0]).toMatchObject({ startRow: 2, rowLimit: 2 });
  });

  it("stops after a single short page", async () => {
    const queryPage = vi.fn(async () => [row("2026-05-01", "https://asdlc.io/a", "x")]);
    await fetchAllRows(queryPage, { startDate: "2026-05-01", endDate: "2026-05-02" }, 25_000);
    expect(queryPage).toHaveBeenCalledTimes(1);
  });
});

describe("toGscRows", () => {
  it("maps date/page/query keys and stamps snapshotDate", () => {
    const [mapped] = toGscRows([row("2026-05-01", "https://asdlc.io/a", "x")], "2026-05-27");
    expect(mapped).toMatchObject({
      snapshotDate: "2026-05-27",
      date: "2026-05-01",
      page: "https://asdlc.io/a",
      query: "x",
    });
  });

  it("throws when a row violates the schema", () => {
    const bad = { ...row("2026-05-01", "https://asdlc.io/a", "x"), ctr: 9 };
    expect(() => toGscRows([bad], "2026-05-27")).toThrow();
  });
});

describe("writeSnapshotAtomic + runSnapshot", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), "gsc-snap-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("writes a loadable JSONL and leaves no temp file", () => {
    const rows = toGscRows([row("2026-05-01", "https://asdlc.io/a", "x")], "2026-05-27");
    const out = writeSnapshotAtomic(dir, "2026-05-27", rows);
    expect(existsSync(out)).toBe(true);
    expect(existsSync(`${out}.tmp`)).toBe(false);
    expect(loadSnapshot(out)).toHaveLength(1);
  });

  it("overwrites an existing same-day snapshot", () => {
    writeSnapshotAtomic(
      dir,
      "2026-05-27",
      toGscRows([row("2026-05-01", "https://asdlc.io/a", "x")], "2026-05-27"),
    );
    const out = writeSnapshotAtomic(
      dir,
      "2026-05-27",
      toGscRows(
        [
          row("2026-05-02", "https://asdlc.io/b", "y"),
          row("2026-05-02", "https://asdlc.io/c", "z"),
        ],
        "2026-05-27",
      ),
    );
    expect(loadSnapshot(out)).toHaveLength(2);
  });

  it("leaves no final file when the API errors mid-pagination", async () => {
    const queryPage = vi
      .fn<QueryPage>()
      .mockResolvedValueOnce([
        row("2026-05-01", "https://asdlc.io/a", "x"),
        row("2026-05-01", "https://asdlc.io/b", "y"),
      ])
      .mockRejectedValueOnce(new Error("GSC API 500"));

    await expect(
      runSnapshot({ queryPage, today: new Date("2026-05-27T00:00:00Z"), dir, pageSize: 2 }),
    ).rejects.toThrow(/GSC API 500/);

    expect(existsSync(path.join(dir, "2026-05-27.jsonl"))).toBe(false);
  });

  it("runSnapshot writes the resolved row count", async () => {
    const queryPage = vi.fn(async () => [row("2026-05-01", "https://asdlc.io/a", "x")]);
    const result = await runSnapshot({
      queryPage,
      today: new Date("2026-05-27T00:00:00Z"),
      dir,
      pageSize: 25_000,
    });
    expect(result.rowCount).toBe(1);
    expect(result.path).toBe(path.join(dir, "2026-05-27.jsonl"));
    expect(readFileSync(result.path, "utf8").trimEnd().split("\n")).toHaveLength(1);
  });
});
