---
title: "Constitutional Review Implementation"
description: "Step-by-step guide for implementing Constitutional Review to validate code against both Spec and Constitution contracts."
tags: ["Code Review", "Implementation", "Critic Agent", "Workflow", "Quality Gates"]
relatedIds: ["patterns/constitutional-review", "patterns/adversarial-code-review", "patterns/agent-constitution", "practices/agents-md-spec"]
status: "Experimental"
lastUpdated: 2026-01-08
---

## Definition

**Constitutional Review Implementation** is the operational practice of configuring and executing [Constitutional Review](/patterns/constitutional-review) to validate code against both functional requirements (the Spec) and architectural values (the Constitution).

This practice extends [Adversarial Code Review](/patterns/adversarial-code-review) by adding constitutional constraints to the Critic Agent's validation criteria.

## When to Use

**Use this practice when:**

- Your project has documented architectural principles in an [Agent Constitution](/patterns/agent-constitution)
- Code passes tests but you've experienced architectural violations in production
- You want to enforce non-functional requirements (performance, security, data access patterns)
- Your team needs to prevent "regression to mediocrity" (LLMs generating internet-average code)

**Skip this practice when:**

- You don't have an Agent Constitution documented (implement [AGENTS.md Specification](/practices/agents-md-spec) first)
- Your project is a prototype without architectural constraints
- The overhead of dual-contract validation exceeds the benefit (very small projects)

## Prerequisites

Before implementing Constitutional Review, ensure you have:

1. **[Agent Constitution](/patterns/agent-constitution)** documented (typically `AGENTS.md`)
2. **[The Spec](/patterns/the-spec)** for the feature being reviewed
3. **Critic Agent session** separate from the Builder Agent (fresh context)
4. **Architectural constraints** clearly defined in the Constitution

If architectural constraints aren't documented, start with [AGENTS.md Specification](/practices/agents-md-spec).

## Process

### Step 1: Document Architectural Constraints in Constitution

Ensure your Agent Constitution includes **non-functional constraints** that are:
- **Specific** (not "be performant" but "push filtering to database layer")
- **Testable** (can be objectively verified)
- **Scoped** (applies to specific categories: Data Access, Performance, Security)

**Example Structure**:

```markdown
## Architectural Constraints

### Data Access
- All filtering operations MUST be pushed to the database layer
- Never use `findAll()` or `LoadAll()` followed by in-memory filtering
- Queries must handle 10k+ records without memory issues

### Performance
- API responses < 200ms at p99
- Database queries must use indexes for common filters
- No N+1 query patterns

### Security
- User IDs never logged (use hashed identifiers)
- All inputs validated against Zod schemas before processing
- Authentication tokens expire within 24 hours
- No hardcoded secrets (use environment variables)

### Error Handling
- Never fail silently (all errors logged with context)
- User-facing errors never expose stack traces
- Database errors map to generic "Service unavailable" messages
```

### Step 2: Configure Critic Agent Prompt

Extend the standard [Adversarial Code Review](/patterns/adversarial-code-review) prompt to include constitutional validation.

**System Prompt Template**:

```
You are a rigorous Code Reviewer validating implementation against TWO sources of truth:

1. The Spec (/plans/{feature-name}/spec.md)
   - Functional requirements (what should it do?)
   - API contracts (what are the inputs/outputs?)
   - Data schemas (what is the structure?)

2. The Constitution (AGENTS.md)
   - Architectural patterns (e.g., "push filtering to DB")
   - Performance constraints (e.g., "queries handle 10k+ records")
   - Security rules (e.g., "never log user IDs")
   - Error handling policies (e.g., "never fail silently")

YOUR JOB:
Identify where code satisfies the Spec (functional) but violates the Constitution (architectural).

COMMON CONSTITUTIONAL VIOLATIONS TO CHECK:
- LoadAll().Filter() pattern (data access violation)
- Hardcoded secrets (security violation)
- Missing error logging (error handling violation)
- N+1 query patterns (performance violation)
- User IDs in logs (security violation)

OUTPUT FORMAT:
For each violation:
1. Type: Constitutional Violation - [Category]
2. Location: File path and line number
3. Issue: What constitutional principle is violated
4. Impact: Why this matters at scale (performance, security, maintainability)
5. Remediation Path: Ordered steps to fix (prefer standard patterns, escalate if needed)
6. Test Requirements: What tests would prevent regression

If no violations found, output: PASS - Constitutional Review
```

