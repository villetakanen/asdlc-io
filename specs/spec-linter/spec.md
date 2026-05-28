---
title: "Spec Linter — Make Specs Machine-Checkable Parts"
status: "draft"
owner: "Ville Takanen"
archetype: "feature"
created: "2026-05-22"
tags: []
---

# Feature: Spec Linter — Make Specs Machine-Checkable Parts

## Blueprint

### Context

`asdlc.io` declares "Determinism > Vibes" as a core pillar (`docs/vision.md` §4.II). Content collections enforce that pillar via Zod schemas in `src/content/config.ts`. Specs do not — every file under `specs/**/spec.md` is freeform markdown today. The only convention is "start with `# Feature:`", and it is enforced socially.

Consequences:

- New specs drift in shape (some have `Definition of Done`, some don't; some link a Linear PBI, some don't).
- Agents writing or reviewing specs (`@Lead`, `@Critic`) cannot rely on a contract — they must re-discover convention each time.
- The handoff `Linear PBI ↔ spec file` is implicit; broken links are invisible until someone notices.
- Specs are the *jig* of the agent factory (`docs/vision.md` §4.II "Standardized Parts"). A jig you cannot measure is not a jig.

This spec defines a minimal frontmatter schema for `specs/**/spec.md` files and a lint script that enforces it. The goal is **schema rigor for the planning station**, mirroring what `src/content/config.ts` provides for the publishing station.

**Consumers:** `@Lead` (writes specs), `@Critic` (reviews them), `@Dev` (consumes them), CI / lefthook (enforces them), humans grepping by status.

**Out of scope for v1:**

- Linting prose quality (acceptance-criteria phrasing, completeness of `Definition of Done`). That is `@Critic`'s job, not a script's.
- Validating body section headings (`### Context`, `### Architecture`, etc.). Soft convention for now; revisit if drift becomes painful.
- Generating Linear issues from specs, or vice-versa. Bidirectional sync is a separate concern.
- Linting `specs/content-articles/*.md` archetype files — those are templates, not specs.

### Architecture

**Schema location:** Inlined inside `scripts/lint-specs.mjs`. Specs are project-internal metadata with a single consumer (the linter); a separate `.ts` schema file would force a TS-loader hop in the script for no callers. Revisit if a second consumer (e.g. a docs generator) appears.

```ts
import { z } from "astro/zod";

export const SpecStatus = z.enum(["draft", "approved", "shipped", "archived"]);

export const SpecFrontmatter = z.object({
  title: z.string().min(3),                      // human-readable; matches the H1 (with optional "Feature: " / "Spec: " prefix stripped)
  status: SpecStatus,
  owner: z.string().min(1),                      // GitHub handle or display name
  linear: z.string().regex(/^[A-Z]+-\d+$/).optional(),  // e.g. "ASDLC-123"; optional while backlog catches up
  archetype: z.enum(["feature", "infra", "content", "process"]).default("feature"),
  created: z.coerce.date(),
  shipped: z.coerce.date().optional(),           // required when status === "shipped"
  tags: z.array(z.string()).default([]),
}).refine(
  (v) => v.status !== "shipped" || v.shipped !== undefined,
  { message: "shipped status requires a `shipped:` date", path: ["shipped"] },
);

export type SpecFrontmatter = z.infer<typeof SpecFrontmatter>;
```

**Linter:** `scripts/lint-specs.mjs`

Walks `specs/**/spec.md` (and `specs/**/**/spec.md` for the nested case like `specs/design-system/isolated-views/spec.md`), excluding `specs/content-articles/` (templates, not specs).

For each file it:

1. Parses frontmatter with `gray-matter` (already a dependency).
2. Validates against the Zod schema; collects errors.
3. Verifies the file body starts with `# Feature: ` and the H1 text matches `frontmatter.title`.
4. If `linear` is set, verifies the issue key shape only (does not hit Linear API — that would make the linter network-dependent and slow). A separate optional command can do the live check.

Output: human-readable error block per failing spec, exit `1` if any failure. Exit `0` and one-line summary on success (`✓ 18 specs validated`).

**Retrofit:** all existing spec files get frontmatter added in the same PR. For pre-existing specs whose status is unclear, default to `status: shipped` if the feature appears in `src/` (heuristic: the spec directory name resolves to working code) and `status: draft` otherwise. The retrofit is mechanical, not editorial — values can be corrected later. The `created:` date is set from `git log --diff-filter=A --follow --format=%aI -- <file> | tail -1` (commit that added the file).

**Wiring:**

- `package.json`: `"lint:specs": "node scripts/lint-specs.mjs"` and folded into the existing `check` target as `"check": "astro check && node scripts/lint-specs.mjs"`. This makes spec lint part of the canonical check command surfaced in `AGENTS.md`.
- `lefthook.yml` pre-commit: new entry `spec-lint` with `glob: "specs/**/*.md"` running the script. Cheap, runs only when specs change.

### Definition of Done

- `scripts/lint-specs.mjs` exists with the Zod schema inlined, runs on `pnpm lint:specs`, and exits non-zero when any spec is invalid.
- Every file matched by `specs/**/spec.md` (excluding `specs/content-articles/`) has valid frontmatter. Running `pnpm lint:specs` exits `0`.
- `pnpm check` runs the spec linter as part of its normal flow.
- `lefthook.yml` has a `spec-lint` entry under `pre-commit`.
- `AGENTS.md` "Toolchain" table gains a `Lint specs` row pointing at `pnpm lint:specs`.
- This spec (`specs/spec-linter/spec.md`) is one of the validated files (it gets the new frontmatter applied to itself — the linter eats its own output).

### Constraints

- No new runtime dependencies. `zod` is already transitively present via `astro`; `gray-matter` is already a dep.
- Linter must run in under 1s on the current spec set (~20 files). It is a pre-commit hook; slowness will get bypassed.
- No network calls. The optional Linear-validation mode is a separate script, not the default linter.
- The linter must not touch file contents. It is read-only.

### Open Questions

- **Should `status: approved` require a `linear:` key?** Argument for: approval is operationalized by a tracked ticket. Argument against: not every approved spec has a PBI yet. Leaning toward *yes, enforce once 80% of existing specs have a key*; for v1 keep it optional and revisit.
- **`archetype: process` overlap with `docs/`** — some specs (e.g. this one) describe process/infra, not user-facing features. Resolved by including `archetype` in the schema; rethink if `process` becomes the majority bucket (would suggest a sibling `processes/` dir).

### Future work

- Optional live-Linear validation script (`pnpm lint:specs --check-linear`) that uses the Linear MCP to confirm referenced issues exist and are not `Cancelled`.
- Bidirectional check: a Linear issue with `spec-ref` label must point at a real spec file.
- Auto-generate `specs/INDEX.md` from frontmatter (replace any current hand-maintained index).
- Lint archetype-specific extra fields once `archetype: content` specs land (e.g., require a `collection:` key).
