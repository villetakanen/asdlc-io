---
title: Agentic SDLC
description: "Framework for industrializing software development where agents serve as the logistic layer while humans design, govern, and optimize the flow."
tags:
  - Core
  - SDLC
  - Methodology
  - Industrialization
relatedIds:
  - concepts/context-engineering
  - concepts/model-context-protocol
  - patterns/context-gates
  - concepts/levels-of-autonomy
  - patterns/model-routing
  - patterns/the-spec
  - concepts/ai-amplification
lastUpdated: 2026-01-01
status: Live
---

## Definition

The Agentic Software Development Life Cycle (ASDLC) is a framework for industrializing software engineering. It represents the shift from craft-based development (individual artisans, manual tooling, implicit knowledge) to industrial-scale production (standardized processes, agent orchestration, deterministic protocols).

> "Agentic architecture is the conveyor belt for knowledge work." — [Ville Takanen](https://villetakanen.com/blog/scenario-26-industrialization-of-knowledge-work/)

ASDLC is not about "AI coding assistants" that make developers 10% faster. It's about building the **software factory**—systems where agents serve as the architecture of labor while humans design, govern, and optimize the flow.

## The Industrial Thesis

**Agents do not replace humans; they industrialize execution.**

Just as robotic arms automate welding without replacing manufacturing expertise, agents automate high-friction parts of knowledge work (logistics, syntax, verification) while humans focus on intent, architecture, and governance.

In this model:
- **Agents are the logistic layer** — Moving information, verifying specs, executing tests
- **Context is the supply chain** — Just-in-Time delivery of requirements, schemas, and code
- **Standardization is mandatory** — Schemas, typed interfaces, deterministic protocols replace "vibes"
- **AI Amplification** — Agents act as a "High-Pass Filter" for process maturity: they accelerate good practices but amplify the chaos of bad ones.

## The Cybernetic Model

ASDLC operates at [L3 Conditional Autonomy](/concepts/levels-of-autonomy)—a "Fighter Jet" model where the Agent acts as the Pilot executing maneuvers, and the Human acts as the Instructor-in-the-Cockpit.

**Key Insight:** Compute is cheap, but novelty and correctness are expensive. Agents naturally drift toward the "average" solution (Regression to the Mean). The Instructor's role is not to write code, but to define failure boundaries (Determinism) and inject strategic intent (Steering) that guides agents out of mediocrity.

## The Cybernetic Loop

The lifecycle replaces the linear CI/CD pipeline with a high-frequency feedback loop:

**Mission Definition**: The Instructor defines the "Objective Packet" (Intent + Constraints). This is the core of Context Engineering.

**Generation (The Maneuver)**: The Agent autonomously maps context—often using the Model Context Protocol (MCP) to fetch live data—and executes the task.

**Verification (The Sim)**: Automated Gates check for technical correctness (deterministic), while the Agent's Constitution steers semantic intent (probabilistic).

**Course Correction (HITL)**: The Instructor intervenes on technically correct but "generic" solutions to enforce architectural novelty.

## Strategic Pillars

### Factory Architecture (Orchestration)
Projects structured with agents as connective tissue, moving from monolithic context windows to discrete, specialized stations (Planning, Spec-Definition, Implementation, Review).

### Standardized Parts (Determinism)
Schema-First Development where agents fulfill contracts, not guesses. `AGENTS.md`, `specs/`, and strict linting serve as the "jigs" and "molds" that constrain agent output.

### Quality Control (Governance)
Automated, rigorous inspection through Probabilistic Unit Tests and Human-in-the-Loop (HITL) gates. Trust the _process_, not just the output.

## ASDLC Usage

Full project vision: [/docs/vision.md](../../docs/vision.md)

Applied in: [Specs](/patterns/the-spec), [AGENTS.md Specification](/practices/agents-md-spec), [Context Gates](/patterns/context-gates), [Model Routing](/patterns/model-routing)
