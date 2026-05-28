---
title: "MCP Evals — Deterministic Retrieval Quality Gate"
status: "draft"
owner: "Ville Takanen"
archetype: "feature"
created: "2026-05-22"
tags: []
---

# Feature: MCP Evals — Deterministic Retrieval Quality Gate

## Blueprint

### Context

The MCP server (`netlify/edge-functions/mcp.ts`, exposing `list_articles`, `get_article`, `search_knowledge_base`) is the *primary product surface* of `asdlc.io` for agentic consumers. Every article we ship changes the search index. Today nothing tells us whether that change degraded retrieval:

- `pnpm test:mcp-preview` is a **transport smoke test** — does the endpoint speak JSON-RPC? — not a retrieval quality test.
- `tests/components/*.test.ts` cover UI atoms; `tests/e2e/` cover rendered pages. Neither touches the MCP surface.
- `src/mcp/articles.json` is regenerated on every build; a content change can silently move "context engineering" off the first page of results for the query "how do I give an agent the right context" and we will not notice until a reader complains.

The vision (`docs/vision.md` §4.III) names "Probabilistic Unit Tests" as the QC mechanism for the agentic factory. An MCP eval suite is the concrete artifact for that claim — and the place where this project can ship a reusable reference pattern for content-driven products generally.

This spec defines a **deterministic, fixture-driven eval harness** that exercises the same `ContentService` the MCP server uses, with frozen expected outcomes per query. It is unit-test-fast (sub-second), runs in CI, and fails on regression.

**Consumers:** humans validating content changes before merge; CI; `@assess` and `@curator` when they want a "did my change break search?" signal; outside readers of the repo who want to understand what "probabilistic unit test" looks like in practice.

**Out of scope for v1:**

- LLM-judged evaluations (an LLM grading retrieval relevance). High-value, but introduces nondeterminism, cost, and an API-key dependency. Layer on later as `evals/llm-judge/`.
- End-to-end HTTP/JSON-RPC evals against a live deploy. The transport is already covered by `test:mcp-preview`; we test *retrieval quality* here, against the in-process service.
- Tracking eval results over time / dashboards. A fail-the-build gate is enough for v1.
- Auto-tuning the Fuse.js `threshold`/`weights`. Evals report; humans tune.

### Architecture

**Eval fixture:** `evals/mcp/retrieval.fixtures.json`

A JSON file of cases — one per query. Each case asserts what the search must return. Frozen by hand from real expected behavior; updated only with intent.

```ts
interface RetrievalCase {
  id: string;                      // stable identifier, e.g. "ctx-eng-by-name"
  query: string;                   // what gets passed to search_knowledge_base
  description: string;             // why this case exists; what reader intent it models
  expect: {
    mustInclude: string[];         // slugs that MUST appear in results (any order, any rank)
    topN?: {                       // optional: stronger assertion — slug must be in top N
      n: number;
      slugs: string[];
    };
    mustNotInclude?: string[];     // slugs that must NOT appear (catch false positives)
    minResults?: number;           // search must return at least this many results
  };
}
```

The fixture also covers `list_articles` (does every Live/Experimental article appear?) and `get_article` (do known slugs resolve?). Those are separate fixture sections — `evals/mcp/listing.fixtures.json` and the get-article cases are derived programmatically from the search cases (every slug appearing in `mustInclude` must be retrievable by `get_article`).

**Harness:** `scripts/run-mcp-evals.mjs`

A standalone Node script (not a vitest test) so it can be invoked in isolation and produces a clean tabular report. It:

1. Imports `ContentService` and `handleToolCall` from `src/mcp/` directly — no HTTP, no edge runtime.
2. Loads `src/mcp/articles.json` (the same file the deployed server uses).
3. For each retrieval case: calls `search_knowledge_base`, parses the returned text into a slug list (the MCP returns formatted markdown; harness parses the `[collection/slug]` prefix), evaluates `expect.*` assertions.
4. For each listing case: calls `list_articles`, checks all expected slugs are present.
5. Prints a per-case PASS/FAIL line and a final summary. Exits `1` on any failure.

Output format (designed to be readable in a pre-push hook or GitHub Actions log):

```
ASDLC MCP Evals — 14 cases
─────────────────────────────────────────────
PASS  ctx-eng-by-name           "context engineering"
PASS  ctx-eng-by-intent         "how do I give an agent…"
FAIL  schema-first-strict       "schemas first" — expected top-3: [schema-first-development], got top-3: [type-safety, agent-directives, conventional-commits]
PASS  list-all-live             list_articles returns 47 articles, includes all 47 expected
─────────────────────────────────────────────
13 passed, 1 failed
```

**Fixture authoring guidelines (encoded in `evals/mcp/README.md`):**

