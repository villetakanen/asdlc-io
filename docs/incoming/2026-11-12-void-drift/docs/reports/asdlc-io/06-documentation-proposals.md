# Documentation proposals for ASDLC.io review

All proposals are **proposed, not adopted**. They target the framework documentation, not Void Drift. They have not been sent externally or applied to ASDLC.io. Ordering reflects review convenience and evidence strength, not a project implementation backlog. [Findings](05-findings-for-asdlc.md) provide contrary evidence and generalisation limits.

## P-01 — Reconcile the meaning of spec authority

**Targets:** [Getting Started](https://asdlc.io/getting-started/), “The Core Idea”; [Agentic Double Diamond](https://asdlc.io/patterns/agentic-double-diamond/), Definition and Phase 3; cross-reference [The Spec](https://asdlc.io/patterns/the-spec/), Definition. **Basis:** F-07, G-G01–03, G-D07.

**Reader problem:** A literal reading of source-code language conflicts with the explicit spec-anchored position on the detailed pattern page.

**Proposed wording, for review:** “The spec preserves agreed intent, architectural constraints and observable contracts. Executable code remains authoritative for runtime logic. Implementation may reveal a need to refine the spec; keep the two reconciled as the feature evolves.”

**Counterargument / validation:** The metaphor may be intended rhetorically. Preserve its emphasis on intent while testing whether a new reader can correctly distinguish spec-anchored from spec-as-source after reading only the introduction. This is a directly observed textual ambiguity if the metaphor is read literally, not proof of contradictory intended runtime authority or historical harm.

## P-02 — Add a design-inquiry example before the assembly example

**Targets:** [Agentic Double Diamond](https://asdlc.io/patterns/agentic-double-diamond/), Define/Spec transition; [Adversarial Requirement Review](https://asdlc.io/practices/adversarial-requirement-review/), workflow; cross-reference [Learning Loop](https://asdlc.io/concepts/learning-loop/). **Basis:** F-01, C-02–04/08.

**Reader problem:** An agent can satisfy the form of clarification or review without making the design question answerable.

**Proposed collateral:** An illustrative cross-case teaching composite, not a reconstructed single episode, with these fields:

| Field               | Illustrative synthesis and source basis                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Decision            | Which visual relation makes a state change distinguishable? Synthesis from C-02/04/08; not a verbatim recorded question. |
| Already settled     | Accepted artwork and shared ship rendering (C-04).                                                                       |
| Still uncertain     | Size/state distinctions (C-04); question/condition boundaries (C-02/08).                                                 |
| Evidence instrument | Comparable states with explicit scale and conditions (C-02/04).                                                          |
| Useful outcome      | A choice or recorded stop (C-02/04/08); rule-out is a proposed teaching outcome.                                         |
| Not established     | Integration or method efficacy remains separate (C-04/08).                                                               |

**Counterargument / validation:** Do not impose this form on routine technical work or suggest every question needs an elaborate study. Review with examples from another expressive domain and a straightforward engineering task to test when it helps. Do not prescribe more questioning when a concrete comparison is the missing evidence.

## P-03 — Extend Experience Modeling with creation and promotion boundaries

**Target:** [Experience Modeling](https://asdlc.io/patterns/experience-modeling/), The Experience Schema and Read-Only Enforcement. **Basis:** F-02, C-01/04/08.

**Reader problem:** The existing feedback/change route is explicit, but lacks a worked example of the inquiry evidence and approval criteria used to extend the shared vocabulary.

**Proposed addition:** Explain a governed route from provisional comparison → accepted properties → shared definition change → consumer integration. Include procedural drawing and behavior as well as buttons/tokens. Show that a component-private value can be deliberate without being a global token, and that exploration does not authorize bypassing existing approved definitions.

**Counterargument / validation:** A loose exploration exception could undermine the integrity boundary. Require the example to identify who can approve model changes, what remains provisional, and how temporary apparatus differs from reusable components. Validate the explanation against both a conventional UI library and a Canvas-based system; do not infer the case's topology is universally preferable.

## P-04 — Publish a claim-specific evidence envelope

**Targets:** [Context Gates](https://asdlc.io/patterns/context-gates/), Output Gates; [Provenance](https://asdlc.io/concepts/provenance/); [Feature Assembly](https://asdlc.io/practices/feature-assembly/), gate reporting. **Basis:** F-03, C-05/06.

**Reader problem:** A pass without identity and scope can be mistaken for broader correctness or release readiness.

**Proposed illustrative record** (a teaching example, not a new required schema):

```yaml
claim: selected_checks_passed
candidate:
  revision: <commit>
  working_tree: <clean-or-described-dirty-state>
  source_fingerprint: <hash>
scope:
  selected: [contracts, lint, types, unit]
  omitted: [build, browser, backend]
result:
  completion: completed
  source_unchanged: true
  full_verification: false
evidence:
  report: <run-specific-location>
  availability: retained-locally
  limits: <known-gaps>
```

Add a companion example for prepared, deployed and independently live-verified artifacts. Preserve earlier failures and label source mutation or unavailable checks explicitly.

**Counterargument / validation:** This can become a paperwork burden. Present a minimal core with risk-dependent extensions. Confirm that readers can identify which claims remain unsupported in partial, changed-source, timed-out and deployed-but-not-live-checked examples. Hashes must not be presented as evidence of test adequacy.

## P-05 — Make human authority and mechanical enforcement explicit

**Targets:** [Context Gates](https://asdlc.io/patterns/context-gates/), Acceptance and Denial Gates; [Levels of Autonomy](https://asdlc.io/concepts/levels-of-autonomy/); [Workflow as Code](https://asdlc.io/practices/workflow-as-code/). **Basis:** F-04, E-R02/04.

**Reader problem:** A generic human-acceptance step can conflate design direction, scope approval, permission to publish and evaluation of outcomes.

**Proposed table fields:** decision; responsible person/role; artifact/property covered; duration of authority; evidence of decision; procedural or mechanically enforced boundary. Show a case where design approval does not authorize integration or publication, where critic PASS is not human acceptance, and where an integrity check cannot grant permission.

**Counterargument / validation:** A role matrix can overcomplicate a small team. Use one compact example and explicitly allow roles to be combined. Avoid inventing mandatory repository evidence for activities a project deliberately keeps outside its process. Test the explanation against a solo designer and a multi-team setting.

## P-06 — Add a learning lifecycle with an explicit unvalidated state

**Targets:** [Compound Loop](https://asdlc.io/patterns/compound-loop/), human discrimination; [Agent Optimization Loop](https://asdlc.io/patterns/agent-optimization-loop/), offline evaluation. **Basis:** F-05, C-05/07/09.

**Reader problem:** Approval and implementation can be narrated as proof of improvement, even when no comparable subsequent trial exists.

**Proposed lifecycle:** retained observation → candidate interpretation with alternatives → reviewed decision → implemented guidance → evaluated outcome, with “not evaluated” permitted indefinitely. Record the evidence and scope at each transition. A closed loop may yield no lesson candidate; a rejected candidate can remain useful evidence.

**Counterargument / validation:** The pages already require governed learning and evaluation. Frame this as a practical example, not an additional universal gate or mandatory controlled experiment. Check whether readers can distinguish “adopted but untested,” “tested on one episode,” and “supported across comparable cases.”

## P-07 — Give delegated evidence extraction a source-fidelity contract

**Targets:** [External Attention](https://asdlc.io/patterns/external-attention/), Bounded Response Contract; [Model Routing](https://asdlc.io/patterns/model-routing/), calibration; [Adversarial Code Review](https://asdlc.io/practices/adversarial-code-review/), reporting. **Basis:** F-06, C-07–09.

**Reader problem:** A bounded summary may conceal mistaken facts, unsupported causes or a shifted objective.

**Proposed packet:** source identities and anchors; inspected/omitted scope; extracted observation; recorded interpretation and speaker; counterevidence; unknowns; answer confidence. A synthesis agent rechecks material claims against primary sources and preserves disagreements. Model tier and economic claims stay separate from fidelity evidence.

**Counterargument / validation:** Rich packets can defeat the purpose of compression. Keep a short result plus retrievable detail. Evaluate extraction accuracy and coordinator effort on a fixed corpus, including ambiguous and contradictory records, before claiming cost or quality benefits.

## P-08 — Link proportionality and maturity before prescribing the factory

**Targets:** [Getting Started](https://asdlc.io/getting-started/), quick guidance and gate hierarchy; [Feature Assembly](https://asdlc.io/practices/feature-assembly/), gate requirements; links to [Theory of LLM Constraints](https://asdlc.io/concepts/theory-of-llm-constraints/), [Living Specs](https://asdlc.io/practices/living-specs/), and the [Legend](https://asdlc.io/resources/legend/). **Basis:** F-07 and the assessment matrix.

**Reader problem:** Readers can treat a diagram, a draft recipe and a live practice as one mandatory installation checklist.

**Proposed addition:** Put task applicability and maturity beside examples; distinguish required checks for a chosen workflow from optional mechanisms. Add one mapping of functions to several possible artifacts: enduring contract, transient delta, decision rationale, evidence and procedure. Use this case to illustrate functional correspondence without prescribing its file layout or CI choice.

**Counterargument / validation:** Excessive qualifications can weaken a clear introduction. Keep the entry short and use links for detail. Ask readers to construct a minimal workflow for different risk contexts and explain each chosen gate. This case alone cannot establish the optimal scaffold.

## P-09 — Separate evidence retention from tool retention

**Targets:** [Context Offloading](https://asdlc.io/practices/context-offloading/), storage/retrieval; [Provenance](https://asdlc.io/concepts/provenance/); [Micro-Commits](https://asdlc.io/practices/micro-commits/), isolation. **Basis:** F-08, C-06/09/10.

**Proposed collateral:** A lifecycle table distinguishing temporary trajectories/logs, durable case records, reusable instruments, current specs and approved procedural guidance. Each row states identity, authority, retention purpose and conditions for replacement/retirement. Include a shared-tree example where the commit contains multiple sessions' changes and a closure record must not claim isolated authorship or verification.

**Counterargument / validation:** Some live instruments are the best enduring evidence. Preserve those with a continuing purpose; do not imply static capture is always sufficient. Check whether an independent reader can reconstruct the bounded claim after temporary artifacts expire. This is a proposed documentation test, not a new requirement for Void Drift.

## Review disposition

The proposals remain ready for substantive review. P-01 is supported directly by current guidance wording. P-02–09 use case evidence to propose examples, distinctions and cross-links whose transferability remains to be reviewed. Accepting this report does not adopt the proposals, require new experiments, authorize project changes, or authorize external publication.
