---
title: "Coverage Metric"
description: "Coverage measures task completion reliability: the proportion of required work units an agent successfully completes in a long-horizon task."
tags: ["Metrics", "Agent Evaluation", "Long-Horizon Tasks"]
relatedIds: ["concepts/context-engineering", "patterns/quality-gates"]
lastUpdated: 2026-01-10
status: "Draft"
references:
  - type: "paper"
    title: "InfiAgent: An Infinite-Horizon Framework for General-Purpose Autonomous Agents"
    url: "https://arxiv.org/abs/2601.03204"
    author: "Chenglin Yu, Yuchen Wang, Songmiao Wang, Hongxia Yang, Ming Li"
    published: 2026-01-06
    accessed: 2026-01-10
    annotation: "Introduces coverage as primary metric for long-horizon agent evaluation."
---

## Definition

**Coverage** measures task completion reliability: the proportion of required work units an agent successfully completes in a long-horizon task.

Unlike quality metrics (correctness, style, performance), coverage answers: "Did it finish the job?"

## Key Characteristics

### Formula

```
Coverage = (Completed Units / Total Required Units) × 100
```

Where "units" are task-appropriate:
- Literature review: papers processed
- Code migration: files converted
- Test generation: functions covered
- Data processing: records handled

### Why Coverage Matters

Quality metrics assume the agent attempted the work. But long-horizon agents often fail silently:
- Early termination without completing all items
- Skipping items without acknowledgment
- Producing empty or metadata-only outputs

Coverage catches these failures that quality metrics miss.

### Measurement

Report three values across multiple runs:
- **Max** — Best-case completion
- **Min** — Worst-case completion  
- **Avg** — Expected completion

High variance (large gap between max and min) indicates unreliable architecture, even if max is perfect.

## ASDLC Usage

Coverage is particularly relevant for:
- **Batch PBI execution** — Did the agent complete all subtasks?
- **Migration tasks** — Were all files processed?
- **Review Gates** — Did the Critic review all flagged items?

Consider adding coverage assertions to Quality Gates for batch operations.
