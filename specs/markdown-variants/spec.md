---
title: "Markdown Variants for Live Content Pages"
status: "approved"
owner: "Ville Takanen"
archetype: "feature"
created: "2026-05-22"
updated: "2026-07-05"
tags: ["agent-docs", "discoverability", "content-negotiation"]
linear: "AL-28"
---

# Feature: Markdown Variants for Live Content Pages

> **Implementation status (2026-07-05):** Shipped in commit `32a15cc` (`feat(markdown-variants): add markdown endpoints and assess updates`). The `.md` endpoints, shared helper, Netlify redirects, `llms.txt` links, and unit tests are all in place and green. This spec was reconciled against the live code in reverse/update mode. **One open item remains:** post-deploy verification that Netlify's `Accept`-header content negotiation matches real agent requests (see Contract › Definition of Done). Note: Linear AL-28 was still marked *Todo* at reconciliation time — the status should be corrected to reflect the shipped implementation.

## Blueprint

### Context

AI coding agents (Claude Code, Cursor, OpenCode) and AI answer engines increasingly fetch site content directly with HTTP. Today, asdlc.io serves a single HTML representation that includes layout chrome, inline CSS, navigation, and footer. Consequences from the **Agent Docs Scorecard (Apr 11, 2026)**:

- **Markdown Availability: 0/100.** No machine-friendly variant exists for any content URL.
- **Truncation risk.** Three pages exceed 100K characters once converted by an agent's HTML→markdown step; agents silently drop the tail.
- **Boilerplate dilution.** Nine pages spend 10–50% of their first tokens on non-content chrome before the article body begins.

The MCP server and downloadable Skill already expose the *content collections* as raw markdown, but only to MCP-aware agents. Agents that fetch URLs directly (the common case for `WebFetch`-style tools and AI answer crawlers) cannot reach the clean payload.

**Consumers:** Claude Code / Cursor / OpenCode `WebFetch`-equivalent tools, Perplexity/ChatGPT/Gemini browse tools, AI answer engines, future MCP `get_article_by_url` flows.

