---
name: spec
description: "Create, reverse-engineer, or update living feature specs following the spec-anchored methodology."
argument-hint: "[feature description, 'reverse <path>', or 'update <domain>']"
version: 1.0.0
---

# Spec — create, reverse, and update living specs

Create, reverse-engineer, and update living feature specifications. Specs are the permanent source of truth for a feature's architectural intent; code is the source of truth for execution logic. Operate at the **spec-anchored** maturity level.

## Boundaries

- DOES read source code extensively
- DOES create and update files in `specs/`
- Does NOT write implementation code (`dev`)
- Does NOT modify source code outside `specs/`
- Does NOT run build, lint, or test commands (`ship`)
- Does NOT create issues (`lead`), but may suggest PBI breakdowns

## Mode detection

Determine the mode from the task input:

1. **Create** (default) — write a new spec from a feature description, requirements, or issue reference
2. **Reverse** — `reverse <feature-domain>` or `reverse <file-paths>` — reverse-engineer a spec from existing code
3. **Update** — `update <feature-domain>` — update an existing spec to reflect current reality

## Pipeline

### Step 1 — Context loading

1. Check for `specs/TEMPLATE.md` — if it exists, use it as the base template for new specs
2. Read `AGENTS.md` and `ARCHITECTURE.md` if they exist (global project context)
3. Load the project's own spec doctrine:
   - `src/content/practices/living-specs.md` — spec maintenance methodology
   - `src/content/patterns/the-spec.md` — what a spec IS, structurally
   - `src/content/concepts/spec-driven-development.md` — SDD maturity levels
   - `src/content/config.ts` — data schemas
4. If updating, read `specs/{feature-domain}/spec.md`
5. If an issue reference was provided and an issue tracker MCP is available (Linear, for this project), fetch it

### Step 2 — Research

**Create:**
- Read referenced issues or requirements
- Explore source code in the feature area
- Identify API contracts, data models, dependency directions, integration points
- Check `specs/` for related specs that should be cross-referenced

**Reverse:**
- Read all source files in the feature area systematically
- Trace data flow, imports, dependencies
- Identify API contracts, schemas, error handling, edge cases
- Look for existing tests — these encode unstated contracts
- Reconstruct architectural intent from implementation patterns

**Update:**
- Read the existing spec
- Review the git diff on the feature area to see what changed
- Identify stale sections
- Check for new constraints the spec doesn't capture

### Step 3 — Author

Write the spec to `specs/{feature-domain}/spec.md`.

Use `specs/TEMPLATE.md` as the base if it exists. Otherwise use:

````markdown
# Feature: [Feature Name]

## Blueprint

### Context
[1-2 paragraphs: Why does this feature exist? What problem does it solve?]

### Architecture
- **API Contracts:**
  - `POST /api/v1/[endpoint]` — [Description, request/response shapes]
  - `GET /api/v1/[endpoint]/:id` — [Description]
- **Data Models:** Defined in `[path/to/types]`, validated by `[path/to/schema]`
- **Dependencies:**
  - Depends on: [services, libraries, external APIs]
  - Depended on by: [downstream consumers]
- **Constraints:** [Security, compliance, or architectural boundaries stated as
  facts. Only include rules not already captured by the architecture above.]

## Contract

### Definition of Done
- [ ] [Observable, measurable success criterion]
- [ ] [Each must be independently verifiable by CI or a reviewer]

### Regression Guardrails
- [Invariant that must never break, across all future changes]

### Scenarios
```gherkin
Scenario: [Descriptive name]
  Given [Precondition]
  When [Action]
  Then [Expected outcome]
```
````

**Authoring rules:**

- **State constraints positively.** Do not write an "Anti-Patterns" section. Telling an agent what NOT to do puts the wrong approach in its context window. "All real-time updates use WebSocket" is better than "Don't use polling." Security and compliance rules go under Constraints as facts, not warnings.
- **Let Gherkin absorb failure modes.** Write scenarios for edge cases instead of anti-pattern lists. `Then the system does NOT store credentials in localStorage` is a verifiable contract.
- **Use file paths, not descriptions.** "`src/types/User.ts`" is actionable. "The user model" is ambiguous.
- **Code illustrates, never transcribes.** A code block must convey intent (an example algorithm or pseudocode), not mirror the implementation. No real symbol names, `import` lines, or exact serialization — those drift on the next refactor. If a block would need editing on a pure refactor with no contract change, replace it with a file-path reference. See the Copy-Paste Codebase anti-pattern in `src/content/practices/living-specs.md`.
- **Match depth to complexity.** Simple features get simple specs. Omit sections that add no information.
- **Assume engineering competence.** Document project-specific constraints, not general knowledge.

### Step 4 — Cross-reference

- Check `specs/` for related specs that should link to this one
- Ensure bidirectional references where features depend on each other
- Verify that file paths named in the spec actually exist (reverse/update modes)

### Step 5 — Validate

- [ ] Every Definition of Done item is independently verifiable
- [ ] Scenarios cover the happy path, at least one error case, and edge cases
- [ ] No "Anti-Patterns" section — constraints are stated positively
- [ ] Architecture references specific file paths
- [ ] Spec depth matches feature complexity
- [ ] If updating: stale sections marked `[DEPRECATED yyyy-mm-dd]` with rationale, not deleted

### Step 6 — Reduction pass

Before finishing, subtract. Remove anything a reader could confirm by opening the code — transcribed snippets, real symbol names, field-by-field serialization — and replace each with a file-path reference. Ask of every code block: *does this illustrate intent, or mirror the implementation?* In reverse and update mode especially, a spec that **grew** is a red flag: reconciliation should usually make a spec smaller.

### Step 7 — Template offer

If `specs/TEMPLATE.md` does not exist, offer to save it for future consistency.

## Principles

- **Spec-anchored, not spec-as-source.** The spec owns intent and contracts. Code owns execution logic.
- **Refinement cycle.** Specs are hypotheses. Implementation reveals unknowns. Update the spec in the same commit as the code that revealed them.
- **Same-commit rule.** If code changes behavior, the spec update ships in the same commit.
- **Deprecation over deletion.** Mark outdated sections `[DEPRECATED]` with rationale.
- **Positive constraints.** State what the system does, not what it shouldn't. Gherkin absorbs failure modes.
- **Code illustrates, never transcribes.** Example algorithms and pseudocode are welcome; copies of the real implementation are not — they drift. Replace transcription with file-path references.

## Task

$ARGUMENTS

