---
title: Access the Knowledge Base
---
Stay grounded in official ASDLC patterns and practices through two primary agent-ready interfaces:

### 1. Model Context Protocol (MCP)

AI agents can connect directly to browse, search, and retrieve ASDLC content via the `/mcp` endpoint.

Server Endpoint: `https://asdlc.io/mcp`

#### Claude Code

```bash
claude mcp add --transport http asdlc https://asdlc.io/mcp
```

### 2. Downloadable Static Skill

For offline or local-first workflows, download the self-contained Knowledge Base bundle. Drop it into your project to give your local agent "ASDLC superpowers".

<a href="/asdlc-skill.zip" class="button">Download Skill (ZIP)</a>
