#!/usr/bin/env node

import { writeFileSync, readdirSync, readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import matter from "gray-matter";

/**
 * Parse frontmatter using gray-matter for proper YAML handling
 */
function parseFrontmatter(markdown) {
  const parsed = matter(markdown);
  return {
    data: parsed.data,
    content: parsed.content,
  };
}

const BASE_DIR = resolve("src/content");
const OUTPUT_FILE = resolve("src/mcp/articles.json");
const COLLECTIONS = ["concepts", "patterns", "practices"];

console.log("🔍 Generating MCP Article Index...");

const articles = [];

for (const collection of COLLECTIONS) {
  const fullPath = join(BASE_DIR, collection);
  if (!existsSync(fullPath)) continue;

  const files = readdirSync(fullPath);
  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const slug = file.replace(/\.md$/, "");
    const raw = readFileSync(join(fullPath, file), "utf8");
    const { data, content } = parseFrontmatter(raw);

    if (data.status === "Live" || data.status === "Experimental") {
      articles.push({
        slug,
        collection,
        title: data.title || slug,
        description: data.description || "",
        status: data.status,
        content: content.trim(),
        tags: data.tags || [],
        references: data.references || [],
      });
    }
  }
}

writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));
console.log(
  `✅ Successfully indexed ${articles.length} articles to ${OUTPUT_FILE}`,
);
