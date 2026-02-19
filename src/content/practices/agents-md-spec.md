---
title: "AGENTS.md Specification"
description: "The definitive guide to the AGENTS.md file, focusing on minimal, high-signal context for AI agents."
tags: ["governance", "agents", "specification"]
relatedIds: ["concepts/context-engineering", "concepts/model-context-protocol", "practices/agent-personas", "patterns/agent-constitution"]
status: "Live"
lastUpdated: 2026-02-18
references:
  - type: "paper"
    title: "Evaluating AGENTS.md: Are Repository-Level Context Files Helpful for Coding Agents?"
    url: "https://arxiv.org/abs/2602.11988"
    author: "Thibaud Gloaguen, Niels Mündler, Mark Müller, Veselin Raychev, Martin Vechev"
    publisher: "ETH Zurich / LogicStar.ai"
    published: 2026-02-13
    annotation: "Empirical study showing minimal context files outperform verbose ones."
  - type: "video"
    title: "Beyond Vibe-Coding: Learn Effective AI-Assisted Coding in 4 minutes"
    url: "https://www.youtube.com/watch?v=HR5f2TDC65E"
    publisher: "Vanishing Gradients"
    annotation: "Source material for the Context Anchor concept."
  - type: "website"
    title: "AGENTS.md outperforms skills in our agent evals"
    url: "https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals"
    accessed: 2026-02-16
    publisher: "Vercel"
    annotation: "Research confirming that passive context maps outperform active tool retrieval for static knowledge."
---

## Definition

`AGENTS.md` is an open format for guiding coding agents, acting as a "README for agents." It provides a dedicated, predictable place for the minimal, human-authored context that agents need to work effectively on a project — things that are not already expressed by the repo itself.

