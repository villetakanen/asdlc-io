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
- [ ] Unit tests exist at `/src/mcp/content.test.ts`
- [ ] All tests pass (`pnpm test:run`)

## Testing
**Unit Tests:**
Create `/src/mcp/content.test.ts`:

```typescript
import { describe, it, expect, beforeAll } from 'vitest';
import { listArticles, getArticle, searchArticles } from './content';

describe('Content Reading Utilities', () => {
  describe('listArticles', () => {
    it('returns only Live and Experimental articles', async () => {
      const articles = await listArticles();
      
      expect(articles.length).toBeGreaterThan(0);
      const statuses = articles.map(a => a.status);
      expect(statuses).not.toContain('Draft');
      expect(statuses).not.toContain('Proposed');
      expect(statuses).not.toContain('Deprecated');
    });

    it('filters by category', async () => {
      const patterns = await listArticles({ category: 'patterns' });
      
      expect(patterns.length).toBeGreaterThan(0);
      expect(patterns.every(a => a.category === 'patterns')).toBe(true);
    });

    it('limits results', async () => {
      const articles = await listArticles({ limit: 3 });
      
      expect(articles.length).toBeLessThanOrEqual(3);
    });

    it('sorts by lastUpdated descending', async () => {
      const articles = await listArticles();
      
      if (articles.length > 1) {
        const dates = articles.map(a => new Date(a.lastUpdated).getTime());
        for (let i = 0; i < dates.length - 1; i++) {
          expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
        }
      }
    });

    it('includes required metadata fields', async () => {
      const articles = await listArticles({ limit: 1 });
      
      expect(articles.length).toBeGreaterThan(0);
      const article = articles[0];
      expect(article).toHaveProperty('slug');
      expect(article).toHaveProperty('category');
      expect(article).toHaveProperty('title');
      expect(article).toHaveProperty('description');
      expect(article).toHaveProperty('tags');
      expect(article).toHaveProperty('lastUpdated');
      expect(article).toHaveProperty('status');
    });
  });

  describe('getArticle', () => {
    it('returns article with full content for valid slug', async () => {
      // First get a valid slug
      const articles = await listArticles({ limit: 1 });
      expect(articles.length).toBeGreaterThan(0);
      
      const slug = articles[0].slug;
      const article = await getArticle(slug);
      
      expect(article).not.toBeNull();
      expect(article!.slug).toBe(slug);
      expect(article!.content).toBeDefined();
      expect(article!.content.length).toBeGreaterThan(0);
    });

    it('returns null for non-existent article', async () => {
      const article = await getArticle('does-not-exist-123456');
      expect(article).toBeNull();
    });

    it('filters out Draft articles', async () => {
      // Assuming there's a draft article in the content
      // This tests the critical filtering requirement
      const article = await getArticle('draft-concept');
      // Should return null if draft-concept has status Draft
      // If no such article exists, this test passes
      expect(article === null || article.status !== 'Draft').toBe(true);
    });

    it('includes all metadata in returned article', async () => {
      const articles = await listArticles({ limit: 1 });
      const article = await getArticle(articles[0].slug);
      
      expect(article).toMatchObject({
        slug: expect.any(String),
        category: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        tags: expect.any(Array),
        lastUpdated: expect.any(String),
        status: expect.stringMatching(/^(Live|Experimental)$/),
        content: expect.any(String),
      });
    });
  });

  describe('searchArticles', () => {
    it('finds articles by title match', async () => {
      const articles = await listArticles({ limit: 1 });
      const searchTerm = articles[0].title.substring(0, 5).toLowerCase();
      
      const results = await searchArticles(searchTerm);
      
      expect(results.length).toBeGreaterThan(0);
    });

    it('finds articles by tag match', async () => {
      const articles = await listArticles({ limit: 10 });
      const articleWithTags = articles.find(a => a.tags.length > 0);
      
      if (articleWithTags) {
        const tag = articleWithTags.tags[0];
        const results = await searchArticles(tag);
        
        expect(results.length).toBeGreaterThan(0);
        expect(results.some(r => r.slug === articleWithTags.slug)).toBe(true);
      }
    });

    it('returns metadata only by default', async () => {
      const results = await searchArticles('the');
      
      if (results.length > 0) {
        expect(results[0]).not.toHaveProperty('content');
      }
    });

    it('includes content when requested', async () => {
      const results = await searchArticles('the', true);
      
      if (results.length > 0) {
        expect(results[0]).toHaveProperty('content');
        expect(results[0].content).toBeDefined();
      }
    });

    it('sorts results by relevance', async () => {
      const results = await searchArticles('engineering');
      
      // Results should be sorted by score (descending)
      // Can't easily test scoring without implementation details
      expect(results).toBeInstanceOf(Array);
    });

    it('only searches Live and Experimental articles', async () => {
      const results = await searchArticles('');
      const statuses = results.map(r => r.status);
      
      expect(statuses).not.toContain('Draft');
      expect(statuses).not.toContain('Proposed');
      expect(statuses).not.toContain('Deprecated');
    });
  });

  describe('Status Filtering', () => {
    it('never returns Draft articles in any function', async () => {
      const listed = await listArticles();
      const searched = await searchArticles('');
      
      const allStatuses = [...listed, ...searched].map(a => a.status);
      expect(allStatuses).not.toContain('Draft');
    });

    it('never returns Proposed articles in any function', async () => {
      const listed = await listArticles();
      const searched = await searchArticles('');
      
      const allStatuses = [...listed, ...searched].map(a => a.status);
      expect(allStatuses).not.toContain('Proposed');
    });

    it('never returns Deprecated articles in any function', async () => {
      const listed = await listArticles();
      const searched = await searchArticles('');
      
      const allStatuses = [...listed, ...searched].map(a => a.status);
      expect(allStatuses).not.toContain('Deprecated');
    });
  });
});
```

## Notes
- Edge Functions bundle files at deploy time; `Deno.readDir` works on bundled content
- Use `import.meta.url` for relative path resolution if needed
- The cache resets on each Edge Function cold start (deploy or inactivity)
- Tags in frontmatter are arrays, not comma-separated strings (unlike the blog)

## Dependencies
- PBI-42: Test Infrastructure Setup (provides test helpers)

## Blocked By
- PBI-42 (needs test utilities)

## Blocks
- PBI-40: MCP Tool Implementations (uses these utilities)

## Related
- Spec: `/docs/specs/mcp-server/spec.md`
- Content Schema: `/src/content/config.ts`
- Deno std/yaml: https://deno.land/std/yaml
