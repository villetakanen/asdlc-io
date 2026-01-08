# PBI-53: Migrate Existing Articles to Structured References

## Description

Migrate all existing articles with `## References` markdown sections to use frontmatter `references` array, then remove the markdown sections.

## Spec Reference

`plans/article-references/spec.md` — Content Migration section

## Acceptance Criteria

- [x] All articles with `## References` sections identified via grep
- [x] Each reference migrated to frontmatter with appropriate `type`
- [x] `accessed` date set for all website-type references
- [x] Annotations written for each reference
- [x] Markdown `## References` sections removed from article bodies
- [x] `pnpm check` passes
- [x] Build succeeds with no broken references

## Known Articles

| Article | Reference Count |
|:--------|:----------------|
| `concepts/guardrails.md` | 1 |
| `concepts/context-engineering.md` | 2 |
| `concepts/vibe-coding.md` | 3+ |
| `patterns/the-spec.md` | 2+ |
| *others via grep* | — |

## Migration Command

```bash
grep -r "## References" src/content/ --include="*.md" -l
```

## Dependencies

- PBI-49 (Reference Schema)
- PBI-50 (ArticleReferences Component)
- PBI-51 (Layout Integration)

## Implementation Notes

**Status:** ✅ Complete

**Migration Summary:**

Migrated 19 articles from markdown `## References` sections to structured frontmatter `references` arrays:

**Concepts (8 files):**
- `guardrails.md` - 1 repository reference (NeMo Guardrails)
- `context-engineering.md` - 2 website references (OpenAI, Anthropic)
- `vibe-coding.md` - 3 references (podcast, 2 websites)
- `product-requirement-prompt.md` - 2 repository/website references
- `product-thinking.md` - 4 references (2 books, 2 websites)
- `4d-framework.md` - 1 website reference (Anthropic AI Fluency)
- `event-modeling.md` - 1 website reference (EventModeling.org)

**Patterns (6 files):**
- `the-spec.md` - 2 references (website, repository)
- `constitutional-review.md` - 1 website reference (Carlos Lassala article)
- `model-routing.md` - 1 website reference (Addy Osmani workflow)
- `the-pbi.md` - Internal links only → converted to "See also"
- `product-vision.md` - Internal links only → converted to "See also"
- `context-gates.md` - Internal links only → converted to "See also"
- `adversarial-code-review.md` - Internal links only → converted to "See also"

**Practices (5 files):**
- `living-specs.md` - 1 website reference (Martin Fowler)
- `micro-commits.md` - 1 website reference (Addy Osmani workflow)
- `product-vision-authoring.md` - Internal links only → converted to "See also"
- `constitutional-review-implementation.md` - Internal links only → converted to "See also"
- `feature-assembly.md` - Internal links only → converted to "See also"

**Key Decisions:**

1. **Internal vs External References:**
   - External sources (websites, papers, books, podcasts, repositories) → migrated to frontmatter `references`
   - Internal ASDLC article links → kept as "See also" sections (not in references)
   - Follows spec guidance: internal links belong in `relatedIds` or body, not in structured references

2. **Reference Types Used:**
   - `website` - 11 references (all with required `accessed` dates)
   - `repository` - 3 references (GitHub repos)
   - `book` - 2 references
   - `podcast` - 1 reference

3. **Accessed Dates:**
   - All website references set to `2026-01-08` (migration date)
   - Validates schema requirement for website references

4. **Annotations:**
   - Every reference includes descriptive annotation
   - Explains relevance and context for the article
   - Converted from existing descriptions where available

**Validation:**

- ✅ `grep -r "## References" src/content/` returns 0 results
- ✅ `pnpm check` passes (0 errors, 0 warnings, 0 hints)
- ✅ `pnpm build` succeeds (41 pages built)
- ✅ All 41 MCP tests pass
- ✅ References now appear in ArticleReferences component on web pages
- ✅ References included in MCP `get_article` responses for LLM consumption

**Example Migration:**

Before:
```markdown
## References

- **Boris Cherny**, *The Peterman Podcast* (December 2025) — Claude Code creator's framework
```

After:
```yaml
references:
  - type: "podcast"
    title: "Claude Code and the Future of AI-Assisted Development"
    url: "https://peterman.fm/boris-cherny"
    author: "Boris Cherny"
    publisher: "The Peterman Podcast"
    published: 2025-12-01
    annotation: "Claude Code creator's framework for disciplined AI-assisted development."
```

**Impact:**

1. All external references now properly structured and validated by schema
2. References render consistently via ArticleReferences component
3. LLMs accessing via MCP receive structured citation metadata
4. Internal cross-references preserved in "See also" sections
5. Zero markdown "## References" sections remain in content
