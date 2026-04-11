---
title: Living Specs
longTitle: "Living Specs: Creating and Maintaining Specifications That Evolve With Your Code"
description: "Practical guide to writing, maintaining, and evolving feature specs for agentic development. Covers spec creation, the refinement cycle, maintenance protocols, and common failure modes."
tags:
  - Spec-Driven Development
  - Practices
  - Context Engineering
  - AI Agents
  - Verification
status: "Live"
relatedIds: ["patterns/the-spec", "concepts/spec-driven-development", "concepts/triple-debt-model", "patterns/adversarial-code-review", "concepts/context-engineering", "practices/feature-assembly", "concepts/gherkin", "concepts/learning-loop"]
lastUpdated: 2026-04-11
references:
  - type: website
    title: "How to Write a Good Spec for AI Agents"
    author: "Addy Osmani"
    url: "https://addyosmani.com/blog/spec-for-ai-agents/"
    published: 2026-03-15
    accessed: 2026-04-11
    annotation: "Practitioner guidance on writing specs optimized for agent consumption: structured sections, explicit constraints, and verifiable acceptance criteria."
  - type: website
    title: "Using Spec-Driven Development with Claude Code"
    author: "Heeki Park"
    url: "https://heeki.medium.com/using-spec-driven-development-with-claude-code-4a1ebe5d9f29"
    published: 2026-03-01
    accessed: 2026-04-11
    annotation: "Production case study demonstrating a Requirements → Design → Tasks → Implementation pipeline with modular task breakdowns and iterative refinement."
  - type: website
    title: "Understanding Spec-Driven Development: Kiro, spec-kit, and Tessl"
    author: "Birgitta Böckeler"
    url: "https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html"
    published: 2025-10-15
    accessed: 2026-04-11
    annotation: "Defines the SDD maturity ladder (spec-first → spec-anchored → spec-as-source) and introduces living specs as evolving artifacts that grow with implementation."
  - type: website
    title: "How to Write a Great AGENTS.md: Lessons from Over 2,500 Repositories"
    author: "GitHub Blog"
    url: "https://github.blog/engineering/how-to-write-agents-md/"
    published: 2026-03-20
    accessed: 2026-04-11
    annotation: "Empirical analysis of 2,500+ agent context files. Key finding: focused, minimal context outperforms comprehensive documentation. Directly applicable to spec authoring."
  - type: website
    title: "Living Documentation: Continuous Knowledge Sharing by Design"
    author: "Cyrille Martraire"
    url: "https://www.oreilly.com/library/view/living-documentation-continuous/9780134689418/"
    published: 2019-05-30
    accessed: 2026-04-11
    annotation: "The foundational text on Living Documentation — documentation that evolves alongside code, rooted in Domain-Driven Design principles."
  - type: website
    title: "Spec-Driven Development with Claude Code"
    author: "Pimzino"
    url: "https://github.com/Pimzino/claude-code-spec-workflow"
    published: 2026-02-15
    accessed: 2026-04-11
    annotation: "Open-source reference workflow implementing a four-phase spec-driven pipeline: Requirements → Design → Tasks → Implementation."
  - type: website
    title: "From Technical Debt to Cognitive and Intent Debt"
    author: "Margaret-Anne Storey"
    url: "https://arxiv.org/abs/2603.22106"
    published: 2026-03-23
    accessed: 2026-04-11
    annotation: "The Triple Debt Model. Specs are the primary mitigation for Intent Debt — the erosion of traceable connections between requirements and implementation."
  - type: website
    title: "Martin Fowler Fragment: January 8, 2026"
    author: "Martin Fowler"
    url: "https://martinfowler.com/fragments/2026-01-08.html"
    published: 2026-01-08
    accessed: 2026-04-11
    annotation: "Commentary on Anthropic research and Kent Beck's critique of spec-driven approaches — specs must accommodate learning during implementation."
---

## Overview

