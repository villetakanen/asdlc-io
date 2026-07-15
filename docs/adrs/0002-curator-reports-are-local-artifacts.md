# 2. Curator reports are local artifacts, not committed

Date: 2026-07-06

## Status

Accepted

## Context

`@curator` (`specs/content-curator/spec.md`) writes a dated triage report to `reports/curator/YYYY-MM-DD.md`. The original spec committed these reports, on the rationale that "historical reports drive retros — including retros on the rubric itself." Three were committed (05-28, 06-11, 06-22).

Two facts, noticed together, undermine that rationale:

1. **The reports are a pure, regenerable view.** A report is `triage(snapshot, rubric)` — `triage()` is pure and the rubric is version-controlled with pinning tests. The rendered markdown adds no information over its inputs; it is a generated file, and committing generated files churns git history (each run re-dumps ~55 lines of Discoverability boilerplate) for no recoverable value.

2. **The reports leak the exact data the repo already withholds.** `data/gsc/*.jsonl` snapshots are gitignored precisely because "search-query data is not published to this public repo." But the reports quote per-article **top-query strings** (e.g. `agents.md convention standard specification`, `chat.usenestedagentsmdfiles`). Committing them publishes a subset of the same private search data to a public repo — the snapshot gitignore and the committed reports were in direct contradiction.

This surfaced during the 2026-07-05 review, which demoted SEO to maintenance mode (a passive scoreboard, not a workstream). In that posture the retro value of frozen, committed reports is low: what matters is the numeric trend, which is better recomputed under one consistent (current) rubric than compared across renders frozen under a drifting one.

## Decision

Curator reports are **local, regenerable artifacts**. `reports/curator/*.md` is gitignored, joining `data/gsc/*.jsonl` under the same rule: **all GSC-derived artifacts stay local**. The three previously committed reports are removed from tracking (`git rm --cached`).

Retro history lives locally, alongside the snapshots that produced it. Any report is reproducible on demand with `pnpm curator`.

## Consequences

- One privacy rule for all GSC-derived data: raw snapshots and derived reports are both local. No search-query strings reach the public repo.
- Git history stops carrying regenerable report churn.
- Retros rely on locally-retained snapshots rather than committed renders. This is the same durability tradeoff already accepted for snapshots (ADR 0001) and is adequate for maintenance-mode cadence.
- Loss of provenance-of-decision: the exact render a human saw on a given date is no longer preserved in the repo. Judged acceptable — under maintenance mode we track the number trend, not frozen renders, and re-triaging under the current rubric is a cleaner comparison anyway.
- If a durable in-repo trend is ever wanted, add a numbers-only trend file (no query strings) rather than reinstating full report commits.
- `specs/content-curator/spec.md` Outputs and Constraints were updated to state reports are local and regenerable; the `.gitignore` GSC section was extended to cover `reports/curator/*.md`.
