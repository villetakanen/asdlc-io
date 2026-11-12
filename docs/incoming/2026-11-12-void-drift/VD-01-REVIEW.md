---
status: approved-and-implemented
created: 2026-11-12
generated:
  by: codex/gpt-6
risk_class: Low
confidence: High
---

# VD-01: reconcile spec authority — review packet

Programme: [research programme](RESEARCH-PROGRAM.md). Earlier extraction: [research notes](RESEARCH-NOTES.md). Concrete amendment: [unapplied patch](VD-01-PROPOSED.patch).

## A. Intake and provisional conclusion

**Question:** Can Getting Started and Agentic Double Diamond state ASDLC's existing spec-anchored position without equating specifications with executable source?

**Provisional verdict:** synthesized. **Strategy:** integrate. **Operation:** revise introductory wording and repair its directly associated attribution. **Confidence:** High that the textual tension exists; no confidence claim about measured reader benefit. **Risk:** Low for this narrowly bounded editorial correction. Neither core policy nor the Spec article is changed. A reversal of spec-as-source policy would be a separate High-risk assessment.

Ville authorized starting this assessment, not implementing the recommendations. This packet is review-ready, not a canonical decision. The original P-01/F-07 input remains preserved in `docs/reports/asdlc-io/06-documentation-proposals.md` and `05-findings-for-asdlc.md`.

Reviewer profile: one Codex / gpt-6 assessor; intake, extraction and synthesis roles combined. No independent challenge was conducted for this Low-risk package. Shared inputs include AGENTS.md, assess skill, academic pipeline, content spec and Pattern archetype, assessment lessons/recent ledger, original feedback, core Agentic SDLC, Spec, Double Diamond, Getting Started and selected SDD context. Earlier coordinator conclusions were known. No model agreement is claimed.

## B. Separate extraction and appraisal

Baseline: ASDLC Git `76130cdc19ed0b33e6ad31c92d71674c51afbb84`; tracked tree unchanged on intake. Lines below identify that revision, not future line numbers.

**Incumbent:** The Spec, Definition (87–89), explicitly selects spec-anchored operation and retains executable-code authority for runtime logic. Its later living-hypotheses section (220 onward) provides for refinement during implementation. Getting Started's caption (25) and Double Diamond's introduction (23), Phase 3 heading (72) and paragraph (75) instead use source-code/coding metaphors. SDD's Definition distinguishes intended authority from implementation: keeping specs authoritative for intended behavior is compatible with code determining actual behavior.

**Challenger:** P-01 asks for consistent wording about intent, runtime logic and reconciliation. It offers no observation of reader-confusion rates and does not attribute Void Drift's failures to this language. This is a textual critique, not a new empirical finding about development effectiveness.

| ID | Claim/type | Evidence and strongest limitation | Appraisal / confidence | Operation and wording boundary |
|---|---|---|---|---|
| C1 | The introductory metaphor can be read as a different authority model from the detailed Spec position. Descriptive. | Exact passages above; P-01. Alternative: the language is purely rhetorical, with no intended contradiction. | Direct comparison, exact revision and locations; no sampling or causal inference. High for ambiguity, Insufficient for prevalence of reader confusion. | Revise: spec records intended contracts; executable code determines runtime behavior. Preserve spec authority over acceptance, not a claim that current behavior is always correct. |
| C2 | Spec-anchored and spec-as-source are distinct terms in the incumbent's cited taxonomy. Definition. | Böckeler, Definition, numbered items 2–3. This is a practitioner classification, not a universal standard or effectiveness ranking. | Direct primary terminology source; High for faithful attribution. | Corroborate terminology with a precise reference; do not claim research proves the preferred approach superior. |
| C3 | Refinement during implementation is already part of ASDLC's spec policy. Descriptive of framework. | The Spec, “Specs as Living Hypotheses”; SDD, “Iterative Refinement.” Reconciliation cannot guarantee correctness. | Direct local policy evidence; High for incumbent consistency. | Retain and make visible in Phase 3 and caption. Do not introduce new approval, gate or synchronization mechanisms. |
| C4 | The existing Codurance reference does not substantiate its “Spec is Code” annotation in the currently accessible source. Citation appraisal. | Reference points to company homepage; exact-title original article found and read. No specification doctrine located. Its page reports a later update than the original access date, so historical wording is unknown. | High for current citation inadequacy; Insufficient to claim the historical source never said it. | Replace that reference with Böckeler's directly relevant taxonomy. Do not reattribute the slogan or infer author intent. |
| C5 | This change prevents design failures or improves delivery outcomes. Causal. | No comparative reader study or project attribution. | Insufficient. | Reject from proposed wording; no such outcome claim is added. |

## C. Sources and search record

