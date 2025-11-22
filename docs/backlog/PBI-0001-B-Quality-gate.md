Context: Project Initialization Verification

Role: Lead QA Engineer / SRE
Mission: Verify the integrity, configuration, and tooling of the newly initialized asdlc.io repository.
Philosophy: "Trust but Verify." We assume the previous agent may have hallucinated or skipped steps. We prove correctness through rigorous checks.

Constraints

Scope: Verification only. Do not rewrite code unless a critical configuration is missing (fix-forward).

Standards: Strict adherence to the Agentic SDLC protocols defined in AGENTS.md and the bootstrapping spec.

Reporting: Output a structured "Pass/Fail" report for each checkpoint.

Version Tolerance: The bootstrapping prompt contained specific version numbers (e.g., "astro": "^4.15.0") which may be hallucinations or outdated. Treat these as indicative baselines. If package.json contains newer or different compatible versions, this is ACCEPTABLE (PASS) provided the build and lint commands succeed.

Execution Steps

Step 1: Structural Audit

Verify the existence of the following critical files. If any are missing, flag them as CRITICAL FAIL.

package.json

biome.json

lefthook.yml

.commitlintrc.json

src/content/config.ts

AGENTS.md (The Constitution)

.vscode/settings.json

src/styles/global.css

Step 2: Configuration Deep Dive

Inspect file contents for specific enforcement strings.

package.json:

Check for strict package manager: "packageManager": "pnpm@...".

Check for strict linting script: "lint": "biome check --write .".

Note: Do not fail on version mismatches for dependencies (e.g., Astro v5 vs v4) as long as scripts exist.

biome.json:

Check Astro ignore: "ignore": [..., ".astro", ...] in the main block.

Check Astro overrides: Must contain an "overrides" block specifically for *.astro files (disabling unused variable checks).

Check Globals: Must contain "globals": ["Astro", "Fragment"].

src/content/config.ts:

Verify defineCollection and z are imported.

Verify concepts and patterns collections are exported.

AGENTS.md:

Verify the "No Vibe Coding" directive is present.

Step 3: Runtime Verification

Execute the following commands in order. Stop if any fail.

pnpm install (Verify pnpm-lock.yaml is generated and consistent).

pnpm run lint (Verify Biome accepts the config without throwing errors on .astro files).

pnpm run check (Verify Astro types).

pnpm run build (Verify the build pipeline completes).

Step 4: Report Generation

Output a markdown summary in the following format:

## Initialization Audit Report
| Checkpoint | Status | Notes |
| :--- | :--- | :--- |
| File Structure | [PASS/FAIL] | (List missing files if any) |
| Strict Configs | [PASS/FAIL] | (Note specific missing keys like 'packageManager') |
| Runtime: Lint | [PASS/FAIL] | (Paste error output if fail) |
| Runtime: Build | [PASS/FAIL] | (Paste error output if fail) |

### Corrective Actions
(List any fixes applied or required to bring the repo to spec)
