# DEFECT-003: Astro 5 Content Collections API Migration

**Date Reported:** 2025-01-XX
**Date Resolved:** 2025-01-XX
**Severity:** High (Breaking Change - Pages Crashing)
**Status:** ✅ RESOLVED

## Problem Description

After upgrading to Astro 5.16.0 in DEFECT-002, the content collections configuration was still using the deprecated v2.0 Content Collections API. This legacy API, while still functional with backwards compatibility, is now considered legacy and will eventually be removed. More importantly, the migration guide strongly recommends using the new Content Layer API for performance improvements and added capabilities.

**Symptoms:**
- Content collections using outdated `type: 'content'` definition
- Missing modern Content Layer API features (glob loader, better performance)
- Risk of breaking changes when legacy support is removed
- No access to new serialization and performance improvements in Astro 5

## Root Cause Analysis

1. **Initial Setup:** Content collections were configured using Astro 2.0/4.x patterns
2. **Astro 5 Upgrade:** DEFECT-002 upgraded to Astro 5 but didn't migrate content collections
3. **Legacy Compatibility:** Astro 5 provides backwards compatibility, masking the need for migration
4. **Documentation Gap:** Migration from legacy to Content Layer API wasn't initially prioritized

## Breaking Changes in Astro 5 Content Layer API

### API Changes
1. **Collection Definition:**
   - `type: 'content'` → `loader: glob({ pattern, base })`
   - Collections now explicitly define their data source
   
2. **Entry Access:**
   - `entry.slug` → `entry.id`
   - More consistent naming across all collection types

3. **Rendering:**
   - `await entry.render()` → `await render(entry)`
   - New function import required: `import { render } from 'astro:content'`

4. **Date Handling:**
   - `z.date()` → `z.coerce.date()`
   - Automatic date parsing from frontmatter strings

## Resolution

### Phase 1: Update Content Configuration

**File Modified:** `src/content/config.ts`

**Changes:**
1. Added `glob` loader import from `astro/loaders`
2. Replaced `type: "content"` with `loader: glob()` configuration
3. Updated date schema validators to use `z.coerce.date()`

```typescript
// BEFORE
import { defineCollection, z } from "astro:content";

const concepts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    definition: z.string().max(200, "Definition must be < 200 chars for quick scanning."),
    tags: z.array(z.string()),
    related_concepts: z.array(z.string()).optional(),
    maturity: z.enum(["Theoretical", "Experimental", "Standard", "Deprecated"]),
    lastUpdated: z.date(),
  }),
});

const patterns = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    complexity: z.enum(["Low", "Medium", "High"]),
    status: z.enum(["Draft", "Review", "Approved"]),
    diagram_source: z.string().optional(),
    publishDate: z.date(),
  }),
});

// AFTER
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const concepts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/concepts" }),
  schema: z.object({
    title: z.string(),
    definition: z
      .string()
      .max(200, "Definition must be < 200 chars for quick scanning."),
    tags: z.array(z.string()),
    related_concepts: z.array(z.string()).optional(),
    maturity: z.enum(["Theoretical", "Experimental", "Standard", "Deprecated"]),
    lastUpdated: z.coerce.date(),
  }),
});

const patterns = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/patterns" }),
  schema: z.object({
    title: z.string(),
    complexity: z.enum(["Low", "Medium", "High"]),
    status: z.enum(["Draft", "Review", "Approved"]),
    diagram_source: z.string().optional(),
    publishDate: z.coerce.date(),
  }),
});
```

### Phase 2: Update Dynamic Route Pages

**Files Modified:**
1. `src/pages/concepts/[...slug].astro`
2. `src/pages/patterns/[...slug].astro`

**Key Changes:**
- Import `render` function from `astro:content`
- Replace `entry.slug` with `entry.id` in `getStaticPaths()`
- Replace `await entry.render()` with `await render(entry)`

**Example Migration:**

