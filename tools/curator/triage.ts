/**
 * @curator triage — pure classification of content articles into refresh buckets
 * from GSC snapshot data. No network, no I/O; time is injected via `now`.
 * All thresholds come from the rubric. See specs/content-curator/spec.md.
 */

import type { GscRow } from "../gsc/schema.ts";
import type { Bucket, Confidence, Rubric } from "./rubric.ts";
import { defaultRubric } from "./rubric.ts";

export interface Article {
  /** Collection id, e.g. "patterns/typed-handoffs". */
  id: string;
  /** Source file path, e.g. "src/content/patterns/typed-handoffs.md". */
  path: string;
  /** Public URL, e.g. "https://asdlc.io/patterns/typed-handoffs/". */
  url: string;
  /** Publish date, used by the Refresh age gate. */
  publishedDate?: Date;
}

export interface ArticleMetrics {
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
}

export interface TriagedArticle {
  article: Article;
  bucket: Bucket;
  confidence: Confidence;
  priorityScore: number;
  signal: string;
  metrics: ArticleMetrics;
}

export interface TriageResult {
  /** Sorted descending by priorityScore. */
  triaged: TriagedArticle[];
  healthy: Article[];
  excludedLowTraffic: Article[];
  refreshInsufficientData: boolean;
  snapshotHistoryDays: number;
  counts: {
    corpus: number;
    withRows: number;
    triaged: number;
    healthy: number;
    excludedLowTraffic: number;
  };
}

const MS_PER_DAY = 86_400_000;

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function ageInDays(now: Date, date: string): number {
  return Math.floor((now.getTime() - new Date(`${date}T00:00:00Z`).getTime()) / MS_PER_DAY);
}

interface PageAgg {
  imp28: number;
  clicks28: number;
  posWeighted28: number;
  clicksRecent60: number;
  clicksPrior60: number;
}

function emptyAgg(): PageAgg {
  return { imp28: 0, clicks28: 0, posWeighted28: 0, clicksRecent60: 0, clicksPrior60: 0 };
}

function aggregate(rows: GscRow[], now: Date): Map<string, PageAgg> {
  const byPage = new Map<string, PageAgg>();
  for (const row of rows) {
    const key = normalizeUrl(row.page);
    const agg = byPage.get(key) ?? emptyAgg();
    const age = ageInDays(now, row.date);
    if (age >= 0 && age < 28) {
      agg.imp28 += row.impressions;
      agg.clicks28 += row.clicks;
      agg.posWeighted28 += row.position * row.impressions;
    }
    if (age >= 0 && age < 60) {
      agg.clicksRecent60 += row.clicks;
    } else if (age >= 60 && age < 120) {
      agg.clicksPrior60 += row.clicks;
    }
    byPage.set(key, agg);
  }
  return byPage;
}

function metricsOf(agg: PageAgg): ArticleMetrics {
  return {
    impressions: agg.imp28,
    clicks: agg.clicks28,
    ctr: agg.imp28 > 0 ? agg.clicks28 / agg.imp28 : 0,
    position: agg.imp28 > 0 ? agg.posWeighted28 / agg.imp28 : 0,
  };
}

function confidenceFor(impressions: number, rubric: Rubric): Confidence {
  const { highMinImpressions, mediumMinImpressions } = rubric.confidenceBands;
  if (impressions >= highMinImpressions) return "high";
  if (impressions >= mediumMinImpressions) return "medium";
  return "low";
}

function monthsAgo(now: Date, months: number): Date {
  const d = new Date(now);
  d.setUTCMonth(d.getUTCMonth() - months);
  return d;
}

function snapshotHistoryDays(rows: GscRow[]): number {
  if (rows.length === 0) return 0;
  let min = rows[0].date;
  let max = rows[0].date;
  for (const row of rows) {
    if (row.date < min) min = row.date;
    if (row.date > max) max = row.date;
  }
  return Math.round(
    (new Date(`${max}T00:00:00Z`).getTime() - new Date(`${min}T00:00:00Z`).getTime()) / MS_PER_DAY,
  );
}