This guide provides practical instructions for implementing the [Specs](/patterns/the-spec) pattern. Where the pattern defines *what* specs are and *why* they matter, this guide focuses on *how* to write, structure, maintain, and evolve them.

The ASDLC targets the **spec-anchored** maturity level identified by Birgitta Böckeler: specs persist across a feature's entire lifespan, accumulating lessons from implementation. They are not planning artifacts that decay after the first sprint. They are not the sole source file that replaces code. They are the living record of architectural intent — the artifact that prevents [Intent Debt](/concepts/triple-debt-model) from accumulating silently.

## When to Create a Spec

Create a spec when the work introduces constraints that future sessions need to know about:

**Feature domains** — New functionality with API contracts, data models, or architectural patterns that other parts of the system depend on. If breaking this feature would break something else, it needs a spec.

**User-facing workflows** — Features with defined user journeys and acceptance criteria. The spec captures what "correct" looks like so agents can verify it.

**Cross-team dependencies** — Any feature that other teams integrate with. The spec serves as the contract between teams.

**Don't create specs for** bug fixes, configuration changes, dependency bumps, or one-off tasks where the existing spec (or lack thereof) already captures the relevant constraints. A spec that adds no information the codebase doesn't already express is maintenance burden, not value.

## Spec Anatomy

Every spec consists of two parts that mirror the two questions an agent needs answered: "what am I building?" and "how do I know it works?"

### Blueprint (Design)

The Blueprint defines **implementation constraints** — the architectural decisions, API contracts, data schemas, and anti-patterns that prevent agents from hallucinating invalid architectures.

A good Blueprint contains:

- **Context** — Why does this feature exist? What problem does it solve? One paragraph, not a product brief.
- **Architecture** — API contracts (`POST /api/v1/notifications`), data models (reference the Zod schema or TypeScript type file), dependency directions (what this depends on, what depends on this). Be specific: file paths, endpoint signatures, schema names.
- **Constraints** — Security, compliance, or architectural boundaries stated as facts about the system. "Authentication tokens must not appear in URL parameters." "All real-time updates use the WebSocket connection defined above." These are rules, not warnings — state them the same way you state any other architectural decision.

### Contract (Quality)

The Contract defines **verification rules** — the criteria that exist independently of any specific task and that [Quality Gates](/patterns/context-gates) can check mechanically.

A good Contract contains:

- **Definition of Done** — Observable success criteria. "Notification delivered to client within 100ms of trigger event" is verifiable. "System performs well" is not.
- **Regression Guardrails** — Invariants that must never break, even when the feature evolves. "All API endpoints return structured error responses with error codes" survives across every PBI that touches the feature.
- **Scenarios** — [Gherkin](/concepts/gherkin)-style behavioral specifications that define expected behavior without dictating implementation. These are the specs that [Adversarial Code Review](/patterns/adversarial-code-review) verifies against.

```gherkin
Scenario: SMS fallback on WebSocket failure
  Given a user has SMS notifications enabled
  And the WebSocket connection has been unavailable for 30 seconds
  When a priority notification is triggered
  Then the system delivers via SMS within 5 seconds
  And logs the fallback event with reason "websocket_timeout"
```

The Gherkin scenario above is both human-readable and machine-verifiable. A Critic Agent can check implementation against it without ambiguity. If the Critic *can't* verify a scenario, the scenario is ambiguous — which means the spec needs work, not the review process.

Note that well-written scenarios also absorb what teams traditionally document as "anti-patterns." Instead of warning agents "don't silently drop notifications," you write a scenario that specifies the fallback path. The agent implements *toward* passing the scenario, not *away from* a list of don'ts.

## Writing for Agents

Specs serve two audiences: humans who design and govern features, and agents who implement and verify them. Writing for both requires specific discipline.

**Be explicit about constraints.** Agents don't infer. "The API should be fast" means nothing. "All API responses must complete within 200ms at p99 under 1000 req/s load" is a constraint an agent can implement and a gate can verify.