- **Anchor on reader intent, not keyword matching.** A case named `ctx-eng-by-intent` with query `"how do I give an agent the right context"` is more valuable than one that just searches `"context engineering"`. The MCP exists to help agents find the right article from natural-language phrasing, not to test Fuse.js.
- **Start with `mustInclude`, escalate to `topN` only when the case is foundational.** Forcing `topN` everywhere makes the suite brittle to legitimate ranking changes.
- **Use `mustNotInclude` for false-positive traps.** E.g., a query for "code review" must include the `code-review` recipe but must *not* surface unrelated articles that happen to mention "review" in passing.
- **Cases are documentation.** The `description` field is read by humans deciding "is this still a valid expectation?" when an eval breaks.

**Initial fixture set (v1, ~10–15 cases):**

| id | query | what it asserts |
|---|---|---|
| `ctx-eng-by-name` | "context engineering" | `context-engineering` in top-3 |
| `ctx-eng-by-intent` | "give an agent the right information" | `context-engineering` in mustInclude |
| `schema-first-by-name` | "schema-first" | `schema-first-development` in top-3 |
| `schema-first-by-intent` | "make agents deterministic with types" | `schema-first-development` in mustInclude |
| `agent-directives` | "AGENTS.md" | `agent-directives` in top-3 |
| `determinism` | "determinism over vibes" | `determinism-over-vibes` in top-3 |
| `tdd-with-agents` | "test driven development AI" | TDD-adjacent practice in mustInclude |
| `commits` | "conventional commits" | `conventional-commits` in top-3 |
| `code-review` | "code review" | `code-review` recipe in mustInclude, no unrelated false positives |
| `mcp-howto` | "how to expose knowledge base to LLM" | MCP-related article in mustInclude |
| `not-found-graceful` | "purple monkey dishwasher" | minResults: 0 (fuzz noise must not yield results) |
| `list-all-live` | (list_articles) | all Live articles present |
| `get-by-known-slug` | (get_article: `context-engineering`) | resolves to full content |

This list is the v1 floor. The fixture grows as content grows.

**Wiring:**

- `package.json`: `"evals:mcp": "node scripts/run-mcp-evals.mjs"`.
- `lefthook.yml` `pre-push`: new `mcp-evals` command (cheap, ~100ms). Pre-push is the right gate — evals depend on `articles.json` being current, and `pre-push` already runs the full build, so freshness is guaranteed.
- `AGENTS.md` "Toolchain" table gains a `MCP evals` row.

### Definition of Done

- `evals/mcp/retrieval.fixtures.json` exists with at least the 13 cases listed above.
- `evals/mcp/README.md` exists, documenting fixture-authoring guidelines.
- `scripts/run-mcp-evals.mjs` exists, runs on `pnpm evals:mcp`, takes <1s on the current corpus.
- All cases pass on `main` at ship time. (If any case fails on the current index, either the index or the fixture is wrong — resolve before merging this spec's implementation.)
- `lefthook.yml` has an `mcp-evals` entry under `pre-push`.
- `AGENTS.md` lists the new command.
- The harness imports from `src/mcp/` directly — no HTTP layer, no edge runtime, no Netlify CLI.

### Constraints

- Pure Node, no Deno. The harness imports `.ts` files via Node's TS support already in use elsewhere in `scripts/`.
- No new runtime deps. (`gray-matter`, `fuse.js` are already present; the harness can use both.)
- Sub-second runtime. If the suite slows down, prefer narrowing fixtures over moving to a less-rigorous tier.
- Eval failures must be **human-debuggable in one read** of the output — show expected vs. actual slugs, not a stack trace.

### Open Questions

- **Where do `recipes` cases live?** Recipes have distinct retrieval expectations (often searched by tool, not concept). Lean toward a separate section in the same fixture file rather than a separate file — easier to grep, and the harness treats all cases uniformly.
- **Should evals run on every PR via GH Actions?** Yes, once `.github/workflows/ci.yml` is in place (separate spec). For now `pre-push` is the binding gate.
- **Threshold for "regression severity"?** v1 treats any failure as a build break. If false positives from legitimate content additions get noisy, add a `severity: warn|fail` field per case. Don't preempt.

### Future work

- LLM-judged evals (`evals/mcp/llm-judge/`) — pass top-5 results to a Claude API call and ask "does this answer the query?" Gated behind a CLI flag (`--with-llm`) and an API-key env var so it stays out of CI by default.
- Eval-history tracking — append per-run results to `evals/mcp/.history.jsonl` so we can see whether tuning Fuse weights helped over time. Out of scope until the suite has real usage.
- Wire into `@assess` / `@curator` skills — when assessing or refreshing an article, run the relevant evals and surface impact.
- Export the harness as a reusable pattern under `src/content/patterns/probabilistic-unit-tests.md` — the spec itself becomes a reference implementation cited by the article.
