# ASDLC.io: Determinism over Vibes

**ASDLC.io** is the definitive knowledge base for the **Agentic Software Development Life Cycle (ASDLC)**. It provides a structured repository of concepts, patterns, and practices designed to bring engineering rigor to the collaboration between human developers and AI agents.

---

## Philosophy: The Industrialization of Software

> "Agentic architecture is the conveyor belt for knowledge work."

For 50 years, software development has been a **Craft**—dependent on individual artisans, manual tooling, and implicit knowledge. ASDLC.io documents the principles, patterns, and standards for transitioning to **Industrial** software engineering.

### The Core Insight

**Agents do not replace humans; they industrialize execution.**

Just as robotic arms automate welding without replacing manufacturing expertise, agents automate high-friction parts of knowledge work (logistics, syntax, verification) while humans focus on intent, architecture, and governance.

### What This Means

- **Agents are the logistic layer** — Moving information, verifying specs, executing tests
- **Context is the supply chain** — Just-in-Time delivery of requirements, schemas, and code
- **Standardization is mandatory** — Schemas, typed interfaces, deterministic protocols

We're not building "AI coding assistants." We're documenting the blueprints for the **software factory**.

There is no single right answer to building these systems; thus, **optionality is a feature**, not a bug. Patterns in architecture and software engineering gave us a shared, opinionated vocabulary of composable building blocks. ASDLC.io maps the vocabulary of the **Agentic era**.

**Read the full vision:** [docs/vision.md](./docs/vision.md)

### Determinism over Vibes

Fluency in agentic coding requires both mastery of steering (vibes) and the implementation of deterministic tools:

- **Schema-First Development**: Defining data contracts (Zod) before generating content
- **Strict Logic**: Enforcing code quality and architectural rules at the source
- **Docs-as-Code**: Maintaining the knowledge base with the same rigor as production software

**Determinism arises from tools, not prompts.** `AGENTS.md` steers the agent, but only schemas and tests ensure compliance.

## Key Features

- **Model Context Protocol (MCP)**: A built-in server that allows AI agents to directly browse and search this knowledge base via the `/mcp` endpoint.
- **Downloadable Static Skill**: A self-contained bundle of the knowledge base designed for offline or local-first agentic workflows.
- **Content Layer Architecture**: Powered by Astro 5.x for lightning-fast, schema-validated static content.
- **Edge Deployment**: MCP functionality runs on Netlify Edge Functions for global availability.

## Getting Started

### Prerequisites

- **Node.js**: v18.x or higher
- **pnpm**: The exclusive package manager for this project

### Installation

```bash
pnpm install
```

### Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start the local dev server at `localhost:4321` |
| `pnpm build` | Full production build (type check + static site + skill bundle) |
| `pnpm check` | Run Astro type checking |
| `pnpm lint` | Lint and auto-fix with Biome |
| `pnpm test:run` | Run the Vitest test suite |
| `pnpm diagrams` | Render Mermaid diagrams to SVG |
| `pnpm build:mcp-index` | Rebuild the MCP article manifest (`src/mcp/articles.json`) |
| `pnpm build:skill` | Generate the downloadable skill artifact at `dist/skill/` |

## Model Context Protocol (MCP)

This project is more than just a website; it is an MCP server.

- **Endpoint**: `https://asdlc.io/mcp`
- **Transport**: HTTP with Server-Sent Events (SSE).
- **Architecture**: Powered by a build-time manifest to ensure compatibility with Edge runtimes.
- **Verification**: Run `pnpm test:mcp-preview <url>` to verify a deployment.

## Testing & Validation

All logic is strictly tested using **Vitest**.

```bash
pnpm test:run
```
Runs the consolidated test suite located in `./tests`.

## AI Contributor Protocol

If you are an AI agent contributing to this project, please read [AGENTS.md](./AGENTS.md) first for detailed personas, coding standards, and operational boundaries.
