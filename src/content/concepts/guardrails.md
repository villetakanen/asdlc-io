---
title: "Guardrails"
description: "Deprecated concept superseded by Context Gates (deterministic validation) and Agent Constitution (probabilistic steering)."
tags: ["Disambiguation", "Architecture"]
status: "Deprecated"
supersededBy: ['concepts/context-gates', 'practices/agents-md-spec']
relatedIds: ["concepts/context-gates"]
lastUpdated: 2025-11-25
---

> ⚠️ **Deprecated**: This concept has been superseded by [Context Gates](/concepts/context-gates) and [AGENTS.md Specification](/patterns/agents-md-spec). This page is retained for historical comparison.

## The Industry Conflict

Standard definitions of "Guardrails" conflate two opposing engineering concepts: architectural firewalls (deterministic) and prompt engineering (probabilistic). This ambiguity leads to agents that are "safe" but functionally paralyzed.

## The ASDLC Definition

To resolve this, we map "Guardrails" to the **Agent Constitution** and **Gates** (Quality Gates, Review Gates, Acceptance Gates).

> **Note:** See [Context Gates](/concepts/context-gates) for the full three-tier validation architecture: Quality Gates (deterministic), Review Gates (probabilistic/adversarial), and Acceptance Gates (human-in-the-loop).

The Agent Constitution is a set of probabilistic, semantic instructions acting as the model's "internal conscience." Unlike gates that validate output after generation, the Constitution actively steers the agent's intent, ensuring it understands how to act correctly to avoid producing invalid output.

## Comparison of Controls

| Feature | Gates (Standard "Guardrails") | Agent Constitution (ASDLC) |
| :--- | :--- | :--- |
| **Nature** | Deterministic (Binary) | Probabilistic (Semantic) |
| **Location** | External (Firewall) | Internal (Context Window) |
| **Goal** | Intercept failure | Steer intent |
| **Analogy** | The brakes on a car | The driver's training |
