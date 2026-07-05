# Project Review — 2026-07-05 (Fable)

> State-of-project assessment, scenario planning, and proposed next steps.
> Inputs: repo survey (branch `dev`, v0.24.2), Linear backlog (ASDLC team), curator report 2026-06-22, last 30 commits.
> **Revised same day:** the first draft recommended a demand-side (SEO) quarter. On review against `docs/vision.md`, that recommendation inherited a measurement bias — see §2. This version corrects course toward agent- and human-UX-first priorities.

## 1. Where the project stands

**The factory is built; the question is who it serves.** asdlc.io is a mature, spec-governed knowledge base:

- **74 articles** (38 concepts, 19 patterns, 14 practices, 3 recipes) — 42 Live, 24 Experimental, 5 Draft, 1 Proposed, 1 Deprecated.
- **24 specs**, 21 approved. The 3 drafts (`markdown-variants`, `mcp-evals`, `spec-linter`) all trail *already-shipped* tooling — spec debt, not feature debt.
- **Agent-native distribution channels exist:** live MCP server (Netlify edge + Fuse index), downloadable skill, llms.txt.
- **The curation loop is operational:** GSC snapshots → pure `triage()` → dated curator reports (3 runs: 05-28, 06-11, 06-22). ADR 0001 sensibly chose snapshots over a live GSC MCP server.
- **First community contribution landed** (artifact-import pattern, PR #69) — early signal the KB can attract outside authors.

Recent commit themes: SEO/GEO structured data push, curator tooling, research-paper assessments (Red Queen Gödel Machine the newest), MCP eval harness.

## 2. The headline problem: the metric has been steering the mission

The vision (`docs/vision.md`) defines the goal as being **the definitive knowledge base for Agentic SDLC** — useful at the moment of need, for humans *and* agents. For the agent audience, that moment happens inside a context window: MCP retrieval, `.md` mirrors, llms.txt, the skill. Not on a Google results page.

But the project's only feedback loop is GSC. GSC measures human Google traffic, so the curator cadence keeps generating SEO tasks, and the backlog has optimized toward the metric that exists rather than the mission (Goodhart's law). Evidence of the drift:

- **AL-28 (markdown variants) has sat untouched since April** — four months — while ~10 SEO issues were filed and worked in the same period. The Agent Docs Scorecard it cites found agents receiving full HTML with inline CSS/JS, three pages silently truncating past 100K chars, and 10–50% boilerplate before content. That is a real user (an agent) experiencing a broken UX *today*.
- **The MCP eval harness is the thinnest instrumentation in the repo** — one fixtures file, draft spec — despite being the actual quality gate for the agent audience.
- **There is no telemetry on MCP or `.md` usage at all.** The most on-thesis audience is invisible, so it never generates backlog items.

GSC findings remain factually true (only 15 of 69 indexed articles have any impressions; 54 sit in the Discoverability bucket; `agents-md-spec` converts at 0.1% CTR). But discoverability is a lagging byproduct of being genuinely useful and citable — not a workstream to organize a quarter around.

## 3. Content quality: the finding that matters for both audiences

**~40% of the corpus is Experimental (24) or Draft (5).** This is the highest-severity content finding, and it hurts the agent consumer *more* than the human one: an agent retrieving an unfinished pattern via MCP injects low-quality context into someone's session and — unlike a human skimming a page — cannot easily judge that the material is half-baked. "Definitive knowledge base" and "40% experimental" are in direct tension.

## 4. Backlog vs. reality (drift audit)

Linear has drifted from the codebase — worth a 15-minute hygiene pass:

| Issue | Linear state | Reality |
|---|---|---|
| AL-44 `triage()` function | In Progress | Shipped — `tools/curator/` exists with tests; reports being generated |
| AL-45 curator skill + report writer | Todo | Largely shipped — `pnpm curator` produces spec-conformant reports |
| AL-38 curator Epic | Todo | Effectively done; close after AL-44/45 |
| AL-28 markdown variants | Todo since April, High | **Most on-thesis open item; promote to top of queue** |
| AL-32 homepage meta + JSON-LD (Urgent) | Todo | Partially superseded by recent JSON-LD commits — re-scope, deprioritize |
| AL-48 adversarial-code-review CTR (Urgent) | Todo | Real but small; keep as quick win, not Urgent |
| AL-34 agents-md-spec answer-engine intent | Todo | The content fix is on-thesis (a definitive answer helps agents too); the CTR framing is not |
| AL-35 pillar page (Urgent) | Todo | Valuable as a canonical definition + navigation hub; justify by KB completeness, not head-term competition |
| AL-49 trailing-slash, AL-13 grid demo | Todo, Low | Genuine small fixes |

