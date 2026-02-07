---
title: "Constitutional Review"
description: "Verification pattern that validates implementation against both functional requirements (Spec) and architectural values (Constitution)."
tags: ["Code Review", "Architecture", "Agent Constitution", "Quality Gates", "Verification"]
relatedIds: ["patterns/adversarial-code-review", "patterns/agent-constitution", "patterns/the-spec", "patterns/context-gates", "practices/constitutional-review-implementation"]
status: "Live"
lastUpdated: 2026-01-31
references:
  - type: "website"
    title: "A Method for AI-Assisted Pull Request Reviews: Aligning Code with Business Value"
    url: "https://lassala.net/2026/01/05/a-method-for-ai-assisted-pull-request-reviews-aligning-code-with-business-value/"
    author: "Claudio Lassala"
    published: 2026-01-05
    accessed: 2026-01-09
    annotation: "Production validation showing constitutional violations caught after passing quality gates, demonstrating real-world effectiveness of this pattern."
---

## Definition

**Constitutional Review** is a verification pattern that validates code against two distinct contracts:

1. **The Spec** (functional requirements) — Does it do what was asked?
2. **The Constitution** (architectural values) — Does it do it *the right way*?

This pattern extends [Adversarial Code Review](/patterns/adversarial-code-review) by adding a second validation layer. Code can pass all tests and satisfy the Spec's functional requirements while still violating the project's architectural principles documented in the [Agent Constitution](/patterns/agent-constitution).

## The Problem: Technically Correct But Architecturally Wrong

Standard verification catches functional bugs:
- **Tests**: Does the code produce expected outputs?
- **Spec Compliance**: Does it implement all requirements?
- **Type Safety**: Does it compile without errors?

But code can pass all these checks and still violate architectural constraints:

**Example: The Performance Violation**

```typescript
// Spec requirement: "Filter audit logs by date range"
async function getAuditLogs(startDate: Date) {
  const logs = await db.auditLogs.findAll(); // ❌ Loads entire table
  return logs.filter(log => log.date > startDate); // ❌ Filters in memory
}
```

**Quality Gates**: ✅ Tests pass (small dataset)  
**Spec Compliance**: ✅ Returns filtered logs  
**Constitutional Review**: ❌ Violates "push filtering to database layer"

The code is **functionally correct** but **architecturally unsound**. It works fine with 100 records but fails catastrophically at 10,000+.

## The Solution: Dual-Contract Validation

Constitutional Review solves this by validating against **two sources of truth**:

### Traditional Review (Functional)
- **Input**: Spec + Code Diff
- **Question**: "Does the code implement the requirements?"
- **Validates**: Functional correctness

### Constitutional Review (Architectural)
- **Input**: Constitution + Spec + Code Diff
- **Question**: "Does the code exhibit our architectural values?"
- **Validates**: Architectural consistency

The Critic Agent validates against BOTH contracts:
1. **Functional correctness** (from the Spec)
2. **Architectural consistency** (from the Constitution)

## Anatomy

Constitutional Review consists of three key components:

### The Dual-Contract Input

**Spec Contract** — Defines functional requirements, API contracts, and data schemas. Answers "what should it do?"

**Constitution Contract** — Defines architectural patterns, performance constraints, and security rules. Answers "how should it work?"

Both contracts are fed to the Critic Agent for validation.

### The Critic Agent

A secondary AI session (ideally using a reasoning-optimized model) that:

- Reads both the Spec and the Constitution
- Compares implementation against both contracts
- Identifies where code satisfies functional requirements but violates architectural principles
- Provides structured violation reports with remediation paths

This extends the [Adversarial Code Review](/patterns/adversarial-code-review) Critic with constitutional awareness.

### The Violation Report

When constitutional violations are detected, the Critic produces:

1. **Violation Description** — What constitutional principle was violated
2. **Impact Analysis** — Why this matters at scale (performance, security, maintainability)
3. **Remediation Path** — Ordered steps to fix (prefer standard patterns, escalate if needed)
4. **Test Requirements** — What tests would prevent regression

