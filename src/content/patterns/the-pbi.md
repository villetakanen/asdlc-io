---
title: "The PBI"
description: "A transient execution unit that defines the delta (change) while pointing to permanent context (The Spec), optimized for agent consumption."
tags: ["Agile", "Product Backlog Item", "Spec-Driven Development", "Bounded Agency"]
relatedIds: ["patterns/the-spec", "concepts/spec-driven-development", "concepts/context-gates"]
status: "Live"
lastUpdated: 2025-01-02
---

## Definition

The Product Backlog Item (PBI) is the unit of execution in the ASDLC. While [The Spec](/patterns/the-spec) defines the **State** (how the system works), the PBI defines the **Delta** (the specific change to be made).

In an AI-native workflow, the PBI transforms from a "User Story" (negotiable conversation) into a **Prompt** (strict directive). The AI has flexibility in *how* code is written, but the PBI enforces strict boundaries on *what* is delivered.

| Dimension   | The Spec                        | The PBI                          |
| :---------- | :------------------------------ | :------------------------------- |
| **Purpose** | Define the State (how it works) | Define the Delta (what changes)  |
| **Lifespan**| Permanent (lives with the code) | Transient (closed after merge)   |
| **Scope**   | Feature-level rules             | Task-level instructions          |
| **Audience**| Architects, Agents (Reference)  | Agents, Developers (Execution)   |

## The Accessibility Standard

**Invisibility is a bug.** If an Agent cannot read the PBI, the workflow is broken.

A PBI locked inside a web UI without API or MCP integration is useless to an AI developer. The agent must programmatically access the work item without requiring human copy-paste.

**Valid Formats:**
- **Integrated (MCP):** Agent connected to Issue Tracker (Linear/Jira) via MCP
- **Repo-Based:** PBI exists as a file (e.g., `tasks/TICKET-123.md`)

**Anti-Pattern:** PBI exists in a proprietary tracker with no API access. Solution: Implement MCP integration or mirror PBIs as markdown files during sprint planning.

## Anatomy: The 4-Part Structure

An effective PBI acts as a **Pointer**, not a container for the full design.

### 1. The Directive
What to do with explicit scope boundaries.

```
Implement the API Layer for user notification preferences.
Scope: Only touch the `src/api/notifications` folder.
```

### 2. The Context Pointer
Reference to the permanent spec—prevents the PBI from becoming a stale copy.

```
Reference: `plans/notifications/spec.md` Part A for the schema.
See the "Architecture" section for endpoint contracts.
```

### 3. The Verification Pointer
Link to success criteria in the spec.

```
Must pass "Scenario 3: Preference Update" defined in 
`plans/notifications/spec.md` Part B (Contract).
```

### 4. The Refinement Rule
Protocol for when reality diverges from the spec.

```
If implementation requires changing the Architecture, you MUST 
update `spec.md` in the same PR with a changelog entry.
```

## Bounded Agency

Because AI is probabilistic, it requires freedom to explore the "How" (implementation details, syntax choices). However, to prevent hallucination, we bound this freedom with non-negotiable constraints.

**Negotiable (The Path):** Code structure, variable naming, internal logic flow, refactoring approaches.

**Non-Negotiable (The Guardrails):** Steps defined in the PBI, outcome metrics in the Spec, documented anti-patterns, architectural boundaries.

The PBI is not a request for conversation—it's a constrained optimization problem.

## Atomicity & Concurrency

In swarm execution (multiple agents working in parallel), each PBI must be:

**Atomic:** The PBI delivers a complete, working increment. No partial states. If the agent stops mid-task, either the full change lands or nothing does.

**Self-Testable:** Verification criteria must be executable without other pending PBIs completing first. If PBI-102 requires PBI-101's code to test, PBI-102 is not self-testable.

**Isolated:** Changes target distinct files/modules. Two concurrent PBIs modifying the same file create merge conflicts and non-deterministic outcomes.

### Declaring Dependencies

When a PBI requires another to complete first, declare it explicitly:

```
## Dependencies
- Blocked by: PBI-101 (creates the base schema)
- Must merge before: PBI-103 (extends this endpoint)
```

**Anti-Pattern:** Implicit dependencies discovered at merge time. Solution: Identify dependencies during planning; either sequence the work or refactor into independent units.

## PBI Lifecycle

1. **Planning:** Human creates PBI with 4-part structure
2. **Assignment:** PBI assigned to Agent or Developer
3. **Execution:** Agent reads Spec, implements Delta
4. **Review:** Human verifies against Spec's Contract section
5. **Merge:** Code merged, Spec updated if needed
6. **Closure:** PBI archived

## Template

```markdown
# PBI-XXX: [Brief Imperative Title]

## Directive
[What to build/change in 1-2 sentences]

**Scope:**
- [Explicit file/folder boundaries]
- [What NOT to touch]

## Dependencies
- Blocked by: [PBI-YYY if any, or "None"]
- Must merge before: [PBI-ZZZ if any, or "None"]

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

- [The Spec](/patterns/the-spec) — The permanent source of truth PBIs reference
- [Spec-Driven Development](/concepts/spec-driven-development) — The overarching methodology
- [Context Gates](/concepts/context-gates) — Validation checkpoints for PBI completion
