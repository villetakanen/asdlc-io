---
title: "Context Engineering"
description: "Context Engineering is the practice of structuring information to optimize LLM comprehension and output quality. In ASDLC, it is codified in the `AGENTS.md` files."
tags: ["AI", "LLM", "Prompt Engineering", "Context Engineering"]
relatedIds: ["concepts/model-context-protocol", "practices/agents-md-spec"]
lastUpdated: 2025-01-23
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

## Overview

Context Engineering is the systematic approach to designing and structuring the input context provided to Large Language Models (LLMs) to maximize their effectiveness, accuracy, and reliability in generating outputs.

While `[asdlc.io](asdlc.io)` focuses on software, Context Engineering is domain-agnostic.
* **In Design:** It is the design system tokens and Figma layer naming conventions explicitly fed to a UI agent.
* **In Law:** It is the "brief" that restricts a paralegal agent to specific case law precedents.
* **In SDLC:** It is the `AGENTS.md` file that steers the agent towards an implementation pattern.

Anywhere agents operate, context is the constraint that turns raw intelligence into specific value.

## The Requirements Gap

> "If you can't explain what you want to a human developer, you won't explain it well to an AI model either."

AI is changing how we code, but it hasn't changed the fundamental truth that bad requirements produce bad software. In fact, it has raised the bar for clarity.

*   **Human Developers** will ask clarifying questions when requirements are vague ("What happens if the payment fails?").
*   **AI Models** will simply *build something* based on probability. You will only discover it's wrong when it breaks in production.

Therefore, "Prompt Engineering" is often a misnomer. It is simply **Requirements Engineering** applied to a non-human entity that cannot intuit missing business logic.

## The Core Principles

In an agentic workflow, the "bot" is a commodity. The intelligence doesn't live in the model; it lives in the context we provide. Therefore, Context is a software asset. It must be treated with the same rigor as production code.

In `ASDLC`, context must be:
1. **Version Controlled:** It lives in the repo, is diffed in PRs, and is subject to peer review.
2. **Standardized:** It is written in a format readable by any agent (Cursor, Windsurf, Devin, GitHub Copilot).
3. **Iterative:** It is continuously refined based on agent failure modes, not static rules. As well as with tacit info discovered by [Human-in-the-loop (HITL)](https://en.wikipedia.org/wiki/Human-in-the-loop).

> ## Context > Guardrails: The Transitional Shift
>
> We must distinguish between `Guardrails` (Safety) and `Context` (Utility).
>
> Currently, many `AGENTS.md` files are cluttered with defensive instructions like "Do not delete files outside this directory" or "Do not output raw secrets."
>
> This is likely a transitional state. OpenAI, Anthropic, Google, and platform wrappers are racing to bake these safety constraints directly into the inference layer. Soon, telling an agent "Don't leak API keys" will be as redundant as telling a compiler "Optimise for speed." 
>

## Key Techniques

### Hierarchical Information Architecture

Organize context in order of importance:
- Critical instructions at the beginning
- Reference material in the middle
- Examples at the end

### Schema-First Approach

Define data structures before requesting content generation to ensure type safety and validation.

### Delimiter Usage

Use clear delimiters (e.g., XML tags, markdown sections) to separate different types of information.

## Applications

- **Code Generation**: Provide file structure, type definitions, and examples
- **Content Creation**: Supply style guides, templates, and domain knowledge
- **Data Analysis**: Include schema definitions, sample data, and output formats

## Best Practices

1. Front-load critical information
2. Use consistent formatting conventions
3. Provide clear success criteria
4. Include negative examples when relevant
5. Test with minimal viable context first

## Related Patterns

- Supervisor Agent Pattern
- Chain of Thought Reasoning
- Few-Shot Learning
