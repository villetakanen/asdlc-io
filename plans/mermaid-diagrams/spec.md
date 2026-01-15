# Feature: Mermaid Diagram Integration

## Blueprint

### Context

Mermaid diagrams are used throughout ASDLC articles to visualize processes, architectures, and relationships. Currently, diagrams use partial design system integration:

**Current State:**
- Node fill colors use `--c-brand` (#f04e30) ✅
- Subgraph/cluster containers use Mermaid's default blue ❌
- No documentation on DS page for mermaid usage ❌

**Problem:**
Subgraph containers (the grouping boxes) default to blue, breaking visual consistency with the Avionics design system.

### Goals

1. **Full Design System Integration** — All mermaid theme variables use Avionics palette tokens
2. **Diagram Documentation** — Add mermaid section to Design System page with usage examples
3. **Consistent Rendering** — All existing and new diagrams render with correct colors

---

## Architecture

### Mermaid Theme Variables

The `mermaid.json` config file controls diagram styling via `themeVariables`. The following variables need mapping to Avionics tokens:

| Mermaid Variable | Current Value | Proposed Value | Design Token |
|:-----------------|:--------------|:---------------|:-------------|
| `primaryColor` | `#f04e30` ✅ | `#f04e30` | `--c-brand` |
| `primaryTextColor` | `#EEEEEE` | `#EEEEEE` | — (light on brand) |
| `primaryBorderColor` | `#f04e30` | `#f04e30` | `--c-brand` |
| `secondaryColor` | (default blue) | `#ebebe6` | `--c-bg-surface` |
| `tertiaryColor` | (default) | `#f4f4f0` | `--c-bg-page` |
| `lineColor` | `#111111` | `#111111` | `--c-text-primary` |
| `textColor` | (default) | `#111111` | `--c-text-primary` |
| `mainBkg` | (default) | `#f04e30` | `--c-brand` (nodes) |
| `clusterBkg` | (default blue) | `#ebebe6` | `--c-bg-surface` (subgraphs) |
| `clusterBorder` | (default) | `#d1d1c7` | `--c-border` |

### File Structure

```
mermaid.json                    # Theme configuration
scripts/generate-diagrams.mjs   # SVG generation script
public/mermaid/                 # Generated SVG output
src/pages/resources/design-system.astro  # DS documentation
```

### Generation Workflow

1. Author writes ```` ```mermaid ```` block in markdown
2. Run `pnpm diagrams` to generate SVGs
3. Script outputs to `public/mermaid/{slug}-fig-{n}.svg`
4. Script adds `<figure>` reference after mermaid block

---

## Proposed Changes

### 1. Update `mermaid.json`

Add missing theme variables for subgraphs and text:

```json
{
  "theme": "base",
  "themeVariables": {
    "primaryColor": "#f04e30",
    "primaryTextColor": "#EEEEEE",
    "primaryBorderColor": "#f04e30",
    "secondaryColor": "#ebebe6",
    "tertiaryColor": "#f4f4f0",
    "lineColor": "#111111",
    "textColor": "#111111",
    "mainBkg": "#f04e30",
    "clusterBkg": "#ebebe6",
    "clusterBorder": "#d1d1c7",
    "edgeLabelBackground": "#f4f4f0",
    "fontFamily": "\"B612 Mono\", monospace"
  },
  "themeCSS": ".edgePath .path { stroke-width: 3px; } .cluster rect { rx: 4px; ry: 4px; }"
}
```

### 2. Add Design System Documentation

Add new section "08. // Diagrams" to `design-system.astro`:

- Document mermaid usage pattern
- Show example flowchart with subgraphs
- Document `pnpm diagrams` workflow
- List available theme variables

### 3. Regenerate Existing Diagrams

After config update, regenerate all existing diagrams to apply new colors.

---

## Contract

### Definition of Done

**Configuration:**
- [ ] `mermaid.json` updated with full Avionics color mapping
- [ ] Subgraph containers use `--c-bg-surface` (#ebebe6)
- [ ] Subgraph borders use `--c-border` (#d1d1c7)
- [ ] Text uses `--c-text-primary` (#111111)

**Documentation:**
- [ ] Design System page has "08. // Diagrams" section
- [ ] Section includes live example flowchart
- [ ] Section documents `pnpm diagrams` workflow
- [ ] Section lists key theme variables

**Verification:**
- [ ] Existing Ralph Loop diagram regenerated with correct colors
- [ ] No blue colors visible in any mermaid diagram
- [ ] `pnpm build` succeeds

### Scenarios

**Scenario: Subgraph uses design system colors**
- Given: A mermaid diagram with `subgraph` blocks
- When: Diagram is generated via `pnpm diagrams`
- Then: Subgraph container background is #ebebe6, border is #d1d1c7

**Scenario: Design system page shows diagram example**
- Given: User navigates to /resources/design-system
- When: Page renders
- Then: Section "08. // Diagrams" displays with working example

---

## Verification Plan

### Automated

1. **Build verification:**
   ```bash
   pnpm check && pnpm build
   ```

### Manual

1. **Visual verification:**
   - Run `pnpm diagrams` to regenerate Ralph Loop diagram
   - Open `public/mermaid/ralph-loop-fig-1.svg` in browser
   - Confirm subgraph boxes are warm grey (#ebebe6), not blue
   - Confirm borders are #d1d1c7

2. **DS page verification:**
   - Run `pnpm dev`
   - Navigate to http://localhost:4321/resources/design-system
   - Scroll to "08. // Diagrams" section
   - Confirm example diagram renders with correct colors

---

## Resources

- [Mermaid Theme Configuration](https://mermaid.js.org/config/theming.html) — Official theming docs
- [tokens.css](file:///Users/ville.takanen/dev/asdlc-io/src/styles/ds/tokens.css) — Design tokens
- [mermaid.json](file:///Users/ville.takanen/dev/asdlc-io/mermaid.json) — Current config
