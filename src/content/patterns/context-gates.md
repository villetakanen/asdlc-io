---
title: "Context Gates"
description: "Architectural checkpoints that filter input context and validate output artifacts between phases of work to prevent cognitive overload and ensure system integrity."
tags: ["Architecture", "Quality Gates", "Context Engineering", "Validation"]
status: "Experimental"
relatedIds: ["patterns/model-routing", "concepts/agentic-sdlc", "concepts/context-engineering", "patterns/adversarial-code-review", "patterns/constitutional-review"]
lastUpdated: 2026-01-08
---

## Definition

**Context Gates** are architectural checkpoints that sit between phases of agentic work. They serve a dual mandate: filtering the **input** context to prevent cognitive overload, and validating the **output** artifacts to ensure system integrity.

Unlike "Guardrails," which conflate prompt engineering with hard constraints, Context Gates are distinct, structural barriers that enforce contracts between agent sessions and phases.

## The Problem: Context Pollution and Unvalidated Outputs

Without architectural checkpoints, agentic systems suffer from two critical failures:

**Context Pollution** — Agents accumulate massive conversation histories (observations, tool outputs, internal monologues, errors). When transitioning between sessions or tasks, feeding the entire context creates cognitive overload. Signal-to-noise ratio drops, and agents lose focus on the current objective.

**Unvalidated Outputs** — Code that passes automated tests can still violate semantic contracts (spec requirements, architectural constraints, security policies). Without probabilistic validation layers, implementation shortcuts and silent failures slip through to production.

**Why Existing Approaches Fail:**
- **Single-pass validation** (tests only) misses semantic violations
- **No context compression** between sessions creates confusion
- **Flat quality gates** don't distinguish deterministic checks from probabilistic review

## The Solution: Dual-Mandate Checkpoint Architecture

Context Gates solve this by creating **two distinct checkpoint types**:

**Input Gates** — Filter and compress context *entering* an agent session, ensuring only relevant information is presented. This prevents cognitive overload and maintains task focus.

**Output Gates** — Validate artifacts *leaving* an agent session through three tiers of verification: deterministic checks, probabilistic review, and human acceptance.

The key insight: **Context must be controlled at the boundaries**, not throughout execution. Agents work freely within their session, but transitions enforce strict contracts.

## Anatomy

Context Gates consist of two primary structures, each with distinct sub-components:

### Input Gates

Input Gates control what context enters an agent session.

#### Summary Gates (Cross-Session Transfer)
When transitioning work between agent sessions, Summary Gates compress conversation history into essential state.

- **Type:** LLM-Assisted Summarization
- **Nature:** Compression / Filtering
- **Function:** Extract key decisions, discard intermediate reasoning
- **Outcome:** Clean handoff without context overflow

**Examples:**
- Design session → Implementation: Extract design decisions, discard exploration paths
- Bug investigation → Fix: Compress to "root cause + attempted fixes"
- Code review → Revision: Distill to actionable feedback list

#### Context Filtering (Within-Session)
During multi-step tasks within a single session, Context Filtering determines what historical information is relevant to the current sub-task.

- **Type:** Semantic Search / Lightweight Agent
- **Nature:** Relevance Filtering
- **Function:** High signal-to-noise ratio for current decision
- **Outcome:** Precision and low latency

### Output Gates

Output Gates validate artifacts before they progress to the next phase. Three tiers enforce different types of correctness:

#### Quality Gates (Deterministic)
Binary, automated checks enforced by the toolchain.

- **Type:** Machine / Toolchain
- **Nature:** Deterministic (Pass/Fail)
- **Question:** "Does it compile and pass tests?"
- **Enforcement:** Instant rejection if failed; often triggers self-correction

**Examples:**
- Syntax & type safety (TypeScript compilation, Zod validation)
- Linting rules (ESLint, accessibility checks)
- Unit/E2E test passage
- Build artifact generation

#### Review Gates (Probabilistic, Adversarial)
LLM-assisted validation of semantic correctness and contract compliance.

- **Type:** Secondary AI Session (Critic Agent)
- **Nature:** Probabilistic / Adversarial
- **Question:** "Does it satisfy the Spec's contracts?"
- **Implementation:** [Adversarial Code Review](/patterns/adversarial-code-review), [Constitutional Review](/patterns/constitutional-review)

**Examples:**
- Spec compliance (all requirements implemented)
- Anti-pattern detection (architectural constraint violations)
- Edge case coverage (error paths, race conditions)
- Security review (injection vulnerabilities, auth bypasses)

