---
title: "Markdown Variants for Live Content Pages"
status: "approved"
owner: "Ville Takanen"
archetype: "feature"
created: "2026-05-22"
updated: "2026-10-26"
tags: ["agent-docs", "discoverability", "content-negotiation"]
linear: "AL-28"
---

# Feature: Markdown Variants for Live Content Pages

> **Direct Markdown URLs:** Shipped in commit `32a15cc` (2026-07-05), including discovery links and payload tests. Edge negotiation has separate verification requirements below.
>
> **Verification history (2026-07-15):** Direct `.md` URLs worked in production, but Accept-header negotiation through Netlify redirects failed. Edge negotiation replaces that approach; its deployment checks remain open below. Evidence: Linear AL-28 comment thread.

## Blueprint

### Context

AI coding agents and AI answer engines fetch site content directly over HTTP. This feature addresses the HTML-only delivery problems recorded in the **Agent Docs Scorecard (Apr 11, 2026)**:

- **Markdown Availability: 0/100.** No machine-friendly variant exists for any content URL.
- **Truncation risk.** Three pages exceed 100K characters once converted by an agent's HTML→markdown step; agents silently drop the tail.
- **Boilerplate dilution.** Nine pages spend 10–50% of their first tokens on non-content chrome before the article body begins.

Markdown URLs complement the MCP server and downloadable Skill by making clean article payloads available to ordinary HTTP clients, without requiring MCP integration or a downloaded bundle.

**Consumers:** Agents, AI answer engines, and other HTTP clients that need article content without HTML presentation markup.

