---
title: "Workflow as Code"
description: "Define agentic workflows in deterministic code rather than prompts to ensure reliability, type safety, and testable orchestration."
tags: ["Orchestration", "Determinism", "TypeScript", "Automation"]
relatedIds: ["patterns/context-gates", "patterns/ralph-loop", "patterns/model-routing"]
status: "Experimental"
lastUpdated: 2026-01-18
references:
  - type: "website"
    title: "Dev Workflows as Code"
    url: "https://medium.com/nick-tune-tech-strategy-blog/dev-workflows-as-code-fab70d44b6ab"
    author: "Nick Tune"
    published: 2026-01-16
    accessed: 2026-01-18
    annotation: "Foundational article describing the shift from prompt-based to code-based orchestration."
---

## Definition

**Workflow as Code** is the practice of defining agentic workflows using deterministic programming languages (like TypeScript or Python) rather than natural language prompts.

It treats the **Agent** as a function call within a larger, strongly-typed system, rather than treating the **System** as a tool available to a chatty agent.

## When to Use

**Use this practice when:**
- Building repetitive production processes (CI/CD, release workflows)
- Implementing complex branching logic with multiple decision points
- Operating high-reliability pipelines where failure consequences are significant
- Orchestrating multi-step agent tasks that require verification checkpoints

**Skip this practice when:**
- Exploratory tasks with undefined outcomes
- Simple, linear command sequences
- Ad-hoc queries or one-off investigations
- Low-stakes prototyping where speed matters more than reliability

## Why It Matters

When complex workflows are driven entirely by an LLM loop ("Here is a goal, figure it out"), the system suffers from **Context Pollution**. As the agent accumulates history—observations, tool outputs, internal monologue—its attention degrades.

Nick Tune describes this as the agent becoming "tipsy wobbling from side-to-side": it loses focus on strict process adherence because its context window is overflowing with implementation details.

## Process

### Step 1: Identify Deterministic vs Probabilistic Tasks

Audit your workflow. Separate mechanical tasks (running builds, conditional logic, file operations) from intelligence tasks (code review, summarization, decision-making under ambiguity).

**Deterministic (Code):**
- Run build/test commands
- Parse structured output
- Branch on conditions
- Read/write files
- Make API calls

**Probabilistic (Agent):**
- Review code against spec
- Summarize findings
- Generate implementation
- Assess quality

### Step 2: Define Typed Step Abstraction

Create a common interface for workflow steps:

```typescript
export type WorkflowContext = {
  workDir: string;
  spec: string;
  history: StepResult[];
};

export type StepResult =
  | { type: 'success'; data: unknown }
  | { type: 'failure'; reason: string; recoverable: boolean };

export type Step = (ctx: WorkflowContext) => Promise<StepResult>;
```

This enables:
- **Composition**: Reassemble steps into new workflows
- **Type Safety**: Validate data passing between steps
- **Testability**: Unit test orchestration without invoking an LLM

### Step 3: Implement the Orchestration Shell

Write the control flow in code. The LLM only appears where intelligence is required:

```typescript
async function runDevWorkflow(ctx: WorkflowContext) {
  // Deterministic: Run build
  const buildResult = await runBuild(ctx);
  if (buildResult.type === 'failure') {
    return handleBuildError(buildResult);
  }

  // Probabilistic: Agent reviews the diff
  const reviewResult = await runAgentReview({
    diff: await git.getDiff(),
    spec: ctx.spec
  });

  // Deterministic: Act on structured result
  if (reviewResult.verdict === 'PASS') {
    await git.commit();
    await github.createPR();
  }
}
```

### Step 4: Implement Opaque Commands

From the agent's perspective, workflow steps should be "Black Boxes." The agent invokes a high-level command and acts on the structured result—it doesn't need to know implementation details.

**Define the interface:**
```typescript
type VerifyWorkResult = {
  status: 'passed' | 'failed';
  errors?: { file: string; line: number; message: string }[];
};

async function verifyWork(ctx: WorkflowContext): Promise<VerifyWorkResult> {
  // Implementation hidden from agent
  const lint = await runLint(ctx.workDir);
  const types = await runTypeCheck(ctx.workDir);
  const tests = await runTests(ctx.workDir);
  
  return aggregateResults([lint, types, tests]);
}
```

This reduces token usage and prevents the agent from hallucinating incorrect shell commands.

### Step 5: Add Enforcement Hooks

Agents will sometimes try to bypass the workflow. Implement hard boundaries using client-side hooks:

```bash
# .claude/hooks/pre-tool-use.sh
if [[ "$TOOL" == "Bash" && "$COMMAND" =~ "git push" ]]; then
  echo "Blocked: Use 'submit-pr' tool which runs verification first."
  exit 1
fi
```

This shifts enforcement from "Instructions in the System Prompt" (which can be ignored) to "Code in the Environment" (which cannot).

## Template

Minimal workflow orchestrator structure:

```typescript
// workflows/dev-workflow.ts
import type { Step, WorkflowContext, StepResult } from './types';

const steps: Step[] = [
  runBuild,
  runLint,
  runAgentReview,  // Only probabilistic step
  commitChanges,
  createPR,
];

export async function execute(ctx: WorkflowContext): Promise<StepResult> {
  for (const step of steps) {
    const result = await step(ctx);
    if (result.type === 'failure' && !result.recoverable) {
      return result;
    }
    ctx.history.push(result);
  }
  return { type: 'success', data: ctx.history };
}
```

## Common Mistakes

### The God Prompt

**Problem:** Entire workflow described in a single system prompt, expecting the agent to "figure it out."

**Solution:** Extract deterministic logic into code. The agent should only handle tasks requiring intelligence.

### Leaky Abstractions

**Problem:** Agent sees raw command output (500 lines of test failures) instead of structured results.

**Solution:** Parse outputs into typed results before passing to the agent. Summarize, don't dump.

### Missing Enforcement

**Problem:** Workflow relies on the agent "following instructions" without hard boundaries.

**Solution:** Implement hooks that block unauthorized actions. Trust code, not compliance.

### Over-Agentification

**Problem:** Using an LLM to run `npm install` or parse JSON—tasks with zero ambiguity.

**Solution:** Reserve agent calls for genuinely probabilistic tasks. Everything else is code.

## Related Patterns

- **[Ralph Loop](/patterns/ralph-loop)** — Implements the "Loop" part of the workflow using code-based persistence
- **[Context Gates](/patterns/context-gates)** — Architectural checkpoints that Workflow as Code enforces programmatically
- **[Model Routing](/patterns/model-routing)** — Assigning different models to different steps within the code-based workflow
