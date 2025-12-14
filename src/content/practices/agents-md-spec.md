---
title: "AGENTS.md Specification"
description: "The definitive guide to the AGENTS.md file, including philosophy, anatomy, and implementation strategy."
lastUpdated: 2025-11-27
tags: ["governance", "agents", "specification"]
status: "Live"
---

## DEFINITION

`AGENTS.md` is an open format for guiding coding agents, acting as a "README for agents." It provides a dedicated, predictable place for context and instructions—such as build steps, tests, and conventions—that help AI coding agents work effectively on a project.

We align with the [agents.md specification](https://agents.md), treating this file as the authoritative source of truth for agentic behavior within the ASDLC.

## CORE PHILOSOPHY

**1. A README for Agents**

Just as `README.md` is for humans, `AGENTS.md` is for agents. It complements existing documentation by containing the detailed context—build commands, strict style guides, and test instructions—that agents need but might clutter a human-facing README.

**2. Context is Code**

In the ASDLC, we treat `AGENTS.md` with the same rigor as production software:

- **Version Controlled**: Tracked via git and PRs.
- **Falsifiable**: Contains clear success criteria for agent actions.
- **Optimized**: Structured to maximize signal-to-noise ratio for LLM context windows, preventing "Lost in the Middle" issues.

## ASDLC IMPLEMENTATION STRATEGY

While the [agents.md](https://agents.md) standard provides the format, the ASDLC defines a specific strict implementation to ensure reliability. We structure our `AGENTS.md` not just as a list of tips, but as a segmented database of rules.

### 1. Identity Anchoring (The Persona)

Establishes the specific expertise required to prune the model's search space. Without this, the model reverts to the "average" developer found in its training data. For detailed examples of defining multiple personas, see [Agent Personas](./agent-personas).

Bad: "You are a coding assistant."

Good: "You are a Principal Systems Engineer specializing in Go 1.22, gRPC, and high-throughput concurrency patterns. You favor composition over inheritance."

### 2. Contextual Alignment (The Mission)

A concise, high-level summary of the project’s purpose and business domain. This is often formatted as a blockquote at the top of the file to "set the stage" for the agent's session.

- **Why:** LLMs are stateless. A 50-token description differentiates a "User" in a banking app (high security/compliance) from a "User" in a casual game (low friction), reducing the need for corrective follow-up prompts.
    
- **Format:** Focus on the "What" and "Why," not the narrative history.
    

**Example:**

> **Project:** "ZenTask" - A minimalist productivity app. **Core Philosophy:** Local-first data architecture; offline support is mandatory.

### 3. Operational Grounding (The Tech Stack)

Explicitly defines the software environment to prevent "Library Hallucination." This section must be exhaustive regarding key dependencies and restrictive regarding alternatives.

- Directive: "Runtime: Node.js v20 (LTS) exclusively."
- Directive: "Styling: Tailwind CSS only. Do not use CSS Modules or Emotion."
- Directive: "State: Zustand only. Do not use Redux."

### 4. Behavioral Boundaries (Context Gates)

Replaces vague "Guardrails" with a "Three-Tiered Boundary" system, or _constitution_. As the models are probabilistic, absolute prohibitions are unrealistic. Instead, this system categorizes rules by severity and required action. These rules are aimed to reducing the likelihood of critical errors. Note that you should always complement
the _constitution_ with explicit and deterministic _quality gates_ enforced by tests, linters, and CI/CD pipelines.

**Tier 1 (Constitutive - ALWAYS): Non-negotiable standards.**

Example: "Always add JSDoc to exported functions."

**Tier 2 (Procedural - ASK): High-risk operations requiring Human-in-the-Loop.**

Example: "Ask before running database migrations or deleting files."

**Tier 3 (Hard Constraints - NEVER): Safety limits.**

Example: "Never commit secrets, API keys, or .env files."

### 5. The Command Registry

A lookup table mapping intent to execution. Agents often default to standard commands (npm test) which may fail in custom environments (make test-unit). The Registry forces specific tool usage.

| Intent | Command | Notes |
| :--- | :--- | :--- |
| **Build** | pnpm build | Outputs to `dist/` |
| **Test** | pnpm test:unit | Flags: --watch=false |
| **Lint** | pnpm lint --fix | Self-correction enabled |


### 6. Implementation notes

XML-Tagging for Semantic Parsing

To maximize adherence, use pseudo-XML tags to encapsulate rules. This creates a "schema" that the model can parse more strictly than bullet points.

```xml
<coding_standard name="React Hooks">
  <instruction>
    Use functional components and Hooks. Avoid Class components.
    Ensure extensive use of custom hooks for logic reuse.
  </instruction>
  <anti_pattern>
    class MyComponent extends React.Component {... }
  </anti_pattern>
  <preferred_pattern>
    const MyComponent = () => {... }
  </preferred_pattern>
</coding_standard>
```

## REFERENCE TEMPLATE

`Filename: AGENTS.md`

```md
# AGENTS.md - Context & Rules for AI Agents

> **Project Mission:** High-throughput gRPC service for processing real-time financial transactions.
> **Core Constraints:** Zero-trust security model, ACID compliance required for all writes.

## 1. Identity & Persona
- **Role:** Senior Systems Engineer
- **Specialization:** High-throughput distributed systems in Go.
- **Objective:** Write performant, thread-safe, and maintainable code.

## 2. Tech Stack (Ground Truth)
- **Language:** Go 1.22 (Use `iter` package for loops)
- **Transport:** gRPC (Protobuf v3)
- **Database:** PostgreSQL 15 with `pgx` driver (No ORM allowed)
- **Infra:** Kubernetes, Helm, Docker

## 3. Operational Boundaries (CRITICAL)
- **NEVER** commit secrets, tokens, or `.env` files.
- **NEVER** modify `api/proto` without running `buf generate`.
- **ALWAYS** handle errors; never use `_` to ignore errors.
- **ASK** before adding external dependencies.

## 4. Command Registry
| Action | Command | Note |
| :--- | :--- | :--- |
| **Build** | `make build` | Outputs to `./bin` |
| **Test** | `make test` | Runs with `-race` detector |
| **Lint** | `golangci-lint run` | Must pass before commit |
| **Gen** | `make proto` | Regenerates gRPC stubs |

## 5. Coding Standards
```xml
<rule_set name="Concurrency">
  <instruction>Use `errgroup` for managing goroutines. Avoid bare `go` routines.</instruction>
  <example>
    <bad>go func() {... }()</bad>
    <good>g.Go(func() error {... })</good>
  </example>
</rule_set>
```

## 6. Context References
- **Database Schema:** Read `@database/schema.sql`
- **API Contracts:** Read `@api/v1/service.proto`
```
