---
title: Model Context Protocol (MCP)
description: "The universal connector for AI agents to access tools and data, acting as the supply chain infrastructure for agentic workflows."
tags:
  - Infrastructure
  - Standards
relatedIds: ["concepts/context-engineering", "patterns/the-spec", "patterns/context-gates", "practices/agents-md-spec"]
lastUpdated: 2026-03-02
references:
  - type: website
    title: "Model Context Protocol Specification (2025-11-25)"
    author: "MCP Core Team"
    url: "https://modelcontextprotocol.io/specification/2025-11-25"
    published: 2025-11-25
    accessed: 2026-03-02
    annotation: "The authoritative specification defining tools, resources, prompts, routing, and the November 2025 async task extensions."
  - type: website
    title: "One Year of MCP: November 2025 Spec Release"
    author: "MCP Blog"
    url: "https://blog.modelcontextprotocol.io/posts/2025-11-25-first-mcp-anniversary/"
    published: 2025-11-25
    accessed: 2026-03-02
    annotation: "Review of MCP's trajectory, the introduction of server-side agent loops, and structured tool outputs."
  - type: website
    title: "AGENTS.md Outperforms Skills in Our Agent Evals"
    author: "Vercel"
    url: "https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals"
    accessed: 2026-03-02
    annotation: "Empirical study demonstrating that static, passive context often outperforms active tool-based retrieval for framework knowledge."
  - type: website
    title: "The Model Context Protocol's Impact on 2025"
    author: "Thoughtworks"
    url: "https://www.thoughtworks.com/en-us/insights/blog/generative-ai/model-context-protocol-mcp-impact-2025"
    accessed: 2026-03-02
    annotation: "Analysis of MCP's role in context engineering, alongside security risks like tool poisoning and cross-server tool shadowing."
  - type: website
    title: "Everything Wrong with MCP"
    author: "Shrivu Shankar"
    url: "https://blog.sshh.io/p/everything-wrong-with-mcp"
    accessed: 2026-03-02
    annotation: "Critical analysis of MCP's security vulnerabilities, including prompt injection via untrusted data sources and forth-party exploits."
  - type: website
    title: "MCP Explained — Why It Matters in 2026"
    author: "Robomotion"
    url: "https://robomotion.io/blog/mcp-explained-why-model-context-protocol-matters-in-2026"
    accessed: 2026-03-02
    annotation: "Examines the boundary between context delivery (MCP) and workflow orchestration in building reliable AI agents."
---

# Model Context Protocol

## Definition

The Model Context Protocol (MCP) is an open standard that functions as a universal connector between AI assistants and external systems. Operating on a Client-Host-Server architecture via JSON-RPC 2.0, it standardizes how AI models interact with data repositories, APIs, and business tools.

If agents are the cognitive engines of the AI era, MCP is the supply chain infrastructure. It replaces fragmented, custom integrations with a single, unified protocol, allowing developers to build a connector once and have it work seamlessly across different AI platforms (like Claude, Cursor, or specialized agentic workflows).

## Key Characteristics

1. **Client-Host-Server Architecture:** The AI application (Host) connects to data sources (Servers) through the Protocol interface.
2. **Just-in-Time Access:** MCP allows the model to query live SQL databases or read the current state of repositories at the exact moment of inference, removing reliance on stale data dumps.
3. **Task-Based Execution:** The November 2025 specification introduced async support for long-running tasks and agentic server-side sampling.
4. **Tool and Context Delivery:** MCP provides discovery and invocation mechanisms for both passive knowledge (Resources) and active capabilities (Tools).

## Dynamic Retrieval vs. Static Context

A critical tension in agentic development is when to rely on dynamic retrieval (via MCP tools) versus static file-based context (like `AGENTS.md`). While MCP is powerful, it is not always the optimal choice for communicating framework knowledge or static instructions.

### The Vercel Evaluation

Vercel's 2025 agent evaluations revealed a counterintuitive finding: **a compressed static docs index in `AGENTS.md` outperformed sophisticated MCP skill-based retrieval.** In tests measuring Next.js 16 API correctness:

*   **Skills (Active Retrieval):** Reached a 79% pass rate, suffering from unreliable triggering and wording fragility. The agent had to actively decide when to invoke the skill, creating a sequencing bottleneck.
*   **AGENTS.md (Static Context):** Achieved a 100% pass rate. The information was consistently available in the system prompt on every turn, eliminating the decision point entirely.

### The ASDLC Heuristic

This dynamic maps directly to [Context Engineering](/concepts/context-engineering). The decision heuristic for providing context to agents is:

*   **Use Static Context (`AGENTS.md`):** For framework knowledge, coding standards, repository structure, and bounded domain rules. Static files require zero agent reasoning to discover and are consistently available.
*   **Use Dynamic Context (MCP):** For highly mutable external state (live databases, Slack messages, third-party API queries) or actions that change the state of the world (executing commands, sending emails).

As Gloaguen et al. demonstrated, LLM reliability often negatively correlates with instructional context volume. The goal is constraint minimalism: give the agent exactly what it needs, in the simplest format possible.

## Security Surface and Risks

As MCP adoption scales, its security footprint has become a primary organizational concern. The protocol's initial focus on ease-of-use introduced several critical threat vectors:

*   **Tool Poisoning and RCE:** A malicious actor can inject prompt injections or malicious commands into external data sources (like a database or a shared document). When a trusted MCP server reads that data, the host agent executes it, potentially leading to Remote Code Execution (RCE) via tool hallucination.
*   **Cross-Server Interference:** When multiple MCP servers are active in the same context, agents can experience tool confusion or execute tools from the wrong server.
*   **Schema Drift and Vendoring:** The descriptions, names, and schemas of MCP tools are fed directly into the agent's prompt. Taking breaking changes to an MCP server can silently degrade agent performance.

### Vendoring as Mitigation

To address schema drift and token cost (e.g., loading GitHub's entire MCP toolset consumes massive token budgets), the ASDLC advocates for **vendoring tool definitions**. Tools like `mcp-to-ai-sdk` allow teams to generate static copies of MCP tools, pinning their behavior and schemas to ensure determinism over vibes.

## What MCP Doesn't Solve

A common misconception is that MCP is a workflow engine. It is not. **MCP solves how context is delivered to a model; it does not solve how the model is governed.**

Relying solely on MCP leads to architectural gaps:
1.  **Orchestration:** MCP provides tools, but does not sequence when they run, how failures are handled, or when human-in-the-loop escalation is required.
2.  **Governance:** MCP lacks native mechanisms enforcing policy compliance across tool calls.
3.  **Lifecycle Management:** Connecting an agent to 50 tools via MCP creates a massive, unstructured action space that degrades reasoning.

### The ASDLC Missing Pieces

To build production-ready systems, MCP must be paired with structural patterns:
*   [**Context Gates:**](/patterns/context-gates) Architectural checkpoints that filter MCP outputs before they enter the reasoning loop.
*   [**Workflow as Code:**](/patterns/workflow-as-code) Deterministic pipelines that wrap MCP tool calls in type-safe execution graphs, ensuring reliability.

MCP is an operational requirement for the Agentic SDLC, but it is just the plumbing. It provides the water; the framework must build the pipes.
