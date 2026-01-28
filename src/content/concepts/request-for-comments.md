---
title: "Request for Comments"
description: "A collaborative proposal document for significant changes that require team consensus before becoming formal decisions."
tags: ["RFC", "Architecture", "Collaboration", "Decision Making"]
relatedIds: ["concepts/architecture-decision-record", "patterns/the-adr"]
lastUpdated: 2026-01-28
status: "Live"
references:
  - type: "website"
    title: "Rust RFCs"
    url: "https://rust-lang.github.io/rfcs/"
    accessed: 2026-01-28
    annotation: "Rust's RFC process for language and ecosystem changes."
  - type: "website"
    title: "React RFCs"
    url: "https://github.com/reactjs/rfcs"
    accessed: 2026-01-28
    annotation: "React's RFC process for significant API and behavior changes."
---

## Definition

A **Request for Comments (RFC)** is a proposal document that solicits feedback on significant changes before they become formal decisions. Unlike an [ADR](/concepts/architecture-decision-record) which records a decision already made, an RFC opens a decision for collaborative input.

The term originates from the IETF (Internet Engineering Task Force), where RFCs have defined internet protocols since 1969. Modern software projects—Rust, React, Ember, Python—have adopted RFC processes for significant changes that affect many stakeholders.

## Key Characteristics

### Proposal-Oriented

RFCs propose; ADRs record. An RFC says "We should consider doing X" while an ADR says "We decided to do X." The RFC process concludes with either acceptance (spawning ADRs) or rejection.

### Collaborative

RFCs are designed for multi-stakeholder input. They include explicit comment periods and revision cycles. The goal is to surface concerns *before* committing to a direction.

### Scope

RFCs typically cover changes that:
- Affect multiple teams or systems
- Require significant migration effort
- Introduce breaking changes
- Establish new architectural patterns

Single-component decisions usually don't warrant an RFC—a direct ADR suffices.

## Relationship to ADRs

| Dimension | RFC | ADR |
|-----------|-----|-----|
| **Purpose** | Propose and gather feedback | Record a decision |
| **Timing** | Before decision | After decision |
| **Mutability** | Revised during comment period | Immutable once accepted |
| **Output** | One or more ADRs | Implementation guidance |

An RFC may spawn multiple ADRs. For example, "RFC: Migrate from Firebase to Supabase" might result in:
- ADR-010: Use Supabase Auth
- ADR-011: Use Supabase Realtime for subscriptions
- ADR-012: Migration strategy for existing users

## ASDLC Usage

In ASDLC, RFCs are appropriate for:
- **Major architectural pivots** (changing database providers, frontend frameworks)
- **Cross-cutting changes** (new authentication model, API versioning strategy)
- **Migration plans** (multi-phase transitions that affect multiple features)

For routine architectural decisions within a single feature domain, a direct ADR is sufficient.

Applied in:
- [The ADR](/patterns/the-adr) — Pattern for recording decisions that result from RFCs
- [ADR Authoring](/practices/adr-authoring) — Includes RFC-to-ADR workflow

See also:
- [Context Engineering](/concepts/context-engineering) — RFCs as context for understanding project direction
