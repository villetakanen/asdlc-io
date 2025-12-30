---
title: "Agentic Double Diamond"
description: "Transforming the classic design thinking framework into a computational pipeline."
tags: ["Design", "Methodology", "Requirements", "Agents"]
lastUpdated: 2025-12-13
status: "Draft"
---

# Agentic Double Diamond

## Summary

The **Agentic Double Diamond** transforms the classic design thinking framework from a workshop-based activity into a **computational pipeline**. Instead of producing static artifacts (PDFs, slide decks, sticky notes) for human interpretation, this pattern uses agents to ingest raw data and output structured, machine-readable "Context Feeds" (Vectors, JSON, Gherkin) that drive downstream Coder and QA agents.

## The Context

In a traditional SDLC, the "Double Diamond" (Discover, Define, Develop, Deliver) is often a bottleneck of unstructured data.

1. **Lossy Handoffs:** Insights from the _Discover_ phase are summarized into powerpoints, losing the raw fidelity needed for edge-case testing.
    
2. **Static Deliverables:** _Deliver_ produces Figma files or flat specs. An AI Coding Agent cannot "look" at a Figma file and understand the _intent_ behind a hover state or a complex validation rule without explicit text description.
    
3. **The "Gap of Silence":** Once design is handed off, the "User Voice" is silent until UAT.
    

In the [Agentic SDLC](/concepts/agentic-sdlc), we treat Design not as drawing screens, but as [Context Engineering](/concepts/context-engineering). The goal is to build the "Truth" that the build agents will execute.

## The Pattern

The Cybernetic Double Diamond reimagines the two diamonds as **Context Furnaces**:

- **Diamond 1 (Problem Space):** Ingests raw chaos $\rightarrow$ Refines it into **Computational Truth** (Models, Personas, Vectors).
    
- **Diamond 2 (Solution Space):** Ingests Truth $\rightarrow$ Generates **Executable Specifications** (Prototypes, Tokens, Criteria).
    

### Phase 1: Discover (The Sensor Network)

_Traditional:_ User interviews, market research, sticky notes on a wall. _Agentic:_ Massive automated ingestion and pattern matching.

**The Workflow:** Instead of a manual research sprint, we deploy a **Sensor Network** of Harvester Agents.

- **Harvester Agents** scrape target data sources (App Store reviews, competitor documentation, internal support tickets, Reddit threads) 24/7.
    
- **Pattern Seer Agents** cluster thousands of unstructured inputs into "Insight Nodes" using semantic analysis.
    

**Output Artifact:** `research_vectors.json`

> A vector store containing weighted pain points, frequency analysis, and raw user quotes linked by semantic relevance.

### Phase 2: Define (The Simulator)

_Traditional:_ Static Personas (PDFs), Journey Maps. _Agentic:_ Active User Simulators and Living Requirements.

**The Workflow:** We use the data from Phase 1 to fine-tune **Synthetic User Agents** (see [Agent Personas](/practices/agent-personas)).

- **The Persona Bot:** You do not read a persona; you _interrogate_ it. This is an LLM agent with a specific system prompt derived from the research vectors.
    
    - _Prompt:_ "You are Sarah, a busy CFO. Based on the ingested logs, how would you react to a 3-step 2FA process?"
        
- **The Spec Crystallizer:** An agent that converts abstract user needs into formal logic constraints.
    

**Output Artifact:** `persona_definition.yaml` & `problem_graph.json`

> A serialized definition of the user that QA agents can later use to "test" the software, and a knowledge graph linking business goals to user pain points.

### Phase 3: Develop (The Generative Studio)

_Traditional:_ Manual Wireframing, Prototyping. _Agentic:_ Multi-modal generation and adversarial simulation.

**The Workflow:**

- **UI Architect Agents:** Generate component variants based on the organization's Design System (tokens) and the _Problem Graph_.
    
- **The Critic (Hostile Agent):** An agent that adopts the _Synthetic User_ persona and tries to "reject" the proposed UI flows before a human ever sees them. It validates the design against the `research_vectors.json`.
    

**Output Artifact:** `design_tokens.json` & `behavioral_prototype.js`

> Design-as-Code. Figma designs are instantly converted to JSON tokens and React component scaffolds.

### Phase 4: Deliver (The Context Feed)

_Traditional:_ Handoff meetings, Jira tickets. _Agentic:_ Compilation of the "Blueprints" for the Agentic SDLC.

**The Workflow:** This phase is purely about **Packaging**. The goal is to create a "Feature Manifest" that the Coder Agents can consume without hallucination.

- **The Translator:** Reads the visual design and behavioral prototypes to write **Gherkin Syntax (Given/When/Then)**.
    
- **The PBI Slicer:** Breaks down the "Big Feature" into atomic, dependency-mapped Product Backlog Items (PBIs).
    

**Output Artifact:** `feature_manifest.zip`

> A package containing the "Truth" for the build agents:
> 
> 1. `requirements.md` (The narrative)
>     
> 2. `acceptance_criteria.feature` (The test logic)
>     
> 3. `mockup_context.json` (The visual specs)
>     

## Artifact Example: The Feature Manifest

When the "Deliver" phase is complete, the Design Agent commits a manifest to the repository. This triggers the **Coder Agent**.

**`manifests/feature-one-click-checkout/requirements.md`**

```markdown
# Feature: One-Click Checkout
## Insight Source
- Linked to Insight ID: #INS-882 (Users abandon cart due to form fatigue)
- Priority Score: 9.2 (Calculated by Impact/Effort Agent)

## Synthetic User Validation
- Persona "Sarah" Acceptance Rate: 95%
- Persona "Mike" Acceptance Rate: 88% (Concern: "Where is the receipt?")
```

**`manifests/feature-one-click-checkout/acceptance_criteria.feature`**

```feature
Feature: One Click Checkout
  Scenario: User has stored payment
    GIVEN user_id IS "valid"
    AND payment_method IS "stored"
    WHEN button "Buy Now" is_clicked
    THEN system MUST process_transaction WITHIN 2000ms
    AND system MUST NOT show "Confirmation Modal"
```

## Benefits

1. **Zero Translation Loss:** The "Spec" is code before the code is written.
    
2. **Adversarial Resilience:** Designs are "tested" by Synthetic Users before development begins.
    
3. **Living Context:** The logic is traceable back to the raw research vector (e.g., "Why is this button red?" -> "Because 400 support tickets complained about visibility").
