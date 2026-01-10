---
title: "External Attention"
description: "External Attention offloads document processing to isolated sub-agents, returning only extracted answers to the main agent's context window."
tags: ["Context Engineering", "Agent Architecture", "Document Processing"]
relatedIds: ["patterns/model-routing", "concepts/context-gates", "concepts/levels-of-autonomy"]
lastUpdated: 2026-01-10
status: "Draft"
references:
  - type: "paper"
    title: "InfiAgent: An Infinite-Horizon Framework for General-Purpose Autonomous Agents"
    url: "https://arxiv.org/abs/2601.03204"
    author: "Chenglin Yu, Yuchen Wang, Songmiao Wang, Hongxia Yang, Ming Li"
    published: 2026-01-06
    accessed: 2026-01-10
    annotation: "Introduces 'External Attention Pipeline' for bounded-context document processing."
---

## Definition

**External Attention** is an architectural pattern for offloading document processing to isolated sub-agents rather than injecting documents into the main agent's context window. The sub-agent queries the document and returns only the extracted answer.

This pattern addresses a fundamental tension in agentic systems: agents often need information from large documents (PDFs, codebases, research papers), but loading those documents directly into context degrades performance on the primary task.

## The Problem: Context Bloat from Large Documents

When agents need information from large documents, the naive approach loads the document into context. This creates:

- **Context pollution** — Document tokens compete with task-relevant tokens
- **Cognitive overload** — Agent loses focus on the current objective
- **Token waste** — Paying for full document when only a fraction is relevant

## The Solution: Query, Don't Load

Instead of:
```
Context = [Task Instructions] + [Full Document] + [Recent Actions]
```

Use:
```
Context = [Task Instructions] + [Query Result] + [Recent Actions]
```

Where `Query Result` comes from a specialized sub-agent that:
1. Receives the document + specific question
2. Extracts only the relevant answer
3. Returns a bounded response to the main agent

The key insight: **isolation preserves focus**. The main agent's context remains clean while the sub-agent handles the messy work of document comprehension.

## Anatomy

External Attention consists of four components:

### Document Ingestion Tool

A tool interface that accepts a document reference and a query. The main agent sees only the tool signature, not the document contents.

```python
answer = answer_from_pdf(
    document="research-paper.pdf",
    query="What is the reported accuracy on benchmark X?"
)
```

### Sub-Agent Context

An isolated context window where the full document is loaded alongside the query. This context is invisible to the main agent—it exists only for the duration of the tool call.

### Query Processor

The sub-agent logic that:
- Parses the document
- Locates relevant sections
- Extracts the specific answer
- Formats a bounded response

### Bounded Response Contract

The interface guaranteeing that only the extracted answer (not the full document) returns to the main agent. This is the critical boundary that prevents context pollution.

## Relationship to Other Patterns

**[Model Routing](/patterns/model-routing)** — External Attention is a form of model routing where document processing routes to a specialized "reader" agent.

**[Context Gates](/concepts/context-gates)** — The tool boundary acts as a Context Gate, filtering document contents to only relevant extractions.

**[Levels of Autonomy](/concepts/levels-of-autonomy)** — The document-processing sub-agent is an L1 Atomic Agent with a single responsibility.

**Practice: External Document Processing** — Implementation guidance TBD.

## When to Use

- Processing documents larger than ~10% of context window
- Querying specific facts from large codebases
- Literature review tasks requiring many papers
- Any task where document contents would dilute task focus

## When Not to Use

- Documents small enough to fit comfortably in context
- Tasks requiring holistic document understanding (not point queries)
- Situations where query formulation is unclear upfront

## Industry Validation

The InfiAgent framework (Yu et al., 2026) demonstrates this pattern at scale: an 80-paper literature review task where the main agent maintains bounded context by delegating all document reading to `answer_from_pdf` tools. The approach enabled 80/80 paper coverage where baseline agents failed.
