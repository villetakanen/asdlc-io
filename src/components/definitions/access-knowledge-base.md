---
title: Access the Knowledge Base
---
## Connect Your Agent

Grouning your agent context with the ASDLC.io knowledge base.

### 1. Model Context Protocol (MCP)

AI agents can connect directly to browse, search, and retrieve ASDLC content via the `/mcp` endpoint.

Server Endpoint: `https://asdlc.io/mcp`

_**Please note:** even if the ASDLC.io MCP is fairly small, we suggest enabling it only when scaffolding a new project, or when maintaining the agentic structure of a project. Access to the knowledge base is not necessary during the solution development._

#### Claude Code

```bash
claude mcp add --transport http asdlc https://asdlc.io/mcp
```

### 2. Downloadable Static Skill

For offline or local-first workflows, download the self-contained Knowledge Base bundle. Drop it into your project to give your local agent "ASDLC superpowers".

<a href="/asdlc-skill.zip" class="button">Download Skill (ZIP)</a>
