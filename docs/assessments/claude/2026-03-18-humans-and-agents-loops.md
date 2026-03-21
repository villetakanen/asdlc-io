# Content Review Report: Humans and Agents in Software Engineering Loops

**Source:** [Humans and Agents in Software Engineering Loops](https://martinfowler.com/articles/exploring-gen-ai/humans-and-agents.html)
**Author:** Kief Morris (Thoughtworks)
**Published:** 2026-03-04
**Assessed:** 2026-03-18
**Assessor:** Claude Opus 4.6 (with Gemini 2.5 Pro cross-validation)
**Reviewer:** @ville.takanen

## A. Executive Summary

* **Verdict:** Accepted (Authoritative Validation)
* **Confidence:** High
* **Assessment:** Kief Morris presents a three-loop taxonomy (Outside / In / On the Loop) for human-agent collaboration, landing on "Humans On the Loop" as the recommended approach. This maps directly to ASDLC's L3 Conditional Autonomy. The article's "Harness Engineering" concept validates our core pattern: the human's role shifts from reviewing artifacts to engineering the system (Specs, Gates, Constitution) that governs the agent. Crucially, the article includes a direct footnote reference to the Ralph Loop, signaling that ASDLC's conceptual vocabulary is entering mainstream Thoughtworks/Fowler discourse.

### Cross-Validation: Gemini 2.5 Pro

* **Full convergence.** Both assessments reached the same verdict (authoritative validation), the same three target nodes, and the same strategy (INTEGRATE as reference). No divergence on action plan.
* Gemini additionally characterized the Ralph Loop citation as evidence of ASDLC concepts entering mainstream discourse — agreed and reflected in this report.

### Human Review (@ville.takanen)

Approved via synthesis of Claude + Gemini assessments.

## B. Critical Analysis

* **Incumbent Patterns:** `concepts/levels-of-autonomy` (L3 as ceiling), `patterns/ralph-loop` (agent execution), `concepts/vibe-coding` (the "outside the loop" failure mode), `patterns/constitutional-review` (harness governance)
* **Challenger Input:** Three-Loop Taxonomy, Harness Engineering, Agentic Flywheel
* **Analysis:** The Challenger is an authoritative validation of the Incumbent. Morris arrives at identical conclusions through different reasoning paths. No new technical patterns, but valuable pedagogical framing (the three-loop model) and significant citability (Fowler's platform carries enormous industry weight).

**Concept mapping:**

| Morris (2026) | ASDLC Incumbent |
|---|---|
| Humans Outside the Loop | Vibe Coding / L5 aspiration |
| Humans In the Loop | L2 Task-Based (manual review bottleneck) |
| Humans On the Loop | L3 Conditional Autonomy |
| Harness Engineering | Specs + Agent Constitution + Context Gates |
| Agentic Flywheel | Agent Optimization Loop |
| Why Loop / How Loop | Product iteration vs Ralph Loop execution |
| Ralph Loop (footnote) | Direct citation of Huntley's formulation |

* **Regression Risk:** None. Article explicitly critiques both "vibe coding" and manual review bottlenecks.

## C. Knowledge Graph Impact

* **Existing Nodes Touched:**
  - `concepts/levels-of-autonomy.md` — add reference (three-loop model as complementary L3 framing)
  - `patterns/ralph-loop.md` — add reference (direct citation)
  - `concepts/vibe-coding.md` — add reference ("outside the loop" critique)
* **New Nodes Proposed:** None. All concepts fully covered by existing articles.
* **Human Feedback Applied:** Approved merged Claude+Gemini assessment.

## D. Action Plan

**STRATEGY 1: INTEGRATE (Update Existing)**

1. **`concepts/levels-of-autonomy.md`** — Add Morris article to `references`.
   - Annotation: Authoritative Fowler/Thoughtworks validation that "On the Loop" harness engineering is the recommended governance model, mapping directly to L3 Conditional Autonomy.

2. **`patterns/ralph-loop.md`** — Add Morris article to `references`.
   - Annotation: Direct citation of the Ralph Loop in Morris's framework for agent execution patterns on martinfowler.com.

3. **`concepts/vibe-coding.md`** — Add Morris article to `references`.
   - Annotation: Morris's "Humans Outside the Loop" critique validates the ASDLC position that unstructured agent delegation creates technical debt.
