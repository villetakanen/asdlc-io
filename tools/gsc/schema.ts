import { z } from "astro/zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected an ISO date (YYYY-MM-DD)");

export const gscRowSchema = z.object({
  snapshotDate: isoDate,
  date: isoDate,
  page: z.string().url(),
  query: z.string(),
  clicks: z.number().int().nonnegative(),
  impressions: z.number().int().nonnegative(),
  ctr: z.number().min(0).max(1),
  position: z.number().nonnegative(),
});

export type GscRow = z.infer<typeof gscRowSchema>;
