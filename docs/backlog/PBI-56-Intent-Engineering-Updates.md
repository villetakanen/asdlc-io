# PBI-56: Integrate Intent Engineering Framework

## Directive
Integrate insights from Paweł Huryn's "Intent Engineering Framework" into the ASDLC Knowledge Base. This involves defining "Health Metrics" and "Strategic Context" within the Product Requirement Prompt (PRP) and refining constraint taxonomies in Agent Constitution.

**Scope:**
- `src/content/concepts/product-requirement-prompt.md`
- `src/content/patterns/agent-constitution.md`
- `src/content/concepts/levels-of-autonomy.md`

## Dependencies
- Blocked by: None
- Must merge before: None

## Context
Read: `analysis-intent-engineering.md`
- **Health Metrics:** Non-regression constraints (e.g., "Don't increase bundle size").
- **Strategic Context:** Runtime injection of Product Vision (e.g., Trade-offs).
- **Constraints Taxonomy:** Steering (Soft/Prompt) vs. Hard (Orchestration/Hook).

## Verification
- [ ] `product-requirement-prompt.md` includes "Health Metrics" component.
- [ ] `product-requirement-prompt.md` links "Strategic Context" to `product-vision.md`.
- [ ] `agent-constitution.md` distinguishes between "Steering Constraints" and "Hard Constraints".
- [ ] `levels-of-autonomy.md` references 'Proposal-First' as L3 synonym.
