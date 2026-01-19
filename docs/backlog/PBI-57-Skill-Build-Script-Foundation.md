# PBI-57: Skill Build Script Foundation

## Directive
Initialize the `scripts/build-skill.ts` build script and implement the core logic to read ASDLC content and filter it for the Downloadable Skill artifact. This is the first step in creating the `asdlc-skill.zip` bundle.

**Scope:**
- `scripts/build-skill.ts` (NEW)
- `package.json` (Update script definitions if needed)

## Dependencies
- Blocked by: None
- Must merge before: PBI-58

## Context
Ref: `plans/downloadable-skill/spec.md`

We need a script that runs alongside the build process (or independently) to generate the static skill. The first requirement is to read the markdown files from `src/content/{concepts,patterns,practices}` and filter them.

**Filtering Rules:**
- **Include**: Status `Live` and `Experimental`
- **Exclude**: Status `Draft`, `Proposed`, `Deprecated`

## Verification
- [ ] `scripts/build-skill.ts` exists and is executable via `npx tsx` or similar.
- [ ] Script successfully reads all markdown files from `src/content`.
- [ ] Script correctly identifies and logs which files would be included vs. excluded based on frontmatter `status`.
- [ ] Script creates a temporary output directory structure (e.g., `dist_skill_temp/`) matching the source structure (`concepts/`, `patterns/`, `practices/`).
- [ ] Only `Live` and `Experimental` files are copied to the output directory (raw content copy for now).
