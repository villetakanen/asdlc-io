# Content Review Report: Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl by Birgitta Böckeler

## A. Executive Summary
*   **Verdict:** SYNTHESIZED
*   **Confidence:** High
*   **Assessment:** The article provides foundational vocabulary for the maturity of Spec-Driven Development (SDD): `spec-first`, `spec-anchored`, and `spec-as-source`. Crucially, it highlights the risks of `spec-as-source` by comparing it to the failed Model-Driven Development (MDD) paradigms of the past—a warning that perfectly aligns with ASDLC's "Determinism over Vibes" philosophy.

## B. Critical Analysis
*   **Incumbent Pattern:** `concepts/spec-driven-development.md` and `practices/living-specs.md`
*   **Challenger Input:** Birgitta Böckeler's article defines 3 levels of SDD and distinguishes between "Memory Banks" (global context) and "Specs" (feature context). It warns that pushing SDD too far towards "spec-as-source" (where humans only edit specs and code is 100% generated) risks repeating the mistakes of MDD (inflexibility) combined with LLM flaws (non-determinism).
*   **Analysis:**
    *   **Vocabulary:** The terms `spec-first` and `spec-anchored` are excellent descriptors. In ASDLC, our `Living Specs` practice represents the ideal `spec-anchored` state.
    *   **Anti-Pattern Alignment:** The article's critique of `spec-as-source` perfectly validates our stance. We do not want 100% code generation from specs; we want specs to act as architectural guardrails and quality contracts (BDD), while deterministic code handles logic. "Spec-as-source" is a regression risk to MDD.
    *   **Context Scope:** The article's distinction between "Memory Banks" (global) and Specs (feature-level) maps exactly to our `ARCHITECTURE.md` vs `/plans/*/spec.md` structure in `living-specs.md`.
*   **Regression Risk:** None. The article provides the exact vocabulary needed to defend our approach against naive "100% generated" hype.

## C. Knowledge Graph Impact
*   **Existing Nodes Touched:** 
    *   `src/content/concepts/spec-driven-development.md`
    *   `src/content/patterns/the-spec.md`
    *   `src/content/practices/living-specs.md`
*   **New Nodes Proposed:** None required, but existing nodes need reinforcement based on these insights.

## D. Action Plan

**STRATEGY 1: INTEGRATE & SYNTHESIZE (Update Existing)**

1.  **Update `concepts/spec-driven-development.md`:**
    *   Add Birgitta's article to the `references` array.
    *   Formally introduce the 3 maturity levels: `spec-first` (Task level), `spec-anchored` (Feature lifecycle - ASDLC's target), and `spec-as-source` (Code generation - Anti-pattern).
    *   Add an **Anti-Pattern warning** for `spec-as-source`, referencing Birgitta's comparison to Model-Driven Development (MDD) failures (inflexibility + non-determinism).

2.  **Update `practices/living-specs.md`:**
    *   Under "File Structure" or "Introduction", explicitly adopt Birgitta's terminology to clarify that `Living Specs` are the implementation of the `spec-anchored` level.
    *   Strengthen the distinction between `ARCHITECTURE.md` (which Birgitta calls the "Memory Bank" or "Constitution") and `/plans/*/spec.md` (the functional spec).

3.  **Update `patterns/the-spec.md`:**
    *   Add a reference to this article.
    *   Clarify that The Spec pattern is designed to be `spec-anchored`, explicitly rejecting the pure `spec-as-source` paradigm to maintain determinism.
