# Feature: @curator — Content Refresh Triage

## Blueprint

### Context

asdlc.io produces concepts, patterns, and practices articles continuously, but has no systematic process for deciding which existing articles deserve attention. Manual review across a growing corpus does not scale, and `@assess` optimizes against internal rubrics — it cannot see what readers actually do.

`@curator` closes that loop. It joins GSC traffic data (from `specs/gsc-integration/spec.md`) with the content collection and produces a prioritized triage report: which articles to **polish** (snippet/title), **upgrade** (depth/structure), **refresh** (stale content), or hand to **discoverability** (article exists but absent from search data — a `geo-audit` concern, not a content concern).

This is a read-only analytical skill. It produces a report; the human decides which actions to take and which articles to hand to `@dev` or `@assess`.

**Out of scope for v1:** A *Realign* bucket (top query semantically distant from article intent) was considered and cut. It requires either an embeddings story or stricter query-to-content similarity measurement that this spec does not commit to. Revisit once six months of curator reports establish that intent-drift is a real, recurring problem.

**Consumers:** Content owners running periodic content reviews; `@assess` (which may take a curator report as input for prioritization).

### Architecture

**Skill file:** `.claude/skills/curator.md`

**Inputs:**

- Latest snapshot from `data/gsc/` (resolved via `getLatestSnapshot()` in `src/lib/gsc/index.ts`)
- Content collections in `src/content/{concepts,patterns,practices}/`
- Optional: a specific article path or URL to triage in isolation
- Optional: live drill-down via the `mcp-gsc` server when the snapshot is stale

**Outputs:**

- A markdown report written to `reports/curator/YYYY-MM-DD.md`
- Report is committed; historical reports drive retros — including retros on the rubric itself.

**Triage rubric (the core logic):**

All thresholds live in `src/lib/curator/rubric.ts`. The values below describe the v1 defaults; the source file is the contract.

| Signal (28-day window unless noted) | Bucket | Suggested action | Weight |
|---|---|---|---|
| Impressions ≥ 500, CTR < 2%, position ≤ 10 | **Polish** | Rewrite title / meta description; no content change | 4 |
| Position 11–20, impressions ≥ 200 | **Upgrade** | Add depth, internal links, structured data | 3 |
| Clicks declining ≥30% (last 60d vs prior 60d), article publish date > 6 months ago | **Refresh** | Update examples, re-anchor to current practices | 2 |
| Article file exists in `src/content/**/*.md`, no rows in the snapshot for that page | **Discoverability** | Hand to `geo-audit`; not a content fix | 1 |

**Exclusion rule (Polish / Upgrade / Refresh only):** Articles with fewer than `MIN_IMPRESSIONS_FOR_SIGNAL = 50` impressions in the 28-day window are not eligible for Polish, Upgrade, or Refresh — their signal is too noisy. The Discoverability bucket is the catch-all for articles below this threshold *that have an article file*: by definition, a page absent from the snapshot has zero impressions, and the bucket exists to route it.

**Confidence:** Each triaged article gets `high` (≥ 1000 impressions), `medium` (200–999), or `low` (50–199) for Polish/Upgrade/Refresh. Discoverability is always `n/a` — the bucket is structural, not signal-driven.

**Refresh requires history.** The 60-vs-60 comparison needs at least 120 days of data. Since `gsc-integration` fetches a 120-day window per snapshot, a single fresh snapshot suffices. If the snapshot covers fewer than 120 days (early days of the property), Refresh is reported as "insufficient data" and skipped for all articles.

**Sort order for the Top 10:** `weight × confidenceMultiplier × impressions`, where `confidenceMultiplier` is `{high: 1.0, medium: 0.7, low: 0.4, n/a: 0.5}`. All factors live in `rubric.ts`.

**Snapshot staleness:** If the latest snapshot is older than `STALE_SNAPSHOT_DAYS = 14` (defined in `rubric.ts`), the report header warns prominently and offers to run `pnpm gsc:snapshot`. Triage still runs against the stale data — the warning does not block.

