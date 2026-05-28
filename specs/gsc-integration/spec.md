---
title: "Google Search Console Integration"
status: "approved"
owner: "Ville Takanen"
archetype: "feature"
created: "2026-05-22"
tags: []
---

# Feature: Google Search Console Integration

## Blueprint

### Context

We need traffic and query data from Google Search Console (GSC) to drive content-refresh decisions for asdlc.io. Without this loop, we are flying blind on which articles to polish, upgrade, or refresh — and our content-quality machinery (`@assess`, the assessor learning loop) optimizes for internal rubrics rather than observed reader behavior.

This feature delivers a single surface over the data:

1. **A snapshot pipeline** — `pnpm gsc:snapshot` writes dated JSONL to `data/gsc/`, committed to the repo. Diffable, durable, free to query.

> A live `mcp-gsc` server was originally scoped as a second surface but was **dropped** — see [ADR 0001](../../docs/adrs/0001-no-live-gsc-mcp-server.md). GSC's Search Analytics API is not real-time (data lags ~2-3 days), so a live server added a second auth/maintenance surface for negligible freshness gain. "Fresher" data is obtained by re-running the snapshot.

The skill that consumes this data is `@curator` (see `specs/content-curator/spec.md`). This spec covers the data layer only.

**Consumers:** `@curator` skill (primary), human maintainers running ad-hoc queries, future retros that need historical traffic context.

### Architecture

**Snapshot pipeline:**

- **Command:** `pnpm gsc:snapshot` — invokes `scripts/gsc-snapshot.ts`
- **Output:** `data/gsc/YYYY-MM-DD.jsonl` — one JSONL per snapshot run
- **Schema:** Defined in `tools/gsc/schema.ts` (Zod), one row per `{date, page, query, clicks, impressions, ctr, position}` tuple
- **Date window:** Last 120 days at each run, daily granularity, dimensions `page` and `query`. The 120-day window exists so the `@curator` Refresh bucket can compare 60d vs prior 60d from a single snapshot.
- **Pagination:** The GSC API caps responses at 25,000 rows per request. The snapshot script paginates with `startRow` and continues until the API returns fewer rows than the page size.
- **Auth:** Application Default Credentials (ADC) via the `gcloud` CLI — the property owner authenticates with `gcloud auth application-default login` (scopes `cloud-platform` + `webmasters.readonly`), and the snapshot script obtains a token from ADC at runtime. Quota project is sent via the `x-goog-user-project` header, configured by `GSC_QUOTA_PROJECT` (falls back to `gcloud config get-value project`). A service-account key path (`GSC_SERVICE_ACCOUNT_KEY`, matching the gitignored `*.gsc-key.json`) is the intended path for unattended/CI use but is **deferred** — adding the service account in Search Console was blocked, and ADC suits the current local/manual cadence. The deferred CI cron (below) will require implementing the service-account path.
- **Cadence:** Manual for now (`pnpm gsc:snapshot` weekly). GitHub Action with cron schedule is a follow-up, not in this spec.
- **Property:** `sc-domain:asdlc.io` — configured via `GSC_SITE_URL` env var
- **Atomicity:** The script writes to `data/gsc/YYYY-MM-DD.jsonl.tmp` and renames on success. A failed run leaves no partial output.

**Helper library — `tools/gsc/index.ts` exports:**

- `getLatestSnapshot(): { path: string; date: string }` — resolves the newest `data/gsc/*.jsonl`
- `loadSnapshot(path): GscRow[]` — parses and Zod-validates a JSONL file
- `joinPageToArticle(page: string): string | null` — maps an absolute GSC URL (`https://asdlc.io/patterns/foo`) to a content-collection file path (`src/content/patterns/foo.md`). Returns `null` if no matching article exists.

**MCP server:** ~~Dropped — see [ADR 0001](../../docs/adrs/0001-no-live-gsc-mcp-server.md).~~ A `tools/mcp-gsc/` stdio server exposing live `query_*` tools was originally scoped here. It was cut because GSC's API is not real-time; "live" data is no fresher than a re-run snapshot. Interactive drill-down is served by re-running `pnpm gsc:snapshot` and reading the result.

**Relationship to existing infrastructure:**

| Surface | Purpose | Consumer |
|---|---|---|
| `data/gsc/YYYY-MM-DD.jsonl` | Historical snapshots, diffable in git | `@curator` default + drill-down, retros |
| GSC web UI | Human investigation, ground truth | Maintainers |

**Data model (Zod):**

```ts
GscRow = {
  snapshotDate: string;  // ISO date, the day the snapshot ran
  date: string;          // ISO date the metric is for
  page: string;          // absolute URL
  query: string;         // search query
  clicks: number;
  impressions: number;
  ctr: number;           // 0..1
  position: number;      // average position
}
```

