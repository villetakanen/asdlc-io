---
title: "HowTo structured data for practices"
status: "approved"
owner: "Ville Takanen"
linear: "AL-59"
archetype: "feature"
created: "2026-06-11"
tags: []
---

# Feature: HowTo structured data for practices

## Blueprint

### Context

`practices/*` articles are step-by-step procedural guides — e.g. `adr-authoring` ("Step 1: Check for Existing ADRs" … "Step 7: Set Status and Commit"), `living-specs`, `pbi-authoring`. This is the canonical shape for Schema.org `HowTo`. AI engines and Google preferentially cite `HowTo`-marked content for procedural / "how do I…" queries, but every practice page currently emits only `TechArticle`.

This is item **H4** in `docs/reports/GEO-AUDIT-REPORT.md` and a sub-task of the GEO Optimization Pass epic (AL-55). It extends `StructuredData.astro` (which already emits `TechArticle`, `Article`, `WebSite`, `Organization`, `BreadcrumbList`) with a `HowTo` variant driven by **explicit frontmatter steps**.

### Architecture

**Determinism over parsing.** The PBI offered two approaches: (a) auto-parse numbered H3s into steps, or (b) explicit `steps` frontmatter. We choose **(b)**. Inspection shows practice structures are inconsistent — `adr-authoring` uses "### Step N:" headings, but `living-specs` uses topical H3s (`### Blueprint`, `### The Same-Commit Rule`) that are NOT procedure steps. Auto-parsing would emit wrong or noisy steps for half the collection. Explicit frontmatter is deterministic and matches the project pillar `Determinism > Vibes`. The author decides what the steps are; the build never guesses.

**Presence-driven emission.** A practice emits a `HowTo` block **iff** its frontmatter carries a non-empty `steps` array. No separate `schemaType` flag — the presence of `steps` is the signal (one less thing to keep in sync). Non-procedural practices (e.g. `agent-personas`, `context-mapping` if not step-shaped) simply omit `steps` and emit only `TechArticle`.

**Coexistence, not replacement.** The `HowTo` block is emitted **in addition to** the existing `TechArticle` block (a second `<script>`, exactly like `BreadcrumbList`). `TechArticle` carries author, `datePublished`/`dateModified`, and `keywords` — signals `HowTo` does not — so it must remain. Multiple JSON-LD blocks per page are valid; no `@graph` merge.

**Data flow:**

```
src/content/practices/*.md  (frontmatter gains optional: steps: [{ name, text }])
        │
        ▼
src/content/config.ts  (articleSchema gains optional `steps`)
        │
        ▼
src/pages/practices/[...slug].astro
        ├──► <StructuredData type="TechArticle"   ... />   (unchanged, always)
        ├──► <StructuredData type="BreadcrumbList" ... />   (unchanged, always)
        └──► {practice.data.steps?.length && <StructuredData type="HowTo" data={{ name, description, steps }} />}
                 │
                 ▼
        StructuredData.astro  →  HowTo JSON-LD:
          { "@type": "HowTo", name, description,
            step: [{ "@type": "HowToStep", position, name, text }, ...] }
```

**Schema field** (`articleSchema`, `src/content/config.ts`):

```ts
steps: z.array(z.object({ name: z.string(), text: z.string() })).optional()
```

Placed on the shared `articleSchema` (so `recipeSchema`, which extends it, inherits the field for future use) — but **this PBI only wires and backfills the practices route**. Concepts/patterns/recipes are unaffected.

**Emitted HowTo shape:**

```jsonc
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "ADR Authoring",                       // longTitle ?? title
  "description": "…",                            // frontmatter description
  "step": [
    { "@type": "HowToStep", "position": 1, "name": "Check for Existing ADRs", "text": "Search docs/adr/ before writing a new record…" },
    { "@type": "HowToStep", "position": 2, "name": "Choose an ID and Title", "text": "…" }
  ]
}
```

