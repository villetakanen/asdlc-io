---
title: "Google Search Console Integration"
status: "shipped"
owner: "Ville Takanen"
archetype: "feature"
created: "2026-05-22"
tags: []
shipped: "2026-05-22"
---

# Feature: Google Search Console Integration

## Blueprint

### Context

We need traffic and query data from Google Search Console (GSC) to drive content-refresh decisions for asdlc.io. Without this loop, we are flying blind on which articles to polish, upgrade, or refresh — and our content-quality machinery (`@assess`, the assessor learning loop) optimizes for internal rubrics rather than observed reader behavior.

This feature delivers two complementary surfaces over the same data:

1. **A snapshot pipeline** — `pnpm gsc:snapshot` writes dated JSONL to `data/gsc/`, committed to the repo. Diffable, durable, free to query.
2. **A thin MCP server** — `mcp-gsc` exposes live GSC queries for interactive drill-down when a snapshot isn't fresh enough.

The skill that consumes this data is `@curator` (see `specs/content-curator/spec.md`). This spec covers the data layer only.

**Consumers:** `@curator` skill (primary), human maintainers running ad-hoc queries, future retros that need historical traffic context.

### Architecture

**Snapshot pipeline:**

- **Command:** `pnpm gsc:snapshot` — invokes `scripts/gsc-snapshot.ts`
- **Output:** `data/gsc/YYYY-MM-DD.jsonl` — one JSONL per snapshot run
- **Schema:** Defined in `src/lib/gsc/schema.ts` (Zod), one row per `{date, page, query, clicks, impressions, ctr, position}` tuple
- **Date window:** Last 120 days at each run, daily granularity, dimensions `page` and `query`. The 120-day window exists so the `@curator` Refresh bucket can compare 60d vs prior 60d from a single snapshot.
- **Pagination:** The GSC API caps responses at 25,000 rows per request. The snapshot script paginates with `startRow` and continues until the API returns fewer rows than the page size.
- **Auth:** Service-account JSON key, path in `GSC_SERVICE_ACCOUNT_KEY` env var. The key file matches `*.gsc-key.json` and is gitignored.
- **Cadence:** Manual for now (`pnpm gsc:snapshot` weekly). GitHub Action with cron schedule is a follow-up, not in this spec.
- **Property:** `sc-domain:asdlc.io` — configured via `GSC_SITE_URL` env var
- **Atomicity:** The script writes to `data/gsc/YYYY-MM-DD.jsonl.tmp` and renames on success. A failed run leaves no partial output.

**Helper library — `src/lib/gsc/index.ts` exports:**

- `getLatestSnapshot(): { path: string; date: string }` — resolves the newest `data/gsc/*.jsonl`
- `loadSnapshot(path): GscRow[]` — parses and Zod-validates a JSONL file
- `joinPageToArticle(page: string): string | null` — maps an absolute GSC URL (`https://asdlc.io/patterns/foo`) to a content-collection file path (`src/content/patterns/foo.md`). Returns `null` if no matching article exists.

**MCP server:**

- **Package:** `tools/mcp-gsc/` — TypeScript, separate from the existing `@asdlc` MCP (which serves the knowledge base, not external data)
- **Transport:** stdio for local use. HTTP deployment is out of scope for this spec; if added later, an `auth.md` sibling spec must define the auth model first.
- **Tools exposed:**
  - `query_top_pages(days, limit)` — pages by clicks for the window
  - `query_page_history(page, days)` — daily clicks/impressions/position for one page
  - `query_underperforming(min_impressions, max_ctr, max_position)` — filter for polish candidates
  - `query_queries_for_page(page, days)` — what users searched to land on this page
- **Read-only.** No write tools. Auth via same service account as the snapshot script.

**Relationship to existing infrastructure:**

| Surface | Purpose | Consumer |
|---|---|---|
| `data/gsc/YYYY-MM-DD.jsonl` | Historical snapshots, diffable in git | `@curator` default path, retros |
| `mcp-gsc` server | Live drill-down queries | `@curator` interactive mode, ad-hoc |
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
- Schema: `src/lib/gsc/schema.ts`
- Snapshot helpers: `src/lib/gsc/index.ts` (see helper list above)
- MCP server: `tools/mcp-gsc/src/server.ts`
- MCP tool definitions: `tools/mcp-gsc/src/tools/*.ts`
- Snapshot output dir: `data/gsc/`
- `.gitignore` entries: `*.gsc-key.json` (key files), `data/gsc/*.raw.json` (raw API responses if dumped for debugging), `data/gsc/*.jsonl.tmp` (in-flight writes). `data/gsc/*.jsonl` is **committed**.
- Env example: `.env.example` documents `GSC_SERVICE_ACCOUNT_KEY` and `GSC_SITE_URL`

**Constraints:**

- The snapshot pipeline is re-runnable. Re-running on the same day overwrites that day's file via the atomic temp-rename strategy.
- Service-account credentials live outside the repo (env var pointing to a path); the key file pattern is gitignored.
- MCP server is stdio-only in v1. HTTP deployment requires a separate auth spec.

## Contract

### Definition of Done

- [ ] `pnpm gsc:snapshot` writes a valid `data/gsc/YYYY-MM-DD.jsonl` for `sc-domain:asdlc.io`
- [ ] Each row parses cleanly through `GscRow` Zod schema (verifiable via `pnpm test:run`)
- [ ] The snapshot covers the trailing 120 days
- [ ] Pagination retrieves all available rows; tests assert behavior across at least two API pages
- [ ] Re-running on the same day overwrites that day's file atomically (temp file + rename); failures leave no partial output
- [ ] `mcp-gsc` server starts via stdio and exposes the four `query_*` tools listed above
- [ ] All four MCP tools return Zod-validated responses (verifiable via `pnpm test:run` against a mocked GSC client)
- [ ] `src/lib/gsc/index.ts` exports `getLatestSnapshot`, `loadSnapshot`, and `joinPageToArticle` with unit tests
- [ ] `.env.example` documents `GSC_SERVICE_ACCOUNT_KEY` and `GSC_SITE_URL`
- [ ] `.gitignore` excludes `*.gsc-key.json`, `data/gsc/*.raw.json`, `data/gsc/*.jsonl.tmp`
- [ ] At least one historical snapshot (`data/gsc/YYYY-MM-DD.jsonl`) is committed so consumers can develop against real data
- [ ] `pnpm check` and `pnpm lint` pass

### Regression Guardrails

- The snapshot JSONL schema is append-only. Adding columns is allowed; removing or renaming requires a new versioned directory (`data/gsc/v2/`).
- The MCP server exposes read-only tools against GSC. Any future write tool requires a new spec.
- The `*.gsc-key.json` pattern remains gitignored. A pre-commit check or CI assertion that fails when a matching file appears in a diff is recommended but tracked separately.

### Scenarios

```gherkin
Scenario: Weekly snapshot on a fresh machine
  Given GSC_SERVICE_ACCOUNT_KEY points to a valid service-account JSON
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

Scenario: MCP drill-down on a single page
  Given an mcp-gsc server is running
  When the client calls query_page_history with page "https://asdlc.io/concepts/agentic-sdlc" and days=30
  Then the response is a Zod-validated list of daily metrics for that page

Scenario: Underperforming-query filter
  When the client calls query_underperforming with min_impressions=500, max_ctr=0.02, max_position=10
  Then the response contains only pages meeting all three thresholds
  And results are sorted by impressions descending

Scenario: Missing credentials
  Given GSC_SERVICE_ACCOUNT_KEY is unset
  When I run "pnpm gsc:snapshot"
  Then the script exits non-zero
  And the error message names the missing env var
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
