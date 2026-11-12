# Coordinator source checks

Baseline: `49336a6e5675da1b50b7179f3baaf28f6d3a7bb4`. These entries supplement the extraction packets with primary-source checks. No product or verification command was executed.

## E-R01 — Explicit framework use, bounded historical authority

[Rebuild charter](../../../history/rebuild-charter.md), Purpose, Learning from the factory, References: the archived charter records the 28 October decision to use ASDLC patterns as design inputs and links Specs, Agent Constitution, Experience Modeling and Compound Loop. It says existing code cannot establish intended behavior. Its historical status is explicit. This supports deliberate engagement with the framework; it does not prove that every subsequent practice originated there.

## E-R02 — Present authority and context routes

[AGENTS.md](../../../../AGENTS.md), Read on demand, Working method, Authority, Evidence and learning: current instructions route context by task, preserve specs as intent, permit local work within scope, reserve publication and external feedback for explicit authorization, identify a shared checkout, and separate evidence from lesson promotion. The factory spec's earlier flow still mentions human experience review; the current instructions explicitly exclude people's playtesting from repository gates and evidence. This assessment uses the current boundary. It does not infer a missing-review defect.

## E-R03 — Runner semantics confirmed in code

[Verification runner](../../../../scripts/verify.mjs), lines 22–36, 75–90 and 130–146: nine full stages, four quick stages, explicit skipped list, source fingerprint before/after, quick never sets full `passed` true. The completion condition also checks process error and signal, not only exit status. This establishes mechanism at the baseline, not a fresh pass or universal adequacy.

## E-R04 — Release identity and authorization differ

[Release implementation](../../../../scripts/release.mjs), `checkRelease` and `publishRelease`, lines 198–255: artifact manifest comparison precedes deployment; the command deploys a checked copy and retains a separate publication result with `liveVerified: false`. Authorization appears as a calling convention/comment here, not a human-approval token enforced by this function. The assessment therefore distinguishes executable integrity checks from procedural authority; it does not claim publication permission is mechanically enforced by repository code.

## E-R05 — Shared systems with a bounded fixture

[FlightDeck](../../../../apps/web/src/components/FlightDeck.svelte), imports and simulation declaration, lines 1–68, uses shared Core and Mode A systems. [IonCannonFlight](../../../../apps/web/src/components/studies/IonCannonFlight.svelte), lines 1–69, imports shared `FxSurface`, `drawBuild` and `applyBuildEngines`, then constructs a controlled local motion fixture. This verifies a concrete shared-definition relationship while showing why a study instrument is not equivalent to the full production runtime. No visual or runtime check was performed here.

## E-R06 — Study method and technical validity have separate outcomes

[Planet-purpose record](../../../factory-experiment-planet-purpose-scope.md), Outcome and scope discussion, preserves an unsuccessful overall study alongside useful partial comparisons. [Derelict correction analysis](../../../factory-building-lessons/2026-11-06-derelict-correction-loop.md), What failed and Proposed constraint for the restart, explicitly says the existing skill already required concrete examples and that internal model causes cannot be established. This challenges a simplistic diagnosis that a repeated failure necessarily needs another instruction.

## E-R07 — Recent amendment is approved but unvalidated

[Writing/closure record](../../../loop-evidence/2026-11-11-design-study-writing-and-closure.md), Intent and decisions and Remaining scope and evidence limits: individual guidance amendments were approved, while migration of existing studies and a trial of the revised method were not performed. Its subagent editorial pass initially misclassified stopped work and was corrected. This supplies a concrete extraction-error example without establishing a model-wide failure rate.

## E-R08 — Retrospective interpretation was corrected

[Retrospective actions](../../../loop-evidence/2026-11-08-retro-and-actions.md), Designer's note and Findings: the designer corrected a guessed root cause from tooling to the scope of design questions. The record distinguishes agent ranking from designer findings and records CI removal as a decision. The claim that agents invented an uncommissioned process remains an attributed interpretation, not independently reconstructed authorization history.
