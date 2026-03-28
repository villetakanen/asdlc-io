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

Toolchain configs: `astro.config.mjs`, `tsconfig.json`, `biome.json`, `package.json`
Design tokens: `src/styles/global.css` | Schema: `src/content/config.ts`

## Judgment Boundaries

### ALWAYS
- Run `pnpm check` before confirming a task is done.
- Explicitly import every component used in `.astro` files (Astro has no auto-imports).
- Content collections: start with h2 (`##`). The h1 is reserved for the layout.
- Mermaid diagrams use dual representation: code block (source of truth) + `<figure>` with pre-rendered SVG. Run `pnpm diagrams` after editing mermaid blocks.
- Cross-references must be bidirectional (if A links B, B must link A).

### ASK FIRST
- Before adding new dependencies.
- Before modifying `src/styles/global.css` (immutable design token source).
- Before deleting content files.

## Personas

Invoke via `/command`. Full definitions live in skill files.

| Persona | Skill | Trigger |
|---|---|---|
| @Lead | `/lead` | System design, specs, planning |
| @Dev | `/dev` | Implementation, bug fixes |
| @Content | `/assess` | Content review, KB assessment |
| @Critic | `/critic` | Adversarial code review |
| @Designer | — | Design system, UI/UX, visual consistency |

Content specs: `specs/content-articles/` (shared contract, concept, pattern, practice archetypes).

## Backlog

- **Source of truth:** Linear (ASDLC team) via MCP
- **Structure:** Epic → PBI sub-issues. Labels: `PBI`, `Epic`, `spec-ref`
- **Specs stay in repo:** `specs/{feature-domain}/spec.md` — Linear issues link to specs, not replace them
