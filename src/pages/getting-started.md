---
layout: ../layouts/ProseLayout.astro
title: Getting Started with ASDLC
description: A practical guide to implementing the Agentic Software Development Life Cycle in your team.
---

## What Is This?

ASDLC (Agentic Software Development Life Cycle) is a framework for building software with AI agents—not as toys or assistants, but as industrial infrastructure.

We reject "[vibe coding](/concepts/vibe-coding)." We reject copy-pasting ChatGPT output and hoping it works. Instead, we treat agent-assisted development with the same rigor as any serious engineering discipline: schemas, contracts, gates, and governance.

> "Agentic architecture is the conveyor belt for knowledge work."

If that sounds like overkill for your weekend project, it probably is. ASDLC is for teams building production software who want deterministic, repeatable outcomes from non-deterministic AI systems.

## The Core Idea

**Agents don't replace developers. They industrialize execution.**

Think automotive manufacturing: robotic arms automate welding, but they don't replace the need for manufacturing expertise. Someone still designs the car, optimizes the assembly line, and ensures quality control.

<figure>
  <img src="/images/agentic-double-diamond.svg" alt="Agentic Double Diamond"/>
  <figcaption>In the ASDLC, the <strong>Spec</strong> becomes the primary source code, and "Delivery" becomes an automated <strong>assembly</strong> step. The human role shifts from <i>Crafting</i> to Engineering.</figcaption>
</figure>

ASDLC defines three layers:

| Layer | Function | Human Role |
|-------|----------|------------|
| **Context** | The supply chain—requirements, schemas, specs delivered just-in-time | Curator |
| **Agents** | The logistics layer—moving information, generating code, running tests | Operator |
| **Gates** | Quality control—deterministic checks + human oversight | Governor |

The human contribution shifts from *writing code* to *designing systems, defining contracts, and governing output*.

## The Five-Minute Version

If you remember nothing else:

1. **Write specs before code.** The [Spec](/patterns/the-spec) is the permanent source of truth. Agents read it; code fulfills it. No spec, no build.
2. **Treat context as code.** Your [AGENTS.md](/practices/agents-md-spec) file is version-controlled, peer-reviewed, and optimized for agent consumption. It's not a suggestion box.
3. **Use gates, not hope.** [Context Gates](/concepts/context-gates) enforce quality at three levels: deterministic (compilers, tests), probabilistic (AI review), and human (strategic fit).
4. **Separate state from delta.** The Spec defines *how it works* (state). The [PBI](/patterns/the-pbi) defines *what changes* (delta). Don't conflate them.
5. **Commit constantly.** [Micro-Commits](/practices/micro-commits) are save points. When an agent generates garbage in file 4 of 10, you can rollback without losing everything.

## Learning Paths

### Path A: "I want to understand the philosophy"

Start with the concepts that define the methodology:

1. **[Agentic SDLC](/concepts/agentic-sdlc)** — The manifesto. Why industrialization, why L3 autonomy, why determinism over vibes.
2. **[Levels of Autonomy](/concepts/levels-of-autonomy)** — The SAE-inspired scale. We standardize at L3 (Conditional)—agents execute, humans instruct.
3. **[Context Engineering](/concepts/context-engineering)** — Why context is your most valuable asset, not the model.
4. **[The 4D Framework](/concepts/4d-framework)** — Anthropic's model: Delegation, Description, Discernment, Diligence.

### Path B: "I want to ship something today"

Start with the practices you can implement immediately:

1. **[AGENTS.md Specification](/practices/agents-md-spec)** — Create the file that steers every agent in your repo. 30 minutes.
2. **[Living Specs](/practices/living-specs)** — Write your first spec. Template included. 1 hour.
3. **[PBI Authoring](/practices/pbi-authoring)** — Structure work items agents can actually execute. 30 minutes.
4. **[Micro-Commits](/practices/micro-commits)** — Change your git habits. Immediate.

### Path C: "I want to design the whole system"

Understand how the pieces connect:

1. **[Spec-Driven Development](/concepts/spec-driven-development)** — The overarching methodology.
2. **[The Spec](/patterns/the-spec)** + **[The PBI](/patterns/the-pbi)** — State vs. delta, permanent vs. transient.
3. **[Context Gates](/concepts/context-gates)** — Input filtering, output validation, the three-tier system.
4. **[Feature Assembly](/practices/feature-assembly)** — How PBIs execute against specs and pass through gates.
5. **[Adversarial Code Review](/patterns/adversarial-code-review)** — Using a Critic Agent to validate Builder output.
6. **[The ADR](/patterns/the-adr)** — Architecture Decision Records as immutable context for agents.

## Quick Reference

### Key Artifacts

| Artifact | Location | Purpose |
|----------|----------|---------|
| `AGENTS.md` | Repo root | Agent constitution, tech stack, commands |
| `plans/{feature}/spec.md` | Per feature | Permanent source of truth |
| `tasks/PBI-XXX.md` | Backlog | Transient execution unit |
| `ARCHITECTURE.md` | Repo root | Global system constraints |
| `docs/adrs/` | Repo root | Architecture Decision Records |

### The Gate Hierarchy

```
Quality Gates (Deterministic)
    ↓ Pass
Review Gates (Probabilistic - Critic Agent)
    ↓ Pass
Acceptance Gates (Human-in-the-Loop)
    ↓ Approve
Merge
```

### Model Routing Cheat Sheet

| Task Type | Model Profile | Examples |
|-----------|--------------|----------|
| Architecture, specs, debugging | High Reasoning | Gemini 3 Deep Think, DeepSeek V3.2 |
| Code generation, refactoring | High Throughput | Gemini 3 Flash, Llama 4 Scout, Claude Haiku 4.5 |
| Legacy analysis, large context | Massive Context | Gemini 3 Pro (5M), Claude 4.5 Sonnet (500k) |

## What ASDLC Is Not

- **Not a prompt library.** We don't collect "awesome prompts." We define systems.
- **Not a tool recommendation.** Cursor, Claude Code, Windsurf—use what works. The methodology is tool-agnostic.
- **Not about replacing developers.** It's about changing *what developers do*: less typing, more designing.
- **Not magic.** Agents are probabilistic. They drift toward mediocrity. ASDLC provides the constraints that keep them useful.

## Next Steps

1. **Read the [Agentic SDLC](/concepts/agentic-sdlc) overview** — Understand the thesis.
2. **Add `AGENTS.md` to your repo** — Use the [template](/practices/agents-md-spec#reference-template).
3. **Write one spec** — Pick a feature, follow the [Living Specs](/practices/living-specs) guide.
4. **Draft an ADR** — Document a key decision using the [ADR pattern](/patterns/the-adr).
5. **Try the loop** — Spec → PBI → Implementation → Gate → Merge.

Questions? The methodology is documented. The patterns are linked. Start building.

## Accessing the Knowledge Base

Stay grounded in official ASDLC patterns and practices through two primary agent-ready interfaces:

### 1. Model Context Protocol (MCP)

The ASDLC Knowledge Base is a live MCP server. Connect your agent to:

```
https://asdlc.io/mcp
```

Tools available: `search_knowledge_base`, `get_article`, `list_articles`.

### 2. Downloadable Static Skill

For offline, local-first, or air-gapped workflows, use the **Downloadable Static Skill**. This is a self-contained bundle of the Knowledge Base with relative links and agent-optimized manifest.

- **Download**: [asdlc-skill.zip](/asdlc-skill.zip)
- **Setup**: Extract into `.asdlc/` or `.cursorrules/` in your repo.
- **Usage**: Point your agent to the `SKILL.md` manifest as a context anchor.
