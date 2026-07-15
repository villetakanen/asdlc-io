# GEO Audit Report: ASDLC.io

**Audit Date:** 2026-06-12
**Site:** https://asdlc.io
**Site Type:** Publisher / Knowledge Base (Static Astro 5.x on Netlify)
**Content Files Analyzed:** 73 markdown files (37 concepts, 18 patterns, 14 practices, 3 recipes; MCP index exposes 64 Live/Experimental)
**Collections:** Concepts, Patterns, Practices, Recipes

---

## Executive Summary

**Overall GEO Score: 72/100 (Fair — upper band, effectively "Good" on the engineering trajectory; see comparability note)**

ASDLC.io retains a strong technical and knowledge-base foundation: explicit AI-crawler allowances, a well-formed `llms.txt`, an MCP server with passing evals, content-negotiation markdown variants, per-article sitemap `lastmod`, dense cross-referencing, and — new since the last audit — `BreadcrumbList` on every article/collection page and `HowTo` on 12 of 14 practices. **Schema & Structured Data rose from 70 → 82.** The dominant remaining weakness is **Content E-E-A-T**: no named-person authorship anywhere in machine-readable metadata, no `/about` page, and 20% of articles carry zero citations — including the flagship `concepts/agentic-sdlc.md`. AI Citability is held back by the near-total absence of FAQ/Q&A blocks and "When to Use" guidance.

### ⚠️ Score comparability note (read before reacting to the number)

This audit's composite (72) is **not directly comparable** to the prior audit's 81 (2026-05-28). The category weights are unchanged, but two categories were graded more stringently this round:

| Category | Prior (2026-05-28) | This run | Δ | Why the movement |
|---|---|---|---|---|
| AI Citability | 82 | 74 | −8 | Stricter grading of FAQ/"When to Use" absence (no content regressed) |
| Content E-E-A-T | 75 | 52 | −23 | Stricter grading of the still-open author/about/citation gaps (AL-57/66/67) |
| Technical GEO | 88 | 78 | −10 | Stricter grading of RSS/OG/search gaps (no infra regressed) |
| **Schema & Structured Data** | **70** | **82** | **+12** | **Real improvement: BreadcrumbList (AL-58) + HowTo (AL-59) shipped** |
| Knowledge Base & MCP | 90 | 87 | −3 | Found a real index bug + MCP-version drift (below) |

**The site engineering improved this cycle.** The headline number fell because four of five categories were graded harder, while the one category we actively worked (Schema) measurably rose. Treat **72 as a re-based, more conservative baseline** for the remainder of the GEO epic (AL-55), and track category deltas — especially Schema — rather than the prior 81→90 framing. The genuine, un-inflated gap is **E-E-A-T**, which is exactly the AL-57/66/67 cluster still in the backlog.

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 74/100 | 30% | 22.20 |
| Content E-E-A-T | 52/100 | 25% | 13.00 |
| Technical GEO | 78/100 | 15% | 11.70 |
| Schema & Structured Data | 82/100 | 15% | 12.30 |
| Knowledge Base & MCP | 87/100 | 15% | 13.05 |
| **Overall GEO Score** | | | **72/100** |

---

## Critical Issues (Fix Immediately)

**None.** No AI crawlers blocked, sitemap present and healthy (with `lastmod`), MCP server live and passing 18/18 evals, structured data present on all article pages, meta descriptions present. No critical-severity defects found.

---

## High Priority Issues

### H-1 — `concepts/agent-skills.md` silently dropped from the MCP index (missing `status`)
- **Category:** KB & MCP / Citability
- **File:** `src/content/concepts/agent-skills.md`
- **Problem:** The file has no `status:` field, so Astro's Zod schema defaults it to `"Draft"` and `generate-mcp-index.mjs` excludes it from `articles.json`. The article has `relatedIds`, references (incl. a 2026 paper), and `publishedDate` — it is clearly meant to be Live, but is invisible to MCP/search and the downloadable skill. No error is raised.
- **Fix:** Add `status: "Live"` (or `"Experimental"`) to its frontmatter. Add a lint rule in `scripts/lint-specs.mjs` (or the content lint) warning when a file has `publishedDate` but no explicit `status`.

