#!/usr/bin/env node
/**
 * @curator runner — loads the latest GSC snapshot, triages the content corpus,
 * writes a markdown report to reports/curator/YYYY-MM-DD.md.
 * See specs/content-curator/spec.md.
 *
 * Run via: pnpm curator [-- --page /patterns/foo] [--live]
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { glob } from "glob";
import matter from "gray-matter";
import { getLatestSnapshot, loadSnapshot } from "../tools/gsc/index.ts";
import type { GscRow } from "../tools/gsc/schema.ts";
import { defaultRubric } from "../tools/curator/rubric.ts";
import { type Article, triage, type TriageResult, type TriagedArticle } from "../tools/curator/triage.ts";

const CONTENT_ROOT = "src/content";
const COLLECTIONS = ["concepts", "patterns", "practices"] as const;
const SITE_ORIGIN = "https://asdlc.io";
const REPORT_DIR = "reports/curator";

interface Args {
  page?: string;
  live: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { live: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--live") args.live = true;
    else if (a === "--page") args.page = argv[++i];
  }
  return args;
}

function loadArticles(): Article[] {
  const articles: Article[] = [];
  for (const collection of COLLECTIONS) {
    const files = glob.sync("**/*.md", { cwd: path.join(CONTENT_ROOT, collection) });
    for (const rel of files) {
      const fullPath = path.join(CONTENT_ROOT, collection, rel);
      const fm = matter(readFileSync(fullPath, "utf8")).data as { publishedDate?: string | Date };
      const slug = rel.replace(/\.md$/, "").replace(/\\/g, "/");
      const id = `${collection}/${slug}`;
      articles.push({
        id,
        path: fullPath,
        url: `${SITE_ORIGIN}/${collection}/${slug}/`,
        publishedDate: fm.publishedDate ? new Date(fm.publishedDate) : undefined,
      });
    }
  }
  return articles;
}

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

interface QueryAgg {
  clicks: number;
  impressions: number;
}

const MS_PER_DAY = 86_400_000;

function topQueriesByPage(rows: GscRow[], now: Date, windowDays: number, topN: number): Map<string, Array<{ query: string; clicks: number; impressions: number }>> {
  const byPageQuery = new Map<string, Map<string, QueryAgg>>();
  for (const row of rows) {
    const age = Math.floor((now.getTime() - new Date(`${row.date}T00:00:00Z`).getTime()) / MS_PER_DAY);
    if (age < 0 || age >= windowDays) continue;
    const pageKey = row.page.replace(/\/+$/, "");
    let queries = byPageQuery.get(pageKey);
    if (!queries) {
      queries = new Map();
      byPageQuery.set(pageKey, queries);
    }
    const agg = queries.get(row.query) ?? { clicks: 0, impressions: 0 };
    agg.clicks += row.clicks;
    agg.impressions += row.impressions;
    queries.set(row.query, agg);
  }
  const out = new Map<string, Array<{ query: string; clicks: number; impressions: number }>>();
  for (const [page, queries] of byPageQuery) {
    const sorted = [...queries.entries()]
      .map(([query, agg]) => ({ query, ...agg }))
      .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)
      .slice(0, topN);
    out.set(page, sorted);
  }
  return out;
}

function formatQueries(qs: Array<{ query: string; clicks: number; impressions: number }> | undefined): string {
  if (!qs || qs.length === 0) return "_no queries in window_";
  return qs.map((q) => `\`${q.query}\` (${q.clicks}c / ${q.impressions}i)`).join(", ");
}

function snapshotAgeDays(snapshotDate: string, now: Date): number {
  const ms = now.getTime() - new Date(`${snapshotDate}T00:00:00Z`).getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}

function renderReport(
  result: TriageResult,
  topQueries: Map<string, Array<{ query: string; clicks: number; impressions: number }>>,
  snapshotPath: string,
  snapshotDate: string,
  now: Date,
  refreshed: boolean,
): string {
  const ageDays = snapshotAgeDays(snapshotDate, now);
  const lines: string[] = [];
  const today = now.toISOString().slice(0, 10);

  lines.push(`# Curator Report — ${today}`);
  lines.push("");
  lines.push(`Snapshot: ${snapshotPath} (${ageDays} days old${refreshed ? ", refreshed" : ""})`);
  lines.push(
    `Articles in corpus: ${result.counts.corpus} | With snapshot rows: ${result.counts.withRows} | ` +
      `Triaged: ${result.counts.triaged} | Healthy: ${result.counts.healthy} | ` +
      `Excluded (low traffic): ${result.counts.excludedLowTraffic}`,
  );
  lines.push("");

  if (result.refreshInsufficientData) {
    lines.push(`> Refresh bucket: insufficient data (< ${defaultRubric.windows.minHistoryDays}d snapshot history). Skipped.`);
    lines.push("");
  }
  if (ageDays > defaultRubric.staleSnapshotDays) {
    lines.push(`> ⚠ Snapshot is ${ageDays} days old (> ${defaultRubric.staleSnapshotDays}d). Run \`pnpm gsc:snapshot\`.`);
    lines.push("");
  }

  lines.push("## Top 10 priorities");
  lines.push("");
  if (result.triaged.length === 0) {
    lines.push("_No articles triaged._");
  } else {
    lines.push("| # | Article | Bucket | Signal | Confidence |");
    lines.push("|---|---|---|---|---|");
    for (const [i, t] of result.triaged.slice(0, 10).entries()) {
      lines.push(`| ${i + 1} | [${t.article.id}](${t.article.path}) | ${t.bucket} | ${t.signal} | ${t.confidence} |`);
    }
  }
  lines.push("");

  lines.push("## By bucket");
  lines.push("");
  for (const bucket of ["Polish", "Upgrade", "Refresh", "Discoverability"] as const) {
    const items = result.triaged.filter((t) => t.bucket === bucket);
    if (bucket === "Refresh" && result.refreshInsufficientData) {
      lines.push(`### Refresh — insufficient data (< ${defaultRubric.windows.minHistoryDays}d snapshot history)`);
      lines.push("");
      continue;
    }
    lines.push(`### ${bucket} (${items.length} articles)`);
    lines.push("");
    if (bucket === "Discoverability" && items.length > 0) {
      lines.push("_File exists but no snapshot rows in window — hand to `geo-audit`._");
      lines.push("");
    }
    for (const t of items) {
      const m = t.metrics;
      const detail =
        bucket === "Discoverability"
          ? "no snapshot rows in window — hand to `geo-audit`"
          : `${m.impressions} impressions, ${pct(m.ctr)} CTR at position ${m.position.toFixed(1)}`;
      lines.push(`- [${t.article.id}](${t.article.path}) — ${detail}`);
      if (bucket !== "Discoverability") {
        const qs = topQueries.get(t.article.url.replace(/\/+$/, ""));
        lines.push(`  - Top queries: ${formatQueries(qs)}`);
      }
    }
    if (items.length === 0) lines.push("_None._");
    lines.push("");
  }

  lines.push(`## Healthy — no action (${result.healthy.length} articles)`);
  lines.push("");
  for (const a of result.healthy) {
    lines.push(`- [${a.id}](${a.path})`);
  }
  lines.push("");

  return lines.join("\n");
}

