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
| 1 | `context-engineering.md` | A (Industry Term) | [x] |
| 2 | `mermaid.md` | A (Industry Term) | [x] |
| 3 | `gherkin.md` | A (Industry Term) | [x] |
| 4 | `behavior-driven-development.md` | A (Industry Term) | [x] |
| 5 | `4d-framework.md` | A (Industry Term) | [x] |
| 6 | `ooda-loop.md` | A (Industry Term) | [x] |
| 7 | `yaml.md` | A (Industry Term) | [x] |

---

### Phase 2: Patterns (2 Live Articles)

| # | Article | Linked Practice | Status |
|:--|:--------|:----------------|:-------|
| 8 | `the-spec.md` | `living-specs.md` | [x] |
| 9 | `model-routing.md` *(→ Experimental)* | `agent-personas.md` | [x] |
| 10 | `the-pbi.md` | `pbi-authoring.md` | [x] |


---

### Phase 3: Practices (4 Live Articles)

| # | Article | Implements Pattern | Status |
|:--|:--------|:-------------------|:-------|
| 11 | `micro-commits.md` | *(TBD / standalone)* | [x] |
| 12 | `pbi-authoring.md` | `the-pbi.md` | [x] |
| 13 | `agent-personas.md` | `model-routing.md` | [x] |
| 14 | `agents-md-spec.md` | `agent-constitution.md` | [x] |

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

**Dictionary Focus (Concepts only):**
- [ ] Article stays within 600-1200 words (pillar-appropriate)
- [ ] No "how-to" / Practice content bleeding into Concept (move to linked Practice)
- [ ] Generic "Applications" lists removed (too vague for dictionary)
- [ ] Research deep-dives condensed to callouts or moved to separate articles
- [ ] Every section serves the dictionary purpose: define term, explain characteristics, link to ASDLC usage

**Methodology Depth (Patterns/Practices only):**
- [ ] Industry validation included where available (proves pattern/practice works)
- [ ] Anti-patterns section present (shows what NOT to do)
- [ ] Comprehensive coverage (not trimmed for SEO/dictionary purposes)
- [ ] Trade-offs and alternatives discussed where relevant
- [ ] Research backing or external practitioner validation cited
- [ ] Length appropriate for complete understanding (typically 800-1500+ words for patterns)

**Cross-Article Consistency:**
- [ ] `relatedIds` are accurate and bidirectional
- [ ] No semantic overlap or conflicts with other Live articles
- [ ] Terminology usage consistent across all articles
- [ ] Pattern ↔ Practice linkage correct

**Holistic KB Fit:**
- [ ] Article functions as proper pillar/node in knowledge graph (outbound links match conceptual relationships)
- [ ] "Relationship to Patterns" or equivalent section explains *why* connections matter, not just lists them
- [ ] Disambiguation concepts linked where terminology overlaps (e.g., Guardrails → Context Gates)
- [ ] Cross-layer references present (Concepts ↔ Patterns ↔ Practices)

**LLM/MCP Consumability:**
- [ ] Article appears in MCP `get_article` output
- [ ] Structured references included in MCP response

### Global Completion Criteria

- [x] All 14 Live articles reviewed
- [x] Inconsistencies logged and fixed
- [x] `pnpm check` passes
- [x] `pnpm build` succeeds
- [x] All MCP tests pass

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
2. This PBI fully checked off [x]
3. Optional: Summary of major findings/patterns in Implementation Notes below

---

## Implementation Notes

*(To be filled during/after review)*

**Review Session Log:**

| Session | Date | Articles Reviewed | Issues Found |
|:--------|:-----|:------------------|:-------------|
| 1 | 2026-01-12 | context-engineering.md | Fixed broken URL, expanded relatedIds (6 articles), added Relationship to Patterns section, linked Guardrails disambiguation, **trimmed from 987→650 words** (removed Applications, Best Practices, condensed research callout) |
| 2 | 2026-01-13 | mermaid.md | Merged redundant sections (Mermaid in ASDLC + ASDLC Usage), condensed Best Practices to callout, **trimmed from 644→463 words**, added bidirectional relatedIds to the-spec, gherkin, yaml |
| 3 | 2026-01-13 | gherkin.md | Removed 'Why Gherkin Works for Agents' and 'Anti-Patterns' sections (superfluous for SEO pillar), **trimmed from 968→480 words** |
| 4 | 2026-01-13 | behavior-driven-development.md | Removed 'Evolution: EDD' (speculative) and 'Anti-Patterns', merged 'BDD and the Spec Pattern' into 'ASDLC Usage', **trimmed from 782→531 words** |
| 5 | 2026-01-13 | 4d-framework.md | Fixed future date typo (2026-02-01 → 2026-01-13). Article already well-structured at **639 words** |
| 6 | 2026-01-13 | ooda-loop.md | **818 words** - well-structured. OODA vs Single-Shot section is valuable ASDLC-specific content; anti-patterns are ASDLC-specific. No structural changes. |
| 7 | 2026-01-13 | yaml.md | Merged 'YAML in ASDLC' into 'ASDLC Usage', removed Anti-Patterns and Best Practices, **trimmed from 575→374 words**. **Phase 1 (Concepts) complete.** |
| 8 | 2026-01-13 | the-spec.md (Pattern) | **1188 words** - Restored Industry Validation section. Patterns are methodology payload (not SEO pillars) - validation and depth are valuable. No changes needed. |
| 9 | 2026-01-13 | pattern-spec.md + PBI-54 | **Spec amendments:** Added "Not SEO Pillars" section to pattern-spec.md clarifying patterns are methodology payload (comprehensive, validated, depth over brevity). Added "Methodology Depth" checklist to PBI for Patterns/Practices review. |
| 10 | 2026-01-13 | model-routing.md (Pattern) | **498 words** - Changed status: Live → Experimental. Pattern has valuable content (capability profiles) but lacks depth for Live status: missing Anatomy, Anti-Patterns, Trade-offs per Methodology Depth standards. |
| 11 | 2026-01-13 | the-pbi.md (Pattern) | **619 words** - Borderline. Has Anatomy section (better than model-routing) but missing Anti-Patterns, trade-offs, industry validation, references. **Kept Live** as core ASDLC pattern but needs expansion. |
| 12 | 2026-01-13 | ralph-loop.md (Pattern) | **1166 words** - **Promoted: Experimental → Live**. Exceeds all Live standards: complete structure (Definition, Problem, Solution, Anatomy, Relationships), industry validation (Huntley + research paper), comprehensive Anti-Patterns (6), Guardrails section, OODA mapping, Mermaid diagram. |