### H-2 — Flagship article `concepts/agentic-sdlc.md` has zero citations (AL-67)
- **Category:** E-E-A-T
- **File:** `src/content/concepts/agentic-sdlc.md`
- **Problem:** The site's central definitional article carries 0 `references`. AI engines weight citation density heavily for trust; the most-cited-likely page has the weakest authority signal. Part of a broader gap — 14/69 articles (20%) have 0 references, 28 (41%) have only 1–2.
- **Fix:** Prioritize `agentic-sdlc.md` (3+ references incl. the Ville Takanen industrialization essay as self-citation), then backfill the practices collection (6/14 at zero). Tracked as **AL-67**.

### H-3 — No named-Person author anywhere in metadata (AL-57)
- **Category:** E-E-A-T / Schema
- **Files:** `src/components/StructuredData.astro:37-41` (`author` = Organization "ASDLC.io Contributors"), `src/components/SEOMetadata.astro:25` (`<meta name="author">` same string), `src/content/config.ts` (no `authors` field)
- **Problem:** Every `TechArticle` attributes authorship to a generic Organization. schema.org prefers a named `Person` with `sameAs`. Ville Takanen appears only as body-text in `agentic-sdlc.md`/`getting-started.md`, never in machine-readable metadata. This is the single highest-weighted E-E-A-T miss.
- **Fix:** Implement the authors-registry design already scoped on **AL-57** (`src/data/authors.ts` + optional `authors` on `articleSchema`, emit `Person[]` with fallback to Ville). Multi-author aware (Ville + Mats Ljunggren).

### H-4 — No `/about` page (AL-66)
- **Category:** E-E-A-T
- **File:** `src/pages/` (absent)
- **Problem:** No `/about`, `/authors`, or `/team`. AI cannot resolve the identity, credentials, or organizational backing behind the site's claims — a major trust ceiling. Should consume the same AL-57 authors registry.
- **Fix:** Create `src/pages/about.astro` (bio, credentials/Futurice, `sameAs` profile links, `AboutPage` + `Person` JSON-LD). Tracked as **AL-66**.

### H-5 — FAQ/Q&A blocks absent across the corpus; no FAQPage schema (AL-62)
- **Category:** Citability / Schema
- **Files:** all content; `src/components/StructuredData.astro` (no FAQPage branch)
- **Problem:** Zero in-article `## FAQ`/Q&A blocks across 72 articles. Question-shaped queries ("What is X?", "When do I use Y?") are where AI engines preferentially cite `FAQPage`-marked content. This is both a content gap and the missing-schema gap tracked as **AL-62**.
- **Fix:** Pilot `## Frequently Asked Questions` (3–5 Q&A pairs) on the top concepts (`agentic-sdlc`, `context-engineering`, `vibe-coding`, `spec-driven-development`, `levels-of-autonomy`) and wire FAQPage JSON-LD via `faq` frontmatter (AL-62).

### H-6 — No RSS/Atom feed (AL-64)
- **Category:** Technical
- **Files:** `src/pages/` (no `rss.xml.ts`), `src/layouts/BaseLayout.astro` (no `<link rel="alternate">`), `package.json` (no `@astrojs/rss`)
- **Problem:** No feed for syndication; feed readers and AI aggregators (Perplexity, NotebookLM) lose a discovery channel.
- **Fix:** Add `@astrojs/rss`, `src/pages/rss.xml.ts` (all collections, `status: Live`/`Experimental`, by `lastUpdated` desc), `<link rel="alternate">` in `BaseLayout`, and list it in `llms.txt`. Tracked as **AL-64**.

---

## Medium Priority Issues

### M-1 — Missing `mainEntityOfPage`, `inLanguage`, `articleSection` on every TechArticle (AL-60)
- **File:** `src/components/StructuredData.astro` (TechArticle branch, ~lines 32-52)
- **Fix:** Add `mainEntityOfPage: { "@type": "WebPage", "@id": data.url }`, `inLanguage: "en"`, and `articleSection` (collection name passed from each route). Tracked as **AL-60**.