Also: `reports/curator/2026-06-22.md` is uncommitted, and the legacy `plans/` directory is historical residue post spec-migration.

## 5. Scenarios for the next phase

### Scenario A — Demand-side quarter (rejected)

Organize 4–6 weeks around SEO: pillar page, CTR fixes, internal-link architecture, curator as scoreboard. Rejected as the organizing frame: it optimizes the audience GSC can see, doubles down on the measurement bias diagnosed in §2, and its wins (CTR points on two pages) don't compound toward "definitive KB." Individual items survive as byproducts inside the other scenarios.

### Scenario B — Agent-native experience (adopted as spine)

Make the KB excellent to consume *as an agent*:

1. **AL-28 markdown variants** — `.md` URLs + `Accept: text/markdown` content negotiation. Fixes a known-broken experience; spec already drafted.
2. **MCP eval expansion** — grow `evals/mcp/retrieval.fixtures.json` into a real retrieval-quality suite; promote the `mcp-evals` spec. This becomes the agent-side analogue of the curator loop.
3. **Agent-usage telemetry** — minimal logging on the MCP edge function and `.md` endpoints (tool calls, queries, top articles). Without this, every future review is forced to reason from GSC again.
4. **llms.txt / skill freshness check** — verify the packaged channels reflect the current corpus.

### Scenario C — Editorial consolidation (adopted, interleaved)

Graduate or prune the 29 Experimental/Draft articles. Each curator cycle reviews 3–5: promote to Live, finish, or cut. Target Experimental share < 25% by mid-August. Cheap, compounding, and it directly raises the floor on what MCP retrieval serves.

### Human UX track (folded in)

Good user flows are part of the same thesis: navigation and reading paths (concept → pattern → practice chains), index-page quality, and the small known defects (AL-13, AL-49). AL-35 earns its place here — as the canonical "what is agentic development" entry point and link hub — with any SEO benefit as a side effect.

### SEO posture going forward

Maintenance mode. Ship AL-48 and the AL-34 content fix as small quick wins (they improve the pages for *all* readers), keep the biweekly curator cadence as a passive scoreboard, and file — don't chase — new GSC findings. No new SEO epics until agent-side instrumentation exists to balance the picture.

## 6. Concrete next steps

**This week**
1. Commit `reports/curator/2026-06-22.md`.
2. Linear hygiene: close AL-44/45/38 (verify against `specs/content-curator/spec.md` first); re-scope AL-32 down; re-prioritize AL-28 to the top of the queue; strip "Urgent" from the SEO items.
3. Start AL-28: promote `specs/markdown-variants/spec.md` from draft, then implement.

**Next 2 weeks**
4. Finish AL-28 end-to-end (verify with `pnpm test:mcp-preview` and a real agent fetch).
5. Add minimal telemetry to the MCP edge function and `.md` endpoints.
6. Expand MCP eval fixtures to cover the top ~20 retrieval intents; promote the `mcp-evals` and `spec-linter` specs.
7. First editorial batch: triage 5 Experimental articles (promote / finish / cut).

**Next 4–6 weeks**
8. Editorial batches 2–3 (10 more Experimental/Draft articles resolved).
9. AL-35 pillar page as canonical definition + navigation hub; AL-48 and AL-34 content fixes as quick wins alongside.
10. Human-UX pass: reading-path links across concept→pattern→practice chains; fix AL-13, AL-49.
11. Housekeeping: archive or delete `plans/`; retire stale root-level `CONTENT-ANALYSIS-2025-12-30.md`.

## 7. Success signals (checkpoint ~2026-08-15)

**Primary (agent experience)**
- `.md` variants live for all Live content pages; no page truncates for agent consumers.
- MCP eval suite ≥ 20 intents, passing, wired into CI or a documented cadence.
- First agent-usage telemetry report exists: we can name the top 10 articles agents actually retrieve.

**Primary (content quality)**
- Experimental share of corpus < 25%; zero stale Drafts (each finished or cut).

**Secondary (passive scoreboard)**
- Curator trend continues without dedicated effort: healthy count 5 → 8+, `agents-md-spec` CTR off the floor (≥ 0.5%).
- Refresh bucket active (120d GSC history reached ~late September).
