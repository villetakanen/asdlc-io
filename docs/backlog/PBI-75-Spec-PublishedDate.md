# PBI-75: Spec — Document `publishedDate` in Shared Frontmatter Contract (Status: Done)

## 1. Directive
The `publishedDate` field exists in `articleSchema` (`src/content/config.ts` line 35) but is absent from the Shared Frontmatter Contract in `specs/content-articles/spec.md`. Update the spec to document it.

## 2. Scope
- Single file: `specs/content-articles/spec.md`

## 3. Dependencies
- None. Independent of the longTitle epic; can be shipped anytime.

## 4. Changes Required

- [ ] Add `publishedDate` to the Shared Frontmatter Contract YAML block (after `tags`, before `relatedIds`):
  ```yaml
  publishedDate: 2025-01-15     # Optional. ISO 8601 date. Original publication date (distinct from lastUpdated).
  ```
- [ ] Add a brief note in the contract section explaining the distinction: `publishedDate` records when the article was first published; `lastUpdated` tracks the most recent substantive edit.
- [ ] Review whether any Regression Guardrails need updating (e.g., "Dates must use `z.coerce.date()`" already covers this).

## 5. Verification
- [ ] The spec's YAML example matches the actual schema fields in `config.ts`.
- [ ] No code changes needed — this is spec-only.

## 6. Notes
- `publishedDate` was added to the schema in commit `c46f833` (2026-03-21) but the spec was not updated at that time. This PBI closes the documentation gap.

## 7. Blocks
- None (leaf PBI).
