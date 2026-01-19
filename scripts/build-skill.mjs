#!/usr/bin/env node

import { writeFileSync, readdirSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { execSync } from "node:child_process";
import matter from "gray-matter";

/**
 * Parse frontmatter using gray-matter for proper YAML handling
 */
function parseFrontmatter(markdown) {
  return matter(markdown);
}

const BASE_DIR = resolve("src/content");
const OUTPUT_DIR = resolve("dist/skill");
const SKILL_ZIP = resolve("dist/asdlc-skill.zip");
const COLLECTIONS = ["concepts", "patterns", "practices"];
const ALLOWED_STATUSES = ["Live", "Experimental"];
const BASE_URL = "https://asdlc.io";

console.log("🔨 Building ASDLC Downloadable Skill...\n");

// Ensure output directory exists and is empty
if (existsSync(OUTPUT_DIR)) {
  // Simple cleanup: removing the directory recursively if it exists
  console.log("🧹 Cleaning old assets...");
  execSync(`rm -rf "${OUTPUT_DIR}"`);
}
mkdirSync(OUTPUT_DIR, { recursive: true });

// Cleanup old zip
if (existsSync(SKILL_ZIP)) {
  execSync(`rm -f "${SKILL_ZIP}"`);
}

let totalFiles = 0;
let includedFiles = 0;
let excludedFiles = 0;

const manifestation = {
  concepts: [],
  patterns: [],
  practices: []
};

for (const collection of COLLECTIONS) {
  const sourcePath = join(BASE_DIR, collection);
  const outputPath = join(OUTPUT_DIR, collection);
  
  if (!existsSync(sourcePath)) {
    console.log(`⚠️  Collection not found: ${collection}`);
    continue;
  }

  if (!existsSync(outputPath)) {
    mkdirSync(outputPath, { recursive: true });
  }

  const files = readdirSync(sourcePath);
  
  for (const file of files) {
    if (!file.endsWith(".md")) continue;
    
    totalFiles++;
    const sourceFile = join(sourcePath, file);
    const raw = readFileSync(sourceFile, "utf8");
    const { data, content } = parseFrontmatter(raw);
    
    const status = data.status || "Unknown";
    const slug = file.replace(/\.md$/, "");
    const title = data.title || slug;
    
    if (ALLOWED_STATUSES.includes(status)) {
      // 1. Rewrite Links
      // Pattern: [text](/category/slug) -> [text](../category/slug.md)
      const transformedContent = content.replace(
        /\[([^\]]+)\]\((\/(?:concepts|patterns|practices)\/([^#)]+))(#?[^)]*)\)/g,
        (_match, text, path, internalSlug, anchor) => {
          const category = path.split('/')[1];
          return `[${text}](../${category}/${internalSlug}.md${anchor})`;
        }
      );

      // 2. Add Metadata Header
      const header = `> **ASDLC Knowledge Base** | Status: ${status} | [View Online](${BASE_URL}/${collection}/${slug})\n\n`;
      
      // 3. Reconstruct file
      const finalContent = matter.stringify(header + transformedContent, data);

      // Write to output
      const outputFile = join(outputPath, file);
      writeFileSync(outputFile, finalContent);
      
      // Track for manifest
      manifestation[collection].push({ title, slug, file });
      
      includedFiles++;
      console.log(`✅ ${collection}/${file} (${status})`);
    } else {
      excludedFiles++;
      console.log(`⏭️  ${collection}/${file} (${status}) - excluded`);
    }
  }

  // Generate Category Index
  if (manifestation[collection].length > 0) {
    const sorted = manifestation[collection].sort((a, b) => a.title.localeCompare(b.title));
    const indexContent = `# ASDLC ${collection.charAt(0).toUpperCase() + collection.slice(1)} Index\n\n` +
      sorted.map(a => `- [${a.title}](./${a.file})`).join("\n");
    writeFileSync(join(outputPath, "index.md"), indexContent);
    console.log(`📂 Generated ${collection}/index.md`);
  }
}

// Generate Root SKILL.md
const skillManifest = `# ASDLC Agentic Software Development Life Cycle - Skill Definition

## Purpose
This directory contains the authoritative Knowledge Base for the ASDLC. Use these files to guide software development decisions, strictly adhering to the Patterns and Practices defined herein.

## Capabilities
- **Concepts**: Fundamental theories (e.g., Context Engineering, Levels of Autonomy).
- **Patterns**: Reusable architectural or process solutions (e.g., The Spec, Agent Constitution).
- **Practices**: Concrete, actionable workflows (e.g., AGENTS.md, Micro-Commits).

## Instructions for the Agent
1.  **Lookup First**: Before answering architectural questions, check \`concepts/\` or \`patterns/\` for relevant standards.
2.  **Cite Sources**: When recommending a practice, link to the specific file in \`practices/\`.
3.  **Follow the Spec**: If a user asks to "implement the Spec", refer to \`patterns/the-spec.md\`.

## Index
- [Concepts Index](./concepts/index.md)
- [Patterns Index](./patterns/index.md)
- [Practices Index](./practices/index.md)

---
Generated: ${new Date().toISOString()} | Total Articles: ${includedFiles}
`;

writeFileSync(join(OUTPUT_DIR, "SKILL.md"), skillManifest);
console.log(`📑 Generated SKILL.md manifest`);

console.log(`\n📊 Summary:`);
console.log(`   Total files processed: ${totalFiles}`);
console.log(`   Included: ${includedFiles}`);
console.log(`   Excluded: ${excludedFiles}`);

// ZIP Packaging
try {
  console.log(`\n📦 Packaging into ZIP...`);
  // Using -j to junk paths if we wanted all in root, but we want the folder structure.
  // Using -r for recursive.
  execSync(`cd "${OUTPUT_DIR}" && zip -r "${SKILL_ZIP}" .`);
  console.log(`✅ Artifact created: ${SKILL_ZIP}`);
} catch (error) {
  console.error(`❌ ZIP packaging failed: ${error.message}`);
}

console.log(`\n🎉 Skill build complete!`);