This transforms review from rejection to guidance.

## Relationship to Other Patterns

**[Adversarial Code Review](/patterns/adversarial-code-review)** — The base pattern that Constitutional Review extends. Adds the Constitution as a second validation contract.

**[Agent Constitution](/patterns/agent-constitution)** — The source of architectural truth. Defines the "driver training" that shapes initial behavior; Constitutional Review verifies the training was followed.

**[The Spec](/patterns/the-spec)** — The source of functional truth. Constitutional Review validates against both Spec and Constitution.

**[Context Gates](/patterns/context-gates)** — Constitutional Review implements a specialized Review Gate that validates architectural consistency.

**Feedback Loop**: Constitution shapes behavior → Constitutional Review catches violations → Violations inform Constitution updates (if principles aren't clear enough).

## Integration with Context Gates

Constitutional Review implements a specialized [Review Gate](/patterns/context-gates) that sits between Quality Gates and Acceptance Gates:

| Gate Type | Question | Validated By |
|-----------|----------|--------------|
| Quality Gates | Does it compile and pass tests? | Toolchain (deterministic) |
| Spec Review Gate | Does it implement requirements? | Critic Agent (probabilistic) |
| **Constitutional Review Gate** | **Does it follow principles?** | **Critic Agent (probabilistic)** |
| Acceptance Gate | Is it the right solution? | Human (subjective) |

The Constitutional Review Gate catches architectural violations that pass functional verification.

## Strategic Value

**Catches "Regression to Mediocrity"** — LLMs are trained on average code from the internet. Without constitutional constraints, they gravitate toward common but suboptimal patterns.

**Enforces Institutional Knowledge** — Architectural decisions (performance patterns, security rules, error handling strategies) are documented once in the Constitution and verified on every implementation.

**Surfaces Specification Gaps** — If the Critic can't determine whether code violates constitutional principles, the Constitution needs clarification. This improves the entire system.

**Reduces L3 Review Burden** — Human reviewers focus on strategic fit ("Is this the right feature?") rather than catching architectural violations ("Why are you loading the entire table?").

**Prevents Silent Failures** — Code that "works" but violates architectural principles (like the LoadAll().Filter() anti-pattern) is caught before production.

## Validated in Practice

**Case Study: Claudio Lassala (January 2026)**

A production implementation caught a constitutional violation that passed all other gates:

**Context**: User story required filtering audit logs by date range. Builder Agent implemented the requirement, tests passed, code compiled without errors.

**Code Behavior**:
- Loaded entire audit log table into memory
- Filtered in-memory using LINQ/collection methods

**Gate Results**:
- **Quality Gates**: ✅ Passed (compiled, tests passed with small dataset)
- **Spec Compliance**: ✅ Passed (functional requirement met: returns filtered logs)
- **Constitutional Review**: ❌ **FAILED** (violated "push filtering to database layer")

**Critic Output**: Provided specific remediation path:
1. Push filter to database query layer
2. If ORM doesn't support pattern, use raw SQL
3. Add performance test with 10k+ records
4. Document constraint in repository interface

**Impact**: Silent performance bug caught before production. The code worked perfectly in development (small dataset) but would have failed catastrophically at scale.

See full case study in [Adversarial Code Review](/patterns/adversarial-code-review).

## Implementing Practice

For step-by-step implementation guidance, see:

- [Constitutional Review Implementation](/practices/constitutional-review-implementation) — How to configure Critic Agent prompts, document architectural constraints, and integrate with your workflow

See also:
- [Adversarial Code Review](/patterns/adversarial-code-review) — The base pattern this extends
- [Agent Constitution](/patterns/agent-constitution) — The source of architectural truth
- [The Spec](/patterns/the-spec) — The source of functional truth
- [Context Gates](/patterns/context-gates) — The architectural checkpoint system
- [Agentic SDLC](/concepts/agentic-sdlc) — The verification phase where this operates
- [Context Engineering](/concepts/context-engineering) — How to structure constitutional constraints for LLMs
