---
title: "Write an AGENTS.md File"
longTitle: "Write an AGENTS.md File for Your Agentic Project"
description: "Create a minimal, high-signal AGENTS.md (or CLAUDE.md) that grounds coding agents without degrading performance through over-specification."
tags: ["agents-md", "claude-code", "setup"]
lastUpdated: 2026-04-03
status: Live
difficulty: Beginner
category: Setup
estimatedMinutes: 10
tools: ["Claude Code"]
prerequisites:
  - "practices/agents-md-spec"
  - "Claude Code CLI"
relatedIds:
  - "practices/agents-md-spec"
agentPrompt: "Use this recipe when a project has no AGENTS.md or CLAUDE.md. Apply it at project setup or when onboarding Claude Code to an existing repo. Goal: produce a minimal, high-signal context file. Stop before adding rules that belong in a linter or type-checker."
---

## Overview

An `AGENTS.md` file (called `CLAUDE.md` in Claude Code projects) provides coding agents with the minimal context they cannot infer from the repository itself. See [AGENTS.md Specification](/practices/agents-md-spec) for the full philosophy and anatomy.

Research shows that minimal, developer-written context files outperform verbose ones. Keep the file small and high-signal.

## Step 1 — Create the file

Create `AGENTS.md` at the repository root.

```bash
touch AGENTS.md
```

For Claude Code specifically, create `CLAUDE.md` instead (Claude Code does not read `AGENTS.md`):

```bash
touch CLAUDE.md
```

To support both Claude Code and other tools from a single source, create a symlink:

```bash
ln -s AGENTS.md CLAUDE.md
```

## Step 2 — Add the Mission section

Open the file and add a brief project context block. Limit this to 2–4 sentences covering the domain constraints the agent cannot infer from code.

```md
# AGENTS.md

> **Project:** ZenTask — a minimalist productivity app.
> **Core constraint:** Local-first data architecture; offline support is non-negotiable.
```

Replace the example with your project's actual purpose and its non-negotiable constraints.

## Step 3 — Add the Toolchain Registry

List only the non-standard commands an agent needs to run in this project. Do not describe what each tool enforces — that information lives in its configuration file.

```md
## Toolchain

| Intent | Command |
|---|---|
| Dev server | `pnpm dev` |
| Build | `pnpm build` |
| Type check | `pnpm check` |
| Lint | `pnpm lint` |
| Test | `pnpm test:run` |
```

## Step 4 — Add Judgment Boundaries

Capture behavioral rules that a linter or type-checker cannot enforce. Use the three-tier structure: `NEVER`, `ASK`, and `ALWAYS`.

```md
## Judgment Boundaries

### NEVER
- Commit secrets, tokens, or `.env` files
- Add external dependencies without prior discussion

### ASK
- Before running database migrations
- Before deleting content files

### ALWAYS
- Run `pnpm check` before marking a task done
- Explain the plan before writing code
```

Only add rules here that cannot be expressed by a tool in the repository. Remove any rule the moment it is covered by a linter or CI gate.

## Step 5 — Add Personas (optional)

If the project uses multiple agent personas, list them by name and invocation trigger. Full definitions must live in separate skill files — not inline in `AGENTS.md`.

```md
## Personas

Invoke via `/command`. Definitions: `.claude/skills/`

| Persona | Trigger |
|---|---|
| @Lead | `/lead` — system design, planning |
| @Dev | `/dev` — implementation |
| @Critic | `/critic` — adversarial review |
```

Omit this section entirely for single-persona or early-stage projects.

## Step 6 — Validate

Run the project's type-check and build to confirm nothing is broken.

```bash
pnpm check && pnpm build
```

## Step 7 — Commit

Stage and commit the file once the build is clean.

```bash
git add AGENTS.md
git commit -m "chore: add AGENTS.md"
```

## What to Avoid

- Do not copy constraints already enforced by `biome.json`, `tsconfig.json`, or other toolchain configs.
- Do not paste an LLM-generated `/init` output verbatim — use it as an inventory, then strip everything that belongs in tooling.
- Do not add a Context Map unless agents are consistently failing to find files. See [AGENTS.md Specification](/practices/agents-md-spec) for when a Context Map is warranted.
