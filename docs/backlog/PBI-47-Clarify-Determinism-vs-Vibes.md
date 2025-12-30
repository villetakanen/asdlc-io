# PBI-47: Clarify 'Vibes' vs 'Determinism' in ASDLC Philosophy

> Status: Done

## Goal
Update the ASDLC corpus to explicitly articulate the distinction between **Steering (Vibes)** and **Determinism (Tools)**, and establish the principle that fluency in agentic coding requires the synthesis of both.

## Context
There is a prevalent misconception in the AI development community that "determinism" can be achieved solely through rigorous prompt engineering (e.g., a "lawyer-like" `AGENTS.md`).

Feedback from the project lead highlights this fallacy:
> "An agent can not be forced into deterministic behaviour simply by crafting an AGENTS.md file as if you were a lawyer. Agents read that file and may obey it for a couple of turns, then they start to drift off... Determinism arises from deterministic tools, not from probabilistic."

The ASDLC must clarify that:
1.  **Steering (Vibes)**: Files like `AGENTS.md` and `CLAUDE.md` provides temporary context, persona, and stylistic direction. They are "soft" constraints that agents may drift from.
2.  **Determinism**: Hard constraints like schemas (Zod), type systems, tests, and tool definitions are the only source of true reliability.
3.  **Fluency**: Successful agentic coding isn't about choosing one over the other, but using *vibes* to steer the agent towards the correct usage of *deterministic tools*.

## Requirements

### Documentation Updates

1.  **`src/pages/index.astro` (Frontpage)**
    - **Current**: "When AI contributors follow explicit rules defined in AGENTS.md... that's when determinism emerges from the vibes."
    - **Critique**: This implies that strict rule-following in prompts *causes* determinism.
    - **Change**: Rewrite to state that `AGENTS.md` *steers* the agent towards the deterministic safe-harbor of Schemas/Tests.
    - **Current**: "Agent Directives: Explicit protocols that govern AI behavior..."
    - **Change**: Change "govern" to "steer" or "guide" to reflect the probabilistic nature of the instruction.

2.  **`README.md`**
    - Ensure the Philosophy section mirrors the changes in `index.astro`.
    - Explicitly state the "Dual Necessity": You need *both* the Compass (Prompts) and the Rails (Tools).

3.  **`src/content/concepts/context-engineering.md`**
    - **Current**: "It is the `AGENTS.md` file that forces an implementation pattern."
    - **Change**: Change "forces" to "steers towards" or "promotes".
    - Clarify that while Context is "engineered", it is still executing in a probabilistic engine, unlike code which executes in a deterministic runtime.

4.  **`src/content/concepts/agentic-sdlc.md`**
    - Strengthen the definition of the "Instructor/Pilot" relationship to emphasize that the Instructor uses *both* verbal commands (prompts) and physical checklists/instruments (tools) to manage the flight.

### Key Messaging
- "AGENTS.md is a compass, not a railroad track."
- "You cannot prompt your way to type safety."
- "Determinism is a property of the environment (tools/tests), not the agent."

## Acceptance Criteria
- [ ] `src/pages/index.astro` updated to clarify that `AGENTS.md` is for steering, not guarantee.
- [ ] `README.md` updated with the nuances of Steering vs Determinism.
- [ ] `src/content/concepts/context-engineering.md` updated to remove "forcing" language.
- [ ] `src/content/concepts/agentic-sdlc.md` refined to emphasize the dual necessity.
- [ ] A clear statement is added: "Fluency in agentic coding requires both mastery of steering (vibes) and the implementation of deterministic tools."
