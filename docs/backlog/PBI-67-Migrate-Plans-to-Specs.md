# PBI-67: Migrate Legacy `plans/` Directory to `specs/`

## 1. Directive
Migrate the project's living specifications from the legacy `plans/` directory to the newly established industry-standard `specs/` directory. Update all repository references, documentation, and agent guidelines to enforce `/specs/` as the canonical location for feature-level functional specifications.

## 2. Scope
- Rename the root `plans/` directory to `specs/` (if any remaining subdirectories exist, though `patterns-index` has already been moved).
- Update `AGENTS.md` to reflect the new directory mapping (`specs` instead of `plans`).
- Update `src/content/practices/living-specs.md` to formally deprecate the `/plans/` path and establish `/specs/` as the standard.
- Update `src/content/patterns/the-spec.md` to reference `/specs/`.
- Search and replace legacy `plans/` references in all other markdown files (e.g., existing PBIs, `AGENTS.md`, and any other content files).

## 3. Dependencies
None.

## 4. Changes Required

### A. Core Documentation Updates

**1. `AGENTS.md`**
- In the "Semantic Directory Mapping" section, replace `plans:` with `specs:` and update the description.
- In the "Lead Developer" persona section, update the `Specs` deliverable path from `plans/{feature-domain}/spec.md` to `specs/{feature-domain}/spec.md`.

**2. `src/content/practices/living-specs.md`**
- Update the "File Structure" section tree block to show `specs/` instead of `plans/`.
- Update the "Conventions" section Location rule.
- Update the "Context Separation" section to explicitly delineate `ARCHITECTURE.md` from `/specs/*/spec.md`.
- Update any git commit examples and code reference examples from `/plans/...` to `/specs/...`.

**3. `src/content/patterns/the-spec.md`**
- Update the separation example block in the "Why Separation Matters" section to show path creation as `specs/notifications/spec.md`.

### B. Global Reference Updates
Perform a global find-and-replace for `plans/` to `specs/` where the context implies the feature specification directory. **Be careful not to replace the word "plans" if used in conversational prose (e.g., "the team plans to...").** 

Target files known to contain path references (from `git grep`) include but are not limited to:
- `.agent/workflows/assess-content.md`
- `.agent/workflows/spec-engineer.md`
- `.claude/commands/dev.md`
- `.claude/commands/lead.md`
- `src/content/patterns/product-vision.md`
- `src/content/practices/constitutional-review-implementation.md`
- `src/content/practices/feature-assembly.md`
- `src/content/practices/pbi-authoring.md`
- `src/pages/getting-started.md`
- Various older `docs/backlog/PBI-*.md` files (update these for historical accuracy).

### C. File System Migration
- Move any remaining feature-domain directories currently sitting in `plans/` over to `specs/`.
- Ensure the `plans/` directory is fully removed after the migration to prevent future confusion.

## 5. Verification
- Run `git grep -in 'plans/'` to ensure no lingering system path references exist. (Manual inspection required to ignore prose usage of the word "plans").
- `pnpm check` and `pnpm lint` must pass.
- `pnpm build` must succeed to ensure no internal Astro links or content collections are broken by the text replacement.

## 6. Notes
The `/plans/` directory was originally named as such for legacy reasons. As the ASDLC framework defines the `Living Specs` practice, enforcing the term "specs" at the directory level strongly reinforces the architectural concept of *Spec-Anchored Development*.

## 7. Blockers
None.
