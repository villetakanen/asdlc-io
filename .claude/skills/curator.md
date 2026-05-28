---
description: "@curator — triage the content corpus against the latest GSC snapshot and produce a refresh report"
argument-hint: "[--page <path>] [--live]"
allowed-tools:
  - Read
  - Bash
  - Glob
  - Grep
  - Write
---

# @curator — Content Refresh Triage

Read-only analytical skill. Joins GSC traffic data with the content collection and produces a prioritized triage report. Spec: `specs/content-curator/spec.md`.

## When to invoke

- Periodic content reviews (weekly / monthly).
- Drill-down on a single article: `--page /patterns/typed-handoffs`.
- After publishing several new articles, to refresh the discoverability list.

This skill **never edits articles**. It reports. The human decides what to hand to `@dev` or `@assess`.

## Workflow

1. **Check snapshot freshness.** Run `ls -lt data/gsc/*.jsonl | head -1`. If the latest snapshot date is older than 14 days (`STALE_SNAPSHOT_DAYS` in `tools/curator/rubric.ts`), warn the user and offer to run with `--live`. Do not block — stale-but-present is still useful.

2. **Run the triage.**
   - Default: `pnpm curator`
   - Single article: `pnpm curator -- --page <path>`
   - Live refresh: `pnpm curator -- --live` (re-runs `pnpm gsc:snapshot` first)

3. **Surface the report.** The runner writes `reports/curator/YYYY-MM-DD.md`. Read it back, summarize the Top 10 in one paragraph plus per-bucket counts, and link to the file. Highlight any "insufficient data" notice or staleness warning.

4. **Hand off, don't fix.** For each Top 5 item, name the appropriate next skill:
   - **Polish** → `@assess` then `@dev` for title/meta rewrite
   - **Upgrade** → `@assess` for depth-and-structure plan, then `@dev`
   - **Refresh** → `@dev` to update examples
   - **Discoverability** → `@geo-audit`

## Contract reminders

- All thresholds live in `tools/curator/rubric.ts`. Do not quote magic numbers from memory — read the file if asked.
- Bucket precedence: Polish > Upgrade > Refresh. Discoverability is a separate path (inverse join: article file exists, no snapshot rows).
- Refresh requires ≥ 120 days of snapshot history. If the snapshot covers less, Refresh reports "insufficient data" and is skipped — this is correct behaviour, not a bug.
- Reports are committed. Historical reports drive retros on both content and the rubric itself.

**Task:** $ARGUMENTS
