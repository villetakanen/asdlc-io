---
title: "The ADR"
description: "A structural pattern for capturing architectural decisions with context, rationale, and consequences in an immutable record."
tags: ["Architecture", "Documentation", "Decision Making"]
relatedIds: ["concepts/architecture-decision-record", "practices/adr-authoring", "patterns/the-spec", "patterns/agent-constitution"]
lastUpdated: 2026-01-28
status: "Live"
references:
  - type: "website"
    title: "Documenting Architecture Decisions"
    url: "https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions"
    author: "Michael Nygard"
    published: 2011-11-15
    accessed: 2026-01-28
    annotation: "The original ADR proposal establishing the canonical format."
  - type: "website"
    title: "Architectural Decision Records"
    url: "https://adr.github.io/"
    accessed: 2026-01-28
    annotation: "Community resources, tooling, and template variations."
---

## Definition

The **ADR** (Architecture Decision Record) is a lightweight document pattern for capturing significant architectural decisions. Each ADR records exactly one decision: what was decided, why it was decided, and what consequences follow.

Unlike [The Spec](/patterns/the-spec) which defines the current state of a feature and evolves with the code, an ADR is **immutable**—it captures a snapshot of thinking at a specific moment. When circumstances change, a new ADR supersedes the old one, preserving the decision history.

## The Problem: Decision Amnesia

Architectural knowledge decays rapidly. Six months after a technology choice, teams ask:

- "Why did we choose PostgreSQL over MongoDB?"
- "Who decided we'd use microservices here?"
- "What alternatives were considered for the auth system?"

Without explicit decision records, this context lives only in:
- Email threads (unsearchable, often deleted)
- Slack conversations (ephemeral, noisy)
- Tribal knowledge (leaves when people leave)

For agentic development, this creates a severe problem. An agent refactoring authentication code has no visibility into why Supabase Auth was chosen over Firebase Auth—it may inadvertently violate the constraints that drove the original decision.

## The Solution: Immutable Decision Records

ADRs solve decision amnesia by making architectural decisions **first-class artifacts** in the codebase. Each decision is documented at the moment it's made, with full context preserved.

```
docs/adrs/
├── ADR-001-use-postgresql.md
├── ADR-002-supabase-auth.md
├── ADR-003-event-driven-messaging.md
└── ADR-004-svelte-over-react.md        # Supersedes ADR-001 (hypothetical)
```

The key insight: **decisions are immutable, but their status changes**. ADR-001 might be "Accepted" for two years, then become "Superseded by ADR-010" when the team migrates databases.

## Anatomy

An ADR consists of six sections, each serving a distinct purpose:

### 1. Title

A short, descriptive name with a unique identifier.

**Format:** `ADR-NNN: Decision Summary`

**Examples:**
- ADR-001: Use PostgreSQL for Primary Database
- ADR-007: Adopt Event-Driven Architecture for Order Processing
- ADR-012: Choose Svelte 5 over React for Interactive Components

### 2. Status

The lifecycle state of the decision:

| Status | Meaning |
|--------|---------|
| **Proposed** | Under discussion, not yet decided |
| **Accepted** | Decision made and in effect |
| **Deprecated** | No longer recommended but not replaced |
| **Superseded** | Replaced by a newer ADR (link to successor) |

**Example:** `Status: Superseded by ADR-015`

### 3. Context

The forces and constraints that shaped the decision. This is the *why*—without it, the decision appears arbitrary.

**Include:**
- Business requirements driving the need
- Technical constraints (existing systems, team skills)
- Timeline pressures
- Non-functional requirements (scale, security, compliance)

**Example:**
> We need real-time collaboration features. The existing polling-based approach creates unacceptable latency (>2s) and server load. The team has experience with PostgreSQL but not MongoDB. We have 3 weeks before the feature deadline.

### 4. Decision

What was decided. State it clearly and unambiguously.

**Format:** "We will [do X]" or "We decided to [do X]"