### M-2 — Dead/misleading branches in `StructuredData.astro` (AL-61)
- **File:** `src/components/StructuredData.astro:55-61` (`data.proficiencyLevel`/`data.maturity`/`data.complexity`) and `:36` (`data.definition`)
- **Problem:** None of these fields exist in `articleSchema`; the branches never fire and the `articleBody = "Complexity: …"` branch would emit invalid markup if it ever did. Misleads readers about the schema.
- **Fix:** Remove the dead branches (or wire `proficiencyLevel` to a real schema field). Tracked as **AL-61**. *(Natural to batch with AL-60/AL-57 — same file.)*

### M-3 — No `SearchAction` on homepage WebSite schema (AL-63), blocked by no `/search` route
- **Files:** `src/pages/index.astro:23-27` (no `potentialAction`), `src/components/StructuredData.astro:68` (passthrough exists, unused); no `src/pages/search*`
- **Fix:** Build a `/search` static page reusing `src/mcp/fuse-index.json` client-side, then emit `SearchAction` pointing at it. Tracked as **AL-63** (sequence the search route first).

### M-4 — Homepage description vs SEOMetadata default mismatch (AL-74)
- **Files:** `src/pages/index.astro:12-13` vs `src/components/SEOMetadata.astro:12-13`
- **Fix:** Single canonical `SITE_DESCRIPTION` constant (e.g. `src/lib/site.ts`) imported by both. Tracked as **AL-74**.

### M-5 — `og:type` stays `"website"` on articles; no `article:published_time`/`modified_time` (AL-75)
- **Files:** the four article routes don't pass `type="article"`; `src/components/SEOMetadata.astro` emits no `article:*` tags
- **Fix:** Pass `type="article"` + dates from each article route; emit `article:published_time`/`article:modified_time` when `type === "article"`. Tracked as **AL-75**.

### M-6 — Recipes collection excluded from llms.txt, downloadable skill, and content negotiation (AL-69 + extension)
- **Files:** `public/llms.txt` (no Recipes in Core Content), `scripts/build-skill.mjs:18` (`COLLECTIONS` omits recipes), `netlify.toml` + `src/pages/recipes/` (no `[id].md.ts` markdown variant)
- **Fix:** Add Recipes to `llms.txt` (**AL-69**); add `"recipes"` to the skill `COLLECTIONS`; add a `recipes/[id].md.ts` endpoint + `netlify.toml` redirect for `Accept: text/markdown`.

### M-7 — `articles.json` / `fuse-index.json` git-tracked with no local staleness guard (AL-70)
- **Files:** `src/mcp/articles.json`, `src/mcp/fuse-index.json`, `lefthook.yml`, `scripts/generate-mcp-index.mjs`
- **Problem:** The `prebuild` hook protects only the Netlify pipeline; a content commit without a rebuild silently drifts the committed index.
- **Fix:** Add a `pre-commit` (lefthook) regen+stage of the index when `src/content/**/*.md` changes, or a hash-based staleness check that fails CI. Tracked as **AL-70**.

### M-8 — MCP protocol version behind; `ping` unhandled (AL-50)
- **Files:** `src/mcp/server.ts:47` (`protocolVersion: "2024-11-05"`), `:88-89`
- **Problem:** Server advertises only `2024-11-05`; clients negotiating newer revisions may degrade. The MUST-support `ping` method returns `-32601`.
- **Fix:** Bump to the current stable protocol version (or negotiate multiple), handle `ping`, and stop returning a result body for the `notifications/initialized` notification. Tracked as **AL-50**.

### M-9 — 24 pages emit zero JSON-LD
- **Files:** `src/pages/getting-started.md`, `src/pages/fieldmanual.astro`, `src/pages/resources/**` (index + compendium + governance + further-reading + legend + design-system subtree)
- **Fix:** Add at least `BreadcrumbList` (and `TechArticle`/`WebPage` where apt) to `getting-started` and the `resources/*` pages. *Not currently ticketed — recommend a new PBI.*

---

## Low Priority Issues

