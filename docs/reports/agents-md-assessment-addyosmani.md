# Content Review Report: Addy Osmani - Stop Using /init for AGENTS.md

**Source Material:** [https://addyosmani.com/blog/agents-md/](https://addyosmani.com/blog/agents-md/)
**Date Assessed:** 2026-02-24

## A. Executive Summary

*   **Verdict:** SYNTHESIZED / INTEGRATE 
*   **Confidence:** High
*   **Assessment:** The article fundamentally validates the ASDLC's existing `agents-md-spec.md` practice—even citing the same foundational ETH Zurich paper. It aligns with our core philosophy of "Minimal by Design" and "Toolchain First." However, it introduces two high-value conceptual frames that strengthen our existing practices: The **"Pink Elephant Problem"** (context anchoring) and framing `AGENTS.md` as a **Diagnostic Tool** for codebase friction rather than a permanent configuration file.

## B. Critical Analysis

*   **Incumbent Pattern:** `practices/agents-md-spec.md` and `concepts/context-engineering.md`.
*   **Challenger Input:** 
    1. The "Pink Elephant Problem" - highlighting how obsolete context creates an anchoring bias (e.g., mentioning legacy tRPC biases the agent towards it).
    2. Framing `AGENTS.md` as a "living document of friction" - if the agent makes a mistake, treat it as a codebase architecture smell first, before patching it with prose instructions.
    3. Layered Context Architecture - advocating for a routing layer rather than a monolithic file.
*   **Analysis:** The challenger input is highly aligned. We already implement the Layered Architecture via `AGENTS.md` (Protocol) and `practices/agent-personas.md` & `skills/` (Focused Context). The idea that "every line in AGENTS.md represents a codebase failure" is an excellent inversion that perfectly fits the ASDLC deterministic philosophy. Instead of telling the agent to "be careful," we should fix the structural ambiguity in the codebase.
*   **Regression Risk:** None. This reinforces our existing "Toolchain First" constraint and makes it stricter.

## C. Knowledge Graph Impact

*   **Existing Nodes Touched:**
    *   `src/content/practices/agents-md-spec.md`
    *   `src/content/concepts/context-engineering.md`
*   **New Nodes Proposed:** None required. The content fits seamlessly into existing nodes. This prevents knowledge fragmentation.

## D. Action Plan

**STRATEGY 1: INTEGRATE (Update Existing)**

1.  **Update `practices/agents-md-spec.md`:** 
    *   Add a section about the **Anchoring Effect (The Pink Elephant Problem)** under the Core Philosophy.
    *   Introduce the mindset of **"AGENTS.md as a Diagnostic Tool"**—every line added is a symptom of a codebase smell. The instruction should be to fix the code structure, not permanently expand the context file.
2.  **Update `concepts/context-engineering.md`:**
    *   Briefly reference the anchoring bias of obsolete context.

---

*End of Report.*
