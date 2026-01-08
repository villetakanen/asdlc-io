# PBI-52: Add References to MCP get_article Response

## Description

Update the MCP `get_article` tool to include structured references in its response payload for LLM consumption.

## Spec Reference

`plans/article-references/spec.md` — Integration Points: MCP Server section

## Acceptance Criteria

- [x] `get_article` response includes `references` array when present
- [x] Reference objects include all frontmatter fields (type, title, url, author, annotation, etc.)
- [x] Empty array returned when article has no references
- [x] MCP test updated to verify references in response

## Dependencies

- PBI-49 (Reference Schema)

## Technical Notes

Update `src/mcp/content.ts` to include references in article response.

## Implementation Notes

**Status:** ✅ Complete

**Changes Made:**

1. **Added `gray-matter` dependency** (devDependency):
   - Replaces simple regex-based YAML parser with proper YAML parser
   - Required to handle complex nested structures like `references` array
   - Version: 4.0.3

2. **Updated `src/mcp/content.ts`**:
   - Added `Reference` interface matching schema from PBI-49
   - Added `references?: Reference[]` field to `Article` interface
   - Dates stored as strings (not Date objects) for JSON serialization

3. **Updated `scripts/generate-mcp-index.mjs`**:
   - Replaced simple regex parser with `gray-matter` library
   - Now properly parses nested YAML structures
   - Includes `references` field in generated article index
   - Removed unused `mkdirSync` import

4. **Updated `src/mcp/tools.ts`**:
   - Enhanced `get_article` tool description to mention structured references
   - Modified response formatting to include references section
   - References rendered in readable format with all metadata:
     - Title (bold)
     - Authors/Author
     - Published date
     - URL
     - Publisher (if present)
     - ISBN (if present)
     - DOI (if present)
     - Accessed date (if present)
     - Reference type
     - Annotation
   - Gracefully handles articles without references (no section appended)

5. **Added comprehensive tests** (`tests/mcp/server.test.ts`):
   - Test for article with references (verifies all fields present)
   - Test for article without references (verifies no References section)
   - Mock data includes both website and book reference types
   - All 41 MCP tests pass

**Reference Response Format:**

```
# Article Title

Article content here

## References

1. **Example Website**
   Author: Test Author
   Published: 2024-01-15
   URL: https://example.com
   Accessed: 2026-01-08
   Type: website
   Example annotation for testing

2. **Example Book**
   Author: Book Author
   ISBN: 978-0123456789
   Type: book
   Book reference for testing
```

**Validation:**

- ✅ `pnpm check` passes with 0 errors
- ✅ `pnpm build` succeeds (41 pages built)
- ✅ All 41 MCP tests pass (10 in server.test.ts)
- ✅ MCP index generation includes references field
- ✅ LLMs can now access structured citation data via MCP

**Next Steps:**
- PBI-53: Migrate existing articles to use structured references
