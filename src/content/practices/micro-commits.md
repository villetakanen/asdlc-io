---
title: "Micro-Commits"
description: "Ultra-granular commit practice for agentic workflows, treating version control as reversible save points."
tags: ["Version Control", "Git", "Safety", "Rollback"]
relatedIds: ["patterns/the-pbi", "concepts/context-gates", "concepts/agentic-sdlc"]
status: "Live"
lastUpdated: 2025-12-27
---

## Definition

**Micro-Commits** is the practice of committing code changes at much higher frequency than traditional development workflows. Each discrete task—often a single function, test, or file—receives its own commit.

When working with LLM-generated code, commits become "save points in a game": checkpoints that enable instant rollback when probabilistic outputs introduce bugs or architectural drift.

## The Problem: Coarse-Grained Commits in Agentic Workflows

Traditional commit practices optimize for human readability and PR review: "logical units of work" that span multiple files and implement complete features.

This fails in agentic workflows because:

**LLM outputs are probabilistic** — A model might generate correct code for 3 files and introduce subtle bugs in the 4th. Bundling all 4 files into one commit makes rollback destructive.

**Regression to mediocrity** — Without checkpoints, it's difficult to identify where LLM output drifted from the [Spec](/patterns/the-spec) contracts.

**Context loss** — Large commits obscure the sequence of decisions. When debugging, you need to know "what changed, when, and why."

**No emergency exit** — If an LLM generates a tangled mess across 10 files, your only option is manual surgery or discarding hours of work.

## The Solution: Commit After Every Task

Make a commit immediately after:
- Completing a [PBI](/patterns/the-pbi) subtask
- Generating a single function or module
- Making a file pass linting/compilation
- Adding one test
- Any LLM-assisted edit that produces working code

This creates a breadcrumb trail of working states.

## The Practice

### 4.1. Atomic Tasks → Atomic Commits

Break work into small, testable chunks. Each chunk maps to one commit.

**Example PBI:** "Add OAuth login flow"

**Commit sequence:**
```
1. feat: add OAuth config schema
2. feat: implement token exchange endpoint
3. feat: add session storage for OAuth tokens
4. test: add OAuth flow integration test
5. refactor: extract OAuth error handling
```

This aligns with atomic [PBIs](/patterns/the-pbi): small, bounded execution units.

### 4.2. Commit Messages as Execution Log

Commit messages document the sequence of LLM-assisted changes. They serve as:
- **Context for debugging** — "The bug appeared after commit 7."
- **Briefing material for AI** — Feed recent commits to an LLM to explain current state.
- **Audit trail** — Track architectural decisions embedded in code changes.

**Format:**
```
type(scope): brief description

- Detail 1
- Detail 2
```

**Example:**
```
feat(auth): implement OAuth token validation

- Add JWT verification middleware
- Extract claims from token payload
- Return 401 on expired tokens
```

### 4.3. Branches and Worktrees for Isolation

Use branches or git worktrees to isolate LLM experiments:

**Branches** — Separate experimental work from stable code. Merge only after validation.

**Worktrees** — Run parallel LLM sessions on the same repository without context conflicts. Each worktree is an independent working directory.

**Example workflow:**
```bash
# Create worktree for LLM experiment
git worktree add ../project-experiment experiment-oauth

# Work in worktree, commit frequently
cd ../project-experiment
# ... LLM generates code ...
git commit -m "feat: add OAuth callback handler"

# If successful, merge into main
git checkout main
git merge experiment-oauth

# If failed, discard worktree
git worktree remove ../project-experiment
```

This prevents contaminating the main branch with failed LLM output.

### 4.4. Rollback as First-Class Operation

When LLM output introduces bugs:

**Identify the bad commit** — Review recent history to find where issues appeared.

**Rollback to last known good state:**
```bash
# Soft reset (keeps changes as uncommitted)
git reset --soft HEAD~1

# Hard reset (discards changes entirely)
git reset --hard HEAD~1
```

**Selective revert:**
```bash
# Revert specific commit without losing subsequent work
git revert <commit-hash>
```

This is only safe because micro-commits isolate changes.

### 5. Tidy History for Comprehension

Granular commits create noisy history. Before merging to main, optionally squash related commits into logical units:

```bash
# Interactive rebase to squash last 5 commits
git rebase -i HEAD~5
```

This preserves detailed history during development while creating clean history for long-term maintenance.

**Trade-off:** Squashing removes granular rollback points. Only squash after validation passes [Quality Gates](/concepts/context-gates).

## Relationship to The PBI

[PBIs](/patterns/the-pbi) define **what to build**. Micro-Commits define **how to track progress**.

**Atomic PBIs** (small, bounded tasks) naturally produce micro-commits. Each PBI generates 1-5 commits depending on complexity.

**Example mapping:**
- **PBI:** "Implement retry logic with exponential backoff"
- **Commits:**
  1. `feat: add retry wrapper function`
  2. `feat: implement exponential backoff calculation`
  3. `test: add retry logic unit tests`
  4. `docs: update retry behavior in spec`

This makes PBI progress traceable and reversible.

## References

### Framework Patterns
- [The PBI](/patterns/the-pbi) — Atomic execution units that map to commit sequences
- [Context Gates](/concepts/context-gates) — Validation checkpoints that rely on granular commits
- [Agentic SDLC](/concepts/agentic-sdlc) — The cybernetic loop where micro-commits enable rapid iteration

### External Resources
- [My LLM Coding Workflow Going into 2026](https://addyo.substack.com/p/my-llm-coding-workflow-going-into) — Addy Osmani's practical guide emphasizing commits as "save points in a game"
