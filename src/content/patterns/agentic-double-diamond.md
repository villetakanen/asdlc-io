---
title: "Agentic Double Diamond"
description: "A computational framework transforming the classic design thinking model into an executable pipeline of context verification and assembly."
tags: ["Design", "Methodology", "Requirements", "Agents", "Architecture"]
relatedIds: ["patterns/experience-modeling", "patterns/the-spec", "practices/adversarial-requirement-review", "practices/adversarial-code-review"]
references:
  - { title: "The Double Diamond", author: "Design Council", url: "https://www.designcouncil.org.uk/our-work/skills-learning/tools-frameworks/framework-for-innovation-design-council-s-evolved-double-diamond/", type: "website", annotation: "Origin of the Diverge-Converge model.", accessed: 2026-02-12 }
  - { title: "Software Craftsmanship in the AI Era", author: "Codurance", url: "https://www.codurance.com/", type: "website", annotation: "Source of the 'Spec is Code' philosophy.", accessed: 2026-02-12 }
  - { title: "Before I Ask AI to Build, I Ask It to Challenge", author: "Daniel Donbavand", url: "https://danieldonbavand.com/2026/02/12/before-i-ask-ai-to-build-i-ask-it-to-challenge/", type: "website", annotation: "Source of the Adversarial Requirement Review pattern.", accessed: 2026-02-12 }
lastUpdated: 2026-02-12
status: "Experimental"
---



## Definition

The **Agentic Double Diamond** is a computational framework that transforms the traditional design thinking model (Discover, Define, Develop, Deliver) into an executable pipeline where every phase produces machine-readable context rather than static artifacts.

![Agentic Double Diamond Diagram](/images/agentic-double-diamond.svg)

In this model, the **Spec** becomes the primary source code, and "Coding" becomes an automated assembly step. The human role shifts from *Implementation* to *Context Engineering* and *Verification*.

## The Problem: Lossy Handoffs

Traditional software development suffers from signal degradation at every handoff:

1.  **The "Gap of Silence"**: Insights from the *Discover* phase are summarized into PowerPoints or tickets, stripping away the raw evidence needed for edge-case validation.
2.  **Static Deliverables**: The *Define* phase produces Figma files or flat requirements. To an AI, these are unstructured blobs. Use of "Vibe Coding" creates functionality that feels right but fails under rigorous scrutiny.
3.  **Verification Lag**: We typically only verify if we built the *thing right* (Testing) after weeks of coding. We rarely verify if we are building the *right thing* (Strategy) until it's too late.

The result is a "Build Trap" where we efficiently ship features that solve the wrong problems.

## The Solution: A Computational Pipeline

The Agentic Double Diamond reimagines the two diamonds not as workshop phases, but as **Context Furnaces**. Each furnace ingests raw, unstructured input and refines it into a stricter, more deterministic state.

*   **Diamond 1 (Problem Space):** Ingests Chaos $\rightarrow$ Refines to **Insight**.
*   **Diamond 2 (Solution Space):** Ingests Insight $\rightarrow$ Refines to **Implementation**.

Crucially, we introduce **Adversarial Gates** at the convergence points of each diamond to stop "Solution Pollution"—the tendency to rush into building without a valid problem definition.

## Anatomy

The pattern consists of four computational phases and one operational phase (Run).

### Phase 1: DISCOVER (The Sensor Network)
*From Chaos to Signal.*

Instead of manual research sprints, we use agents to ingest broad signals (user feedback, logs, market data) and cluster them into patterns.

**Context Output:** `Problem Graph` (A structured map of user needs and pain points).

*   **Practices:**
    *   **[Experience Modeling](/patterns/experience-modeling)**: Defining the domain language and user journey.
    *   **[Context Engineering](/concepts/context-engineering)**: Structuring the raw input for analysis.

### Phase 2: DEFINE (The Strategy Engine)
*From Signal to Insight.*

We crystallize the signals into a coherent strategy. This is where **Product Thinking** applies constraint satisfaction to select the *right* problem to solve.

**Human Role:** **Thought Leader** (Deciding what matters).
**Agent Role:** **Thought Partner** (Challenging assumptions).

**Context Output:** `Strategy Document` & `Validated Problem Statement`.

*   **Gate 1 (The Checkpoint):** **[Adversarial Requirement Review](/practices/adversarial-requirement-review)**.
    *   Before writing a single line of a Spec, an Adversarial Agent challenges the strategy constraints. If it fails, we loop back to Discover.

### Phase 3: SPEC (The New Coding)
*From Insight to Blueprint.*

This is the most significant shift. In the Agentic SDLC, **Spec Writing IS Coding**. The Spec is the permanent, living source of truth. It defines the "What" (Behavior) and the "How" (Architecture) in a format rigorous enough for agents to execute.

**Context Output:** **[The Spec](/patterns/the-spec)** (Context, Blueprint, Contract).

*   **Practices:**
    *   **[Spec-Driven Development](/concepts/spec-driven-development)**: The methodology of writing specs first.
    *   **[Living Specs](/practices/living-specs)**: Treating documentation as code.

### Phase 4: ASSEMBLE (The Agentic Manufactory)
*From Blueprint to Assembly.*

Agents ingest the Spec and "assemble" the implementation. This phase is highly automated. The agents generate code, tests, and documentation that adhere strictly to the Spec.

**Human Role:** Verifier (Reviewing the assembly against the Spec).
**Agent Role:** Builder (Implementation).

**Context Output:** `Source Code`, `Tests`, `Micro-Commits`.

*   **Gate 2 (The Checkpoint):** **[Adversarial Code Review](/practices/adversarial-code-review)**.
    *   An independent Critic Agent verifies the assembled code against the Spec's Contracts. It catches edge cases and architectural violations that unit tests might miss.
    *   See also: **[Micro-Commits](/practices/micro-commits)** and **[Feature Assembly](/practices/feature-assembly)**.

### Phase 5: RUN (The Feedback Loop)
*From Assembly to Signal.*

The software operates in production, generating new signals (usage data, errors, feedback) that feed back into Phase 1, closing the loop.

*   **Practices:**
    *   **[Feedback Loop Compression](/concepts/feedback-loop-compression)**: Minimizing the time between "Run" and "Discover".
    *   **[Production Readiness Gap](/concepts/production-readiness-gap)**: Managing the transition from prototype to production.

## Relationship to Other Patterns

*   **[Product Thinking](/concepts/product-thinking)**: The mindset that drives the *Discover/Define* phases.
*   **[The Spec](/patterns/the-spec)**: The central artifact connecting *Define* to *Assemble*.
*   **[Agent Constitution](/patterns/agent-constitution)**: The set of laws that govern agent behavior throughout the pipeline.
*   **[Context Gates](/concepts/context-gates)**: The architectural pattern implemented by the Adversarial Reviews.

## Anti-Patterns

### The Vibe Coding Shortcut
**Problem:** Skipping the *Define* and *Spec* phases to jump straight to *Assemble* (Vibe Coding).
**Consequence:** Fast "sugar-high" shipping of features that crumble under production complexity because they lack structural integrity.

### The Static Spec
**Problem:** Treating Phase 3 as a "PDF generation" step.
**Consequence:** The Spec drifts from reality immediately. In this pattern, the Spec must be a **Living Spec** in the repo, or the automated assembly fails.


