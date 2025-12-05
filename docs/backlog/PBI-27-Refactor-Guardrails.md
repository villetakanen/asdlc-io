# PBI-27: Refactor guardrails.md (Deprecation Test)

## Goal
Refactor the existing `guardrails.md` file to reflect its Deprecated status and prove the new governance pattern works.

## Context
`guardrails.md` is marked as Deprecated. We need to update it to match the new governance standard.

## Requirements
- **Target Artifact**: `content/concepts/guardrails.md`
- **Role**: Technical Writer
- **Input Content**: Existing `guardrails.md` content.
- **Actions**:
    - **Update Frontmatter**: Set `status: Deprecated` and `superseded_by: context-gates`.
    - **Add Callout**: Add an admonition at the very top: "⚠️ Deprecated: This concept has been superseded by Context Gates and Agent Constitution. This page is retained for historical comparison."
    - **Preserve Content**: Keep the original text but ensure it links clearly to the new terminology.

## Implementation Plan
- [ ] Update `content/concepts/guardrails.md` with the new frontmatter and callout.

## Verification
- **File Check**: Verify `content/concepts/guardrails.md` has the correct frontmatter and callout.
- **Link Check**: Verify the link to `context-gates` works (or at least points to the correct slug).
