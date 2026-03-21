# Migration Plan: File-Based Backlog → Linear

**Date:** 2026-03-21
**Status:** Complete

## Context

The ASDLC project currently manages its backlog as markdown files in `docs/backlog/` (45 PBI files, PBI-24 through PBI-70). This was a pragmatic choice — PBIs as files kept everything in the repo and made them directly consumable by AI agents.

The system has served its purpose but is now friction:
- Completed PBIs accumulate as dead files (19+ completed, only 1 open)
- No views, filtering, or prioritization beyond `ls` and `grep`
- Numbering requires manual ceiling checks
- Status lives in the H1 line — not queryable

Moving to Linear gives us structured state management while the MCP integration preserves agent accessibility.

## Migration Scope

**Forward-only cutover.** No legacy PBIs are migrated to Linear. The file-based backlog is archived as-is and all new issues are created in Linear from the point of migration.

Four systems reference `docs/backlog/` and must be updated:

| System | What Changes |
|--------|-------------|
| **Linear MCP** | Add Linear MCP server so agents can read/write issues |
| **Claude Code skills** | Update `/lead`, `/dev`, `/spec` to use Linear instead of file PBIs |
| **Antigravity workflows** | Update any workflow configs that reference backlog files |
| **Constitution (CLAUDE.md)** | Remove `docs/backlog/` references, add Linear as source of truth |

## Phase 1: Add Linear MCP Server

### 1.1 Install Linear MCP

