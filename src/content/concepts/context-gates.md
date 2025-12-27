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

## 1. Input Gates (Context Filtering)

Input gates control what context enters an agent session to prevent cognitive overload and context pollution.

### Summary Gates (Session Handoffs)
*Function: Cross-Session Context Transfer*

When transitioning work from one agent session to another, Summary Gates compress the relevant context into a condensed form. Instead of passing the entire conversation history (observations, tool outputs, internal monologues, errors), a summary captures only the essential state.

*   **Type:** LLM-Assisted Summarization
*   **Nature:** Compression / Filtering
*   **Examples:**
    *   Extracting key decisions from a design session before implementation
    *   Compressing a bug investigation into "root cause + attempted fixes"
    *   Distilling a long code review into actionable feedback list
*   **Outcome:** Clean handoff between sessions without context overflow

### Context Filtering (Within-Session)
*Function: Cognitive Throttle*

During complex, multi-step tasks within a single session, agents generate massive logs. Feeding the entire history to every subsequent decision results in "context pollution" where signal-to-noise ratio drops.

Context Filtering (often via semantic search or a lightweight agent) determines what information is relevant to the current sub-task, ensuring high precision and low latency.

## 2. Validation (The Output Gate)

When an agent completes a task, the output must pass through a strict validation layer before it can be accepted into the codebase or the next phase. This layer consists of three distinct gate types: **Quality Gates**, **Review Gates**, and **Acceptance Gates**.

### Quality Gates (Deterministic)
**"Does it compile and pass tests?"**

Quality Gates are automated, binary checks that require no human intervention. They are enforced by the toolchain (compilers, linters, tests). If a Quality Gate fails, the agent's work is instantly rejected, and the agent is often tasked with self-correction.

*   **Type:** Machine / Toolchain
*   **Nature:** Deterministic / Binary (Pass/Fail)
*   **Examples:**
    *   **Syntax & Type Safety:** TypeScript compilation, Zod schema validation
    *   **Linting:** ESLint rules (no magic numbers, accessibility checks)
    *   **Tests:** Unit tests, E2E tests passing
    *   **Build:** The artifact successfully builds in isolation

### Review Gates (Probabilistic, Adversarial)
**"Does it satisfy the Spec's contracts?"**

Review Gates use secondary AI sessions (ideally different model classes) to validate semantic correctness, spec compliance, and architectural consistency. These are probabilistic checks that catch issues automated tooling misses but that don't require human strategic judgment.

*   **Type:** LLM-Assisted Critique
*   **Nature:** Probabilistic / Adversarial
*   **Examples:**
    *   **Spec Compliance:** Does code implement all requirements from the Spec?
    *   **Anti-Pattern Detection:** Does code violate architectural constraints documented in the Spec?
    *   **Edge Case Coverage:** Are error paths, race conditions, and failure modes handled?
    *   **Security Review:** Are there injection vulnerabilities, auth bypasses, or privilege escalations?
*   **Pattern:** [Adversarial Code Review](/patterns/adversarial-code-review)

### Acceptance Gates (Human-in-the-Loop)
**"Is it the right thing?"**

Acceptance Gates are subjective checks that require human judgment. Even if code passes Quality and Review Gates, it might still miss strategic fit or product vision alignment. These gates ensure the solution solves the actual user problem.

*   **Type:** Human-in-the-Loop (HITL)
*   **Nature:** Subjective / Strategic
*   **Examples:**
    *   **Tone Check:** Does the copy sound like our brand?
    *   **UX Review:** Does the interaction feel smooth?
    *   **Visual QA:** Are the spacings and layout visually balanced?
    *   **Strategic Fit:** Does this feature actually solve the user's problem?

## Summary of Controls

| Feature | Summary Gates (Input) | Context Filtering (Input) | Quality Gates (Output) | Review Gates (Output) | Acceptance Gates (Output) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Function** | Session handoff | Within-session filtering | Code validity | Spec compliance | Strategic fit |
| **Goal** | Clean session transfer | Maintain focus | Prevent broken code | Enforce contracts | Prevent bad product |
| **Mechanism** | LLM Summarization | Semantic Search | Compilers / Tests | LLM Critique | Human Review |
| **Nature** | Compression | Filtering | Deterministic | Probabilistic | Subjective |
| **Outcome** | Condensed context | Clean context window | Valid compilation | Spec compliance | Approved release |
