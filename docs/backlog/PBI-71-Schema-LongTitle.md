# PBI-71: Schema — Add `longTitle` + `title` Max Constraint (Status: Done)

## 1. Directive
Bring `articleSchema` in `src/content/config.ts` into alignment with `specs/content-articles/spec.md` by adding the `longTitle` field and enforcing a 40-character max on `title`.

## 2. Scope
- Single file: `src/content/config.ts`
- Two schema field changes, no view or content changes.

## 3. Dependencies
- None. This is the foundation PBI; PBI-72, PBI-73, PBI-74 depend on it.

## 4. Changes Required

- [ ] Add `title` max constraint:
  ```ts
  title: z.string().max(40, "Title must be <= 40 chars for card/list layouts."),
  ```
- [ ] Add `longTitle` field after `title`:
  ```ts
  longTitle: z.string().max(120, "Long title must be <= 120 chars.").optional(),
  ```
- [ ] Update `ArticleData` type export (automatic from `z.infer`, no manual change needed).

## 5. Verification
- [ ] `pnpm check` passes (this will FAIL until PBI-74 migrates the 5 overlong titles — **execute PBI-74 atomically with this PBI or relax the constraint temporarily**).
- [ ] The `longTitle` field is accepted in frontmatter without errors.
- [ ] Articles without `longTitle` continue to build without errors.

## 6. Notes
- **Breaking change warning:** Adding `title.max(40)` will cause `pnpm check` to fail for 5 articles with titles > 40 chars. Two strategies:
  - **Option A (recommended):** Ship PBI-71 + PBI-74 together in one commit so the constraint and the migration land atomically.
  - **Option B:** Add the max constraint in a follow-up after PBI-74 migrates content.
- The spec explicitly states that `longTitle` default-to-title behavior should be resolved at the consumer level (views/scripts), NOT via Zod `.default()`, since Zod cannot reference sibling fields.

## 7. Blocks
- PBI-72 (views), PBI-73 (scripts), PBI-74 (content migration)
