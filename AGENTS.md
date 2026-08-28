# AGENTS.md

> Build `asdlc.io`, the definitive knowledge base for Agentic SDLC patterns.
> Content-First (HTML > JS). Strict Type Safety (Zod schemas). Docs-as-Code. No Tailwind.

Full vision: @docs/vision.md | Framework: [Agentic SDLC concept](/concepts/agentic-sdlc)

## Toolchain

| Intent | Command |
|---|---|
| Dev server | `pnpm dev` |
| Build | `pnpm build` |
| Type check | `pnpm check` |
| Lint | `pnpm lint` |
| Unit tests | `pnpm test:run` |
| Render diagrams | `pnpm diagrams` |
| Build MCP index | `pnpm build:mcp-index` |
| Build skill | `pnpm build:skill` |
| MCP preview | `pnpm test:mcp-preview <url>` |
| Lint specs | `pnpm lint:specs` |
| MCP evals | `pnpm evals:mcp` |

Toolchain configs: `astro.config.mjs`, `tsconfig.json`, `biome.json`, `package.json`
Design tokens: `src/styles/ds/tokens.css` | Schema: `src/content/config.ts`

## Judgment Boundaries

### ALWAYS
- Run `pnpm check` before confirming a task is done.
- Explicitly import every component used in `.astro` files (Astro has no auto-imports).
- Content collections: start with h2 (`##`). The h1 is reserved for the layout.
- Mermaid diagrams in published content (`src/content/`, `src/pages/`) use dual representation: code block (source of truth) + `<figure>` with pre-rendered SVG. Run `pnpm diagrams` after editing them. Internal docs, plans, and specs may keep Mermaid source only.
- Cross-references must be bidirectional (if A links B, B must link A).
- Keep all GSC-derived artifacts local — snapshots (`data/gsc/`) *and* curator reports (`reports/curator/`) are gitignored. They quote private search-query data that is never published to this public repo; reports are regenerable via `pnpm curator`. See [ADR 0002](docs/adrs/0002-curator-reports-are-local-artifacts.md).

### ASK FIRST
- Before adding new dependencies.
- Before modifying `src/styles/ds/tokens.css` (immutable design token source).
- Before deleting content files.

## Skills

Invoke via `/command` or `.agents/skills/<name>/SKILL.md`. Full definitions live in skill files.

| Skill | Invocation | Purpose |
|---|---|---|
| assemble | `/assemble` | Dev-Critic loop: implement, review, fix until clean |
| assess | `/assess` | Content review & KB assessment against source material |
| critic | `/critic` | Adversarial code review of changeset against contracts |
| curator | `/curator` | Triage content corpus against GSC snapshot; refresh reports |
| dev | `/dev` | Implementation, bug fixes, validation loop |
| geo-audit | `/geo-audit` | GEO+SEO audit of AI citability, schema, and MCP infrastructure |
| lead | `/lead` | System design, specs, and Linear PBI authoring |
| next-task | `/next-task` | Backlog prioritization by speed/value ratio |
| prep-for-launch | `/prep-for-launch` | PBI-to-pre-flight pipeline with Boeing List HITL clearance gate |
| ship | `/ship` | Quality gates, spec verification, micro-commit, and push |
| spec | `/spec` | Spec authoring, reverse-engineering, and living updates |

### Skill System Governance (ADR 0003)
- **Homes:** Portable (`.agents/skills/<name>/SKILL.md`) and Claude Code (`.claude/skills/<name>/SKILL.md`).
- **Naming:** Task-named, never role-named (no `@Persona` identity framing).
- **Semver:** Every skill's frontmatter carries a `version:` (semver).
- **Variants:** Qualified names with hyphenated suffixes (`<task>-<variant>`, e.g. `assess-opus`) indicate intentional forks.

Content specs: `specs/content-articles/` (shared contract, concept, pattern, practice archetypes).

## Backlog

Items in the backlog are transient and used for short-term planning and task management. Feature intent is encoded in the specs, and contract in the codebase. 

- **Source of truth:** Linear (ASDLC team) via MCP
- **Structure:** Epic → PBI sub-issues. Labels: `PBI`, `Epic`, `spec-ref`
- **Specs stay in repo:** `specs/{feature-domain}/spec.md` — Linear issues link to specs, not replace them
