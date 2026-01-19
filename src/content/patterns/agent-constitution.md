---
title: "Agent Constitution"
description: "Persistent, high-level directives that shape agent behavior and decision-making before action."
tags: ["Agent Architecture", "System Prompts", "Alignment", "Governance"]
status: "Live"
relatedIds: ["patterns/constitutional-review", "patterns/context-gates", "practices/agents-md-spec", "concepts/ooda-loop", "patterns/adversarial-code-review", "practices/workflow-as-code"]
lastUpdated: 2026-01-19
references:
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

## Taxonomy: Steering vs. Hard Constraints

It is critical to distinguish what the Constitution *can* enforce (Steering) from what it *must* rely on external systems to enforce (Hard).

### Steering Constraints (Soft)
These live in the **System Prompt** or **AGENTS.md**. They influence the model's reasoning, tone, and risk preference.
- "Be concise."
- "Prefer composition over inheritance."
- "Ask clarifying questions when ambiguous."

### Hard Constraints (Orchestration)
These live in the **Runtime Environment** (Hooks, API limits, Docker containers). They physically prevent the agent from taking restricted actions.
- "Cannot access production database credentials."
- "Cannot git push without passing automated tests."
- "Cannot access files outside `/src`."

The Agent Constitution is primarily about **Steering Constraints** that govern *behavior*, while [Context Gates](/patterns/context-gates) and [Workflow as Code](/practices/workflow-as-code) implement the **Hard Constraints**.

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

## Persona-Specific Constitutions

Defining different Constitutions for different roles enables [Adversarial Code Review](/patterns/adversarial-code-review).

### 1. The Builder (Optimist)
> "Your goal is to be helpful and productive. Write code that solves the user's problem. If the spec is slightly vague, make a reasonable guess to keep momentum going. Prioritize clean, readable implementation."

### 2. The Critic (Pessimist)
> "Your goal is to be a skeptical gatekeeper. Assume the code is broken or insecure until proven otherwise. Do not be helpful; be accurate. If the spec is vague, reject the code and demand clarification. Prioritize correctness and edge-case handling."

By running the same prompt through these two different Constitutions, you generate a dialectic process that uncovers issues a single "neutral" agent would miss.

## Implementation

### 1. Documentation
The industry standard for documenting your Agent Constitution is [AGENTS.md](/practices/agents-md-spec). This file lives in your repository root and serves as the source of truth for your agents.

### 2. Injection
Inject the Constitution into the **System Prompt** of your LLM interaction.
*   **System Prompt**: `{{AGENT_CONSTITUTION}} \n\n You are an AI assistant...`
*   **User Prompt**: `{{TASK_SPEC}}`

### 3. Tuning
Constitutions must be tuned. If they are too strict, the agent becomes paralyzed (refusing to code because "it might be insecure"). If too loose, the agent halts for every minor ambiguity.

**The "Be Good" Trap**: Avoid vague directives like "Write good code."
*   *Bad*: "Be secure."
*   *Good*: "Never concatenate strings to build SQL queries. Use parameterized queries only."

## Relationship to Other Patterns

**[Constitutional Review](/patterns/constitutional-review)** — The pattern for using a Critic agent to review code specifically against the Agent Constitution.

**[Context Gates](/patterns/context-gates)** — The deterministic checks that back up the probabilistic Constitution. Hard Constraints implemented via orchestration.

**[Adversarial Code Review](/patterns/adversarial-code-review)** — Uses persona-specific Constitutions (Builder vs Critic) to create dialectic review processes.

**[The Spec](/patterns/the-spec)** — Defines task-specific requirements, while the Constitution defines global behavioral guidelines.

**[AGENTS.md Specification](/practices/agents-md-spec)** — The practice for documenting and maintaining your Agent Constitution.

**[Workflow as Code](/practices/workflow-as-code)** — Implements Hard Constraints programmatically, complementing the Constitution's Steering Constraints.

See also:
- [Constitutional Review](/patterns/constitutional-review) — Enforcement via Critic agents
- [Context Gates](/patterns/context-gates) — Hard constraint implementation
- [AGENTS.md Specification](/practices/agents-md-spec) — Documentation practice

### Related Concepts
- [OODA Loop](/concepts/ooda-loop) — The Constitution operates in the Orient phase
- [Context Engineering](/concepts/context-engineering) — The broader discipline of managing prompt context
