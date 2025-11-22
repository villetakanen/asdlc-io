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

export const collections = { concepts, patterns };
