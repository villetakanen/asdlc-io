---
title: "OODA Loop"
description: "The Observe-Orient-Decide-Act decision cycle—a strategic model from military combat adapted for autonomous agent behavior in software development."
tags:
  - AI
  - Agent Architecture
  - Decision Making
  - Military Strategy
relatedIds:
  - concepts/learning-loop
  - concepts/context-engineering
  - concepts/levels-of-autonomy
  - patterns/context-gates
  - practices/agents-md-spec
lastUpdated: 2026-01-13
status: "Live"
references:
  - type: "book"
    title: "Certain to Win: The Strategy of John Boyd, Applied to Business"
    author: "Chet Richards"
    isbn: "978-1413453775"
    published: 2004-04-01
    annotation: "Accessible introduction to Boyd's OODA loop concepts applied beyond military contexts."
  - type: "paper"
    title: "How AI is Transforming Work at Anthropic"
    url: "https://www.anthropic.com/research/how-ai-is-transforming-work-at-anthropic"
    author: "Saffron Huang et al."
    published: 2025-12-02
    accessed: 2026-01-12
    annotation: "Research on tempo in human-AI collaboration; engineers who cycle faster with quality context converge on solutions."
---

## Definition

The OODA Loop—Observe, Orient, Decide, Act—is a strategic decision-making cycle originally developed by U.S. Air Force Colonel John Boyd for aerial combat. Boyd's insight: the combatant who cycles through these phases faster than their opponent gains decisive advantage. The key isn't raw speed—it's **tempo relative to environmental change**.

Boyd's less-quoted but crucial insight: **Orient is everything**. The Orient phase is where mental models, context, and prior experience shape how observations become decisions. A faster but poorly-oriented loop loses to a slower but well-oriented one.

In agentic software development, OODA provides the cognitive model for how autonomous agents should behave: continuously cycling through observation, interpretation, planning, and execution.

## The Four Phases

1. **Observe** — Gather information about the current state of the environment
2. **Orient** — Interpret observations through mental models, context, and constraints
3. **Decide** — Formulate a specific plan for action based on orientation
4. **Act** — Execute the plan, producing changes that feed new observations

The loop is continuous. Each Act produces new state, triggering new Observe, and the cycle repeats.

## Key Characteristics

### Tempo, Not Raw Speed

The strategic value of OODA isn't speed—it's cycling faster than the environment changes. In software development, the "environment" is the codebase, requirements, and constraints. An agent that can cycle through OODA before context rot sets in converges on correct solutions.

### Orient as the Critical Phase

For AI agents, Orient is the **context window**. The quality of orientation depends on:

- **Spec Clarity** — Garbage spec → garbage orientation
- **Constitution Directives** — Values that shape interpretation
- **Context Gates** — Filtering noise so orientation isn't polluted
- **Prior State** — Git history, progress files, previous learnings

This is why [Context Engineering](/concepts/context-engineering) isn't optional overhead. It's engineering the Orient phase, which determines whether fast cycling produces progress or noise.

### OODA vs. Single-Shot Interactions

Standard LLM interactions are **Observe-Act**: user provides input, model produces output. No explicit Orient or Decide phase. The model's "orientation" is implicit in training and whatever context happens to be present.

Agentic workflows make OODA explicit:

| Phase | Single-Shot LLM | Agentic Workflow |
|-------|-----------------|------------------|
| **Observe** | User prompt | Instrumented: read files, run tests, check logs |
| **Orient** | Implicit (training + context) | Engineered: Specs, Constitution, Context Gates |
| **Decide** | Implicit | Explicit: agent states plan before acting |
| **Act** | Generate response | Verified: external tools confirm success/failure |

This explicit structure enables debugging. When an agent fails, you can diagnose *which phase* broke down:

- **Bad Observe?** Agent missed relevant information
- **Bad Orient?** Context was polluted or incomplete
- **Bad Decide?** Plan was incoherent given good orientation
- **Bad Act?** Execution failed despite good plan

## ASDLC Usage

In ASDLC, OODA explains why cyclic workflows outperform linear pipelines:

| OODA Phase | Agent Behavior | ASDLC Component |
|------------|----------------|-----------------|
| **Observe** | Read codebase state, error logs, test results | File state, test output |
| **Orient** | Interpret against context and constraints | [Context Gates](/patterns/context-gates), [AGENTS.md](/practices/agents-md-spec) |
| **Decide** | Formulate implementation plan | PBI decomposition |
| **Act** | Write code, run tests, commit | Micro-commits |

The [Learning Loop](/concepts/learning-loop) is OODA with an explicit "Crystallize" step that improves future Orient phases. Where OODA cycles continuously, Learning Loop captures discoveries into machine-readable context for subsequent agent sessions.

Applied in:
- [Context Engineering](/concepts/context-engineering) — The discipline of engineering the Orient phase
- [Context Gates](/patterns/context-gates) — Checkpoints between OODA phases
- [Levels of Autonomy](/concepts/levels-of-autonomy) — Higher autonomy requires more sophisticated Orient capabilities

## Anti-Patterns

| Anti-Pattern | Description | Failure Mode |
|--------------|-------------|--------------|
| **Observe-Act** | Skipping Orient/Decide. Classic vibe coding. | Works for simple tasks; fails at scale; no learning |
| **Orient Paralysis** | Over-engineering context, never acting | Analysis paralysis; no forward progress |
| **Stale Orient** | Not updating mental model when observations change | Context rot; agent operates on outdated assumptions |
| **Observe Blindness** | Not instrumenting observation of relevant state | Agent misses critical information (failed tests, error logs) |
| **Act Without Verify** | Not confirming action results before next cycle | Cascading errors; false confidence |
