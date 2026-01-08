---
title: "The 4D Framework (Anthropic)"
description: "A cognitive model codifying four essential competencies—Delegation, Description, Discernment, and Diligence—for effective generative AI use."
tags: ["AI Fluency", "Human-AI Collaboration", "Cognitive Model", "Prompt Engineering"]
relatedIds: ["concepts/context-engineering", "practices/agents-md-spec", "patterns/context-gates"]
status: "Live"
lastUpdated: 2026-02-01
references:
  - type: "website"
    title: "Anthropic AI Fluency Course"
    url: "https://anthropic.skilljar.com/page/ai-fluency"
    author: "Anthropic"
    accessed: 2026-01-08
    annotation: "Original source of the 4D Framework for effective generative AI use, teaching the core competencies needed for human-AI collaboration."
---

## Definition

The **4D Framework** is a cognitive model for human-AI collaboration developed by [Anthropic](https://www.anthropic.com/research) in partnership with Dr. Joseph Feller and Rick Dakan as part of the *AI Fluency* curriculum.

The framework codifies four essential competencies for leveraging generative AI effectively and responsibly:

1. **Delegation** — The Strategy
2. **Description** — The Prompt
3. **Discernment** — The Review
4. **Diligence** — The Liability

Unlike process models (e.g., Agile or Double Diamond) that dictate workflow timing, the 4D Framework specifies *how* to interact with AI systems. It positions the human not merely as a "prompter," but as an **Editor-in-Chief**, accountable for strategic direction and risk management.

## The Four Dimensions

### Delegation (The Strategy)

Before engaging with the tool, the human operator must determine what, if anything, should be assigned to the AI. This is a strategic decision between **Automation** (offloading repetitive tasks) and **Augmentation** (leveraging AI as a thought partner).

**Core Question:** "Is this task 'boilerplate' with well-defined rules (High Delegation), or does it demand nuanced judgment, deep context, or ethical considerations (Low Delegation)?"

### Description (The Prompt)

AI output quality is directly proportional to input quality. "Description" transcends prompt engineering hacks by emphasizing **Context Transfer**—delivering explicit goals, constraints, and data structures required for the task.

**Core Question:** "Have I specified the constraints, interface definitions, and success criteria needed for this task?"

### Discernment (The Review)

This marks the transition from **Creator** to **Editor**. The human must rigorously assess AI output for accuracy, hallucinations, bias, and overall quality. Failing to apply discernment is a leading cause of "AI Technical Debt."

**Core Question:** "If I authored this output, would it meet code review standards? Does it introduce fictitious libraries or violate design tokens?"

### Diligence (The Liability)

The human user retains full accountability for outcomes. Diligence acknowledges that while AI accelerates execution, it never removes user responsibility for security, copyright, or ethical compliance.

**Core Question:** "Am I exposing PII in the context window? Am I deploying unvetted code to production?"

## Key Characteristics

### The Editor-in-Chief Mental Model

The 4D Framework repositions the human from "prompt writer" to "editorial director." Just as a newspaper editor doesn't write every article but maintains accountability for what gets published, the AI-fluent professional maintains responsibility for all AI-generated outputs.

### Continuous Cycle

These four dimensions are not sequential steps but concurrent concerns. Every AI interaction requires simultaneous attention to all four:

- What should I delegate?
- How clearly have I described it?
- How critically am I reviewing the output?
- What risks am I accepting?

## Anti-Patterns

| Anti-Pattern | Description |
|--------------|-------------|
| **Over-Delegation** | Assigning strategic decisions or ethically sensitive tasks to AI |
| **Vague Description** | Using natural language prompts without context, constraints, or examples |
| **Blind Acceptance** | Copy-pasting AI output without verification |
| **Liability Denial** | Assuming AI-generated content is inherently trustworthy or legally defensible |

## ASDLC Usage

Applied in: [AGENTS.md Specification](/practices/agents-md-spec), [Context Engineering](/concepts/context-engineering), [Context Gates](/patterns/context-gates)

The 4D dimensions map to ASDLC constructs: Delegation → agent autonomy levels, Description → context engineering, Discernment → context gates, Diligence → guardrail protocols.
