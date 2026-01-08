# PBI-52: Add References to MCP get_article Response

## Description

Update the MCP `get_article` tool to include structured references in its response payload for LLM consumption.

## Spec Reference

`plans/article-references/spec.md` — Integration Points: MCP Server section

## Acceptance Criteria

- [ ] `get_article` response includes `references` array when present
- [ ] Reference objects include all frontmatter fields (type, title, url, author, annotation, etc.)
- [ ] Empty array returned when article has no references
- [ ] MCP test updated to verify references in response

## Dependencies

- PBI-49 (Reference Schema)

## Technical Notes

Update `src/mcp/content.ts` to include references in article response.