**Pipeline:**

1. Load latest GSC snapshot via `loadSnapshot(getLatestSnapshot().path)`
2. Aggregate per-page metrics for two windows: last 28 days, last 60 days, prior 60 days (61–120 days ago)
3. Join snapshot pages to content files via `joinPageToArticle()` from `src/lib/gsc/index.ts`. Compute the inverse join (articles with no snapshot rows) for the Discoverability bucket.
4. Classify each article into one bucket (or "healthy — no action") using the rubric. Apply exclusion rules. Bucket precedence when multiple signals match: Polish > Upgrade > Refresh.
5. Sort by priority. Write report to `reports/curator/YYYY-MM-DD.md`.

**Report template:**

```markdown
# Curator Report — YYYY-MM-DD

Snapshot: data/gsc/YYYY-MM-DD.jsonl (N days old)
Articles in corpus: M | Articles with snapshot rows: K | Triaged: T | Healthy: H

[If snapshot covers < 120 days: "Refresh bucket: insufficient data, skipped."]
[If snapshot age > STALE_SNAPSHOT_DAYS: "⚠ Snapshot is N days old. Run pnpm gsc:snapshot."]

## Top 10 priorities

| # | Article | Bucket | Signal | Confidence |
|---|---|---|---|---|
| 1 | /patterns/X | Polish | 12k imp, 1.2% CTR, pos 4.1 | high |
| ... | ... | ... | ... | ... |

## By bucket

### Polish (N articles)
- [/patterns/X](src/content/patterns/x.md) — 12k impressions, 1.2% CTR at position 4.1. Title rewrite candidate.

### Upgrade (N articles)
- ...

### Refresh (N articles)  [or: "Refresh — insufficient data (< 120d snapshot history)"]
- ...

### Discoverability (N articles)
- Articles below — file exists, but no snapshot rows in window. Hand to `geo-audit`.
- ...

## Healthy — no action (H articles)
Briefly listed.
```

