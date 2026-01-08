# PBI-49: Add Reference Schema to Content Config

## Description

Add the `referenceSchema` Zod schema to `src/content/config.ts` and include the `references` field in all content collection schemas (concepts, patterns, practices).

## Spec Reference

`plans/article-references/spec.md` — Zod Schema Extension section

## Acceptance Criteria

- [x] `baseReferenceSchema` defined with all fields (type, title, url, author, authors, publisher, published, accessed, isbn, doi, annotation)
- [x] `referenceSchema` includes refinement: `accessed` required for `type: 'website'`
- [x] `references: z.array(referenceSchema).optional().default([])` added to all ArticleData schemas
- [x] `pnpm check` passes with no type errors
- [x] Schema validates example frontmatter from spec

## Technical Notes

```typescript
const baseReferenceSchema = z.object({
  type: z.enum(['website', 'paper', 'book', 'podcast', 'video', 'repository', 'standard']),
  title: z.string(),
  url: z.string().url().optional(),
  author: z.string().optional(),
  authors: z.array(z.string()).optional(),
  publisher: z.string().optional(),
  published: z.coerce.date().optional(),
  accessed: z.coerce.date().optional(),
  isbn: z.string().optional(),
  doi: z.string().optional(),
  annotation: z.string(),
});

const referenceSchema = baseReferenceSchema.refine(
  (data) => data.type !== 'website' || data.accessed !== undefined,
  { message: 'Website references require an accessed date', path: ['accessed'] }
);
```

## Implementation Notes

**Status:** ✅ Complete

**Changes Made:**
1. Added `baseReferenceSchema` to `src/content/config.ts` with all required fields:
   - `type`: Enum with 7 reference types (website, paper, book, podcast, video, repository, standard)
   - All optional metadata fields: `url`, `author`, `authors`, `publisher`, `published`, `accessed`, `isbn`, `doi`
   - Required `annotation` field for explanatory context

2. Added `referenceSchema` with refinement validation:
   - Enforces `accessed` date requirement for `type: 'website'`
   - Custom error message: "Website references require an accessed date"
   - Error path correctly set to `['accessed']`

3. Added `references` field to `articleSchema`:
   - Type: `z.array(referenceSchema).optional().default([])`
   - Applies to all three content collections (concepts, patterns, practices)

4. Exported schemas and type for use in components:
   - `export const baseReferenceSchema`
   - `export const referenceSchema`
   - `export type Reference = z.infer<typeof referenceSchema>`

**Validation:**
- `pnpm check` passes with 0 errors
- Created test article with all reference types - validated successfully
- Created invalid test article (website without `accessed`) - correctly rejected with expected error message
- All existing content continues to validate (references default to empty array)

**Next Steps:**
- PBI-50: Create `ArticleReferences.astro` component
- PBI-51: Integrate component into article layouts
- PBI-52: Update MCP server to include references in responses
- PBI-53: Migrate existing articles to use structured references
```

