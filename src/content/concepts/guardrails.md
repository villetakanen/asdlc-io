---
title: "Guardrails"
definition: "In the context of asdlc.io, the term 'Guardrail' is deprecated in favor of a split-architecture approach: Gates and Constitutions."
tags: ["Disambiguation", "Architecture"]
maturity: "Deprecated"
related_concepts: ["context-gates"]
lastUpdated: 2025-11-25
---

## The Industry Conflict

Standard definitions of "Guardrails" conflate two opposing engineering concepts: architectural firewalls (deterministic) and prompt engineering (probabilistic). This ambiguity leads to agents that are "safe" but functionally paralyzed.

## The ASDLC Definition

To resolve this, we map "Guardrails" to the **Agent Constitution** and **Gates** (e.g. Quality Gates, Firewalls).

> **Note:** This is distinct from **[Context Gates](/patterns/context-gates)**, which act as a cognitive throttle for the context window rather than a hard compliance check for output.

The Agent Constitution is a set of probabilistic, semantic instructions acting as the model's "internal conscience." Unlike a firewall that passively intercepts errors, the Constitution actively steers the agent's intent, ensuring it understands how to act correctly to avoid colliding with hard infrastructure.

## Comparison of Controls

| Feature | Gates (Standard "Guardrails") | Agent Constitution (ASDLC) |
| :--- | :--- | :--- |
| **Nature** | Deterministic (Binary) | Probabilistic (Semantic) |
| **Location** | External (Firewall) | Internal (Context Window) |
| **Goal** | Intercept failure | Steer intent |
| **Analogy** | The brakes on a car | The driver's training |
