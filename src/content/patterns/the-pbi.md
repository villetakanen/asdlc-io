---
title: "The PBI"
description: "A transient execution unit that defines the delta (change) while pointing to permanent context (The Spec), optimized for agent consumption and bounded agency."
tags: ["Agile", "Product Backlog Item", "Spec-Driven Development", "Bounded Agency"]
relatedIds: ["patterns/the-spec", "concepts/spec-driven-development", "concepts/context-engineering", "concepts/levels-of-autonomy", "concepts/model-context-protocol", "practices/micro-commits"]
status: "Draft"
lastUpdated: 2025-12-27
---

## Definition

The **Product Backlog Item (PBI)** is the "Unit of Execution" in the ASDLC. While [The Spec](/patterns/the-spec) defines the **State** (how the system works), the PBI defines the **Delta** (the specific change to be made).

In an AI-Native workflow, the PBI transforms from a "User Story" (negotiable conversation) into a **Prompt** (strict directive). While the AI's probabilistic nature allows for flexibility in *how* code is written, the PBI enforces strict boundaries on *what* is delivered.

## The Role: Transient Instruction

The PBI is a transient trigger. Its job is to point the Agent to the right Context (The Spec) and define the immediate Task.

- **Format:** Issue Tracker Item (Linear/Jira) or Markdown Task (`tasks/task-id.md`)
- **Lifespan:** Transient (Archived/Closed upon completion)
- **Audience:** Agents and Developers (Executors)

## The Accessibility Standard

**Invisibility is a bug.** If an Agent cannot read the PBI, the workflow is broken.

A PBI locked inside a web UI that lacks an API or MCP (Model Context Protocol) integration is useless to an AI developer. The agent must be able to programmatically access the work item without requiring a human to copy-paste instructions.

### Valid PBI Formats

1. **Integrated (MCP):** The Agent is connected to the Issue Tracker (e.g., Linear/Jira) via MCP and can "read" the ticket description directly
2. **Repo-Based:** The PBI exists as a file in the repository (e.g., `tasks/TICKET-123.md`), ensuring zero-friction access for any LLM

### Anti-Pattern: The Walled Garden

**Problem:** The PBI exists in a proprietary issue tracker with no API access, requiring manual transcription.

**Solution:** Either implement MCP integration or mirror critical PBIs as markdown files in the repository during sprint planning.

## Anatomy of an AI-Ready PBI

An effective PBI for an Agent does **not** contain the full design. Instead, it acts as a **Pointer**.

### The 4-Part Structure

#### 1. The Directive

**What to do:** Clear, imperative instruction  
**Scope:** Explicit boundaries

```/dev/null/pbi-directive-example.md#L1-3
Implement the API Layer for user notification preferences.
Scope: Only touch the `src/api/notifications` folder.
```

#### 2. The Context Pointer

**Where is the design?** Reference to the permanent spec  
**Why?** Prevents the PBI from becoming a stale copy of the design

```/dev/null/pbi-context-example.md#L1-2
Reference: `plans/notifications/spec.md` Part A for the schema.
See the "Architecture" section for endpoint contracts.
```

#### 3. The Verification Pointer

**How to verify?** Link to success criteria in the spec

```/dev/null/pbi-verification-example.md#L1-2
Must pass "Scenario 3: Preference Update" defined in 
`plans/notifications/spec.md` Part B (Contract).
```

#### 4. The Refinement Rule

**Handling Drift:** Protocol for when reality diverges from the spec

```/dev/null/pbi-refinement-example.md#L1-2
If implementation requires changing the Architecture, you MUST 
update `spec.md` in the same PR with a changelog entry.
```

## Complete Example PBI

```/dev/null/complete-pbi-example.md#L1-20
# PBI-427: Implement Notification Preferences API

## Directive
Implement the `updatePreferences` endpoint for the user notification system.

**Scope:** 
- Create `src/api/notifications/preferences.ts`
- Add route handler to `src/api/routes.ts`
- Do NOT modify the WebSocket layer

## Context
Read: `plans/user-notifications/spec.md`
- See "Architecture > API Contracts" for endpoint schema
- See "Anti-Patterns" section for constraints

## Verification
- [ ] Endpoint accepts PATCH requests at `/api/preferences`
- [ ] Response time meets "Definition of Done" (<200ms)
- [ ] Passes "Scenario 2: Preference Update" E2E test

## Refinement Protocol
If the Zod schema in the spec is insufficient, update the spec 
with the new fields and document why in the PR description.
```

## The "Negotiability" Shift: Bounded Agency

In Classic Agile, PBIs are fully **Negotiable** (the 'N' in INVEST) because humans discuss the best path forward. In AI-Native Agile, PBIs operate with **Bounded Agency**.

Because AI is probabilistic, it requires freedom to explore the "How" (implementation details, syntax choices). However, to prevent hallucination, we bound this freedom with **Non-Negotiable Constraints**.

### Negotiable (The Path)

The Agent decides:
- Specific code structure
- Variable naming conventions
- Internal logic flow
- Refactoring approaches

### Non-Negotiable (The Guardrails)

The Agent **must** respect:
- Steps defined in the PBI (e.g., "Must implement E2E tests")
- Outcome metrics in the Spec (e.g., "Latency < 200ms")
- Anti-patterns documented in the Spec
- Architectural boundaries (e.g., "Do not modify the auth layer")

