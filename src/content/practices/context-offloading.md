---
title: "Context Offloading"
description: "The practice of moving agent trajectories, tool results, and historical state from the context window to the filesystem to prevent cognitive overload and context rot."
tags: ["Context Engineering", "Performance", "State Management"]
relatedIds: ["concepts/context-engineering", "patterns/context-gates", "patterns/ralph-loop"]
lastUpdated: 2026-02-21
status: "Experimental"
---

## Definition

**Context Offloading** is the operational process of moving agent trajectories, intermediate tool results, and session history from the active LLM context window to persistent storage (usually the filesystem).

Instead of relying on an ever-growing linear chat history that inevitably degrades model reasoning (Context Rot), this practice treats the active context as a limited working memory, using the filesystem as long-term storage that the agent can retrieve from only when necessary.

## When to Use

**Use this practice when:**
- Building long-running autonomous agents (e.g., [Ralph Loop](/patterns/ralph-loop))
- Executing tasks that generate massive intermediate tool outputs (e.g., search results, test logs, compiler errors)
- Transitioning between distinct phases of a complex workflow (e.g., Planning $\rightarrow$ Execution)

**Skip this practice when:**
- Performing simple, single-shot queries
- Working within a deeply specialized sub-agent that requires the full uninterrupted trajectory for its specific micro-task

## Process

### Step 1: Establish the State Directory

Create a dedicated location for offloaded context, isolated from the project source code.

```bash
mkdir -p .agents/state/trajectories
```

### Step 2: Implement Truncation Thresholds

Configure the agent harness to monitor token usage. When the context window approaches a safety threshold (e.g., 80% capacity), trigger a truncation event.

### Step 3: Offload and Summarize

When a truncation event is triggered:
1. **Write** the raw intermediate results (e.g., full compiler `<stdout>`) to a file in the state directory.
2. **Replace** the massive raw result in the active context window with a pointer and a highly compressed summary.

*Example Context Replacement:*
```markdown
[Tool Execution: `pnpm check`]
*Result offloaded to: `.agents/state/logs/typecheck-142.log`*
Summary: 14 type errors found. Primary cluster in `src/components/Form.tsx` related to missing `Zod` inference. 
```

### Step 4: Provide Retrieval Tools

The agent must be able to read the offloaded context back into working memory if needed. Provide explicit filesystem access tools (e.g., `view_file`) or implement progressive disclosure mechanics that allow the agent to fetch the raw logs only when actively debugging them. 

## Common Mistakes

### Over-Summarization (Lossy Compression)

**Problem:** Summarizing the offloaded context too aggressively, losing critical edge cases that the agent needs later.

**Solution:** Always preserve the *raw* data in the file system before summarizing. The summary is an index; the file is the source of truth.

### Offloading to Conversation History

**Problem:** Attempting to offload by passing the context to a "memory API" or relying entirely on an extended context window (e.g., 2M tokens) without structural filtering.

**Solution:** The filesystem is the only deterministically queryable, grep-able, and auditable storage layer for code agents. Long context windows do not negate the need for structured state; they merely delay the onset of context rot. Build file-centric state management mechanisms instead of assuming the model will remember everything accurately.

## Related Patterns

This practice implements:

- **[Context Gates](/patterns/context-gates)** — Context Offloading is the operational mechanism behind Input Summary Gates.

See also:

- **[Context Engineering](/concepts/context-engineering)** — The underlying conceptual discipline that mandates deterministic context boundaries.
