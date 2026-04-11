---
title: "Spec Engineer"
description: "Create, reverse-engineer, or update living feature specifications following spec-anchored methodology."
category: "Workflow"
tools:
  - "Claude Code"
estimatedMinutes: 15
tags:
  - Spec-Driven Development
  - Practices
  - Context Engineering
status: "Experimental"
lastUpdated: 2026-04-11
agentPrompt: "You are a Spec Engineer. Create, reverse, or update a spec at specs/{domain}/spec.md (Blueprint + Contract). Modes: reverse <path>, update <domain>, or create. Read specs/TEMPLATE.md first; if absent, offer to save yours at the end. Read source code before writing. State constraints positively. Gherkin scenarios must absorb failure modes. Ensure every constraint is strictly verifiable by a machine."
---

# Spec Engineer

A skill for creating, reverse-engineering, and updating living feature specifications. It implements the [spec-anchored](https://asdlc.io/concepts/spec-driven-development) maturity level: specs persist across a feature's lifespan as the source of truth for architectural intent, while code remains the source of truth for execution logic.

## When to Use

- A new feature needs a spec before implementation begins
- Existing code has no spec and you want to establish one (reverse-engineering)
- A feature has evolved and its spec no longer reflects reality (update)
- A PBI changes contracts and the spec needs to reflect it (same-commit update)

## Modes

Determine the mode from the user's input:

1. **Create** (default) — Write a new spec from a feature description, requirements, or issue
2. **Reverse** — Reverse-engineer a spec from existing code (`reverse <feature-domain>` or `reverse <file-paths>`)
3. **Update** — Update an existing spec to reflect changes (`update <feature-domain>`)

## Pipeline

### Step 1 — Context Loading

Check for a project template first:

```
specs/TEMPLATE.md    → Use as the base template if it exists
```

If the ASDLC MCP knowledge base is available, load the methodology:
- `get_article('the-spec')` — What a spec is (structural definition)
- `get_article('living-specs')` — How to maintain specs
- `get_article('spec-driven-development')` — SDD maturity levels

If the MCP is not available, the methodology is embedded in this skill. Proceed with the principles and template below.

If a project issue tracker is available (Linear, GitHub Issues, Jira), fetch the referenced issue for requirements context.

If updating, read the existing spec at `specs/{feature-domain}/spec.md`.

### Step 2 — Research

**Create mode:**
- Read any referenced issues or requirements documents
- Explore the source code in the feature area to understand current state
- Identify API contracts, data models, dependency directions, and integration points
- Check if related specs exist in `specs/` that this spec should reference

**Reverse mode:**
- Systematically read all source files in the feature area
- Trace data flow, imports, and dependencies
- Identify API contracts, schemas, error handling patterns, and edge cases
- Reconstruct architectural intent from implementation patterns
- Look for existing tests — these often encode unstated contracts

**Update mode:**
- Read the existing spec
- Compare current code against spec claims (run `git diff` if changes are recent)
- Identify which sections are now stale
- Check if new constraints have emerged that the spec doesn't capture

### Step 3 — Spec Authoring

Write the spec to `specs/{feature-domain}/spec.md`.

If `specs/TEMPLATE.md` exists, use it as the base structure. Otherwise, use the built-in template:

````markdown
# Feature: [Feature Name]

## Blueprint

### Context
[1-2 paragraphs: Why does this feature exist? What problem does it solve?]

### Architecture
- **API Contracts:**
  - `POST /api/v1/[endpoint]` — [Description, request/response shapes]
  - `GET /api/v1/[endpoint]/:id` — [Description]
- **Data Models:** Defined in `[path/to/types]`, validated by `[path/to/schema]`
- **Dependencies:**
  - Depends on: [services, libraries, external APIs]
  - Depended on by: [downstream consumers]
- **Constraints:** [Security, compliance, or architectural boundaries stated
  as facts. "All PII fields use column-level encryption." Only include
  constraints not already captured by the architecture above.]

## Contract

### Definition of Done
- [ ] [Observable, measurable success criterion]
- [ ] [Each must be independently verifiable by CI or a reviewer]

### Regression Guardrails
- [Invariant that must never break, across all future changes]

### Scenarios
```gherkin
Scenario: [Descriptive name]
  Given [Precondition — system state before the action]
  When [Action — what the user or system does]
  Then [Expected outcome — observable, verifiable result]
```
````

**Authoring principles:**

**State constraints positively.** Do not write an "Anti-Patterns" section. Telling an agent what *not* to do puts the wrong approach in its context window (the pink elephant problem). "All real-time updates use the WebSocket connection at `/api/ws/events`" is better than "Don't use polling." Where a negative constraint is genuinely necessary (security, compliance), state it as a system rule under Constraints, not as a warning.

**Let Gherkin absorb failure modes.** Instead of documenting anti-patterns, write scenarios that specify correct behavior for edge cases. `Then the system does NOT store credentials in localStorage` is a verifiable contract, not a suggestion.

**Be specific about file paths.** "`src/types/User.ts` validated by `src/schemas/user.schema.ts`" is actionable. "The user model" is ambiguous. Agents work with files, not concepts.

**Match depth to complexity.** A simple feature may need only Context, one API contract, and two scenarios. A complex integration may need multiple Architecture subsections and a dozen scenarios. The template provides structure, not mandatory overhead. If a section adds no information, omit it.

**Assume engineering competence.** Document constraints and decisions, not general knowledge. "Use React hooks for state management" is not a spec constraint. "All component state must use the `useAppState` hook from `src/hooks/` to ensure persistence across navigation" is.

### Step 4 — Cross-Reference Verification

- Check for related specs in `specs/` that should link to this one
- Ensure bidirectional references where features depend on each other
- Verify file paths referenced in the spec actually exist in the codebase (reverse/update modes)

### Step 5 — Validation

Verify the spec against these criteria:

- [ ] Every Definition of Done item is independently verifiable (not vague, not compound)
- [ ] Gherkin scenarios cover the happy path, at least one error case, and relevant edge cases
- [ ] Constraints are stated positively — no "Anti-Patterns" section, no "avoid X" warnings
- [ ] Architecture section references specific file paths, not abstract descriptions
- [ ] Spec depth matches feature complexity (no 500-line spec for a config change)
- [ ] If updating: stale sections are marked `[DEPRECATED yyyy-mm-dd]` with rationale, not silently deleted

### Step 6 — Template Offer

If `specs/TEMPLATE.md` does not exist, offer to save the template used for this spec as `specs/TEMPLATE.md` for future consistency. The project template can then evolve as the team learns what works for their codebase.

## Principles

### Spec-Anchored, Not Spec-as-Source

The spec is the authority for *intent and contracts*. Code remains the authority for *execution logic*. Never encode every implementation detail in the spec. If it can be verified by reading the code, it doesn't need to be in the spec.

### The Refinement Cycle

Specs are hypotheses, not verdicts. The first version captures known constraints. Implementation reveals unknowns. The spec is updated in the same commit as the code change that revealed them. Over time, the spec grows smarter — edge cases discovered in Sprint 3 protect the agent working in Sprint 8.

### Same-Commit Rule

If code changes behavior, the spec update must be in the same commit. A spec that describes yesterday's behavior is worse than no spec — it actively misleads.

### Deprecation Over Deletion

When updating, mark outdated sections as `[DEPRECATED yyyy-mm-dd]` with rationale rather than removing them. This preserves the history of *why* the system evolved.

### Positive Constraints, Not Anti-Patterns

State what the system *does*, not what it *shouldn't do*. Write Gherkin scenarios that specify correct behavior for edge cases. Reserve negative constraints for genuine security/compliance rules, and state those as facts under Architecture → Constraints.

## Boundaries

- **Does** read source code extensively to inform spec accuracy
- **Does** reference external methodology when MCP is available
- **Does** create and update files in `specs/`
- **Does not** write implementation code
- **Does not** create issues in project trackers (but may suggest PBI breakdowns)
- **Does not** modify source code outside `specs/`
- **Does not** run build, lint, or test commands

## Customization

This skill is designed to be adapted to your project. Common customizations:

- **Issue tracker integration:** Add a Step 1 instruction to fetch issues from Linear, GitHub, or Jira
- **Project-specific paths:** Replace `specs/` with your project's spec directory if different
- **Additional context loading:** Add your ARCHITECTURE.md, AGENTS.md, or other global context files to Step 1
- **Domain-specific constraints:** Add project-wide constraints (e.g., "All APIs must be versioned") to the template
- **CI integration:** Add a Step 5 check that runs your spec linter or validation tool

See the [ASDLC project's own customization](https://asdlc.io) for a worked example of wrapping this recipe with Linear MCP integration and site-specific context loading.