**Out of scope:** Recipes collection (separate archetype, deferred); resources pages (no markdown source — they're `.astro` pages); homepage and `/getting-started` negotiation (agents reach those surfaces via `public/llms.txt` and the discovery Link headers of AL-93 — revisit only if scanner or agent telemetry shows demand).

### Architecture

**Delivery architecture:** HTML and Markdown representations are generated at build time. Netlify edge routing selects the representation using the request's `Accept` header; this feature requires no SSR adapter.

**File layout (as shipped):**

| Concern | Mechanism | Canonical source |
|:---|:---|:---|
| `.md` URL routing | Static endpoints, one per collection | `src/pages/concepts/[...slug].md.ts`, `src/pages/patterns/[...slug].md.ts`, `src/pages/practices/[...slug].md.ts` |
| Shared payload contract | Consistent frontmatter, published eligibility, and size-limit enforcement across all three collections | `src/lib/markdown-variant.ts` |
| Content source | Markdown and HTML representations use the same article entries | Astro content collections |
| Published eligibility | Only Live and Experimental articles have `.md` variants; Draft / Proposed / Deprecated `.md` URLs return HTTP 404. | `src/lib/markdown-variant.ts` |
| Response headers | `Content-Type: text/markdown; charset=utf-8` | endpoint `GET` handlers |
| `Accept` negotiation | Eligible requests to canonical article URLs receive the prebuilt `.md` payload with HTTP 200. Accept-header handling supports multi-value forms and quality parameters; other requests fall through unchanged. | `netlify/edge-functions/markdown-negotiation.ts` |
| Negotiation response headers | `Content-Type: text/markdown; charset=utf-8` and `X-Markdown-Tokens`, estimated as the complete payload's UTF-16 code-unit count divided by four, rounded up | `netlify/edge-functions/markdown-negotiation.ts` |
| `llms.txt` update | "Foundational Reading" links point to `.md` variants | `public/llms.txt` |

**Payload format:** YAML frontmatter followed by the article's raw Markdown body, with headings starting at h2.

Frontmatter contains `title`, `description`, `status`, `lastUpdated` (`YYYY-MM-DD`), `tags` (default `[]`), and `canonical`. It omits `relatedIds`, `references`, and `supersededBy`; references already present in the article body remain intact. Implementation: `src/lib/markdown-variant.ts`.

**Single source of truth:** Each `.md` payload preserves the article's raw Markdown, prefixed with frontmatter, using the same content collection as its HTML page. An empty article body fails the build.

### Constraints

- Markdown payloads are generated from the original article content at build time, without separately maintained copies or conversion from rendered HTML.
- The site remains fully static. Content negotiation is edge-layer routing to prebuilt payloads; no SSR adapter is introduced for this feature.
- The `.md` surface exposes exactly the same status set as the MCP server and Skill bundle (Live + Experimental). Unpublished statuses are absent from the emitted set on every channel.
- The negotiated response and the direct `.md` response for the same slug are byte-identical bodies.

## Contract

### Definition of Done

- [x] Every Live or Experimental article in concepts, patterns, and practices has a statically generated `.md` URL.
- [x] Each `.md` response has `Content-Type: text/markdown; charset=utf-8`
- [x] Each complete `.md` payload, including frontmatter, is ≤ 50,000 characters to guard against agent-side truncation; exceeding the cap fails the build.
- [x] Draft / Proposed / Deprecated articles have no emitted `.md` variant; requests to those `.md` URLs return HTTP 404.
- **[DEPRECATED 2026-07-15]** Accept-header negotiation through Netlify redirects was ineffective; superseded by the edge-negotiation requirements below.
- [x] `public/llms.txt` "Foundational Reading" links updated to `.md` URLs
- [x] Unit tests verify published-status eligibility, frontmatter shape, and the complete-payload size cap (`src/pages/__tests__/markdown-variants.test.ts`).
- [x] `pnpm test:run` green for this suite

**Content negotiation — implementation and verification:**

- [x] Edge negotiation covers concepts, patterns, and practices; obsolete Accept-header redirects are absent from `netlify.toml`.
- [ ] `curl -H "Accept: text/markdown" https://asdlc.io/concepts/agentic-sdlc/` returns HTTP 200, `Content-Type: text/markdown; charset=utf-8`, body identical to `/concepts/agentic-sdlc.md`
- [ ] The same holds for a realistic multi-value header (`Accept: text/markdown, */*;q=0.8`)
- [ ] Negotiated responses include `X-Markdown-Tokens`
- [ ] Requests without `text/markdown` in `Accept` (browsers) receive the HTML page unchanged, including on paths the edge function is registered for
- [ ] A negotiated request for a slug with no `.md` variant (Draft article, non-existent slug) falls through to the normal HTML/404 behavior rather than erroring
- [x] Unit tests cover Accept-header eligibility, article-path matching, and token estimates (`src/lib/__tests__/markdown-negotiation.test.ts`).
- [ ] Edge-handler tests verify fall-through for missing payloads and internal errors.

### Regression Guardrails

- The `.md` endpoint MUST share its content source with the HTML page (no copies, no parallel generation)
- The status filter MUST match MCP's filter (Live + Experimental). When MCP filtering changes, this MUST change in lockstep.
- The frontmatter schema in the `.md` output is part of the public contract — adding a field is fine, removing or renaming requires a deprecation notice
- No complete `.md` payload, including frontmatter, may exceed 50,000 UTF-16 code units; the build MUST fail on violation.
- Resources/recipes/fieldmanual/index pages MUST NOT acquire `.md` variants under this spec — they are explicitly out of scope
- The negotiated response body MUST be byte-identical to the direct `.md` response for the same slug
- Negotiation MUST fail open: errors fall through to normal HTML/404 handling rather than introducing a negotiation-generated 5xx.

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
- Then: The request falls through to Netlify's normal HTML/404 handling without introducing a negotiation-generated error.

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
- Given: An article's complete `.md` payload, including frontmatter, exceeds 50,000 UTF-16 code units
- When: `pnpm build` runs
- Then: The build fails with an error naming the offending slug and its size

## Implementation Notes

**Endpoint implementation:** See `src/pages/concepts/[...slug].md.ts`, `src/pages/patterns/[...slug].md.ts`, and `src/pages/practices/[...slug].md.ts`.

**Payload implementation:** `src/lib/markdown-variant.ts` is the canonical source for payload construction and validation.

**Size-cap unit:** The 50,000-character limit counts UTF-16 code units, not encoded bytes.

**Content negotiation mechanism.**

**[DEPRECATED 2026-07-15]** Netlify redirects cannot negotiate on arbitrary request headers; use edge negotiation instead ([supporting evidence](https://answers.netlify.com/t/content-negotiation-based-on-accept-header/160338)).

**Negotiation implementation:** `netlify/edge-functions/markdown-negotiation.ts`.

GET/HEAD requests to canonical article URLs are eligible when `Accept` explicitly includes `text/markdown`, with no quality parameter or a positive quality value. Wildcards alone and `text/markdown;q=0` do not qualify; other methods pass through unchanged. Negotiated GET responses contain the prebuilt Markdown payload, byte-identical to the direct `.md` response, with the headers defined in the architecture table. Non-matching requests, missing payloads, and negotiation errors fall through to normal HTML/404 handling.

Netlify's official [markdown-for-agents template](https://docs.netlify.com/prompt-templates/netlify/markdown-for-agents/) validates the edge-function approach but converts HTML with Turndown at request time; we deviate deliberately because our clean markdown already exists as a build artifact (see Constraints).

**Discovery:** In `public/llms.txt`, foundational links to Agentic SDLC, Spec-Driven Development, The Spec, and Context Engineering use `.md` URLs. Field Manual and collection indexes retain HTML links because they are navigation surfaces outside this feature's scope.

## Resources

- [Agent usage telemetry](../agent-usage-telemetry/spec.md) — delivery counting for direct and negotiated Markdown.

- AL-28 (Linear) — Source PBI; the 2026-07-15 comment thread carries the live-verification evidence and edge-function research
- AL-93 (Linear) — Companion discovery surface (Link headers + `/.well-known/api-catalog`)
- Commit `32a15cc` — `feat(markdown-variants): add markdown endpoints and assess updates` (implementation provenance)
- `src/lib/markdown-variant.ts` — Shared payload logic (canonical implementation)
- `src/pages/__tests__/markdown-variants.test.ts` — Contract tests (status filter, frontmatter shape, size cap)
- `netlify/edge-functions/markdown-negotiation.ts` — Markdown negotiation and fallback handling
- `src/lib/__tests__/markdown-negotiation.test.ts` — Eligibility, path-matching, and token-estimate tests
- `specs/llms-txt/spec.md` — Sibling discoverability surface (links updated to `.md`)
- `specs/content-articles/spec.md` — Shared article contract
- `specs/mcp-evals/spec.md` — Adjacent agent-facing quality gate (AL-78)
- [Netlify markdown-for-agents template](https://docs.netlify.com/prompt-templates/netlify/markdown-for-agents/) — Official reference for the edge-function negotiation pattern
- [Netlify Edge Functions](https://docs.netlify.com/build/edge-functions/overview/) — Runtime and configuration reference
