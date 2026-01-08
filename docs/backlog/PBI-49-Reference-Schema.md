# PBI-49: Add Reference Schema to Content Config

## Description

Add the `referenceSchema` Zod schema to `src/content/config.ts` and include the `references` field in all content collection schemas (concepts, patterns, practices).

## Spec Reference

`plans/article-references/spec.md` — Zod Schema Extension section

## Acceptance Criteria

- [ ] `baseReferenceSchema` defined with all fields (type, title, url, author, authors, publisher, published, accessed, isbn, doi, annotation)
- [ ] `referenceSchema` includes refinement: `accessed` required for `type: 'website'`
- [ ] `references: z.array(referenceSchema).optional().default([])` added to all ArticleData schemas
- [ ] `pnpm check` passes with no type errors
- [ ] Schema validates example frontmatter from spec

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
