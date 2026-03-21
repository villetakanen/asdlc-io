# PBI-74: Content — Migrate 5 Articles with Overlong Titles (Status: Done)

## 1. Directive
Split the existing long `title` values into a short `title` (UX/card/list) and `longTitle` (SEO/H1/social) for the 5 articles that exceed the 40-character constraint.

## 2. Scope
- 5 content markdown files (frontmatter only, no body changes).

## 3. Dependencies
- PBI-71 (schema must accept `longTitle` before these frontmatter changes validate).
- **Recommended:** Ship atomically with PBI-71 to avoid a broken build from the max(40) constraint.

## 4. Changes Required

| File | Current `title` | Chars | New `title` | New `longTitle` |
|------|----------------|-------|-------------|-----------------|
| `src/content/concepts/ooda-loop.md` | OODA Loop for AI Agents: Observe-Orient-Decide-Act Cycle | 56 | OODA Loop | (current title) |
| `src/content/practices/agent-personas.md` | Agent Personas: Session-Scoped Roles for AI Agents | 51 | Agent Personas | (current title) |
| `src/content/concepts/levels-of-autonomy.md` | Levels of Autonomy: L1-L5 AI Agent Autonomy Scale | 49 | Levels of Autonomy | (current title) |
| `src/content/practices/agents-md-spec.md` | AGENTS.md Specification: A Research-Backed Guide | 48 | AGENTS.md Specification | (current title) |
| `src/content/concepts/agentic-sdlc.md` | Agentic SDLC: The Software Factory Framework | 45 | Agentic SDLC | (current title) |

For each file:
- [ ] Move current `title` value to `longTitle`
- [ ] Set `title` to the short, layout-friendly version (before the colon)

## 5. Verification
- [ ] `pnpm check` passes (all titles <= 40 chars).
- [ ] `pnpm build` succeeds.
- [ ] No article loses its SEO title — `longTitle` preserves the original.
- [ ] Card/list views show the new short titles (visual spot-check).

## 6. Notes
- All 5 candidates follow a "Topic: Subtitle" pattern, making the split point natural.
- The `agentic-sdlc.md` title is 45 chars (just over the limit). The spec originally listed it as 40 but the actual string including "The Software Factory Framework" pushes it over.
- Remaining ~59 articles have titles <= 40 chars and need no changes.

## 7. Blocks
- None (leaf PBI).
