# 3. Skills: per-skill homes, semver, task-named, agent-converted

Date: 2026-07-08

## Status

Draft

> Draft pending owner approval. Records the direction agreed while triaging
> [AL-86](https://linear.app/asdlc/issue/AL-86); to be promoted to Accepted once
> validated in practice. This ADR is the blocking decision for the persona-
> deprecation epic ([AL-85](https://linear.app/asdlc/issue/AL-85)) — its
> migration PBIs (AL-87/88/89) should reference it.

## Context

Skill/persona definitions live in three parallel trees with no source of truth:

- `.claude/commands/` — the old slash-command form (`spec.md`, `dev.md`, …).
- `.claude/skills/` — Claude Code's native skills.
- `.agents/skills/` — the portable, tool-agnostic form (`<name>/SKILL.md`).

The same skill is duplicated across trees, and copies drift because nothing keeps
them in sync. This is the failure the project's own doctrine (`Determinism > Vibes`,
schema-first) warns against — applied here to our own tooling rather than the
knowledge base.

Four facts shape the decision — none of them derivable from the current files,
which are relics of different eras and not a representative sample:

1. **Symlink and direct copy don't work.** The portable and Claude formats differ
   in frontmatter (e.g. portable carries `name:`; Claude derives the invocation
   name from the filename) and in harness-specific tokens (Claude's `$ARGUMENTS`
   vs. neutral phrasing). A shared file breaks on these differences.

2. **Claude Code is a moving target.** It extends and diverges from the portable
   convention in ways that are under-documented and change over time. A static,
   hardcoded transform written against today's Claude format rots as Claude drifts.
   In multiple multi-agent projects, asking an agent to *reverse* a skill between
   portable and Claude has produced good results precisely because the agent adapts
   to the harness's current conventions at conversion time.

3. **Not every skill needs to exist in both homes.** Presence is per-skill: `spec`
   is used in both; `ship` is mostly portable; others are single-home. A blanket
   "one canonical source, generate the rest everywhere" rule is wrong.

4. **Some divergence is intentional, not drift.** Where a skill must behave
   differently on a given harness (e.g. an Opus-specific variant on Claude Code),
   that difference is deliberate. A converter that blindly regenerates would destroy
   intent. Intentional variants must be distinguishable from rot *by construction*,
   so the converter never has to guess.

Separately, `.claude/commands/` is deprecated — that part is already settled.

## Decision

Adopt a **per-skill** model governed by five rules.

### 1. Portable is the default home; homes are declared per skill

`.agents/skills/<name>/SKILL.md` is the portable home and the default source. Each
skill declares its home(s) and sync policy — one of:

- **single-home** — lives in one tree only (e.g. `ship`, portable-only).
- **mirrored** — lives in both, kept equivalent by conversion (e.g. `spec`).
- **variant** — a harness/model-specific fork that stands alone (see rule 4).

### 2. Skills carry semver

Every skill's frontmatter carries a `version:` (semver). The version is the drift
signal: if portable `assess` is `1.3.0` and Claude `assess` is `1.1.0`, the Claude
mirror is stale and must be re-converted. No deep-diffing needed to detect drift.

### 3. Name by task, not role; suffix only for intentional variants

- Base name = the **task** (`spec`, `ship`, `assess`) — never the **role**
  (`spec-engineer`, `@Lead`). Role-named skills are legacy; this rule is the
  AL-85 persona-deprecation doctrine expressed in filenames.
- A qualified name (`assess-opus`) marks an **intentional variant** — the suffix
  states the axis of difference (`-opus` = uses Opus on Claude Code). A suffix
  qualifies a task; it never reintroduces a role.

This is what makes intent legible without guesswork: **same base name across homes
⇒ meant to be equivalent ⇒ any divergence is rot ⇒ convert.** A genuinely different
behavior gets a new suffixed name ⇒ intentional, standalone, never synced against
the base.

### 4. Mirrored skills sync via agent conversion, not symlink or static script

When a mirrored skill changes, an agent converts it to the other home's format
(portable ↔ Claude), adapting to that harness's current conventions. The conversion
runs on change (mechanism — hook vs. `pnpm sync:skills` vs. CI — to be pinned during
implementation). Generated output is committed so every conversion is a reviewable
diff; a human reviews the diff before it lands. Variant and single-home skills are
never touched by the converter.

### 5. Retire `.claude/commands/`

The deprecated slash-command tree is removed. Slash-command invocation (`/spec`,
`/ship`, …) is preserved via the Claude-native skills in `.claude/skills/`.

### Worked example: `spec-engineer` → `spec`

The portable skill is currently named `spec-engineer` (role framing) while the
Claude side is `spec` (task). Under rule 3 they collapse to the single task name
`spec`, mirrored (rule 1) and agent-synced (rule 4). This is the canonical example
of the naming rule and the first rename the migration performs.

## Consequences

- **One legible source of truth per skill**, with an explicit policy — the
  three-tree ambiguity is resolved without forcing every skill into every home.
- **Intent vs. rot is decided by construction.** The name (base vs. suffix) tells
  the converter what to sync; semver tells it what is stale. No heuristic guessing.
- **A non-deterministic step enters the toolchain.** An agent converter can produce
  varying output. This is accepted deliberately: the target (Claude) is not stable
  enough for a deterministic transform to stay correct. It is contained by
  committing generated output and gating on human diff review; if conversions prove
  flaky, add a conversion eval (analogous to `evals/mcp/`) as the gate.
- **AL-87 needs rescoping.** Its title, "de-duplicate role skills," is wrong for
  intentional variants — de-duplicating `assess`/`assess-opus` would destroy the
  fork. AL-87 becomes: collapse *accidental* duplicates and role-named skills to
  task names; declare *intentional* variants via the suffix convention.
- **New authoring rules to document** once accepted: the `version:` field, the
  task-not-role naming rule, and the `-suffix` variant convention belong in
  `AGENTS.md` / the `agents-md-spec` practice (touches AL-89).
- **Open items for implementation** (not decided here): the exact sync trigger
  (hook / script / CI), where the per-skill policy is recorded (a top-level
  manifest vs. a frontmatter field), and whether conversion is one-way
  (portable → Claude) or bidirectional.
