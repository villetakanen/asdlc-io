---
title: "Adversarial Code Review"
description: "Consensus verification pattern using a secondary Critic Agent to review Builder Agent output against the Spec."
tags: ["Code Review", "Quality Gates", "Multi-Agent", "Verification", "Context Engineering"]
relatedIds: ["patterns/context-gates", "patterns/the-spec", "patterns/model-routing", "patterns/agentic-double-diamond", "patterns/agent-constitution", "patterns/constitutional-review"]
status: "Experimental"
lastUpdated: 2026-01-09
references:
  - type: "website"
    title: "A Method for AI-Assisted Pull Request Reviews: Aligning Code with Business Value"
    url: "https://lassala.net/2026/01/05/a-method-for-ai-assisted-pull-request-reviews-aligning-code-with-business-value/"
    author: "Claudio Lassala"
    published: 2026-01-05
    accessed: 2026-01-09
    annotation: "Production implementation validating the pattern's effectiveness in catching silent performance bugs and architectural violations."
---

## Definition

**Adversarial Code Review** is a verification pattern where a distinct AI session—the **Critic Agent**—reviews code produced by the **Builder Agent** against the [Spec](/patterns/the-spec) before human review.

This extends the [Critic (Hostile Agent)](/patterns/agentic-double-diamond) pattern from the design phase into the implementation phase, creating a verification checkpoint that breaks the "echo chamber" where a model validates its own output.

The Builder Agent (optimized for speed and syntax) generates code. The Critic Agent (optimized for reasoning and logic) attempts to reject it based on spec violations.

## The Problem: Self-Validation Ineffectiveness

LLMs are probabilistic text generators trained to be helpful. When asked "Check your work," a model that just generated code will often:

**Hallucinate correctness** — Confidently affirm that buggy logic is correct because it matches the plausible pattern in training data.

**Double down on errors** — Explain why the bug is actually a feature, reinforcing the original mistake.

**Share context blindness** — Miss gaps because it operates within the same context window and reasoning path that produced the original output.

If the same computational session writes and reviews code, the "review" provides minimal independent validation.

## The Solution: Separated Roles

To create effective verification, separate the generation and critique roles:

**The Builder** — Optimizes for implementation throughput (e.g., Gemini 3 Flash, Claude Haiku 4.5). Generates code from the PBI and Spec.

**The Critic** — Optimizes for logical consistency and constraint satisfaction (e.g., Gemini 3 Deep Think, DeepSeek V3.2). Validates code against Spec contracts without rewriting.

The Critic does not generate alternative implementations. It acts as a gatekeeper, producing either **PASS** or a list of **spec violations** that must be addressed.

## The Workflow

### 1. Build Phase

The Builder Agent implements the PBI according to the Spec.

**Output:** Code changes, implementation notes.

**Example:** "Updated `auth.ts` to support OAuth login flow."

### 2. Context Swap (Fresh Eyes)

**Critical:** Start a new AI session or chat thread for critique. This clears conversation drift and forces the Critic to evaluate only the artifacts (Spec + Diff), not the Builder's reasoning process.

If using the same model, close the current chat and open a fresh session. If using [Model Routing](/patterns/model-routing), switch to a High Reasoning model.

### 3. Critique Phase

Feed the Spec and the code diff to the Critic Agent with adversarial framing:

**System Prompt:**
```
You are a rigorous Code Reviewer validating implementation against contracts.

Input:
- Spec: specs/auth-system.md
- Code Changes: src/auth.ts (diff)

Task:
Compare the code strictly against the Spec's Blueprint (constraints) and Contract (quality criteria).

Identify:
1. Spec violations (missing requirements, violated constraints)
2. Security issues (injection vulnerabilities, auth bypasses)
3. Edge cases not handled (error paths, race conditions)
4. Anti-patterns explicitly forbidden in the Spec

Output Format:
- PASS (if no violations)
- For each violation, provide:
  1. Violation Description (what contract was broken)
  2. Impact Analysis (why this matters: performance, security, maintainability)
  3. Remediation Path (ordered list of fixes, prefer standard patterns, escalate if needed)
  4. Test Requirements (what tests would prevent regression)

This transforms critique from "reject" to "here's how to fix it."
```

### 4. Verdict

**If PASS:** Code moves to human Acceptance Gate (L3 review for strategic fit).

**If FAIL:** Violations are fed back to Builder as a new task: "Address these spec violations before proceeding."

This creates a [Context Gate](/patterns/context-gates) between code generation and human review.

## Relationship to Context Gates

Adversarial Code Review implements a **Review Gate** as defined in [Context Gates](/patterns/context-gates):

**Quality Gates** (deterministic) — Verify syntax, compilation, linting, test passage.

**Review Gates** (probabilistic, adversarial) — Verify semantic correctness, spec compliance, architectural consistency. **This is where Adversarial Code Review operates.**

**Acceptance Gates** (subjective, HITL) — Verify strategic fit and product vision alignment.

The Critic sits between automated tooling and human review, catching issues that compilers miss but that don't require human strategic judgment.

## Integration with Model Routing

Use [Model Routing](/patterns/model-routing) to assign models by capability profile:

| Role | Model Profile | Rationale |
|------|---------------|-----------|
| Builder | High Throughput | Fast code generation with strong syntax knowledge |
| Critic | High Reasoning | Deep logic evaluation, constraint satisfaction, edge case discovery |

This leverages the strengths of each model class: speed for generation, reasoning depth for validation.

