---
title: "Model Routing"
description: "Strategic assignment of LLM models to SDLC phases based on reasoning capability versus execution speed."
tags: ["LLM Selection", "Context Engineering", "ASDLC", "Agent Architecture", "Economics"]
relatedIds: ["concepts/agentic-sdlc", "patterns/context-gates", "practices/agent-personas", "patterns/the-spec", "concepts/context-engineering", "practices/workflow-as-code"]
status: "Live"
lastUpdated: 2026-01-31
references:
  - type: "paper"
    title: "RouteLLM: Learning to Route LLMs with Preference Data"
    url: "https://arxiv.org/abs/2406.18665"
    publisher: "LMSYS"
    annotation: "Foundational research on using matrix factorization for routing, demonstrating Pareoto-optimal trade-offs."
  - type: "paper"
    title: "FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance"
    url: "https://arxiv.org/abs/2305.05176"
    publisher: "Stanford University"
    annotation: "Introduces the cascading routing architecture to minimize cost."
  - type: "website"
    title: "My LLM Coding Workflow Going into 2026"
    url: "https://addyo.substack.com/p/my-llm-coding-workflow-going-into"
    author: "Addy Osmani"
    published: 2026-01-01
    accessed: 2026-01-08
    annotation: "Addy Osmani's workflow guide emphasizing pragmatic model selection and mid-task model switching patterns based on reasoning needs."
  - type: "website"
    title: "The Mythical LLM: Why Rumors of the Death of Software are Premature"
    author: "Dan Cripe"
    published: 2026-01-20
    url: "https://www.dancripe.com/ai-coding-enterprise-saas-reality-check/"
    accessed: 2026-01-24
    annotation: "Documents latency, cost, and reliability constraints from enterprise practice."
---

## Definition

**Model Routing** is the strategic assignment of different Large Language Models (LLMs) to different phases or tasks based on their capability profile.

In a monolithic architecture, a user asking for a simple boolean definition incurs the same high cost and latency as a user requesting a complex strategic analysis. Model routing rationalizes this by shifting model selection from a design-time decision to a runtime optimization problem.

## The Iron Triangle

Effective routing systems operate by manipulating the trade-offs between three competing constraints:

1.  **Quality**: Semantic accuracy, reasoning depth, instruction following.
2.  **Cost**: Operational expenditure (OpEx) per token.
3.  **Latency**: Time-To-First-Token (TTFT) and total generation time.

By dynamically swapping models, routers decouple these variables. A system can achieve "frontier-class" average quality at "efficient-class" average cost by routing only the most difficult 10-20% of queries to the expensive model.

## Taxonomy of Routing Architectures

We identify five primary patterns for implementing model routing:

### 1. Semantic Routing (Embedding-Based)
Uses vector similarity to map broad intents to specific routes.
*   **Mechanism**: Encoder $\rightarrow$ Vector Search $\rightarrow$ Threshold Check.
*   **Use Case**: RAG topic selection, intent classification.

### 2. Predictive Routing (Classifier-Based)
Uses a trained classifier (Bert, XGBoost, or Matrix Factorization like RouteLLM) to predict the probability that a weak model can successfully answer the query.
*   **Mechanism**: `P(Success|WeakModel) > Threshold ? Weak : Strong`.
*   **Use Case**: General purpose query optimization.

### 3. Cascading Routing (Waterfall)
A "fail-up" pattern that prioritizes cost.
*   **Mechanism**: Try Weak Model $\rightarrow$ Validation Gate (Low Confidence?) $\rightarrow$ Strong Model.
*   **Use Case**: Code generation where syntax errors can trigger escalation.

### 4. Probabilistic Routing (Contextual Bandits)
Uses Reinforcement Learning to adapt routing weights based on user feedback or judge evaluation.
*   **Use Case**: High-scale production systems with drifting query distributions.

### 5. Agentic Routing (Tool Use)
Structural routing where a dispatcher agent utilizes tools to delegate work.
*   **Mechanism**: LLM outputs structured JSON choice (e.g., `{"tool": "sql_agent"}`).
*   **Use Case**: Complex multi-step workflows.

## Anatomy

A complete routing system consists of three components:

### 1. The Model Registry
A configuration defining the available models and their capabilities.
*   **Strong/Frontier**: High reasoning, expensive (e.g., Claude 3.5 Sonnet, GPT-4o, DeepSeek V3).
*   **Weak/Efficient**: High speed, cheap (e.g., Haiku, Llama-3-8B, GPT-4o-mini).
*   **Specialist**: Domain-optimized (e.g., StarCoder for SQL, Med-PaLM).

### 2. The Router (Gateway vs. Application)
*   **Gateway Layer**: Centralized proxy (e.g., LiteLLM, Cloudflare AI Gateway). Handles auth, rate limits, and simple rule-based routing.
*   **Application Layer**: Library-based logic (e.g., LangChain RunnableBranch). Handles logic requiring deep context (session history, variable state).

### 3. The Calibration
The specific thresholds or weights used to make decisions. These must be tuned against a "Preference Dataset" (pairs of queries and optimal model choices).

## Operational Economics

### The Sweet Spot

**LLMs excel at:**
*   High ambiguity tasks requiring interpretation
*   Generation of novel content
*   Format/language transformation

**Use deterministic code for:**
*   Hot paths requiring <100ms response
*   High-volume operations
*   Binary correctness (auth, financial calculations)

## Anti-Patterns

### The Monolith
**Description**: Reliance on a single "Frontier" model for all tasks.
**Consequence**: Excessive cost and latency for simple tasks; inability to scale.

### Silent Drift
**Description**: Hard-coded routing rules (e.g., "if length > 50") that degrade as user behavior changes.
**Consequence**: Routing becomes incorrectly optimized, sending hard queries to weak models.
**Fix**: Use probabilistic routing or periodic recalibration.

### Context Stuffing
**Description**: Overloading a single prompt with instructions instead of routing to specialized tools/agents.
**Consequence**: "Lost in the Middle" phenomenon; higher hallucination rates.

## Trade-offs

| Dimension | Implications |
| :--- | :--- |
| **Latency Overhead** | The router itself adds latency (20-50ms for embeddings, 200ms+ for LLM routers). If the weak model saves 300ms but the router takes 400ms, you have negative ROI. |
| **Complexity** | Maintaining a router adds a control plane that can fail. It requires monitoring and dataset maintenance. |
| **Consistency** | Using multiple models can lead to inconsistent "tone" or formatting across a user session. |

## Relationship to Levels of Autonomy

[Levels of Autonomy](/concepts/levels-of-autonomy) define human oversight requirements. Model Routing matches computational capability to task characteristics:

*   **Complex architectural decisions** (L3) $\rightarrow$ High Reasoning models
*   **Well-specified implementation tasks** (L3) $\rightarrow$ High Throughput models
*   **Exploratory analysis** (L2) $\rightarrow$ Massive Context models

Applied in:
*   [Agentic SDLC](/concepts/agentic-sdlc) — Optimization of the factory floor.
*   [Adversarial Code Review](/patterns/adversarial-code-review) — using different models for Builder vs Critic.