- **L-1 — Body `<h1>` in content files** violates the "h2-first" rule in `src/content/concepts/agent-skills.md` and `src/content/practices/adversarial-requirement-review.md`. Breaks heading hierarchy / passage extraction. *(Not ticketed — recommend a small content-hygiene PBI; pairs with H-1.)*
- **L-2 — `concepts/event-modeling.md` missing `relatedIds`** — the only graph orphan (AL-68).
- **L-3 — Per-article OG image absent** — all pages fall back to `/asdlc.png` (`SEOMetadata.astro:15`); AL-65.
- **L-4 — `spec-reversing.md` lacks a `## Definition`** opening and any quantitative claims — weakest-citability pattern; opens with `## The Void`.
- **L-5 — 16/18 patterns lack a "When to Use" section** — systematic citability gap for "should I use X?" queries.
- **L-6 — `publishedDate` absent on ~72% of articles** — suppresses `datePublished` in JSON-LD; weakens freshness signal.
- **L-7 — Mermaid `alt="Mermaid Diagram"`** generic alt text (AL-73).
- **L-8 — Duplicate H2 sections** in at least `patterns/the-spec.md` (AL-72).
- **L-9 — `status:` YAML quoting inconsistency** across content (AL-71).
- **L-10 — No `_headers` hardening** (`X-Content-Type-Options`, `Cache-Control`, sitemap `Link` header) — minor.

---

## Source vs. Rendered Discrepancies

**Tooling caveat:** `WebFetch` converts HTML→markdown and **strips `<script type="application/ld+json">` tags**, so it reports "0 JSON-LD blocks" on every page. This is a tool limitation, **not** evidence of missing schema. All schema validation in this audit was performed against `src/components/StructuredData.astro` and the local `dist/` build, which is authoritative.

Checked URLs: `/`, `/concepts/agentic-sdlc`, `/sitemap-0.xml`, `/robots.txt`, `/llms.txt`.

1. **Sitemap `lastmod` IS live (AL-56 deployed).** `https://asdlc.io/sitemap-0.xml` returns 107 `<url>` entries, 93 with `<lastmod>`; homepage/index pages correctly omit it. The per-article `lastmod` feature is in production.
2. **Live `llms.txt` omits Recipes** — confirmed against production (AL-69 still open).
3. **robots.txt** matches source exactly — all six AI crawlers explicitly allowed + sitemap directive.
4. **Live vs local count delta (verify after next deploy):** live sitemap shows **107 URLs / 93 lastmod**, but the current local `dist/` build shows **101 pages / 72 lastmod**. The deployed build appears to be from a different commit than the local working tree. Recommend re-checking the live sitemap after the current `dev` branch (AL-58 breadcrumbs) and the uncommitted AL-59 (HowTo) are deployed, to confirm BreadcrumbList/HowTo render in production.
5. **JSON-LD parity (BreadcrumbList/HowTo)** could not be confirmed on the live site via WebFetch (see caveat). Verified present in local `dist/`: BreadcrumbList on 76 pages, HowTo on 12 practice pages.

---

## Category Deep Dives

### AI Citability (74/100)

**Strong bones, weak conversational surface.** Near-universal `## Definition` first-blocks (36/37 concepts, 17/18 patterns), bold-term-at-first-use, dense statistical claims with named sources (25 articles), and premier comparison tables (`patterns/context-gates.md` 5×5 Gate Taxonomy, `concepts/levels-of-autonomy.md` L1–L5 matrix). Held back by: (a) **no FAQ/Q&A blocks** anywhere (H-5); (b) **16/18 patterns lack "When to Use"** (L-5) — AI can't answer "should I use X?"; (c) `spec-reversing.md` has no definition/stats (L-4); (d) a stray body `# H1` in `agent-skills.md` (L-1). Tier-1 citable exemplars: `vibe-coding.md`, `levels-of-autonomy.md`, `context-gates.md`. Rewrite opportunity: promote buried decision hierarchies to their own H3 (e.g. `context-engineering.md` "Constraint Decision Hierarchy").

### Content E-E-A-T (52/100)

