---
title: "Context Engineering"
description: "Context Engineering is the practice of structuring information to optimize LLM comprehension and output quality."
tags: ["AI", "LLM", "Prompt Engineering", "Context Engineering"]
relatedIds: ["concepts/model-context-protocol", "practices/agents-md-spec"]
lastUpdated: 2026-01-08
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
---

## Definition

Context Engineering is the systematic approach to designing and structuring the input context provided to Large Language Models (LLMs) to maximize their effectiveness, accuracy, and reliability in generating outputs.

While `[asdlc.io](asdlc.io)` focuses on software, Context Engineering is domain-agnostic.
* **In Design:** It is the design system tokens and Figma layer naming conventions explicitly fed to a UI agent.
* **In Law:** It is the "brief" that restricts a paralegal agent to specific case law precedents.
* **In SDLC:** It is the `AGENTS.md` file that steers the agent towards an implementation pattern.

Anywhere agents operate, context is the constraint that turns raw intelligence into specific value.

### The Requirements Gap

"Prompt Engineering" is often a misnomer. It is simply **Requirements Engineering** applied to a non-human entity that cannot intuit missing business logic.

*   **Human Developers** will ask clarifying questions when requirements are vague ("What happens if the payment fails?").
*   **AI Models** will simply *build something* based on probability. You will only discover it's wrong when it breaks in production.

## Key Characteristics

1.  **Version Controlled:** Usage of context as a software asset that lives in the repo, is diffed in PRs, and is subject to peer review.
2.  **Standardized:** Formatted to be readable by any agent (Cursor, Windsurf, Devin, GitHub Copilot).
3.  **Iterative:** Continuously refined based on agent failure modes and tacit info discovered by Human-in-the-loop (HITL) workflows.
4.  **Schema-First:** Defining data structures before requesting content generation to ensure type safety and validation.
5.  **Hierarchical:** Information is organized by importance—critical instructions first, references second, examples last.

> ## Context > Guardrails: The Transitional Shift
>
> We must distinguish between `Guardrails` (Safety) and `Context` (Utility).
>
> Currently, many `AGENTS.md` files are cluttered with defensive instructions like "Do not delete files outside this directory" or "Do not output raw secrets."
>
> This is likely a transitional state. OpenAI, Anthropic, Google, and platform wrappers are racing to bake these safety constraints directly into the inference layer. Soon, telling an agent "Don't leak API keys" will be as redundant as telling a compiler "Optimize for speed."

## ASDLC Usage

In ASDLC, we treat context as version-controlled code, not ephemeral prompts.

Applied in:
- [AGENTS.md Specification](/practices/agents-md-spec) — The practical application of context engineering in repositories.
- [Context Gates](/concepts/context-gates) — Checkpoints where context is validated or injected.
- [Model Context Protocol](/concepts/model-context-protocol) — The standard for serving context to agents.

## Applications

- **Code Generation**: Provide file structure, type definitions, and examples
- **Content Creation**: Supply style guides, templates, and domain knowledge
- **Data Analysis**: Include schema definitions, sample data, and output formats

## Best Practices

1. **Front-load critical information**: LLMs prioritize the beginning and end of the context window.
2. **Use consistent formatting**: Delimiters (XML tags, markdown sections) help models separate distinct information types.
3. **Provide clear success criteria**: Define what "good" looks like to reduce probabilistic guessing.
4. **Include negative examples**: Explicitly stating what *not* to do is often more effective than generic constraints.
5. **Test with minimal viable context**: Start small and add context only when the agent fails, to avoid "distractor" noise.
