#!/usr/bin/env node
/**
 * Spec linter — enforces frontmatter schema on specs/**\/spec.md.
 * See specs/spec-linter/spec.md.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { glob } from "glob";
import matter from "gray-matter";
import { z } from "astro/zod";

const ROOT = resolve(import.meta.dirname, "..");
const PATTERN = "specs/**/spec.md";
const EXCLUDE = ["specs/content-articles/**"];

const SpecStatus = z.enum(["draft", "approved", "shipped", "archived"]);

const SpecFrontmatter = z
  .object({
    title: z.string().min(3),
    status: SpecStatus,
    owner: z.string().min(1),
    linear: z
      .string()
      .regex(/^[A-Z]+-\d+$/, "must match e.g. ASDLC-123")
      .optional(),
    archetype: z
      .enum(["feature", "infra", "content", "process"])
      .default("feature"),
    created: z.coerce.date(),
    shipped: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
  })
  .refine((v) => v.status !== "shipped" || v.shipped !== undefined, {
    message: "status 'shipped' requires a `shipped:` date",
    path: ["shipped"],
  });

const H1_RE = /^#\s+(?:(?:Feature|Spec):\s+)?(.+?)\s*$/m;

async function main() {
  const files = await glob(PATTERN, { cwd: ROOT, ignore: EXCLUDE });
  files.sort();

  const failures = [];

  for (const rel of files) {
    const full = resolve(ROOT, rel);
    const raw = readFileSync(full, "utf8");
    const parsed = matter(raw);

    if (!parsed.data || Object.keys(parsed.data).length === 0) {
      failures.push({ file: rel, errors: ["missing frontmatter block"] });
      continue;
    }

    const result = SpecFrontmatter.safeParse(parsed.data);
    const errors = [];

    if (!result.success) {
      for (const issue of result.error.issues) {
        const path = issue.path.length ? issue.path.join(".") : "(root)";
        errors.push(`${path}: ${issue.message}`);
      }
    } else {
      const h1 = parsed.content.match(H1_RE);
      if (!h1) {
        errors.push("body must contain an H1 matching frontmatter `title`");
      } else if (h1[1].trim() !== result.data.title.trim()) {
        errors.push(
          `H1 "${h1[1]}" does not match frontmatter title "${result.data.title}" (prefixes "Feature:" / "Spec:" stripped before comparing)`,
        );
      }
    }

    if (errors.length) failures.push({ file: rel, errors });
  }

  if (failures.length) {
    console.error(`✗ Spec lint failed (${failures.length}/${files.length})\n`);
    for (const { file, errors } of failures) {
      console.error(`  ${file}`);
      for (const e of errors) console.error(`    - ${e}`);
      console.error("");
    }
    process.exit(1);
  }

  console.log(`✓ ${files.length} specs validated`);
}

main().catch((err) => {
  console.error("spec linter crashed:", err);
  process.exit(2);
});