Checked 2026-11-12:

1. Birgitta Böckeler, *Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl*, 15 October 2025, [original article](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html). Definition supports the taxonomy. Its MDD discussion expresses concern about both spec-as-source and even spec-anchoring; it does not establish ASDLC's categorical anti-pattern judgment. This is counterevidence to overreading the citation, not grounds to reverse the policy in this pass.
2. Sandro Mancuso, *Software Craftsmanship in the AI Era*, Codurance, 9 February 2026; page reports updated 1 June 2026, [original article](https://www.codurance.com/publications/software-craftsmanship-in-the-ai-era). Practitioner essay about craftsmanship and AI-assisted engineering. No support located for the attributed specification slogan in the retrieved article. The [currently cited homepage](https://www.codurance.com/) is not a precise source for it.

Method: targeted primary-source retrieval plus searches `site:codurance.com "Software Craftsmanship in the AI Era"` and `site:codurance.com "spec" "source code"`. Included the exact-title original article and the already-cited taxonomy source. Excluded duplicate AMP, author/tag/index and related marketing pages as non-specific evidence. No inaccessible selected source; historical Codurance edition not recovered. No systematic literature review or claim of exhaustiveness.

Local scan: case-insensitive search under `src/` and `public/images/` for the source-code/coding phrases, plus XML extraction of the shared SVG's text. The relevant matches were the two pages and reference annotation. SVG labels are DISCOVER, DEFINE, SPEC, ASSEMBLE, RUN, with supporting labels about research, planning, context, generation, verification and operations. They do not equate spec and code; no SVG edit is needed. No rendered-image QA was performed or needed for the unapplied text proposal.

The source check is deliberately confined to citations bearing on this amendment. Other claims and references in the target pages have not been re-certified.

## D. Exact proposed scope

The patch changes two files only:

- `src/pages/getting-started.md`: replace the caption with the spec/implementation distinction and feedback into the living spec.
- `src/content/patterns/agentic-double-diamond.md`: replace its introductory metaphor, rename Phase 3 to “The Living Contract,” and replace the coding-equivalence paragraph with spec-anchored wording. Replace the unsupported Codurance attribution with the verified Böckeler reference and update `lastUpdated`.

Central wording:

> The Spec records agreed intent, architectural constraints, and observable contracts. Executable code determines runtime behavior.

The Phase 3 text states that the spec persists alongside implementation and is refined as implementation reveals new constraints. This preserves durable intent rather than treating observed code as the acceptance standard.

**Graph impact:** no new node, status change, URL, body link or `relatedIds` edge. Existing links to The Spec remain. A pre-existing one-way Double Diamond → Spec relationship was observed (no reverse Double Diamond edge in The Spec); this package does not introduce or repair it. No change to the shared SVG or Mermaid source. No Spec rewrite or blanket “source of truth” replacement: that phrase can legitimately describe intended contracts.

**Deferred observations:** the Spec's categorical anti-pattern language is stronger than the taxonomy source alone warrants; the classification is called a maturity ladder in its annotation. Reconsidering that position requires a separate assessment with broader evidence and independent review. Double Diamond's strict-conformance and performance claims are also outside this narrow correction. These are observations for later triage, not verified defects or new work authorization.

## E. Disagreement and decision

No independent disagreement record: one assessor only. The strongest alternative reading—rhetorical rather than literal equivalence—is preserved above. A wording repair can retain the useful metaphor's emphasis on durable intent without asserting historical harm.

**Human decision: pending.** Proposed approval scope is precisely the attached two-file patch. No final assessment, ledger entry, commit or publication exists. Once approved, record the decision, implement only that scope, and validate the changed article under the content contract. If approval expands into core policy, reroute the assessment by risk before implementation.

The governing assess skill requires: “STOP unconditionally before finalizing, publishing, or committing.” This stop applies to the next canonical/implementation step, not to completing the research and review packet.

## F. Validation

`git apply --check` passed; all 28 imported file hashes still match. `pnpm --dir tails/asdlc-io check` passed from the workspace root: zero Astro errors, two deprecation hints, 28 validated specs, two spec advisories and 149 documented legacy relationship defects. An invocation from the tail directory stalled before output and was stopped; the workspace-root invocation completed successfully. The tracked tree remains unchanged and the patch has not been applied. Schema/build validation of proposed article changes must occur after implementation; a baseline check is not proof of an unapplied patch's runtime validity.

## Decision and implementation addendum

Ville approved this exact packet on 2026-11-12. The attached patch was applied; check, read-only lint, 288 tests and build passed. The preceding review text preserves the pre-decision proposal. Current authority: [canonical assessment](../../assessments/2026-11-12-void-drift-vd-01.md). No commit or publication.