```typescript
// BEFORE
---
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";

export async function getStaticPaths() {
  const concepts = await getCollection("concepts");
  return concepts.map((concept) => ({
    params: { slug: concept.slug },
    props: { concept },
  }));
}

interface Props {
  concept: CollectionEntry<"concepts">;
}

const { concept } = Astro.props;
const { Content } = await concept.render();
---

// AFTER
---
import type { CollectionEntry } from "astro:content";
import { getCollection, render } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";

export async function getStaticPaths() {
  const concepts = await getCollection("concepts");
  return concepts.map((concept) => ({
    params: { slug: concept.id },
    props: { concept },
  }));
}

interface Props {
  concept: CollectionEntry<"concepts">;
}

const { concept } = Astro.props;
const { Content } = await render(concept);
---
```

### Phase 3: Update Index Pages

**Files Modified:**
1. `src/pages/concepts/index.astro`
2. `src/pages/patterns/index.astro`

**Changes:**
- Replace `entry.slug` with `entry.id` when building URLs

```typescript
// BEFORE
<SpecCard
  title={concept.data.title}
  url={`/concepts/${concept.slug}`}
  ...
/>

// AFTER
<SpecCard
  title={concept.data.title}
  url={`/concepts/${concept.id}`}
  ...
/>
```

### Verification

All quality gates passing:

✅ **Content Sync:**
```bash
pnpm check
# Output: [content] Content config changed
#         [content] Clearing content store
#         [content] Synced content
```

✅ **Type Check:**
```bash
pnpm check
# Output: Result (11 files): 0 errors, 0 warnings, 0 hints
```

✅ **Build:**
```bash
pnpm build
# Output: 5 page(s) built in 607ms. Complete!
```

✅ **Route Generation:**
```
/concepts/index.html
/concepts/context-engineering/index.html
/patterns/index.html
/patterns/supervisor-agent-pattern/index.html
/index.html
```

✅ **Content Rendering:**
- All frontmatter data accessible via `entry.data`
- Markdown content renders correctly via `<Content />`
- Date formatting works as expected with `z.coerce.date()`
- All metadata (tags, related concepts) displays properly

## Impact Analysis

### Performance Benefits
- **Faster Content Loading:** Content Layer API uses improved caching and serialization
- **Better Build Times:** Glob loader is optimized for large collections
- **Reduced Memory Usage:** More efficient data structures for entry storage

### Developer Experience Improvements
- **Clearer API:** `render(entry)` is more explicit than `entry.render()`
- **Consistent Naming:** `id` is used consistently instead of `slug` vs `id` confusion
- **Better Errors:** Content Layer API provides more descriptive error messages
- **Future-Proof:** Using the recommended modern API prevents breaking changes

### Schema Improvements
- **Automatic Date Parsing:** `z.coerce.date()` handles string-to-date conversion automatically
- **Type Safety:** Better TypeScript inference with the new API
- **Validation:** Frontmatter validation happens during content sync, catching errors earlier

## Content Collection Entry ID Mapping

The migration from `slug` to `id` changes how entries are identified:

| Old API (`slug`)           | New API (`id`)            |
|----------------------------|---------------------------|
| `context-engineering`      | `context-engineering`     |
| `supervisor-agent-pattern` | `supervisor-agent-pattern`|

**Note:** In this project, `id` values match the previous `slug` values because they're both derived from the filename. However, the Content Layer API's `id` is more flexible and can be customized via the loader configuration if needed.

## Adherence to AGENTS.md