**Backfill target:** populate `steps` on **at least 10 of the 14** practice articles — those that are genuinely procedural. Each step's `name` is the action; `text` is a concise instruction (1–3 sentences), NOT a copy of the full section body.

### Anti-Patterns

- **Do NOT auto-parse H3 headings into steps.** Practice structures differ; `living-specs` topical H3s are not procedure steps. Parsing produces wrong/noisy `step` lists. Steps come only from explicit frontmatter.
- **Do NOT force `HowTo` onto non-procedural practices.** If an article isn't a genuine step-by-step procedure, leave `steps` unset — emitting a fake one-step HowTo is misleading structured data and a spam signal.
- **Do NOT replace the `TechArticle` block.** `HowTo` lacks author/date/keywords; dropping `TechArticle` would lose those E-E-A-T and freshness signals. Emit both.
- **Do NOT dump full section prose into `step.text`.** Per Google's HowTo guidance, `text` is the step instruction — keep it concise.
- **Do NOT add `steps` to concepts/patterns articles or wire the HowTo block on their routes.** This PBI is practices-only (recipes inherit the field but are out of scope here).
- **Do NOT merge HowTo into the TechArticle block / `@graph`.** Separate `<script>` per type, matching the existing component pattern.
- **Do NOT use `any` or type-erasure casts** (`as unknown as`). Mirror the typed discriminated-union pattern already used for `BreadcrumbList` in `StructuredData.astro`.

## Contract

### Definition of Done

- [ ] `articleSchema` (`src/content/config.ts`) gains an optional `steps: { name: string; text: string }[]` field.
- [ ] `StructuredData.astro` accepts `type: "HowTo"` via the typed `Props` discriminated union (no `any`, no `as unknown as`) and emits a valid `HowTo` block with `name`, `description`, and a `step` array of `HowToStep`s each carrying a 1-based `position`, `name`, and `text`.
- [ ] `src/pages/practices/[...slug].astro` renders the `HowTo` block **only when** `practice.data.steps` is present and non-empty, alongside the existing `TechArticle` and `BreadcrumbList` blocks.
- [ ] At least **10** practice articles have `steps` backfilled and emit a `HowTo` JSON-LD block.
- [ ] Practices without `steps` emit no `HowTo` block (and still build/render normally).
- [ ] The existing `TechArticle` block remains on every practice page (not replaced).
- [ ] No change to concepts/patterns/recipes routes or their JSON-LD.
- [ ] `pnpm check`, `pnpm lint`, and `pnpm build` pass.
- [ ] Emitted JSON-LD validates as a Schema.org `HowTo` (Google Rich Results / `schema-dts` shape).

### Regression Guardrails

- The existing `TechArticle` / `Article` / `WebSite` / `Organization` / `BreadcrumbList` branches of `StructuredData.astro` MUST remain behavior-identical — this is purely additive.
- The `steps` field MUST be optional; adding it MUST NOT break any existing content (all current articles have no `steps` and must continue to validate and build).
- `HowTo` MUST only be emitted on the practices route in this change; concepts/patterns/recipes output MUST be byte-unchanged.
- `step.text` MUST come from authored frontmatter, never synthesized from headings or body at build time.
- Emission MUST be presence-driven: no `steps` ⇒ no `HowTo` block, no empty `step: []`.

### Scenarios

**Scenario: Procedural practice emits HowTo**
- Given: `practices/adr-authoring.md` has frontmatter `steps: [{name:"Check for Existing ADRs", text:"…"}, … 7 items]`
- When: `/practices/adr-authoring/` is built
- Then: the page contains a `HowTo` JSON-LD block with `name` = its `longTitle ?? title`, `description` = its frontmatter description, and 7 `HowToStep`s with `position` 1–7
- And: the existing `TechArticle` and `BreadcrumbList` blocks are still present

**Scenario: Non-procedural practice emits no HowTo**
- Given: a practice with no `steps` frontmatter
- When: its page is built
- Then: NO `HowTo` block is emitted (no empty `step` array)
- And: `TechArticle` + `BreadcrumbList` render normally; the build does not error

