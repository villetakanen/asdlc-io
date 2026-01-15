---
title: "The PBI"
description: "A transient execution unit that defines the delta (change) while pointing to permanent context (The Spec), optimized for agent consumption."
tags: ["Agile", "Product Backlog Item", "Spec-Driven Development", "Bounded Agency"]
relatedIds: ["patterns/the-spec", "practices/pbi-authoring", "concepts/spec-driven-development"]
status: "Live"
lastUpdated: 2026-01-13
---

## Definition

The Product Backlog Item (PBI) is the unit of execution in the ASDLC. While [The Spec](/patterns/the-spec) defines the **State** (how the system works), the PBI defines the **Delta** (the specific change to be made).

In an AI-native workflow, the PBI transforms from a "User Story" (negotiable conversation) into a **Prompt** (strict directive). The AI has flexibility in *how* code is written, but the PBI enforces strict boundaries on *what* is delivered.

## The Problem: Ambiguous Work Items

Traditional user stories ("As a user, I want...") are designed for human negotiation. They assume ongoing dialogue, implicit context, and shared understanding built over time.

Agents don't negotiate. They execute. A vague story becomes a hallucinated implementation.

**What fails without structured PBIs:**
- Agents interpret scope liberally, touching unrelated code
- No clear pointer to authoritative design decisions
- Success criteria scattered across conversations
- Merge conflicts from parallel agents hitting the same files

## The Solution: Pointer, Not Container

The PBI acts as a **pointer** to permanent context, not a container for the full design. It defines the delta while referencing The Spec for the state.

| Dimension   | The Spec                        | The PBI                          |
| :---------- | :------------------------------ | :------------------------------- |
| **Purpose** | Define the State (how it works) | Define the Delta (what changes)  |
| **Lifespan**| Permanent (lives with the code) | Transient (closed after merge)   |
| **Scope**   | Feature-level rules             | Task-level instructions          |
| **Audience**| Architects, Agents (Reference)  | Agents, Developers (Execution)   |

## Anatomy

An effective PBI consists of four parts:

### 1. The Directive

What to do, with explicit scope boundaries. Not a request—a constrained instruction.

### 2. The Context Pointer

Reference to the permanent spec. Prevents the PBI from becoming a stale copy of design decisions that live elsewhere.

### 3. The Verification Pointer

Link to success criteria defined in the spec's Contract section. The agent knows exactly what "done" looks like.

### 4. The Refinement Rule

Protocol for when reality diverges from the spec. Does the agent stop? Update the spec? Flag for human review?

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

### Dependency Declaration

When a PBI requires another to complete first, the dependency is declared explicitly in the PBI structure—not discovered at merge time.

## Relationship to Other Patterns

**[The Spec](/patterns/the-spec)** — The permanent source of truth that PBIs reference. The Spec defines state; the PBI defines delta.

**[PBI Authoring](/practices/pbi-authoring)** — The practice for writing effective PBIs, including templates and lifecycle.

See also:
- [Spec-Driven Development](/concepts/spec-driven-development) — The overarching methodology
- [Context Gates](/patterns/context-gates) — Validation checkpoints for PBI completion
