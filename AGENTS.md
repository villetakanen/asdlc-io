# AGENTS.md: Directives for Autonomous Contributors

**Status:** Active
**Enforcement:** Strict

This file defines the operating protocols for any Large Language Model (LLM), Agent, or Copilot interacting with this repository.

## 1. Core Directives (Global)
* **No "Vibe Coding":** Do not guess types. Do not use `any`. Do not hallucinate imports.
* **Schema First:** Before generating any `.md` or `.mdx` content, you MUST read `src/content/config.ts`. All frontmatter must validate against the Zod schemas defined there.
* **Style:** Adhere to the "Spec-Sheet" aesthetic defined in `src/styles/global.css`. Do not add inline styles or Tailwind classes.

## 2. GitHub Copilot / Cursor Rules
* **Context Awareness:** Always check `.vscode/settings.json` to understand the Biome formatter settings.
* **Commit Protocol:** When generating commit messages, strictly follow Conventional Commits (e.g., `feat:`, `fix:`, `arch:`).
* **Reference:** [GitHub Copilot Best Practices](https://docs.github.com/en/copilot)

## 3. Gemini / Vertex Agent Rules
* **Reasoning Traces:** When proposing architectural changes, you must provide a `<thinking>` block explaining *why* a pattern was chosen before outputting code.
* **Context Window:** Prioritize `src/content/config.ts` and `AGENTS.md` in your context window. Drop `node_modules` or build artifacts.
* **Reference:** [Google Cloud Vertex AI Agent Design](https://cloud.google.com/vertex-ai/docs/generative-ai/agent-design)