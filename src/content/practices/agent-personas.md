---
title: "Agent Personas"
description: "A guide on how to add multiple personas to an AGENTS.md file, with examples."
lastUpdated: 2026-02-18
tags: ["agents", "personas", "guide"]
relatedIds: ["patterns/model-routing", "concepts/context-engineering", "practices/agents-md-spec"]
status: "Live"
references:
  - type: "paper"
    title: "Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?"
    url: "https://arxiv.org/abs/2602.11988"
    author: "Thibaud Gloaguen, Niels Mündler, Mark Müller, Veselin Raychev, Martin Vechev"
    publisher: "ETH Zurich / LogicStar.ai"
    published: 2026-02-13
    annotation: "Agents follow instructions they receive faithfully — loading irrelevant persona definitions increases reasoning cost without improving outcomes. Supports session-scoped persona injection over always-on loading."
---

## Definition

Defining clear personas for your agents scopes their work by defining boundaries and focus — not by role-playing. A persona tells the agent what kind of judgment to apply, what to prioritize, and what to hand off. When combined with [Model Routing](/patterns/model-routing), personas can also specify which model to use for each type of work.

For the full specification of the `AGENTS.md` file, see the [AGENTS.md Specification](./agents-md-spec).

## Where Personas Live

**Personas are session-scoped, not project-scoped.** A Critic persona is irrelevant during implementation work. A Designer persona is irrelevant during triage. Loading all persona definitions on every session wastes context and can actively burden the agent with instructions it won't use — and research shows agents follow instructions they receive faithfully, whether relevant or not (Gloaguen et al., 2026).

| Project type | Where personas live |
|---|---|
| Single-persona, simple project | Inline identity statement in agents.md is fine |
| Multi-persona project | Skill/workflow files; agents.md holds registry only |
| Workflow-triggered persona | Defined as part of the workflow, injected at invocation |

The agents.md should contain a **persona registry** — names and invocation patterns — not full definitions. The full definition (triggers, goals, guidelines) lives in the skill or workflow file that gets injected when that persona is actually needed.

```md
## Personas
Invoke via skill: @Lead, @Dev, @Designer, @Critic
Definitions: `.claude/skills/`
```

## When to Define a Persona

**Use a persona when:**
- You have distinct workflows with genuinely different judgment requirements (e.g., speccing vs. implementation vs. review)
- A single generic instruction set produces conflicting behaviors
- You need to support adversarial patterns like [Adversarial Code Review](/patterns/adversarial-code-review)
- You are hitting context limits with a monolithic instruction set

**Skip explicit personas when:**
- The project is simple enough for a single "General Developer" identity
- Model selection alone (via Model Routing) handles the variation

## Anatomy of a Persona Definition

Each persona definition in a skill file should have four elements:

**Trigger** — When is this persona active?
**Goal** — What is this persona trying to achieve?
**Guidelines** — What judgment rules apply in this context?
**Boundaries** — What does this persona explicitly not do?

## Example: Multi-Persona Skill Files

The following are example skill file contents (not agents.md content):

### `.claude/skills/lead.md`
```md
### Lead Developer / Architect (@Lead)
**Trigger:** System design, specs, planning, ADRs.
**Goal:** Specify feature requirements and architecture. Plan next steps. Produce clear specs before handing to implementation.
**Guidelines**
- Schema Design: Define Zod schemas immediately when creating new content types.
- Routing: Use file-based routing. For dynamic docs, use `[...slug].astro` and `getStaticPaths()`.
- Spec-driven: Always produce a clear spec before handoff. Break large tasks into PBIs with acceptance criteria.
- ADR: Record architectural decisions in `docs/adr/` before implementation begins.
**Boundaries**
- Does not write implementation code — hands off to @Dev.
- Does not review finished code — hands off to @Critic.
```

### `.claude/skills/dev.md`
```md
### Developer / Implementation Agent (@Dev)
**Trigger:** Implementation tasks, bug fixes.
**Goal:** Implement features and fix bugs from a defined PBI. Keep the codebase healthy and maintainable.
**Guidelines**
- Always work from a PBI with clear acceptance criteria.
- Type Safety: TypeScript strictly. No `any` types.
- Document progress: Update the relevant PBI in `docs/backlog/` after completing tasks.
- Testing: Ensure all changes pass `pnpm check` and `pnpm lint`.
**Boundaries**
- Does not redesign architecture — flags issues and escalates to @Lead.
- Does not self-approve — hands off to @Critic for review.
```

### `.claude/skills/critic.md`
```md
### Critic / Reviewer (@Critic)
**Trigger:** Code review, constitutional review, pre-merge validation.
**Goal:** Be a skeptical gatekeeper. Assume code is broken or insecure until proven otherwise.
**Guidelines**
- Validate against both The Spec and the Agent Constitution.
- If the spec is vague, reject and demand clarification — do not assume.
- Prioritize correctness and edge-case handling over helpfulness.
- Flag security issues, missing error handling, and type violations explicitly.
**Boundaries**
- Does not fix issues — reports them for @Dev to address.
- Does not approve if any Tier 1 boundary from the Constitution is violated.
```

## agents.md: Registry Only

In agents.md, the persona section should be minimal:

```md
## Personas
Invoke via skill: @Lead, @Dev, @Critic
Definitions: `.claude/skills/`
```

For single-persona projects, an inline identity statement in agents.md is appropriate:

```md
## Identity
Senior Systems Engineer — Go 1.22, gRPC, high-throughput concurrency.
Favor explicit error handling and composition over inheritance.
Prefer asking over guessing when specs are ambiguous.
```

## Model Routing and Personas

Personas define **what work to do** and **how to scope it**. [Model Routing](/patterns/model-routing) is a separate practice that defines **which model to use**.

Keep them separate. Do not add model profiles to persona definitions — it adds noise and the pairing changes as models evolve. When invoking a persona, select the model manually based on task characteristics:

| Persona Type | Typical Work | Recommended Profile |
|---|---|---|
| Lead / Architect | System design, specs, ADRs | High Reasoning |
| Developer / Implementation | Code generation, refactoring | High Throughput |
| Critic / Reviewer | Constitutional review, security | High Reasoning |
| Content / Docs | Documentation, KB entries | Massive Context |
