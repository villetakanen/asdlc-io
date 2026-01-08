---
title: "Model Routing"
description: "Strategic assignment of LLM models to SDLC phases based on reasoning capability versus execution speed."
tags: ["LLM Selection", "Context Engineering", "ASDLC", "Agent Architecture"]
relatedIds: ["concepts/agentic-sdlc", "patterns/context-gates", "practices/agent-personas", "patterns/the-spec", "concepts/context-engineering"]
status: "Live"
lastUpdated: 2025-12-27
references:
  - type: "website"
    title: "My LLM Coding Workflow Going into 2026"
    url: "https://addyo.substack.com/p/my-llm-coding-workflow-going-into"
    author: "Addy Osmani"
    published: 2026-01-01
    accessed: 2026-01-08
    annotation: "Addy Osmani's workflow guide emphasizing pragmatic model selection and mid-task model switching patterns based on reasoning needs."
---

## Definition

**Model Routing** is the strategic assignment of different Large Language Models (LLMs) to different phases of the software development lifecycle based on their capability profile.

Different computational tasks have different performance characteristics. Model Routing matches model capabilities to task requirements: **reasoning depth** during design phases and **speed with large context windows** during implementation phases.

This is a tool selection strategy, not a delegation strategy. Engineers remain accountable for output quality while selecting the appropriate computational tool for each phase.

## The Problem: Single-Model Inefficiency

Using one model for all phases creates a mismatch between computational capability and task requirements.

High-speed models struggle with architectural decisions requiring deep constraint satisfaction. Reasoning models are too slow for high-volume implementation tasks. Models with massive context windows are expensive when you only need to process small, focused changes.

Each model class optimizes for different performance characteristics. Using the wrong one wastes either quality (insufficient reasoning) or resources (excessive capability for simple tasks).

## The Solution: Capability-Based Assignment

We categorize models into three capability profiles aligned with [Agentic SDLC](/concepts/agentic-sdlc) phases:

| Capability Profile | Optimization | Primary Use Cases | Model Examples |
|---|---|---|---|
| **High Reasoning** | Deep logic, high latency, "System 2" thinking | Writing [Specs](/patterns/the-spec), architectural decisions, logic debugging, security analysis | Gemini 3 Deep Think, DeepSeek V3.2, OpenAI o3-pro |
| **High Throughput** | Speed, low latency, real-time execution | Code generation, refactoring, unit tests, UI implementation | Gemini 3 Flash, Llama 4 Scout, Claude Haiku 4.5 |
| **Massive Context** | Repository-scale context (500k-5M tokens) | Documentation analysis, codebase navigation, legacy system understanding | Gemini 3 Pro (5M tokens), Claude 4.5 Sonnet (500k), GPT-5 (RAG-native) |

*Model examples current as of December 27, 2025. The LLM landscape evolves rapidly—validate capabilities and availability before implementation.*

## Relationship to Levels of Autonomy

[Levels of Autonomy](/concepts/levels-of-autonomy) define human oversight requirements. Model Routing complements this by matching computational capability to task characteristics:

- **Complex architectural decisions** (L3 with high uncertainty) → High Reasoning models
- **Well-specified implementation tasks** (L3 with clear contracts) → High Throughput models
- **Exploratory analysis** (L2 with discovery focus) → Massive Context models

This ensures that the computational tool's capability profile matches the task's computational requirements and the degree of human verification needed.

See also:
- [Agent Personas](/practices/agent-personas) — Context engineering practice for scoping agent work, extended by model routing
- [The Spec](/patterns/the-spec) — The artifact produced by High Reasoning models in the planning phase
- [Context Engineering](/concepts/context-engineering) — The practice of structuring context for optimal LLM performance