**Use file paths, not descriptions.** "The user model" is ambiguous. "`src/types/User.ts` validated by `src/schemas/user.schema.ts`" is actionable. Agents work with files, not concepts.

**State constraints positively.** Telling an agent what *not* to do puts the wrong approach in its context window — the pink elephant problem. "Don't use polling for real-time updates" makes polling salient. "All real-time updates use the WebSocket connection at `/api/ws/notifications`" gives the agent one path, not two paths where one is crossed out. Where a negative constraint is genuinely necessary (security, compliance), state it as a system rule under Architecture, not as a warning: "Authentication tokens must not appear in URL parameters" is a constraint. "Avoid putting tokens in URLs" is a suggestion.

**Keep specs focused.** The GitHub AGENTS.md study of 2,500+ repositories found that focused, minimal context consistently outperforms comprehensive documentation. The same applies to specs. A 200-line spec for a well-scoped feature domain outperforms a 2,000-line spec that tries to document an entire subsystem. If your spec is growing past 500 lines, it's covering multiple features — split it.

**Structure predictably.** Every spec should have the same section headings (Blueprint → Context, Architecture, Anti-Patterns; Contract → Definition of Done, Guardrails, Scenarios). Agents learn patterns. Consistent structure means the agent spends zero tokens figuring out *where* information lives and all tokens on *using* it.

## File Organization

Organize specs by **feature domain**, not by sprint, ticket, or team.

```
/project-root
├── AGENTS.md                 # Global agent context (repo-wide rules)
├── ARCHITECTURE.md           # Global system architecture
├── specs/                    # Feature-level specs
│   ├── user-authentication/
│   │   └── spec.md
│   ├── payment-processing/
│   │   └── spec.md
│   └── notifications/
│       └── spec.md
└── src/                      # Implementation code
```

**Conventions:**
- Directory name: kebab-case, matching the feature's conceptual name
- File name: always `spec.md`
- Location: `/specs/{feature-domain}/spec.md`
- Scope: one spec per independently evolvable feature

**Context separation** is critical. Maintain a strict boundary between global context and feature-level context:

- **`AGENTS.md`** — Cross-cutting rules that apply to every agent session: tech stack, coding standards, repository structure, commit conventions. See the [AGENTS.md Specification](/practices/agents-md-spec).
- **`ARCHITECTURE.md`** — System-level architectural decisions: service boundaries, data flow, deployment topology.
- **`/specs/*/spec.md`** — Feature-specific contracts: the behavioral rules, API signatures, data schemas, and quality criteria for one domain.

An agent working on notifications should load `AGENTS.md` (global rules) + `/specs/notifications/spec.md` (feature rules). It should not need to parse a monolithic architecture document to find the three paragraphs relevant to its task.

**The Project Template**

Keep a `specs/TEMPLATE.md` as the canonical starting point for new specs. This is not the generic template from this guide — it is your project's version, adapted with your section conventions, your typical constraints, your Gherkin style. When a new feature needs a spec, copy the template rather than starting from scratch.

The template is a living artifact too. As the team discovers what works — which sections always get filled in, which ones are always empty, what constraints apply project-wide — the template evolves. A good template after six months of use looks different from the one you started with, and that's the point.

## The Refinement Cycle

A spec is not a waterfall requirements document sealed before implementation. It is a hypothesis — a structured bet on how a feature should work, designed to be refined as the team learns.

Kent Beck frames this precisely: specs should function as hypotheses, not verdicts. Implementation doesn't invalidate a spec — implementation *completes* it. The failure mode is not having specs. The failure mode is failing to update them when implementation teaches you something new.

**The cycle:**

1. **Initial Spec** — Capture known constraints before the first line of code. API contracts, quality targets, anti-patterns, Gherkin scenarios. This is the minimum viable spec — enough for an agent to start work and a Critic to verify against.