Add Linear's official MCP server to `.claude/settings.local.json`:

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.linear.app/mcp"]
    }
  }
}
```

Uses OAuth 2.1 (interactive auth on first use). No API key needed. See https://linear.app/docs/mcp.

### 1.2 Linear Project Setup

- Create a Linear project (or team) for ASDLC
- Define issue labels that map to current PBI structure:
  - **Type:** PBI, Epic (for index PBIs like PBI-32-36, PBI-37-41)
  - **Status:** Backlog, In Progress, Done, Cancelled
  - **Priority:** maps to PBI dependency order
- Define a custom field or label for `spec-ref` (link to `specs/` path)

### 1.3 Verify Agent Access

- Agent can `list_issues` / `search_issues` for the ASDLC project
- Agent can `create_issue` with title, description, labels
- Agent can `update_issue` to change status

## Phase 2: Update Claude Code Skills

### 2.1 `/lead` skill (`.claude/commands/lead.md`)

**Current:** Writes PBI files to `docs/backlog/PBI-{N}-{Title}.md`
**Target:** Creates Linear issues via MCP

Changes:
- Remove file-output deliverables for PBIs (lines 10-11)
- Replace with: "Create Linear issues via MCP tools"
- Remove PBI numbering logic (line 26: "check `docs/backlog/` for the highest existing number")
- Replace PBI Format section with Linear issue template:
  - Title → issue title
  - Directive → issue description (first paragraph)
  - Scope, Changes Required → description body
  - Verification → checklist in description (or sub-issues)
  - Dependencies → Linear issue links (`blocked by` / `blocks`)
  - Notes → comment or description section
- Keep: Spec file output (`specs/{feature-domain}/spec.md`) — specs stay in repo
- Update Research Phase to reference Linear instead of `docs/backlog/`

### 2.2 `/dev` skill (`.claude/commands/dev.md`)

**Current:** "Check `docs/backlog/` and `specs/` for relevant specs" + "Update the relevant PBI in `docs/backlog/`"
**Target:** Check Linear for assigned issues + update issue status via MCP

Changes:
- Line 6: Replace `docs/backlog/` reference with "Check Linear for assigned issues and `specs/` for relevant specs"
- Line 10: Replace "Update the relevant PBI in `docs/backlog/`" with "Update the Linear issue status and add a comment with completion notes"

### 2.3 `/spec` skill (`.claude/commands/spec.md`)

**Current:** References PBIs in `docs/backlog/` for context loading
**Target:** Fetch PBI context from Linear

Changes:
- Line 37: Replace "read it from `docs/backlog/`" with "fetch it from Linear via MCP"
- Line 43: Replace "Read referenced PBIs" with "Fetch referenced issues from Linear"
- Line 103: Replace "Check if PBIs in `docs/backlog/`" with "Check if Linear issues reference this feature domain"
- Line 133: Update boundary note to reference Linear

### 2.4 `/ship` skill (`.claude/commands/ship.md`)

No changes needed — `/ship` doesn't reference the backlog. It only checks specs and quality gates.

## Phase 3: Update Agent Workflows

Two workflows exist in `.agent/workflows/`:

| Workflow | Status | Action |
|----------|--------|--------|
| `spec-engineer.md` | Already references Linear | Verify issue-fetching instructions still match Linear MCP tool names |
| `assess-content.md` | No backlog references | No changes needed |

Future integration points:
- Workflow that auto-assigns Linear issues to agents
- Workflow that updates Linear issue status on PR merge
- Workflow that checks spec alignment against Linear issue acceptance criteria

## Phase 4: Update Constitution Files

### 4.1 `CLAUDE.md` (project root)

Remove or update these sections:

| Section | Line(s) | Change |
|---------|---------|--------|
| @Lead deliverables | 33-34 | Replace `docs/backlog/` paths with "Linear issues via MCP" |
| @Lead constraints | 37-38 | Update "write PBI files" to "create Linear issues" |
| @Lead guidelines | 43-44 | Update PBI format reference + numbering |
| @Dev guidelines | 74 | Update "Expect PBIs" to reference Linear |
| @Dev guidelines | 78 | Update "Document progress" to reference Linear |
| Directory map | 96 | Remove `backlog: "Open Product Backlog Items (PBIs)"` |
| Scope rule | 237 | Update "Stick to the PBI" (still valid, just source changes) |

### 4.2 Add Linear as external reference

Add to CLAUDE.md section 6 or a new section:

```markdown
## Backlog Management
- **Source of truth:** Linear (ASDLC project)
- **Agent access:** Via Linear MCP server (`list_issues`, `create_issue`, `update_issue`)
- **Specs stay in repo:** `specs/{feature-domain}/spec.md` — Linear issues link to specs, not replace them
```

## Phase 5: Delete Backlog & Update Content Articles

### 5.1 Delete `docs/backlog/`

Delete the entire `docs/backlog/` directory. Git history preserves the record.

### 5.2 Update directory map

Remove `backlog: "Open Product Backlog Items (PBIs)"` from the semantic directory map in CLAUDE.md.

### 5.3 Update knowledge base articles

The PBI articles currently treat repo-based PBIs as a first-class option. Update to position issue trackers (Linear, GitHub Issues, Jira) as the default, with repo-based acknowledged as feasible but not recommended.

| Article | Change |
|---------|--------|
| `src/content/practices/pbi-authoring.md` | Reorder the access methods table (line 45-49): MCP Integration is the default. Repo-Based is "feasible but not recommended for most teams". Add guidance that issue trackers provide queryable state, views, and API access that files don't. |
| `src/content/patterns/the-pbi.md` | Minor: no structural changes needed. The pattern is tool-agnostic. Review for any file-path examples that imply repo-based is standard. |

## Decision Log

| Decision | Options | Chosen | Rationale |
|----------|---------|--------|-----------|
| Linear MCP package | Official, community, custom | **Official** (`mcp-remote` + `linear.app/mcp`) | Hosted by Linear, OAuth 2.1, no API key management |
| Issue structure | 1:1, epics+sub-issues | **1 issue = 1 atomic committable increment** | Aligned with The PBI pattern — same philosophy, better tooling |
| Backlog archive strategy | README, move to archive, delete | **Delete** | Git history is the archive. No dead files. |
| Agent workflows | None, basic, full | **Minimal** | `spec-engineer.md` already uses Linear; `assess-content.md` unaffected |
| Legacy PBI migration | Migrate open PBIs, forward-only | **Forward-only** | Clean break. No legacy backlog moved to Linear. |

## Verification

Migration is complete when:

- [ ] Linear MCP server is configured and agents can CRUD issues
- [ ] `/lead` creates Linear issues instead of PBI files
- [ ] `/dev` reads and updates Linear issues
- [ ] `/spec` fetches PBI context from Linear
- [ ] `CLAUDE.md` no longer references `docs/backlog/` as active
- [ ] `docs/backlog/` deleted
- [ ] `pbi-authoring.md` updated to position issue trackers as default
- [ ] `pnpm check` and `pnpm build` pass (no broken references)
