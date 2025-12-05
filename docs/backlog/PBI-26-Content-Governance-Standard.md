# PBI-26: Content Governance Standard (Frontmatter Spec)

## Goal
Define the Frontmatter Schema and Content Governance standard for the ASDLC repository to standardize how metadata is tracked programmatically.

## Context
We need to standardize how we track metadata programmatically to enable features like "Deprecation Warnings" or "Stale Content" flags in the future.

## Requirements
- **Target Artifact**: `content/meta/governance.md`
- **Role**: DevOps Engineer / Content Ops
- **Content**:
    - **Frontmatter Schema**: Define using standard types (String, Date, Enum).
        - **Required fields**: `title`, `id` (slug), `type` (concept|pattern|practice), `status` (enum), `maturity` (enum).
        - **Optional fields**: `superseded_by` (slug), `related_ids` (list of slugs).
    - **Deprecation Rule**:
        - If `status: Deprecated`, then `superseded_by` IS REQUIRED.
        - Content body should be retained for historical context but marked with a warning callout.
    - **Experimental Rule**:
        - Must include a "Stability Warning" callout at the top of the body.
- **Format**: Markdown specification document.

## Implementation Plan
- [ ] Create `content/meta/governance.md` with the schema and rules.

## Verification
- **File Existence**: Verify `content/meta/governance.md` exists.
- **Content Check**: Ensure schema, deprecation rules, and experimental rules are defined as requested.
