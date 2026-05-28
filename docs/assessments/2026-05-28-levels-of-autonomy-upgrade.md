---
source: "Gemini Online, Levels of Autonomy Upgrade Proposal, May 28, 2026"
url: "https://gemini.google.com"
reviewer: "Antigravity (Gemini 3.5 Flash (High))"
sources_used: []
hitl_executioner: "Ville Takanen"
assessment_date: "2026-05-28"
---

# Content Review: Levels of Autonomy Upgrade Proposal

## A. Executive Summary

- **Verdict:** accepted
- **Confidence:** High
- **Assessment:** 
  The challenger proposes a substantial upgrade to `concepts/levels-of-autonomy.md`. It provides the necessary depth required by Linear issue `AL-53` by adding a detailed level-by-level breakdown with technical artifacts (JSON/YAML snippets) and real-world referents. It also places the key query phrase **"AI autonomy levels"** verbatim in the first paragraph to address the SEO gap identified by the `@curator` report.
  
  The proposed content is accepted with synthesis: we will convert the absolute placeholder URLs to local relative paths (e.g., `/patterns/context-gates`), correct the markdown table headers, and enrich the article with a custom Mermaid diagram illustrating the Context Gate shift across the five levels.

---

## B. Critical Analysis

### Incumbent Patterns (the ASDLC's current position)

The existing `concepts/levels-of-autonomy.md` covers the L1–L5 scale at a very high level with a single comparison table, but lacks detailed breakdowns, real-world examples, or technical code/spec artifacts for the levels.

| Article | What it covers |
|---|---|
| `concepts/levels-of-autonomy` | High-level taxonomy table of the L1-L5 autonomy levels and SAE vehicle standard analogy. |

### Challenger Input

The challenger provides a major expansion of the article:
- **SEO Optimization:** Verbatim placement of "AI autonomy levels" in the first paragraph.
- **Detailed Level-by-Level Breakdown:** Clear definitions, real-world referents, and engineering artifacts (code/configuration blocks) for L1 (Gemma completion payload), L2 (terminal tool spec), L3 (automated pipeline verification gate config), L4 (telemetry drift manifest), and L5 (closed-loop self-mutating loop config).
- **Refined Tables & Descriptions:** Richer descriptions of human roles and failure modes (such as "unpriced liability" and "silent drift").

### Truth Arbitration & Alignment

The challenger is perfectly aligned with the core philosophy of ASDLC:
- Reinforces **Determinism over Vibes** by showing how L3 relies on automated verification loops (Vitest, Biome) and explicit safety boundaries.
- Articulates the **Paradox of Supervision** and **Silent Drift** as the core reasons why L3 is the practical ceiling, preventing enterprise risk under L4/L5.
- Connects directly to **Intent Engineering** (references Pawel Huryn) and **On the Loop** harness engineering (references Kief Morris).

### Regression Risk Analysis

* **Loss of conciseness:** The added detail increases the article's length, but this is fully earned by the concrete engineering artifacts and examples requested by the Linear task.
* **Scientific Rigor Evaluation:**
  * **Evidence Level:** Empirical & Consensus (cites Anthropic's Claude Code telemetry paper, Thoughtworks/Fowler reports, and Stanford Law legal analyses).
  * **Boundary Conditions & Limitations:** Applies to software development contexts (SWE-agent loops).
  * **Falsifiability:** The L3 production ceiling claim is falsified if an organization demonstrates sustainable, zero-drift, zero-intervention L4/L5 development on production codebases over extended periods.
  * **Citations/Reference Map:** Incorporates references to Kief Morris, Stanford Law (Eran Kahana), Anthropic (Saffron Huang), and Pawel Huryn.

---

## C. Knowledge Graph Impact

### Existing Nodes Touched

* **`concepts/levels-of-autonomy`** — Replace the article body with the expanded text, correct markdown formatting, convert URLs to relative links, and add the Mermaid diagram.
* **`patterns/the-spec`** — Add `concepts/levels-of-autonomy` to `relatedIds` to ensure bidirectional linking.

### New Nodes Proposed

* **None** — The proposal modifies an existing concept article.

### Human Feedback Applied

* **(Pending review)** — Initial draft proposed by the agent.

---

## D. Action Plan

**Strategy:** INTEGRATE

| # | Action | Path | Type |
|---|---|---|---|
| 1 | Create content review report | `docs/assessments/2026-05-28-levels-of-autonomy-upgrade.md` | CREATE |
| 2 | Add `concepts/levels-of-autonomy` to `patterns/the-spec` relatedIds | `src/content/patterns/the-spec.md` | INTEGRATE |
| 3 | Replace body copy and add custom Mermaid diagram | `src/content/concepts/levels-of-autonomy.md` | INTEGRATE |
| 4 | Run diagram generation tool | `pnpm diagrams` | RUN |
| 5 | Run type checks, linter, and build checks | `pnpm check`, `pnpm lint`, `pnpm build` | RUN |

---

## E. Draft Content

### E.2 — Integrations

#### Changes to `src/content/patterns/the-spec.md`

Add `concepts/levels-of-autonomy` to `relatedIds` to keep links bidirectional:
```diff
relatedIds: ["patterns/the-pbi", "practices/feature-assembly", "patterns/experience-modeling", "concepts/context-engineering", "concepts/model-context-protocol", "patterns/model-routing", "concepts/behavior-driven-development", "concepts/gherkin", "concepts/mermaid", "concepts/provenance", "concepts/triple-debt-model", "concepts/levels-of-autonomy"]
```

#### Changes to `src/content/concepts/levels-of-autonomy.md`

Add `patterns/the-spec` to `relatedIds`:
```diff
relatedIds:
  - concepts/agentic-sdlc
  - concepts/guardrails
  - patterns/context-gates
  - concepts/pr-slop
  - patterns/compound-loop
+  - patterns/the-spec
```

The body is replaced with the challenger content, integrating a custom Mermaid diagram illustrating the Context Gate shifting boundary.

---

## F. Open Questions / Follow-ups

1. Verify that the pre-rendered SVG is successfully built by `pnpm diagrams` and matches the markup layout.
