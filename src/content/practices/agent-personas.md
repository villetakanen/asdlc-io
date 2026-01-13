---
title: "Agent Personas"
description: "A guide on how to add multiple personas to an AGENTS.md file, with examples."
lastUpdated: 2026-01-13
tags: ["agents", "personas", "guide"]
relatedIds: ["patterns/model-routing", "concepts/context-engineering", "practices/agents-md-spec"]
status: "Live"
---

## Definition

Defining clear personas for your agents is crucial for ensuring they understand their role, trigger constraints, and goals. This guide demonstrates how to structure multiple personas within your `AGENTS.md` file.

Personas are a context engineering practice—they scope agent work by defining boundaries and focus, not by role-playing. When combined with [Model Routing](/patterns/model-routing), personas can also specify which computational tool (LLM) to use for each type of work.

For the full specification of the `AGENTS.md` file, see the [AGENTS.md Specification](./agents-md-spec).

## When to Use

**Use this practice when:**
- Your `AGENTS.md` is becoming a monolith of conflicting instructions
- You have distinct workflows (e.g., Coding vs. Writing vs. Architecting)
- You need to support specialized sub-agents with narrow scopes
- You are hitting context window limits with a single generic instruction set

**Skip this practice when:**
- Variable roles are handled purely by "Model Routing" (manual model selection)
- The project is simple enough for a single "General Developer" persona

## How to Add Multiple Personas

You can define multiple personas by specifying triggers, goals, and guidelines for each. This allows different agents (or the same agent in different contexts) to adopt specific behaviors suited for the task at hand.

### Example: Our Internal Personas

Below are the personas we use, serving as a template for your own `AGENTS.md`.

```markdown
### 1.1. Lead Developer / Astro Architect (@Lead)
**Trigger:** When asked about system design, specs, or planning.
* **Goal**: Specify feature requirements, architecture, and required changes. Analyze the project state and plan next steps.
* **Guidelines**
  - **Schema Design:** When creating new content types, immediately define the Zod schema in `src/content/config.ts`.
  - **Routing:** Use Astro's file-based routing. For dynamic docs, use `[...slug].astro` and `getStaticPaths()`.
  - **SEO:** Ensure canonical URLs and Open Graph tags are generated for every new page.
  - **Dev Performace:** Focus on tangible, deliverable outcomes.
  - **Spec driven development:** Always produce clear, concise specifications before handing off to implementation agents.
  - **Planned iterations:** Break down large tasks into manageable PBIs with clear acceptance criteria.

### 1.2. Designer / User Experience Lead (@Designer)
**Trigger:** When asked about Design system UI/UX, design systems, or visual consistency.
* **Goal**: Ensure the design system can be effectively utilized by agents and humans alike.
* **Guidelines**
  - **Design Tokens:** Tokens must be set in `src/styles/tokens.css`. No hardcoded colors or fonts.
  - **Component Consistency:** All components must adhere to the design system documented in `src/pages/resources/design-system.astro`. 
  - **Accessibility:** Ensure all components meet WCAG 2.1 AA standards.
  - **Documentation:** Update the Design System page with any new components or styles introduced.
  - **Experience Modeling Allowed:** Design system components are protected by a commit rule: use \[EM] tag to override the rule.
  
### 1.3. Content Engineer / Technical Writer (@Content)
**Trigger:** When asked to create or update documentation, articles, or knowledge base entries.
* **Goal**: Produce high-quality, structured content that adheres to the project's schema and style guidelines.
* **Guidelines**
  - **Content Structure:** Follow the established folder structure in `src/content/` for concepts
  
### 1.4. Developer / Implementation Agent (@Dev)
**Trigger:** When assigned implementation tasks or bug fixes.
* **Goal**: Implement features, fix bugs, and ensure the codebase remains healthy and maintainable.
* **Guidelines**
  - **Expect PBIs:** Always work from a defined Product Backlog Item (PBI) with clear acceptance criteria, if available.
  - **Type Safety:** Use TypeScript strictly. No `any` types allowed.
  - **Component Imports:** Explicitly import all components used in `.astro` files.
  - **Testing:** Ensure all changes pass `pnpm check` and `pnpm lint`
  - **Document progress:** Update the relevant PBI in `docs/backlog/` with status and notes.md after completing tasks.
```

## Model Routing and Personas

Personas define **what work to do** and **how to scope it**. [Model Routing](/patterns/model-routing) is a separate practice that defines **which computational tool to use**.

### Current State (December 2025)

AI-assisted IDEs (Cursor, Windsurf, Claude Code) do **not** automatically select models based on persona definitions. Model selection is manual.

### Best Practice: Keep Them Separate

**Don't add model profiles to `AGENTS.md`** - It adds noise to the context window without providing automation value.

Instead:
1. **Keep personas focused** on triggers, goals, and guidelines
2. **Use Model Routing separately** - Manually select models based on the task characteristics
3. **Reference the pattern** when deciding which model to use

### Matching Personas to Model Profiles

When you invoke a persona, choose your model based on the work type:

| Persona Type | Typical Work | Recommended Profile |
|---|---|---|
| Lead / Architect | System design, specs, architectural decisions | High Reasoning |
| Developer / Implementation | Code generation, refactoring, tests | High Throughput |
| Documentation Analyst | Legacy code analysis, comprehensive docs | Massive Context |

The workflow:
1. **Identify the persona** needed for your task
2. **Select the appropriate model** manually in your IDE
3. **Invoke the persona** with your prompt

This keeps `AGENTS.md` lean and focused on scoping agent work, while model selection remains a deliberate engineering decision.
