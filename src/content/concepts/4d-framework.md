---
title: "The 4D Framework (Anthropic)"
description: "A cognitive model codifying four essential competencies—Delegation, Description, Discernment, and Diligence—for effective and responsible generative AI use."
tags: ["AI Fluency", "Human-AI Collaboration", "Cognitive Model", "Prompt Engineering"]
relatedIds: ["concepts/context-engineering", "concepts/guardrails", "concepts/spec-driven-development"]
lastUpdated: 2025-12-15
---

## Overview

The **4D Framework** is a cognitive model for human-AI collaboration that codifies four essential competencies critical for leveraging generative AI effectively and responsibly:

1. **Delegation** (The Strategy)
2. **Description** (The Prompt)
3. **Discernment** (The Review)
4. **Diligence** (The Liability)

Unlike process models (e.g., Agile or Double Diamond) that dictate workflow timing, the 4D Framework specifies *how* to interact with AI systems. It positions the human not merely as a "prompter," but as an **Editor-in-Chief**, accountable for strategic direction and risk management.

## Origin

Developed by [Anthropic](https://www.anthropic.com/research) in partnership with Dr. Joseph Feller and Rick Dakan as part of the *AI Fluency* curriculum.

## The Four Dimensions

To achieve "AI Fluency" with the 4D Framework, professionals must actively manage these four competencies throughout every interaction cycle:

### Delegation (The Strategy)

Before engaging with the tool, the human operator must determine what, if anything, should be assigned to the AI. This is a strategic decision between **Automation** (offloading repetitive tasks) and **Augmentation** (leveraging AI as a thought partner).

**Core Question:** "Is this task 'boilerplate' with well-defined rules (High Delegation), or does it demand nuanced judgment, deep context, or ethical considerations (Low Delegation)?"

**Application Example:**

A Senior Developer delegates the writing of unit tests (high delegation) but refuses to delegate the design of the authentication architecture (low delegation).

### Description (The Prompt)

AI output quality is directly proportional to input quality. "Description" transcends prompt engineering hacks by emphasizing **Context Transfer**—delivering explicit goals, constraints, and data structures required for the task.

**Core Question:** "Have I specified the constraints, interface definitions, and success criteria needed for this task?"

**Application Example:**

A Product Owner does not ask for "a user story about login." They paste the user persona, the acceptance criteria format, and the business rules for password complexity before asking for the draft.

### Discernment (The Review)

This marks the transition from **Creator** to **Editor**. The human must rigorously assess AI output for accuracy, hallucinations, bias, and overall quality. Failing to apply discernment is a leading cause of "AI Technical Debt."

**Core Question:** "If I authored this output, would it meet code review standards? Does it introduce fictitious libraries or violate design tokens?"

**Application Example:**

A designer requests UI variations. The AI suggests a layout that looks good but breaks accessibility (WCAG) standards. The Designer uses *discernment* to reject the layout, regardless of its aesthetic appeal.

### Diligence (The Liability)

The human user retains full accountability for outcomes. Diligence acknowledges that while AI accelerates execution, it never removes user responsibility for security, copyright, or ethical compliance.

**Core Question:** "Am I exposing PII (Personally Identifiable Information) in the context window? Am I deploying unvetted code to production?"

**Application Example:**

A DevOps engineer generates an Infrastructure-as-Code script. Diligence is the act of auditing the script for hard-coded secrets or insecure permissions before committing it to the repo.

## Relationship to ASDLC

The 4D Framework aligns naturally with ASDLC practices:

- **Delegation** maps to determining levels of agent autonomy
- **Description** is realized through Context Engineering and `AGENTS.md` files
- **Discernment** is enforced via Context Gates and human review checkpoints
- **Diligence** is codified in Guardrails and compliance protocols

## Key Insights

### The Editor-in-Chief Mental Model

The 4D Framework repositions the human from "prompt writer" to "editorial director." Just as a newspaper editor doesn't write every article but maintains accountability for what gets published, the AI-fluent professional maintains responsibility for all AI-generated outputs.

### Continuous Cycle

These four dimensions are not sequential steps but concurrent concerns. Every AI interaction requires simultaneous attention to all four:

- What should I delegate?
- How clearly have I described it?
- How critically am I reviewing the output?
- What risks am I accepting?

## Best Practices

1. **Start with Delegation Assessment**: Before writing a prompt, explicitly decide *why* this task warrants AI involvement
2. **Document Your Description**: Treat prompts as version-controlled assets, especially for repeated tasks
3. **Create Discernment Checklists**: Develop domain-specific review criteria (e.g., "Does this code pass our linter?")
4. **Establish Diligence Protocols**: Define what types of outputs require additional human verification before deployment

## Anti-Patterns

- **Over-Delegation**: Assigning strategic decisions or ethically sensitive tasks to AI
- **Vague Description**: Using natural language prompts without context, constraints, or examples
- **Blind Acceptance**: Copy-pasting AI output without verification
- **Liability Denial**: Assuming AI-generated content is inherently trustworthy or legally defensible

## References

- [Anthropic AI Fluency Course](https://anthropic.skilljar.com/page/ai-fluency)
- [DesignSystems.Surf AI Starter Stack](https://designsystems.surf)