**File paths:**

- Snapshot script: `scripts/gsc-snapshot.ts`
- Schema: `tools/gsc/schema.ts`
- Snapshot helpers: `tools/gsc/index.ts` (see helper list above)
- Snapshot output dir: `data/gsc/`
- `.gitignore` entries: `*.gsc-key.json` (key files), `data/gsc/*.raw.json` (raw API responses if dumped for debugging), `data/gsc/*.jsonl.tmp` (in-flight writes). `data/gsc/*.jsonl` is **committed**.
- Env example: `.env.example` documents `GSC_SITE_URL` and `GSC_QUOTA_PROJECT` (and `GSC_SERVICE_ACCOUNT_KEY` for the deferred service-account path)

**Constraints:**

- The snapshot pipeline is re-runnable. Re-running on the same day overwrites that day's file via the atomic temp-rename strategy.
- Credentials live outside the repo: ADC is stored by `gcloud` in the user's config dir; the deferred service-account key pattern (`*.gsc-key.json`) is gitignored. No credentials are ever committed.

## Contract

### Definition of Done

- [ ] `pnpm gsc:snapshot` writes a valid `data/gsc/YYYY-MM-DD.jsonl` for `sc-domain:asdlc.io`
- [ ] Each row parses cleanly through `GscRow` Zod schema (verifiable via `pnpm test:run`)
- [ ] The snapshot covers the trailing 120 days
- [ ] Pagination retrieves all available rows; tests assert behavior across at least two API pages
- [ ] Re-running on the same day overwrites that day's file atomically (temp file + rename); failures leave no partial output
- [ ] `tools/gsc/index.ts` exports `getLatestSnapshot`, `loadSnapshot`, and `joinPageToArticle` with unit tests
- [ ] `.env.example` documents `GSC_SITE_URL` and `GSC_QUOTA_PROJECT`
- [ ] `.gitignore` excludes `*.gsc-key.json`, `data/gsc/*.raw.json`, `data/gsc/*.jsonl.tmp`
- [ ] At least one historical snapshot (`data/gsc/YYYY-MM-DD.jsonl`) is committed so consumers can develop against real data
- [ ] `pnpm check` and `pnpm lint` pass

### Regression Guardrails

- The snapshot JSONL schema is append-only. Adding columns is allowed; removing or renaming requires a new versioned directory (`data/gsc/v2/`).
- The `*.gsc-key.json` pattern remains gitignored. A pre-commit check or CI assertion that fails when a matching file appears in a diff is recommended but tracked separately.

### Scenarios

```gherkin
Scenario: Weekly snapshot on a fresh machine
  Given the user has run "gcloud auth application-default login" with the webmasters.readonly scope
  And GSC_SITE_URL is "sc-domain:asdlc.io"
  When I run "pnpm gsc:snapshot"
  Then a file "data/gsc/YYYY-MM-DD.jsonl" is created for today's date
  And every line parses through the GscRow schema
  And the file contains rows spanning the last 120 days

Scenario: Pagination across multiple API pages
  Given the GSC property returns more than 25,000 rows for the window
  When I run "pnpm gsc:snapshot"
  Then the script makes multiple paginated requests
  And the resulting JSONL contains rows from every page returned

Scenario: Re-running on the same day
  Given a snapshot for today already exists
  When I run "pnpm gsc:snapshot" again
  Then the existing file is overwritten via temp file + rename
  And no partial file is left behind on failure

Scenario: Atomic failure mid-write
  Given the GSC API returns an error after 10,000 rows
  When the snapshot script encounters the error
  Then no "data/gsc/YYYY-MM-DD.jsonl" is created or modified
  And only the .jsonl.tmp may exist, which is gitignored

Scenario: Missing configuration
  Given GSC_SITE_URL is unset
  When I run "pnpm gsc:snapshot"
  Then the script exits non-zero
  And the error message names the missing variable
  And no partial output is written

Scenario: Missing credentials
  Given GSC_SITE_URL is set but no Application Default Credentials are available
  When I run "pnpm gsc:snapshot"
  Then the script exits non-zero
  And the error message tells the user to run "gcloud auth application-default login"
  And no partial output is written

Scenario: joinPageToArticle resolves a content article
  Given an article exists at "src/content/patterns/typed-handoffs.md"
  When joinPageToArticle("https://asdlc.io/patterns/typed-handoffs") is called
  Then it returns "src/content/patterns/typed-handoffs.md"

Scenario: joinPageToArticle on an unknown URL
  When joinPageToArticle("https://asdlc.io/about") is called
  And no matching content file exists
  Then it returns null
```
