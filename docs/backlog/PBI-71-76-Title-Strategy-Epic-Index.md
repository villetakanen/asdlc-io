# PBI-71–76: Title Strategy & Spec Alignment (Epic Index)

## Context

An audit of `specs/content-articles/spec.md` against the live codebase revealed six deltas. The spec defines a dual-title strategy (`title` for cards/lists, `longTitle` for SEO/H1/social) that is not yet implemented. Additionally, the `publishedDate` field exists in the schema but is undocumented in the spec.

## Delta Summary

| # | Delta | Direction | PBI |
|---|-------|-----------|-----|
| 1 | `longTitle` field defined in spec, missing from schema | Spec to Code | PBI-71 |
| 2 | `title` max(40) required by spec, no constraint in schema | Spec to Code | PBI-71 |
| 3 | View layer uses `title` uniformly; spec requires two surfaces | Spec to Code | PBI-72 |
| 4 | Scripts/MCP don't extract or output `longTitle` | Spec to Code | PBI-73 |
| 5 | 5 articles have titles > 40 chars, need splitting | Spec to Code | PBI-74 |
| 6 | `publishedDate` in schema but missing from spec contract | Code to Spec | PBI-75 |

## PBI Breakdown

| PBI | Title | Blocks | Status |
|-----|-------|--------|--------|
| [PBI-71](PBI-71-Schema-LongTitle.md) | Schema: Add `longTitle` + `title` max constraint | — | Open |
| [PBI-72](PBI-72-Views-LongTitle-Wiring.md) | Views: Wire `longTitle` to SEO/H1 consumers | PBI-71 | Open |
| [PBI-73](PBI-73-Scripts-LongTitle.md) | Scripts/MCP: Include `longTitle` in build artifacts | PBI-71 | Open |
| [PBI-74](PBI-74-Content-Title-Migration.md) | Content: Migrate 5 articles with overlong titles | PBI-71 | Open |
| [PBI-75](PBI-75-Spec-PublishedDate.md) | Spec: Document `publishedDate` in shared contract | — | Open |

## Dependency Graph

```
PBI-75 (independent)

PBI-71 (schema)
  ├── PBI-72 (views)
  ├── PBI-73 (scripts/MCP)
  └── PBI-74 (content migration)
```

PBI-72, PBI-73, and PBI-74 can execute in parallel once PBI-71 lands.
