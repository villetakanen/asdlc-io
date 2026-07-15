---
name: assess
description: Run a content engineering review on a prompt or URL against the ASDLC Knowledge Base. Activate the Content Critic to assess new content for consistency, non-duplication, and structural soundness.
---

# Content Engineering Review Workflow

This workflow activates the **Content Critic** (a subset of Content Engineer) to critically assess new content against the existing ASDLC Knowledge Base.

**The Prime Directive:**
> **Burden of Proof:** The Knowledge Base is the Incumbent Truth. New content must *prove* it is better, more accurate, or more useful than what exists. We do not regress to the mean by accepting every new article as fact.

It ensures that new additions are consistent, non-duplicative, and structurally sound.

## Prerequisites

- **Input:** A raw prompt, text snippet, or URL acting as the "Source Material".
- **Goal:** Produce a `Content Review Report` that recommends amendments, synthesis, new content creation, or references.

## Workflow Steps

### 1. Context Loading (The Sensor Network)

The agent must first "load" the relevant context from the ASDLC Knowledge Base to establish a baseline.

1.  **Analyze the Input:**
    *   Identify key themes and concepts in the source material.
    *   *Example:* If input is about "AI Agents testing code", keywords are `testing`, `verification`, `agents`, `code review`.

    *   *Action:* Use `find_by_name` or `grep_search` in `src/content/` to identify relevant existing files.

2.  **Retrieve Context from Source:**
    *   Use `view_file` to read the content of relevant files found in step 1.
    *   **Note:** Since we are inside the `asdlc-io` repo, use filesystem tools (`find_by_name`, `grep_search`, `view_file`) instead of MCP calls. We have direct access to the `src/content` source of truth.

3.  **Check Foundational Alignment:**
    *   Read the core defining documents of the project to ensure philosophical alignment.
    *   *Critical:* Always check `src/content/concepts/agentic-sdlc.md` and `src/content/patterns/agentic-double-diamond.md`.
    *   *Also Check:* `AGENTS.md` for role definitions.

4.  **Load Content Specs:**
    *   Read the relevant spec files to ensure any proposed content adheres to the "Shape" of the Knowledge Base.
    *   *Files:*
        *   `specs/content-articles/concept.md` (Definitions)
        *   `specs/content-articles/pattern.md` (Structures)
        *   `specs/content-articles/practice.md` (Operations)
    *   *Goal:* Verify if the source material fits a Pattern (Shape), Practice (Steps), or Concept (Idea).

