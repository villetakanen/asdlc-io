---
title: "Agent Optimization Loop"
description: "The recursive process of using feedback from scenarios to continuously tune agent prompts, context, and tools."
tags: ["Meta-Pattern", "Optimization", "Agent Engineering", "Factory"]
relatedIds: ["patterns/ralph-loop", "concepts/context-engineering", "concepts/agentic-sdlc", "concepts/learning-loop"]
lastUpdated: 2026-02-21
status: "Experimental"
references:
  - title: "From Software Factories to Agent Factories: When Agents Build Agents"
    author: "Mutagent"
    url: "https://www.mutagent.io/blog/software-factories-agents-building-agents"
    type: "website"
    annotation: "Origin of the Agent Factory and Optimization Loop concepts."
    accessed: 2026-02-15
---

## Definition

The **Agent Optimization Loop** is the distinct lifecycle for building the agents themselves, separate from the lifecycle of the software they build. It replaces static "Evals" with dynamic **Scenarios**—realistic, localized integration tests that verify agent behavior in context.

While the [Ralph Loop](/patterns/ralph-loop) optimizes the *product* (Code) through iteration, the Agent Optimization Loop optimizes the *producer* (Agent) through meta-feedback.

## The Problem: Static Evals

Standard "Leaderboard" evaluations (GSM8K, HumanEval) measure raw intelligence, not job performance. Optimizing for them leads to overfitting on generic tasks while failing on domain-specific constraints.

In a **Software Factory**, we need agents that perform specifically well on *our* codebase, *our* patterns, and *our* constraints. A generic coding agent that knows Python well but ignores our project's `Result` type pattern is functionally broken.

## The Solution: The Factory Loop

The Agent Optimization Loop treats the agent's configuration (System Prompt, Context, Tools) as the source code, and "Scenarios" as the unit tests.

### Anatomy

The loop consists of three phases: **Seed**, **Validate**, and **Loop**.

### 1. Seed (Context Engineering)
The initial configuration of the agent. This includes:
*   **System Prompt**: The persona and behavioral constraints.
*   **Context**: The verified knowledge base (docs, specs).
*   **Tools**: The capabilities exposed to the agent.

### 2. Validate (Scenarios)
Instead of running the agent on a generic problem, we run it against a **Scenario**—a specific, representative task from our actual backlog.

*   *Scenario*: "Refactor `user.ts` to use Zod schema validation."
*   *Pass Criteria*:
    *   Code compiles.
    *   Tests pass.
    *   Linter is satisfied.
    *   **Architectural check**: Did it use the correct Zod patterns?

### 3. Loop (Meta-Optimization)
When the agent fails a scenario, we do not just fix the code (that's the Ralph Loop). We fix the **Agent**.

*   *Diagnosis*: Why did the agent fail?
    *   Did it miss a rule? -> Update System Prompt.
    *   Did it lack knowledge? -> Update Context (add a doc).
    *   Did it hallucinate a tool? -> Fix Tool definition.

This creates a compounding asset: an agent that gets smarter about *this specific codebase* over time.

## Offline vs Online Evolution

The Agent Optimization Loop manifests in two distinct modes:

### Offline Factory Optimization (Current Focus)
Optimization occurs asynchronously through explicit integration testing (Scenarios). Humans or meta-evaluators analyze failures and update the version-controlled context (Specs, `AGENTS.md`) and rerun. This guarantees determinism and peer review but has higher latency.

### Online Context Evolution (Experimental)
Often called "Continual Learning in Token Space," where an agent natively reflects over its past trajectories (e.g., distilling sessions into an `AGENTS.md` update or generating a new skill file automatically). While this enables rapid adaptation, it risks uncontrolled drift if the agent infers the wrong lesson from a failure. 

In ASDLC, we treat Online Evolution as an *input* to Offline Optimization: agents can suggest updates to the context, but these updates must pass deterministic Architectural Review before becoming canonical.

## Relationship to Other Patterns

**[Ralph Loop](/patterns/ralph-loop)** — The Execution Loop. The Agent Optimization Loop runs *offline* to improve the agent so that the Ralph Loop runs more efficiently *online*.

**[Context Engineering](/concepts/context-engineering)** — The discipline that informs the "Seed" and "Loop" phases. The Optimization Loop is the process of verifying that our Context Engineering is effective.

**[Agentic SDLC](/concepts/agentic-sdlc)** — The overarching framework. The Agent Optimization Loop is the engine of the "Agent Factory" component of the ASDLC.