**The real weak spot, and the highest-leverage work remaining.** Genuine strengths: original frameworks (Triple Debt Model, L3 autonomy, Cybernetic Loop) — strong "Experience/Expertise" signal — and a dense cross-reference graph (68/69 with `relatedIds`). But the trust signals AI engines check first are absent: **no named author** in any metadata (H-3/AL-57), **no /about page** (H-4/AL-66), and **20% of articles have zero citations** including the flagship (H-2/AL-67). Citation density by collection: concepts 2.9 avg (1 zero-ref), patterns 1.7 avg (7 zero-ref), practices 1.6 avg (6 zero-ref). `publishedDate` present on only ~28% (L-6); three articles stale at 2025-01-05. Closing AL-57 + AL-66 + AL-67 is the fastest route to lift the composite.

### Technical GEO (78/100)

**Well-architected, a few discoverability gaps.** Strengths: explicit AI-crawler `Allow` (`public/robots.txt`), structured `llms.txt`, MCP edge function (`netlify/edge-functions/mcp.ts`), three-layer content negotiation (`Accept: text/markdown` → `.md.ts` routes, 50k cap, `canonical` in frontmatter), static SSG output, per-article sitemap `lastmod` (`astro.config.mjs buildLastmodMap()`), correct canonical + Twitter/OG baseline. Gaps: no RSS (H-6/AL-64), `og:type="website"` on articles + no `article:*` dates (M-5/AL-75), per-article OG image (L-3/AL-65), no SearchAction (M-3/AL-63), Recipes missing from llms.txt + content-negotiation (M-6/AL-69), homepage/SEOMetadata description mismatch (M-4/AL-74). Unverified post-deploy: `Accept: text/markdown, */*;q=…` quality-factor matching in `netlify.toml`.

### Schema & Structured Data (82/100) — ▲ +12 from prior 70

**The category we moved this cycle.** `TechArticle` on all 72 article pages (headline, description, author, publisher, datePublished, dateModified, keywords, url). **`BreadcrumbList` on 76 pages** (all articles + 4 collection indexes; correct absolute URLs via `src/lib/breadcrumbs.ts`) — AL-58 complete. **`HowTo` on 12/14 practices** with `HowToStep[]` (name/text/position) — AL-59 complete. Homepage emits `WebSite` + `Organization`. Remaining gaps: named `Person` author (AL-57), `mainEntityOfPage`/`inLanguage`/`articleSection` (AL-60), dead branches (AL-61), `FAQPage` (AL-62), `SearchAction` (AL-63), and 24 pages with no JSON-LD (M-9).

**Schema catalog:**

| Type | Pages | Key fields present | Missing |
|---|---|---|---|
| TechArticle | 72 | headline, description, author(Org), publisher, datePublished, dateModified, keywords, url | mainEntityOfPage, inLanguage, articleSection, Person author |
| BreadcrumbList | 76 | itemListElement[] (ListItem, position, name, item) | — (correct) |
| HowTo | 12 | name, description, step[] (HowToStep, position, name, text) | — (optional totalTime) |
| WebSite | 1 | name, url, description | potentialAction (SearchAction) |
| Organization | 1 + embedded | name, url, logo, description | sameAs |
| FAQPage | 0 | — | entire type (AL-62) |
| Person | 0 | — | entire type (AL-57) |

### Knowledge Base & MCP (87/100)

**Strongest category.** 18/18 MCP evals pass (run in the pre-push hook); three well-described tools (`list_articles`, `get_article`, `search_knowledge_base`) over a pre-built Fuse.js index; `prebuild` regenerates `articles.json` for production; excellent relationship density (387 `relatedIds` links, 5.4 avg, top hubs at 13). Downloadable skill (`dist/asdlc-skill.zip`) with link rewriting + `SKILL.md` manifest. Deductions: MCP protocol version behind + `ping` unhandled (M-8/AL-50); committed index has no local staleness guard (M-7/AL-70); **`agent-skills.md` silently missing from the index** (H-1); recipes absent from skill + llms.txt (M-6); `event-modeling` graph orphan (L-2).

---

## Quick Wins (Implement This Week)

