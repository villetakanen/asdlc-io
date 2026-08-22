---
name: assemble
description: "Dev-Critic loop: implement, review, fix — repeat until clean"
argument-hint: "[PBI number, Linear issue ID, or task description]"
version: 1.0.0
---

# Assemble — Dev-Critic feedback loop

Orchestrate a **Dev -> Critic** feedback loop, driving a task from implementation to a clean, verified state without human intervention — unless genuine blocking questions arise.

## Trigger

When a task needs full implementation AND review in one go.

## Goal

Run `dev` and `critic` in alternating cycles until the critic issues a **PASS** verdict. Each cycle runs in its own sub-agent with a fresh context window. Only interrupt the user when a question genuinely blocks progress.

## Boundaries

- **In scope:** orchestrating dev-critic sub-agent cycles to reach PASS, managing the circuit breaker.
- **Out of scope:** committing or pushing (`ship`), authoring or modifying specs (`spec`), creating Linear issues (`lead`).

## Pipeline

### Step 0 — Context Gathering

Before starting the loop, gather the context the sub-agents will need:

1. Read the task: `$ARGUMENTS`
2. If a PBI/Linear issue ID is given, fetch it via MCP to get acceptance criteria.
3. Identify relevant specs in `specs/` for the task domain.
4. Read `AGENTS.md` / `CLAUDE.md` for project constraints.

Compile this into a **Task Brief** — a self-contained description that each sub-agent receives.

### Step 1 — Dev Cycle

Spawn a **sub-agent** (model: sonnet / pro) with the full `dev` skill instructions and the Task Brief.

The dev agent prompt must include:
- The complete `dev` skill instructions (from `.agents/skills/dev/SKILL.md` or `.claude/skills/dev/SKILL.md`)
- The Task Brief from Step 0
- If this is cycle N>1: the **Critic Findings** from the previous cycle, with explicit instructions to fix each violation

Wait for the dev agent to complete. Capture its summary of changes made.

### Step 2 — Critic Cycle

Spawn a **sub-agent** (model: sonnet / pro) with the full `critic` skill instructions.

The critic agent prompt must include:
- The complete `critic` skill instructions (from `.agents/skills/critic/SKILL.md` or `.claude/skills/critic/SKILL.md`)
- The Task Brief (so the critic knows what was intended)
- The dev agent's summary of what was changed

Wait for the critic agent to complete. Parse the verdict.

### Step 3 — Decision Gate

Based on the critic's verdict:

- **PASS** — Proceed to Step 4 (finish).
- **PASS WITH NOTES** — Proceed to Step 4 (finish). Report the notes to the user.
- **FAIL** — Extract the violation list. Go back to Step 1 with the findings as fix instructions.

**Circuit breaker:** If you have completed **3 full cycles** without reaching PASS, stop and present the remaining findings to the user. Ask whether to continue or adjust the approach. Do not loop forever.

### Step 4 — Finish

Report to the user:
- Summary of what was implemented
- Number of dev-critic cycles it took
- Final critic verdict (and any notes)
- Suggest running `/ship` to commit and push

## Sub-Agent Model Policy

Follow the standard model policy for sub-agent spawning:
- **haiku / flash** — File search, grep, reading files, listing issues, gathering context
- **sonnet / pro** — Code edits, writing content, running validation, critic reviews
- **opus** — Only if a sub-task genuinely requires it; ask user first

## Principles

- **Fresh context per cycle** — Each dev/critic run is a separate sub-agent. No stale state accumulation.
- **Self-healing** — Critic findings feed directly into the next dev cycle as fix instructions.
- **Silent unless stuck** — Do not ask the user for confirmation between cycles. Only interrupt if genuinely blocked (ambiguous requirement, conflicting specs, architectural question).
- **Deterministic exit** — The loop has a clear termination condition (PASS) and a circuit breaker (3 cycles).

## Instructions

$ARGUMENTS
