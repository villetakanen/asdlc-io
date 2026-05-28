# MCP Evals

Deterministic retrieval-quality gate for the asdlc.io MCP server. See `specs/mcp-evals/spec.md` for full context.

## Run

```sh
pnpm evals:mcp
```

Exits non-zero on any failure. Reads `src/mcp/articles.json` (rebuild with `pnpm build:mcp-index` if stale).

## Fixture file

`evals/mcp/retrieval.fixtures.json` — three sections, all evaluated by `scripts/run-mcp-evals.mjs`:

- **`search`** — cases against `search_knowledge_base`. Each case asserts `mustInclude`, `topN`, `mustNotInclude`, or `minResults`.
- **`list`** — cases against `list_articles`. Asserts `minTotal` and required slugs.
- **`get`** — cases against `get_article`. Asserts `isError`, `minContentLength`, `h1Contains`.

## Authoring guidelines

- **Anchor on reader intent, not keyword matching.** `"give an agent the right information"` is a more valuable case than `"context engineering"` — the MCP exists to bridge natural-language phrasing to the right article.
- **Start with `mustInclude`. Escalate to `topN` only for foundational concepts.** Forcing strict ranking everywhere makes the suite brittle to legitimate ranking changes.
- **Use `mustNotInclude` for false-positive traps.** Catch cases where ranking changes promote unrelated articles.
- **Cases are documentation.** The `description` field is read by humans deciding "is this still a valid expectation?" when an eval breaks.
- **Update with intent, not reflex.** A failing eval after a content change has two valid resolutions: (a) revert the change, or (b) update the fixture because the new expectation is correct. Both require a written justification in the PR description.

## When an eval fails

1. Read the failure summary — it shows the actual top-N slugs.
2. Ask: did the *expected* article change, or did *ranking* shift unrelated articles up?
3. Either restore the prior content/index behavior, or update the fixture (and the case `description`) to reflect the new intentional behavior.

Never silence a case to make the build green — delete it instead, with a one-line PR note explaining why the assertion is no longer valid.
