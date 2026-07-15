---
title: "Markdown Variants for Live Content Pages"
status: "approved"
owner: "Ville Takanen"
archetype: "feature"
created: "2026-05-22"
updated: "2026-07-15"
tags: ["agent-docs", "discoverability", "content-negotiation"]
linear: "AL-28"
---

# Feature: Markdown Variants for Live Content Pages

> **Implementation status (2026-07-05):** Shipped in commit `32a15cc` (`feat(markdown-variants): add markdown endpoints and assess updates`). The `.md` endpoints, shared helper, `llms.txt` links, and unit tests are all in place and green.
>
> **Verification result (2026-07-15):** The open item from the 2026-07-05 reconciliation was verified against the live site and **failed**. Netlify redirect `conditions` cannot match the `Accept` header (only Country/Language/Role/Cookie), so the negotiation rules in `netlify.toml` never fire — even for an exact `Accept: text/markdown` request. Requirement 2 (content negotiation) is therefore re-specified below as a **Netlify Edge Function** (precedent: `netlify/edge-functions/mcp.ts`). Evidence and research: Linear AL-28 comment thread (2026-07-15). The `.md` URL surface (requirement 1) is verified working in production.

## Blueprint

### Context

AI coding agents (Claude Code, Cursor, OpenCode) and AI answer engines increasingly fetch site content directly with HTTP. Today, asdlc.io serves a single HTML representation that includes layout chrome, inline CSS, navigation, and footer. Consequences from the **Agent Docs Scorecard (Apr 11, 2026)**:

- **Markdown Availability: 0/100.** No machine-friendly variant exists for any content URL.
- **Truncation risk.** Three pages exceed 100K characters once converted by an agent's HTML→markdown step; agents silently drop the tail.
- **Boilerplate dilution.** Nine pages spend 10–50% of their first tokens on non-content chrome before the article body begins.

The MCP server and downloadable Skill already expose the *content collections* as raw markdown, but only to MCP-aware agents. Agents that fetch URLs directly (the common case for `WebFetch`-style tools and AI answer crawlers) cannot reach the clean payload.

**Consumers:** Claude Code / Cursor / OpenCode `WebFetch`-equivalent tools, Perplexity/ChatGPT/Gemini browse tools, AI answer engines, future MCP `get_article_by_url` flows.

