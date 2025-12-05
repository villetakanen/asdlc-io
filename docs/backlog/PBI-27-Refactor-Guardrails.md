# PBI-27: Refactor guardrails.md (Deprecation Test)

## Goal
Refactor the existing `guardrails.md` file to reflect its Deprecated status and prove the new governance pattern works. This requires schema changes, component updates, and content refactoring.

## Context
`guardrails.md` is marked as Deprecated. We need to update the Zod schema to support the `supersededBy` field, update the `SpecHeader` componentp to display deprecation links, and then apply the pattern to `guardrails.md`.

## Requirements

### Part 1: Schema Update
- **Target Artifact**: `src/content/config.ts`
- **Actions**:
    - Add `supersededBy` field to `articleSchema`:
        - Type: `z.array(z.string()).optional()`
        - Description: Array of internal links (e.g., `['patterns/agents-md-spec', 'concepts/context-gates']`)
    - Field should be optional (only present when `status: "Deprecated"`)

### Part 2: Component Update
- **Target Artifact**: `src/components/SpecHeader.astro`
- **Actions**:
    - Add logic to display `supersededBy` links when `status === "Deprecated"`
    - Format: Display as clickable links in the spec metadata section
    - Location: Add as a new row in the `<dl>` after the Status badge
    - Label: "Superseded By"
    - Hide this row completely if `status` is not "Deprecated" or if `supersededBy` array is empty

### Part 3: Content Refactor
- **Target Artifact**: `src/content/concepts/guardrails.md`
- **Role**: Technical Writer
- **Actions**:
    - **Update Frontmatter**: 
        - Set `status: "Deprecated"`
        - Add `supersededBy: ['concepts/context-gates', 'patterns/agents-md-spec']`
    - **Add Callout**: Add an admonition at the very top of the markdown body:
        ```
        > ⚠️ **Deprecated**: This concept has been superseded by [Context Gates](/concepts/context-gates) and [AGENTS.md Specification](/patterns/agents-md-spec). This page is retained for historical comparison.
        ```
    - **Preserve Content**: Keep the original text but ensure it links clearly to the new terminology.

## Implementation Plan
- [ ] Update `src/content/config.ts` to add `supersededBy` field to `articleSchema`
- [ ] Update `src/components/SpecHeader.astro` to conditionally display superseded-by links
- [ ] Update `src/content/concepts/guardrails.md` with new frontmatter and deprecation callout
- [ ] Run `pnpm check` to verify type safety

## Verification
- **Schema Check**: Verify `articleSchema` includes `supersededBy: z.array(z.string()).optional()`
- **Component Check**: Verify `SpecHeader.astro` displays superseded-by links only when status is "Deprecated"
- **Content Check**: Verify `guardrails.md` has correct frontmatter with `supersededBy` array
- **Visual Check**: Visit `/concepts/guardrails` in dev server and confirm deprecation warning and links appear
- **Build Check**: Run `pnpm check` to ensure no type errors
- **Link Check**: Verify the superseded-by links are clickable and point to correct paths