# Content Review: Agentheim (heimeshoff/Agentheim)

**Date:** 2026-05-18
**Reviewer:** Claude (Content Critic), synthesized with Gemini 3 Flash review
**Source:** https://github.com/heimeshoff/Agentheim

## A. Executive Summary

- **Verdict:** synthesized — accept as *thought leadership* and *integration into existing nodes*; reject proposals for new standalone articles
- **Confidence:** High
- **Assessment:** Agentheim is a concrete, well-aligned Claude Code plugin that implements existing ASDLC primitives (Spec-Driven Development, Quality Gates, Generator/Judge separation, Map-Reduce sub-agents). It is a useful reference implementation, but does not introduce a new pattern that survives Evidence Check or the project's existing architectural commitments. Two reviewer proposals for new nodes were rejected after critic review.

## B. Critical Analysis

### B.1 Source overview

Agentheim packages four skills (Brainstorm, Model, Work, Research) as a Claude Code plugin. Tasks live in `.agentheim/contexts/<bc>/` directories scoped by DDD bounded contexts. Workers run in parallel under a non-generative orchestrator; a verifier agent gates every `SUCCESS` before commit. The project reports 100% vs 54.8% on an internal reference benchmark.

### B.2 Mapping to incumbent KB

| Agentheim concept | Incumbent KB node | Status |
|---|---|---|
| Brainstorm skill | `patterns/product-vision`, `practices/product-vision-authoring` | Covered |
| Model skill (tasks, deps, AC) | `patterns/the-pbi`, `patterns/the-spec`, `concepts/spec-driven-development` | Covered |
| Work skill (TDD, parallel workers) | `practices/feature-assembly`, `patterns/ralph-loop` §6 Map-Reduce, `practices/micro-commits` | Covered |
| Research skill | `concepts/context-engineering` (partial) | Partial |
| Bounded contexts under `.agentheim/contexts/<bc>/` | `patterns/context-map` (spatial flavor), DDD canon (subsystem flavor) | Covered + nomenclature collision |
| Verifier-before-commit | `patterns/adversarial-code-review`, `patterns/constitutional-review` | Covered |
| One task = one commit | `practices/micro-commits` | Directly stated |
| Non-generative orchestrator + workers | `patterns/ralph-loop` §6 Map-Reduce (Initializer + Sub-Agents) | Covered |

### B.3 Regression check

Agentheim is **not regressive** relative to ASDLC — it is structurally consistent with the framework. Risk lies in the *response*: promoting it to canonical nodes could regress the KB by node proliferation or by contradicting existing project commitments.

### B.4 Evidence check

- The "100% vs 54.8%" claim is an internal benchmark with undocumented methodology. Treat as anecdotal, not validated. Cite as: *"Agentheim reports 100% vs 54.8% on its internal reference benchmark."*
- Single-source observation. No convergent implementations cited.

## C. Knowledge Graph Impact

### C.1 Genuine collision found

`patterns/context-map.md` borrows DDD vocabulary but redirects "Context Map" to a *spatial / retrieval* meaning (high-density navigational index). Agentheim uses the term in its original DDD sense — *subsystem boundary partitioning*. Future readers will conflate the two.

**Fix:** Add a Nomenclature note inside `patterns/context-map.md` that acknowledges the DDD origin and distinguishes the spatial application.

### C.2 Existing nodes touched

- `patterns/ralph-loop.md` — §6 Map-Reduce is the natural integration point. Agentheim is a concrete implementation of Initializer + Sub-Agents.
- `patterns/context-map.md` — Nomenclature clarification.
- `src/pages/resources/further-reading.astro` — New entry for Agentheim as an implementation reference.

### C.3 Reviewer-proposed new nodes — both rejected

**Proposed:** `concepts/domain-driven-agents.md` (DDD bounded contexts as agent fleet scoping)

- **Wrong collection.** Per `specs/content-articles/spec.md` decision tree, "shape of the solution" → Pattern, not Concept.
- **Evidence Check fails.** Pattern archetype requires convergent evolution or research backing. Single source (Agentheim). DDD canon backs bounded contexts in *software systems*, not in *agent fleets*.
- **Already covered structurally.** `patterns/ralph-loop` §6 covers fleet-scoping agnostic of partitioning principle. DDD is one valid principle — a paragraph, not a pattern.
- **Decision:** Add 2–3 sentences to Ralph Loop §6 referencing Agentheim. Revisit creating a standalone pattern when a second independent implementation appears.

**Proposed:** `practices/repo-native-backlog.md` (file-backed markdown kanban under `.agentheim/contexts/`)

- **Contradicts project stance.** `CLAUDE.md` declares Linear (via MCP) as the backlog source of truth, with specs in repo. Codifying a competing in-repo backlog as a canonical Practice creates an internal contradiction.
- **Not novel.** File-based markdown kanban predates Agentheim (backlog.md, taskfiles). Agentheim's contribution is bounded-context scoping, not markdown backlogs.
- **No Pattern→Practice gap.** `patterns/the-pbi` + `practices/pbi-authoring` already cover the structural unit and authoring.
- **Decision:** Reject. No supplementary edit to `pbi-authoring` either (per user direction).

## D. Action Plan

| # | Action | Location | Status |
|---|---|---|---|
| 1 | Add Agentheim entry as implementation reference | `src/pages/resources/further-reading.astro` | Approved, pending implementation |
| 2 | Add "Industry Implementation" pointer to Agentheim | `patterns/ralph-loop.md` §6 Map-Reduce | Approved, pending implementation |
| 3 | Add DDD nomenclature clarification | `patterns/context-map.md` (top of pattern body) | Approved, pending implementation |
| 4 | Create `concepts/domain-driven-agents.md` | — | **Rejected** |
| 5 | Create `practices/repo-native-backlog.md` | — | **Rejected** |
| 6 | Backend-agnostic note in `pbi-authoring` | — | **Skipped** (user direction) |

## E. Synthesis Notes (Gemini 3 Flash review × Claude critic)

**Where the reviews converged:**

- Agentheim is high-quality and structurally aligned with ASDLC — not regressive.
- A nomenclature collision exists around "Context Map" (DDD subsystem boundary vs ASDLC spatial index).
- Agentheim warrants visibility in the KB as a reference implementation.

**Where the critic diverged from the initial SYNTHESIZED proposal:**

| Gemini 3 Flash proposed | Critic ruling | Reason |
|---|---|---|
| New `concepts/domain-driven-agents.md` | Reject; integrate into Ralph Loop §6 | Single-source evidence; wrong collection (Concept vs Pattern); node proliferation when integration suffices |
| New `practices/repo-native-backlog.md` | Reject | Contradicts `CLAUDE.md` Linear-as-SoT stance; not novel; no Pattern→Practice gap |
| "Excellent industrial validation" framing of the 100% vs 54.8% claim | Downgrade to "internal benchmark, methodology undocumented" | Evidence Check — anecdotal, not validated |
| Nomenclature → new concept node | Nomenclature → in-place note in existing pattern | Cheapest correct fix avoids future article-pair confusion |

**The Prime Directive ruling:** The KB is the Incumbent Truth. Agentheim has not produced superior evidence sufficient to displace existing nodes or to introduce new canonical nodes. It is a valid implementation reference and a useful adversarial check on our nomenclature — and that is the full extent of its KB impact today.