1. **Add `status: "Live"` to `src/content/concepts/agent-skills.md`** (H-1) — one line; un-hides a complete article from MCP/search/skill. Highest value-per-effort in the audit.
2. **Add 3+ `references` to `concepts/agentic-sdlc.md`** (H-2/AL-67) — cite the Ville Takanen industrialization essay + 2 sources; lifts the flagship's authority.
3. **Add Recipes to `public/llms.txt`** (M-6/AL-69) — one line under Core Content.
4. **Add `relatedIds` to `concepts/event-modeling.md`** (L-2/AL-68) — closes the only graph orphan + bidirectional-link invariant.
5. **Remove dead branches in `StructuredData.astro`** (M-2/AL-61) — delete `definition`/`proficiencyLevel`/`maturity`/`complexity` paths; de-risks the file for AL-57/AL-60.
6. **Delete the stray body `# H1`** in `agent-skills.md` and `adversarial-requirement-review.md` (L-1).

## 30-Day Action Plan

### Week 1 — E-E-A-T foundation (biggest lever)
- [ ] AL-57: authors registry (`src/data/authors.ts`) + named `Person` author in `StructuredData.astro` + `<meta name="author">`
- [ ] AL-66: `/about` page consuming the registry (`AboutPage` + `Person` JSON-LD)
- [ ] H-1 + L-1 content hygiene (`agent-skills.md` status + H1; `adversarial-requirement-review.md` H1)

### Week 2 — Citation depth + TechArticle completeness
- [ ] AL-67: backfill references — flagship `agentic-sdlc.md` first, then the 6 zero-ref practices
- [ ] AL-60: `mainEntityOfPage` + `inLanguage` + `articleSection` on TechArticle (batch with AL-61 cleanup)
- [ ] AL-68: `event-modeling` relatedIds

### Week 3 — Discoverability surfaces
- [ ] AL-64: RSS feed + `<link rel="alternate">` + llms.txt entry
- [ ] AL-69 + skill/content-negotiation: Recipes into llms.txt, `build-skill.mjs`, and a `recipes/[id].md.ts` variant
- [ ] AL-74 + AL-75: canonical site description constant; `og:type="article"` + `article:*` dates

### Week 4 — Schema breadth + search
- [ ] AL-62: FAQPage pilot (5 concepts) + `faq` frontmatter + JSON-LD branch; add `## FAQ` content
- [ ] AL-63: `/search` page (client-side Fuse.js reuse) → SearchAction
- [ ] M-9: BreadcrumbList/TechArticle on `getting-started` + `resources/*` (new PBI)
- [ ] AL-50 / AL-70: MCP protocol bump + `ping`; index staleness guard in lefthook

---

## Appendix: Notable Content Findings

| Collection | Article | Status | GEO Issue |
|---|---|---|---|
| concepts | agentic-sdlc | Live | 0 references (flagship) — H-2 |
| concepts | agent-skills | (missing `status`) | Dropped from MCP index + body H1 — H-1, L-1 |
| concepts | event-modeling | Experimental | Only article missing `relatedIds` — L-2 |
| patterns | spec-reversing | Live | No `## Definition`, no stats, no "When to Use" — L-4 |
| patterns | (16 of 18) | mixed | No "When to Use" section — L-5 |
| practices | adversarial-requirement-review | Live | Body `# H1` (pre-existing) — L-1 |
| practices | agent-personas, living-specs | Live | Correctly no HowTo (non-procedural) |
| practices | (6 of 14) | mixed | Zero references — AL-67 |
| recipes | all 3 | Live | Excluded from skill + llms.txt + md-variant — M-6 |

**Category scores:** AI Citability 74 · Content E-E-A-T 52 · Technical GEO 78 · Schema & Structured Data 82 · KB & MCP 87 · **Composite 72/100**.

*Audit method: Phase 0 live fetch (robots/sitemap/llms.txt/pages), Phase 1 codebase + MCP-manifest scan, Phase 2 five parallel category sub-agents validating against `src/` and the local `dist/` build. JSON-LD validated from source + `dist/` (WebFetch cannot see `<script>` tags).*
