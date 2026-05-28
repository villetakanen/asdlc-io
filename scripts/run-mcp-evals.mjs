#!/usr/bin/env node
/**
 * MCP eval harness — deterministic retrieval quality gate.
 * See specs/mcp-evals/spec.md.
 *
 * Imports the same ContentService + handleToolCall used by the deployed
 * edge function, runs fixture cases, and exits non-zero on regression.
 *
 * Run via: pnpm evals:mcp
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");

const [{ ContentService }, { handleToolCall }] = await Promise.all([
  import(`${ROOT}/src/mcp/content.ts`),
  import(`${ROOT}/src/mcp/tools.ts`),
]);

const articles = JSON.parse(
  readFileSync(`${ROOT}/src/mcp/articles.json`, "utf8"),
);
const fixtures = JSON.parse(
  readFileSync(`${ROOT}/evals/mcp/retrieval.fixtures.json`, "utf8"),
);

const service = new ContentService(articles);

/** Parse `- [slug] title: desc` lines from the search/list response text. */
function parseSlugs(text) {
  if (!text) return [];
  const slugs = [];
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*-\s+\[([^\]]+)\]/);
    if (m) {
      // list_articles uses [collection/slug]; search uses [slug].
      const last = m[1].split("/").pop();
      slugs.push(last);
    }
  }
  return slugs;
}

async function callTool(name, params = {}) {
  return handleToolCall(name, params, service);
}

const results = [];
function record(section, id, status, summary) {
  results.push({ section, id, status, summary });
}

// --- search cases ---
for (const c of fixtures.search) {
  const res = await callTool("search_knowledge_base", { query: c.query });
  const text = res.content?.[0]?.text ?? "";
  const noResults = text.startsWith("No articles found");
  const slugs = noResults ? [] : parseSlugs(text);
  const failures = [];

  const exp = c.expect ?? {};

  if (typeof exp.minResults === "number" && slugs.length < exp.minResults) {
    failures.push(`expected ≥${exp.minResults} results, got ${slugs.length}`);
  }
  if (exp.minResults === 0 && slugs.length > 0) {
    failures.push(`expected 0 results, got ${slugs.length}: [${slugs.slice(0, 3).join(", ")}]`);
  }
  if (Array.isArray(exp.mustInclude)) {
    for (const want of exp.mustInclude) {
      if (!slugs.includes(want)) failures.push(`missing "${want}" in results`);
    }
  }
  if (Array.isArray(exp.mustNotInclude)) {
    for (const banned of exp.mustNotInclude) {
      if (slugs.includes(banned)) failures.push(`forbidden "${banned}" present`);
    }
  }
  if (exp.topN) {
    const top = slugs.slice(0, exp.topN.n);
    for (const want of exp.topN.slugs) {
      if (!top.includes(want)) {
        failures.push(`"${want}" not in top-${exp.topN.n}: [${top.join(", ")}]`);
      }
    }
  }

  const summary = `"${c.query}" → [${slugs.slice(0, 3).join(", ")}${slugs.length > 3 ? ", …" : ""}]`;
  record("search", c.id, failures.length ? "FAIL" : "PASS", failures.length ? `${summary} :: ${failures.join("; ")}` : summary);
}

// --- list cases ---
for (const c of fixtures.list) {
  const res = await callTool("list_articles");
  const text = res.content?.[0]?.text ?? "";
  const slugs = parseSlugs(text);
  const failures = [];
  const exp = c.expect ?? {};

  if (typeof exp.minTotal === "number" && slugs.length < exp.minTotal) {
    failures.push(`expected ≥${exp.minTotal}, got ${slugs.length}`);
  }
  if (Array.isArray(exp.mustInclude)) {
    for (const want of exp.mustInclude) {
      if (!slugs.includes(want)) failures.push(`missing "${want}"`);
    }
  }
  const summary = `list_articles → ${slugs.length} articles`;
  record("list", c.id, failures.length ? "FAIL" : "PASS", failures.length ? `${summary} :: ${failures.join("; ")}` : summary);
}

// --- get cases ---
for (const c of fixtures.get) {
  const res = await callTool("get_article", { slug: c.slug });
  const text = res.content?.[0]?.text ?? "";
  const isError = !!res.isError;
  const failures = [];
  const exp = c.expect ?? {};

  if (exp.isError === true && !isError) failures.push("expected error, got success");
  if (exp.isError === false && isError) failures.push(`expected success, got error: ${text.slice(0, 80)}`);
  if (typeof exp.minContentLength === "number" && text.length < exp.minContentLength) {
    failures.push(`content too short: ${text.length} < ${exp.minContentLength}`);
  }
  if (typeof exp.h1Contains === "string") {
    const h1 = text.match(/^#\s+(.+)$/m)?.[1] ?? "";
    if (!h1.includes(exp.h1Contains)) failures.push(`H1 "${h1}" missing "${exp.h1Contains}"`);
  }
  const summary = `get_article(${c.slug}) → ${isError ? "error" : `${text.length} chars`}`;
  record("get", c.id, failures.length ? "FAIL" : "PASS", failures.length ? `${summary} :: ${failures.join("; ")}` : summary);
}

// --- report ---
const passed = results.filter((r) => r.status === "PASS").length;
const failed = results.length - passed;
const W = Math.max(...results.map((r) => r.id.length));

console.log(`\nASDLC MCP Evals — ${results.length} cases\n${"─".repeat(60)}`);
for (const r of results) {
  const tag = r.status === "PASS" ? "PASS" : "FAIL";
  console.log(`${tag}  ${r.section.padEnd(6)} ${r.id.padEnd(W)}  ${r.summary}`);
}
console.log(`${"─".repeat(60)}\n${passed} passed, ${failed} failed`);

process.exit(failed ? 1 : 0);