**Example:**
> We will use Supabase Realtime (built on PostgreSQL logical replication) for real-time collaboration features.

### 5. Consequences

The outcomes of this decision—positive, negative, and neutral. **Honesty here is critical.** A decision that hides its downsides will be revisited with confusion.

**Structure:**
- **Positive:** Benefits and capabilities gained
- **Negative:** Trade-offs and limitations accepted
- **Neutral:** Changes that are neither good nor bad

**Example:**
> **Positive:** Leverages existing PostgreSQL expertise. Real-time updates with <100ms latency. No new database to manage.
>
> **Negative:** Tied to Supabase SaaS (vendor lock-in). Less flexible query patterns than dedicated real-time databases. Learning curve for PostgreSQL triggers.
>
> **Neutral:** Requires migration of subscription logic from polling to channels.

### 6. Alternatives Considered

What other options were evaluated and why they were rejected. This prevents future teams from re-evaluating the same options without understanding the original analysis.

**Format:** List each alternative with rejection rationale.

**Example:**
> - **Firebase Realtime Database:** Rejected—would require a second database system and doesn't integrate with existing PostgreSQL data.
> - **Custom WebSocket implementation:** Rejected—significant development effort and maintenance burden for real-time infrastructure.
> - **Pusher:** Rejected—adds external dependency and per-message costs at scale.

## State vs The Spec

The ADR complements [The Spec](/patterns/the-spec) but serves a different purpose:

| Dimension | The Spec | The ADR |
|-----------|----------|---------|
| **Purpose** | Define how it works now | Record why we decided |
| **Mutability** | Living (updated with code) | Immutable (superseded, not edited) |
| **Scope** | Feature-level behavior | Architectural choice |
| **Audience** | Implementers | Archaeologists, reviewers |

A feature Spec might say "Authentication uses Supabase Auth with Magic Link." The ADR explains *why* Supabase Auth was chosen over Firebase Auth.

## Adversarial Decision Review

The [Adversarial Code Review](/patterns/adversarial-code-review) pattern validates code against specs. ADRs need a different review approach—**Adversarial Decision Review**—that evaluates the decision quality itself.

### Critic Agent Prompt

```
You are reviewing an Architecture Decision Record.

Evaluate:
1. **Context Completeness** — Are the forces and constraints clearly articulated? 
   Could someone unfamiliar with the project understand WHY this decision was needed?

2. **Alternatives Rigor** — Were reasonable alternatives considered? 
   Is each rejection rationale specific (not "too complex" without explanation)?

3. **Consequence Honesty** — Are negative outcomes acknowledged?
   Beware ADRs with only positive consequences—every decision has trade-offs.

4. **Reversibility Clarity** — Is it clear how to undo this decision if needed?
   What would trigger reconsideration?

5. **Scope Discipline** — Does this ADR decide exactly one thing?
   Multiple decisions should be separate ADRs.

Output: ACCEPT or list of concerns with suggested improvements.
```

This pattern ensures ADRs maintain quality as high-value context for future decisions.

## Relationship to Other Patterns

**[The Spec](/patterns/the-spec)** — Specs define current feature state; ADRs explain the architectural choices that constrain specs. An ADR might mandate "all API routes use REST," and feature specs implement within that constraint.

**[Agent Constitution](/patterns/agent-constitution)** — ADRs can become constitutional rules. "ADR-003: All database migrations must be backward-compatible" may be promoted to an agent constitution constraint that the agent must not violate.

**[Context Engineering](/concepts/context-engineering)** — ADRs are high-value context for agents. Including relevant ADRs in agent context helps prevent accidental violations of past architectural decisions.

**[Request for Comments](/concepts/request-for-comments)** — RFCs are proposals that spawn ADRs. An RFC gathers feedback; acceptance creates one or more ADRs.

**[ADR Authoring](/practices/adr-authoring)** — The practice that implements this pattern with templates, lifecycle guidance, and file organization.