**The PBI is not a request for a conversation; it is a constrained optimization problem for the Agent to solve.**

## PBI vs. Spec: The State/Delta Contract

| Dimension | The Spec | The PBI |
|-----------|----------|---------|
| **Purpose** | Define the State (how it works) | Define the Delta (what changes) |
| **Lifespan** | Permanent (lives with the code) | Transient (closed after merge) |
| **Scope** | Feature-level rules | Task-level instructions |
| **Audience** | Architects, Agents (Reference) | Agents, Developers (Execution) |
| **Updates** | Evolves with architecture | Created per sprint, then archived |

### Why This Separation Matters

```/dev/null/separation-example.md#L1-12
Sprint 5: PBI-427 "Add preference API"
  → Reads spec.md for schema
  → Implements endpoint
  → PBI-427 is closed

Sprint 8: PBI-612 "Add SMS transport"
  → Reads spec.md (still has preference rules)
  → Sees the original schema constraints
  → PBI-612 is closed

Sprint 12: Bug fix for preference logic
  → Agent reads spec.md
  → Sees ALL historical constraints (latency, schema, anti-patterns)
```

Without this separation, the agent fixing the bug in Sprint 12 would have no visibility into the design decisions made in Sprint 5.

## Implementation Guidelines

### When to Create a PBI

Create a PBI when:
- Implementing a new feature defined in a Spec
- Fixing a bug that requires code changes
- Refactoring existing code (even if behavior doesn't change)
- Adding tests or documentation

### When NOT to Create a PBI

Don't create a PBI for:
- Discussions or research spikes (use ADRs or RFC docs instead)
- Updating the Spec itself without code changes (use a documentation PR)
- Dependency updates (use automated tooling like Dependabot)

### PBI Lifecycle

```/dev/null/pbi-lifecycle.md#L1-7
1. Planning: Human creates PBI with 4-part structure
2. Assignment: PBI assigned to Agent or Developer
3. Execution: Agent reads Spec, implements Delta
4. Review: Human verifies against Spec's Contract section
5. Merge: Code merged, Spec updated if needed
6. Closure: PBI marked Done/Closed
7. Archive: PBI enters read-only history
```

## Relationship to Other ASDLC Patterns

- **The Spec:** PBIs point to Specs for context; Specs persist after PBIs close
- **Spec-Driven Development:** PBIs are the execution triggers in the spec-driven workflow
- **Context Gates:** PBI acceptance criteria often reference gate conditions defined in Specs
- **Levels of Autonomy:** PBI constraints adjust based on the agent's autonomy level

## Best Practices

### 1. Always Include Context Pointers

```/dev/null/bad-pbi.md#L1-2
❌ BAD: "Add a search feature with good UX"
(Vague, no context, no verification criteria)
```

```/dev/null/good-pbi.md#L1-5
✅ GOOD: "Implement search API defined in plans/search/spec.md"
- Scope: src/api/search only
- Verify: Must pass Scenario 1 in spec
- See spec's Anti-Patterns before starting
```

### 2. Use Imperative Language

Agents respond better to commands than requests:
- ✅ "Implement the endpoint"
- ❌ "We should probably add an endpoint"

### 3. Scope Explicitly

Tell the agent what NOT to touch:
- "Only modify `src/components/Button`"
- "Do not change database migrations"
- "The auth layer is off-limits"

### 4. Link to Tests

Reference existing or required tests:
- "Must pass `tests/e2e/notifications.spec.ts`"
- "Add unit tests following patterns in `tests/api/`"

### 5. Version Your PBIs

If using repo-based PBIs, include metadata:

```/dev/null/pbi-metadata.md#L1-6
---
id: PBI-427
created: 2025-01-15
sprint: Sprint-23
assignee: agent-dev-01
spec: plans/notifications/spec.md
---
```

## Anti-Patterns

### The "Stale Copy" PBI

**Problem:** The PBI duplicates the entire spec content, creating two sources of truth.

**Solution:** PBIs reference specs; they don't duplicate them.

### The "Vague Directive" PBI

**Problem:** "Make the notifications better" (no boundaries, no verification).

**Solution:** Use the 4-part structure with explicit scope and verification.

### The "Invisible" PBI

**Problem:** PBI lives in a tool the agent can't access.

**Solution:** Implement MCP or mirror to repository as markdown.

### The "Eternal" PBI

**Problem:** PBI stays open for weeks, accumulating scope creep.

**Solution:** Close PBIs within a sprint. If the work isn't done, create a new PBI for the remaining scope.

## Template

```/dev/null/pbi-template.md#L1-20
# PBI-XXX: [Brief Imperative Title]

## Directive
[What to build/change in 1-2 sentences]

**Scope:**
- [Explicit file/folder boundaries]
- [What NOT to touch]

## Context
Read: `[path/to/spec.md]`
- [Specific section to reference]

## Verification
- [ ] [Criterion 1: Functional requirement]
- [ ] [Criterion 2: Performance/quality requirement]
- [ ] [Criterion 3: Test coverage requirement]

## Refinement Protocol
[What to do if the spec needs updating during implementation]
```

## References

- [The Spec](/patterns/the-spec)
- [Spec-Driven Development](/concepts/spec-driven-development)
- [Levels of Autonomy](/concepts/levels-of-autonomy)
- [User Stories and the INVEST Model (Mike Cohn)](https://www.mountaingoatsoftware.com/blog/the-invest-model)
