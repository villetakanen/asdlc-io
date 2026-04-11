---
title: Model Context Protocol (MCP)
longTitle: "Model Context Protocol: The Universal Connector for AI Agents"
description: "Open standard for connecting AI agents to external tools and data. Covers MCP's role in agentic development, its limits, and why implementation quality matters."
tags:
  - Infrastructure
  - Standards
  - Interoperability
  - AI Agents
  - Context Engineering
status: "Live"
relatedIds: ["concepts/context-engineering", "patterns/the-spec", "patterns/context-gates", "practices/agents-md-spec", "practices/workflow-as-code"]
lastUpdated: 2026-04-11
references:
  - type: website
    title: "Model Context Protocol Specification"
    author: "MCP Core Team"
    url: "https://modelcontextprotocol.io/specification/2025-11-25"
    published: 2025-11-25
    accessed: 2026-04-11
    annotation: "The authoritative protocol specification defining tools, resources, prompts, and the Client-Host-Server architecture."
  - type: website
    title: "The 2026 MCP Roadmap"
    author: "MCP Blog"
    url: "https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/"
    published: 2026-01-15
    accessed: 2026-04-11
    annotation: "Strategic priorities for 2026: transport scalability, agent-to-agent communication, enterprise auth, and governance maturation via Working Groups."
  - type: website
    title: "Expanding the MCP Maintainer Team"
    author: "MCP Blog"
    url: "https://blog.modelcontextprotocol.io/posts/2026-04-08-maintainer-update/"
    published: 2026-04-08
    accessed: 2026-04-11
    annotation: "Governance update reflecting MCP's move to the Agentic AI Foundation and expansion of the core maintainer group."
  - type: website
    title: "AGENTS.md Outperforms Skills in Our Agent Evals"
    author: "Vercel"
    url: "https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals"
    accessed: 2026-03-02
    annotation: "Empirical study demonstrating that static context often outperforms active tool-based retrieval for framework knowledge, informing the static vs. dynamic context heuristic."
  - type: website
    title: "The Model Context Protocol's Impact on 2025"
    author: "Thoughtworks"
    url: "https://www.thoughtworks.com/en-us/insights/blog/generative-ai/model-context-protocol-mcp-impact-2025"
    accessed: 2026-03-02
    annotation: "Analysis of MCP's role in context engineering alongside security risks including tool poisoning and cross-server tool shadowing."
  - type: website
    title: "Everything Wrong with MCP"
    author: "Shrivu Shankar"
    url: "https://blog.sshh.io/p/everything-wrong-with-mcp"
    accessed: 2026-03-02
    annotation: "Critical analysis of MCP's security surface including prompt injection via untrusted data sources and forth-party exploits."
---

## Definition

The **Model Context Protocol (MCP)** is an open standard for connecting AI agents to external tools, data sources, and services. It provides a universal interface so that a connector built once works across any compliant AI platform — Claude, ChatGPT, Cursor, Windsurf, or custom agentic systems.

MCP was open-sourced by Anthropic in November 2024. Within twelve months it had over 6,400 registered servers spanning databases, developer tools, communication platforms, and cloud infrastructure. In December 2025, Anthropic donated the protocol to the **Agentic AI Foundation (AAIF)**, a Linux Foundation directed fund co-founded by Anthropic, Block, and OpenAI. OpenAI officially adopted MCP in March 2025.