function renderSingleArticle(
  result: TriageResult,
  topQueries: Map<string, Array<{ query: string; clicks: number; impressions: number }>>,
  articleId: string,
  snapshotDate: string,
  now: Date,
  refreshed: boolean,
): string {
  const ageDays = snapshotAgeDays(snapshotDate, now);
  const found =
    result.triaged.find((t) => t.article.id === articleId) ??
    result.triaged.find((t) => t.article.id.endsWith(articleId)) ??
    null;
  const healthy = result.healthy.find((a) => a.id === articleId || a.id.endsWith(articleId));

  const lines: string[] = [];
  lines.push(`# Curator — Single Article: ${articleId}`);
  lines.push("");
  lines.push(`Data source: snapshot ${snapshotDate}${refreshed ? " (refreshed)" : ""} (${ageDays} days old)`);
  lines.push("");
  if (found) {
    const m = found.metrics;
    lines.push(`**Bucket:** ${found.bucket}  `);
    lines.push(`**Confidence:** ${found.confidence}  `);
    lines.push(`**Signal:** ${found.signal}  `);
    lines.push(
      `**Metrics (28d):** ${m.impressions} impressions, ${m.clicks} clicks, ${pct(m.ctr)} CTR, position ${m.position.toFixed(1)}`,
    );
    lines.push("");
    lines.push(`**Top queries:** ${formatQueries(topQueries.get(found.article.url.replace(/\/+$/, "")))}`);
    lines.push("");
    lines.push(`**Suggested action:** ${suggestedAction(found)}`);
  } else if (healthy) {
    lines.push("**Bucket:** Healthy — no action.");
  } else {
    lines.push("Article not found in the corpus, or excluded as low-traffic.");
  }
  return lines.join("\n");
}

function suggestedAction(t: TriagedArticle): string {
  switch (t.bucket) {
    case "Polish":
      return "Rewrite title and meta description; no content change. Re-check next snapshot.";
    case "Upgrade":
      return "Add depth, internal links, and structured data. Pass to `@dev` or `@assess`.";
    case "Refresh":
      return "Update examples and re-anchor to current practices. Pass to `@dev`.";
    case "Discoverability":
      return "Hand to `geo-audit`. Article exists but is absent from GSC data in the window.";
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const now = new Date();

  let refreshed = false;
  if (args.live) {
    console.error("curator — running pnpm gsc:snapshot (--live)…");
    execFileSync("pnpm", ["gsc:snapshot"], { stdio: "inherit" });
    refreshed = true;
  }

  const { path: snapshotPath, date: snapshotDate } = getLatestSnapshot();
  const rows = loadSnapshot(snapshotPath);
  const articles = loadArticles();
  const result = triage(rows, articles, defaultRubric, now);
  const topQueries = topQueriesByPage(rows, now, defaultRubric.windows.signalDays, 3);

  if (!existsSync(REPORT_DIR)) mkdirSync(REPORT_DIR, { recursive: true });
  const today = now.toISOString().slice(0, 10);
  const reportPath = path.join(REPORT_DIR, `${today}.md`);

  const content = args.page
    ? renderSingleArticle(result, topQueries, args.page.replace(/^\/+|\/+$/g, ""), snapshotDate, now, refreshed)
    : renderReport(result, topQueries, snapshotPath, snapshotDate, now, refreshed);

  writeFileSync(reportPath, content);
  console.error(`curator — wrote ${reportPath}`);
  console.error(
    `  corpus=${result.counts.corpus} withRows=${result.counts.withRows} triaged=${result.counts.triaged} ` +
      `healthy=${result.counts.healthy} excluded=${result.counts.excludedLowTraffic} ` +
      `historyDays=${result.snapshotHistoryDays}`,
  );
}

main();
