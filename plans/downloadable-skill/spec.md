# Feature: Downloadable Static ASDLC Skill

## Blueprint

### Context

### Context

We currently distribute the ASDLC Knowledge Base via the main website and an MCP server (`plans/mcp-server/spec.md`). To provide a **complementary** distribution method that supports offline, air-gapped, or local-first agentic workflows, we are introducing a **Downloadable Static Skill**.

This "Skill" is a self-contained bundle of markdown files and instructions that can be dropped into any project or loaded into an agent's context window. It serves as an alternative access point for the same content, not a replacement for the live services.

### The "Skill" Artifact

The artifact will be a ZIP file (e.g., `asdlc-skill-v{version}.zip`) containing a structured knowledge base optimized for minimal token usage and maximum semantic density.

**Target Audience:**
- Developers who want to give their current project "ASDLC superpowers" without external dependencies.
- Agents (Cursor, Windsurf, Claude Code, etc.) that operate better with local file context.
- Users in offline or secure environments where live MCP connections are not possible.

### Architecture

**Build Pipeline:**
1.  **Source:** `src/content/{concepts,patterns,practices}/*.md`
2.  **Transform:** A build script (`scripts/build-skill.ts`) processes the content:
    -   Resolves internal links (e.g., `[foo](/concepts/foo)` -> `[foo](../concepts/foo.md)`).
    -   Strips unnecessary HTML/Astro components.
    -   Adds a standard header/footer to each file for context.
    -   Generates a `SKILL.md` (or `README.md`) entry point.
3.  **Package:** Zips the result into `dist/skill/asdlc-skill.zip`.

**Directory Structure (Inside the ZIP):**

```
asdlc-skill/
├── SKILL.md                # The "Manifest" / Entry Point for the Agent
├── concepts/
│   ├── context-engineering.md
│   ├── ...
├── patterns/
│   ├── the-spec.md
│   ├── ...
└── practices/
    ├── agents-md-spec.md
    └── ...
```

### The `SKILL.md` Entry Point

This file serves as the "System Prompt" or "Context Anchor" for the skill. It tells the agent what this folder is and how to use it.

```markdown
# ASDLC Agentic Software Development Life Cycle - Skill Definition

## Purpose
This directory contains the authoritative Knowledge Base for the ASDLC. Use these files to guide software development decisions, strictly adhering to the Patterns and Practices defined herein.

## Capabilities
- **Concepts**: Fundamental theories (e.g., Context Engineering, Levels of Autonomy).
- **Patterns**: Reusable architectural or process solutions (e.g., The Spec, Agent Constitution).
- **Practices**: Concrete, actionable workflows (e.g., AGENTS.md, Micro-Commits).

## Instructions for the Agent
1.  **Lookup First**: Before answering architectural questions, check `concepts/` or `patterns/` for relevant standards.
2.  **Cite Sources**: When recommending a practice, link to the specific file in `practices/`.
3.  **Follow the Spec**: If a user asks to "implement the Spec", refer to `patterns/the-spec.md`.

## Index
- [Concepts Index](./concepts/index.md)
- [Patterns Index](./patterns/index.md)
- [Practices Index](./practices/index.md)
```

### Constraints & Requirements

1.  **Static Only**: No server, no API. Just files.
2.  **Relative Linking**: All links between files MUST be relative file paths (ending in `.md`) so they work in a local text editor or agent context.
3.  **Filtering**: strictly enforce the same filtering as the MCP server:
    *   **Include**: Status `Live` and `Experimental`
    *   **Exclude**: Status `Draft`, `Proposed`, `Deprecated`
4.  **Metadata Preservation**: Frontmatter should be preserved (or mapped to a readable format) as it contains critical context like `status` and `maturity`.

## Contract

### Definition of Done

- [ ] `scripts/build-skill.ts` is implemented.
- [ ] Build script correctly filters articles by status.
- [ ] Build script rewrites Astro-style links (`/concepts/foo`) to relative Markdown links (`../concepts/foo.md`).
- [ ] `SKILL.md` is generated with a dynamic index of included content.
- [ ] `npm run build` generates `dist/asdlc-skill.zip`.
- [ ] Manual test: Unzip into a fresh project, open with Cursor/VSCode, and verify links work.
- [ ] Manual test: Ask an agent "What is Context Engineering?" while referencing the `SKILL.md` and verify it finds the answer.

### Scenarios

**Scenario: User adds skill to project**
- Given: User downloads `asdlc-skill.zip`
- When: User unzips it to `.asdlc/` in their project root
- And: User tells Agent "Read .asdlc/SKILL.md and help me write a Spec"
- Then: Agent reads `SKILL.md`, follows the link to `patterns/the-spec.md`, and guides the user according to the official pattern.

**Scenario: Offline Usage**
- Given: User is on a plane with no internet
- When: User references the local skill files
- Then: Agent still has full access to the Knowledge Base.

## Implementation Details

### Link rewriting logic
Regex or AST transformation to find `[text](/category/slug)` and replace with `[text](../category/slug.md)`.

### Artifact Generation
Use `archiver` or `zip` CLI command to package the output directory.
