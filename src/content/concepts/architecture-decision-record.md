---
title: "Architecture Decision Record"
description: "A lightweight document that captures a significant architectural decision, its context, and consequences at a specific point in time."
tags: ["Architecture", "Documentation", "Decision Making", "ADR"]
relatedIds: ["patterns/the-adr", "practices/adr-authoring", "concepts/request-for-comments"]
lastUpdated: 2026-01-28
status: "Live"
references:
  - type: "website"
    title: "Documenting Architecture Decisions"
    url: "https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions"
    author: "Michael Nygard"
    published: 2011-11-15
    accessed: 2026-01-28
    annotation: "The original ADR proposal that established the format and philosophy."
  - type: "website"
    title: "ADR GitHub Organization"
    url: "https://adr.github.io/"
    accessed: 2026-01-28
    annotation: "Community hub for ADR tooling, templates, and best practices."
---

## Definition

An **Architecture Decision Record (ADR)** is a document that captures a significant architectural decision along with its context, rationale, and consequences. Unlike living documentation that evolves with the codebase, ADRs are **immutable snapshots**—they record what was decided and why at a specific moment in time.

The format was introduced by Michael Nygard in 2011 as a lightweight alternative to heavyweight architecture documentation. Each ADR addresses exactly one decision, making the record atomic and traceable.

## Key Characteristics

### Immutability

ADRs are not updated when circumstances change. Instead, a new ADR is created that **supersedes** the original. This preserves the archaeological record of how architectural thinking evolved.

### Lightweight

A single ADR fits on one or two pages. The format resists the temptation to over-document, focusing only on the decision and its immediate context.

### Decision-Focused

ADRs capture *decisions*, not designs or implementations. The question answered is "What did we decide?" not "How does it work?" (that belongs in specs) or "How do I build it?" (that belongs in implementation guides).

### Contextual

Every ADR includes the forces and constraints that shaped the decision. This context is critical—a decision that seems wrong in isolation often makes sense when the original constraints are understood.

## Standard Sections

The canonical ADR format includes:

| Section | Purpose |
|---------|---------|
| **Title** | Short name with ID (e.g., "ADR-001: Use PostgreSQL for Primary Database") |
| **Status** | Lifecycle state: Proposed, Accepted, Deprecated, Superseded by ADR-XXX |
| **Context** | What forces are at play? What problem needs solving? |
| **Decision** | What was decided? |
| **Consequences** | Positive, negative, and neutral outcomes of this decision |
| **Alternatives Considered** | What other options were evaluated and why they were rejected? |

## ASDLC Usage

In ASDLC, ADRs serve as **high-value context** for agents. When an agent works on authentication, knowing "ADR-003: Chose Supabase Auth over Firebase Auth" provides essential architectural constraints.

ADRs may also evolve into [Agent Constitution](/patterns/agent-constitution) rules—an ADR stating "All database migrations must be backward-compatible" becomes a constitutional constraint that agents must not violate.

Applied in:
- [The ADR](/patterns/the-adr) — Structural pattern for ADR anatomy
- [ADR Authoring](/practices/adr-authoring) — Practical guide for writing ADRs
- [Request for Comments](/concepts/request-for-comments) — Related concept for grouped proposals

See also:
- [The Spec](/patterns/the-spec) — Living documentation that ADRs inform but do not replace
- [Context Engineering](/concepts/context-engineering) — ADRs as context sources for agents
