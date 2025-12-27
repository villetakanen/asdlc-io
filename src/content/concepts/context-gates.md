---
title: "Context Gates"
complexity: "Medium"
status: "Proposed"
relatedIds: ["model-routing", "agentic-sdlc", "context-engineering"]
lastUpdated: 2025-12-27
---

## Definition

In the Agentic Software Development Life Cycle (ASDLC), **Context Gates** are architectural checkpoints that sit between phases of work. They serve a dual mandate: filtering the **input** context to prevent cognitive overload, and validating the **output** artifacts to ensure system integrity.

Unlike "Guardrails," which often conflate prompt engineering with hard constraints, Context Gates are distinct, structural barriers that enforce the contract between agents.

## 1. Context Filtering (The Input Gate)
*Function: Cognitive Throttle*

As an agent performs complex, multi-step tasks, it generates a massive trail of logs: observations, tool outputs, internal monologues, and errors. Feeding this entire raw history into the LLM for every subsequent decision results in "context pollution," where the signal-to-noise ratio drops, causing the model to get distracted or hallucinate.

A Context Gate acts as a decision-maker (often a secondary lightweight agent or semantic search) that determines strictly what information is relevant to the current sub-task. It filters the history to ensure the agent operates with high precision and low latency.

## 2. Validation (The Output Gate)

When an agent completes a task, the output must pass through a strict validation layer before it can be accepted into the codebase or the next phase. This layer is split into two distinct types of gates: **Quality Gates** and **Acceptance Gates**.

### Quality Gates (Deterministic)
**"Is it built correctly?"**

Quality Gates are automated, binary checks that require no human intervention. They are enforced by the toolchain (compilers, linters, tests). If a Quality Gate fails, the agent's work is instantly rejected, and the agent is often tasked with self-correction.

*   **Type:** Machine / Toolchain
*   **Nature:** Objective / Binary (Pass/Fail)
*   **Examples:**
    *   **Syntax & Type Safety:** `TypeScript` compilation, `Zod` schema validation.
    *   **Linting:** `Eslint` rules (e.g., no magic numbers, accessibility checks).
    *   **Tests:** Unit tests, E2E tests passing.
    *   **Build:** The artifact successfully builds in isolation (e.g., a Design System package).

### Acceptance Gates (Human-in-the-Loop)
**"Is it the right thing?"**

Acceptance Gates are subjective checks that require human judgment. Even if code compiles and passes tests, it might still "feel" wrong, use the wrong tone, or miss the spirit of the design. These gates ensure alignment with the product vision.

*   **Type:** Human-in-the-Loop (HITL)
*   **Nature:** Subjective / Semantic
*   **Examples:**
    *   **Tone Check:** Does the copy sound like our brand?
    *   **UX Review:** Does the interaction feel smooth? (e.g., button hover states, animation timing).
    *   **Visual QA:** Are the spacings and layout visually balanced?
    *   **Strategic Fit:** Does this feature actually solve the user's problem?

## Summary of Controls

| Feature | Context Filtering (Input) | Quality Gate (Output) | Acceptance Gate (Output) |
| :--- | :--- | :--- | :--- |
| **Goal** | Maintain reasoning capability | Prevent broken code | Prevent bad product |
| **Mechanism** | Semantic Search / Summary | Compilers / Linters / Tests | Human Review |
| **Outcome** | Clean Context Window | Valid Compilation | Approved Release |