### Step 3: Execute Constitutional Review Workflow

Follow this sequence to ensure proper validation:

```
┌─────────────┐
│   Builder   │ → Implements Spec
└──────┬──────┘
       ↓
┌─────────────────┐
│  Quality Gates  │ → Tests, types, linting (deterministic)
└──────┬──────────┘
       ↓ (pass)
┌──────────────────┐
│ Spec Compliance  │ → Does it meet functional requirements?
│     Review       │    (Adversarial Code Review)
└──────┬───────────┘
       ↓ (pass)
┌──────────────────┐
│ Constitutional   │ → Does it follow architectural principles?
│     Review       │    (This practice)
└──────┬───────────┘
       ↓ (pass)
┌─────────────────┐
│ Acceptance Gate │ → Human strategic review (is it the right thing?)
└─────────────────┘
```

**Execution Steps:**

1. **Builder completes implementation** — Code written, tests pass
2. **Quality Gates pass** — Compilation, linting, unit tests all green
3. **Spec Compliance Review** — Critic validates functional requirements met
4. **⭐ Constitutional Review** — Critic validates architectural principles followed:
   - Open **new Critic Agent session** (fresh context, no Builder bias)
   - Provide **Constitution** (AGENTS.md)
   - Provide **Spec** (feature spec file)
   - Provide **Code Diff** (changed files only)
   - Use **Constitutional Review prompt** (from Step 2)
   - Critic outputs violations or PASS
5. **If violations found** → Return to Builder with remediation path
6. **If PASS** → Proceed to Acceptance Gate (human review)

### Step 4: Process Violation Reports

When the Critic identifies constitutional violations, the output will follow this format:

```
VIOLATION: Constitutional - Data Access Pattern

Location: src/audit/AuditService.cs Line 23

Issue: Loads all records into memory before filtering
Constitution Violation: "All filtering operations MUST be pushed to database layer"

Impact: 
- Works fine with small datasets (< 1k records)
- Breaks at scale (10k+ records cause memory issues)
- Creates N+1 query patterns in related queries
- Violates performance SLA (API responses > 200ms)

Remediation Path:
1. Push filter to database query:
   repository.FindWhere(x => x.Date > startDate)
2. If ORM doesn't support this pattern, use raw SQL:
   SELECT * FROM audit_logs WHERE date > @startDate
3. Add performance test with 10k+ mock records to prevent regression
4. Document the constraint in repository interface comments

Test Requirements:
- Add test: "GetLogs with 10k records completes in < 200ms"
- Add test: "GetLogs does not load entire table into memory"
  (mock repository, verify FindWhere called, not LoadAll)
```

**Processing steps:**

1. **Return to Builder Agent** with full violation report
2. **Builder implements remediation** following the ordered path
3. **Re-run Constitutional Review** after fixes
4. **Iterate until PASS** (typically 1-2 cycles)

### Step 5: Update Constitution Based on Violations

If the Critic struggles to validate or produces unclear violations:

**Indicators Constitution needs update:**
- Critic says "unclear whether this violates principles"
- False positives (valid code flagged as violation)
- Violations lack specific remediation paths

**Action**: Refine constitutional constraints:

```markdown
## Before (vague)
### Performance
- Code should be fast

## After (specific)
### Performance
- API responses < 200ms at p99
- Database queries must use indexes for common filters
- Push filtering to database layer (never LoadAll().Filter())
```

## Examples

### Example 1: Data Access Violation

**Code Submitted**:
```typescript
async function getActiveUsers() {
  const users = await db.users.findAll();
  return users.filter(u => u.status === 'active');
}
```

**Constitutional Review Output**:
```
VIOLATION: Constitutional - Data Access Pattern

Location: src/users/service.ts Line 12

Issue: Loads all users then filters in-memory
Constitution Violation: "Push filtering to database layer"

Impact: Works with 100 users, breaks at 10k+

Remediation:
1. db.users.findWhere({ status: 'active' })
2. Add test with 10k users to verify performance

Test Requirements:
- Performance test: 10k users returns in < 200ms
- Verify db.users.findWhere called (not findAll)
```

### Example 2: Security Violation

**Code Submitted**:
```typescript
logger.info(`User ${userId} logged in from ${ipAddress}`);
```

