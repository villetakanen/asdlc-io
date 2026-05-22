#!/usr/bin/env node
/**
 * One-shot retrofit: add frontmatter to every existing specs/**\/spec.md.
 * Idempotent — skips files that already have a frontmatter block.
 * See specs/spec-linter/spec.md §Architecture/Retrofit.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve } from "node:path";
import { glob } from "glob";
import matter from "gray-matter";

const ROOT = resolve(import.meta.dirname, "..");

// Specs known to be still in-progress at retrofit time.
const DRAFT = new Set(["specs/spec-linter/spec.md", "specs/mcp-evals/spec.md"]);

const H1_RE = /^#\s+(?:(?:Feature|Spec):\s+)?(.+?)\s*$/m;

function gitDate(file, filter) {
  try {
    const out = execSync(
      `git log ${filter} --format=%aI -- "${file}"`,
      { cwd: ROOT, encoding: "utf8" },
    ).trim();
    const lines = out.split("\n").filter(Boolean);
    return lines.length ? lines[lines.length - 1] : null;
  } catch {
    return null;
  }
}

function isoDate(iso) {
  return iso ? iso.slice(0, 10) : new Date().toISOString().slice(0, 10);
}

async function main() {
  const files = await glob("specs/**/spec.md", {
    cwd: ROOT,
    ignore: ["specs/content-articles/**"],
  });
  files.sort();

  let updated = 0;
  for (const rel of files) {
    const full = resolve(ROOT, rel);
    const raw = readFileSync(full, "utf8");
    const parsed = matter(raw);

    if (Object.keys(parsed.data).length > 0) {
      console.log(`skip  ${rel} (already has frontmatter)`);
      continue;
    }

    const h1 = parsed.content.match(H1_RE);
    if (!h1) {
      console.warn(`WARN  ${rel}: no "# Feature: ..." H1 — skipping`);
      continue;
    }
    const title = h1[1].trim();

    const status = DRAFT.has(rel) ? "draft" : "shipped";
    const createdIso = gitDate(rel, "--diff-filter=A --follow") || new Date().toISOString();
    const lastIso = gitDate(rel, "-1") || createdIso;

    const fm = {
      title,
      status,
      owner: "Ville Takanen",
      archetype: "feature",
      created: isoDate(createdIso),
      tags: [],
    };
    if (status === "shipped") fm.shipped = isoDate(lastIso);

    const yaml = Object.entries(fm)
      .map(([k, v]) => {
        if (Array.isArray(v)) return `${k}: [${v.map((x) => `"${x}"`).join(", ")}]`;
        if (typeof v === "string") return `${k}: "${v}"`;
        return `${k}: ${v}`;
      })
      .join("\n");

    const next = `---\n${yaml}\n---\n\n${parsed.content.trimStart()}`;
    writeFileSync(full, next, "utf8");
    console.log(`wrote ${rel} (${status})`);
    updated++;
  }
  console.log(`\n${updated} files updated.`);
}

main();
