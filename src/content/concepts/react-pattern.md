---
title: "ReAct Pattern"
longTitle: "ReAct: Interleaving Reasoning and Action in Language Models"
description: "Foundational prompting paradigm combining verbal reasoning traces and task-oriented actions in an interleaved manner to solve complex goals."
tags:
  - Agent Architecture
  - Prompting
  - Decision Making
relatedIds:
  - concepts/ooda-loop
  - patterns/ralph-loop
  - concepts/context-engineering
publishedDate: 2026-05-28
lastUpdated: 2026-05-28
status: Live
references:
  - type: "paper"
    title: "ReAct: Synergizing Reasoning and Acting in Language Models"
    url: "https://arxiv.org/abs/2210.03629"
    author: "Shunyu Yao et al."
    published: 2022-10-06
    annotation: "Introduces the ReAct paradigm where models interleave reasoning traces, action execution, and environmental observation."
---

## Definition

The **ReAct** (Reasoning and Acting) pattern is an agent execution paradigm that prompts large language models to generate both verbal reasoning traces and task-specific actions in an interleaved manner. By generating reasoning thoughts, the model can initiate, track, and update action plans while handling exceptions; by executing actions, it interfaces with external environments (such as APIs or filesystems) to retrieve observations that ground its subsequent thoughts.

In the ReAct framework, the interaction is structured as a continuous loop of:
1. **Thought**: The model reasons about its current state and plans its next move.
2. **Action**: The model invokes an external tool or executes an instruction.
3. **Observation**: The model receives deterministic feedback from the environment, which is appended back to the context.

## Key Characteristics

### Interleaved Tracing
Traditional prompting paradigms either generate reasoning traces in isolation (such as Chain-of-Thought) or output actions directly (such as Act-Only tool calling). ReAct couples these modes: thoughts guide action execution, and action outcomes redirect thoughts. This prevents the model from generating stale plans or drifting off-topic.

### Grounding and Hallucination Mitigation
By making observations a mandatory gate between action execution and subsequent reasoning, the model is continuously grounded in the actual state of the environment. If a tool returns an error, the reasoning trace processes that error directly, rather than hallucinating a successful outcome.

### Human-Readable Interpretability
The interleaved traces provide a step-by-step audit log of the agent's decision-making process. This makes the agent's behavior diagnosable, allowing developers to inspect why a certain action was taken and where a logic path failed.

## ASDLC Usage

ReAct is the foundational prompt-level paradigm that underlies all autonomous agent behaviors. Rather than being restricted to any single workflow, it serves as the universal inner-loop execution model for all agentic interactions across the ASDLC. 

For instance, this fundamental cycle of interleaving reasoning and action is observed during:
*   **Feature Assembly**: When an implementation agent writes code, compiles it, and reads terminal output or test results to iterate on fixes.
*   **Adversarial Code Review**: When review agents reason about design tokens or contracts and run linter checks to verify compliance.
*   **Spec Reversing**: When research agents analyze a repository to extract specifications, read files, and construct a system behavior map.

In these contexts, higher-level architectures like the [OODA Loop](/concepts/ooda-loop) and the [Ralph Loop](/patterns/ralph-loop) do not replace ReAct; instead, they mechanize and wrap this fundamental prompting loop in deterministic state management, persistence layers, and external validation gates.

