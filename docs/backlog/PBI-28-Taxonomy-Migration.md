# PBI-28: Taxonomy Migration (Experience Modeling)

## Goal
Migrate and Refactor "Experience Modeling" from Concept to Pattern.

## Context
"Experience Modeling" is currently listed as a Concept. However, because it prescribes a specific architectural topology (Design System as Read-Only Artifact) and methodologies (Pattern A vs Pattern B), it technically qualifies as a Pattern.

## Requirements
- **Target Artifact**: `content/patterns/experience-modeling.md`
- **Role**: Content Strategist
- **Input Content**: Existing `experience-modeling.md` content.
- **Actions**:
    - **Change Type**: Update frontmatter `type` from `concept` to `pattern`.
    - **Refine Intro**: Tweak the definition to emphasize it as an architectural pattern rather than just a phase.
    - **Preserve Content**: Keep the "Context Gates", "Pattern A", and "Pattern B" sections intact.
- **Output**: The full markdown file ready for the `/patterns/` directory.

## Implementation Plan
- [ ] Move `content/concepts/experience-modeling.md` to `content/patterns/experience-modeling.md`.
- [ ] Update the frontmatter and intro in the new file.

## Verification
- **File Location**: Verify the file is in `content/patterns/`.
- **Frontmatter Check**: Verify `type: pattern`.
- **Content Check**: Verify the intro reflects the pattern nature and core sections are intact.
