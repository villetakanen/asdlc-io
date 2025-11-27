import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const concepts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/concepts" }),
  schema: z.object({
    title: z.string(),
    definition: z.string().max(200, "Definition must be < 200 chars for quick scanning."),
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
    status: z.enum(["Draft", "Proposed", "Live", "Experimental"]),
    diagram_source: z.string().optional(),
    publishDate: z.coerce.date(),
  }),
});

const practices = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/practices" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lastUpdated: z.coerce.date(),
    status: z.enum(["Draft", "Proposed", "Live", "Deprecated"]),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { concepts, patterns, practices };