**Scenario: steps field is backward-compatible**
- Given: the 73 existing articles, none of which had `steps`
- When: the schema field is added and the site is rebuilt
- Then: all content validates and builds with zero errors
- And: no `HowTo` block appears on any concept, pattern, or recipe page

**Scenario: At least 10 practices marked up**
- Given: the 14-article practices collection
- When: the backfill is complete and the site is built
- Then: at least 10 practice pages emit a `HowTo` block

**Scenario: HowTo coexists with TechArticle (no signal loss)**
- Given: any practice with `steps`
- When: its page is built
- Then: BOTH a `TechArticle` block (with author/dateModified/keywords) AND a `HowTo` block are present and independently valid

### Verification

```bash
pnpm build
# Count practice pages emitting HowTo (expect >= 10):
grep -rl '"@type": "HowTo"' dist/practices/ | wc -l
# Inspect a known procedural one — steps with positions + concise text:
grep -A40 '"HowTo"' dist/practices/adr-authoring/index.html
# Confirm coexistence: the same page still has TechArticle:
grep -c '"TechArticle"' dist/practices/adr-authoring/index.html   # expect 1
# Confirm a non-procedural practice has NO HowTo (pick one left without steps):
grep -c 'HowTo' dist/practices/<no-steps-practice>/index.html      # expect 0
# Confirm concepts/patterns untouched:
grep -rl 'HowTo' dist/concepts/ dist/patterns/                     # expect no matches
```

## Implementation Notes

- **Schema:** add the optional `steps` array to `articleSchema` in `src/content/config.ts`. Keep it optional — do not set a default that would materialize an empty array.
- **Component:** add a `{ type: "HowTo"; data: { name: string; description?: string; steps: { name: string; text: string }[] } }` arm to the `Props` union in `src/components/StructuredData.astro`, and a branch that maps `steps` → `step: [{ "@type": "HowToStep", position, name, text }]` with 1-based `position`. No `any`; follow the `BreadcrumbList` arm as the typed template. Consider exporting a `HowToStep`/step type for reuse if it keeps typing clean.
- **Route:** in `src/pages/practices/[...slug].astro`, conditionally render `<StructuredData type="HowTo" data={{ name: practice.data.longTitle ?? practice.data.title, description: practice.data.description, steps: practice.data.steps }} />` guarded by `practice.data.steps?.length`. `StructuredData` is already imported there.
- **Backfill:** author concise `steps` for ≥10 procedural practices. Good candidates (verify each is genuinely step-shaped before marking up): `adr-authoring`, `living-specs`, `pbi-authoring`, `product-vision-authoring`, `feature-assembly`, `micro-commits`, `context-mapping`, `context-offloading`, `adversarial-code-review`, `adversarial-requirement-review`, `constitutional-review-implementation`, `workflow-as-code`, `agents-md-spec`. Derive step `name`/`text` from each article's existing procedure sections; keep `text` to 1–3 sentences. Frontmatter content edits start below the frontmatter — do not touch the `## h2`-first body rule.
- **Canonical references:** `src/components/StructuredData.astro` (component + typed-union pattern from `BreadcrumbList`), `src/pages/practices/[...slug].astro` (route), `src/content/config.ts` (`articleSchema`).

## Resources

- [Schema.org HowTo](https://schema.org/HowTo) / [HowToStep](https://schema.org/HowToStep) — the types emitted
- [Google — HowTo structured data](https://developers.google.com/search/docs/appearance/structured-data/how-to) — `step`/`name`/`text` requirements and guidance
- `specs/structured-data/spec.md` — sibling spec; the `StructuredData.astro` component this extends
- `specs/breadcrumbs/spec.md` — sibling spec; the typed discriminated-union pattern this mirrors
- `specs/practices-page/spec.md` — the practices collection this marks up
- `docs/reports/GEO-AUDIT-REPORT.md` — source audit (item H4)
