# ASDLC.io assessment through Void Drift

Status: completed assessment edition, 12 November 2026. Findings and documentation proposals are ready for substantive review; none are adopted policy.

This collection will assess ASDLC.io's agentic software development life cycle guidance through Void Drift and its design-led software factory. It covers the current factory and its documented evolution and decisions, producing evidence-backed findings and proposed documentation changes for later review at ASDLC.io.

Void Drift is the test subject. This work does not identify project improvement needs, propose project changes, or create a remediation backlog. It does not publish or send feedback externally.

**Overall finding:** Void Drift demonstrates substantial use of ASDLC's living contracts, shared definitions, executable verification and governed learning. The strongest evidence concerns concrete mechanisms and identified delivery states. The record does not establish that procedural amendments consistently improved design inquiry, or that the framework caused the observed outcomes.

The case is particularly useful for distinguishing inquiry from assembly, permission from integrity checks, adopted guidance from proven improvement, and a bounded design decision from integration or release. Those distinctions produce **eight findings and nine proposed documentation changes**. They include a directly observed tension between onboarding's spec-as-source metaphor and the detailed Spec pattern's spec-anchored position.

## Reading order

**Postscript, 12 November:** [Test retention and the KonMari work](07-postscript-test-retention.md) adds a previously undercovered distinction between checks used to deliver a change and regression guards worth maintaining. It supplies one supplementary finding and documentation proposal; the original eight findings and nine proposals remain unchanged.

| Report                                                   | Contents                                                                       |
| -------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [Method and sources](01-method-and-sources.md)           | Baselines, corpus coverage, sampling, evidence IDs and limitations             |
| [Factory and evolution](02-factory-and-evolution.md)     | How the project works, flow diagram, gate claims and dated evolution           |
| [Guidance assessment](03-guidance-assessment.md)         | Overall assessment and thematic comparison, including adaptations and unknowns |
| [Case studies](04-case-studies.md)                       | Ten episode narratives with outcomes and counterevidence                       |
| [Findings for ASDLC.io](05-findings-for-asdlc.md)        | Eight bounded findings, confidence and framework implications                  |
| [Documentation proposals](06-documentation-proposals.md) | Nine page-targeted proposals, examples and review questions                    |
| [Validation record](evidence/validation.md)              | Challenge-pass corrections, source checks and verification limits              |

Start with reports 02–03 for the assessment, then 05–06 for the framework-author discussion. Report 01 and the linked evidence packets support inspection of the claims.

## Edition boundary

Project baseline: `49336a6e5675da1b50b7179f3baaf28f6d3a7bb4`. Guidance: public pages captured on 12 November, displaying `v0.27.2` where labelled; no deployed source revision was established. The source register covers 86 public URLs, including 47 in-depth readings, and 69 loop records at metadata level; selected episodes receive deeper analysis. Later project work is outside this edition unless explicitly added in a subsequent review.

Luna High agents gathered bounded evidence and challenged the synthesis. The coordinator checked decisive sources and resolved report issues. No controlled efficacy comparison, model-cost analysis or new software verification was performed. A difference from a pattern is not automatically a defect, and a single, partly co-authored case cannot establish universal effectiveness. The [execution plan](../../plans/2026-11-12-asdlc-assessment.md) is retained as the work record.
