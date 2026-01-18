# PBI-55: Reflect Nick Tune's "Dev Workflows as Code"

## Directive
Update the Knowledge Base to integrate industry validation and implementation patterns from Nick Tune's "Dev Workflows as Code" article. Clarify the distinction between deterministic workflow steps and probabilistic agent actions, and document programmatic enforcement mechanisms.

**Scope:**
- Create `src/content/practices/workflow-as-code.md` (New Practice)
- Update `src/content/patterns/context-gates.md`
- Update `src/content/patterns/ralph-loop.md`
- Update `src/content/patterns/adversarial-code-review.md`
- Update `src/content/concepts/spec-driven-development.md`

## Dependencies
- Blocked by: None
- Must merge before: None

## Context
Read: `https://medium.com/nick-tune-tech-strategy-blog/dev-workflows-as-code-fab70d44b6ab` (Source Article)
- **Key Insight:** "Orchestration logic is mechanical... with real code you get determinism."
- **Key Metaphor:** "Tipsy wobbling" (Context Pollution).
- **Key Mechanism:** Client-side hooks for workflow enforcement.

## Verification
- [ ] `workflow-as-code.md` created with sections on:
    - Moving from prompt to code orchestration
    - TypeScript "Step" abstractions
    - Denial hooks for enforcement
- [ ] `context-gates.md` updated with "Workflow Enforcement" section and "Tipsy Wobbling" metaphor.
- [ ] `ralph-loop.md` updated with TypeScript implementation details (Step types).
- [ ] `adversarial-code-review.md` updated with Programmatic Orchestration (Claude Code SDK) and convention-based internal agent loading.
- [ ] `spec-driven-development.md` updated with Nick Tune's validation of "Determinism over Vibes".
- [ ] All updated articles reference Nick Tune's article in frontmatter.

## Refinement Protocol
If implementation details (e.g., specific SDK calls) are too specific for the patterns, generalize them in the pattern docs and keep the specifics in the new Practice document.
