# ASDLC.io: Determinism over Vibes

**ASDLC.io** is the definitive knowledge base for the **Agentic Software Development Life Cycle (ASDLC)**. It provides a structured repository of concepts, patterns, and practices designed to bring engineering rigor to the collaboration between human developers and AI agents.

---

## 🌪️ The Philosophy

In the era of AI-assisted development, we reject "vibe coding" — the practice of blindly accepting LLM outputs without validation. Instead, ASDLC.io advocates for:

- **Schema-First Development**: Defining data contracts (Zod) before generating content.
- **Strict Logic**: Enforcing code quality and architectural rules at the source.
- **Docs-as-Code**: Maintaining the knowledge base with the same rigor as production software.

## 🧞 Key Features

- **Model Context Protocol (MCP)**: A built-in server that allows AI agents to directly browse and search this knowledge base via the `/mcp` endpoint.
- **Content Layer Architecture**: Powered by Astro 5.x for lightning-fast, schema-validated static content.
- **Edge Deployment**: MCP functionality runs on Netlify Edge Functions for global availability.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.x or higher
- **pnpm**: The exclusive package manager for this project

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```
Starts the local dev server at `localhost:4321`.

### Build & Index

```bash
pnpm build
```
Generates the static site and pre-builds the **MCP Article Manifest** (`src/mcp/articles.json`).

## 🤖 Model Context Protocol (MCP)

This project is more than just a website; it is an MCP server.

- **Endpoint**: `https://asdlc.io/mcp`
- **Transport**: HTTP with Server-Sent Events (SSE).
- **Architecture**: Powered by a build-time manifest to ensure compatibility with Edge runtimes.
- **Verification**: Run `pnpm test:mcp-preview <url>` to verify a deployment.

## 🧪 Testing & Validation

All logic is strictly tested using **Vitest**.

```bash
pnpm test:run
```
Runs the consolidated test suite located in `./tests`.

## 🤖 AI Contributor Protocol

If you are an AI agent contributing to this project, please read [AGENTS.md](./AGENTS.md) first for detailed personas, coding standards, and operational boundaries.
