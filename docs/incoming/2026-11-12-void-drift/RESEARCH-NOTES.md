---
status: working-notes
created: 2026-11-12
generated:
  by: codex/gpt-6
---

# Initial evidence checks

Package entry: [incoming README](README.md). Continuation and coverage: [research programme](RESEARCH-PROGRAM.md). This is one assessor's preliminary extraction, not an independently challenged verdict. Assessor: Codex / gpt-6. Intake, extraction and synthesis roles were combined; no human endorsement or independent reviewer agreement is claimed. Shared inputs: imported chapters, selected incumbent pages, content spec/pattern archetype, academic pipeline, assess skill, lessons and recent ledger entries.

## VD-01: spec authority

**Incumbent extraction:** `src/content/patterns/the-spec.md`, Definition, lines 87–89 at the recorded checkout, calls ASDLC spec-anchored and preserves code authority for runtime logic. `src/pages/getting-started.md:25` and `src/content/patterns/agentic-double-diamond.md:23` call the spec primary source code; Double Diamond's Phase 3, line 75, equates spec writing with coding.

**Challenger extraction:** P-01/F-07 identify a literal-reading ambiguity and propose separating intent/contracts from executable runtime logic. They do not establish that the wording caused a historical project failure. The strongest alternative explanation is rhetorical emphasis rather than contradictory intended policy.

**External check:** Birgitta Böckeler, *Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl*, 15 October 2025, Definition: [original article](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html). Retrieved 2026-11-12. Its taxonomy distinguishes retaining specifications across maintenance from a workflow where humans edit specifications and never code. This is the author's practitioner taxonomy based on examining tools, not a controlled comparison or universal maturity standard. It supports the semantic distinction; it does not validate every anti-pattern assertion in the incumbent.

| Claim | Type | Evidence appraisal and limitation | Confidence | Candidate operation / wording |
|---|---|---|---|---|
| VD-01-C1: current local introductory wording admits a spec-as-source reading while detailed guidance explicitly rejects that operating model. | Descriptive/textual | Direct comparison of three passages; precise local baseline. Intended rhetorical meaning remains plausible. | High for textual tension; Insufficient for actual reader-confusion rate. | Revise narrowly. Draft for review: “The spec records agreed intent, constraints and observable contracts. Executable code determines runtime behavior; implementation discoveries feed back into the living spec.” |
| VD-01-C2: this clarification will improve outcomes or prevent failed inquiries. | Causal | No reader study or historical attribution; single-case observations cannot establish the effect. | Insufficient | Do not add this claim. Retain as a research question if needed. |

Risk: Low only for replacing the metaphor while preserving the existing position. No final verdict, graph edit or canonical report yet. Next: scan diagram text/captions and other uses of the metaphor; prepare an exact limited amendment and check that it neither promises automatic conformance nor reverses spec authority. No need to claim empirical benefit to make the wording coherent.

## VD-03: delivery tests and retained guards

**Incumbent extraction:** `src/content/concepts/theory-of-llm-constraints.md`, lines 131–142, says extra gates must address named risks and gives context-dependent examples. The postscript applies that reasoning inside a test suite. Full extraction of Context Gates, Feature Assembly and their load-bearing citations remains pending.

**Challenger extraction:** PS-F01 separates development verification, retained regression protection and review evidence. PS-P01 proposes judging continuing protection, marginal value and maintenance burden. Reported pruning counts describe a historical change; they do not measure long-term quality, escaped regressions or savings. Five original project sources were checked by the report's authors, not re-read in this session.

Primary practitioner sources retrieved 2026-11-12:

- Alex Eagle, *Change-Detector Tests Considered Harmful*, 27 January 2015, [Google Testing Blog](https://testing.googleblog.com/2015/01/testing-on-toilet-change-detector-tests.html): examples of tests mirroring implementation and causing maintenance work without checking behavioral correctness. Direct conceptual support for the duplicate-oracle concern; no controlled or longitudinal estimate of benefit.
- Andrew Trenk, *Test Behavior, Not Implementation*, 5 August 2013, [Google Testing Blog](https://testing.googleblog.com/2013/08/testing-on-toilet-test-behavior-not.html): favors tests stable across implementation changes, while explicitly allowing implementation checks when the property matters, such as cache use. Important boundary against mechanically removing all implementation-sensitive tests.

Both sources come from one institutional series. They are primary engineering advice, not two independent empirical replications.

| Claim | Type | Evidence appraisal and limitation | Confidence | Candidate operation / wording |
|---|---|---|---|---|
| VD-03-C1: implementation mirrors can impose maintenance without independent behavioral protection. | Mechanistic/recommendation | Direct illustrative examples in Eagle; Trenk supplies relevant exceptions. Fit is good for explaining the failure mode, indirect for agent-authored suites; no numerical precision or effect estimate. | Moderate for bounded advice. | Corroborate: “Review whether a retained test protects intended behavior or merely repeats the implementation; preserve implementation checks when the checked property is itself a requirement.” |
| VD-03-C2: a useful delivery probe is not automatically a justified permanent guard. | Operational recommendation | Report distinguishes these roles; testing essays support part of the maintenance rationale, not the entire retention lifecycle. Primary case-source recheck and independent challenge remain pending. | Low for a transferable retention rule on evidence currently checked. | Explore a labelled example separating purposes, without deletion quotas or automatic retirement. |
| VD-03-C3: the reported suite reduction improved defect risk, time or cost. | Causal/effectiveness | No longitudinal comparison; case report explicitly disclaims measured savings. | Insufficient | Exclude from proposed corpus wording. |

Next: seek primary empirical work on test maintenance and reduction/fault-detection trade-offs; inspect contrary evidence about documentation value, rare critical paths and integration properties. A test's origin or size is not its retention criterion. Do not prune any suite as part of this assessment.

## Search and selection record

Date: 2026-11-12. Questions: Does the incumbent's cited SDD taxonomy support the proposed semantic distinction? Is there primary practitioner support and a counter-boundary for the test-maintenance critique?

Method: targeted retrieval, not a systematic literature search. Opened exactly the three original URLs above through the web tool; all were accessible. Selected Böckeler because the incumbent cites that taxonomy; selected Eagle and Trenk for direct examples of the specific testing distinction. No search-engine query or database sweep has yet been run. No screened source was excluded or inaccessible in this small pass. Other source families in the programme are planned searches only. This selection is convenience-based and cannot establish consensus, exhaustive novelty, general effectiveness or current tool performance.

Local checks: compared the specified passages at the recorded ASDLC revision and verified the imported manifest. Historical public HTML captures and original Void Drift sources were not revalidated. No baseline was assumed to match deployment.

## Validation

`pnpm check` passed on 2026-11-12 (exit 0): Astro reported zero errors and two Server-deprecation hints; spec lint validated 28 specs with two advisory notices; content lint reported 149 documented legacy relationship defects. No tracked corpus changes were made. All 28 imported hashes still match; added package links and the diary handoff resolve. No content build or test run is implied by these research notes.

## VD-01 continuation

The [completed review packet](VD-01-REVIEW.md) supersedes the preliminary next-step instructions above. It includes exact proposed wording, source/citation findings, limitations and an unapplied patch. Approval remains pending.

VD-01 status update: approved and implemented on 2026-11-12; see the [canonical assessment](../../assessments/2026-11-12-void-drift-vd-01.md). Earlier pending-state language records the investigation chronology.
