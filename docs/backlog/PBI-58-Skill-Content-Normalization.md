# PBI-58: Skill Content Normalization

## Directive
Implement the content transformation logic in `scripts/build-skill.ts`. This involves processing each included file to strip Astro-specific components, sanitize frontmatter, and critically, rewrite all internal links to be relative file system paths so they work offline.

**Scope:**
- `scripts/build-skill.ts`

## Dependencies
- Blocked by: PBI-57
- Must merge before: PBI-59

## Context
Ref: `plans/downloadable-skill/spec.md`

Currently, articles use Astro-style links (e.g., `[Link](/concepts/foo)`). These will break in a Markdown viewer or Agent context window that looks for local files. We must convert them to relative paths (e.g., `[Link](../concepts/foo.md)`).

**Transformations:**
1.  **Link Rewriting**: Convert absolute site paths to relative file paths.
2.  **Component Stripping**: Remove `<ArticleReferences />` or other Astro components that won't render in plain markdown.
3.  **Frontmatter**: Ensure useful metadata (status, description) is preserved or rendered as text at the top of the body.
4.  **Header/Footer**: Append a standard footer (e.g., "Source: ASDLC Knowledge Base (vX.X)") to every file.

## Verification
- [ ] Internal links in generated files target local `.md` files (e.g., `../patterns/the-spec.md`) instead of web routes.
- [ ] Non-standard HTML/components are removed or replaced with text representations.
- [ ] Files render cleanly in a standard Markdown previewer (e.g., VS Code Preview).
- [ ] Metadata is visible to the Agent/User reading the raw file.
