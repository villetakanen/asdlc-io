---
title: "Living Specs"
description: "A practical guide to creating, maintaining, and evolving specification documents that serve as permanent sources of truth in version-controlled repositories."
tags: ["Documentation", "Spec-Driven Development", "Living Documentation", "Best Practices"]
relatedIds: ["The Spec", "Spec-Driven Development", "Context Engineering"]
status: "Draft"
lastUpdated: 2025-01-15
---

## Introduction

This guide provides practical instructions for implementing [The Spec](/patterns/the-spec) pattern in your projects. While the pattern describes *what* a living spec is and *why* it matters, this practice guide focuses on *how* to create and maintain specs effectively.

A **Living Spec** is a version-controlled document that evolves alongside your codebase, serving as the permanent source of truth for feature design and quality contracts. Unlike traditional specs that become outdated after implementation, living specs remain synchronized with the actual system state.

## When to Create a Spec

Create a new spec when starting work that involves:

### Feature Domains
Any new feature that introduces architectural patterns, API contracts, or data models that other parts of the system will depend on.

**Examples:**
- User authentication system
- Payment processing pipeline
- Real-time notification service
- Search and filtering engine

**Non-Examples (Don't create specs for):**
- Simple bug fixes that don't change contracts
- Trivial UI text changes
- Configuration value updates
- Dependency version bumps

### User-Facing Workflows
Features with defined user journeys and acceptance criteria that need to be preserved for future reference.

**Examples:**
- Multi-step checkout process
- Dashboard data visualization
- Admin approval workflows

### Cross-Team Dependencies
Any feature that other teams will integrate with, requiring clear contract definitions.

**Examples:**
- Public API endpoints
- Shared component libraries
- Event streaming schemas

## When to Update a Spec

Update an existing spec whenever:

1. **API Contracts Change:** New endpoints, modified request/response payloads, or deprecated routes
2. **Data Schemas Evolve:** Database migrations, new fields, or constraint changes
3. **Quality Targets Shift:** New performance requirements, security standards, or accessibility rules
4. **Anti-Patterns Discovered:** During code review or incident post-mortems, document what NOT to do
5. **Architecture Decisions Made:** Any ADR (Architecture Decision Record) should update relevant specs
6. **Functionality Removed:** Mark deprecated sections clearly rather than deleting history

**Golden Rule:** If the code behavior changes, the spec MUST be updated in the same commit or pull request.

## File Structure and Organization

Organize specs by **feature domain**, not by sprint or ticket number. This ensures discoverability for developers (human or AI) who don't know the project's PBI history.

### Standard Layout

```/dev/null/file-structure-example.txt#L1-15
/project-root
├── ARCHITECTURE.md              # Global system rules
├── plans/                       # Feature-level specs
│   ├── user-authentication/
│   │   └── spec.md
│   ├── payment-processing/
│   │   └── spec.md
│   ├── notifications/
│   │   └── spec.md
│   └── search-engine/
│       └── spec.md
└── src/                         # Implementation code
    ├── features/
    │   ├── auth/
    │   ├── payments/
```

### Naming Conventions

- **Directory Name:** Use kebab-case, match the feature's conceptual name (not the code module name)
- **File Name:** Always `spec.md` for consistency
- **Location:** `/plans/{feature-domain}/spec.md`

## Spec Anatomy: The Two-Part Structure

Every spec consists of two main sections:

### Part A: The Blueprint (Design)

Defines **implementation constraints** to prevent agents from hallucinating invalid architectures.

**Required Elements:**

#### 1. Context
Why does this feature exist? What business problem does it solve?

```/dev/null/context-example.md#L1-4
### Context
The user notification system delivers real-time alerts for critical events 
(payment failures, security warnings) without requiring page refresh, 
reducing user drop-off during checkout by an estimated 15%.
```

#### 2. Architecture
Explicit definitions of API contracts, data schemas, and dependency directions.

```/dev/null/architecture-example.md#L1-9
### Architecture
- **Transport:** WebSocket connection via `/api/ws/notifications`
- **State Management:** Redux slice `notifications` with immutable updates
- **Persistence:** IndexedDB for offline queue (max 100 items)
- **Data Flow:** Backend → WebSocket → Redux → UI (unidirectional)
- **Schema:** See `src/types/Notification.ts` (Zod validated)
- **Dependencies:** 
  - Depends on: Auth service (for user session)
  - Depended by: Dashboard, Checkout, Admin Panel
```

#### 3. Anti-Patterns
"Negative constraints" that tell agents what *not* to do.

```/dev/null/anti-patterns-example.md#L1-5
### Anti-Patterns
- ❌ Do NOT use `localStorage` for notification state (exceeds quota with >100 notifications)
- ❌ Do NOT poll REST endpoints (defeats real-time intent, creates unnecessary load)
- ❌ Do NOT use global event emitters outside Redux (violates data flow pattern)
- ❌ Do NOT store sensitive data in notification payloads (use reference IDs only)
```

### Part B: The Contract (Quality)

Defines **verification rules** that exist independently of any specific task. This section shifts the "Definition of Done" left.

**Required Elements:**

#### 1. Definition of Done
Observable success criteria that must be met for the feature to be considered complete.

```/dev/null/dod-example.md#L1-5
### Definition of Done
- [ ] Notification appears in UI within 100ms of WebSocket message receipt
- [ ] Unread count badge updates without full page reload
- [ ] System survives network interruption (auto-reconnect within 5 seconds)
- [ ] All notifications support screen reader announcements
```

#### 2. Regression Guardrails
Critical invariants that must never break, even during refactoring.

```/dev/null/guardrails-example.md#L1-5
### Regression Guardrails
- Must handle malformed JSON gracefully (log error, don't crash UI)
- Must not exceed 50MB memory usage for 1000+ notifications
- Must support WCAG 2.1 AA accessibility standards
- Must degrade gracefully when WebSocket unavailable (show warning banner)
```

#### 3. Scenarios
Gherkin-style user journeys that can be converted into E2E tests.

```/dev/null/scenarios-example.md#L1-9
### Scenarios

**Scenario: Critical Alert Display**
- Given: User is logged in with active WebSocket connection
- When: Backend publishes a "payment_failed" event
- Then: Red toast notification appears in top-right corner within 100ms
- And: Notification persists until user dismisses or 10s timeout expires
- And: Screen reader announces "Critical alert: Payment failed"
```

## Maintenance Protocol

### 1. Treat Specs as Code

- **Code Review Required:** All spec updates must go through the same review process as source code
- **Version Control:** Commit specs to the repository, never store them in wikis or shared drives
- **CI Integration:** Consider linting specs for broken links or outdated schema references

### 2. Keep Specs in Sync

- **Same Commit Rule:** If code changes behavior, update the spec in the same commit
- **PR Checklist Item:** Add "Spec updated (if applicable)" to your pull request template
- **Commit Message Convention:** Use prefixes like `docs(spec):` to make spec changes visible

**Example:**
```/dev/null/commit-example.txt#L1-4
git commit -m "feat(notifications): add SMS fallback

- Implements SMS delivery when WebSocket fails
- Updates /plans/notifications/spec.md with new transport layer"
```

### 3. Deprecation Over Deletion

Mark outdated sections as `[DEPRECATED]` rather than removing them. This preserves historical context for understanding why certain decisions were made.

```/dev/null/deprecation-example.md#L1-6
### Architecture

**[DEPRECATED 2024-12-01]** 
~~WebSocket transport via Socket.io library~~
Replaced by native WebSocket API to reduce bundle size by 45KB.

**Current (2024-12-01+)**
```

### 4. Bidirectional Linking

Create explicit links between code and specs:

**In Code:**
```/dev/null/code-comment-example.ts#L1-4
// Notification delivery must meet 100ms latency requirement
// See: /plans/notifications/spec.md#contract
async function deliverNotification(payload: Notification) {
  // ...
```

**In Spec:**
```/dev/null/spec-reference-example.md#L1-3
### Data Schema
Implemented in `src/types/Notification.ts` using Zod validation.
See also: `src/services/NotificationService.ts` for delivery logic.
```

## Best Practices

### 1. Start with Anti-Patterns
Before describing what agents *should* do, tell them what they *must not* do. This prevents the most common hallucinations.

### 2. Use Concrete Examples
Show actual API payloads, database schemas, and code snippets rather than abstract descriptions.

**Weak:**
```/dev/null/weak-example.md#L1-2
### API Contract
The endpoint accepts user data and returns a token.
```

**Strong:**
```/dev/null/strong-example.md#L1-12
### API Contract
**Endpoint:** `POST /api/v1/auth/login`

**Request:**
```json
{ "email": "user@example.com", "password": "***" }
```

**Response (Success):**
```json
{ "token": "jwt.abc.xyz", "expiresIn": 3600 }
```
```

### 3. Reference, Don't Duplicate
Link to authoritative type definitions rather than copying them into the spec.

**Prefer:**
```/dev/null/reference-example.md#L1-3
### Data Schema
See `src/types/Notification.ts` for the canonical Zod schema.
Current version supports: `info`, `warning`, `error`, `success` severity levels.
```

**Avoid:**
```/dev/null/duplication-example.md#L1-8
### Data Schema
```typescript
type Notification = {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  // ... 50 more lines of duplicated code
}
```
```

### 4. Version Major Milestones
Add a changelog section to track significant architectural shifts.

```/dev/null/changelog-example.md#L1-9
## Changelog

### 2024-12-01: WebSocket Native Migration
Replaced Socket.io with native WebSocket API. Reduced bundle size by 45KB.
Migration guide: See `/docs/migrations/socketio-to-native.md`

### 2024-09-15: Initial Implementation
Launched notification system with Redux state management and WebSocket transport.
```

### 5. Write Scenarios Before Code
Writing Gherkin scenarios during planning clarifies intent and prevents scope creep.

### 6. Test Against the Spec
Periodically audit your code against the spec to catch drift:

```/dev/null/audit-example.sh#L1-4
# Example audit checklist:
# 1. Do all API endpoints match the documented contracts?
# 2. Are anti-patterns absent from the codebase?
# 3. Do E2E tests cover all documented scenarios?
```

## Spec Template

Use this template as a starting point for new specs:

```/dev/null/spec-template.md#L1-42
# Feature: [Feature Name]

## Blueprint

### Context
[Why does this feature exist? What business problem does it solve?]

**Success Metrics:**
- [Quantifiable outcome 1]
- [Quantifiable outcome 2]

### Architecture

**API Contracts:**
- `[HTTP METHOD] /api/v1/[endpoint]` - [Description]

**Data Models:**
- [Schema name]: See `[file path]`
- [Key relationships or constraints]

**Dependencies:**
- Depends on: [Other features/services this requires]
- Depended by: [Other features/services that depend on this]

**Data Flow:**
[Brief description or ASCII diagram of how data moves through the system]

### Anti-Patterns
- ❌ [Specific thing agents must avoid]
- ❌ [Another forbidden pattern with rationale]

## Contract

### Definition of Done
- [ ] [Observable success criterion 1]
- [ ] [Observable success criterion 2]
- [ ] [Observable success criterion 3]

### Regression Guardrails
- [Critical invariant that must never break, with specific threshold]
- [Another guardrail with rationale]

### Scenarios

**Scenario: [Name of User Journey]**
- Given: [Precondition]
- When: [User action]
- Then: [Expected outcome]
- And: [Additional assertion]
```

## Common Anti-Patterns to Avoid

### The "Stale Spec" Problem
**Symptom:** The spec is created during planning but never updated as the feature evolves.

**Solution:** Make spec updates a mandatory part of the Definition of Done for every PBI that touches the feature. Add a PR template checklist item: "[ ] Spec updated to reflect changes."

### The "Spec in Slack" Problem
**Symptom:** Critical design decisions are discussed in Slack or Jira comments but never committed to the repository.

**Solution:** After reaching consensus in chat, immediately update `spec.md` with a commit message linking to the discussion thread. Use the spec as the "record of decision."

### The "Monolithic Spec" Problem
**Symptom:** A single 5000-line spec tries to document the entire application.

**Solution:** Split into feature-domain specs. Each independently deployable feature gets its own `/plans/{feature}/spec.md`. Use `ARCHITECTURE.md` for global cross-cutting concerns only.

### The "Spec-as-Tutorial" Problem
**Symptom:** The spec reads like a walkthrough for junior developers, filled with basic programming concepts.

**Solution:** Assume engineering competence. Document *constraints* and *decisions*, not general knowledge. Link to external resources for foundational concepts.

### The "Copy-Paste Code" Problem
**Symptom:** The spec duplicates large chunks of code from the implementation.

**Solution:** Reference the canonical source with file paths and line numbers. Only include minimal examples to illustrate patterns.

## Integration with ASDLC Workflows

### Relationship to PBIs
- **PBI = Delta:** Describes the *change* ("Add SMS fallback")
- **Spec = State:** Describes the *current rules* ("Notifications must deliver within 100ms")

When working on a PBI, always read the relevant spec first. Update the spec if your PBI changes contracts or quality rules.

### Relationship to Context Gates
Specs serve as the "acceptance criteria" verified at quality gates. Before merging:
1. Verify code satisfies all Definition of Done items in the spec
2. Confirm no anti-patterns were introduced
3. Validate all scenarios pass in E2E tests

### Relationship to Agent Constitution
- **Global Rules:** Defined in `ARCHITECTURE.md` (applies to all features)
- **Local Rules:** Defined in feature specs (applies to specific domains)

When agents receive tasks, they should load both the global constitution and the relevant feature spec into their context window.

## Tooling Recommendations

### Linting and Validation
- **Markdown Linters:** Use tools like `markdownlint` to enforce consistent formatting
- **Link Checkers:** Validate that all file references in specs point to existing files
- **Schema Validators:** If your spec references Zod schemas, validate they exist in the codebase

### Documentation Generation
- **API Docs:** Generate OpenAPI specs from code, reference them from specs
- **Type Docs:** Use TypeDoc or similar to generate type documentation, link from specs
- **Diagram Automation:** Use Mermaid or PlantUML for architecture diagrams

### Version Control
- **Protected Files:** Consider branch protection rules that require reviews for spec changes
- **CODEOWNERS:** Assign architectural ownership of specs to specific team members
- **Change Notifications:** Set up CI notifications when specs are modified

## Measuring Success

Track these metrics to evaluate your living specs practice:

1. **Spec Coverage:** % of features with documented specs
2. **Sync Rate:** % of code changes that include corresponding spec updates
3. **Agent Efficiency:** Time agents spend searching for context vs. executing tasks
4. **Drift Detection:** Number of incidents caused by outdated documentation

## References

- [The Spec Pattern](/patterns/the-spec) - Conceptual foundation for this practice
- [Spec-Driven Development](/concepts/spec-driven-development) - Development philosophy
- [Context Engineering](/concepts/context-engineering) - Optimizing context for agents
- [Living Documentation (Martin Fowler)](https://martinfowler.com/bliki/LivingDocumentation.html)