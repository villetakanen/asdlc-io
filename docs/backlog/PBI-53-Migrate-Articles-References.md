# PBI-53: Migrate Existing Articles to Structured References

## Description

Migrate all existing articles with `## References` markdown sections to use frontmatter `references` array, then remove the markdown sections.

## Spec Reference

`plans/article-references/spec.md` — Content Migration section

## Acceptance Criteria

- [ ] All articles with `## References` sections identified via grep
- [ ] Each reference migrated to frontmatter with appropriate `type`
- [ ] `accessed` date set for all website-type references
- [ ] Annotations written for each reference
- [ ] Markdown `## References` sections removed from article bodies
- [ ] `pnpm check` passes
- [ ] Build succeeds with no broken references

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