2. **Implementation Discovery** — The agent (or human) encounters edge cases, performance issues, missing requirements, or architectural insights that the initial spec didn't anticipate. This is expected. Every implementation cycle reveals unknowns.

3. **Spec Update** — New constraints are committed alongside the code that revealed them. Same commit, same PR. The spec and the code tell the same story at every point in version history.

4. **Verification** — [Quality Gates](/patterns/context-gates) validate the implementation against the updated spec. If the Gherkin scenarios pass and the Critic Agent finds no spec violations, the refinement is complete.

5. **Repeat** — The spec grows smarter with every cycle. Edge cases discovered in Sprint 3 protect the agent working in Sprint 8 from making the same mistakes.

This is the [Learning Loop](/concepts/learning-loop) applied to specifications. Heeki Park's production workflow demonstrates this in practice: a four-phase pipeline (Requirements → Design → Tasks → Implementation) where each phase can feed discoveries back to the spec before proceeding. The spec doesn't prevent learning — it captures learnings so they persist beyond the current session.

## Maintenance Practices

### The Same-Commit Rule

If code changes behavior, the spec must be updated in the same commit. This is non-negotiable. A spec that describes yesterday's behavior is worse than no spec — it actively misleads.

```
git commit -m "feat(notifications): add SMS fallback

- Implements SMS delivery when WebSocket fails
- Updates /specs/notifications/spec.md: new transport layer,
  SMS fallback scenario, 5s delivery SLA"
```

Add "Spec updated" to your PR checklist or Definition of Done. Make it a gate, not a suggestion.

### Deprecation Over Deletion

Mark outdated sections as deprecated rather than removing them. Historical context has value — it explains *why* the system evolved, which prevents future agents from reverting to abandoned approaches.

```markdown
### Transport Layer

**[DEPRECATED 2026-03-01]**
~~WebSocket transport via Socket.io library~~
Replaced by native WebSocket API to reduce bundle size (see PBI-203).

**Current:**
Native WebSocket connection via `/api/ws/notifications`
```

### Bidirectional Linking

Link code to specs and specs to code. This creates the [Provenance](/concepts/provenance) chain that makes verification possible.

```typescript
// Notification delivery must meet 100ms latency requirement
// Spec: /specs/notifications/spec.md#contract
```

```markdown
### Data Schema
Implemented in `src/types/Notification.ts` with Zod validation
in `src/schemas/notification.schema.ts`.
```

When an agent encounters a constraint in code, the spec link tells it *why* the constraint exists. When a Critic reviews code against a spec, the code link tells it *where* to verify.

### Spec Review as Gate

Specs should be subject to [Adversarial Requirement Review](/practices/adversarial-requirement-review) before implementation begins. A Critic Agent reviewing the spec — not the code — catches ambiguous acceptance criteria, missing edge cases, and contradictory constraints *before* they become implementation defects.

If the Critic can't construct a verification plan from the spec, the spec is incomplete. This is cheaper to fix than discovering ambiguity during code review.

## Anti-Patterns

### The Stale Spec

**Failure mode:** Spec created during planning, never updated during implementation. By Sprint 3, the spec describes a system that no longer exists.

**Why it happens:** Teams treat spec creation as a planning ceremony rather than a living practice. There is no gate enforcing the same-commit rule.

**Fix:** Make spec updates a gate in the Definition of Done. If the PR changes behavior and doesn't update the spec, it fails review. This is the same-commit rule enforced structurally, not by willpower.

**Connection:** Stale specs are the primary source of [Intent Debt](/concepts/triple-debt-model). Every commit that changes behavior without updating the spec widens the gap between what the system *does* and what the team *thinks* it does.

### The Monolithic Spec

**Failure mode:** A single 3,000-line spec tries to document an entire subsystem. Agents load the whole thing into context, burning tokens on irrelevant sections. Reviewers can't find the section they need.

**Why it happens:** Teams organize specs by team or service rather than by independently evolvable feature domain.

