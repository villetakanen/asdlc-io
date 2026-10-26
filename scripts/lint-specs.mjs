#!/usr/bin/env node
/**
 * Spec linter — enforces frontmatter schema on specs/**\/spec.md.
 * See specs/spec-linter/spec.md.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { glob } from "glob";
import matter from "gray-matter";
import { z } from "astro/zod";

const ROOT = resolve(import.meta.dirname, "..");
const PATTERN = "specs/**/spec.md";
const EXCLUDE = ["specs/content-articles/**"];

const SpecStatus = z.enum(["draft", "approved", "deprecated"]);

const SpecFrontmatter = z.object({
  title: z.string().min(3),
  status: SpecStatus,
  owner: z.string().min(1),
  linear: z
    .string()
    .regex(/^[A-Z]+-\d+$/, "must match e.g. ASDLC-123")
    .optional(),
  archetype: z.enum(["feature", "infra", "content", "process"]).default("feature"),
  created: z.coerce.date(),
  tags: z.array(z.string()).default([]),
});

const H1_RE = /^#\s+(?:(?:Feature|Spec):\s+)?(.+?)\s*$/m;

/**
 * Conservative fenced-code heuristic, not a Markdown/JS parser.
 * Contract/data formats are excluded; exceptions apply only to the next fence.
 * @param {string} body Markdown body (without frontmatter)
 */
export function findCodeTranscription(body) {
  const lines = body.split(/\r?\n/);
  const findings = [];
  const contractFormats = new Set(["gherkin", "feature", "json", "jsonc", "yaml", "yml", "text", "txt", "markdown", "md", "mermaid", "diff", "csv"]);
  for (let index = 0; index < lines.length; index++) {
    const opening = lines[index].match(/^ {0,3}(`{3,}|~{3,})([^`]*)$/);
    if (!opening) continue;
    const start = index;
    const fence = opening[1];
    const language = opening[2].trim().split(/\s+/)[0].toLowerCase();
    const closing = new RegExp(`^ {0,3}${fence[0]}{${fence.length},}\\s*$`);
    const code = [];
    while (++index < lines.length && !closing.test(lines[index])) code.push(lines[index]);
    let previous = start - 1;
    while (previous >= 0 && !lines[previous].trim()) previous--;
    if (lines[previous]?.trim() === "<!-- lint:allow-code -->" || contractFormats.has(language)) continue;
    const reasons = [];
    if (code.length > 25) reasons.push(`fenced code has ${code.length} lines (maximum 25)`);
    if (code.some((line) => /^\s*import(?:\s|\(|["'{*])/.test(line) || /\brequire\s*\(\s*["'`]/.test(line))) {
      reasons.push("fenced code contains import/require statements");
    }
    if (reasons.length) findings.push({ line: start + 1, reasons });
  }
  return findings;
}

/** @param {{ root?: string, strictTranscription?: boolean }} options */
export async function lintSpecs({ root = ROOT, strictTranscription = false } = {}) {
  const files = await glob(PATTERN, { cwd: root, ignore: EXCLUDE });
  files.sort();

  const failures = [];

  for (const rel of files) {
    const full = resolve(root, rel);
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

    for (const finding of findCodeTranscription(parsed.content)) {
      const message = `body line ${finding.line}: possible code transcription: ${finding.reasons.join("; ")}. Replace with intent + a file reference, or precede this fence with <!-- lint:allow-code -->.`;
      if (strictTranscription) errors.push(message);
      else console.warn(`! ${rel}: ${message}`);
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
    return false;
  }

  console.log(`✓ ${files.length} specs validated`);
  return true;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  lintSpecs({ strictTranscription: process.argv.includes("--strict-transcription") }).then((ok) => {
    if (!ok) process.exitCode = 1;
  }).catch((err) => {
    console.error("spec linter crashed:", err);
    process.exitCode = 2;
  });
}