## Strategic Value

**Reduces L3 Cognitive Load** — Human reviewers focus on "Is this the right product?" rather than catching spec deviations or missing error handling.

**Catches Regression to Mediocrity** — Coding models gravitate toward average solutions. The Critic enforces novelty and architectural intent from the Spec.

**Enforces Spec Quality** — If the Critic can't determine whether code is correct, the Spec is ambiguous. This surfaces specification gaps.

**Prevents Silent Failures** — The Critic catches implementation shortcuts (skipped validation, missing edge cases) that pass tests but violate contracts.

## Validated in Practice

**Case Study: Claudio Lassala (January 2026)**

A production implementation validated this pattern's effectiveness:

**Context:** A user story required filtering audit logs by date range. The Builder Agent implemented the requirement, tests passed, and the code compiled without errors.

**Issue Detected:** The Critic Agent identified a silent performance violation:

```csharp
// Implementation passed all Quality Gates but violated architectural constraint
var logs = await repository.LoadAll(); // Loads entire table into memory
return logs.Where(log => log.Date > startDate); // Filters in-memory
```

**Critic Output:**
```
VIOLATION: Performance - Data Access Pattern

Spec requires database-level filtering for datasets exceeding 1k records.
Implementation loads full table then filters in-memory.

Impact: Works with small data; fails at scale (10k+ records cause memory issues)

Remediation Path:
1. Push filtering to database: repository.FindWhere(x => x.Date > startDate)
2. If ORM doesn't support this filter, use raw SQL
3. Add performance test with 10k+ mock records to prevent regression
4. Document the constraint in the repository interface
```

**Key Learnings:**

1. **Silent Performance Risks** — Code that passes all tests can still violate architectural constraints. The Critic caught the `LoadAll().Filter()` anti-pattern before production.

2. **Iterative Refinement** — The Critic initially flagged "missing E2E tests," which were actually present but structured differently. The team updated the Critic's instructions to recognize the project's test architecture, demonstrating the pattern's adaptability.

3. **Tone Calibration** — Using "Approve with suggestions" framing prevented blocking valid code while surfacing genuine risks. The Critic didn't reject the PR—it flagged optimization opportunities with clear remediation paths.

This validates the pattern's core thesis: adversarial review catches architectural violations that pass deterministic checks but violate semantic contracts.

## Example: The Silent Performance Bug

**Spec Contract:** "All database retries must use exponential backoff to prevent thundering herd during outages."

**Builder Output:** Clean code with a simple retry loop using fixed 1-second delays. Tests pass.

```typescript
// src/db.ts
async function queryWithRetry(sql: string) {
  for (let i = 0; i < 5; i++) {
    try {
      return await db.query(sql);
    } catch (err) {
      await sleep(1000); // Fixed delay
    }
  }
}
```

**Critic Response:**
```
VIOLATION: src/db.ts Line 45

Spec requires exponential backoff. Implementation uses constant sleep(1000).

Impact: During database outages, this will cause thundering herd problems
as all clients retry simultaneously.

Required: Implement delay = baseDelay * (2 ** attemptNumber)
```

Without the Critic, a human skimming the PR might miss the constant delay. The automated tests wouldn't catch it (the code works). The Critic, reading against the contract, identifies the violation.

## Implementation Constraints

**Not Automated (Yet)** — As of December 2025, this requires manual orchestration. Engineers must manually switch sessions/models and feed context to the Critic.

**Context Window Limits** — Large diffs may exceed even Massive Context models. Use [Context Gates](/patterns/context-gates) filtering to provide only changed files + relevant Spec sections.

**Critic Needs Clear Contracts** — The Critic can only enforce what's documented in the Spec. Vague specs produce vague critiques.

**Model Capability Variance** — Not all "reasoning" models perform equally at code review. Validate your model's performance on representative examples.

## Relationship to Agent Constitution

The [Agent Constitution](/patterns/agent-constitution) defines behavioral directives for agents. For Adversarial Code Review:

**Builder Constitution:** "Implement the Spec's contracts. Prioritize clarity and correctness over cleverness."

**Critic Constitution:** "You are skeptical. Your job is to reject code that violates the Spec, even if it 'works.' Favor false positives over false negatives."

This frames the Critic's role as adversarial by design—it's explicitly told to be rigorous and skeptical, counterbalancing the Builder's helpfulness bias.

## Future Automation Potential

This pattern is currently manual but has clear automation paths:

**CI/CD Integration** — Run Critic automatically on PR creation, posting violations as review comments.

**IDE Integration** — Real-time critique as code is written, similar to linting but spec-aware.

**Multi-Agent Orchestration** — Automated handoff between Builder and Critic until PASS is achieved.

As agent orchestration tooling matures, this pattern may move from Experimental to Standard.

See also:
- [Context Gates](/patterns/context-gates) — The architectural checkpoint pattern this implements
- [The Spec](/patterns/the-spec) — The source of truth the Critic validates against
- [Model Routing](/patterns/model-routing) — How to assign different models to Builder and Critic roles
- [Agentic Double Diamond](/patterns/agentic-double-diamond) — The design-phase Critic pattern this extends
- [Agent Constitution](/patterns/agent-constitution) — How to frame Critic behavior as adversarial

### Related Concepts
- [Agentic SDLC](/concepts/agentic-sdlc) — The Verification phase where this pattern operates
- [Levels of Autonomy](/concepts/levels-of-autonomy) — L3 autonomy requires verification before human review


