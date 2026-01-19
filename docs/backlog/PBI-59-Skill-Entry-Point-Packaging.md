# PBI-59: Skill Entry Point & Packaging

## Directive
Finalize the Downloadable Skill by generating the `SKILL.md` entry point and implementing the ZIP packaging. This PBI completes the feature and integrates it into the build pipeline.

**Scope:**
- `scripts/build-skill.ts`
- `package.json`

## Dependencies
- Blocked by: PBI-58
- Must merge before: Deployment

## Context
Ref: `plans/downloadable-skill/spec.md`

The `SKILL.md` file acts as the "index" or "manifest" for the agent. It should list what is available in the bundle.
The final step is to zip the processed directory into a distributable artifact.

**Requirements:**
1.  **SKILL.md**: Generate a root-level markdown file containing:
    -   Description of the skill.
    -   Instructions for the Agent (System Prompt style).
    -   Links to the index files or direct links to top-level content.
2.  **Packaging**: Use `archiver` or `zip` to create `dist/asdlc-skill.zip`.
3.  **CI Integration**: Ensure this script runs during `npm run build` so the artifact is available for the main site to link to.

## Verification
- [ ] `SKILL.md` is generated in the root of the temp directory.
- [ ] `SKILL.md` contains valid relative links to the content content.
- [ ] `npm run build` (or the specific skill build command) produces a valid `dist/asdlc-skill.zip` file.
- [ ] Unzipping the artifact reveals a clean, usable directory structure.
