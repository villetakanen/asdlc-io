# PBI-54: Live Content Review — Single Pass

## Description

Execute a comprehensive **single-pass review** of all Live articles in the ASDLC Knowledge Base. Each article is reviewed against:

1. **The Article Spec** — Validates structural compliance (frontmatter, required sections, anti-patterns)
2. **All Other Live Articles** — Ensures consistency, cross-references, and no semantic overlap/conflicts

This is a systematic editorial sweep to bring all Live content to a consistent quality bar before promoting additional articles from Experimental/Draft.

## Spec References

- `plans/content-articles/concept-spec.md` — Concept article requirements
- `plans/content-articles/pattern-spec.md` — Pattern article requirements  
- `plans/content-articles/practice-spec.md` — Practice article requirements

## Review Order

Review follows the knowledge hierarchy (terminology → structure → execution):

### Phase 1: Concepts (7 Live Articles)

| # | Article | Archetype | Status |
|:--|:--------|:----------|:-------|
| 1 | `context-engineering.md` | A (Industry Term) | [ ] |
| 2 | `mermaid.md` | A (Industry Term) | [ ] |
| 3 | `gherkin.md` | A (Industry Term) | [ ] |
| 4 | `behavior-driven-development.md` | A (Industry Term) | [ ] |
| 5 | `4d-framework.md` | A (Industry Term) | [ ] |
| 6 | `ooda-loop.md` | A (Industry Term) | [ ] |
| 7 | `yaml.md` | A (Industry Term) | [ ] |

---

### Phase 2: Patterns (3 Live Articles)

| # | Article | Linked Practice | Status |
|:--|:--------|:----------------|:-------|
| 8 | `the-spec.md` | `living-specs.md` | [ ] |
| 9 | `model-routing.md` | `agent-personas.md` | [ ] |
| 10 | `the-pbi.md` | `pbi-authoring.md` | [ ] |

---

### Phase 3: Practices (4 Live Articles)

| # | Article | Implements Pattern | Status |
|:--|:--------|:-------------------|:-------|
| 11 | `micro-commits.md` | *(TBD / standalone)* | [ ] |
| 12 | `pbi-authoring.md` | `the-pbi.md` | [ ] |
| 13 | `agent-personas.md` | `model-routing.md` | [ ] |
| 14 | `agents-md-spec.md` | `agent-constitution.md` | [ ] |

## Acceptance Criteria

### Per-Article Review Checklist

For each article, verify:

**Structural Compliance:**
- [ ] Frontmatter complete and valid (title, description ≤200 chars, tags, relatedIds, lastUpdated, status)
- [ ] All required sections present for article type/archetype
- [ ] No H1 tags in markdown body (H2+ only)
- [ ] Length appropriate for article type
- [ ] References in frontmatter, not markdown body

**Content Quality:**
- [ ] Definition section answers the right question (What/How depending on type)
- [ ] Tone matches spec (authoritative/neutral for concepts, architectural for patterns, instructional for practices)
- [ ] No anti-patterns present (pattern-in-disguise, wall-of-text, orphaned definition, etc.)
- [ ] External references verified (no 404s)
- [ ] Mermaid diagrams generated if used

**Cross-Article Consistency:**
- [ ] `relatedIds` are accurate and bidirectional
- [ ] No semantic overlap or conflicts with other Live articles
- [ ] Terminology usage consistent across all articles
- [ ] Pattern ↔ Practice linkage correct

**LLM/MCP Consumability:**
- [ ] Article appears in MCP `get_article` output
- [ ] Structured references included in MCP response

### Global Completion Criteria

- [ ] All 14 Live articles reviewed
- [ ] Inconsistencies logged and fixed
- [ ] `pnpm check` passes
- [ ] `pnpm build` succeeds
- [ ] All MCP tests pass

## Review Process

### Per-Article Workflow

1. **Read the article** — Full text review from H1 to end
2. **Check against spec** — Verify all required sections, frontmatter, formatting
3. **Compare to other Live articles** — Look for:
   - Terminology conflicts (same term, different meaning)
   - Missing cross-references (should link but doesn't)
   - Redundant content (covered elsewhere)
   - Broken relatedIds (points to non-existent article)
4. **Fix issues** — Make edits directly
5. **Mark complete** — Check off in this PBI

### Cross-Reference Matrix

During review, build a mental model of the relationships:

```
CONCEPTS define terminology used in →
  PATTERNS (which describe structural solutions) implemented by →
    PRACTICES (which provide step-by-step execution)
```

Verify each layer references the layers above/below appropriately.

## Notes

**Why Single Pass?**
- Reduces context switching
- Builds holistic understanding of content relationships
- Catches inconsistencies that per-article reviews miss

**Review Triggers for Non-Live Articles:**
- If a Live article references a non-Live article, note it but don't expand scope
- Future PBI: Experimental → Live promotion pipeline

## Dependencies

None — this is an editorial review task.

## Estimation

- **Concepts:** ~30 min each (7 × 30 = ~3.5 hours)
- **Patterns:** ~45 min each (3 × 45 = ~2.25 hours)
- **Practices:** ~45 min each (4 × 45 = ~3 hours)
- **Total:** ~9 hours

## Deliverables

1. All 14 Live articles reviewed and updated
2. This PBI fully checked off
3. Optional: Summary of major findings/patterns in Implementation Notes below

---

## Implementation Notes

*(To be filled during/after review)*

**Review Session Log:**

| Session | Date | Articles Reviewed | Issues Found |
|:--------|:-----|:------------------|:-------------|
| 1 | — | — | — |

**Major Findings:**

*(Document systemic issues or patterns observed across multiple articles)*

**Follow-up PBIs Created:**

*(List any new PBIs spawned from this review)*
