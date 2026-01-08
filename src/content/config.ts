import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const baseReferenceSchema = z.object({
  type: z.enum(["website", "paper", "book", "podcast", "video", "repository", "standard"]),
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

export const referenceSchema = baseReferenceSchema.refine(
  (data) => data.type !== "website" || data.accessed !== undefined,
  {
    message: "Website references require an accessed date",
    path: ["accessed"],
  },
);

export type Reference = z.infer<typeof referenceSchema>;

export const articleSchema = z.object({
  title: z.string(),
  description: z
    .string()
    .max(200, "Definition must be < 200 chars for quick scanning.")
    .default(""),
  tags: z.array(z.string()).optional(),
  lastUpdated: z.coerce.date(),
  status: z.enum(["Draft", "Proposed", "Live", "Deprecated", "Experimental"]).default("Draft"),
  supersededBy: z.array(z.string()).optional(),
  relatedIds: z.array(z.string()).optional(),
  references: z.array(referenceSchema).optional().default([]),
});
export type ArticleData = z.infer<typeof articleSchema>;

const concepts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/concepts" }),
  schema: articleSchema,
});

const patterns = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/patterns" }),
  schema: articleSchema,
});

const practices = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/practices" }),
  schema: articleSchema,
});

export const collections = { concepts, patterns, practices };