**Constitutional Review Output**:
```
VIOLATION: Constitutional - Security

Location: src/auth/logger.ts Line 45

Issue: Logs user ID directly
Constitution Violation: "Never log user IDs (use hashed identifiers)"

Impact: GDPR compliance risk, audit log exposure

Remediation:
1. Hash user ID: logger.info(`User ${hashUserId(userId)} logged in...`)
2. Implement hashUserId utility (SHA-256 with salt)
3. Update all logging to use hashed IDs

Test Requirements:
- Verify logs do not contain raw user IDs
- Verify hashed IDs are consistent (same user = same hash)
```

## Implementation Constraints

**Requires Clear Constitutional Principles** — Vague constraints produce vague critiques. "Be performant" is not actionable. "API responses < 200ms at p99" is.

**Not Fully Automated (Yet)** — As of January 2026, requires manual orchestration. You must manually:
- Start new Critic Agent session
- Provide Constitution + Spec + Code Diff
- Interpret violation reports

**Model Capability Variance** — Not all reasoning models perform equally at constitutional review. Recommended:
- **High Reasoning models** for Critic (DeepSeek R1, Gemini 2.0 Flash Thinking, Claude 3.7 Sonnet)
- Avoid throughput-optimized models (they skip architectural analysis)

**False Positives Possible** — Architectural rules have exceptions. The Critic may flag valid code that violates general principles for good reasons. Human review in Acceptance Gate remains essential.

**Context Window Limits** — Large diffs may exceed context windows. Solutions:
- Review changed files only (not entire codebase)
- Split large PRs into smaller, focused changes
- Use Summary Gates to compress Spec to relevant sections

## Troubleshooting

### Issue: Critic approves code that violates Constitution

**Cause**: Constitutional constraints not specific enough in AGENTS.md

**Solution**: 
1. Review violation that slipped through
2. Add specific constraint to Constitution:
   ```markdown
   ### Data Access
   - ❌ Before: "Queries should be efficient"
   - ✅ After: "Never use LoadAll().Filter() - push filtering to database"
   ```
3. Re-run Constitutional Review with updated Constitution

### Issue: Critic flags valid code as violation

**Cause**: Constitutional rule is too strict or lacks exceptions

**Solution**:
1. Document exception in Constitution:
   ```markdown
   ### Data Access
   - Push filtering to database layer
   - Exception: In-memory filtering allowed for cached reference data (< 100 records)
   ```
2. Update Critic prompt to recognize exceptions
3. Proceed to Acceptance Gate (human validates exception is legitimate)

### Issue: Constitutional Review takes too long

**Cause**: Large code diffs or complex Constitution

**Solution**:
1. **Break up PRs** — Smaller, focused changes
2. **Parallelize reviews** — Review multiple files concurrently
3. **Use Summary Gates** — Compress Spec to relevant sections only
4. **Cache Constitution** — Reuse constitutional context across reviews

## Future Automation Potential

This practice is currently manual but has clear automation paths:

**CI/CD Integration** — Automated constitutional review on PR creation:
```yaml
# .github/workflows/constitutional-review.yml
on: pull_request
jobs:
  constitutional-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Constitutional Review
        run: |
          constitutional-review-agent \
            --constitution AGENTS.md \
            --spec plans/${FEATURE}/spec.md \
            --diff ${{ github.event.pull_request.diff_url }}
```

**IDE Integration** — Real-time constitutional feedback:
- Inline warnings when typing code that violates Constitution
- Suggestions appear as you code (like linting)

**Living Constitution** — Automatic updates:
- Track approved exceptions to constitutional rules
- Suggest Constitution updates when patterns emerge

**Violation Analytics** — Dashboard tracking:
- Which constitutional principles violated most often
- Identify gaps in agent training
- Measure constitutional compliance over time

See also:
- [Constitutional Review](/patterns/constitutional-review) — The pattern this practice implements
- [Adversarial Code Review](/patterns/adversarial-code-review) — The base review pattern
- [Agent Constitution](/patterns/agent-constitution) — Source of architectural truth
- [The Spec](/patterns/the-spec) — Source of functional truth
- [AGENTS.md Specification](/practices/agents-md-spec) — How to document the Constitution
- [Feature Assembly](/practices/feature-assembly) — The full workflow where this practice fits

### External Validation
- [A Method for AI-Assisted Pull Request Reviews](https://lassala.net/2026/01/05/a-method-for-ai-assisted-pull-request-reviews-aligning-code-with-business-value/) (Carlos Lassala, January 2026) — Production implementation showing this practice in action
