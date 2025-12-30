---
title: "Living Specs"
description: "Practical guide to creating and maintaining specs that evolve alongside your codebase."
tags: ["Documentation", "Spec-Driven Development", "Living Documentation"]
relatedIds: ["patterns/the-spec", "patterns/the-pbi", "concepts/context-engineering"]
status: "Experimental"
lastUpdated: 2025-12-22
---

## Overview

This guide provides practical instructions for implementing the [Specs](/patterns/the-spec) pattern. While the pattern describes *what* specs are and *why* they matter, this guide focuses on *how* to create and maintain them.

## When to Create a Spec

Create a spec when starting work that involves:

**Feature Domains** — New functionality that introduces architectural patterns, API contracts, or data models that other parts of the system depend on.

**User-Facing Workflows** — Features with defined user journeys and acceptance criteria that need preservation for future reference.

**Cross-Team Dependencies** — Any feature that other teams will integrate with, requiring clear contract definitions.

**Don't create specs for:** Simple bug fixes, trivial UI changes, configuration updates, or dependency bumps.

## Spec granularity

A spec should be detailed enough to serve as a contract for the feature, but not so detailed that it becomes a maintenance burden.

Some spec features, like gherkin scenarios, are not always necessary if the feature is simple or well-understood. 

## When to Update a Spec

Update an existing spec when:

- API contracts change (new endpoints, modified payloads, deprecated routes)
- Data schemas evolve (migrations, new fields, constraint changes)
- Quality targets shift (performance, security, accessibility requirements)
- Anti-patterns are discovered (during review or post-mortems)
- Architecture decisions are made (any ADR should update relevant specs)

**Golden Rule:** If code behavior changes, the spec MUST be updated in the same commit.

## File Structure

Organize specs by **feature domain**, not by sprint or ticket number.

```
/project-root
├── ARCHITECTURE.md           # Global system rules
├── plans/                    # Feature-level specs
│   ├── user-authentication/
│   │   └── spec.md
│   ├── payment-processing/
│   │   └── spec.md
│   └── notifications/
│       └── spec.md
└── src/                      # Implementation code
```

**Conventions:**
- Directory name: kebab-case, matches the feature's conceptual name
- File name: always `spec.md`
- Location: `/plans/{feature-domain}/spec.md`
- Scope: one spec per independently evolvable feature

## Maintenance Protocol

### Same-Commit Rule

If code changes behavior, update the spec in the same commit. Add "Spec updated" to your PR checklist.

```
git commit -m "feat(notifications): add SMS fallback

- Implements SMS delivery when WebSocket fails
- Updates /plans/notifications/spec.md with new transport layer"
```

### Deprecation Over Deletion

Mark outdated sections as deprecated rather than removing them. This preserves historical context.

```markdown
### Architecture

**[DEPRECATED 2024-12-01]**
~~WebSocket transport via Socket.io library~~
Replaced by native WebSocket API to reduce bundle size.

**Current:**
Native WebSocket connection via `/api/ws/notifications`
```

### Bidirectional Linking

Link code to specs and specs to code:

```typescript
// Notification delivery must meet 100ms latency requirement
// See: /plans/notifications/spec.md#contract
```

```markdown
### Data Schema
Implemented in `src/types/Notification.ts` using Zod validation.
```

## Template

```markdown
# Feature: [Feature Name]

## Blueprint

### Context
[Why does this feature exist? What business problem does it solve?]

### Architecture
- **API Contracts:** `[METHOD] /api/v1/[endpoint]` - [Description]
- **Data Models:** See `[file path]`
- **Dependencies:** [What this depends on / what depends on this]

### Anti-Patterns
- [What agents must avoid, with rationale]

## Contract

### Definition of Done
- [ ] [Observable success criterion]

### Regression Guardrails
- [Critical invariant that must never break]

### Scenarios
**Scenario: [Name]**
- Given: [Precondition]
- When: [Action]
- Then: [Expected outcome]
```

## Anti-Patterns

### The Stale Spec
**Problem:** Spec created during planning, never updated as the feature evolves.

**Solution:** Make spec updates mandatory in Definition of Done. Add PR checklist item.

### The Spec in Slack
**Problem:** Design decisions discussed in chat but never committed to the repo.

**Solution:** After consensus, immediately update `spec.md` with a commit linking to the discussion.

### The Monolithic Spec
**Problem:** A single 5000-line spec tries to document the entire application.

**Solution:** Split into feature-domain specs. Use `ARCHITECTURE.md` only for global cross-cutting concerns.

### The Spec-as-Tutorial
**Problem:** Spec reads like a beginner's guide, full of basic programming concepts.

**Solution:** Assume engineering competence. Document constraints and decisions, not general knowledge.

### The Copy-Paste Code
**Problem:** Spec duplicates large chunks of implementation code.

**Solution:** Reference canonical sources with file paths. Only include minimal examples to illustrate patterns.

## References

- [Specs Pattern](/patterns/the-spec) — Conceptual foundation
- [The PBI](/patterns/the-pbi) — Execution units that reference specs
- [Living Documentation (Martin Fowler)](https://martinfowler.com/bliki/LivingDocumentation.html)
