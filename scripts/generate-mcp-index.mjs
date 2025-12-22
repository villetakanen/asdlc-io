#!/usr/bin/env node

import { writeFileSync, readdirSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * Simple Frontmatter parser (replicated from content.ts)
 */
function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: markdown };
  }

  const yamlBlock = match[1];
  const content = match[2];
  const data = {};

  const lines = yamlBlock.split('\n');
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();

      if (value.startsWith('[') && value.endsWith(']')) {
        data[key] = value.slice(1, -1).split(',').map(s => s.trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1'));
      } else if (value.startsWith('"') && value.endsWith('"')) {
        data[key] = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        data[key] = value.slice(1, -1);
      } else {
        data[key] = value;
      }
    }
  }

  return { data, content };
}

const BASE_DIR = resolve('src/content');
const OUTPUT_FILE = resolve('src/mcp/articles.json');
const COLLECTIONS = ['concepts', 'patterns', 'practices'];

console.log('🔍 Generating MCP Article Index...');

const articles = [];

for (const collection of COLLECTIONS) {
  const fullPath = join(BASE_DIR, collection);
  if (!existsSync(fullPath)) continue;

  const files = readdirSync(fullPath);
  for (const file of files) {
    if (!file.endsWith('.md')) continue;

    const slug = file.replace(/\.md$/, '');
    const raw = readFileSync(join(fullPath, file), 'utf8');
    const { data, content } = parseFrontmatter(raw);

    if (data.status === 'Live' || data.status === 'Experimental') {
      articles.push({
        slug,
        collection,
        title: data.title || slug,
        description: data.description || '',
        status: data.status,
        content: content.trim(),
        tags: data.tags || []
      });
    }
  }
}

writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));
console.log(`✅ Successfully indexed ${articles.length} articles to ${OUTPUT_FILE}`);