function matchPolish(m: ArticleMetrics, r: Rubric): boolean {
  return m.impressions >= r.polish.minImpressions && m.ctr < r.polish.maxCtr && m.position <= r.polish.maxPosition;
}

function matchUpgrade(m: ArticleMetrics, r: Rubric): boolean {
  return m.position >= r.upgrade.minPosition && m.position <= r.upgrade.maxPosition && m.impressions >= r.upgrade.minImpressions;
}

function refreshDecline(agg: PageAgg): number | null {
  if (agg.clicksPrior60 <= 0) return null;
  return (agg.clicksPrior60 - agg.clicksRecent60) / agg.clicksPrior60;
}

function matchRefresh(
  agg: PageAgg,
  article: Article,
  now: Date,
  r: Rubric,
): { matched: boolean; decline: number } {
  const decline = refreshDecline(agg);
  if (decline === null || decline < r.refresh.minDeclineRatio) return { matched: false, decline: decline ?? 0 };
  if (!article.publishedDate) return { matched: false, decline };
  const cutoff = monthsAgo(now, r.refresh.minPublishAgeMonths);
  return { matched: article.publishedDate < cutoff, decline };
}

export function triage(
  rows: GscRow[],
  articles: Article[],
  rubric: Rubric = defaultRubric,
  now: Date = new Date(),
): TriageResult {
  const byPage = aggregate(rows, now);
  const historyDays = snapshotHistoryDays(rows);
  const refreshInsufficientData = historyDays < rubric.windows.minHistoryDays;

  const triaged: TriagedArticle[] = [];
  const healthy: Article[] = [];
  const excludedLowTraffic: Article[] = [];
  let withRows = 0;

  for (const article of articles) {
    const agg = byPage.get(normalizeUrl(article.url));

    // Discoverability: file exists but the page has no snapshot rows at all.
    if (agg === undefined) {
      triaged.push({
        article,
        bucket: "Discoverability",
        confidence: "n/a",
        priorityScore: rubric.discoverability.weight * rubric.confidenceMultiplier["n/a"] * 0,
        signal: "no snapshot rows in window — hand to geo-audit",
        metrics: { impressions: 0, clicks: 0, ctr: 0, position: 0 },
      });
      continue;
    }

    withRows += 1;
    const m = metricsOf(agg);

    // Exclusion: too little signal for Polish/Upgrade/Refresh, and it has rows
    // (so it is not Discoverability either).
    if (m.impressions < rubric.minImpressionsForSignal) {
      excludedLowTraffic.push(article);
      continue;
    }

    const confidence = confidenceFor(m.impressions, rubric);
    const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
    const signalCells = `${m.impressions} imp, ${pct(m.ctr)} CTR, pos ${m.position.toFixed(1)}`;

    let bucket: Bucket | null = null;
    let signal = signalCells;

    // Precedence: Polish > Upgrade > Refresh.
    if (matchPolish(m, rubric)) {
      bucket = "Polish";
    } else if (matchUpgrade(m, rubric)) {
      bucket = "Upgrade";
    } else if (!refreshInsufficientData) {
      const refresh = matchRefresh(agg, article, now, rubric);
      if (refresh.matched) {
        bucket = "Refresh";
        signal = `${(refresh.decline * 100).toFixed(0)}% click decline (60d vs prior 60d)`;
      }
    }

    if (bucket === null) {
      healthy.push(article);
      continue;
    }

    const weight =
      bucket === "Polish" ? rubric.polish.weight : bucket === "Upgrade" ? rubric.upgrade.weight : rubric.refresh.weight;
    triaged.push({
      article,
      bucket,
      confidence,
      priorityScore: weight * rubric.confidenceMultiplier[confidence] * m.impressions,
      signal,
      metrics: m,
    });
  }

  triaged.sort((a, b) => b.priorityScore - a.priorityScore);

  return {
    triaged,
    healthy,
    excludedLowTraffic,
    refreshInsufficientData,
    snapshotHistoryDays: historyDays,
    counts: {
      corpus: articles.length,
      withRows,
      triaged: triaged.length,
      healthy: healthy.length,
      excludedLowTraffic: excludedLowTraffic.length,
    },
  };
}
