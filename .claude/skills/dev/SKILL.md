---
name: dev
description: "Implement features, fix bugs, and keep the codebase healthy and maintainable. Works from a defined PBI, issue, or task description."
argument-hint: "[PBI number, Linear issue ID, or task description]"
version: 1.0.0
---

# Dev — implement features and fix bugs

Implement features, fix bugs, and ensure the codebase remains healthy and maintainable.

## Boundaries

- **In scope:** application code, tests, and the validation loop that proves a change works.
- **Out of scope:** authoring specs (`spec`), creating Linear issues (`lead`), reviewing the changeset (`critic`), committing and pushing (`ship`).

## Inputs

Work from a defined Product Backlog Item with acceptance criteria whenever one exists. Before writing code, check Linear for the assigned issue and `specs/` for the spec covering the feature domain.

## Steps

1. **Load the contract.** Read the PBI or task description, the relevant spec, and the code in the feature area.
2. **Implement.** Make the change, staying inside the acceptance criteria.
3. **Validate.** Run the checks below; all must pass before the work is complete.
4. **Record progress.** Update the Linear issue status and add a comment with completion notes.

## Standards

- **Type safety:** use TypeScript strictly.
- **Component imports:** explicitly import every component used in `.astro` files — Astro has no auto-imports.
- **Content collections:** use the modern `loader: glob()` form.
- **Styles:** link CSS through the build, never `<link href="/src/...">`.

## Hard constraints

- NEVER use `any` types.
- NEVER use the legacy `type: 'content'` for collections.
- NEVER output code with broken imports.
- NEVER link CSS via `<link href="/src/...">`.

## Sub-agent model policy

When parallelizing work into sub-agents, use the cheapest model that fits:

- **haiku** — file search, grep, reading files, listing issues, gathering context.
- **sonnet** — code edits, writing content, running validation commands, updating Linear issues.
- **opus** — ask the user for confirmation before spawning one, and explain why the sub-task needs it.

Set the `model` parameter on each sub-agent call accordingly. Default to **sonnet** when unsure.

## Validation

- `pnpm check` — type validation
- `pnpm lint` — Biome checks
- `pnpm test:run` — unit tests

## Task

$ARGUMENTS

