# Postscript: delivery checks and lasting regression guards

Added 12 November 2026 after the designer highlighted the KonMari work. This supplements the original assessment; it does not propose changes to Void Drift or reopen its test suite.

## What the original assessment covered

The two KonMari skills and pruning records appeared in the source inventories. The assessment discussed proportional verification, maintenance costs and separate review captures, but did not directly assess these skills or the browser-pruning episode. The distinction below was therefore underdeveloped in the synthesis.

The five project sources read for this postscript match their bytes at the original assessment baseline, `49336a6e5675da1b50b7179f3baaf28f6d3a7bb4`. This is an extension of evidence selection, not incorporation of later product changes.

## Evidence

| ID | Source and passage | What it establishes |
| --- | --- | --- |
| E-K01 | [Unit-test KonMari](../../../.agents/skills/unit-test-konmari/SKILL.md), Keep, Remove, Three questions, Adding tests | Agents may write tests to verify development work; permanent retention is judged separately. Meaningful guards protect silent regressions in intended behavior. Mirrors, configuration pins and failures already exposed elsewhere are removal candidates. Maintenance includes edits induced by changes that fixed no bug. |
| E-K02 | [Browser-test KonMari](../../../.agents/skills/browser-test-konmari/SKILL.md), opening, Three questions, Method | A working implementation demonstration does not automatically justify a lasting test. Retention requires a significant otherwise-escaping problem, marginal protection beyond other guards, and a maintenance cost worth paying. Browser execution, a spec reference or a distinct route is insufficient by itself. |
| E-K03 | [Browser-pruning closure](../../loop-evidence/2026-11-11-browser-test-konmari.md), Intent, Delivered changes, Verification, Limits | The original inventory was reduced from 134 cases in 41 files to 21 guards in 15 files. The reported final run passed 23 cases, including two concurrently added cases outside that inventory. Product behavior and required gate categories were preserved. No longitudinal maintenance or token savings were measured. |
| E-K04 | [File-by-file review](../../reviews/2026-11-11-browser-test-konmari.md), Retained guards, Removed files, Separate suites | The review names protection retained and deliberate automation gaps. Save integrity, stuck-input prevention, modal isolation and Canvas-history invariants remain; many control tours, presentation pins and duplicate journeys are removed. Discarded demonstrations were not simply moved into unit or capture suites. |
| E-K05 | [Earlier pruning plan and outcome](../../plans/2026-11-03-test-suite-pruning.md), Implementation outcome, Regression-sensitivity evidence, Final verification | An earlier pass replaced arbitrary oracles and consolidated journeys; its recorded unit count changed only from 145 to 142 while test lines increased. Temporary defect probes tested retained sensitivity. This historical outcome section provides counterevidence to equating pruning with fewer lines or treating every development probe as permanent infrastructure. The plan's proposals are not current authority. |

These are inspected procedures and historical reports, not a fresh rerun or an independent reconstruction of every deleted test. E-K03 also records a failed full unit run and a passing focused rerun; the latter does not turn the former into a pass.

## PS-F01 — Test creation and test retention are different decisions

**Finding:** A test can help establish that an agent's current change behaves as intended without offering enough continuing regression protection to justify its maintenance. Conversely, a test written during implementation may also be an excellent lasting guard. Origin alone does not decide retention.

The case separates three purposes:

- **Development verification:** bounded checks and probes that inform the current implementation decision.
- **Regression protection:** retained tests that detect significant unintended failures which other checks would miss.
- **Review evidence:** captures or demonstrations that help inspect a result without becoming required correctness gates.

The primary economic distinction is maintenance—future edits, false alarms, attention and agent work—not simply test execution time. A test that restates today's configuration may demand repairs whenever intended behavior evolves while protecting little independent intent. The KonMari procedures make that trade-off explicit and preserve meaningful protection within mixed tests before removing surrounding demonstrations.

**Limits:** Confidence is high that this distinction is deliberately encoded and applied in the recorded browser review. Its long-term effect on defects, maintenance or costs is not measured. The designer's suggestion that agents created tests mainly to complete their immediate tasks is a plausible explanation, consistent with the skills' framing; individual agent motives were not reconstructed. Removal counts are outcomes, not proof of improved quality or a deletion target.

## PS-P01 — Document how tests earn continued retention

**Targets:** ASDLC.io's [Theory of LLM Constraints](https://asdlc.io/concepts/theory-of-llm-constraints/), proportional verification; [Context Gates](https://asdlc.io/patterns/context-gates/), quality gates; and [Feature Assembly](https://asdlc.io/practices/feature-assembly/), verification. These refer to the original captured guidance edition, especially G-G05/09/14.

The guidance already says additional gates should protect named risks and earn their place. This case supplies a more granular application: **a required test gate does not make every test inside it worth retaining**.

Proposed wording for review:

> Verification written while delivering a change and regression protection retained afterward serve different purposes. Retain a test when it protects a significant behavioral contract, adds protection beyond existing checks, and warrants its continuing maintenance. Preserve useful delivery evidence without automatically turning every demonstration into a permanent gate.

A worked example could contrast a test that pins a configured value with one that detects a saved preference failing to reach the actual runtime. Include explicit automation gaps and preserve product acceptance behavior when tests are removed. Do not prescribe removal quotas, require moving every discarded test to another suite, or imply that only previously observed bugs deserve guards.

This is an additional framework-documentation proposal, not adopted policy. It complements F-03, F-07 and P-04/P-08 in the main assessment. Validation beyond this case would need evidence about maintenance and escaped regressions over time, not just before/after suite size.
