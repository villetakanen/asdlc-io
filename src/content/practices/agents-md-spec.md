---
title: "AGENTS.md Specification"
description: "The definitive guide to the AGENTS.md file, including philosophy, anatomy, and implementation strategy."
lastUpdated: 2025-11-27
tags: ["governance", "agents", "specification"]
status: "Proposed"
---

# DEFINITION

The Context Artifact, standardized as AGENTS.md, is a machine-readable governance file residing at the root of a software repository. It serves as a persistent "System Prompt Injection," transforming abstract architectural intent into strict algorithmic constraints.

Unlike a README.md (written for human onboarding), AGENTS.md is written for the Token Economy of a Large Language Model (LLM). It is the bridge that closes the "Contextual Gap" between human implicit knowledge and agentic stochastic behavior.

CORE PHILOSOPHY

1. Context is Code

In an agentic workflow, intelligence is a commodity; context is the differentiator. Therefore, AGENTS.md must be treated with the same rigor as production software:

Version Controlled: It must be diffed in PRs.

Immutable: It acts as the "Ground Truth" for the session.

Falsifiable: It must contain clear pass/fail criteria for agent behavior.

2. Token Economy

Modern models have large context windows (200k+ tokens), but attention degrades over length ("Lost in the Middle" phenomenon). A well-formed AGENTS.md optimizes for Signal-to-Noise Ratio. It prioritizes imperative instructions over conversational prose, using structural markers (XML tags, headers) to guide the model's attention heads.

ANATOMY OF A PERFORMING FILE

A valid AGENTS.md is not a "Context Dump" of documentation. It is a segmented database of rules, mapped to the specific reasoning stages of the agent.

1. Identity Anchoring (The Persona)

Establishes the specific expertise required to prune the model's search space. Without this, the model reverts to the "average" developer found in its training data.

Bad: "You are a coding assistant."

Good: "You are a Principal Systems Engineer specializing in Go 1.22, gRPC, and high-throughput concurrency patterns. You favor composition over inheritance."

2. Operational Grounding (The Tech Stack)

Explicitly defines the software environment to prevent "Library Hallucination." This section must be exhaustive regarding key dependencies and restrictive regarding alternatives.

Directive: "Runtime: Node.js v20 (LTS) exclusively."

Directive: "Styling: Tailwind CSS only. Do not use CSS Modules or Emotion."

Directive: "State: Zustand only. Do not use Redux."

3. Behavioral Boundaries (Context Gates)

Replaces vague "Guardrails" with a "Three-Tiered Boundary" system:

Tier 1 (Constitutive - ALWAYS): Non-negotiable standards.

Example: "Always add JSDoc to exported functions."

Tier 2 (Procedural - ASK): High-risk operations requiring Human-in-the-Loop.

Example: "Ask before running database migrations or deleting files."

Tier 3 (Hard Constraints - NEVER): Safety limits.

Example: "Never commit secrets, API keys, or .env files."

4. The Command Registry

A lookup table mapping intent to execution. Agents often default to standard commands (npm test) which may fail in custom environments (make test-unit). The Registry forces specific tool usage.

Intent: "Test" $\rightarrow$ Command: pnpm test:unit (Flags: --watch=false)

Intent: "Lint" $\rightarrow$ Command: pnpm lint --fix (Self-correction enabled)

IMPLEMENTATION STRATEGY

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


Chain-of-Thought (CoT) Enforcement

To prevent "lazy coding," the file should mandate a reasoning protocol for complex tasks.

Protocol: "Before generating code, you MUST output a plan:

Analyze: Identify affected files.

Design: Propose function signatures.

Verify: List tests to be added."

REFERENCE TEMPLATE

Filename: AGENTS.md

# AGENTS.md - Context & Rules for AI Agents

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
