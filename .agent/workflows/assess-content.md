---
description: "Run a content engineering review on a prompt or URL against the ASDLC Knowledge Base."
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
        *   `plans/content-articles/concept-spec.md` (Definitions)
        *   `plans/content-articles/pattern-spec.md` (Structures)
        *   `plans/content-articles/practice-spec.md` (Operations)
    *   *Goal:* Verify if the source material fits a Pattern (Shape), Practice (Steps), or Concept (Idea).

### 2. Adversarial Assessment (The Gatekeeper)

Before accepting the content, we must stress-test it against our current maturity.

1.  **Regression Check:**
    *   Does this input propose a simpler/naive solution that we have already evolved past?
    *   *Example:* Article suggests "Just use Context", we already have "Context Gates".
    *   *Verdict:* **REGRESSIVE**. Reject or frame as "Basic Level".

2.  **Evidence Check:**
    *   Is this opinion or empirical fact?
    *   *Action:* Distinguish "Subjective Best Practice" from "Objective Benchmark".

3.  **Context Match:**
    *   Does this apply to our specific constraints (Agentic, High-Maturity, Industrial)?
    *   *Verdict:* **MISMATCH**. Reject if it solves a problem we don't have.

4.  **Truth Arbitration:**
    *   In case of conflict, the Knowledge Base is the **Incumbent**.
    *   The Input must provide **Superior Evidence** to displace existing patterns.
    *   *If Conflict:* Highlight it. Do not overwrite without explicit "Supersedes" decision.

### 3. Gap Analysis (The Difference Engine)

Compare the "Source Material" against the "Loaded Context".

1.  **Duplicate Check:**
    *   Does this concept already exist? (e.g., "AI Code Checking" vs `patterns/adversarial-code-review`).
    *   *If YES:* Recommendation is **AMEND** or **REFERENCE**. Do not create a new article.

2.  **Conflict Check:**
    *   Does the source material contradict established ASDLC principles (e.g., "Vibe Coding" vs "Determinism")?
    *   *If YES:* Default to **REJECT**. Only recommend **SYNTHESIS** if the input offers a superior dialectic execution.

3.  **Missing Link Check:**
    *   Does the source fill a known gap? (e.g., "How to write a PBI" when we only have "The PBI" pattern).
    *   *If YES:* Recommendation is **CREATE NEW PRACTICE**.

### 4. Synthesis & Recommendation (The Output)

Generate a `Content Review Report` with the following sections:

#### A. Executive Summary
*   **Verdict:** [accepted | rejected | synthesized | disputed]
*   **Confidence:** [High/Medium/Low]
*   **Assessment:** Brief summary of value vs risk.

#### B. Critical Analysis (New)
*   **Incumbent Pattern:** [Existing Pattern Name]
*   **Challenger Input:** [New Idea]
*   **Analysis:** Why the Challenger is better/worse/different.
*   **Regression Risk:** Is this a step backward?

#### B. Knowledge Graph Impact
*   **Existing Nodes Touched:** List of articles that relate to this content.
*   **New Nodes Proposed:** List of potential new Articles (Concepts/Patterns/Practices).

#### C. Action Plan
Select the best strategy or combination of strategies:

*   **STRATEGY 1: INTEGRATE (Update Existing)**
    *   "Update `patterns/X.md` to include..."
    *   "Add reference to `concepts/Y.md`..."

*   **STRATEGY 2: EXPAND (Create New)**
    *   "Create `practices/Z.md` following `plans/content-articles/practice-spec.md`."
    *   *Justification:* Why this warrants a standalone file.

*   **STRATEGY 3: COMBINATION (Create + Integrate)**
    *   "Create `concepts/A.md` AND update `patterns/B.md` to link to it."
    *   *Note:* Often creating a new node requires updating neighbors to link to it.

*   **STRATEGY 4: REJECT / ARCHIVE**
    *   "Content is redundant with `patterns/A.md`. No action needed."

#### D. draft-content.md (Optional)
If a new article is recommended, provide a **stub** following the appropriate Spec (Concept/Pattern/Practice) including:
*   Title & Description
*   Frontmatter (Tags, Status)
*   Definition
*   Placement in `src/content/...`

## Usage Example

```bash
# User provides a URL or text
"Assess this article: https://example.com/ai-testing-patterns"

# Agent runs workflow:
1. Search KB for "testing", "patterns"
2. Reads "adversarial-code-review.md"
3. Compares input to existing pattern
4. Generates Report: "This article introduces 'Fuzz Testing by Agents'. Recommendation: 
   - Create `practices/agentic-fuzzing.md`
   - Update `patterns/adversarial-code-review.md` to link to it as a specialized practice."
```