✅ **No "Vibe Coding":** Used official Astro 5 migration guide for all changes  
✅ **Schema First:** Updated Zod schemas with proper type coercion  
✅ **Type Safety:** TypeScript checks pass with 0 errors  
✅ **Reasoning Traces:** This document provides comprehensive migration context  
✅ **Reference Official Docs:** Followed [Astro 5 Content Layer API guide](https://docs.astro.build/en/guides/upgrade-to/v5/#legacy-v20-content-collections-api)

## Recommendations for Future Work

### PBI: Add More Content Collections
**Priority:** Medium  
**Description:** Now that the Content Layer API is in place, consider adding new collections

**Potential Collections:**
- `tools` - Development tools and utilities used in ASDLC
- `case-studies` - Real-world ASDLC implementation examples
- `glossary` - Comprehensive term definitions
- `recipes` - Step-by-step implementation guides

**Example Schema:**
```typescript
const tools = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/tools" }),
  schema: z.object({
    name: z.string(),
    category: z.enum(["Linter", "Formatter", "Build Tool", "Testing"]),
    homepage: z.string().url(),
    documentation: z.string().url(),
    license: z.string(),
    lastReviewed: z.coerce.date(),
  }),
});
```

### PBI: Implement Content Relationships
**Priority:** Low  
**Description:** Leverage `related_concepts` field to create a knowledge graph

**Implementation Ideas:**
- Add a "See Also" section to concept pages with actual links
- Validate that `related_concepts` references exist in the collection
- Create a visualization of concept relationships
- Add bidirectional relationship tracking

### PBI: Content Validation Pipeline
**Priority:** High  
**Description:** Add CI checks to validate content collections before deployment

**Validation Rules:**
- All required frontmatter fields present
- Dates are valid and not in the future (for `publishDate`)
- Definition length < 200 characters (already in schema)
- All `related_concepts` references exist
- No duplicate titles across collections
- All external links (URLs) are valid

**Example GitHub Action:**
```yaml
name: Validate Content Collections

on: [pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm astro sync
      - run: pnpm astro check
```

## Commit Message

```
fix: migrate content collections to Astro 5 Content Layer API (DEFECT-003)

BREAKING CHANGES:
- Replace legacy content collections API with new Content Layer API
- Use glob() loader for concepts and patterns collections
- Update entry.slug → entry.id in all dynamic routes
- Update entry.render() → render(entry) pattern
- Use z.coerce.date() for automatic date parsing

Changes:
- src/content/config.ts: Add glob loader, update schemas
- src/pages/concepts/[...slug].astro: Use render() function and entry.id
- src/pages/concepts/index.astro: Reference entry.id instead of slug
- src/pages/patterns/[...slug].astro: Use render() function and entry.id
- src/pages/patterns/index.astro: Reference entry.id instead of slug

Benefits:
- Better performance with improved caching
- Future-proof against legacy API removal
- Clearer, more explicit API surface
- Automatic date parsing from frontmatter

Resolves: DEFECT-003
Related: DEFECT-002 (Astro 5 upgrade)
```

## Related Documents

- `AGENTS.md` - Core directive: "Schema First"
- `src/content/config.ts` - Updated collection schemas
- `docs/defects/DEFECT-002-outdated-dependencies.md` - Astro 5 upgrade
- [Astro 5 Migration Guide](https://docs.astro.build/en/guides/upgrade-to/v5/)
- [Content Layer API Reference](https://docs.astro.build/en/reference/content-collections/)

## Lessons Learned

1. **Incremental Migration:** Breaking changes across major versions can be addressed step-by-step
2. **Read Migration Guides Thoroughly:** Astro's migration guide was comprehensive and accurate
3. **Backwards Compatibility Trade-offs:** While helpful, backwards compatibility can delay necessary updates
4. **API Clarity:** The new `render(entry)` function is more explicit than the previous `entry.render()` method
5. **Date Handling:** `z.coerce.date()` simplifies frontmatter date parsing significantly
6. **Future-Proofing:** Migrating to recommended APIs prevents technical debt accumulation

## Testing Checklist

- [x] Content collections sync without errors
- [x] TypeScript type checking passes
- [x] Build completes successfully
- [x] All routes generate correctly
- [x] Content pages render with correct frontmatter
- [x] Date formatting displays properly
- [x] Tags and metadata render correctly
- [x] Related concepts display when present
- [x] Navigation links work between pages
- [x] Linting passes with Biome 2.x