The protocol operates on a Client-Host-Server architecture using JSON-RPC 2.0. The AI application (Host) connects to external systems (Servers) through a standardized interface that supports tool discovery, invocation, and resource access. The November 2025 specification added async support for long-running tasks and server-side agent loops. For full architectural details, see the [official specification](https://modelcontextprotocol.io/specification/2025-11-25).

## Role in the Agentic SDLC

If agents are the cognitive engines of the agentic era, MCP is the supply chain infrastructure. It standardizes how live external state — issue trackers, databases, monitoring dashboards, third-party APIs — reaches the agent's context window.

In the ASDLC, MCP serves as the **dynamic context delivery layer**: the complement to static context provided by [AGENTS.md](/practices/agents-md-spec) and [Specs](/patterns/the-spec). Static files supply stable architectural constraints that don't change between tool calls. MCP connections supply mutable, real-time information that the agent needs at the moment of inference. [Context Gates](/patterns/context-gates) mediate between the two, filtering MCP outputs before they enter the agent's reasoning loop.

This separation is deliberate. Mixing stable architectural context with volatile external data in the same delivery mechanism creates noise. The agent needs to know the difference between "this is a permanent constraint" and "this is the current state of the world."

## Static vs. Dynamic Context

A critical tension in agentic development is when to rely on dynamic retrieval (via MCP tools) versus static file-based context (like `AGENTS.md`). MCP is powerful, but it is not always the optimal choice.

### The Vercel Finding

Vercel's 2025 agent evaluations revealed a counterintuitive result: a compressed static docs index in `AGENTS.md` outperformed sophisticated MCP skill-based retrieval. In tests measuring Next.js 16 API correctness, skills (active retrieval) reached 79% — suffering from unreliable triggering and wording fragility. The agent had to decide *when* to invoke the skill, creating a sequencing bottleneck. Static context via `AGENTS.md` achieved 100% — the information was available on every turn, eliminating the decision point entirely.

### The Heuristic

This maps directly to [Context Engineering](/concepts/context-engineering). The decision framework:

**Use static context** (`AGENTS.md`, specs, architecture files) for: framework knowledge, coding standards, repository structure, bounded domain rules, and architectural constraints. These are stable, bounded, and must be consistently available. Zero agent reasoning required to discover them.

**Use dynamic context** (MCP) for: live external state (database contents, Slack messages, monitoring alerts), actions that change the world (executing commands, creating tickets, sending messages), and information that is too large or too volatile to embed in files.

The boundary is clear: if the information changes between agent sessions, MCP delivers it. If it doesn't, put it in a file.

## The Context Budget Problem

Every tool you give an agent — MCP server, CLI tool, function call — consumes context window. This is a finite, shared resource. A tool's definition, its parameter schemas, its description text: all of it occupies space that could otherwise hold the spec, the code, or the conversation history.

This is where the discourse around MCP goes wrong. The question is not "MCP vs. CLI" or "MCP vs. function calling." They are all context delivery mechanisms. They all eat the same budget. The quality of any of them depends on the same discipline: **surface the minimum viable tool set and write tight descriptions.**

### The Implementation Quality Problem

Most MCP servers are badly implemented. The common failure mode: expose the entire API surface as tools. A GitHub MCP server with 40 endpoints, each with verbose parameter descriptions, can consume thousands of tokens before the agent has seen a single line of code. This is not an MCP problem. It is a context engineering problem. A CLI tool that dumps a 200-line help text into the agent's prompt fails identically.

The "MCP is bad" critique and the counter-migration to CLI tools miss the point. A well-crafted MCP server with 5 focused tools beats a 50-tool server. A focused CLI with 3 subcommands beats a Swiss Army knife. The problem travels with the implementer, not the protocol. Bad MCP and bad CLI fail for exactly the same reason: they flood the context window with information the agent doesn't need for the task at hand.

### What Good Looks Like

A well-implemented context delivery mechanism — MCP or otherwise — follows constraint minimalism:

- **Minimal tool surface.** Expose 5-10 tools, not 50. If you need more, split into focused servers.
- **Tight descriptions.** Every word in a tool description consumes tokens. Write them like you're paying per character — because you are.
- **Scoped schemas.** Don't include optional parameters the agent will never use. Surface the 80% case.
- **Lazy loading.** Don't dump all tool definitions at connection time if the agent may only need two of them. The 2026 roadmap's Server Cards feature addresses discovery without full connection.

This is [Context Engineering](/concepts/context-engineering) applied to infrastructure. The same principles that govern how you structure a spec or an `AGENTS.md` file govern how you build an MCP server.

## Security Considerations

MCP's security surface grows with adoption. The protocol's initial focus on developer experience introduced threat vectors that enterprise deployments must address:

**Tool poisoning** — Malicious content injected into external data sources (a database record, a shared document) can become prompt injections when a trusted MCP server reads and surfaces that data. The agent executes instructions embedded in what it treats as context.

**Cross-server interference** — Multiple MCP servers active in the same session create tool confusion. An agent may invoke a tool from the wrong server, or tool descriptions from different servers may conflict.

**Schema drift** — MCP tool definitions (names, descriptions, parameter schemas) are injected directly into the agent's prompt. Breaking changes to a server silently degrade agent performance without any compilation error or test failure.

These risks are mitigated in the ASDLC through structural patterns rather than protocol-level fixes. [Context Gates](/patterns/context-gates) filter MCP outputs before they enter the reasoning loop. [Workflow as Code](/practices/workflow-as-code) wraps MCP tool calls in deterministic, type-safe execution pipelines where tool selection is governed by code, not left to agent reasoning. For vendoring tool schemas to prevent drift, see the [Living Specs practice](/practices/living-specs) for the same principle applied to specifications.

## What MCP Doesn't Solve

MCP standardizes how context reaches the model. It does not solve how that context is governed. This is a common architectural misconception: teams connect 30 MCP servers and expect the agent to orchestrate across them coherently. It won't.

**Orchestration** — MCP provides tools but does not sequence when they run, how failures are handled, or when human escalation is required. That is the job of [Workflow as Code](/practices/workflow-as-code).

**Governance** — MCP has no native mechanism for enforcing policy compliance across tool calls. An agent with access to a production database and a deployment tool has no protocol-level guardrail preventing it from deploying untested code. That is the job of [Context Gates](/patterns/context-gates) and the [Agent Constitution](/patterns/agent-constitution).

**Action space management** — Connecting an agent to 50 tools creates a massive, unstructured action space that degrades reasoning quality. The more tools available, the more likely the agent selects the wrong one or hallucinates a tool that doesn't exist. This is the context budget problem applied to capabilities.

MCP is an operational requirement for the Agentic SDLC — but it is infrastructure, not architecture. The patterns that sit above it (Context Gates, Workflow as Code, Agent Constitution) are deliberately protocol-agnostic: they work whether context arrives via MCP, CLI, function calls, or whatever replaces them next.

## The Evolving Standard

MCP is under active development. The 2026 roadmap, driven by Working Groups under AAIF governance, focuses on transport scalability, agent-to-agent communication, enterprise auth (SSO, RBAC, audit trails), and gateway behavior. Server Cards (v2.1) enable capability discovery without full connection, reducing latency in environments with many servers.

ASDLC tracks MCP's evolution but does not couple to specific protocol versions. The patterns described here — static vs. dynamic context separation, Context Gates as a filtering layer, Workflow as Code for orchestration — are designed to survive protocol changes. MCP may be the dominant standard today; the architectural principles that govern its use will outlast any single specification revision.
