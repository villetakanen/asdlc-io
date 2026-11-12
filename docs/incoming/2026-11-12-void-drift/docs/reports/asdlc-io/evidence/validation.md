# Assessment validation

Edition: 12 November 2026. This validates the report collection, not the software or the effectiveness of the factory.

## Source checks

The coordinator re-read the rebuild charter, current AGENTS instructions, runner completion logic, release check/publish functions, selected shared-rendering consumers, the retrospective correction record, derelict correction analysis, writing/closure record, recent G7 record and earlier unsent feedback draft. Material guidance comparisons were checked against direct captured page text, including The Spec, Experience Modeling, Double Diamond and relevant context/learning pages. Three historical run reports were inspected directly; hashes and selected fields are retained in [run-report-observations.json](run-report-observations.json). These checks supplement the extraction packets; they are not a complete source-by-source independent audit.

## Challenge passes and disposition

Three Luna High passes challenged reports 02–06. They are retained as review evidence, not treated as authoritative verdicts or silently rewritten after resolution.

| Challenge                                                                               | Disposition                                                                                                              |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [Gates](challenge-gates.md): publication wording could imply script-enforced permission | Clarified that procedure requires permission before invocation; code enforces bundle identity, not permission            |
| Gates: credit Experience Modeling's existing feedback/change route                      | Narrowed F-02/P-03 to inquiry evidence and approval examples; explicitly credited the existing route                     |
| Gates: P-01 points at the wrong Getting Started heading                                 | Corrected target to The Core Idea                                                                                        |
| Gates: broad Provenance alignment could imply unexamined agent identity mechanisms      | Narrowed the matrix to candidate/artifact provenance and explicitly left broader agent-identity provenance unestablished |
| Gates: retain conditional applicability across gate layers                              | Preserved the distinctions and added an explicit critic-PASS versus human-acceptance boundary                            |
| [Learning](challenge-learning.md): distinct planetary episodes were conflated by an ID  | Separated the planet-roles citation from the planet-purpose case                                                         |
| Learning: derelict case title implied causality                                         | Changed title to describe later comparisons and bounded decisions                                                        |
| Learning: E-G/C-G compound references obscured evidence identity                        | Replaced them with the actual C-G episode identifiers                                                                    |
| Learning: committed records could be confused with committed historical implementation  | Clarified the distinct record and source-state claims                                                                    |

The [design challenge](challenge-design.md) led to four refinements: textual tension/ambiguity replaces a stronger implication of contradictory intended authority; F-01 now refers to several sampled studies rather than implying a population frequency; P-02 is labelled a cross-case teaching composite with field-level source basis; and the button pilot's retrospective provenance is explicit. Remaining cautions concern transfer and causal limits already stated in the reports. No challenge found material project-remediation scope drift. These challenge records remain pre-correction snapshots; their quotations of old wording are not unresolved report findings.

## Final edition and shared-checkout boundary

At a closing source-status inspection, HEAD had advanced to `682fd13dfebec0e5b20bc4b4bda6053ba7ee25fa`. The intervening history contains `bb0aff01` (assessment collection) and `682fd13d` (pointer-loss regression fix), made outside this assessment's tool actions. Some intermediate report files were therefore committed by another session while this work continued. Final report edits include working changes and new files; no claim is made that those intermediate commits contain this completed edition.

An inspection of changes from the assessment baseline to that HEAD found no changes in `docs/loop-evidence/`, `docs/reviews/`, `docs/factory-building-lessons/`, `docs/specs/factory/` or `AGENTS.md`. A concurrent working change to `tests/browser/flight-deck.spec.ts` was observed and left untouched. The assessment retains its original source baseline; later unrelated code changes are not assessed here. A subsequent closing check observed `1a967f860e49280038af3d2efcaeaf6b652f97e7`, another concurrent pointer-loss verification commit that also saved report work. Its only additional change in the inspected authority/evidence families condenses three AGENTS learning/playtesting bullets into one; the substantive separation is preserved. This later wording is disclosed but excluded from the baseline assessment. No new loop, retrospective or factory-lesson records appeared in that comparison.

## Report checks

Local-link targets and linked Markdown heading fragments were checked across the collection and plan. JSON registers were parsed, and all report Markdown was checked for trailing whitespace and unresolved drafting markers. An initial marker scan also matched the old citation spelling quoted in the challenge/disposition records; the final scan distinguishes those historical examples from live report citations. Results are retained in [report-checks.json](report-checks.json).

`git diff --check` was also run for the assessment plan and report directory. The custom file checks include new/untracked files that a normal diff check would omit. External URLs were successfully captured for the source register; they were not re-fetched by the final local-link checker.

## Checks not performed

No build, unit/browser/backend test suite, verification runner, release preparation, deployment, live service check, benchmark, study replay or human playtesting was run for this assessment. No findings were promoted into standing rules. This assessment made no commit, push or external feedback; concurrent commits are described above. Software results cited in the reports are historical, bounded evidence.
