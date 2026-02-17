---
title: "Context Map"
description: "A high-density navigational index that enables agents to locate knowledge without managing massive context windows."
tags: ["Context Engineering", "Architecture", "Retrieval", "Pattern"]
relatedIds: ["concepts/context-engineering", "practices/agents-md-spec", "practices/context-mapping", "patterns/context-gates"]
status: "Experimental"
lastUpdated: 2026-02-16
references:
  - title: "AGENTS.md outperforms skills in our agent evals"
    author: "Vercel"
    url: "https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals"
    type: "website"
    accessed: 2026-02-16
    annotation: "Demonstrates that passive context (Maps) outperforms active retrieval (Skills) for static knowledge."
---

## Definition

A **Context Map** is a curated, high-density index of a larger knowledge base (the "Territory") provided to an agent upfront. It acts as a navigational aid, allowing the agent to locate specific information or understand the system's topology without ingesting the entire corpus or relying on blind search.

Instead of hoping an agent "finds" the right context through tool calls, the Context Map guarantees the agent knows *what* exists and *where* it resides.

## The Problem: The Haystack Failure

Agents operating on large codebases or documentation sets face two failure modes:

1.  **Context Overload:** Feeding all documentation into the context window is expensive, slow, and typically exceeds token limits.
2.  **Search Blindness:** Letting agents search "on demand" (RAG) is unreliable. Vercel's research shows agents often fail to invoke search tools or craft poor queries, leading to a 79% success rate compared to 100% with a map.

The result is **Hallucination by Omission**: The agent invents a believable but incorrect solution because it failed to retrieve the authoritative documentation.

## The Solution: The Map is Not the Territory

The Context Map pattern separates **Navigation** from **Ingestion**.

We provide the agent with a **Map**—a highly compressed, structural representation of the available knowledge. The Map contains:
- **Topology:** What concepts exist and how they relate.
- **Signposts:** Key terminology and definitions.
- **Pointers:** References to the detailed files (The Territory).

Critically, **The Map is small enough to fit permanently in the context window**, while **The Territory is loaded only on demand**.

## Anatomy

A Context Map consists of three layers of increasing density:

### 1. The Index (Topology)
A structural overview of the domain.
*   **Role:** Tells the agent *what exists*.
*   **Format:** Typically an **Annotated YAML** tree or a **File System Table**.

### 2. The Glossary (Signposts)
A definition of domain-specific terms to prevent vocabulary mismatch.
*   **Role:** Tells the agent *what to call things*.
*   **Example:** Defining "Gate" so the agent doesn't search for "Guardrail".

### 3. The Routing Table (Pointers)
Explicit links between problems and their authoritative sources.
*   **Role:** Tells the agent *where to look*.
*   **Example:** "For database schema questions, see `src/db/schema.ts`."

## The Ecosystem: Where does it fit?

| Scope | Component | Role | Example |
| :--- | :--- | :--- | :--- |
| **Discipline** | **Context Engineering** | The "Physics". The study of how to structure info. | *The Concept* |
| **Pattern** | **Context Map** | **The Strategy**. "Use a Map to find the Territory." | *This Pattern* |
| **Practice** | **Context Mapping** | **The Tactics**. "How to write the Map in YAML." | *The How-To Guide* |
| **Container** | **AGENTS.md** | **The Implementation**. The file where the Map lives. | *The Spec* |

**Context Map** is the **Spatial** pillar of Context Engineering.
- **The Spec** is the **Temporal** pillar (What/When).
- **The Constitution** is the **Governance** pillar (How).

## Implementation Strategies

See the **[Context Mapping](/practices/context-mapping)** practice for detailed implementation guides.

### 1. The Pragmatic Map (YAML)
Using **Annotated YAML** to describe project structure and internal documentation. This is preferred for its readability and standard structure which LLMs assume naturally.

### 2. The Compressed Map (Vercel Style)
Using a high-density **Pipe-Delimited** format (`|path/to/file:{doc1,doc2}`) to map massive external documentation sets (e.g., framework docs) where token efficiency is paramount.
