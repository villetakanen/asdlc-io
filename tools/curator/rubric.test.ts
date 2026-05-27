import { describe, expect, it } from "vitest";
import {
  CONFIDENCE_BANDS,
  CONFIDENCE_MULTIPLIER,
  defaultRubric,
  DISCOVERABILITY,
  MIN_IMPRESSIONS_FOR_SIGNAL,
  POLISH,
  REFRESH,
  STALE_SNAPSHOT_DAYS,
  UPGRADE,
  WINDOWS,
} from "./rubric.ts";

// Pinning tests: these force any rubric change to be an intentional, reviewed PR edit.
describe("rubric v1 defaults (pinned)", () => {
  it("signal/staleness thresholds", () => {
    expect(MIN_IMPRESSIONS_FOR_SIGNAL).toBe(50);
    expect(STALE_SNAPSHOT_DAYS).toBe(14);
  });

  it("aggregation windows", () => {
    expect(WINDOWS).toEqual({ signalDays: 28, recentDays: 60, priorDays: 60, minHistoryDays: 120 });
  });

  it("Polish thresholds + weight", () => {
    expect(POLISH).toEqual({ minImpressions: 500, maxCtr: 0.02, maxPosition: 10, weight: 4 });
  });

  it("Upgrade thresholds + weight", () => {
    expect(UPGRADE).toEqual({ minPosition: 11, maxPosition: 20, minImpressions: 200, weight: 3 });
  });

  it("Refresh thresholds + weight", () => {
    expect(REFRESH).toEqual({ minDeclineRatio: 0.3, minPublishAgeMonths: 6, weight: 2 });
  });

  it("Discoverability weight", () => {
    expect(DISCOVERABILITY).toEqual({ weight: 1 });
  });

  it("confidence bands", () => {
    expect(CONFIDENCE_BANDS).toEqual({
      highMinImpressions: 1000,
      mediumMinImpressions: 200,
      lowMinImpressions: 50,
    });
  });

  it("confidence multipliers", () => {
    expect(CONFIDENCE_MULTIPLIER).toEqual({ high: 1.0, medium: 0.7, low: 0.4, "n/a": 0.5 });
  });

  it("bucket precedence is Polish > Upgrade > Refresh", () => {
    expect(defaultRubric.bucketPrecedence).toEqual(["Polish", "Upgrade", "Refresh"]);
  });
});
