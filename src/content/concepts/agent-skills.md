---
title: Agent Skills
description: "Open standard for packaging procedural knowledge and workflows, serving as the 'how-to' layer for AI agents."
tags:
  - Infrastructure
  - Workflows
relatedIds: ["concepts/model-context-protocol", "concepts/context-engineering", "practices/agents-md-spec"]
lastUpdated: 2026-03-02
references:
  - type: website
    title: "Agent Skills Official Specification"
    author: "Anthropic / Agent Skills Contributors"
    url: "https://agentskills.io/specification"
    accessed: 2026-03-02
    annotation: "The canonical open standard format definition for Agent Skills."
  - type: website
    title: "Skills Explained — How Skills Compares to Prompts, Projects, MCP."
    author: "Anthropic"
    url: "https://claude.com/blog/skills-explained"
    accessed: 2026-03-02
    annotation: "The official piece defining the boundary: MCP for connectivity, Skills for procedural knowledge."
  - type: website
    title: "Agent Skills Explained: An FAQ"
    author: "Vercel"
    url: "https://vercel.com/blog/agent-skills-explained-an-faq"
    accessed: 2026-03-02
    annotation: "Details the anatomy of a skill package, including the progressive disclosure model of scripts/ and references/."
  - type: website
    title: "Skills vs Dynamic MCP Loadouts"
    author: "Armin Ronacher"
    url: "https://lucumr.pocoo.org/2025/12/13/skills-vs-mcp/"
    published: 2025-12-13
    accessed: 2026-03-02
    annotation: "Practitioner analysis highlighting the stability and control benefits of Skills over third-party MCP servers."
  - type: website
    title: "MCP, Skills, and Agents"
    author: "David Cramer"
    url: "https://cra.mr/mcp-skills-and-agents/"
    accessed: 2026-03-02
    annotation: "Provides the \"cooking\" metaphor: skills teach you to cook, MCP provides the instruments."
---

# Agent Skills

## Definition

Agent Skills (often just "Skills") are an open standard for packaging procedural knowledge, instructions, and workflows into highly reusable, discoverable formats that AI agents can utilize on demand. 

While the [Model Context Protocol (MCP)](/concepts/model-context-protocol) connects agents to external tools and data, Skills teach the agent *how* to use those tools to accomplish specific tasks. They fill the gap between declarative knowledge (what a system is) and procedural knowledge (how to operate within it).

Originally developed by Anthropic for Claude Code and subsequently opened as an industry standard (Agent Skills spec), they are now supported across major agent environments including OpenAI's Codex CLI, Google's Antigravity, and specialized repositories like Vercel's skills.sh.

## The Anatomy of a Skill

A Skill is fundamentally a directory containing a `SKILL.md` file, paired with optional executable scripts or reference documents. 

**Structure Example:**
```text
my-code-review-skill/
├── SKILL.md       # Required: Frontmatter metadata + Markdown instructions
├── scripts/       # Optional: Executable helpers (bash, python, etc.)
├── references/    # Optional: Detailed documentation loaded on demand
└── assets/        # Optional: Templates, examples, or schemas
```

### Progressive Disclosure

Skills operate on a progressive disclosure model. This is a practical implementation of the [Toolchain as Context Reduction](/concepts/context-engineering#toolchain-as-context-reduction) principle:

1. **Discovery:** The agent loads only the YAML frontmatter (name, description, compatibility) into its base context. This consumes minimal tokens (~100 tokens).
2. **Activation:** If the agent encounters a task matching the skill's description, it invokes the skill, loading the body of `SKILL.md` (< 5k tokens).
3. **Execution:** The agent follows the instructions and explicitly loads any heavy reference files or executes helper scripts *only* when the workflow demands it.

## The ASDLC Perspective

In the Agentic SDLC, Skills hold a specific place in the artifact taxonomy:

| Artifact | Scope | Lifespan | Content Type |
| :--- | :--- | :--- | :--- |
| **`AGENTS.md`** | Project-global | Persistent | Behavioral / Judgment |
| **Specs** | Feature-level | Permanent (living) | Contracts / Design |
| **ADRs** | Decision-scoped | Immutable | Rationale / Consequences |
| **PBIs** | Task-scoped | Transient | Delta / Execution |
| **Skills** | Workflow-scoped | Reusable | Procedural knowledge |
| **MCP** | Integration-scoped | Runtime | Connectivity / Tools |

### Skills as Persona Carriers

A core ASDLC pattern asserts that personas should be injected via workflows, not loaded globally. Skills are the natural packaging format for this pattern. Instead of bloating the global `AGENTS.md` with instructions on how to act as a "Database Reviewer" or a "UI/UX Specialist," those personas are encapsulated as Skills and invoked only when the relevant tasks arise.

### Horizontal vs. Vertical Context

The choice between putting instructions in `AGENTS.md` versus creating a Skill comes down to **horizontal versus vertical context**. 

In Vercel's 2025 agent evaluations, they discovered that for foundational framework knowledge (like Next.js routing patterns), a compressed static index embedded in `AGENTS.md` outperformed Skills (100% vs 79% pass rate). Why? Because Skills require an active decision by the agent to invoke them. When a rule applies to *everything* the agent does in a project, it belongs in the horizontal, always-on context of `AGENTS.md`. 

**The Heuristic:**
* Use **`AGENTS.md`** for global constraints, repository architecture, and fundamental framework rules.
* Use **Skills** for deep, task-specific, procedural workflows (e.g., "How to execute our deployment pipeline" or "How to perform an adversarial code review").

### Skills vs. MCP

The distinction is simple: **If Skills teach an agent to cook, MCP provides the instruments.**

However, a real architectural tension exists between them. [Armin Ronacher (2025)](https://lucumr.pocoo.org/2025/12/13/skills-vs-mcp/) noted that teams often prefer Skills over "Dynamic MCP Loadouts" because MCP servers are maintained by third parties and suffer from API instability. If an MCP server changes its schema, the agent breaks. Alternatively, a Skill containing a local bash script to query a database is entirely under the team's version control. 

When absolute local control and token efficiency are paramount, teams may choose to implement capabilities via Skills (using local shell actions) rather than relying on external MCP servers.
