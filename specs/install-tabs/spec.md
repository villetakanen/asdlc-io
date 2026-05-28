---
title: "`<InstallTabs>` — Zero-JS Multi-Client Install Component"
status: "approved"
owner: "Ville Takanen"
archetype: "feature"
created: "2026-05-22"
tags: []
---

# Feature: `<InstallTabs>` — Zero-JS Multi-Client Install Component

## Blueprint

### Context

asdlc.io needs to surface install instructions for the MCP knowledge-base endpoint across a growing set of agent clients: Claude Code, OpenCode, VS Code, Zed, Antigravity, and others to follow. Each client has a different install shape:

- **Claude Code** — single-line CLI: `claude mcp add --transport http asdlc https://asdlc.io/mcp`
- **OpenCode / Zed / Antigravity** — multi-line JSON config dropped into a settings file
- **VS Code** — settings.json fragment + a path hint

Today the homepage shows only the Claude command (in `src/components/definitions/access-knowledge-base.md`), which under-serves every reader on a different client. A naive fix would stack five fenced blocks vertically; that hurts scanability and loses the implicit "pick yours" UX.

This spec defines a reusable Astro component, `<InstallTabs>`, that renders a tabbed block where every tab's content is in the DOM (for AEO/no-JS visibility) but only one is visible at a time. The component is the canonical primitive for any "install / configure across N clients" surface — used first on the homepage (`access-knowledge-base.md` migration), reusable on `/getting-started`, future agent-specific landing pages, and any pattern article that documents a setup.

**Consumers:** content authors via Astro imports; AEO crawlers and LLMs (which see all tab content in the rendered HTML).

**Out of scope for v1:**

- URL deep-linking to a specific tab (`?install=zed`). Possible later via `:target` or a tiny hydration script; not needed for first ship.
- Copy-to-clipboard button. Nice-to-have; adds JS. Defer.
- Per-tab telemetry. Defer until we have a real analytics need.

### Architecture

**Component:** `src/components/InstallTabs.astro`

**Data source (single source of truth):** `src/data/mcp-clients.ts` exports the canonical client list. The component accepts an explicit `tabs` prop, but defaults to importing from this module when called without one. This matches the "standardized parts" pillar — the supported-clients list is a schema, not duplicated prose.

**Props:**

```ts
interface Props {
  id: string;                       // unique per page; used as radio group name + DOM id prefix
  tabs?: ClientInstall[];           // defaults to the canonical list from src/data/mcp-clients.ts
  heading?: string;                 // optional <h3> rendered above the tablist
}

interface ClientInstall {
  slug: string;                     // "claude-code", "opencode", "zed", "vscode", "antigravity"
  label: string;                    // "Claude Code"
  lang: "bash" | "json" | "toml" | "yaml";  // controls the code-block class for syntax-highlighting
  code: string;                     // single- or multi-line; rendered verbatim inside <pre><code>
  configPath?: string;              // shown as a small caption above the block, e.g. "~/.config/opencode/config.json"
  instruction?: string;             // optional one-line prose, e.g. "Add this entry under `mcpServers`:"
  docsHref?: string;                // optional "→ Official docs" link rendered below the block
}
```

