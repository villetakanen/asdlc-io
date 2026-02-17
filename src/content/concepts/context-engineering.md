---
title: "Context Engineering"
description: "Context Engineering is the practice of structuring information to optimize LLM comprehension and output quality."
tags: ["AI", "LLM", "Prompt Engineering", "Context Engineering"]
relatedIds: ["concepts/model-context-protocol", "practices/agents-md-spec", "patterns/context-gates", "concepts/4d-framework", "concepts/ooda-loop", "patterns/the-spec", "patterns/agent-optimization-loop", "patterns/context-map"]
lastUpdated: 2026-01-12
status: "Live"
references:
  - type: "website"
    title: "OpenAI Best Practices for Prompt Engineering"
    url: "https://platform.openai.com/docs/guides/prompt-engineering"
    author: "OpenAI"
    published: 2024-01-15
    accessed: 2026-01-08
    annotation: "Foundational guidance on structuring prompts and context for optimal LLM performance."
  - type: "website"
    title: "Constitutional AI Documentation"
    url: "https://www.anthropic.com/index/constitutional-ai-harmlessness-from-ai-feedback"
    author: "Anthropic"
    accessed: 2026-01-08
    annotation: "Documentation on Anthropic's approach to AI alignment and context-based safety constraints."
  - type: "paper"
    title: "How AI is Transforming Work at Anthropic"
    url: "https://www.anthropic.com/research/how-ai-is-transforming-work-at-anthropic"
    author: "Saffron Huang et al."
    published: 2025-12-02
    accessed: 2026-01-09
    annotation: "Research identifying the cold start problem as the primary blocker in AI-assisted development."
  - type: "paper"
    title: "InfiAgent: An Infinite-Horizon Framework for General-Purpose Autonomous Agents"
    url: "https://arxiv.org/abs/2601.03204"
    author: "Chenglin Yu, Yuchen Wang, Songmiao Wang, Hongxia Yang, Ming Li"
    published: 2026-01-06
    accessed: 2026-01-10
    annotation: "Empirical validation of file-centric state management for long-horizon agent stability."
  - type: "website"
    title: "Agile in the AI Era: Why 'Boring' Architecture Is Your Secret Weapon"
    url: "https://www.linkedin.com/pulse/agile-ai-era-why-boring-architecture-your-secret-weapon-lefever-ravne/"
    author: "Raf Lefever"
    published: 2026-02-10
    accessed: 2026-02-12
    annotation: "Argues that domain-driven structure ('Screaming Architecture') is critical context for AI agents."
  - type: "website"
    title: "AGENTS.md outperforms skills in our agent evals"
    url: "https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals"
    accessed: 2026-02-16
    author: "Vercel"
    annotation: "Validation of passive context mapping over active tool retrieval for static knowledge."
---

## Definition

Context Engineering is the systematic approach to designing and structuring the input context provided to Large Language Models (LLMs) to maximize their effectiveness, accuracy, and reliability in generating outputs.

The practice emerged from the recognition that LLMs operate on explicit information only—they cannot intuit missing business logic or infer unstated constraints. Context Engineering addresses this by making tacit knowledge explicit, machine-readable, and version-controlled.

**The Requirements Gap**

"Prompt Engineering" is often a misnomer. It is simply **Requirements Engineering** adapted for a probabilistic system. Unlike a human developer who asks clarifying questions when requirements are vague ("What happens if the payment fails?"), an LLM generates the statistically most likely continuation based on its training data. It does not "understand" the business domain; it predicts patterns. When explicit logic is missing, the model defaults to the average case found in its training set, leading to code that is syntactically correct but semantically misaligned with specific project needs.

**The Cold Start Problem**

Martin Fowler observes: "As I listen to people who are serious with AI-assisted programming, the crucial thing I hear is managing context."

Anthropic's research confirms this. Engineers cite the **cold start problem** as the biggest blocker:

> "There is a lot of intrinsic information that I just have about how my team's code base works that Claude will not have by default… I could spend time trying to iterate on the perfect prompt [but] I'm just going to go and do it myself."

Context Engineering solves cold start by capturing this intrinsic information in files the agent can read.

## Key Characteristics

1.  **Version Controlled:** Context exists as a software asset that lives in the repo, is diffed in PRs, and is subject to peer review.
2.  **Standardized:** Formatted to be readable by any agent (Cursor, Windsurf, Devin, GitHub Copilot).
3.  **Iterative:** Continuously refined based on agent failure modes and tacit information discovered by Human-in-the-loop (HITL) workflows.
4.  **Schema-First:** Data structures defined before requesting content generation to ensure type safety and validation.
5.  **Hierarchical:** Information organized by importance—critical instructions first, references second, examples last.

## Applications

While ASDLC focuses on software development, Context Engineering is domain-agnostic:
* **In Design:** Design system tokens and Figma layer naming conventions fed to UI agents
* **In Law:** Briefs restricting paralegal agents to specific case law precedents  
* **In SDLC:** The `AGENTS.md` file steering agents toward implementation patterns

### Screaming Architecture

Context Engineering extends to the filesystem itself. As [Raf Lefever](/concepts/context-engineering#references) notes, "If your code-base doesn't scream its domain, AI will whisper nonsense."

A well-structured filesystem (e.g., `src/features/checkout/core-logic`) provides implicit context to the LLM about intent and boundaries. A generic filesystem (`src/utils`, `src/managers`) forces the LLM to guess. In ASDLC, we optimize directory structures to be "training wheels" for the agent.

## Distinctions

### Context vs Guardrails

A distinction exists between [Guardrails](/concepts/guardrails) (Safety) and Context (Utility). Currently, many `AGENTS.md` files contain defensive instructions like "Do not delete files outside this directory" or "Do not output raw secrets." This is likely a transitional state. OpenAI, Anthropic, Google, and platform wrappers are racing to bake these safety constraints directly into the inference layer. Soon, telling an agent "Don't leak API keys" will be as redundant as telling a compiler "Optimize for speed."

## ASDLC Usage

In ASDLC, context is treated as version-controlled code, not ephemeral prompts.

**Applied in:**
- [AGENTS.md Specification](/practices/agents-md-spec) — The practical application of context engineering in repositories.
- [Model Context Protocol](/concepts/model-context-protocol) — The standard for serving context to agents.

**Related Patterns:**
- [Specs](/patterns/the-spec) — Specs are context engineering in document form.
- [Context Gates](/patterns/context-gates) — Checkpoints where context is validated.
- [Context Map](/patterns/context-map) — The structural pattern for organizing context.
- [Agent Optimization Loop](/patterns/agent-optimization-loop) — Verifying context quality.

> [!NOTE]
> **Research Validation (InfiAgent, 2026):** File-centric state management outperforms compressed long-context prompts. Replacing persistent file state with accumulated conversation history dropped task completion from 80/80 to 27.7/80 average, even with Claude 4.5 Sonnet. This validates treating context as a reconstructed view of authoritative file state, not as conversation memory.
