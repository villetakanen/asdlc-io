---
title: "Guardrails"
description: "Why we deprecated the term 'Guardrails' in favor of strict separation between deterministic Context Gates and probabilistic Agent Constitutions."
tags: ["Disambiguation", "Architecture"]
status: "Deprecated"
supersededBy: ['patterns/context-gates', 'patterns/agent-constitution']
relatedIds: ["patterns/context-gates"]
lastUpdated: 2026-01-01
---

> ⚠️ **Deprecated**: This concept has been superseded by [Context Gates](/patterns/context-gates) and [Agent Constitution](/patterns/agent-constitution).

## The Ambiguity Problem

In the broader AI industry, "Guardrails" has become a "suitcase word"—a single term packed with too many conflicting meanings. It conflates **architectural firewalls** (hard rules) with **prompt engineering** (soft influence).

This ambiguity leads to fragile systems where engineers try to fix logic errors with prompt tuning (which is unreliable) or restrict creativity with rigid code blocks (which is stifling).

## Standard Definitions

Broadly, industry implementations of "Guardrails" typically fall into two buckets:
1. **Input/Output Filtering:** Deterministic systems that intercept and block messages based on policy (e.g., NVIDIA NeMo).
2. **Behavioral Constraint:** Probabilistic techniques (prompting/tuning) to prevent the model from deviating from its persona.

## The ASDLC Interpretation

To resolve this ambiguity, we have deprecated "Guardrails" in favor of strictly separating the concept into two distinct mechanisms: **The Brakes** and **The Driver**.

### 1. Context Gates (The Brakes)
These are **deterministic** validation layers. Just as car brakes function regardless of what the driver "thinks," Gates trigger regardless of the LLM's intent.
* **Supersedes:** Input/Output filtering, Schema validation.
* **See:** [Context Gates](/patterns/context-gates)

### 2. Agent Constitution (The Driver)
These are **probabilistic** steering instructions. They are the training and rules the "driver" (LLM) carries in its head to make good decisions.
* **Supersedes:** Prompt injection defense, Tone enforcement.
* **See:** [Agent Constitution](/patterns/agent-constitution)

### Comparison of Controls

| Feature | Context Gates | Agent Constitution |
| :--- | :--- | :--- |
| **Nature** | Deterministic (Binary) | Probabilistic (Semantic) |
| **Location** | External (Firewall/Code) | Internal (Context Window) |
| **Goal** | **Correctness** (Prevent errors) | **Alignment** (Steer intent) |
| **Failure Mode** | Exception / Rejection | Hallucination / Bad Style |
| **Analogy** | The Brakes | The Driver's Training |

## Superseding Concepts

This concept has been superseded by:
* **[Context Gates](/patterns/context-gates)** — Deterministic validation layers.
* **[Agent Constitution](/patterns/agent-constitution)** — Probabilistic steering instructions.

See also:
* [AGENTS.md Specification](/practices/agents-md-spec) — Implementation guide.

## References

* **[NeMo Guardrails](https://github.com/NVIDIA/NeMo-Guardrails)** – An example of the standard industry approach that mixes these concerns, which we explicitly avoid in ASDLC.