**Where "Triaged" / "Healthy" come from:** `Triaged = Polish + Upgrade + Refresh + Discoverability`. `Healthy = articles with ≥ MIN_IMPRESSIONS_FOR_SIGNAL impressions that match no bucket`. The sum `Triaged + Healthy + excluded-low-traffic` equals total articles. Low-traffic articles without a matching file are not counted (they aren't ours).

**File paths:**

- Skill: `.claude/skills/curator.md`
- Report output: `reports/curator/YYYY-MM-DD.md`
- Aggregation logic (testable, pure): `src/lib/curator/triage.ts`
- Rubric thresholds and weights (single source of truth): `src/lib/curator/rubric.ts`

**Constraints:**

- Curator is read-only against source content. It never edits articles directly — it reports.
- All numeric thresholds and weights live in `src/lib/curator/rubric.ts`. No magic numbers in the skill prompt, `triage.ts`, or the report template.
- Reports are committed. Historical reports drive retros on both content and the rubric itself.
- Single-article mode uses the latest snapshot by default. The user may pass `--live` to invoke `mcp-gsc` for fresh data on that one URL; the report header records which path was used.

## Contract

### Definition of Done

- [ ] `.claude/skills/curator.md` exists and is invokable as `@curator`
- [ ] `src/lib/curator/triage.ts` exports a pure function `triage(rows: GscRow[], articles: Article[], rubric: Rubric): TriageResult` with unit tests in `src/lib/curator/triage.test.ts`
- [ ] `src/lib/curator/rubric.ts` exports all thresholds and weights named in this spec: `MIN_IMPRESSIONS_FOR_SIGNAL`, `STALE_SNAPSHOT_DAYS`, bucket-specific thresholds, bucket weights, and `confidenceMultiplier`
- [ ] Pinning tests in `rubric.test.ts` assert the v1 default values, forcing intentional updates via PR
- [ ] Running `@curator` on the latest snapshot produces `reports/curator/YYYY-MM-DD.md` matching the template
- [ ] The report names the snapshot file and its age in days
- [ ] Each triaged article links to its source markdown file path
- [ ] `pnpm test:run` covers each shipping bucket (Polish, Upgrade, Refresh, Discoverability) with at least one positive and one negative case
- [ ] Insufficient-data path (< 120d snapshot): Refresh bucket reports "insufficient data" and excludes all articles
- [ ] Bucket precedence (Polish > Upgrade > Refresh) is covered by a dedicated test
- [ ] Articles with < 50 impressions are excluded from Polish/Upgrade/Refresh but eligible for Discoverability via the inverse-join path

### Regression Guardrails

- The triage function is pure: same inputs → same outputs. No network calls inside `triage()`. All randomness/time injected via parameters.
- Rubric thresholds and weights change only via PR review — never inline in the skill prompt or `triage.ts`.
- A bucket's definition is stated positively (the signal that puts an article *into* the bucket), never as "not the other buckets."
- Bucket precedence is deterministic and tested; never "whichever match comes first."

### Scenarios

```gherkin
Scenario: Weekly triage on a fresh snapshot
  Given a snapshot at data/gsc/2026-05-20.jsonl exists and is today's date
  When I invoke @curator with no arguments
  Then reports/curator/2026-05-20.md is written
  And the report header shows "snapshot age: 0 days"
  And the report contains a Top 10 table and per-bucket sections

Scenario: Stale snapshot warning
  Given the latest snapshot is older than STALE_SNAPSHOT_DAYS
  When I invoke @curator
  Then the report header warns about snapshot age and suggests running pnpm gsc:snapshot
  And the triage still runs against the stale data

Scenario: Refresh bucket with insufficient history
  Given the latest snapshot covers only 45 days
  When @curator runs
  Then the Refresh section reads "insufficient data (< 120d snapshot history)"
  And no articles are placed in the Refresh bucket
  And Polish, Upgrade, and Discoverability buckets are unaffected

Scenario: Refresh bucket with sufficient history
  Given a snapshot covers 120 days
  And article src/content/patterns/old.md had 1000 clicks in days 61–120 ago and 500 clicks in days 0–60
  And the article was published more than 6 months ago
  When @curator runs
  Then src/content/patterns/old.md appears in the Refresh bucket
  And the signal cell quotes the 50% decline

Scenario: Polish takes precedence over Upgrade
  Given an article matches both Polish (high impressions, low CTR, position 8) and Upgrade signals
  When @curator runs
  Then the article appears in Polish only
  And the bucket-precedence test pins this behavior

Scenario: Discoverability via inverse join
  Given an article exists at src/content/patterns/new-thing.md
  And no snapshot rows reference its URL
  When @curator runs
  Then the article appears in Discoverability with confidence n/a
  And the suggested action references geo-audit

Scenario: Low-traffic article is excluded from signal buckets
  Given an article has 30 impressions in 28d and 1% CTR
  When @curator runs
  Then the article does not appear in Polish, Upgrade, or Refresh
  And it appears in neither Healthy nor Discoverability (it has snapshot rows, but below threshold)
  And the report's count line accounts for it under "excluded-low-traffic"

Scenario: Single-article drill-down from snapshot
  When I invoke @curator with page "/patterns/typed-handoffs"
  Then the output focuses on that article only
  And uses the latest snapshot as the data source
  And includes the article's bucket, signals, top queries, and a suggested action paragraph

Scenario: Single-article drill-down with --live
  When I invoke @curator with page "/patterns/typed-handoffs" and --live
  Then mcp-gsc is queried for fresh metrics on that page
  And the report header notes "data source: mcp-gsc (live)"

Scenario: Rubric is version-controlled
  Given I change a threshold in src/lib/curator/rubric.ts
  When I run pnpm test:run
  Then pinning tests in rubric.test.ts fail until updated
  Ensuring threshold changes are deliberate
```