**Fix:** Split by feature domain. One spec per feature that can evolve independently. If two features share a contract, extract the shared contract into its own spec and reference it from both.

### The Spec-as-Tutorial

**Failure mode:** Spec reads like a beginner's guide, explaining basic programming concepts, general framework usage, or well-known patterns.

**Why it happens:** Authors confuse "explicit constraints" with "comprehensive documentation." They write for a hypothetical junior developer rather than for an agent that already knows how to code.

**Fix:** Assume engineering competence. Document constraints, decisions, and project-specific rules — not general knowledge. "Use React hooks for state management" is not a spec constraint. "All component state must use the `useAppState` hook from `src/hooks/` to ensure persistence across navigation" *is* a constraint.

### The Orphaned Spec

**Failure mode:** Spec exists in a `/docs` folder or wiki that agents never see. It's technically maintained but operationally invisible.

**Why it happens:** Specs live in a documentation system separate from the codebase. Agents load repository files, not wiki pages.

**Fix:** Specs must live in the repository, in a predictable location (`/specs/{feature}/spec.md`), referenced from `AGENTS.md`. If the agent can't find it with a file path, it doesn't exist.

### The Copy-Paste Codebase

**Failure mode:** Spec duplicates large chunks of implementation code. When the code changes, the spec's code samples drift.

**Why it happens:** Authors want the spec to be "complete" and include working examples.

**Fix:** Reference canonical sources with file paths. Include only minimal examples that illustrate patterns or constraints — not working implementations. The spec describes *what* and *why*. The code *is* the how.

## Template

```markdown
# Feature: [Feature Name]

## Blueprint

### Context
[1-2 paragraphs: Why does this feature exist? What problem does it solve?
What business or user need drives it?]

### Architecture
- **API Contracts:**
  - `POST /api/v1/[endpoint]` — [Description, request/response shapes]
  - `GET /api/v1/[endpoint]/:id` — [Description]
- **Data Models:** Defined in `src/types/[Feature].ts`, validated by
  `src/schemas/[feature].schema.ts`
- **Dependencies:**
  - Depends on: [services, libraries, external APIs]
  - Depended on by: [downstream consumers]
- **Constraints:** [Security, compliance, or architectural boundaries.
  State as facts: "All PII fields use column-level encryption."
  Reserve for rules that aren't already captured by the positive
  architecture above.]

## Contract

### Definition of Done
- [ ] [Observable, measurable success criterion]
- [ ] [Another criterion — each must be independently verifiable]

### Regression Guardrails
- [Invariant that must never break, across all future changes]
- [Another invariant — these survive beyond the current PBI]

### Scenarios
\`\`\`gherkin
Scenario: [Descriptive name]
  Given [Precondition — system state before the action]
  When [Action — what the user or system does]
  Then [Expected outcome — observable, verifiable result]
  And [Additional verification if needed]
\`\`\`
```

Adapt the template to the feature's complexity. Simple features may need only Context + one API contract + two scenarios. Complex features may need multiple Architecture subsections and a dozen scenarios. The template provides structure, not mandatory overhead. If a section adds no information, omit it.

## ASDLC Usage

Living Specs is the practice layer of the [Specs pattern](/patterns/the-spec). The pattern provides the conceptual foundation (what specs are, why they matter, how they relate to PBIs and Feature Assembly). This guide provides the implementation instructions.

In the industrial verification model, specs serve as the **input quality gate**: if the spec is ambiguous, every downstream gate — from CI to adversarial review to human acceptance — is verifying against a moving target. Spec quality is the rate-limiter for the entire pipeline. Garbage spec, garbage gates.

The combination of Living Specs (capturing intent), [Adversarial Code Review](/patterns/adversarial-code-review) (verifying against intent), and [Context Gates](/patterns/context-gates) (layering verification) creates a system where Intent Debt is managed structurally rather than through tribal knowledge. The spec externalizes what the team knows. The gates verify that the code matches. The refinement cycle ensures both stay current.
