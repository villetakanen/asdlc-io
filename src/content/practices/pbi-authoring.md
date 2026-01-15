---
title: "PBI Authoring"
description: "How to write Product Backlog Items that agents can read, execute, and verify—with templates and lifecycle guidance."
tags: ["Agile", "Product Backlog Item", "Workflow", "Agent Execution"]
relatedIds: ["patterns/the-pbi", "patterns/the-spec", "practices/living-specs"]
status: "Live"
lastUpdated: 2026-01-13
references:
  - type: "video"
    title: "Beyond Vibe-Coding: Learn Effective AI-Assisted Coding in 4 minutes"
    url: "https://www.youtube.com/watch?v=HR5f2TDC65E"
    publisher: "Vanishing Gradients"
    annotation: "Source material for the 'Prompt for the Plan' tip. Explains the Specify → Plan → Execute workflow."
---

## Definition

**PBI Authoring** is the practice of writing Product Backlog Items optimized for agent execution. This includes structuring the four-part anatomy, ensuring machine accessibility, and managing the PBI lifecycle from planning through closure.

Following this practice produces PBIs that agents can programmatically access, unambiguously interpret, and verifiably complete.

## When to Use

**Use this practice when:**
- Creating work items for agent execution
- Planning a sprint with AI-assisted development
- Converting legacy user stories to agent-ready format
- Setting up a new project's backlog structure

**Skip this practice when:**
- Work is purely exploratory with no defined outcome
- The task is a one-off command (use direct prompting instead)
- Human-only execution with no agent involvement

## Process

### Step 1: Ensure Accessibility

**Invisibility is a bug.** If an agent cannot read the PBI, the workflow is broken.

A PBI locked inside a web UI without API or MCP integration is useless to an AI developer. The agent must programmatically access the work item without requiring human copy-paste.

**Valid access methods:**

| Method | Description |
|--------|-------------|
| **MCP Integration** | Agent connected to Issue Tracker (Linear, Jira, GitHub) via MCP |
| **Repo-Based** | PBI exists as a markdown file (e.g., `tasks/PBI-123.md`) |
| **API Access** | Tracker exposes REST/GraphQL API the agent can query |

**If your tracker has no API access:** Mirror PBIs as markdown files during sprint planning, or implement MCP integration.

### Step 2: Write the Directive

State what to do with explicit scope boundaries. Be imperative, not conversational.

**Good:**
```
Implement the API Layer for user notification preferences.
Scope: Only touch the `src/api/notifications` folder.
```

**Bad:**
```
As a user, I want to manage my notification preferences so that I can control what emails I receive.
```

The second example requires interpretation. The first is executable.

> [!TIP]
> **Prompt for the Plan.** Even if your tool handles planning automatically, explicitly instruct the agent to output its plan for review. This forces the Specify → Plan → Execute loop.
>
> **Example Directive:** "Analyze the Spec, propose a step-by-step plan including which files you will touch, and wait for my approval before editing files."

### Step 3: Add Context Pointers

Reference the permanent spec—don't copy design decisions into the PBI.

```
Reference: `plans/notifications/spec.md` Part A for the schema.
See the "Architecture" section for endpoint contracts.
```

**Why pointers, not copies:** Specs evolve. A copied schema in a PBI becomes stale the moment the spec updates. Pointers ensure the agent always reads the authoritative source.

### Step 4: Define Verification Criteria

Link to success criteria in the spec, or define inline checkboxes.

```
Must pass "Scenario 3: Preference Update" defined in 
`plans/notifications/spec.md` Part B (Contract).
```

Or inline:
```
- [ ] POST /preferences returns 201 on valid input
- [ ] Invalid payload returns 400 with error schema
- [ ] Unit test coverage > 80%
```

### Step 5: Declare Dependencies

Explicitly state what blocks this PBI and what it blocks.

```
## Dependencies
- Blocked by: PBI-101 (creates the base schema)
- Must merge before: PBI-103 (extends this endpoint)
```

**Anti-Pattern:** Implicit dependencies discovered at merge time. Identify during planning; either sequence the work or refactor into independent units.

### Step 6: Set the Refinement Rule

Define what happens when reality diverges from the spec.

```
If implementation requires changing the Architecture, you MUST 
update `spec.md` in the same PR with a changelog entry.
```

Options to specify:
- **Update spec in same PR** — Agent has authority to evolve the design
- **Flag for human review** — Agent stops and requests guidance
- **Proceed with deviation log** — Agent continues but documents the gap

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

## PBI Lifecycle

| Phase | Actor | Action |
|-------|-------|--------|
| **Planning** | Human | Creates PBI with 4-part structure |
| **Assignment** | Human/System | PBI assigned to Agent or Developer |
| **Execution** | Agent | Reads Spec, implements Delta |
| **Review** | Human | Verifies against Spec's Contract section |
| **Merge** | Human/System | Code merged, Spec updated if needed |
| **Closure** | System | PBI archived, linked to commit/PR |

## Common Mistakes

### The User Story Hangover

**Problem:** PBI written as "As a user, I want..." with no explicit scope or verification.

**Solution:** Rewrite in imperative form with scope boundaries and checkable criteria.

### The Spec Copy

**Problem:** PBI contains copied design decisions that drift from the spec.

**Solution:** Use pointers to spec sections, never copy content that lives elsewhere.

### The Hidden Dependency

**Problem:** Two PBIs touch the same files; discovered at merge time.

**Solution:** During planning, map file ownership. If overlap exists, sequence the PBIs or refactor scope.

### The Untestable Increment

**Problem:** PBI verification requires another PBI to complete first.

**Solution:** Ensure each PBI is self-testable. If not possible, merge into a single PBI or create test fixtures.

## Related Patterns

This practice implements:

- **[The PBI](/patterns/the-pbi)** — The structural pattern this practice executes

See also:

- **[The Spec](/patterns/the-spec)** — The permanent context PBIs reference
- **[Living Specs](/practices/living-specs)** — How to maintain the specs PBIs point to