5.  **Load Assessor Memory:**
    *   Read [lessons.md](file:///Users/ville.takanen/dev/asdlc-io/docs/assessments/lessons.md). Keep these heuristics and lessons from past retrospectives in mind when performing the adversarial assessment.
    *   **Also scan the ledger for recurring pivots:** Read [ledger.jsonl](file:///Users/ville.takanen/dev/asdlc-io/docs/assessments/ledger.jsonl) and inspect the `hitl_pivots` and `lessons_learned` fields across entries. If a correction has occurred **two or more times** but is not yet reflected in `lessons.md`, treat it as a live heuristic for *this* assessment and flag it for promotion in Step 5.F. (The canonical example: agents reject a standalone article for a named seminal framework, then HITL overrides — now captured as Lesson #6.)

### 2. Adversarial Assessment (The Gatekeeper)

Before accepting the content, we must stress-test it against our current maturity and scientific writing standards.

1.  **Regression Check:**
    *   Does this input propose a simpler/naive solution that we have already evolved past?
    *   *Example:* Article suggests "Just use Context", we already have "Context Gates".
    *   *Verdict:* **REGRESSIVE**. Reject or frame as "Basic Level".

2.  **Evidence & Telemetry Check:**
    *   Is this opinion or empirical fact?
    *   *Action:* Distinguish "Subjective Best Practice" from "Objective Benchmark". Check if the input cites empirical research, papers, or telemetry data.
    *   *Note:* If the content is "thought leadership" or opinion but highly aligned philosophically with ASDLC, consider recommending it for the **Further Reading** log rather than rejecting it.

3.  **Scientific Writing & Rigor Check:**
    *   *Tone:* Is the writing objective, factual, and free of marketing fluff or anthropomorphic language?
    *   *Falsifiability:* Is the concept formulated in a way that can be tested and disproved? What are the failure modes?
    *   *Boundary Conditions:* Does the input explicitly document constraints, prerequisites, and scenarios where it *fails* or does not apply?
    *   *Semantic Precision:* Are technical terms defined precisely and integrated with sibling nodes in the knowledge graph?
    *   *Evaluator Evolution:* If the input proposes self-improvement, learned evaluators, mutable judges, or non-stationary utilities, explicitly identify what remains frozen inside the evaluation epoch, what may change at promotion boundaries, and what independent anchor prevents circular validation.

4.  **Context Match:**
    *   Does this apply to our specific constraints (Agentic, High-Maturity, Industrial)?
    *   *Verdict:* **MISMATCH**. Reject if it solves a problem we don't have.

5.  **Truth Arbitration:**
    *   In case of conflict, the Knowledge Base is the **Incumbent**.
    *   The Input must provide **Superior Evidence** to displace existing patterns.
    *   *If Conflict:* Highlight it. Do not overwrite without explicit "Supersedes" decision.

### 3. Gap Analysis (The Difference Engine)

Compare the "Source Material" against the "Loaded Context".

1.  **Duplicate Check:**
    *   Does this concept already exist? (e.g., "AI Code Checking" vs `patterns/adversarial-code-review`).
    *   *If YES:* Recommendation is **AMEND** or **REFERENCE**. Do not create a new article.
    *   *SEO & Taxonomy Exception:* A new concept article is justified despite conceptual overlap if it represents a major industry category designation or high-volume search term (e.g., "Harness Engineering") that requires a dedicated SEO landing page and taxonomic anchor. Keep them distinct by letting the concept explain the *what and why* (definition/discipline) and the practice explain the *how* (execution steps).
    *   *Canonical Research Term Exception:* A new concept article may also be justified when the source introduces a named framework likely to become a reusable research or industry reference, even if it overlaps existing patterns. Require an explicit HITL or editorial rationale, and keep the page definitional: the concept explains the term; incumbent patterns explain ASDLC implementation.

2.  **Conflict Check:**
    *   Does the source material contradict established ASDLC principles (e.g., "Vibe Coding" vs "Determinism")?
    *   *If YES:* Default to **REJECT**. Only recommend **SYNTHESIS** if the input offers a superior dialectic execution.

    *   *Hard-Harness Reconciliation:* For sources that mutate evaluators, judges, tools, sandboxes, or success criteria, do not accept the mutation as normal online autonomy. Synthesis requires a governed boundary: frozen in-epoch contracts, deterministic or human-governed promotion, independent ground-truth anchors, and regression checks against unrelated holdouts.

3.  **Missing Link Check:**
    *   Does the source fill a known gap? (e.g., "How to write a PBI" when we only have "The PBI" pattern).
    *   *If YES:* Recommendation is **CREATE NEW PRACTICE**.

### 4. Human-in-the-Loop Review (The Feedback Loop)

**Critical:** Before finalizing the report, the agent MUST pause and present the proposed Action Plan and Knowledge Graph Impact to the human user for review.

1.  **Draft Presentation:**
    *   Present the findings (Verdict, Nodes Touched, Action Plan) to the user using `notify_user` or directly in chat.
    *   *Prompt the User:* "Do you agree with this assessment? Are there other nodes in the knowledge graph we should touch?"

2.  **Incorporate Feedback:**
    *   Amend the Action Plan based on the user's feedback (e.g., if the user suggests an additional article to update, add it to Strategy 1).
    *   *Attribution:* Explicitly label any additions born from this discussion as "Added following human review" to maintain accountability and trace provenance.
    *   *Disagreement Preservation:* If multiple assessors or drafts disagree, record the disagreement and the HITL rationale rather than flattening it into a single agent verdict. This is especially important when the user overrides a duplicate-check rejection to create a taxonomy anchor.

### 5. Synthesis & Recommendation (The Output)

Generate a `Content Review Report` following the standardized structure defined in the external template:
- **Template Source:** [docs/assessments/TEMPLATE.md](file:///Users/ville.takanen/dev/asdlc-io/docs/assessments/TEMPLATE.md)

The generated report must begin with a YAML frontmatter block containing metadata:
*   `source`: [Author / Institution], Title, Platform / Publisher, Date
*   `url`: Source URL
*   `reviewer`: Agent Name and Model Name
*   `sources_used`: List of other draft assessments/sources roped in (e.g. Codex/Opus takes)
*   `hitl_executioner`: Ville Takanen (or the active human reviewer)
*   `assessment_date`: YYYY-MM-DD

The template sections cover:
*   **Section A:** Executive Summary (Verdict, Confidence, Assessment)
*   **Section B:** Critical Analysis (Incumbent Patterns, Challenger Input, Truth Arbitration & Alignment, Regression & Rigor Risk Analysis)
*   **Section C:** Knowledge Graph Impact (Existing Nodes, New Nodes, HITL feedback applied)
*   **Section D:** Action Plan (Integrated/Expanded/Combined/Rejected strategies)
*   **Section E:** Draft Content (stubs and integrations)
*   **Section F:** Open Questions / Follow-ups

#### F. Assessor Learning Ledger Update
*   Append a new JSON line to [ledger.jsonl](file:///Users/ville.takanen/dev/asdlc-io/docs/assessments/ledger.jsonl) containing the assessment's metadata. The line must follow this schema:
    ```json
    {"timestamp":"YYYY-MM-DDTHH:MM:SSZ","id":"YYYY-MM-DD-slug","challenger":"Source Title (Author)","initial_verdict":"[accepted|rejected|synthesized|disputed]","hitl_pivots":["Pivot 1", "Pivot 2"],"final_verdict":"[accepted|rejected|synthesized|disputed]","execution_status":"success","execution_retro":"","lessons_learned":""}
    ```

#### G. Promote Recurring Lessons (Close the Loop)
*   The ledger is a write-only log; it is **not** loaded during future assessments — only `lessons.md` is (Step 1.5). A lesson left in the ledger is a lesson the assessor will not see again, which is how the same correction recurs across assessments.
*   After writing the ledger line, evaluate whether this assessment's `lessons_learned` or any `hitl_pivots` represents a **generalizable** heuristic (applies beyond this one source) **or recurs** with a pattern already flagged in Step 1.5. If so, propose a one-line addition or amendment to [lessons.md](file:///Users/ville.takanen/dev/asdlc-io/docs/assessments/lessons.md) — gated by the human reviewer, in keeping with the [Compound Loop](/patterns/compound-loop) (discrimination at the gate, writeback to the loaded substrate). Source-specific or one-off lessons stay in the ledger only.

## Usage Example

```bash
/skill:assess-content "Assess this article: https://example.com/ai-testing-patterns"
```
