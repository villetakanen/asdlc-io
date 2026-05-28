# 1. No live mcp-gsc server; refresh via snapshot

Date: 2026-05-27

## Status

Accepted

## Context

The GSC integration (`specs/gsc-integration/spec.md`) was scoped with two surfaces over the same data: a committed snapshot pipeline (`pnpm gsc:snapshot` → `data/gsc/*.jsonl`) and a separate stdio MCP server (`tools/mcp-gsc/`, tracked as AL-42) exposing live `query_*` tools for interactive drill-down "when a snapshot isn't fresh enough."

The premise behind the live server is that it returns fresher data than a committed snapshot. That premise is false. Google Search Console's Search Analytics API is not real-time: finalized data lags ~2-3 days, and the "fresh" (`dataState=all`) rows are ~1 day old, partial, and still settling. There is no real-time path.

So the real axis is not live-vs-stale but snapshot-cadence staleness vs. query-time freshness, and the gap is bounded below by GSC's own 2-3 day floor. With snapshots committed to the repo on a modest cadence, a live call shaves at most a few days off — while requiring a second MCP server, its own auth/credential surface, and ongoing maintenance.

## Decision

We will not build the `mcp-gsc` live server. AL-42 is canceled.

The snapshot pipeline is the single source of GSC data. When fresher data is wanted (e.g. `@curator <page> --live`), we re-run `pnpm gsc:snapshot` and read the new snapshot rather than maintaining a separate live query path. If freshness ever becomes a real constraint, we raise the snapshot cadence instead of adding a server.

## Consequences

- One data path instead of two: less code, one auth surface, no second server to maintain.
- `--live` collapses to "produce a fresh snapshot, then read it" — the live and default paths share the same loader and schema.
- Every `--live` invocation incurs a full snapshot run (120-day window, paginated). Acceptable at the current ad-hoc cadence; if it becomes a bottleneck, a narrower single-page fetch can be added without resurrecting a standalone server.
- Consumers can never get sub-2-day-old GSC data. This is a property of the GSC API, not our architecture, so no design choice could have changed it.
- `specs/gsc-integration/spec.md` and `specs/content-curator/spec.md` were updated to remove the live-server surface and point `--live` at a snapshot refresh.
