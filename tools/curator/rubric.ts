/**
 * @curator triage rubric — the single source of truth for every threshold and
 * weight. No magic numbers may live in triage.ts, the skill prompt, or the
 * report template. Changes here are gated by the pinning tests in rubric.test.ts.
 * See specs/content-curator/spec.md.
 */

export type Bucket = "Polish" | "Upgrade" | "Refresh" | "Discoverability";
export type Confidence = "high" | "medium" | "low" | "n/a";

/** Articles below this many impressions in the signal window have too-noisy signal. */
export const MIN_IMPRESSIONS_FOR_SIGNAL = 50;

/** A snapshot older than this many days triggers a prominent staleness warning. */
export const STALE_SNAPSHOT_DAYS = 14;

/** Day windows used for aggregation. */
export const WINDOWS = {
  /** Polish/Upgrade signal + confidence window. */
  signalDays: 28,
  /** Refresh: most-recent window. */
  recentDays: 60,
  /** Refresh: prior comparison window (days 61–120 ago). */
  priorDays: 60,
  /** Minimum snapshot history required to compute Refresh at all. */
  minHistoryDays: 120,
} as const;

export const POLISH = {
  minImpressions: 500,
  maxCtr: 0.02,
  maxPosition: 10,
  weight: 4,
} as const;

export const UPGRADE = {
  minPosition: 11,
  maxPosition: 20,
  minImpressions: 200,
  weight: 3,
} as const;

export const REFRESH = {
  minDeclineRatio: 0.3,
  minPublishAgeMonths: 6,
  weight: 2,
} as const;

export const DISCOVERABILITY = {
  weight: 1,
} as const;

/**
 * Impression bands (signal window) that set Polish/Upgrade/Refresh confidence.
 * `lowMinImpressions` mirrors MIN_IMPRESSIONS_FOR_SIGNAL: the lower bound of the
 * "low" band is the same gate that excludes an article from the signal buckets
 * entirely, so anything that reaches confidence scoring is already ≥ this value.
 */
export const CONFIDENCE_BANDS = {
  highMinImpressions: 1000,
  mediumMinImpressions: 200,
  lowMinImpressions: MIN_IMPRESSIONS_FOR_SIGNAL,
} as const;

export const CONFIDENCE_MULTIPLIER: Record<Confidence, number> = {
  high: 1.0,
  medium: 0.7,
  low: 0.4,
  "n/a": 0.5,
};

/** Bucket precedence when multiple signals match. Earlier wins. */
export const BUCKET_PRECEDENCE: readonly Bucket[] = ["Polish", "Upgrade", "Refresh"] as const;

export interface Rubric {
  minImpressionsForSignal: number;
  staleSnapshotDays: number;
  windows: typeof WINDOWS;
  polish: typeof POLISH;
  upgrade: typeof UPGRADE;
  refresh: typeof REFRESH;
  discoverability: typeof DISCOVERABILITY;
  confidenceBands: typeof CONFIDENCE_BANDS;
  confidenceMultiplier: Record<Confidence, number>;
  bucketPrecedence: readonly Bucket[];
}

export const defaultRubric: Rubric = {
  minImpressionsForSignal: MIN_IMPRESSIONS_FOR_SIGNAL,
  staleSnapshotDays: STALE_SNAPSHOT_DAYS,
  windows: WINDOWS,
  polish: POLISH,
  upgrade: UPGRADE,
  refresh: REFRESH,
  discoverability: DISCOVERABILITY,
  confidenceBands: CONFIDENCE_BANDS,
  confidenceMultiplier: CONFIDENCE_MULTIPLIER,
  bucketPrecedence: BUCKET_PRECEDENCE,
};
