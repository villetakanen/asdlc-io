---
title: "Adversarial Code Review"
description: "Executing automated verification using a Critic Agent to validate implementation artifacts against Spec contracts."
tags: ["Code Review", "Quality Gates", "Multi-Agent", "Verification"]
relatedIds: ["patterns/adversarial-code-review", "patterns/the-spec", "patterns/agent-constitution"]
lastUpdated: 2026-01-31
status: "Live"
---

## Definition

**Adversarial Code Review** is the practice of automating code validation by employing a specialized **Critic Agent** to review claimed implementations against established [Spec](/patterns/the-spec) contracts and the [Agent Constitution](/patterns/agent-constitution).

By separating the "Builder" role from the "Critic" role, this practice ensures that verification remains objective and rigorous, catching architectural drifts, security vulnerabilities, and logic errors that might pass standard unit tests.

## When to Use

Use this practice to implement a high-reasoning verification gate before human review.

**Use this practice when:**
- A feature implementation is ready for review.
- The project maintains clear [Specs](/patterns/the-spec) or [CLAUDE.md](/practices/agents-md-spec) constitutions.
- You are using [Model Routing](/patterns/model-routing) to separate implementation and verification roles.
- The risk of "echo-chamber" self-validation is high.

**Skip this practice when:**
- Performing trivial documentation fixes or small refactors with no logic changes.
- Validating exploratory "vibe coding" prototypes where specs are not yet defined.

## Process

### Step 1: Fetch Issue Context
Retrieve the source of truth for the work being reviewed. This typically involves getting details from a project management tool (like Linear) to understand the title, description, and acceptance criteria.

### Step 2: Gather Implementation Artifacts
Identify what has changed. Check the `git status` for uncommitted changes or review recent commits associated with the issue ID. Prepare the diff or the set of modified files for the Critic Agent.

### Step 3: Load Contracts
Identify the "laws" the implementation must follow. This includes:
- Relevant functional specs in the `specs/` or `docs/` directory.
- The project's **Constitution** (often `CLAUDE.md`), which contains architectural constraints and coding standards.

### Step 4: Adversarial Review
Deploy the **Critic Agent** with an adversarial persona. Instruct the agent to be skeptical by design and to prioritize rejecting violations over being "helpful." Compare the code strictly against the loaded contracts.

### Step 5: Identify Violations & Verdict
Analyze the Critic's output. If violations are found, categorize them by impact and provide specific remediation paths. If no violations are found against the contracts, issue a PASS verdict.

## Templates

### Critic Agent Prompt
Use this template to configure a session or subagent for adversarial review.

```markdown
# Adversarial Code Review

You are a rigorous **Critic Agent** performing adversarial code review per ASDLC.io patterns.

Your role is skeptical by design: reject code that violates the Spec or Constitution, even if it "works." Favor false positives over false negatives.

## Task
Review the implementation claimed for: {issue_id_or_description}

## Workflow
1. **Fetch Context**: Review specs/{spec_name}.md and {constitution_file}.
2. **Review Artifacts**: Analyze the provided code diff/files.
3. **Compare Strictly**: Check against Spec contracts, Security (RLS/Auth), Type safety, and Design system tokens.
4. **Identify Violations**: For each issue, cite the clause violated, the impact, and the remediation path.

## Output Format

### If No Violations Found:
## Verdict: PASS
[Summary of what was reviewed and why it passes]

### If Violations Found:
## Verdict: NOT READY TO MERGE

### Acceptance Criteria Check
| Criterion | Status | Notes |
|-----------|--------|-------|
| {criterion} | {status} | {notes} |

### Violations Found
**1. [Category]: [Brief description]**
- **Violated**: [Spec section or rule]
- **Impact**: [Why this matters]
- **Remediation**: [How to fix]
```

## Common Mistakes

### Using the Same Session
**Problem:** Allowing the Builder Agent to review its own work within the same chat history.
**Solution:** Always start a fresh session or use a distinct subagent with a high-reasoning model for the review.

### Vague Violation Reports
**Problem:** The Critic flags an issue but doesn't explain *why* it's a violation or how to fix it.
**Solution:** Enforce a structured output format that requires citing specific spec clauses and providing remediation steps.

## Related Patterns

This practice implements:
- **[Adversarial Code Review](/patterns/adversarial-code-review)** — The core architectural pattern of separated verification roles.
- **[The Spec](/patterns/the-spec)** — The source of truth used for validation.
- **[Agent Constitution](/patterns/agent-constitution)** — The set of behavioral and technical constraints enforced during review.
