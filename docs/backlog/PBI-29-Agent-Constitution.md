# PBI-29: Agent Constitution

## Goal
Create a new page to explain the Pattern of semantic steering, distinct from the Practice of the AGENTS.md file specification.

## Context
We need a page to explain the Pattern of semantic steering, distinct from the Practice of the AGENTS.md file specification. This page defines the strategy of using probabilistic rules to steer agent behavior. It is the architectural counterpart to the AGENTS.md spec.

## Requirements
- **Target Artifact**: `content/patterns/agent-constitution.md`
- **Role**: AI Architect
- **Content**:
    - **Define the Pattern**: Explain that an Agent Constitution is a set of "Prime Directives" injected into the context window to align intent.
    - **Contrast with Gates**: Use the "Driver Training vs. Brakes" analogy.
    - **Cross-Link**: Explicitly state: "For the standard implementation of this pattern, see the AGENTS.md Specification."
    - **Maturity**: Mark as `Experimental`.

## Implementation Plan
- [ ] Create `content/patterns/agent-constitution.md` with the definition and analogies.

## Verification
- **File Existence**: Verify `content/patterns/agent-constitution.md` exists.
- **Content Check**: Verify the "Driver Training vs. Brakes" analogy and cross-link are present.
- **Maturity Check**: Verify `maturity: Experimental` in frontmatter.
