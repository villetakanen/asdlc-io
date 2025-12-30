---
title: Model Context Protocol (MCP)
description: "Open standard for connecting AI agents to data sources and tools, enabling real-time 'just-in-time' context vs. stale vector databases."
tags:
  - Infrastructure
  - Standards
lastUpdated: 2025-11-25
---

The Model Context Protocol (MCP) is an open standard that functions as a universal connector between AI assistants and external systems. It standardizes how AI models interact with data repositories and business tools, effectively replacing fragmented, custom integrations with a single, unified protocol.

## The "USB-C" for Artificial Intelligence

Think of MCP as a USB-C port for AI applications.

*   **Before MCP:** Connecting an AI to a database required writing a specific "cable" (custom API glue code) for every single connection.
*   **With MCP:** Developers build a connector once, and it works seamlessly across multiple AI platforms (like Claude, IDEs, or Agentic workflows).

## How It Works

Technologically, MCP operates on a Client-Host-Server architecture:

*   **The Host:** The application running the AI (e.g., the Claude Desktop app or an IDE).
*   **The Server:** The data source (e.g., a local file system, a Slack workspace, or a PostgreSQL database).
*   **The Protocol:** They communicate using JSON-RPC 2.0, typically transported via stdio for local connections or Server-Sent Events (SSE) for remote connections.

## From Static to "Just-in-Time" RAG

While MCP is a critical enabler for Retrieval-Augmented Generation (RAG), it represents a fundamental shift in how agents access knowledge.

| Feature | Traditional RAG | MCP (Dynamic RAG) |
| :--- | :--- | :--- |
| **Data Source** | Pre-indexed Vector Databases | Live "Resources" & "Tools" |
| **Freshness** | Snapshots (Can become stale) | Real-time (Source of Truth) |
| **Mechanism** | Semantic Search | Direct Query / Function Execution |

By allowing the model to query a live SQL database or read the current state of a git repository at the exact moment of inference, MCP enables "Just-in-Time" intelligence. This removes the reliance on stale data dumps and allows agents to act on the absolute latest state of the world.
