---
title: "Agent Constitution"
description: "Persistent, high-level directives that shape agent behavior and decision-making before action."
tags: ["Agent Architecture", "System Prompts", "Alignment", "Governance"]
status: "Live"
relatedIds: ["patterns/constitutional-review", "patterns/context-gates", "practices/agents-md-spec", "concepts/ooda-loop", "patterns/adversarial-code-review", "practices/workflow-as-code"]
lastUpdated: 2026-02-18
references:
  - type: "paper"
    title: "Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?"
    url: "https://arxiv.org/abs/2602.11988"
    author: "Thibaud Gloaguen, Niels Mündler, Mark Müller, Veselin Raychev, Martin Vechev"
    publisher: "ETH Zurich / LogicStar.ai"
    published: 2026-02-13
    annotation: "Empirical study showing minimal context files outperform verbose ones."
  - type: "paper"
    title: "Constitutional AI: Harmlessness from AI Feedback"
    url: "https://arxiv.org/abs/2212.08073"
    publisher: "Anthropic"
    annotation: "Seminal paper by Bai et al. (2022) defining the 'Helpful, Honest, Harmless' framework and the RLAIF method."
  - type: "website"
    title: "System Prompts"
    url: "https://docs.anthropic.com/en/docs/system-prompts"
    publisher: "Anthropic"
    accessed: 2026-01-13
    annotation: "Defines the model for Constitutional AI: training a harmless assistant via self-critique based on a constitution."
  - type: "website"
    title: "Intent Engineering Framework for AI Agents"
    url: "https://www.productcompass.pm/p/intent-engineering-framework-for-ai-agents"
    author: "Paweł Huryn"
    published: 2024-04-30
    accessed: 2026-01-19
    annotation: "Provides the taxonomy for 'Steering Constraints' (Constitution) vs 'Hard Constraints' (Orchestration/Hook)."
---

## Definition

An **Agent Constitution** is a set of high-level principles or "Prime Directives" injected into an agent's system prompt to align its intent and behavior with system goals.

The concept originates from Anthropic's [Constitutional AI](https://arxiv.org/abs/2212.08073) research, which proposed training models to be "Helpful, Honest, and Harmless" (HHH) using a written constitution rather than human labels alone. In the ASDLC, we adapt this alignment technique to **System Prompt Engineering**—using the Constitution to define the "Superego" of our coding agents.

## The Problem: Infinite Flexibility

Without a Constitution, an Agent is purely probabilistic. It will optimize for being "helpful" to the immediate prompt user, often sacrificing long-term system integrity.

If a prompt says "Implement this fast," a helpful agent might skip tests. A Constitutional Agent would refuse: "I cannot skip tests because Principle #3 forbids merging unverified code."

## The Solution: Proactive Behavioral Alignment

The Constitution shapes agent behavior **before** action occurs—unlike reactive mechanisms (tests, gates) that catch problems after the fact.

### The Driver Training Analogy

To understand the difference between a Constitution and other control mechanisms, consider the analogy of driving a car:

*   **The Spec**: The Destination. "Drive to 123 Main St."
*   **Context Gates**: The Brakes/Guardrails. Hard limits that stop the car if it's about to hit a wall (e.g., "Stop if compilation fails"). These are reactive.
*   **Agent Constitution**: The Driver Training. The internalized rules ("Drive defensively," "Yield to pedestrians") that shape how the driver steers *before* any danger arises. This is proactive.

## The "Orient" Phase

In the [OODA Loop](/concepts/ooda-loop) (Observe-Orient-Decide-Act), the Constitution lives squarely in the **Orient** phase.

When an agent **Observes** the world (reads code, sees a user request), the Constitution acts as a filter for how it interprets those observations.
*   A "Helpful" Constitution might interpret a vague request as an opportunity to guess and assist.
*   A "Skeptical" Constitution might interpret the same vague request as a risk to be flagged.

## Taxonomy: Steering vs. Deterministic Constraints

It is critical to distinguish what the Constitution *can* enforce (Steering) from what external systems enforce deterministically (Hard). Hard constraints split into two distinct categories:

### 1. Steering Constraints (Probabilistic)
Live in the **system prompt / agents.md**. Influence the model's reasoning, tone, and risk preference. The agent self-polices these — they are probabilistic, not guaranteed.

- "Ask before guessing on ambiguous specs."
- "Explain your plan before writing code."
- "Prefer composition over inheritance."

