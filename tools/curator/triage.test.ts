import { describe, expect, it } from "vitest";
import type { GscRow } from "../gsc/schema.ts";
import { defaultRubric } from "./rubric.ts";
import { type Article, triage } from "./triage.ts";

const NOW = new Date("2026-05-27T00:00:00Z");
const OLD = new Date("2025-01-01T00:00:00Z"); // > 6 months before NOW
const RECENT = new Date("2026-05-01T00:00:00Z"); // < 6 months before NOW

function dayAgo(n: number): string {
  const d = new Date(NOW);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

function row(
  ageDays: number,
  page: string,
  o: { clicks: number; impressions: number; ctr: number; position: number },
): GscRow {
  return { snapshotDate: dayAgo(0), date: dayAgo(ageDays), page, query: "q", ...o };
}

function article(id: string, url: string, publishedDate?: Date): Article {
  return { id, path: `src/content/${id}.md`, url, publishedDate };
}

// Two history-anchor rows force a >=120-day span so Refresh is eligible.
function historyAnchors(page: string): GscRow[] {
  return [
    row(0, page, { clicks: 0, impressions: 0, ctr: 0, position: 0 }),
    row(121, page, { clicks: 0, impressions: 0, ctr: 0, position: 0 }),
  ];
}

const POLISH_URL = "https://asdlc.io/patterns/polish/";
const UPGRADE_URL = "https://asdlc.io/patterns/upgrade/";
const REFRESH_URL = "https://asdlc.io/patterns/refresh/";

function refreshRows(page: string) {
  return [
    ...historyAnchors(page),
    row(5, page, { clicks: 50, impressions: 100, ctr: 0.5, position: 5 }),
    row(40, page, { clicks: 450, impressions: 900, ctr: 0.5, position: 5 }),
    row(90, page, { clicks: 1000, impressions: 2000, ctr: 0.5, position: 5 }),
  ];
}

describe("triage — Polish", () => {
  it("positive: high impressions, low CTR, page-one position", () => {
    const rows = [row(5, POLISH_URL, { clicks: 6, impressions: 600, ctr: 0.01, position: 5 })];
    const result = triage(rows, [article("patterns/polish", POLISH_URL)], defaultRubric, NOW);
    expect(result.triaged[0].bucket).toBe("Polish");
    expect(result.triaged[0].confidence).toBe("medium");
    expect(result.triaged[0].priorityScore).toBeCloseTo(4 * 0.7 * 600);
  });

  it("negative: healthy CTR keeps it out of Polish", () => {
    const rows = [row(5, POLISH_URL, { clicks: 60, impressions: 600, ctr: 0.1, position: 5 })];
    const result = triage(rows, [article("patterns/polish", POLISH_URL)], defaultRubric, NOW);
    expect(result.triaged).toHaveLength(0);
    expect(result.healthy).toHaveLength(1);
  });
});

describe("triage — Upgrade", () => {
  it("positive: position 11-20 with enough impressions", () => {
    const rows = [row(5, UPGRADE_URL, { clicks: 9, impressions: 300, ctr: 0.03, position: 15 })];
    const result = triage(rows, [article("patterns/upgrade", UPGRADE_URL)], defaultRubric, NOW);
    expect(result.triaged[0].bucket).toBe("Upgrade");
  });

  it("negative: position past 20 is not Upgrade", () => {
    const rows = [row(5, UPGRADE_URL, { clicks: 9, impressions: 300, ctr: 0.03, position: 25 })];
    const result = triage(rows, [article("patterns/upgrade", UPGRADE_URL)], defaultRubric, NOW);
    expect(result.triaged).toHaveLength(0);
    expect(result.healthy).toHaveLength(1);
  });
});

describe("triage — Refresh", () => {
  it("positive: >=30% click decline on an article older than 6 months", () => {
    const result = triage(refreshRows(REFRESH_URL), [article("patterns/refresh", REFRESH_URL, OLD)], defaultRubric, NOW);
    expect(result.refreshInsufficientData).toBe(false);
    expect(result.triaged[0].bucket).toBe("Refresh");
    expect(result.triaged[0].signal).toMatch(/50% click decline/);
  });

  it("negative: a recently-published article is not Refreshed", () => {
    const result = triage(refreshRows(REFRESH_URL), [article("patterns/refresh", REFRESH_URL, RECENT)], defaultRubric, NOW);
    expect(result.triaged).toHaveLength(0);
    expect(result.healthy).toHaveLength(1);
  });
});

describe("triage — Discoverability", () => {
  it("article with no snapshot rows lands in Discoverability with n/a confidence", () => {
    const rows = [row(5, POLISH_URL, { clicks: 6, impressions: 600, ctr: 0.01, position: 5 })];
    const result = triage(rows, [article("patterns/ghost", "https://asdlc.io/patterns/ghost/")], defaultRubric, NOW);
    expect(result.triaged[0].bucket).toBe("Discoverability");
    expect(result.triaged[0].confidence).toBe("n/a");
    expect(result.triaged[0].signal).toMatch(/geo-audit/);
  });
});

describe("triage — exclusion + precedence + counts", () => {
  it("excludes low-traffic articles from every bucket but counts them", () => {
    const rows = [row(5, POLISH_URL, { clicks: 1, impressions: 30, ctr: 0.033, position: 5 })];
    const result = triage(rows, [article("patterns/quiet", POLISH_URL)], defaultRubric, NOW);
    expect(result.triaged).toHaveLength(0);
    expect(result.healthy).toHaveLength(0);
    expect(result.excludedLowTraffic).toHaveLength(1);
    expect(result.counts).toMatchObject({ corpus: 1, withRows: 1, excludedLowTraffic: 1 });
  });

  it("Polish takes precedence when an article is also Refresh-eligible", () => {
    // Polish-shaped 28d signal, plus a declining 60/60 history on an old article.
    const page = "https://asdlc.io/patterns/both/";
    const rows = [
      ...historyAnchors(page),
      row(5, page, { clicks: 6, impressions: 600, ctr: 0.01, position: 5 }), // Polish-shaped
      row(90, page, { clicks: 1000, impressions: 2000, ctr: 0.5, position: 5 }), // prior-60 clicks
    ];
    const result = triage(rows, [article("patterns/both", page, OLD)], defaultRubric, NOW);
    expect(result.triaged[0].bucket).toBe("Polish");
  });

  it("sorts triaged by priority score descending", () => {
    const rows = [
      row(5, POLISH_URL, { clicks: 12, impressions: 1200, ctr: 0.01, position: 4 }), // Polish high
      row(5, UPGRADE_URL, { clicks: 9, impressions: 300, ctr: 0.03, position: 15 }), // Upgrade medium
    ];
    const result = triage(
      rows,
      [article("patterns/polish", POLISH_URL), article("patterns/upgrade", UPGRADE_URL)],
      defaultRubric,
      NOW,
    );
    expect(result.triaged.map((t) => t.bucket)).toEqual(["Polish", "Upgrade"]);
    expect(result.triaged[0].priorityScore).toBeGreaterThan(result.triaged[1].priorityScore);
  });
});

describe("triage — insufficient history", () => {
  it("flags insufficient data and skips Refresh while leaving Polish intact", () => {
    const rows = [
      row(5, POLISH_URL, { clicks: 6, impressions: 600, ctr: 0.01, position: 5 }), // Polish
      // refresh-shaped page but only ~45 days of history
      row(5, REFRESH_URL, { clicks: 50, impressions: 100, ctr: 0.5, position: 5 }),
      row(44, REFRESH_URL, { clicks: 500, impressions: 1000, ctr: 0.5, position: 5 }),
    ];
    const result = triage(
      rows,
      [article("patterns/polish", POLISH_URL), article("patterns/refresh", REFRESH_URL, OLD)],
      defaultRubric,
      NOW,
    );
    expect(result.refreshInsufficientData).toBe(true);
    expect(result.triaged.some((t) => t.bucket === "Refresh")).toBe(false);
    expect(result.triaged.some((t) => t.bucket === "Polish")).toBe(true);
  });
});