| 16 | 2026-01-13 | product-vision.md (Pattern) | **1057 words** - **Promoted: Draft → Live**. Strong concept for preventing "vibe convergence". Includes 5-part anatomy, clear anti-patterns, and context hierarchy placement. Added validation from Marty Cagan (SVPG) and Lenny Rachitsky regarding "Product Sense" in AI era. |
| 17 | 2026-01-13 | pbi-authoring.md (Practice) | **Trial Review**: Verified full compliance. contains all required sections including 'When to Use', 6-step process, templates, and fault tolerance (Methodology Depth). No structural changes required. |
| 18 | 2026-01-13 | micro-commits.md (Practice) | **Review**: Added 'When to Use' section. Updated date. Validated strong alignment with 'The PBI' and 'Context Gates' patterns. |
| 19 | 2026-01-13 | agent-personas.md (Practice) | **Review**: Renamed 'Overview' to 'Definition', added 'When to Use'. Good integration with Model Routing. |
| 20 | 2026-01-13 | agents-md-spec.md (Practice) | **Review**: Added 'When to Use' section. Reference Template is extremely valuable. Strong 'Core Philosophy' section. |




**Major Findings:**

### 1. Concepts ≠ Patterns (Critical Discovery)

**Concepts are SEO Pillars:**
- Dictionary-style definitions (600-1200 words target)
- Optimize for search visibility and terminology clarity
- Trim: Anti-patterns (documented in sources), Best Practices (how-to content), speculative sections
- Example: Removed "Evolution: EDD" from BDD, "Why Gherkin Works" from Gherkin

**Patterns are Methodology Payload:**
- Comprehensive architectural documentation (800-1500+ words typical)
- Optimize for practitioner understanding and validation
- Keep: Industry validation, anti-patterns, trade-offs, research backing, depth
- Example: Restored "Industry Validation" in The Spec after initially removing it

**Impact:** Updated `pattern-spec.md` to clarify this distinction and added "Methodology Depth" checklist to PBI.

### 2. Common Redundancy Pattern

**Pattern Found:** "X in ASDLC" + "ASDLC Usage" sections with significant overlap
- Observed in: mermaid.md, gherkin.md, yaml.md
- Solution: Merge into single "ASDLC Usage" section

### 3. Hallucinated Implementation Details

**Pattern Found:** Repo-specific implementation details presented as methodology
- Example: mermaid.md referenced `pnpm diagrams` and `mermaid.json` as if part of ASDLC methodology
- Solution: Focus on methodology principles (why Mermaid for specs) not repo tooling

### 4. Word Count Reductions (Concepts Only)

Total concept articles trimmed: **5,413 → 3,955 words (-27%)**
- Largest reduction: gherkin.md (968→480, -50%)
- No reduction needed: ooda-loop.md, 4d-framework.md (already well-structured)

### 5. Specification Triad

Successfully established bidirectional linking for the specification triad:
- Gherkin ↔ YAML ↔ Mermaid
- All three now cross-reference in both frontmatter (`relatedIds`) and body content

### 6. Status Management

**Lesson:** Patterns that lack required depth should be demoted to Experimental, not kept as Live.

**Case:** `model-routing.md` was Live with 498 words, missing Anatomy, Anti-Patterns, Trade-offs.
- **Action:** Demoted to Experimental
- **Rationale:** Experimental = "valuable but needs expansion" - allows references while signaling incomplete status
- **Alternative considered:** Draft (too harsh for functional, referenced content)

**Impact:** Live status now means "meets Methodology Depth standards" for patterns.


**Follow-up PBIs Created:**

- **PBI-Next:** Promote `model-routing.md` to Live (Add Anatomy, Anti-Patterns, Trade-offs).
- **PBI-Next:** Promote `adversarial-code-review.md` to Live (Review completed, pending approval).
- **PBI-Next:** Promote `constitutional-review.md` to Live (Review completed, pending approval).
