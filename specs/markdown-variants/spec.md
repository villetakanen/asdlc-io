---
title: "Markdown Variants for Live Content Pages"
status: "draft"
owner: "Ville Takanen"
archetype: "feature"
created: "2026-05-22"
tags: ["agent-docs", "discoverability", "content-negotiation"]
linear: "AL-28"
---

# Feature: Markdown Variants for Live Content Pages

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

**File layout:**

| Concern | Mechanism |
|:---|:---|
| `.md` URL routing | New static endpoints: `src/pages/concepts/[...slug].md.ts`, `src/pages/patterns/[...slug].md.ts`, `src/pages/practices/[...slug].md.ts` |
| Content source | Same `getCollection()` entries used by the `[...slug].astro` HTML pages — single source of truth |
| Status filter | Only entries with `status: "Live"` or `status: "Experimental"` are emitted as `.md`. Draft / Proposed / Deprecated → 404 (i.e. not emitted, Netlify returns 404). |
| Response headers | `Content-Type: text/markdown; charset=utf-8` |
| `Accept` negotiation | `netlify.toml` redirect: when `Accept` header contains `text/markdown` and path matches `/(concepts\|patterns\|practices)/<slug>/`, redirect (force 200 rewrite) to the corresponding `.md` URL |
| `llms.txt` update | Foundational reading links in `public/llms.txt` point to `.md` variants |

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

The frontmatter is a curated subset of the article schema — only fields useful for an agent reader (title, description, status, lastUpdated, tags, canonical). It excludes implementation-only fields like `relatedIds` (which use internal collection IDs) and any reference objects that would balloon the payload. References are kept inline in the body as they already appear.

**Single source of truth:** The `.md` endpoint reads the raw `.md` file from the content collection via `getEntry()` / file system (whichever is the cleanest API in current Astro). It does **not** re-serialize from parsed AST — that risks losing formatting fidelity.

### Anti-Patterns

- **Duplicating content under `public/`.** Do not copy `.md` files into `public/` to serve them as static assets. The collection remains the single source.
- **Generating from rendered HTML.** Do not turn the rendered HTML page back into markdown — round-trip loses fidelity and reintroduces the boilerplate problem.
- **SSR adapter for one feature.** Do not add `@astrojs/netlify` SSR adapter just for content negotiation. Edge-level redirect is sufficient and keeps the static-first ethos.
- **Exposing Draft / Proposed.** The `.md` surface must match MCP and Skill filtering — never leak unfinished content via this channel.

## Contract

### Definition of Done

- [ ] `src/pages/concepts/[...slug].md.ts` emits a static `.md` endpoint for every Live/Experimental concept
- [ ] Same for `patterns` and `practices`
- [ ] Each `.md` response has `Content-Type: text/markdown; charset=utf-8`
- [ ] Each `.md` response body is ≤ 50,000 characters (regression guard for the truncation scorecard finding)
- [ ] Draft / Proposed / Deprecated articles do not appear in the emitted set (Netlify returns 404)
- [ ] `netlify.toml` rewrite: `Accept: */text\/markdown/*` on `/(concepts|patterns|practices)/<slug>/` serves the corresponding `.md` payload with HTTP 200
- [ ] `public/llms.txt` "Foundational Reading" links updated to `.md` URLs
- [ ] Unit tests cover: status filter, frontmatter shape, body length cap
- [ ] `pnpm check`, `pnpm lint`, `pnpm test:run`, `pnpm build` all green

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

**Endpoint shape (sketch):**

```ts
// src/pages/concepts/[...slug].md.ts
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

const MAX_BYTES = 50_000;
const PUBLISHED = new Set(["Live", "Experimental"]);

export async function getStaticPaths() {
  const entries = await getCollection("concepts", (e) => PUBLISHED.has(e.data.status));
  return entries.map((e) => ({ params: { slug: e.id }, props: { entry: e } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props as { entry: Awaited<ReturnType<typeof getCollection>>[number] };
  const fm = buildFrontmatter(entry); // curated subset
  const body = `${fm}\n\n${entry.body ?? ""}`;
  if (body.length > MAX_BYTES) {
    throw new Error(`md payload for ${entry.id} is ${body.length} chars (>${MAX_BYTES})`);
  }
  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
```

Repeat the same shape for `patterns/` and `practices/`. The differences are the collection name and the published-status set (likely identical, but kept explicit per-collection so a future divergence is local).

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

- AL-28 (Linear) — Source PBI
- `specs/llms-txt/spec.md` — Sibling discoverability surface (will be updated)
- `specs/content-articles/spec.md` — Shared article contract
- `specs/mcp-server/spec.md` (referenced) — Filter-set parity target
- `netlify.toml` — Edge redirect surface
- [Netlify Accept-based redirects](https://docs.netlify.com/routing/redirects/redirect-options/) — Verify behavior