**Schema validation:** `ClientInstall` is also exported as a Zod schema from `src/data/mcp-clients.ts` (matches the project's strict-typing pillar). The component does not re-validate at render — callers either use the canonical list (already validated at module load) or pass typed props.

**Rendering model (zero JS):**

The component renders, inside a single `<fieldset>` scoped to the component's `id`:

1. One `<input type="radio" name="{id}-tabs" id="{id}-tab-{slug}" hidden checked?>` per tab (first tab is `checked`).
2. A `<div role="tablist">` containing one `<label for="{id}-tab-{slug}" role="tab">` per tab.
3. A `<div role="tabpanel">` per tab, each containing optional `configPath` caption, optional `instruction`, the `<pre><code class="language-{lang}">{code}</code></pre>` block, and optional `docsHref` link.

Visibility is controlled by scoped CSS using the sibling-combinator pattern:

```css
input[type="radio"] { display: none; }
[role="tabpanel"] { display: none; }
input:checked + [role="tablist"] + [role="tabpanel"] { display: block; }
/* ...one rule per tab using :nth-of-type or per-slug selectors */
```

Because all panels are present in the DOM, LLMs and AEO crawlers see every install snippet at once — the radio toggle is purely visual.

**Accessibility:**

- Each `<label>` has `role="tab"` and an `aria-controls` pointing to its panel id.
- Each `<input>` has an `aria-label` matching the tab label (since the input itself is visually hidden).
- Keyboard: native radio-group arrow-key navigation works out of the box. No custom JS keyboard handlers.
- The visually-hidden inputs are `hidden`-via-CSS only (not `display: none`) so they remain focusable.

**Styling:** uses tokens from `src/styles/global.css`. No Tailwind, no inline colors. Tab bar uses `--c-border` for the inactive underline and `--c-accent` for the active one. Code block inherits the project's existing `<pre>` styling.

**Canonical client list (v1) — `src/data/mcp-clients.ts`:**

| slug | label | lang | shape |
|---|---|---|---|
| `claude-code` | Claude Code | bash | one-line CLI |
| `opencode` | OpenCode | json | JSON fragment for `mcpServers` |
| `vscode` | VS Code | json | settings.json fragment |
| `zed` | Zed | json | settings.json fragment |
| `antigravity` | Antigravity | json | `.agents/mcp.json` fragment |

The exact `code` strings are TBD — pulled from each client's current official docs at implementation time. Each entry must include a `docsHref` to the upstream documentation so readers can verify.

### Migration

`src/components/definitions/access-knowledge-base.md` currently inlines the Claude-only install block. After this spec ships:

- The component is added.
- `access-knowledge-base.md` is replaced (or wrapped) so the homepage uses `<InstallTabs id="home-install" />` with the default canonical list.
- Because the file currently sits in `components/definitions/`, the simplest migration is to convert it from `.md` to `.astro` (or split — keep the surrounding prose in `.md` and embed `<InstallTabs />` from `index.astro` directly above the static-skill download block).

The migration is in scope for this spec — shipping the component without putting it on the homepage leaves the original problem in place.

### Definition of Done

- `src/components/InstallTabs.astro` exists and renders correctly with default props (no `tabs` argument).
- `src/data/mcp-clients.ts` exports the canonical list of five clients with valid Zod-validated entries (real install strings, real `docsHref` links).
- Tabs work with zero JS: clicking a label switches the visible panel. Verified in `pnpm dev`.
- All five panels are present in the rendered HTML (verify with `curl http://localhost:4321/ | grep -c "language-"`).
- Homepage `access-knowledge-base` surface uses `<InstallTabs>` instead of the inline single-client block. The Claude-specific tab matches the previous content byte-for-byte.
- `pnpm check` passes.
- Keyboard navigation works (arrow keys cycle tabs, Tab key enters/exits the group).

### Constraints

- No JavaScript. No Astro `client:*` directives. The component is fully static.
- No Tailwind. Tokens only.
- No third-party tab library.
- Code blocks render through the project's existing markdown/shiki pipeline if possible; if not feasible inside an `.astro` component, fall back to plain `<pre><code class="language-{lang}">` and accept the styling difference for v1.

### Open Questions

- **Shiki integration inside `.astro`:** Astro's built-in syntax highlighter works on markdown code fences but not on arbitrary `<code>` content. Options: (a) accept unhighlighted code in v1, (b) pre-highlight the strings at module load using the `shiki` package directly. Recommend (a) for v1, file follow-up for (b).
- **Where to put the component on subsequent pages:** out of scope here. This spec only commits to the homepage migration.

### Future work

- URL hash deep-linking (`#install=zed`) via `:target` or 10-line hydration script.
- Copy-to-clipboard button (would require JS).
- Auto-detect the reader's likely client from User-Agent or referrer and pre-select that tab (would require JS or an edge function — not now).