**Out of scope:** Recipes collection (separate archetype, deferred); resources pages (no markdown source — they're `.astro` pages).

### Architecture

**Output mode:** asdlc.io builds to fully static HTML (no SSR adapter). Therefore both representations must be emitted at build time. Runtime `Accept`-header negotiation is implemented at the Netlify edge via a redirect rule, not via SSR.

**File layout (as shipped):**

| Concern | Mechanism | Canonical source |
|:---|:---|:---|
| `.md` URL routing | Static endpoints, one per collection | `src/pages/concepts/[...slug].md.ts`, `src/pages/patterns/[...slug].md.ts`, `src/pages/practices/[...slug].md.ts` |
| Shared payload logic | Frontmatter builder, size cap, published-status set — extracted so the three endpoints stay thin and behavior is tested in one place | `src/lib/markdown-variant.ts` |
| Content source | Same `getCollection()` entries used by the `[...slug].astro` HTML pages — single source of truth | (Astro content collections) |
| Status filter | Only entries with `status: "Live"` or `status: "Experimental"` are emitted as `.md`. Draft / Proposed / Deprecated are not emitted, so Netlify returns 404. | `PUBLISHED_STATUSES` in `src/lib/markdown-variant.ts` |
| Response headers | `Content-Type: text/markdown; charset=utf-8` | endpoint `GET` handlers |
| `Accept` negotiation | `netlify.toml` redirect: when the `Accept` header contains `text/markdown` and the path matches `/(concepts\|patterns\|practices)/<slug>/`, rewrite (force-200) to the corresponding `.md` URL | `netlify.toml` |
| `llms.txt` update | "Foundational Reading" links point to `.md` variants | `public/llms.txt` |

**Emitted body shape:**

```
---
title: "..."
description: "..."
status: "Live"
lastUpdated: "..."
tags: [...]
canonical: "https://asdlc.io/concepts/<slug>/"
---

<raw markdown body, h2-first per repo convention>
```

The frontmatter is a curated subset of the article schema — only fields useful for an agent reader: `title`, `description`, `status`, `lastUpdated` (emitted as an ISO `YYYY-MM-DD` string), `tags` (defaulting to `[]`), and `canonical`. It excludes implementation-only fields like `relatedIds` (which use internal collection IDs), `references`, and `supersededBy`. References are kept inline in the body as they already appear. `buildFrontmatter()` in `src/lib/markdown-variant.ts` is the authoritative serializer.

**Single source of truth:** The `.md` endpoint emits the entry's raw `body` (the unparsed markdown from the content collection) prefixed with the built frontmatter — see `buildPayload()`. It does **not** re-serialize from a parsed AST or round-trip through rendered HTML, either of which would lose formatting fidelity. An entry with an empty body throws at build time rather than emitting a headers-only payload.

### Anti-Patterns

- **Duplicating content under `public/`.** Do not copy `.md` files into `public/` to serve them as static assets. The collection remains the single source.
- **Generating from rendered HTML.** Do not turn the rendered HTML page back into markdown — round-trip loses fidelity and reintroduces the boilerplate problem.
- **SSR adapter for one feature.** Do not add `@astrojs/netlify` SSR adapter just for content negotiation. Edge-level redirect is sufficient and keeps the static-first ethos.
- **Exposing Draft / Proposed.** The `.md` surface must match MCP and Skill filtering — never leak unfinished content via this channel.

## Contract

### Definition of Done

- [x] `src/pages/concepts/[...slug].md.ts` emits a static `.md` endpoint for every Live/Experimental concept
- [x] Same for `patterns` and `practices`
- [x] Each `.md` response has `Content-Type: text/markdown; charset=utf-8`
- [x] Each `.md` response body is ≤ 50,000 characters (regression guard for the truncation scorecard finding) — enforced by `assertSizeCap()`, which throws at build time
- [x] Draft / Proposed / Deprecated articles do not appear in the emitted set (Netlify returns 404) — `getStaticPaths()` filters on `PUBLISHED_STATUSES`
- [x] `netlify.toml` rewrite for `Accept: text/markdown` on `/(concepts|patterns|practices)/<slug>/` serves the corresponding `.md` payload with HTTP 200 — **rule is in place; live matching not yet verified (see open item below)**
- [x] `public/llms.txt` "Foundational Reading" links updated to `.md` URLs
- [x] Unit tests cover status filter, frontmatter shape, and body length cap (`src/pages/__tests__/markdown-variants.test.ts`, 14 tests green)
- [x] `pnpm test:run` green for this suite

**Open item (blocks marking AL-28 fully Done):**

- [ ] Post-deploy verification that Netlify's `conditions.Accept` matching actually serves the `.md` payload for real agent requests. `netlify.toml` carries a `TODO(AL-28)` noting the ambiguity: agents commonly send `Accept: text/markdown, */*` (with quality params), and Netlify's exact-match semantics may not match those. Verify with `curl -H "Accept: text/markdown"` and `curl -H "Accept: text/markdown, */*;q=0.8"` against the deploy preview. If matching proves unreliable, document the `.md` URL as the canonical agent path (already the fallback per Anti-Patterns) and downgrade the negotiation guardrail to best-effort.

### Regression Guardrails

- The `.md` endpoint MUST share its content source with the HTML page (no copies, no parallel generation)
- The status filter MUST match MCP's filter (Live + Experimental). When MCP filtering changes, this MUST change in lockstep.
- The frontmatter schema in the `.md` output is part of the public contract — adding a field is fine, removing or renaming requires a deprecation notice
- No `.md` response body may exceed 50K chars; the build MUST fail (not warn) on violation
- Resources/recipes/fieldmanual/index pages MUST NOT acquire `.md` variants under this spec — they are explicitly out of scope

### Scenarios

**Scenario: Agent fetches `.md` URL directly**
- Given: A Claude Code agent calls `WebFetch("https://asdlc.io/concepts/context-engineering.md")`
- When: Netlify serves the static endpoint
- Then: The response is `Content-Type: text/markdown; charset=utf-8`
- And: The body starts with frontmatter, then the article's h2-first body
- And: The body contains no HTML chrome, no `<script>`, no inline CSS

**Scenario: Agent uses content negotiation on the canonical URL**
- Given: An agent calls `curl -H "Accept: text/markdown" https://asdlc.io/concepts/context-engineering/`
- When: Netlify's redirect rule matches
- Then: The response is the same markdown body served by the `.md` URL
- And: HTTP status is 200 (rewrite, not 301/302)

**Scenario: Draft article is requested as markdown**
- Given: An article with `status: "Draft"` exists at `/concepts/foo/`
- When: An agent fetches `/concepts/foo.md`
- Then: HTTP 404
- And: The article is also absent from the build's static path list

**Scenario: New Live article is published**
- Given: A new pattern is added with `status: "Live"`
- When: `pnpm build` runs
- Then: Both the HTML route and the `.md` route are emitted automatically with no per-file configuration

**Scenario: Article exceeds the size cap**
- Given: A new article's `.md` payload would be > 50,000 characters
- When: `pnpm build` runs
- Then: The build fails with an error naming the offending slug and its size
- And: The author must split the article or relax the cap explicitly in this spec

## Implementation Notes

**Structure as shipped.** The three endpoints are deliberately thin — each calls `getCollection(<name>, filter)` in `getStaticPaths()` and delegates payload construction to `assertSizeCap()` in `src/lib/markdown-variant.ts`. The `PUBLISHED` set is re-declared in each endpoint (not imported) so a future per-collection divergence stays local, matching the shared helper's `PUBLISHED_STATUSES`.

```ts
// src/pages/concepts/[...slug].md.ts (patterns/practices are identical modulo collection name)
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { assertSizeCap } from "../../lib/markdown-variant";

const PUBLISHED = new Set(["Live", "Experimental"]);

export async function getStaticPaths() {
  const entries = await getCollection("concepts", (e) => PUBLISHED.has(e.data.status));
  return entries.map((e) => ({ params: { slug: e.id }, props: { entry: e } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props as { entry: Awaited<ReturnType<typeof getCollection<"concepts">>>[number] };
  const body = assertSizeCap(entry, "concepts");
  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
};
```

**Shared helper (`src/lib/markdown-variant.ts`).** Exposes `MAX_CHARS` (50,000), `PUBLISHED_STATUSES`, `buildFrontmatter()`, `buildPayload()`, and `assertSizeCap()`. `buildPayload()` throws on an empty body; `assertSizeCap()` throws when `frontmatter + body` exceeds `MAX_CHARS`. The cap counts the combined payload, not the body alone.

**Note on the size cap.** The guard is character-based (`.length`), so "50K chars" — not bytes. For the current ASCII-dominant corpus the distinction is immaterial; a future multibyte-heavy article could pass the char cap while exceeding 50KB on the wire. Revisit only if that becomes real.

**Netlify rewrite (sketch):**

```toml
[[redirects]]
  from = "/concepts/:slug/"
  to = "/concepts/:slug.md"
  status = 200
  conditions = {Accept = "text/markdown"}
```

Verify Netlify's `conditions.Accept` matching semantics during implementation — fall back to documenting the `.md` URL as the canonical agent path if header-conditioning proves unreliable.

**Updating `llms.txt`:** Switch four of the five "Foundational Reading" bullets to `.md` URLs (Agentic SDLC, Spec-Driven Development, The Spec, Context Engineering). Field Manual stays as HTML — it is an `.astro` aggregator page (`fieldmanual.astro`), not a content-collection entry, so it has no `.md` source and cannot emit a `.md` variant under this spec. Leave the index-page links (`/concepts/`, `/patterns/`, `/practices/`) as HTML since those are navigation, not content.

## Resources

- AL-28 (Linear) — Source PBI (status should be corrected from *Todo* → *Done* once the open verification item closes)
- Commit `32a15cc` — `feat(markdown-variants): add markdown endpoints and assess updates` (implementation provenance)
- `src/lib/markdown-variant.ts` — Shared payload logic (canonical implementation)
- `src/pages/__tests__/markdown-variants.test.ts` — Contract tests (status filter, frontmatter shape, size cap)
- `specs/llms-txt/spec.md` — Sibling discoverability surface (links updated to `.md`)
- `specs/content-articles/spec.md` — Shared article contract
- `specs/mcp-evals/spec.md` — Adjacent agent-facing quality gate (AL-78)
- `netlify.toml` — Edge redirect surface (carries the `TODO(AL-28)` verification note)
- [Netlify Accept-based redirects](https://docs.netlify.com/routing/redirects/redirect-options/) — Verify behavior for the open content-negotiation item
