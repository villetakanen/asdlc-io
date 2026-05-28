import { mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { type GscRow, gscRowSchema } from "./schema.ts";

export const PAGE_SIZE = 25_000;
export const WINDOW_DAYS = 120;
export const SNAPSHOT_DIR = "data/gsc";
export const DIMENSIONS = ["date", "page", "query"] as const;

/** One row as returned by the GSC searchAnalytics API for our dimension set. */
export interface SearchAnalyticsRow {
  keys: [date: string, page: string, query: string];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/** Fetches a single page of search-analytics rows. Injected so the core is testable. */
export type QueryPage = (params: {
  startDate: string;
  endDate: string;
  startRow: number;
  rowLimit: number;
}) => Promise<SearchAnalyticsRow[]>;

export interface SnapshotConfig {
  siteUrl: string;
  quotaProject: string | null;
}

export function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Trailing `days`-day window ending today (inclusive endpoints). */
export function snapshotWindow(
  today: Date,
  days: number = WINDOW_DAYS,
): { startDate: string; endDate: string } {
  const start = new Date(today);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  return { startDate: isoDay(start), endDate: isoDay(today) };
}

/** Resolve and validate runtime config from the environment. Throws naming any missing var. */
export function resolveConfig(env: Record<string, string | undefined>): SnapshotConfig {
  const siteUrl = env.GSC_SITE_URL?.trim();
  if (!siteUrl) {
    throw new Error("GSC_SITE_URL is not set (e.g. sc-domain:asdlc.io)");
  }
  return { siteUrl, quotaProject: env.GSC_QUOTA_PROJECT?.trim() || null };
}

/** Page through the API via startRow until a short page signals the end. */
export async function fetchAllRows(
  queryPage: QueryPage,
  window: { startDate: string; endDate: string },
  pageSize: number = PAGE_SIZE,
): Promise<SearchAnalyticsRow[]> {
  const all: SearchAnalyticsRow[] = [];
  let startRow = 0;
  for (;;) {
    const page = await queryPage({ ...window, startRow, rowLimit: pageSize });
    all.push(...page);
    if (page.length < pageSize) {
      return all;
    }
    startRow += pageSize;
  }
}

export function toGscRows(rows: SearchAnalyticsRow[], snapshotDate: string): GscRow[] {
  return rows.map((row) =>
    gscRowSchema.parse({
      snapshotDate,
      date: row.keys[0],
      page: row.keys[1],
      query: row.keys[2],
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    }),
  );
}

/** Write JSONL via temp file + rename. On failure the temp is removed and no final file appears. */
export function writeSnapshotAtomic(dir: string, snapshotDate: string, rows: GscRow[]): string {
  mkdirSync(dir, { recursive: true });
  const finalPath = path.join(dir, `${snapshotDate}.jsonl`);
  const tmpPath = `${finalPath}.tmp`;
  try {
    const body = rows.map((row) => JSON.stringify(row)).join("\n");
    writeFileSync(tmpPath, rows.length > 0 ? `${body}\n` : "");
    renameSync(tmpPath, finalPath);
  } catch (error) {
    rmSync(tmpPath, { force: true });
    throw error;
  }
  return finalPath;
}

export async function runSnapshot(opts: {
  queryPage: QueryPage;
  today?: Date;
  dir?: string;
  pageSize?: number;
}): Promise<{ path: string; rowCount: number }> {
  const today = opts.today ?? new Date();
  const dir = opts.dir ?? SNAPSHOT_DIR;
  const window = snapshotWindow(today);
  const raw = await fetchAllRows(opts.queryPage, window, opts.pageSize ?? PAGE_SIZE);
  const rows = toGscRows(raw, isoDay(today));
  const finalPath = writeSnapshotAtomic(dir, isoDay(today), rows);
  return { path: finalPath, rowCount: rows.length };
}
