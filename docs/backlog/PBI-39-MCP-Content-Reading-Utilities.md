# PBI-39: MCP Content Reading Utilities

> Status: Ready

## Goal
Create utilities for reading and parsing ASDLC content files (concepts, patterns, practices) from the filesystem, with frontmatter extraction and status-based filtering.

## Context
The MCP server needs to read markdown files from `./src/content/{concepts,patterns,practices}/` and parse their YAML frontmatter. This module provides the data layer that tool implementations (PBI-40) use to fetch article content.

Critical requirement: Only articles with status `Live` or `Experimental` should be returned. Draft, Proposed, and Deprecated articles must be filtered out.

## Spec Reference
`/docs/specs/mcp-server/spec.md` - Sections: "Content Filtering (Critical)", "Article Schema", "Frontmatter Format"

## Requirements

### File Location
`/src/mcp/content.ts`

### Type Definitions
```typescript
type Category = "concepts" | "patterns" | "practices";
type AllowedStatus = "Live" | "Experimental";

interface ArticleMetadata {
  slug: string;
  category: Category;
  title: string;
  description: string;
  tags: string[];
  lastUpdated: string; // ISO 8601
  status: AllowedStatus;
  maturity?: string;
  relatedIds?: string[];
}

interface Article extends ArticleMetadata {
  content: string; // Markdown body
}
```

### Core Functions

```typescript
// Get all articles (metadata only, no content)
export async function listArticles(options?: {
  category?: Category;
  limit?: number;
}): Promise<ArticleMetadata[]>;

// Get single article with full content
export async function getArticle(slug: string): Promise<Article | null>;

// Search articles
export async function searchArticles(
  query: string,
  includeContent?: boolean
): Promise<(ArticleMetadata | Article)[]>;
```

### Frontmatter Parsing
```typescript
const FRONTMATTER_REGEX = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;

function parseFrontmatter(content: string): {
  metadata: Record<string, unknown>;
  body: string;
} {
  const match = content.match(FRONTMATTER_REGEX);
  if (!match) throw new Error("Invalid frontmatter");
  
  const yaml = parseYaml(match[1]); // Use Deno std library
  return { metadata: yaml, body: match[2] };
}
```

### Status Filtering (Critical)
```typescript
const ALLOWED_STATUSES: AllowedStatus[] = ["Live", "Experimental"];

function isExposed(status: string): status is AllowedStatus {
  return ALLOWED_STATUSES.includes(status as AllowedStatus);
}

// Apply filter when listing/searching
const articles = allArticles.filter(a => isExposed(a.status));
```

### File Discovery
```typescript
// Read all markdown files from content directories
async function discoverArticles(): Promise<Map<string, { path: string; category: Category }>> {
  const categories: Category[] = ["concepts", "patterns", "practices"];
  const articles = new Map();
  
  for (const category of categories) {
    const dir = `./src/content/${category}`;
    for await (const entry of Deno.readDir(dir)) {
      if (entry.isFile && entry.name.endsWith(".md")) {
        const slug = entry.name.replace(/\.md$/, "");
        articles.set(slug, { path: `${dir}/${entry.name}`, category });
      }
    }
  }
  
  return articles;
}
```

### Caching Strategy
```typescript
interface CacheEntry {
  metadata: ArticleMetadata;
  content: string;
  cachedAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function isCacheValid(entry: CacheEntry): boolean {
  return Date.now() - entry.cachedAt < CACHE_TTL;
}
```

### Error Handling
- Missing file: Return `null` from `getArticle`
- Malformed frontmatter: Log warning, skip article
- Missing required fields: Log warning, skip article
- Filesystem errors: Throw with descriptive message

## Acceptance Criteria
- [ ] File exists at `/src/mcp/content.ts`
- [ ] `listArticles()` returns all Live/Experimental articles
- [ ] `listArticles({ category: "patterns" })` filters by category
- [ ] `listArticles({ limit: 5 })` limits results
- [ ] `getArticle("context-engineering")` returns full article with content
- [ ] `getArticle("draft-article")` returns `null` (status filtering)
- [ ] `getArticle("nonexistent")` returns `null`
- [ ] `searchArticles("context")` finds matching articles
- [ ] Draft, Proposed, Deprecated articles are NEVER returned
- [ ] Results sorted by lastUpdated descending
- [ ] Uses Deno-compatible APIs only (no Node.js fs)
- [ ] YAML parsing uses `https://deno.land/std/yaml/`

## Testing
**Unit Tests:**
```typescript
// Test status filtering
const articles = await listArticles();
const statuses = articles.map(a => a.status);
expect(statuses).not.toContain("Draft");
expect(statuses).not.toContain("Proposed");
expect(statuses).not.toContain("Deprecated");

// Test category filter
const patterns = await listArticles({ category: "patterns" });
expect(patterns.every(a => a.category === "patterns")).toBe(true);

// Test get article
const article = await getArticle("context-engineering");
expect(article?.content).toContain("# "); // Has markdown content

// Test nonexistent article
const missing = await getArticle("does-not-exist");
expect(missing).toBeNull();
```

## Notes
- Edge Functions bundle files at deploy time; `Deno.readDir` works on bundled content
- Use `import.meta.url` for relative path resolution if needed
- The cache resets on each Edge Function cold start (deploy or inactivity)
- Tags in frontmatter are arrays, not comma-separated strings (unlike the blog)

## Dependencies
- None (data layer, no dependencies on other MCP PBIs)

## Blocked By
- None (can be developed first)

## Blocks
- PBI-40: MCP Tool Implementations (uses these utilities)

## Related
- Spec: `/docs/specs/mcp-server/spec.md`
- Content Schema: `/src/content/config.ts`
- Deno std/yaml: https://deno.land/std/yaml
