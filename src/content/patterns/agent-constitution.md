---
title: "Agent Constitution"
description: "Prime directives that align agent behavior with system goals before action, acting as driver training vs. context gates as brakes."
complexity: "Medium"
status: "Experimental"
lastUpdated: 2025-12-05
---

## The Prime Directives

An Agent Constitution is a set of "Prime Directives" injected into an agent's context window to align its intent and behavior with high-level principles. Unlike specific task instructions, the constitution provides the ethical and operational boundaries within which the agent must operate. It serves as the foundational "superego" for the agent, ensuring that even in ambiguous situations, its actions remain consistent with the system's overarching goals and safety guidelines.

## Driver Training vs. Brakes

To understand the role of an Agent Constitution, consider the analogy of a car. Context Gates and other restrictive mechanisms act as the "brakes"—they stop the agent from doing something wrong after it has already attempted or formulated an action. The Agent Constitution, however, is the "driver training." It shapes the agent's decision-making process *before* it even considers an action. By internalizing these rules, the agent is less likely to need the "brakes" because it is steering itself correctly from the start.

## Implementation

For the standard implementation of this pattern, see the [AGENTS.md Specification](/practices/agents-md-spec). The specification details how to formally document and inject these directives into your agentic workflows.
