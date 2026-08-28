---
source: "[Author / Institution], Title, Platform / Publisher, Date"
url: "[Source URL]"
reviewer: "[Canonical adjudicator: agent name and model]"
reviewer_profile:
  harnesses_used: ["[Harness/model]"]
  roles: "[Which roles were distinct or collapsed]"
  shared_inputs: ["[Incumbent, source, specs, lessons, etc.]"]
risk_class: "[Low | Moderate | High]"
confidence: "[High | Moderate | Low | Insufficient]"
sources_used:
  - "[Other models, drafts, or sources used]"
hitl_executioner: "[HITL User Name]"
assessment_date: "[YYYY-MM-DD]"
---

# Content Review: [Challenger Title / Concept Name]

## A. Intake and Executive Summary

- **Editorial question:** [Decision the evidence must inform]
- **Risk class and rationale:** [Low | Moderate | High; explain the route]
- **Review route:** [Primary only | primary plus challenge | independent assessments plus adjudication]
- **Assessment verdict:** [accepted | rejected | synthesized | disputed]
- **Editorial strategy:** [integrate | expand | combine | archive | log]
- **Evidence confidence:** [High | Moderate | Low | Insufficient, with rationale]
- **Assessment:** [Brief value-versus-risk summary]

## B. Critical Analysis

### Incumbent Patterns

| Article | Current position or graph role |
|---|---|
| `concepts/X` | [Brief description] |

### Challenger Input

[Thesis, evidence, assumptions, and limitations.]

### Truth Arbitration and Regression Risk

[How the challenger aligns or conflicts with incumbent guidance, including boundary conditions and falsifiability.]

### Claim–Evidence Ledger

| Claim ID | Claim | Type | Supporting or conflicting evidence | Appraisal | Confidence | Editorial operation |
|---|---|---|---|---|---|---|
| C1 | [Concise claim] | [definition | descriptive | causal | mechanistic | recommendation] | [Source and location] | [Method fit, directness, precision, etc.] | [High | Moderate | Low | Insufficient] | [retain | corroborate | bound | revise | supersede | split | reject] |

### Search and Selection Record

- **Required?:** [Yes | No; explain]
- **Question and date:** [Question; YYYY-MM-DD]
- **Sources searched and queries:** [Databases/sites, queries, and limits]
- **Selection:** [Inclusion/exclusion criteria; included/excluded or inaccessible material]
- **Limitations:** [Search and source-access limits]

## C. Disagreement and Human Decision

### Disagreement Record

| Reviewer or role | Position | Evidence or rationale | Adjudication response |
|---|---|---|---|
| [Reviewer] | [Position] | [Rationale] | [Accepted, narrowed, or escalated] |

State `None` when there was no independent disagreement; do not omit this section.

### Human Decision

- **HITL reviewer:** [Name]
- **Decision or override:** [Approved, rejected, narrowed, expanded, or disputed]
- **Rationale and feedback applied:** [Record material feedback and provenance]

## D. Knowledge Graph Impact and Action Plan

| # | Action | Path | Type |
|---|---|---|---|
| 1 | [Step description] | [Path] | [CREATE | INTEGRATE | LINK | LOG] |

## E. Draft Content (optional)

[For new content, provide a spec-aligned stub. For integrations, record the exact claim-calibrated amendments.]

## F. Canonical Ledger Entry

Only the canonical adjudicator appends this record after the HITL decision. Existing lines in `docs/assessments/ledger.jsonl` are immutable history.

```json
{"timestamp":"YYYY-MM-DDTHH:MM:SSZ","id":"YYYY-MM-DD-slug","challenger":"Source Title (Author)","risk_class":"[Low|Moderate|High]","confidence":"[High|Moderate|Low|Insufficient]","reviewer_profile":{"harnesses_used":["[Harness/model]"],"roles":"[distinct or collapsed]","shared_inputs":["[Input]"]},"initial_verdict":"[accepted|rejected|synthesized|disputed]","hitl_pivots":["[Pivot]"],"final_verdict":"[accepted|rejected|synthesized|disputed]","execution_status":"pending","execution_retro":"","lessons_learned":""}
```

## G. Reusable Learning

[Record a source-specific lesson. Propose a human-gated `docs/assessments/lessons.md` update only when the lesson is generalizable or recurring.]
