import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const articleSchema = z.object({
  title: z.string(),
  description: z
    .string()
    .max(200, "Definition must be < 200 chars for quick scanning.")
    .default(""),
  tags: z.array(z.string()).optional(),
  lastUpdated: z.coerce.date(),
  status: z.enum(["Draft", "Proposed", "Live", "Deprecated", "Experimental"]).default("Draft"),
  maturity: z.enum(["Proposed", "Standard", "Deprecated", "Experimental"]).optional(),
  supersededBy: z.string().optional(),
  relatedIds: z.array(z.string()).optional(),
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