We align with the [agents.md specification](https://agents.md), treating this file as the authoritative source of truth for agentic behavior within the ASDLC.

## When to Use

**Use this practice when:**
- Establishing a new repository for AI-assisted development
- Onboarding new AI tools (Cursor, Windsurf, Claude Code) to an existing project
- You need to standardize agent behavior across a team
- AI agents are making judgment calls you want to codify explicitly

**Skip this practice when:**
- The project is a temporary script or throwaway prototype
- You are not using any agentic tools or LLM assistants

## Core Philosophy

### 1. Minimal by Design

Research by Gloaguen et al. (2026) on 138 real-world repositories found that LLM-generated context files *reduce* agent task success rates while increasing inference cost by over 20%. Developer-written context files provide only a marginal improvement (+4%) — and only when they are minimal and precise. The conclusion is unambiguous: **unnecessary requirements in context files actively harm agent performance**, not because agents ignore them, but because agents follow them faithfully, broadening exploration and increasing reasoning cost without improving outcomes.

The default stance for agents.md should be: **if a constraint can be expressed elsewhere, it must not live here.**

### 2. Toolchain First

If a constraint can be enforced deterministically by a tool already in the repo — a linter, formatter, type checker, hook, or CI gate — it **must not** be restated in agents.md. The tool *is* the constraint. Restating it creates maintenance debt, dilutes signal, and burdens the agent with requirements it cannot actually enforce.

The correct pointer is:
```
Lint: `pnpm lint` (Biome — see `biome.json`)
```
Not a list of what Biome enforces.

**What belongs where:**

| Type | Example | Home |
|---|---|---|
| Toolchain-enforced | no `var`, import order, formatting | biome.json / eslint / tsconfig |
| Judgment / architectural | prefer composition, ask before adding deps | agents.md |
| Session-scoped persona | Critic, Builder | skill or workflow file |
| Task-specific style | API naming for this module | The Spec / PBI |

### 3. The Context Anchor (Long-Term Memory)

What agents.md *does* own is persistent judgment — the things that can't be expressed by a linter or a type checker. Agents are stateless. Without grounding, each session reverts to generic training weights. agents.md carries the project's **institutional judgment** for AI collaboration: how to resolve ambiguity, what to ask before acting, which architectural values to uphold.

This is stable, rarely-changing content. If your agents.md changes often, it is probably carrying content that belongs elsewhere.

### 4. A README for Agents

Just as `README.md` is for humans, `AGENTS.md` is for agents. It complements existing documentation by containing the context agents need that is not already discoverable from the repo structure, toolchain config, or existing docs.

### 5. Context is Code

In the ASDLC, we treat `AGENTS.md` with the same rigor as production software:
- **Version Controlled**: Tracked via git and PRs
- **Falsifiable**: Contains clear, testable behavioral expectations
- **Optimized**: Structured to maximize signal-to-noise ratio

## Tool-Specific Considerations

Different AI coding tools look for different filenames. While `AGENTS.md` is the emerging standard, some tools require specific naming:

| Tool | Expected Filename | Notes |
|---|---|---|
| **Cursor** | `.cursorrules` | Also reads `AGENTS.md` |
| **Windsurf** | `.windsurfrules` | Also reads `AGENTS.md` |
| **Claude Code** | `CLAUDE.md` | Does not read `AGENTS.md`; case-sensitive |
| **Codex** | `AGENTS.md` | Native support |
| **Zed** | `.rules` | Priority-based; reads `AGENTS.md` at lower priority |
| **VS Code / Copilot** | `AGENTS.md` | Requires `chat.useAgentsMdFile` setting enabled |

### Zed Priority Order

Zed uses the first matching file from this list:
1. `.rules`
2. `.cursorrules`
3. `.windsurfrules`
4. `.clinerules`
5. `.github/copilot-instructions.md`
6. `AGENT.md`
7. `AGENTS.md`
8. `CLAUDE.md`
9. `GEMINI.md`

### VS Code Configuration

VS Code requires explicit opt-in for `AGENTS.md` support:
- Enable `chat.useAgentsMdFile` setting to use `AGENTS.md`
- Enable `chat.useNestedAgentsMdFiles` for subfolder-specific instructions

### Recommendation

Create a symlink to support Claude Code without duplicating content:

```bash
ln -s AGENTS.md CLAUDE.md
```

Note that Claude Code also supports `CLAUDE.local.md` for personal preferences that shouldn't be version-controlled.

## Ecosystem Tools

### Ruler

[Ruler](https://github.com/intellectronica/ruler) synthesizes agent instructions from multiple sources (AGENTS.md, .cursorrules, project conventions) and injects them into coding assistants that may not natively support the AGENTS.md standard. Useful for teams using multiple coding assistants who want to maintain a single source of truth.

## Anatomy

The following sections form the minimal, effective structure for agents.md. Each section should only exist if it carries content that genuinely cannot live elsewhere.

### 1. Mission (The Project Context)

A concise description of the project's purpose and constraints. This differentiates domain context the agent cannot infer from code — a "User" in a banking app (ACID compliance, zero-trust) behaves very differently from a "User" in a casual game (low friction). Keep this to 2–4 sentences.

```md
> **Project:** ZenTask — a minimalist productivity app.  
> **Core constraint:** Local-first data architecture; offline support is non-negotiable.
```

### 2. Toolchain Registry

The minimal reference to what tools are in play and how to invoke them. **Do not describe what the tools enforce** — that is already in their config files.

| Intent | Command | Notes |
|---|---|---|
| **Build** | `pnpm build` | Outputs to `dist/` |
| **Test** | `pnpm test:unit` | Flags: --watch=false |
| **Lint** | `pnpm lint --fix` | Biome — see `biome.json` |
| **Type check** | `pnpm typecheck` | tsconfig.json is the authority |

### 3. Judgment Boundaries

The behavioral rules that cannot be expressed by a tool. These are the core value of agents.md — the steering constraints that shape how the agent reasons, not what the linter catches. Use the three-tier system:

**NEVER (Hard judgment limits):**
- Never commit secrets, tokens, or `.env` files
- Never add external dependencies without discussion
- Never guess on ambiguous specs — stop and ask

**ASK (Human-in-the-loop triggers):**
- Ask before running database migrations
- Ask before deleting files

**ALWAYS (Proactive judgment):**
- Explain your plan before writing code
- Handle all errors explicitly — never swallow exceptions silently

Note: If a rule here overlaps with something your toolchain enforces (e.g., linting rules, type errors), remove it from agents.md. The tool is the enforcement mechanism, not the agent.

### 4. Available Personas (Registry Only)

If your project uses multiple agent personas, list them by name and invocation. **Full persona definitions live in skill/workflow files**, not inline here. Loading all persona definitions on every session is wasteful when only one is active at a time.

```md
## Personas
Invoke via skill: @Lead, @Dev, @Designer, @Critic  
Definitions: `.claude/skills/`
```

For single-persona projects, a brief identity statement is sufficient:
```md
## Identity
Senior Systems Engineer — Go 1.22, gRPC, high-throughput concurrency.
Favor explicit error handling and composition over inheritance.
```

### 5. Context Map (Optional)

A structural index of the codebase for architectural orientation. This is most valuable for onboarding new sessions, spec writing, error triage, and ADR authoring — not primarily as a file-navigation aid for delivery tasks. Keep it high-level; agents can discover file-level details themselves.

> **Scope of value:** Gloaguen et al. (2026) found that directory maps in context files do not meaningfully accelerate file discovery during delivery tasks — agents navigate repositories effectively without them. The Context Map's value is in the broader SDLC: architectural orientation for new sessions, spec writing, error triage, and ADR authoring. It is an orientation tool, not a navigation shortcut for implementation agents. Do not use it as a substitute for good repo structure that speaks for itself.

See [Context Mapping](/practices/context-mapping) for implementation guidance.

## What to Audit Out

Periodically review agents.md for content that has migrated to the toolchain. Common offenders:

- Style rules that a linter now enforces (remove from agents.md)
- Library restrictions that a tsconfig or ESLint rule enforces (remove)
- Persona definitions that have been moved to skill files (replace with registry line)
- Codebase overviews copied from README (remove — the agent can read README)
- LLM-generated sections from `/init` commands (treat as draft, not final)

## On LLM-Generated Context Files

Most agent tools offer a `/init` or equivalent command that auto-generates an agents.md. **Treat this as a starting draft, not a finished file.** Gloaguen et al. (2026) found LLM-generated context files consistently reduce agent performance and inflate cost. The mechanism: agents follow the generated instructions faithfully, which broadens exploration and increases reasoning cost without improving task outcomes. The generated file is a useful inventory — use it to identify what *might* belong in agents.md, then apply the Toolchain First principle to strip everything that belongs elsewhere.

## Format Philosophy

The structures in this specification are optimized for larger teams and complex codebases. For smaller projects:
- A simple markdown list may suffice
- Focus on the *concepts* (mission, toolchain, boundaries) rather than exact syntax
- Iterate on what produces best adherence from your specific model

The goal is signal density, not format compliance. Overly rigid specs create adoption friction.

## Reference Template

`Filename: AGENTS.md`

```md
# AGENTS.md

> **Project:** High-throughput gRPC service for real-time financial transactions.  
> **Core constraints:** Zero-trust security model, ACID compliance on all writes.

## Toolchain
| Action | Command | Authority |
|---|---|---|
| Build | `make build` | Outputs to `./bin` |
| Test | `make test` | Runs with `-race` detector |
| Lint | `golangci-lint run` | See `.golangci.yml` |
| Proto | `make proto` | Regenerates gRPC stubs |

## Judgment Boundaries
**NEVER**
- Commit secrets, tokens, or `.env` files
- Add external dependencies without discussion
- Use `_` to ignore errors

**ASK**
- Before adding external dependencies
- Before running database migrations

**ALWAYS**
- Explain your plan before writing code
- Run `buf lint` after modifying any `.proto` file

## Personas
Invoke via skill: @Lead, @Dev, @Critic  
Definitions: `.claude/skills/`

## Context Map

Map out the project structure. Omit platform-, framework-, tooling-, library-, and framework-specific defaults the Agent can infer from the repository tooling and configuration.

```yaml
monorepo: pnpm workspaces

packages:
  apps/web: Next.js frontend
  apps/api: Express REST API, used by the apps/web and an external mobile app
  packages/ui: shared component library (consumed by web)
  packages/db: Prisma schema, client, migrations — import from here, not direct prisma calls
  packages/types: shared TypeScript types

notable:
  scripts/: repo-wide dev tooling, not shipped
  .env.example: canonical env vars reference, shipped with non-sensitive examples
```

_The key discipline: only list dirs/files that would surprise someone who knows the framework. Standard Next.js folders like src/app are borderline — include them only if your layout deviates from convention._