### 2. Toolchain Constraints (Deterministic — Repo)
Live in **tool configuration files** (biome.json, tsconfig, .golangci.yml, ESLint, etc.). Enforced by the toolchain on every run, regardless of agent behavior. The tool is the enforcement mechanism — not the agent.

- No `var` in TypeScript → tsconfig / Biome
- Import order → ESLint / Biome
- Type errors → tsconfig strict mode
- Formatting → Prettier / Biome

**Restating Toolchain Constraints in agents.md is an antipattern.** It implies the agent is the enforcement mechanism when it is not, and research shows agents will follow these instructions faithfully — adding reasoning cost and broader exploration without improving outcomes (Gloaguen et al., 2026).

### 3. Orchestration Constraints (Deterministic — Runtime)
Live in the **runtime environment** (hooks, CI pipelines, Docker containers, API limits). Physically prevent the agent from taking restricted actions.

- Cannot push without passing automated tests
- Cannot access production database credentials
- Cannot access files outside `/src`

## The Decision Rule

Before adding any rule to agents.md, ask: **can a tool or runtime already enforce this?**

```
Can a linter/formatter enforce it?  → put it in tool config, not agents.md
Can a CI gate enforce it?           → put it in the pipeline, not agents.md
Can a hook enforce it?              → put it in the hook, not agents.md
None of the above?                  → agents.md is the right home
```

The Constitution is for the judgment layer — the things that require reasoning to uphold. Everything else has a more reliable home.

## Anatomy of a Constitution

Research into effective system prompts suggests a constitution should have four distinct components:

### 1. Identity (The Persona)
Who is the agent? This prunes the search space of the model (e.g., "You are a Senior Rust Engineer" vs "You are a poetic assistant").
*   *See [Agent Personas](/practices/agent-personas)*

### 2. The Mission (Objectives)
What is the agent trying to achieve?
*   *Example:* "Your goal is to maximize code maintainability, even at the cost of slight verbosity."

### 3. The Boundaries (Negative Constraints)
What must the agent *never* do? These are "Soft Gates"—instructions to avoid bad paths before hitting the hard [Context Gates](/patterns/context-gates).
*   *Example:* "Never output code that swallows errors. Never use `var` in TypeScript."

### 4. The Process (Step-by-Step)
How should the agent think? This enforces Chain-of-Thought reasoning.
*   *Example:* "Before writing code, listing the files you intend to modify. Then, explain your plan."

## Constitution vs. Spec

A common failure mode is mixing functional requirements with behavioral guidelines. Separation is critical:

| Feature | Agent Constitution | The Spec |
| :--- | :--- | :--- |
| **Scope** | Global / Persona-wide | Local / Task-specific |
| **Lifespan** | Persistent (Project Lifecycle) | Ephemeral (Feature Lifecycle) |
| **Content** | Values, Style, Ethics, Safety | Logic, Data Structures, Routes |
| **Example** | "Prioritize Type Safety over Brevity." | "User `id` must be a UUID." |

## Self-Correction Loop

One of the most powerful applications of a Constitution is the **Critique-and-Refine** loop (derived from Anthropic's Supervised Learning phase):

1.  **Draft**: Agent generates a response to the user's task.
2.  **Critique**: Agent (or a separate Critic agent) compares the draft against the **Constitution**.
3.  **Refine**: Agent rewrites the draft to address the critique.

This allows the agent to fix violations (e.g., "I used `any` type, but the Constitution forbids it") *before* the user ever sees the code.

## Periodic Auditing

As the toolchain evolves (dependency upgrades, new linter rules, stricter tsconfig), previously necessary Constitution rules may become redundant. Auditing agents.md for toolchain-redundant rules should be part of dependency upgrade reviews.

## Relationship to Other Patterns

**[Constitutional Review](/patterns/constitutional-review)** — The pattern for using a Critic agent to review code specifically against the Agent Constitution.

**[Context Gates](/patterns/context-gates)** — The deterministic checks that back up the probabilistic Constitution. Hard Constraints implemented via orchestration.

**[Adversarial Code Review](/patterns/adversarial-code-review)** — Uses persona-specific Constitutions (Builder vs Critic) to create dialectic review processes.

**[The Spec](/patterns/the-spec)** — Defines task-specific requirements, while the Constitution defines global behavioral guidelines.

**[AGENTS.md Specification](/practices/agents-md-spec)** — The practice for documenting and maintaining your Agent Constitution.

**[Workflow as Code](/practices/workflow-as-code)** — Implements Hard Constraints programmatically, complementing the Constitution's Steering Constraints.
