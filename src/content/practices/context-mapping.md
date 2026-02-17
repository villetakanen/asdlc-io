---
title: "Context Mapping"
description: "The practice of creating high-density Context Maps to guide agents through codebases and documentation."
tags: ["Context Engineering", "Documentation", "Project Structure"]
relatedIds: ["patterns/context-map", "practices/agents-md-spec", "concepts/context-engineering"]
status: "Experimental"
lastUpdated: 2026-02-16
---

## Definition

 **Context Mapping** is the tactical practice of generating and maintaining the **[Context Map](/patterns/context-map)** within your project's `AGENTS.md`. It involves auditing your knowledge assets and creating a compressed index that allows agents to navigate them autonomously.

## When to Use

*   **Complex Projects:** When your codebase is too large for the context window.
*   **Hidden Logic:** When business rules reside in "Internal Docs" (`docs/arch`) rather than code.
*   **New Architectures:** When using bleeding-edge frameworks (e.g., Next.js Canary) where the model's training data is outdated.

## The Strategy: "Hybrid Mapping"

We use a **Hybrid Strategy** based on the scale of independent variables:

| Knowledge Type | Scale | Preferred Format | Why? |
| :--- | :--- | :--- | :--- |
| **Project Structure** | < 1000 files | **Annotated YAML** | Readable, Structural, Native to LLMs. |
| **Internal Docs** | < 100 files | **Annotated YAML** | Explains *intent* alongside path. |
| **External Frameworks** | > 10MB text | **Compressed Pipe** | Maximum token density (80% compression). |

### Rule of Thumb
> **"If you can read it, the Agent can read it."**
> Default to **YAML**. Only use Compressed Pipe syntax when you hit token limits with massive external indexes.

## Implementation: The YAML Standard

For 99% of use cases, use an **Annotated YAML** map in your `AGENTS.md`.

### 1. Mapping Code (Topology)
Do not list every file. List **Responsibilities**.

```yaml
project_structure:
  src:
    features:
      checkout: "Payment flow and cart logic. STRICT: No direct DB access."
      inventory: "Stock checking and reservation logic."
    shared:
      components: "Re-usable UI atoms. MUST use Tailwind."
      lib: "Stateless utilities."
```

### 2. Mapping Internal Docs (Knowledge)
Map your `docs/` folder to explain *what* questions each document answers.

```yaml
documentation_index:
  docs:
    arch:
      infra.md: "READ THIS for Terraform state policies and AWS setup."
      decisions.md: "ADR log. Explains why we chose gRPC over REST."
    api:
      contracts.md: "The single source of truth for API schemas."
```

## Implementation: The Compressed Standard (Advanced)

Use this *only* for massive indices, such as dumping the entire Next.js or Supabase documentation structure into context.

**Format:** `[Name]|root:path|Instruction|path:{file1,file2}`

```text
[Next.js Docs]|root: ./.next-docs|IMPORTANT: Prefer retrieval-led reasoning.
|01-app/01-getting-started:{01-installation.mdx,02-project-structure.mdx}
|01-app/02-building-your-application:{01-routing.mdx,02-rendering.mdx}
```

## Process

1.  **Audit:** Identify the "Hidden Knowledge" (Architecture docs, specific files) agents miss.
2.  **Select Format:** Default to YAML. Switch to Pipe only if > 2000 tokens.
3.  **Embed:** Place the map in **Section 5** of your `AGENTS.md`.
4.  **Verify:** Ask the agent a question that requires the map (e.g., "Where is the Terraform state policy?"). If it reads the map and then finds the file, you succeeded.