**Output Format:**
When violations are detected, Review Gates provide actionable feedback:

1. **Violation Description** — What contract was broken
2. **Impact Analysis** — Why this matters (performance, security, maintainability)
3. **Remediation Path** — Ordered list of fixes (prefer standard patterns, escalate if needed)
4. **Test Requirements** — What tests would prevent regression

This transforms Review Gates from "reject" mechanisms into "guide to resolution" checkpoints.

#### Acceptance Gates (Human-in-the-Loop)
Subjective checks requiring human strategic judgment.

- **Type:** Human Review (HITL)
- **Nature:** Subjective / Strategic
- **Question:** "Is it the right thing?"
- **Purpose:** Ensure solution solves actual user problem and aligns with product vision

**Examples:**
- Brand tone check (does copy sound like us?)
- UX review (does interaction feel smooth?)
- Visual QA (are spacings and layout visually balanced?)
- Strategic fit (does this feature solve the user's problem?)

## Gate Taxonomy

| Feature | Summary Gates (Input) | Context Filtering (Input) | Quality Gates (Output) | Review Gates (Output) | Acceptance Gates (Output) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Function** | Session handoff | Within-session filtering | Code validity | Spec compliance | Strategic fit |
| **Goal** | Clean session transfer | Maintain focus | Prevent broken code | Enforce contracts | Prevent bad product |
| **Mechanism** | LLM Summarization | Semantic Search | Compilers / Tests | LLM Critique | Human Review |
| **Nature** | Compression | Filtering | Deterministic | Probabilistic | Subjective |
| **Outcome** | Condensed context | Clean context window | Valid compilation | Spec compliance | Approved release |

## Relationship to Other Patterns

**[Adversarial Code Review](/patterns/adversarial-code-review)** — Implements the Review Gate tier of Output Gates. Uses a Critic Agent to validate code against the Spec's contracts.

**[Constitutional Review](/patterns/constitutional-review)** — Extends Review Gates by validating against both the Spec (functional) and the Agent Constitution (architectural values).

**[Model Routing](/patterns/model-routing)** — Works with Context Gates to assign appropriate model capabilities to different gate types (throughput models for generation, reasoning models for Review Gates).

**[The Spec](/patterns/the-spec)** — Provides the contract that Review Gates validate against.

**[Agent Constitution](/patterns/agent-constitution)** — Provides architectural constraints that Constitutional Review validates against.

## Implementing Practices

This pattern is implemented by:

- **[Feature Assembly](/practices/feature-assembly)** — Uses all three Output Gates (Quality, Review, Acceptance) in the verification pipeline
- **[Adversarial Code Review](/patterns/adversarial-code-review)** — Implements Review Gates using Critic Agents
- **Context Handoff Practice** (TBD) — Would implement Summary Gates for session transitions

## Strategic Value

**Prevents Context Overload** — Agents receive only relevant information, maintaining task focus and reducing token usage.

**Catches Semantic Violations** — Review Gates detect contract violations that pass deterministic checks (performance anti-patterns, security gaps, missing edge cases).

**Reduces Human Review Burden** — Quality and Review Gates filter out obvious errors, letting humans focus on strategic fit rather than technical correctness.

**Enforces Architectural Consistency** — Constitutional Review (via Review Gates) ensures code follows project principles, not just internet-average patterns.

**Creates Clear Contracts** — Each gate type has explicit pass/fail criteria, making verification deterministic where possible and explicit where probabilistic.

See also:
- [Adversarial Code Review](/patterns/adversarial-code-review) — Review Gate implementation
- [Constitutional Review](/patterns/constitutional-review) — Dual-contract Review Gate
- [The Spec](/patterns/the-spec) — Contract source for Review Gates
- [Agent Constitution](/patterns/agent-constitution) — Architectural constraint source
- [Model Routing](/patterns/model-routing) — Model selection for different gate types

### Related Concepts
- [Agentic SDLC](/concepts/agentic-sdlc) — The lifecycle where gates create phase boundaries
- [Context Engineering](/concepts/context-engineering) — The practice of structuring context
- [Guardrails](/concepts/guardrails) — Disambiguated term this pattern replaces

### External Validation
- [A Method for AI-Assisted Pull Request Reviews](https://lassala.net/2026/01/05/a-method-for-ai-assisted-pull-request-reviews-aligning-code-with-business-value/) (Carlos Lassala, January 2026) — Production implementation validating Review Gates' effectiveness in catching architectural violations through adversarial review