**Out of scope:** Recipes collection (separate archetype, deferred); resources pages (no markdown source — they're `.astro` pages); homepage and `/getting-started` negotiation (agents reach those surfaces via `public/llms.txt` and the discovery Link headers of AL-93 — revisit only if scanner or agent telemetry shows demand).

### Architecture

**Output mode:** asdlc.io builds to fully static HTML (no SSR adapter). Therefore both representations must be emitted at build time. Runtime `Accept`-header negotiation is implemented at the Netlify edge via an edge function, not via SSR.

**File layout (as shipped):**

| Concern | Mechanism | Canonical source |
|:---|:---|:---|
| `.md` URL routing | Static endpoints, one per collection | `src/pages/concepts/[...slug].md.ts`, `src/pages/patterns/[...slug].md.ts`, `src/pages/practices/[...slug].md.ts` |
| Shared payload logic | Frontmatter builder, size cap, published-status set — extracted so the three endpoints stay thin and behavior is tested in one place | `src/lib/markdown-variant.ts` |
| Content source | Same `getCollection()` entries used by the `[...slug].astro` HTML pages — single source of truth | (Astro content collections) |
| Status filter | Only entries with `status: "Live"` or `status: "Experimental"` are emitted as `.md`. Draft / Proposed / Deprecated are not emitted, so Netlify returns 404. | `PUBLISHED_STATUSES` in `src/lib/markdown-variant.ts` |
| Response headers | `Content-Type: text/markdown; charset=utf-8` | endpoint `GET` handlers |
| `Accept` negotiation | Netlify Edge Function registered on the three collection path patterns: when the request's `Accept` header lists `text/markdown` (including multi-value forms with quality params) and the path is a canonical article URL, serve the prebuilt `.md` payload for that slug with HTTP 200. All other requests fall through untouched. | `netlify/edge-functions/` (new function; registration pattern as in `mcp.ts`) |
| Negotiation response headers | Negotiated responses carry `Content-Type: text/markdown; charset=utf-8` and `X-Markdown-Tokens` (estimated token count, `payload length / 4`) | same edge function |
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

### Constraints

**[Restructured 2026-07-15]** — formerly "Anti-Patterns"; restated positively per the reconciled spec doctrine (AL-81).

- The content collection is the single source for markdown payloads. `.md` responses are emitted from the raw collection body at build time — never from copies under `public/` and never converted back from rendered HTML.
- The site remains fully static. Content negotiation is edge-layer routing to prebuilt payloads; no SSR adapter is introduced for this feature.
- The `.md` surface exposes exactly the same status set as the MCP server and Skill bundle (Live + Experimental). Unpublished statuses are absent from the emitted set on every channel.
- The negotiated response and the direct `.md` response for the same slug are byte-identical bodies.

## Contract

### Definition of Done

- [x] `src/pages/concepts/[...slug].md.ts` emits a static `.md` endpoint for every Live/Experimental concept
- [x] Same for `patterns` and `practices`
- [x] Each `.md` response has `Content-Type: text/markdown; charset=utf-8`
- [x] Each `.md` response body is ≤ 50,000 characters (regression guard for the truncation scorecard finding) — enforced by `assertSizeCap()`, which throws at build time
- [x] Draft / Proposed / Deprecated articles do not appear in the emitted set (Netlify returns 404) — `getStaticPaths()` filters on `PUBLISHED_STATUSES`
- [x] ~~`netlify.toml` rewrite for `Accept: text/markdown` serves the corresponding `.md` payload~~ **[DEPRECATED 2026-07-15]** — Netlify redirect `conditions` cannot match request headers; the rules never fired in production. Superseded by the edge-function items below.
- [x] `public/llms.txt` "Foundational Reading" links updated to `.md` URLs
- [x] Unit tests cover status filter, frontmatter shape, and body length cap (`src/pages/__tests__/markdown-variants.test.ts`, 14 tests green)
- [x] `pnpm test:run` green for this suite

**Content negotiation via edge function (reopened 2026-07-15, closes AL-28):**

- [ ] An edge function under `netlify/edge-functions/` performs the negotiation for the three collection path patterns; the dead `conditions = {Accept = ...}` redirect blocks and the `TODO(AL-28)` note are removed from `netlify.toml` in the same commit
- [ ] `curl -H "Accept: text/markdown" https://asdlc.io/concepts/agentic-sdlc/` returns HTTP 200, `Content-Type: text/markdown; charset=utf-8`, body identical to `/concepts/agentic-sdlc.md`
- [ ] The same holds for a realistic multi-value header (`Accept: text/markdown, */*;q=0.8`)
- [ ] Negotiated responses include `X-Markdown-Tokens`
- [ ] Requests without `text/markdown` in `Accept` (browsers) receive the HTML page unchanged, including on paths the edge function is registered for
- [ ] A negotiated request for a slug with no `.md` variant (Draft article, non-existent slug) falls through to the normal HTML/404 behavior rather than erroring
- [ ] Edge-function negotiation logic is covered by unit tests (Accept-header parsing, path matching, fall-through)

### Regression Guardrails

- The `.md` endpoint MUST share its content source with the HTML page (no copies, no parallel generation)
- The status filter MUST match MCP's filter (Live + Experimental). When MCP filtering changes, this MUST change in lockstep.
- The frontmatter schema in the `.md` output is part of the public contract — adding a field is fine, removing or renaming requires a deprecation notice
- No `.md` response body may exceed 50K chars; the build MUST fail (not warn) on violation
- Resources/recipes/fieldmanual/index pages MUST NOT acquire `.md` variants under this spec — they are explicitly out of scope
- The negotiated response body MUST be byte-identical to the direct `.md` response for the same slug
- Negotiation MUST fail open: any edge-function error yields the default HTML response, never a 5xx

### Scenarios

**Scenario: Agent fetches `.md` URL directly**
- Given: A Claude Code agent calls `WebFetch("https://asdlc.io/concepts/context-engineering.md")`
- When: Netlify serves the static endpoint
- Then: The response is `Content-Type: text/markdown; charset=utf-8`
- And: The body starts with frontmatter, then the article's h2-first body
- And: The body contains no HTML chrome, no `<script>`, no inline CSS

**Scenario: Agent uses content negotiation on the canonical URL**
- Given: An agent calls `curl -H "Accept: text/markdown" https://asdlc.io/concepts/context-engineering/`
- When: The edge function inspects the request
- Then: The response is the same markdown body served by the `.md` URL
- And: HTTP status is 200 (rewrite, not 301/302)
- And: The response carries `Content-Type: text/markdown; charset=utf-8` and `X-Markdown-Tokens`

**Scenario: Agent sends a multi-value Accept header**
- Given: An agent sends `Accept: text/markdown, */*;q=0.8` (the common real-world form)
- When: The edge function inspects the request
- Then: The markdown payload is served exactly as in the exact-match case

**Scenario: Browser requests a negotiated path**
- Given: A browser sends `Accept: text/html,application/xhtml+xml,...` to `/concepts/context-engineering/`
- When: The edge function inspects the request
- Then: The prerendered HTML page is served unchanged

**Scenario: Negotiated request for a slug without a markdown variant**
- Given: A request with `Accept: text/markdown` targets a Draft article's canonical URL, or a non-existent slug
- When: The edge function finds no prebuilt `.md` payload for the path
- Then: The request falls through to Netlify's normal handling (HTML or 404), never a 5xx

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

**Structure as shipped.** The three endpoints are deliberately thin — each filters its collection to published statuses in `getStaticPaths()` and delegates payload construction to the shared helper. The published-status set is re-declared in each endpoint (not imported) so a future per-collection divergence stays local. Canonical implementation: `src/pages/concepts/[...slug].md.ts` (patterns/practices are identical modulo collection name) and `src/lib/markdown-variant.ts`.

**Shared helper (`src/lib/markdown-variant.ts`).** Exposes `MAX_CHARS` (50,000), `PUBLISHED_STATUSES`, `buildFrontmatter()`, `buildPayload()`, and `assertSizeCap()`. `buildPayload()` throws on an empty body; `assertSizeCap()` throws when `frontmatter + body` exceeds `MAX_CHARS`. The cap counts the combined payload, not the body alone.

**Note on the size cap.** The guard is character-based (`.length`), so "50K chars" — not bytes. For the current ASCII-dominant corpus the distinction is immaterial; a future multibyte-heavy article could pass the char cap while exceeding 50KB on the wire. Revisit only if that becomes real.

**Content negotiation mechanism.**

**[DEPRECATED 2026-07-15]**
~~`netlify.toml` redirect with `conditions = {Accept = "text/markdown"}`~~
Netlify redirect conditions only match Country/Language/Role/Cookie; the `Accept` key is silently ignored, so the rules never fired ([Netlify forums confirmation](https://answers.netlify.com/t/content-negotiation-based-on-accept-header/160338)).

**Current:** A Netlify Edge Function (Deno runtime, registered via an exported `config` path pattern — see `netlify/edge-functions/mcp.ts` for the repo's existing example). Intent:

1. Parse the request's `Accept` header; negotiation applies when it lists `text/markdown` (tolerate multi-value lists and `;q=` params — substring/media-range matching, not string equality).
2. On a match, serve the already-built `.md` payload for the requested slug (internal rewrite to the sibling `.md` path — the static artifact from requirement 1). No HTML→markdown conversion at the edge: the prebuilt payload is the canonical markdown, byte-identical to the direct `.md` URL.
3. Add `X-Markdown-Tokens` (estimate: payload length / 4) to the negotiated response.
4. On no match, missing payload, or any internal error: fall through to the default response. Negotiation failures must degrade to HTML, never to an error page.

Netlify's official [markdown-for-agents template](https://docs.netlify.com/prompt-templates/netlify/markdown-for-agents/) validates the edge-function approach but converts HTML with Turndown at request time; we deviate deliberately because our clean markdown already exists as a build artifact (see Constraints).

**Updating `llms.txt`:** Switch four of the five "Foundational Reading" bullets to `.md` URLs (Agentic SDLC, Spec-Driven Development, The Spec, Context Engineering). Field Manual stays as HTML — it is an `.astro` aggregator page (`fieldmanual.astro`), not a content-collection entry, so it has no `.md` source and cannot emit a `.md` variant under this spec. Leave the index-page links (`/concepts/`, `/patterns/`, `/practices/`) as HTML since those are navigation, not content.

## Resources

- AL-28 (Linear) — Source PBI; the 2026-07-15 comment thread carries the live-verification evidence and edge-function research
- AL-93 (Linear) — Companion discovery surface (Link headers + `/.well-known/api-catalog`)
- Commit `32a15cc` — `feat(markdown-variants): add markdown endpoints and assess updates` (implementation provenance)
- `src/lib/markdown-variant.ts` — Shared payload logic (canonical implementation)
- `src/pages/__tests__/markdown-variants.test.ts` — Contract tests (status filter, frontmatter shape, size cap)
- `netlify/edge-functions/mcp.ts` — Existing edge-function precedent (registration pattern, project conventions)
- `specs/llms-txt/spec.md` — Sibling discoverability surface (links updated to `.md`)
- `specs/content-articles/spec.md` — Shared article contract
- `specs/mcp-evals/spec.md` — Adjacent agent-facing quality gate (AL-78)
- [Netlify markdown-for-agents template](https://docs.netlify.com/prompt-templates/netlify/markdown-for-agents/) — Official reference for the edge-function negotiation pattern
- [Netlify Edge Functions](https://docs.netlify.com/build/edge-functions/overview/) — Runtime and configuration reference
